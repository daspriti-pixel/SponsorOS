import { useEffect, useState } from 'react';
import { liveRows, sourceRows, type Row, message } from './live-crm';
import { supabase } from './supabase';
export const taskStatuses = ['todo','in_progress','completed'] as const;
export const taskPriorities = ['low','medium','high','urgent'] as const;
export interface TaskDraft { id:string; title:string; description:string; owner_name:string; due_date:string; priority:string; status:string; deal_id:string; campaign_id:string }
export function useRecords<T>(key:string, loader:()=>Promise<T>) {
 const [revision,setRevision]=useState(0);
 const requestKey=key+':'+revision;
 const [result,setResult]=useState<{key:string;data?:T;error?:string}>({key:''});
 useEffect(()=>{let active=true;loader().then(data=>{if(active)setResult({key:requestKey,data});}).catch(e=>{if(active)setResult({key:requestKey,error:message(e)});});return()=>{active=false};},[requestKey]);
 return {data:result.key===requestKey?result.data:undefined,error:result.key===requestKey?result.error:undefined,refresh:()=>setRevision(n=>n+1)};
}
export async function loadTasks(){const [tasks,brands,deals,campaigns]=await Promise.all([liveRows('sponsoros_tasks'),liveRows('sponsoros_brands'),liveRows('sponsoros_deals'),liveRows('sponsoros_campaigns')]);return {tasks,brands,deals,campaigns};}
export async function saveTask(d:TaskDraft){if(!d.title.trim())throw new Error('Title is required');const payload={title:d.title.trim(),description:d.description.trim()||null,owner_name:d.owner_name.trim()||null,due_date:d.due_date||null,priority:d.priority,status:d.status,deal_id:d.deal_id||null,campaign_id:d.campaign_id||null}; const q=d.id?supabase.from('sponsoros_tasks').update(payload).eq('id',d.id):supabase.from('sponsoros_tasks').insert({...payload,origin:'manual'});const {error}=await q.select('id').single();if(error)throw error;}
export async function changeTaskStatus(id:string,status:string){const {error}=await supabase.from('sponsoros_tasks').update({status}).eq('id',id).select('id').single();if(error)throw error;}
export const historicalTables = ['event','targets','brands','sponsor_contacts','sponsor_campaigns','sponsor_interactions','brand_qualification','partner_opportunities','opportunity_history','sponsor_activations'] as const;
export const simulationTables = ['brands','campaigns','deals','payments','payment_schedules','tasks','experiments','scenarios'] as const;
export async function explorerRows(historical:boolean,table:string):Promise<Row[]>{const allowed:readonly string[]=historical?historicalTables:simulationTables;if(!allowed.includes(table))throw new Error('Unsupported table');const rows=await (historical?sourceRows(table):liveRows('sponsoros_'+table));return rows.map(({user_id:_,...r})=>r);}
