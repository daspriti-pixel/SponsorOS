import type {
  Deal, Experiment, FitCriteria, Payment, PaymentStatus, PaymentTransaction, Recommendation, SimulatorInputs,
  SimulatorOutputs, Sponsor, Task,
} from "./types";

export const FIT_WEIGHTS: Record<keyof FitCriteria, number> = {
  audience: 0.25, cash: 0.25, access: 0.2, activation: 0.15, speed: 0.15,
};
export const FIT_LABELS: Record<keyof FitCriteria, string> = {
  audience: "Audience relevance", cash: "Cash potential", access: "Accessibility",
  activation: "Activation fit", speed: "Decision & payment speed",
};

/** Weighted Sponsor Fit Score on a 0–100 scale from 0–10 criteria ratings. */
export function fitScore(c: FitCriteria): number {
  const raw = (Object.keys(FIT_WEIGHTS) as (keyof FitCriteria)[]).reduce(
    (s, k) => s + Math.min(10, Math.max(0, c[k])) * FIT_WEIGHTS[k], 0);
  return Math.round(raw * 10);
}
export const fitBand = (s: number) => (s >= 75 ? "High" : s >= 50 ? "Medium" : "Low");

export function daysBetween(fromIso: string, toIso: string) {
  return Math.floor((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 86400000);
}

export const OPEN_STAGES = ["Qualified", "Proposal Sent", "Negotiation"] as const;
export const ADVANCED_STAGES = ["Proposal Sent", "Negotiation"] as const;
export const isOpen = (d: Deal) => (OPEN_STAGES as readonly string[]).includes(d.stage);

export type Risk = "Low" | "Medium" | "High";
export function dealRisk(d: Deal, asOf: string): Risk {
  if (!isOpen(d)) return "Low";
  const days = daysBetween(d.stageEnteredAt, asOf);
  if (days > 14 || d.expectedClose < asOf) return "High";
  if (days > 7) return "Medium";
  return "Low";
}

export function paymentStatus(p: Payment, asOf: string): PaymentStatus {
  if (p.received >= p.confirmed) return "Paid";
  if (p.dueDate < asOf) return "Overdue";
  return p.received > 0 ? "Partial" : "Pending";
}

export function recordPayment(payment: Payment, transaction: PaymentTransaction): Payment {
  if (transaction.amount <= 0) throw new Error("Payment amount must be greater than zero");
  if (transaction.verificationStatus === "Verified" && transaction.amount > payment.confirmed - payment.received) {
    throw new Error("Verified payment exceeds the outstanding balance");
  }
  return {
    ...payment,
    received: payment.received + (transaction.verificationStatus === "Verified" ? transaction.amount : 0),
    transactions: [...payment.transactions, transaction],
  };
}

export function paymentSummary(payments: Payment[], asOf: string) {
  const confirmed = payments.reduce((s, p) => s + p.confirmed, 0);
  const received = payments.reduce((s, p) => s + Math.min(p.received, p.confirmed), 0);
  const outstanding = confirmed - received;
  const overdue = payments
    .filter((p) => paymentStatus(p, asOf) === "Overdue")
    .reduce((s, p) => s + (p.confirmed - p.received), 0);
  const forecast = payments
    .filter((p) => paymentStatus(p, asOf) !== "Overdue")
    .reduce((s, p) => s + Math.min(p.received, p.confirmed) + (p.confirmed - Math.min(p.received, p.confirmed)) * 0.8, 0)
    + payments.filter((p) => paymentStatus(p, asOf) === "Overdue").reduce((s, p) => s + p.received + (p.confirmed - p.received) * 0.4, 0);
  return { confirmed, received, outstanding, overdue, collectionRate: confirmed ? (received / confirmed) * 100 : null, forecast };
}

export function dealSummary(deals: Deal[]) {
  const confirmed = deals.filter((d) => d.stage === "Confirmed");
  return {
    total: deals.length,
    confirmedCount: confirmed.length,
    confirmedCashCount: confirmed.filter((d) => d.supportType === "Cash").length,
    confirmedCash: confirmed.filter((d) => d.supportType === "Cash").reduce((s, d) => s + d.value, 0),
    confirmedInKind: confirmed.filter((d) => d.supportType === "In-kind").reduce((s, d) => s + d.value, 0),
    advancedPipeline: deals.filter((d) => (ADVANCED_STAGES as readonly string[]).includes(d.stage)).reduce((s, d) => s + d.value, 0),
    activePipeline: deals.filter(isOpen).reduce((s, d) => s + d.value, 0),
    activeCount: deals.filter(isOpen).length,
  };
}

export function collectionTargetSummary(received: number, target: number) {
  return {
    achievement: target > 0 ? (received / target) * 100 : null,
    remainingGap: Math.max(target - received, 0),
  };
}

export function taskSummary(tasks: Task[], asOf: string) {
  const open = tasks.filter((t) => t.status !== "Completed");
  return {
    open: open.length,
    overdue: open.filter((t) => t.dueDate < asOf).length,
    dueThisWeek: open.filter((t) => t.dueDate >= asOf && daysBetween(asOf, t.dueDate) <= 7).length,
    completed: tasks.length - open.length,
  };
}

export const sponsorFunnel = (sponsors: Sponsor[], deals: Deal[]) => ({
  potential: sponsors.length,
  contacted: sponsors.filter((s) => s.lastInteraction).length,
  conversations: sponsors.filter((s) => s.qualification !== "Unqualified" && s.lastInteraction).length,
  qualified: sponsors.filter((s) => s.qualification === "Qualified").length,
  opportunities: deals.length,
  confirmed: deals.filter((d) => d.stage === "Confirmed").length,
});

export const INVENTORY_VALUE_CAP = 4200000;
export const INVENTORY_SLOT_CAP = 43;

export function simulate(i: SimulatorInputs): SimulatorOutputs {
  const contacted = i.potentialBrands * (i.contactRate / 100);
  const conversations = contacted * (i.conversationRate / 100);
  const proposals = conversations * (i.proposalRate / 100);
  const signedDeals = proposals * (i.closeRate / 100);
  const confirmedValue = signedDeals * i.avgDealSize;
  const projectedCollection = confirmedValue * (i.collectionRate / 100);
  return {
    contacted, conversations, proposals, signedDeals, confirmedValue, projectedCollection,
    costPerSponsor: signedDeals > 0 ? i.budget / signedDeals : null,
    cashPerRupee: i.budget > 0 ? projectedCollection / i.budget : null,
    exceedsValueCap: confirmedValue > INVENTORY_VALUE_CAP,
    exceedsSlotCap: Math.round(signedDeals) > INVENTORY_SLOT_CAP,
  };
}

export function experimentRecommendation(e: Experiment): Recommendation {
  if (e.actual === null || e.sampleSize < e.minSample || e.durationDays < e.minDuration) return "Insufficient Data";
  if (e.actual >= e.scaleAt) return "Scale";
  if (e.actual >= e.modifyAt) return "Modify";
  return "Stop";
}

export const conversionRate = (confirmed: number, opps: number) => (opps > 0 ? (confirmed / opps) * 100 : null);

export function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]!);
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
