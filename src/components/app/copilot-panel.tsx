import { useEffect, useRef, useState } from 'react';
import { Bot, Check, Send, Sparkles, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/lib/app-context';
import { useAuth } from '@/lib/auth';
import { askCopilot, confirmCopilotTask, SUGGESTED_QUESTIONS, type CopilotMessage, type TaskProposal } from '@/lib/copilot-service';
import { ToneBadge } from './shared';
import { toast } from 'sonner';
import type { DataMode } from '@/lib/types';

export function CopilotPanel(){
 const {copilotOpen,setCopilotOpen,mode,asOf}=useApp();
 const {session}=useAuth();
 return <Sheet open={copilotOpen} onOpenChange={setCopilotOpen}><SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"><SheetHeader className="border-b px-4 py-3"><SheetTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary"/> AI Copilot <ToneBadge tone="info">{mode==='historical'?'Historical':'Simulation'}</ToneBadge></SheetTitle><SheetDescription className="text-xs">Database-grounded assistance · {asOf}. {mode==='historical'?'Read-only historical records.':'Simulated records; task creation requires approval.'}</SheetDescription></SheetHeader><Conversation key={`${session.user.id}:${mode}:${asOf}`} mode={mode} asOf={asOf}/></SheetContent></Sheet>;
}
// Only render basic formatting as React text nodes; no HTML or external links are executed.
function AnswerText({text}:{text:string}) {
  const inline=(line:string)=>line.split(/(\*\*[^*]+\*\*)/g).map((part,i)=>part.startsWith('**')&&part.endsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:part);
  return <div className="space-y-1.5 break-words leading-relaxed">{text.split('\n').map((line,i)=>{
    if(!line.trim()) return <div key={i} className="h-1"/>;
    if(/^#{1,6}\s/.test(line)) return <p key={i} className="font-semibold">{inline(line.replace(/^#{1,6}\s+/,''))}</p>;
    if(/^\s*[-*]\s+/.test(line)) return <div key={i} className="flex gap-2"><span aria-hidden="true">•</span><span className="min-w-0">{inline(line.replace(/^\s*[-*]\s+/,''))}</span></div>;
    return <p key={i} className="whitespace-pre-wrap">{inline(line)}</p>;
  })}</div>;
}
function Conversation({mode,asOf}:{mode:DataMode;asOf:string}){
 const [messages,setMessages]=useState<CopilotMessage[]>([]); const [input,setInput]=useState(''); const [busy,setBusy]=useState(false); const [saving,setSaving]=useState(false); const [error,setError]=useState(''); const lock=useRef(false); const counter=useRef(0); const nextId=()=>String(++counter.current);
 async function send(q:string){const text=q.trim(); if(!text||text.length>4000||lock.current)return; lock.current=true;setBusy(true);setError('');setInput('');setMessages(m=>[...m,{id:nextId(),role:'user',content:text}]);try{const result=await askCopilot(text,mode,asOf,messages);setMessages(m=>[...m,{id:nextId(),role:'assistant',...result,state:result.task?'pending':undefined}]);}catch(e){setError(e instanceof Error?e.message:'AI request failed');setInput(text);}finally{lock.current=false;setBusy(false);}}
 function mark(id:string,state:CopilotMessage['state']){setMessages(m=>m.map(x=>x.id===id?{...x,state}:x));}
 async function confirm(id:string,task:TaskProposal){if(mode!=='simulation'||lock.current)return;lock.current=true;setSaving(true);setError('');try{await confirmCopilotTask(task);mark(id,'saved');toast.success('Task saved. Refresh Task Manager to view it.');}catch(e){mark(id,'uncertain');setError(`${e instanceof Error?e.message:'Task save failed'}. Check Task Manager before trying again to avoid duplicate tasks.`);}finally{lock.current=false;setSaving(false);}}
 const endRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{endRef.current?.scrollIntoView({block:"nearest"});},[messages,busy,error]);
 const disabled=busy||saving;
 return <><ScrollArea className="min-h-0 flex-1"><div className="space-y-4 p-4"><p className="text-xs text-muted-foreground">Answers use the selected database context. AI recommendations may be imperfect; review them before acting. Changing the mode or date starts a new conversation.</p>
 {messages.length===0&&<div className="space-y-2">{[...SUGGESTED_QUESTIONS,...(mode==='simulation'?['Analyze overdue payments and propose one follow-up task.']:[])].map(q=><button key={q} disabled={disabled} onClick={()=>void send(q)} className="block w-full rounded-md border p-2 text-left text-sm hover:bg-muted disabled:opacity-50">{q}</button>)}</div>}
 {messages.map(m=><div key={m.id} className={m.role==='user'?'ml-8 rounded-lg bg-primary p-3 text-sm text-primary-foreground':'mr-3 space-y-3 rounded-lg border bg-muted/30 p-3 text-sm'}>{m.role==='assistant'&&<div className="flex items-center gap-2 text-xs text-muted-foreground"><Bot className="h-4 w-4"/> {m.model||'AI Copilot'} · database context</div>}{m.role==='assistant'?<AnswerText text={m.content}/>:<div className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</div>}{m.task&&<section className="space-y-2 rounded-md border border-primary/30 bg-background p-3"><div className="font-semibold">Proposed task · {m.state==='pending'?'Awaiting approval':m.state==='saved'?'Saved':m.state==='uncertain'?'Check Task Manager':'Dismissed'}</div><div className="font-medium">{m.task.title}</div><p className="whitespace-pre-wrap text-xs">{m.task.description||'No description'}</p><p className="text-xs text-muted-foreground">Owner: {m.task.owner_name||'Unassigned'} · Due: {m.task.due_date||'Not set'} · Priority: {m.task.priority}</p>{m.state==='pending'&&mode==='simulation'&&<><p className="text-xs">Confirm to save this exact task to Supabase. No deal or payment will be modified.</p><div className="flex flex-wrap gap-2"><Button size="sm" disabled={disabled} onClick={()=>void confirm(m.id,m.task!)}><Check className="h-4 w-4"/> {saving?'Saving…':'Confirm task'}</Button><Button size="sm" variant="outline" disabled={disabled} onClick={()=>mark(m.id,'dismissed')}><X className="h-4 w-4"/> Dismiss</Button></div></>}</section>}</div>)}
 {busy&&<p role="status" className="text-sm text-muted-foreground">Analyzing database context…</p>}{error&&<p role="alert" className="rounded-md border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}
 <div ref={endRef}/></div></ScrollArea><form className="flex items-end gap-2 border-t p-3" onSubmit={e=>{e.preventDefault();void send(input);}}><Textarea aria-label="Ask AI Copilot" value={input} maxLength={4000} disabled={disabled} onChange={e=>setInput(e.target.value)} placeholder="Ask about sponsors, deals or collections…" rows={2} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void send(input);}}}/><Button type="submit" size="icon" disabled={disabled||!input.trim()} aria-label="Send"><Send className="h-4 w-4"/></Button></form></>;
}
