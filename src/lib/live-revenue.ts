import { supabase } from './supabase';
import { liveRows, num, str, type Row } from './live-crm';
import type { DataMode } from './types';

export type CashDeal = { id:string; sponsor:string; owner:string; campaign:string; confirmed:number; received:number; outstanding:number; overdue:number; dueDate:string; status:string; reserved:number; schedules:Row[] };
export type RevenueData = { metrics:Row; deals:CashDeal[]; receipts:Row[] };
const sum = (rows:Row[]) => rows.reduce((v,r)=>v+num(r,'amount_inr'),0);
const byDeal=(rows:Row[],id:string)=>rows.filter(r=>str(r,'deal_id')===id);
const cutoff=(day:string)=>Date.parse(day+'T18:30:00Z');
export async function loadRevenue(mode:DataMode, day:string):Promise<RevenueData>{
  const result=await supabase.rpc(mode==='historical'?'sponsoros_snapshot':'sponsoros_simulation_metrics',{p_date:day});
  if(result.error) throw result.error;
  if(!result.data || typeof result.data!=='object' || Array.isArray(result.data)) throw new Error('Unexpected metrics response');
  const metrics=result.data as Row;
  if(mode==='historical')return {metrics,deals:[],receipts:[]};
  const [deals,brands,campaigns,payments,schedules]=await Promise.all([
    liveRows('sponsoros_deals'),
    liveRows('sponsoros_brands'),
    liveRows('sponsoros_campaigns'),
    liveRows('sponsoros_payments'),
    liveRows('sponsoros_payment_schedules'),
  ] as const);
  const receipts=payments.filter(p=>Date.parse(str(p,'received_at'))<cutoff(day));
  const cash=deals.filter(d=>str(d,'stage')==='partner_confirmed'&&str(d,'support_type')==='cash').map(d=>{
    const id=str(d,'id'), confirmed=num(d,'confirmed_value_inr');
    const received=sum(byDeal(receipts,id).filter(p=>p['verified']===true));
    const reserved=sum(byDeal(payments,id));
    const schedule=byDeal(schedules,id).sort((a,b)=>str(a,'due_date').localeCompare(str(b,'due_date')));
    const outstanding=Math.max(confirmed-received,0);
    const overdue=Math.max(Math.min(sum(schedule.filter(s=>str(s,'due_date')<day)),confirmed)-received,0);
    let cumulative=0; const first=schedule.find(s=>{cumulative+=num(s,'amount_inr');return Math.min(cumulative,confirmed)>received;});
    return {id,sponsor:str(brands.find(b=>str(b,'id')===str(d,'brand_id'))??{},'name')||'Unknown sponsor',owner:str(d,'owner_name')||'Unassigned',campaign:str(campaigns.find(c=>str(c,'id')===str(d,'campaign_id'))??{},'name')||'Unassigned',confirmed,received,reserved,outstanding,overdue,dueDate:first?str(first,'due_date'):'',status:outstanding===0?'Paid':overdue>0?'Overdue':received>0?'Partial':'Pending',schedules:schedule};
  });
  for(const [key,field] of [['confirmed_cash_value_inr','confirmed'],['cash_collected_inr','received'],['outstanding_inr','outstanding'],['overdue_inr','overdue']] as const){
    if(Math.abs(num(metrics,key)-cash.reduce((s,d)=>s+d[field],0))>0.01)throw new Error('Revenue changed while loading. Refresh to reconcile the totals.');
  }
  return {metrics,deals:cash,receipts};
}
export async function recordReceipt(id:string,amount:number,date:string,asOf:string,verified:boolean){
  if(!Number.isFinite(amount)||amount<=0||Math.abs(amount*100-Math.round(amount*100))>0.00001)throw new Error('Enter a positive amount with at most two decimal places.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||date>asOf)throw new Error('Choose a valid receipt date on or before the reporting date.');
  const {data:deal,error}=await supabase.from('sponsoros_deals').select('id,stage,support_type,confirmed_value_inr').eq('id',id).single();
  if(error)throw error;
  if(!deal||deal.stage!=='partner_confirmed'||deal.support_type!=='cash')throw new Error('Only confirmed cash deals accept receipts.');
  const existing=(await liveRows('sponsoros_payments')).filter(p=>str(p,'deal_id')===id);
  if(amount>Number(deal.confirmed_value_inr)-sum(existing)+0.000001)throw new Error('Amount exceeds the remaining commitment after all recorded receipts (including unverified and future-dated records).');
  const {error:writeError}=await supabase.from('sponsoros_payments').insert({deal_id:id,amount_inr:amount,received_at:date+'T12:00:00+05:30',verified});
  if(writeError)throw writeError;
}
