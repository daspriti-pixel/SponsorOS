import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { KpiCard, PageHeader, Panel, LoadingState, ToneBadge } from "@/components/app/shared";
import { useApp } from "@/lib/app-context";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { formatLakh, formatNum, formatPct } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Growth Command Center — SponsorOS" },
      { name: "description", content: "Monitor sponsorship performance, revenue opportunities and collections for your festival." },
      { property: "og:title", content: "Growth Command Center — SponsorOS" },
      { property: "og:description", content: "Monitor sponsorship performance, revenue opportunities and collections for your festival." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommandCenter,
});

type Historical = { brands:number; outbound_brands:number; responding_brands_all_channels:number; completed_meetings:number; qualified_brands:number; opportunities:number; confirmed_partnerships:number; confirmed_cash_deals:number; confirmed_cash_value_inr:number; confirmed_in_kind_value_inr:number; advanced_open_cash_value_inr:number; actual_cash_collected_inr:null; qualified_brands_goal:number|null; confirmed_partnerships_goal:number|null };
type Simulation = { prospects:number; contacted_brands:number; conversations:number; opportunities:number; confirmed_cash_deals:number; confirmed_cash_value_inr:number; cash_collected_inr:number; outstanding_inr:number; overdue_inr:number; collection_rate_pct:number|null; base_target_inr:number; target_achievement_pct:number; remaining_to_base_inr:number; budget_inr:number; spent_inr:number; remaining_budget_inr:number };
type Deal = { stage:string; support_type:string; proposed_value_inr:number; confirmed_value_inr:number; campaign_id:string|null };
type Campaign = { id:string; name:string };
type HistoricalCampaign = { campaign_name:string; confirmed_cash_value_inr:number; opportunities:number; confirmed_partnerships:number };
type Task = { id:string; title:string; owner_name:string|null; due_date:string|null; status:string; priority:string };
type Snapshot = { kind:"historical"; metrics:Historical; campaigns:HistoricalCampaign[] } | { kind:"simulation"; metrics:Simulation; deals:Deal[]; campaigns:Campaign[]; qualified:number; tasks:Task[] };
function check<T>(result:{data:T|null;error:{message:string}|null}):T { if(result.error) throw new Error(result.error.message); if(result.data===null) throw new Error("Database returned no data"); return result.data; }
async function loadSnapshot(mode:"historical"|"simulation", date:string, userId:string):Promise<Snapshot> {
  if(mode==="historical") {
    const [m,c]=await Promise.all([supabase.rpc("sponsoros_snapshot",{p_date:date}),supabase.rpc("sponsoros_campaign_metrics",{p_date:date})]);
    return {kind:"historical",metrics:check(m) as Historical,campaigns:check(c) as HistoricalCampaign[]};
  }
  const [m,d,c,b,t]=await Promise.all([
    supabase.rpc("sponsoros_simulation_metrics",{p_date:date}),
    supabase.from("sponsoros_deals").select("stage,support_type,proposed_value_inr,confirmed_value_inr,campaign_id").eq("user_id",userId),
    supabase.from("sponsoros_campaigns").select("id,name").eq("user_id",userId),
    supabase.from("sponsoros_brands").select("id",{count:"exact",head:true}).eq("user_id",userId).eq("qualification","qualified"),
    supabase.from("sponsoros_tasks").select("id,title,owner_name,due_date,status,priority").eq("user_id",userId).neq("status","completed").order("due_date",{ascending:true})
  ]);
  if(b.error) throw new Error(b.error.message);
  if(b.count===null) throw new Error("Qualified brand count unavailable");
  const metrics=check(m) as Simulation;
  const deals=check(d) as Deal[];
  if(deals.length!==metrics.opportunities) throw new Error("Deal totals changed during loading or exceed the query limit. Refresh to reconcile.");
  return {kind:"simulation",metrics,deals,campaigns:check(c) as Campaign[],qualified:b.count,tasks:check(t) as Task[]};
}
function CommandCenter(){
  const {mode,asOf}=useApp(); const {session}=useAuth();
  return <LiveDashboard key={`${session.user.id}:${mode}:${asOf}`} mode={mode} date={asOf} userId={session.user.id}/>;
}
function LiveDashboard({mode,date,userId}:{mode:"historical"|"simulation";date:string;userId:string}){
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
  const [error,setError]=useState(""); const [attempt,setAttempt]=useState(0); const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true; void loadSnapshot(mode,date,userId).then(data=>{if(active){setSnapshot(data);setLoading(false);}}).catch((e:unknown)=>{if(active){setError(e instanceof Error?e.message:"Unable to load dashboard");setLoading(false);}});return ()=>{active=false;};},[mode,date,userId,attempt]);
  const refresh=()=>{setLoading(true);setError("");setSnapshot(null);setAttempt(n=>n+1);};
  return <div className="space-y-5">
    <PageHeader title="Growth Command Center" subtitle={`Database-backed ${mode==="historical"?"historical snapshot":"simulation workspace"} · ${date}`} badge={<ToneBadge tone="info">Supabase</ToneBadge>} actions={<Button variant="outline" onClick={refresh} disabled={loading}>Refresh data</Button>}/>
    <p className="text-xs text-muted-foreground">{mode==="historical"?"Read-only source records as of the selected date. Historical cash receipts are unavailable.":"Current editable simulation workspace. Reporting date filters receipts, due dates and brand activity, not historical deal states."}</p>
    {loading?<LoadingState rows={6}/>:error?<Panel title="Unable to load dashboard"><p role="alert" className="text-sm text-destructive">{error}</p><Button className="mt-3" onClick={refresh}>Retry</Button></Panel>:snapshot?<DashboardContent snapshot={snapshot} date={date}/>:null}
  </div>;
}
const pct=(a:number,b:number|null)=>b!==null&&b>0?formatPct(a/b*100,2):"Not Available";
const money=(v:number|null)=>v===null?"Not Available":formatLakh(v);
const colors=["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--chart-6)","var(--chart-7)"];
function DashboardContent({snapshot,date}:{snapshot:Snapshot;date:string}){
  const hist=snapshot.kind==="historical";
  const m=snapshot.metrics;
  const confirmed=hist?snapshot.metrics.confirmed_partnerships:snapshot.deals.filter(d=>d.stage==="partner_confirmed").length;
  const qualified=hist?snapshot.metrics.qualified_brands:snapshot.qualified;
  const advanced=hist?snapshot.metrics.advanced_open_cash_value_inr:snapshot.deals.filter(d=>d.support_type==="cash"&&["proposal_sent","negotiating"].includes(d.stage)).reduce((n,d)=>n+Number(d.proposed_value_inr),0);
  const inKind=hist?snapshot.metrics.confirmed_in_kind_value_inr:snapshot.deals.filter(d=>d.support_type==="in_kind"&&d.stage==="partner_confirmed").reduce((n,d)=>n+Number(d.confirmed_value_inr),0);
  const collected=hist?null:snapshot.metrics.cash_collected_inr;
  const stages=hist?[]:Array.from(new Set(snapshot.deals.map(d=>d.stage))).map(stage=>({name:stage.replaceAll("_"," "),value:snapshot.deals.filter(d=>d.stage===stage).length}));
  const campaignData=hist?snapshot.campaigns.map(c=>({name:c.campaign_name,value:Number(c.confirmed_cash_value_inr)})):snapshot.campaigns.map(c=>({name:c.name,value:snapshot.deals.filter(d=>d.campaign_id===c.id&&d.stage==="partner_confirmed"&&d.support_type==="cash").reduce((n,d)=>n+Number(d.confirmed_value_inr),0)}));
  campaignData.sort((a,b)=>b.value-a.value);
  const funnel:[string,number][]=hist?[["Brands",snapshot.metrics.brands],["Qualified brands",qualified],["Opportunities",m.opportunities],["Confirmed partnerships",confirmed]]:[["Prospects",snapshot.metrics.prospects],["Contacted brands",snapshot.metrics.contacted_brands],["Conversations",snapshot.metrics.conversations],["Qualified brands (current)",qualified],["Opportunities (current)",m.opportunities],["Confirmed partnerships (current)",confirmed]];
  const max=Math.max(1,...funnel.map(x=>x[1]));
  return <>
    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <KpiCard label="Cash collected" value={<span className="text-xl">{money(collected)}</span>} hint={hist?"No historical receipt records":"Verified simulated receipts"}/>
      <KpiCard label="Confirmed cash sponsorship" value={money(m.confirmed_cash_value_inr)} hint={`${m.confirmed_cash_deals} cash deals · commitments`}/>
      <KpiCard label="Qualified sponsors" value={formatNum(qualified)} hint={hist?"Historical as-of date":"Current qualification"}/>
      <KpiCard label="Confirmed partnerships" value={formatNum(confirmed)} hint={hist?`Target ${snapshot.metrics.confirmed_partnerships_goal??"Not Available"}`:"Current deal state"}/>
      <KpiCard label="Advanced open cash pipeline" value={money(advanced)} hint="Cash proposals + negotiations"/>
      <KpiCard label="Target achievement" value={hist?pct(confirmed,snapshot.metrics.confirmed_partnerships_goal):formatPct(snapshot.metrics.target_achievement_pct,2)} hint={hist?"Partnership target":"Cash collection base target"}/>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Sponsorship funnel" description="Stage totals; not a cohort conversion analysis">
        <div className="space-y-3">{funnel.map(([label,v])=><div key={label} className="grid grid-cols-[minmax(85px,140px)_minmax(0,1fr)_45px] items-center gap-2 text-xs"><span>{label}</span><Progress value={v/max*100} className="h-3"/><span className="text-right font-semibold">{formatNum(v)}</span></div>)}</div>
        {hist&&<p className="mt-3 text-xs text-muted-foreground">Outbound brands: {snapshot.metrics.outbound_brands} · All-channel responding brands: {snapshot.metrics.responding_brands_all_channels} · Meetings: {snapshot.metrics.completed_meetings}. Different populations; no outbound response rate inferred.</p>}
      </Panel>
      <Panel title="Campaign performance" description="Confirmed cash commitments by campaign"><div className="h-64"><ResponsiveContainer><BarChart data={campaignData} layout="vertical" margin={{right:20}}><CartesianGrid horizontal={false} stroke="var(--border)"/><XAxis type="number" tickFormatter={formatLakh} fontSize={11}/><YAxis type="category" dataKey="name" width={145} fontSize={10}/><Tooltip formatter={(v:number)=>formatLakh(v)}/><Bar dataKey="value" name="Confirmed cash" fill="var(--chart-1)" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></div></Panel>
      <Panel title="Pipeline distribution" description={hist?"Historical stage breakdown not exposed by snapshot RPC":"Current simulation deal stages"}>{hist?<p className="py-10 text-sm text-muted-foreground">Not Available</p>:stages.length===0?<p className="py-10 text-sm text-muted-foreground">No deals</p>:<div className="h-64"><ResponsiveContainer><PieChart><Pie data={stages} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>{stages.map((s,i)=><Cell key={s.name} fill={colors[i%colors.length]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div>}</Panel>
      <Panel title="Target vs actual" description={hist?"Date-versioned historical targets":"Base cash collection target"}>
        {hist?<><Target label="Partnerships" actual={confirmed} target={snapshot.metrics.confirmed_partnerships_goal}/><Target label="Qualified brands" actual={qualified} target={snapshot.metrics.qualified_brands_goal}/></>:<><Target label="Verified cash" actual={snapshot.metrics.cash_collected_inr} target={snapshot.metrics.base_target_inr} financial/><Target label="Confirmed commitments" actual={snapshot.metrics.confirmed_cash_value_inr} target={snapshot.metrics.base_target_inr} financial/><p className="text-xs text-muted-foreground">Remaining cash gap: {money(snapshot.metrics.remaining_to_base_inr)}</p></>}
      </Panel>
      <Panel title="Revenue overview" description="Commitments and receipts are separate"><div className="grid grid-cols-2 gap-3"><KpiCard label="Cash commitments" value={money(m.confirmed_cash_value_inr)}/><KpiCard label="In-kind commitments" value={money(inKind)}/><KpiCard label="Outstanding" value={hist?"Not Available":money(snapshot.metrics.outstanding_inr)}/><KpiCard label="Overdue (subset of outstanding)" value={hist?"Not Available":money(snapshot.metrics.overdue_inr)}/></div>{!hist&&<p className="mt-3 text-xs">Collection efficiency: {snapshot.metrics.collection_rate_pct===null?"Not Available":formatPct(snapshot.metrics.collection_rate_pct,2)}</p>}</Panel>
      <Panel title="Priority alerts" description={hist?"Historical collection and task records unavailable":"Current simulation tasks due by reporting date"}>
        {hist?<p className="text-sm text-muted-foreground">Not Available</p>:<><p className="mb-3 text-sm">Overdue cash: <strong>{money(snapshot.metrics.overdue_inr)}</strong></p><div className="space-y-2">{snapshot.tasks.filter(t=>t.due_date!==null&&t.due_date<=date).slice(0,6).map(t=><div key={t.id} className="rounded-md border p-2 text-sm"><strong>{t.title}</strong><p className="text-xs text-muted-foreground">{t.owner_name??"Unassigned"} · {t.due_date} · {t.priority}</p></div>)}{!snapshot.tasks.some(t=>t.due_date!==null&&t.due_date<=date)&&<p className="text-sm text-muted-foreground">No open tasks due by this date.</p>}</div></>}
      </Panel>
    </div>
    <Panel title="Growth insights" description="Rule-based insights from database results"><div className="grid gap-3 md:grid-cols-2">
      {campaignData[0]&&campaignData[0].value>0&&<div className="rounded-lg border p-3 text-sm"><strong>{campaignData[0].name}</strong><p className="mt-1 text-muted-foreground">Leading campaign by confirmed cash: {money(campaignData[0].value)}.</p></div>}
      {hist?<div className="rounded-lg border p-3 text-sm"><strong>Partnership target gap</strong><p>{snapshot.metrics.confirmed_partnerships_goal===null?"Not Available":Math.max(0,snapshot.metrics.confirmed_partnerships_goal-confirmed)}</p></div>:<div className="rounded-lg border p-3 text-sm"><strong>Collection priority</strong><p>Recover overdue cash of {money(snapshot.metrics.overdue_inr)} and close the remaining target gap of {money(snapshot.metrics.remaining_to_base_inr)}.</p><p className="mt-1 text-muted-foreground">Budget spent: {money(snapshot.metrics.spent_inr)} / {money(snapshot.metrics.budget_inr)}.</p></div>}
    </div></Panel>
  </>;
}
function Target({label,actual,target,financial=false}:{label:string;actual:number;target:number|null;financial?:boolean}){return <div className="mb-4 text-sm"><div className="mb-2 flex flex-wrap justify-between gap-2"><span>{label}</span><span>{financial?money(actual):formatNum(actual)} / {target===null?"Not Available":financial?money(target):formatNum(target)}</span></div>{target!==null&&target>0?<Progress value={Math.min(100,actual/target*100)}/>:null}</div>}
