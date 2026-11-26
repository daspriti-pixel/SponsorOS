import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { DataMode } from './types';
export type Row = Record<string, unknown>;
export const str = (r: Row, k: string) => String(r[k] ?? '');
export const num = (r: Row, k: string) => Number(r[k] ?? 0);
export const stages = ['prospecting','contacted','proposal_sent','negotiating','partner_confirmed','lost','withdrawn'];
export const qualifications = ['unreviewed','engaged','qualified','dormant','disqualified'];
export const label = (s: string) => s === 'partner_confirmed' ? 'Confirmed' : s === 'in_kind' ? 'In-kind' : s.replace(/_/g,' ').replace(/^./, c=>c.toUpperCase());
export function message(e: unknown) { return e instanceof Error ? e.message : typeof e === 'object' && e && 'message' in e ? String(e.message) : String(e); }
export async function sourceRows(table: string): Promise<Row[]> {
  const all: Row[] = [];
  for(let offset=0;;offset+=500) {
    const {data,error}=await supabase.rpc('sponsoros_source_rows',{p_table:table,p_limit:500,p_offset:offset});
    if(error) throw error;
    if(!Array.isArray(data)) throw new Error('Unexpected historical data response');
    all.push(...data as Row[]); if(data.length<500) return all;
  }
}
export async function liveRows(table: string): Promise<Row[]> {
  const all: Row[]=[];
  for(let offset=0;;offset+=500){
    const {data,error}=await supabase.from(table).select('*').order('id').range(offset,offset+499);
    if(error) throw error; all.push(...(data ?? []) as Row[]); if(!data || data.length<500) return all;
  }
}
function before(r:Row,key:string,day:string){const value=str(r,key); return !!value && Date.parse(value)<Date.parse(day+'T18:30:00Z');}
function latest(rows:Row[], key:string, day:string){
  const m=new Map<string,Row>();
  for(const r of rows.filter(r=>before(r,'effective_at',day))){const id=str(r,key), old=m.get(id); if(!old || Date.parse(str(r,'effective_at'))>Date.parse(str(old,'effective_at')) || (Date.parse(str(r,'effective_at'))===Date.parse(str(old,'effective_at')) && str(r,'history_id')>str(old,'history_id'))) m.set(id,r);}
  return m;
}
export interface Workspace { brands:Row[]; deals:Row[]; campaigns:Row[]; }
async function load(mode:DataMode, day:string):Promise<Workspace>{
  if(mode==='simulation'){
    const [brands,deals,campaigns]=await Promise.all(['sponsoros_brands','sponsoros_deals','sponsoros_campaigns'].map(liveRows));
    if(!brands||!deals||!campaigns) throw new Error('Incomplete workspace');
    return {brands,deals,campaigns};
  }
  const [b,q,o,h,c,contacts]=await Promise.all(['brands','brand_qualification','partner_opportunities','opportunity_history','sponsor_campaigns','sponsor_contacts'].map(sourceRows));
  if(!b||!q||!o||!h||!c||!contacts) throw new Error('Incomplete historical records');
  const qm=latest(q,'brand_id',day), hm=latest(h,'opportunity_id',day);
  const brands=b.filter(r=>before(r,'created_at',day)).map(r=>({...r,id:r['brand_id'],name:r['brand_name'],qualification:qm.get(str(r,'brand_id'))?.['qualification_status']??'unreviewed',reason:qm.get(str(r,'brand_id'))?.['reason'],contacts:contacts.filter(x=>str(x,'brand_id')===str(r,'brand_id')&&before(x,'created_at',day)).map(x=>str(x,'contact_name')).join(', ')}));
  const deals=o.filter(r=>before(r,'created_at',day)).map(r=>{const x=hm.get(str(r,'opportunity_id'));return {...r,...x,id:r['opportunity_id'],campaign_id:r['sponsor_campaign_id'],stage:x?.['stage']??'unknown',stage_changed_at:x?.['effective_at']};});
  const campaigns=c.filter(r=>before(r,'created_at',day)).map(r=>({...r,id:r['sponsor_campaign_id'],name:r['campaign_name']}));
  return {brands,deals,campaigns};
}
export function useLiveCRM(mode:DataMode,day:string){
  const [revision,setRevision]=useState(0); const key=mode+day+revision;
  const [result,setResult]=useState<{key:string; data?:Workspace; error?:string}>({key:''});
  useEffect(()=>{let active=true;load(mode,day).then(data=>{if(active)setResult({key,data});}).catch(e=>{if(active)setResult({key,error:message(e)});});return()=>{active=false;};},[mode,day,key]);
  const refresh=useCallback(()=>setRevision(n=>n+1),[]);
  return {data:result.key===key?result.data:undefined,error:result.key===key?result.error:undefined,refresh};
}
export async function saveRow(table:'sponsoros_brands'|'sponsoros_deals', id:string, payload:Row){
  const query=id ? supabase.from(table).update(payload).eq('id',id) : supabase.from(table).insert(payload);
  const {error}=await query.select('id').single(); if(error)throw error;
}
