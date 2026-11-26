import { conversionRate, dealRisk, isOpen, paymentStatus, daysBetween } from "./calculations";
import { formatLakh } from "./format";
import type { Campaign, Deal, Payment, Task } from "./types";

/** Rule-based, data-derived insights (deterministic, not AI). */
export interface Insight { id: string; tone: "success" | "warning" | "critical" | "info"; title: string; detail: string; source: string }

export function deriveInsights(campaigns: Campaign[], deals: Deal[], payments: Payment[], asOf: string, partnershipGap: number): Insight[] {
  const out: Insight[] = [];
  const ranked = [...campaigns].sort((a, b) => b.cashValue - a.cashValue);
  const top = ranked[0];
  if (top && top.cashValue > 0) {
    out.push({ id: "top", tone: "success", title: `${top.name} leads confirmed cash`, detail: `${formatLakh(top.cashValue)} from ${top.confirmed}/${top.opportunities} opportunities (${conversionRate(top.confirmed, top.opportunities)?.toFixed(0)}% conversion). Consider reallocating effort here.`, source: "Historical reference" });
  }
  const zero = campaigns.filter((c) => c.opportunities > 0 && c.confirmed === 0);
  if (zero.length) out.push({ id: "zero", tone: "warning", title: `${zero.length} campaigns converted no partnerships`, detail: `${zero.map((c) => c.name).join(", ")} generated ${zero.reduce((s, c) => s + c.opportunities, 0)} opportunities with zero confirmations. Review qualification or messaging.`, source: "Historical reference" });
  if (partnershipGap > 0) out.push({ id: "gap", tone: "info", title: `${partnershipGap} partnerships short of target`, detail: `Advanced-stage proposals are the fastest path to closing the gap.`, source: "Historical reference" });
  const risky = deals.filter((d) => isOpen(d) && dealRisk(d, asOf) === "High");
  if (risky.length) out.push({ id: "risk", tone: "critical", title: `${risky.length} open deals at high risk`, detail: risky.map((d) => `${d.brand} (${daysBetween(d.stageEnteredAt, asOf)}d in ${d.stage})`).join(", "), source: "Simulated pipeline" });
  const overdue = payments.filter((p) => paymentStatus(p, asOf) === "Overdue");
  if (overdue.length) out.push({ id: "pay", tone: "critical", title: `${overdue.length} payments overdue`, detail: `${formatLakh(overdue.reduce((s, p) => s + p.confirmed - p.received, 0))} outstanding past due date.`, source: "Simulated payments" });
  return out;
}

export function priorityAlerts(deals: Deal[], tasks: Task[], payments: Payment[], asOf: string) {
  const alerts: { id: string; tone: "critical" | "warning" | "info"; label: string; detail: string }[] = [];
  deals.filter((d) => isOpen(d) && daysBetween(d.stageEnteredAt, asOf) > 14).forEach((d) =>
    alerts.push({ id: `st-${d.id}`, tone: "critical", label: "Stalled opportunity", detail: `${d.brand} — ${daysBetween(d.stageEnteredAt, asOf)} days in ${d.stage}` }));
  deals.filter((d) => isOpen(d) && d.expectedClose >= asOf && daysBetween(asOf, d.expectedClose) <= 7).forEach((d) =>
    alerts.push({ id: `fu-${d.id}`, tone: "warning", label: "Urgent follow-up", detail: `${d.brand} closes ${d.expectedClose} — ${d.nextAction}` }));
  alerts.push({ id: "hist-pay", tone: "warning", label: "Missing payment data", detail: "Historical cash collection records have not been imported." });
  tasks.filter((t) => t.status !== "Completed" && t.dueDate >= asOf && daysBetween(asOf, t.dueDate) <= 3).forEach((t) =>
    alerts.push({ id: `tk-${t.id}`, tone: "info", label: "Upcoming task", detail: `${t.title} — due ${t.dueDate}` }));
  payments.filter((p) => paymentStatus(p, asOf) === "Overdue").forEach((p) =>
    alerts.push({ id: `pd-${p.id}`, tone: "critical", label: "Overdue payment", detail: `${p.sponsor} — due ${p.dueDate}` }));
  return alerts;
}
