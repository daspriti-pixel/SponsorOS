import { supabase } from './supabase';
import type { DataMode } from './types';
export type TaskProposal = { title:string; description:string|null; owner_name:string|null; due_date:string|null; priority:'low'|'medium'|'high'|'urgent' };
export type CopilotMessage = { id:string; role:'user'|'assistant'; content:string; model?: string | undefined; task?: TaskProposal | undefined; state?: "pending" | "saved" | "dismissed" | "uncertain" | undefined; };
export const SUGGESTED_QUESTIONS = ['Which sponsorship campaign performs best?', 'What is preventing us from achieving our target?', 'Which deals require immediate follow-up?', 'How can we improve cash collection?'];
export async function askCopilot(question:string,mode:DataMode,asOf:string,history:CopilotMessage[]) {
 const {data:sessionData,error:sessionError}=await supabase.auth.getSession();
 if(sessionError||!sessionData.session) throw new Error('Your session has expired. Please sign in again.');
 const {data,error}=await supabase.functions.invoke('sponsor-copilot',{headers:{Authorization:`Bearer ${sessionData.session.access_token}`},body:{question,mode,asOf,history:history.slice(-4).map(({role,content})=>({role,content:content.slice(0,4000)}))}});
 if(error){let detail='';const context=(error as {context?:unknown}).context; if(context instanceof Response){try {const body=await context.clone().json(); if(typeof body.error==='string')detail=body.error; if(typeof body.providerStatus==='number')detail+=` (provider ${body.providerStatus})`; }catch{/* no JSON */}} throw new Error(detail||error.message||'AI request failed');}
 if(!data||typeof data.answer!=='string'||!data.answer.trim()||data.dataGrounded!==true||data.mode!==mode||data.asOf!==asOf)throw new Error('Unexpected AI response. No action has been taken.');
 if(data.answer.trim().startsWith('{'))throw new Error('The AI returned an incomplete structured answer. No action has been taken.');
 const p=data.proposedTask; let task:TaskProposal|undefined;
 if(mode==='simulation'&&p&&p.requiresConfirmation===true&&typeof p.title==='string'&&p.title.trim()&&p.title.length<=200&&['low','medium','high','urgent'].includes(p.priority)){
 const date=typeof p.due_date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(p.due_date)&&Number.isFinite(Date.parse(p.due_date))&&new Date(p.due_date).toISOString().slice(0,10)===p.due_date?p.due_date:null;
 task={title:p.title,description:typeof p.description==='string'?p.description.slice(0,2000):null,owner_name:typeof p.owner_name==='string'?p.owner_name.slice(0,100):null,due_date:date,priority:p.priority};}
 return {content:data.answer as string,model:typeof data.model==='string'?data.model:undefined,task};
}
export async function confirmCopilotTask(task:TaskProposal){
 const {error}=await supabase.rpc('sponsoros_create_ai_task',{p_title:task.title,p_description:task.description,p_owner_name:task.owner_name,p_due_date:task.due_date,p_priority:task.priority,p_deal_id:null,p_campaign_id:null});
 if(error)throw new Error(error.message);
}
