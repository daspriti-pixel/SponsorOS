import type { Campaign, Deal, Experiment, Payment, SimulatorInputs, Sponsor, Task } from "@/lib/types";

export const HISTORICAL_SNAPSHOT_DATE = "2025-04-11";
export const SIMULATION_SNAPSHOT_DATE = "2027-03-15";
export const BASE_CASH_COLLECTION_TARGET = 2400000;

/** Preliminary historical reference figures — not verified imported source records. */
export const HISTORICAL_REFERENCE = {
  potentialBrands: 180,
  contactedBrands: null as number | null,
  conversations: null as number | null,
  qualifiedBrands: 60,
  qualifiedTarget: null as number | null,
  opportunities: 58,
  confirmedPartnerships: 24,
  confirmedCashDeals: 20,
  confirmedCashValue: 2000000,
  confirmedInKindValue: 240000,
  advancedPipelineValue: 1050000,
  partnershipTarget: 28,
  cashCollected: null as number | null,
};

export const OWNERS = ["Aarav Mehta", "Ishita Rao", "Kabir Singh", "Neha Iyer", "Rohan Das"];
export const INDUSTRIES = ["EdTech", "FMCG", "Fintech", "Telecom", "Apparel", "Food & Beverage", "Consumer Electronics", "Mobility"];

export const SEED_CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Brand Discovery Email", channel: "Email", opportunities: 11, confirmed: 0, cashValue: 0, status: "Completed", source: "historical" },
  { id: "c2", name: "Warm Partner Introductions", channel: "Referral", opportunities: 9, confirmed: 8, cashValue: 640000, status: "Active", source: "historical" },
  { id: "c3", name: "Brand Leader LinkedIn", channel: "LinkedIn", opportunities: 12, confirmed: 0, cashValue: 0, status: "Paused", source: "historical" },
  { id: "c4", name: "Partner Interest Form", channel: "Inbound", opportunities: 7, confirmed: 7, cashValue: 635000, status: "Active", source: "historical" },
  { id: "c5", name: "Creator Network Referrals", channel: "Referral", opportunities: 9, confirmed: 9, cashValue: 725000, status: "Active", source: "historical" },
  { id: "c6", name: "Past Conversation Revival", channel: "Email", opportunities: 10, confirmed: 0, cashValue: 0, status: "Completed", source: "historical" },
];

const sp = (id: string, brand: string, industry: string, owner: string, q: Sponsor["qualification"], c: [number, number, number, number, number], potential: number, nextAction: string, last: string | null): Sponsor => ({
  id, brand, industry, owner, qualification: q, potential, nextAction, lastInteraction: last,
  contactName: "Demo Contact", contactEmail: `partnerships@${brand.toLowerCase().replace(/[^a-z]/g, "")}.example`, contactPhone: "+91 90000 00000",
  criteria: { audience: c[0], cash: c[1], access: c[2], activation: c[3], speed: c[4] }, source: "simulated",
});

// Clearly fictional demo brands (Sim prefix) — not historical records.
export const SEED_SPONSORS: Sponsor[] = [
  sp("s1", "Sim Brand Alpha", "EdTech", "Aarav Mehta", "Qualified", [9, 8, 7, 8, 7], 150000, "Send revised proposal", "2026-11-18"),
  sp("s2", "Sim Brand Beta", "FMCG", "Ishita Rao", "Qualified", [8, 9, 6, 7, 6], 200000, "Schedule tasting booth call", "2026-11-20"),
  sp("s3", "Sim Brand Gamma", "Fintech", "Kabir Singh", "In Review", [7, 7, 5, 6, 5], 120000, "Share audience deck", "2026-11-10"),
  sp("s4", "Sim Brand Delta", "Telecom", "Neha Iyer", "Qualified", [8, 9, 4, 7, 4], 250000, "Negotiate payment terms", "2026-11-22"),
  sp("s5", "Sim Brand Epsilon", "Apparel", "Rohan Das", "Unqualified", [6, 4, 8, 7, 7], 60000, "Initial outreach", null),
  sp("s6", "Sim Brand Zeta", "Food & Beverage", "Aarav Mehta", "Qualified", [9, 6, 9, 9, 8], 90000, "Confirm stall layout", "2026-11-23"),
  sp("s7", "Sim Brand Eta", "Consumer Electronics", "Ishita Rao", "In Review", [7, 8, 3, 6, 4], 180000, "Find decision maker", "2026-11-05"),
  sp("s8", "Sim Brand Theta", "Mobility", "Kabir Singh", "Disqualified", [4, 5, 3, 4, 3], 50000, "Archive", "2026-10-28"),
  sp("s9", "Sim Brand Iota", "EdTech", "Neha Iyer", "Qualified", [8, 7, 8, 6, 9], 110000, "Collect advance payment", "2026-11-24"),
  sp("s10", "Sim Brand Kappa", "Fintech", "Rohan Das", "Unqualified", [6, 7, 5, 5, 6], 100000, "Initial outreach", null),
];

const PAYMENT_ROWS = [
  { brand: "Sim Brand Alpha", confirmed: 150000, received: 50000, dueDate: "2027-03-01" },
  { brand: "Sim Brand Beta", confirmed: 120000, received: 20000, dueDate: "2027-03-05" },
  { brand: "Sim Brand Gamma", confirmed: 100000, received: 50000, dueDate: "2027-03-08" },
  { brand: "Sim Brand Delta", confirmed: 90000, received: 60000, dueDate: "2027-03-10" },
  { brand: "Sim Brand Epsilon", confirmed: 80000, received: 80000, dueDate: "2027-02-28" },
  { brand: "Sim Brand Zeta", confirmed: 110000, received: 110000, dueDate: "2027-03-02" },
  { brand: "Sim Brand Eta", confirmed: 140000, received: 140000, dueDate: "2027-03-06" },
  { brand: "Sim Brand Theta", confirmed: 95000, received: 95000, dueDate: "2027-03-12" },
  { brand: "Sim Brand Iota", confirmed: 105000, received: 105000, dueDate: "2027-03-18" },
  { brand: "Sim Brand Kappa", confirmed: 125000, received: 125000, dueDate: "2027-03-20" },
  { brand: "Sim Brand Lambda", confirmed: 85000, received: 85000, dueDate: "2027-03-22" },
  { brand: "Sim Brand Mu", confirmed: 115000, received: 115000, dueDate: "2027-03-24" },
  { brand: "Sim Brand Nu", confirmed: 100000, received: 40000, dueDate: "2027-03-18" },
  { brand: "Sim Brand Xi", confirmed: 75000, received: 25000, dueDate: "2027-03-21" },
  { brand: "Sim Brand Omicron", confirmed: 130000, received: 50000, dueDate: "2027-03-25" },
  { brand: "Sim Brand Pi", confirmed: 90000, received: 30000, dueDate: "2027-03-28" },
  { brand: "Sim Brand Rho", confirmed: 120000, received: 60000, dueDate: "2027-04-02" },
  { brand: "Sim Brand Sigma", confirmed: 80000, received: 40000, dueDate: "2027-04-05" },
  { brand: "Sim Brand Tau", confirmed: 100000, received: 50000, dueDate: "2027-04-10" },
  { brand: "Sim Brand Upsilon", confirmed: 90000, received: 20000, dueDate: "2027-04-15" },
];

export const SEED_PAYMENTS: Payment[] = PAYMENT_ROWS.map((row, index) => ({
  id: `p${index + 1}`,
  dealId: `d${index + 1}`,
  sponsor: row.brand,
  owner: OWNERS[index % OWNERS.length]!,
  campaign: SEED_CAMPAIGNS[index % SEED_CAMPAIGNS.length]!.name,
  confirmed: row.confirmed,
  received: row.received,
  dueDate: row.dueDate,
  transactions: row.received > 0 ? [{
    id: `pt${index + 1}`,
    amount: row.received,
    date: `2027-02-${String(index + 1).padStart(2, "0")}`,
    reference: `SIM-RECEIPT-${String(index + 1).padStart(3, "0")}`,
    verificationStatus: "Verified",
  }] : [],
  source: "simulated",
}));

const dl = (id: string, sponsorId: string, brand: string, value: number, supportType: Deal["supportType"], owner: string, stage: Deal["stage"], stageEnteredAt: string, expectedClose: string, nextAction: string, campaign: string): Deal =>
  ({ id, sponsorId, brand, value, supportType, owner, stage, stageEnteredAt, expectedClose, nextAction, campaign, source: "simulated" });

const CONFIRMED_DEALS: Deal[] = SEED_PAYMENTS.map((payment, index) => ({
  id: payment.dealId!,
  sponsorId: `s${(index % 10) + 1}`,
  brand: payment.sponsor,
  value: payment.confirmed,
  supportType: "Cash",
  owner: payment.owner,
  stage: "Confirmed",
  stageEnteredAt: `2027-01-${String(index + 1).padStart(2, "0")}`,
  expectedClose: payment.dueDate,
  nextAction: payment.received >= payment.confirmed ? "Reconcile verified receipt" : "Collect outstanding balance",
  campaign: payment.campaign,
  source: "simulated",
}));

const OPEN_AND_LOST_DEALS: Deal[] = [
  dl("d21", "s1", "Sim Brand Phi", 200000, "Cash", "Aarav Mehta", "Qualified", "2027-02-20", "2027-03-28", "Schedule discovery call", "Warm Partner Introductions"),
  dl("d22", "s2", "Sim Brand Chi", 150000, "Cash", "Ishita Rao", "Qualified", "2027-03-10", "2027-04-02", "Confirm marketing objectives", "Partner Interest Form"),
  dl("d23", "s3", "Sim Brand Psi", 120000, "Cash", "Kabir Singh", "Qualified", "2027-03-01", "2027-03-12", "Share qualification notes", "Brand Leader LinkedIn"),
  dl("d24", "s4", "Sim Brand Omega", 90000, "In-kind", "Neha Iyer", "Qualified", "2027-03-06", "2027-04-08", "Value proposed inventory", "Creator Network Referrals"),
  dl("d25", "s5", "Sim Brand Aster", 80000, "Cash", "Rohan Das", "Qualified", "2027-03-11", "2027-04-12", "Identify decision maker", "Brand Discovery Email"),
  dl("d26", "s6", "Sim Brand Bloom", 175000, "Cash", "Aarav Mehta", "Qualified", "2027-02-26", "2027-04-15", "Arrange campus walkthrough", "Past Conversation Revival"),
  dl("d27", "s7", "Sim Brand Cedar", 110000, "Cash", "Ishita Rao", "Qualified", "2027-03-08", "2027-04-18", "Confirm budget cycle", "Partner Interest Form"),
  dl("d28", "s8", "Sim Brand Drift", 130000, "Cash", "Kabir Singh", "Qualified", "2027-03-12", "2027-04-20", "Send audience profile", "Brand Discovery Email"),
  dl("d29", "s9", "Sim Brand Ember", 250000, "Cash", "Neha Iyer", "Proposal Sent", "2027-02-18", "2027-03-22", "Follow up on proposal", "Warm Partner Introductions"),
  dl("d30", "s10", "Sim Brand Flux", 180000, "In-kind", "Rohan Das", "Proposal Sent", "2027-03-04", "2027-03-29", "Confirm inventory valuation", "Creator Network Referrals"),
  dl("d31", "s1", "Sim Brand Grove", 160000, "Cash", "Aarav Mehta", "Proposal Sent", "2027-03-09", "2027-04-01", "Review proposal with finance", "Partner Interest Form"),
  dl("d32", "s2", "Sim Brand Harbor", 140000, "Cash", "Ishita Rao", "Proposal Sent", "2027-02-28", "2027-03-10", "Escalate stalled response", "Brand Leader LinkedIn"),
  dl("d33", "s3", "Sim Brand Juniper", 220000, "Cash", "Kabir Singh", "Proposal Sent", "2027-03-11", "2027-04-06", "Schedule proposal review", "Brand Discovery Email"),
  dl("d34", "s4", "Sim Brand Kite", 90000, "Cash", "Neha Iyer", "Proposal Sent", "2027-03-02", "2027-04-09", "Share activation addendum", "Past Conversation Revival"),
  dl("d35", "s5", "Sim Brand Lumen", 300000, "Cash", "Rohan Das", "Negotiation", "2027-02-22", "2027-03-20", "Negotiate payment milestones", "Warm Partner Introductions"),
  dl("d36", "s6", "Sim Brand Maple", 275000, "Cash", "Aarav Mehta", "Negotiation", "2027-03-07", "2027-03-26", "Approve final benefits", "Creator Network Referrals"),
  dl("d37", "s7", "Sim Brand North", 200000, "In-kind", "Ishita Rao", "Negotiation", "2027-03-01", "2027-03-14", "Resolve delivery schedule", "Partner Interest Form"),
  dl("d38", "s8", "Sim Brand Orbit", 125000, "Cash", "Kabir Singh", "Negotiation", "2027-03-12", "2027-04-03", "Confirm advance payment", "Brand Discovery Email"),
  dl("d39", "s9", "Sim Brand Peak", 100000, "Cash", "Neha Iyer", "Lost", "2027-02-15", "2027-03-01", "Record loss reason", "Brand Leader LinkedIn"),
  dl("d40", "s10", "Sim Brand Quest", 75000, "In-kind", "Rohan Das", "Lost", "2027-02-20", "2027-03-04", "Archive proposal", "Past Conversation Revival"),
  dl("d41", "s1", "Sim Brand Ridge", 150000, "Cash", "Aarav Mehta", "Lost", "2027-02-25", "2027-03-08", "Schedule future re-engagement", "Brand Discovery Email"),
  dl("d42", "s2", "Sim Brand Summit", 60000, "Cash", "Ishita Rao", "Lost", "2027-03-01", "2027-03-11", "Document budget objection", "Partner Interest Form"),
];

export const SEED_DEALS: Deal[] = [...CONFIRMED_DEALS, ...OPEN_AND_LOST_DEALS];

export const SEED_TASKS: Task[] = [
  { id: "t1", title: "Send revised proposal to Sim Brand Alpha", status: "In Progress", owner: "Aarav Mehta", dueDate: "2026-11-24", priority: "High", sponsorId: "s1", dealId: "d1", campaign: "Warm Partner Introductions", source: "simulated" },
  { id: "t2", title: "Chase overdue payment — Sim Brand Iota", status: "To Do", owner: "Neha Iyer", dueDate: "2026-11-26", priority: "High", sponsorId: "s9", dealId: "d5", source: "simulated" },
  { id: "t3", title: "Prepare sponsorship deck v3", status: "To Do", owner: "Ishita Rao", dueDate: "2026-11-29", priority: "Medium", source: "simulated" },
  { id: "t4", title: "Confirm stall layout with Sim Brand Zeta", status: "Completed", owner: "Aarav Mehta", dueDate: "2026-11-20", priority: "Low", sponsorId: "s6", source: "simulated" },
  { id: "t5", title: "Follow up Sim Brand Epsilon proposal", status: "To Do", owner: "Rohan Das", dueDate: "2026-11-21", priority: "Medium", dealId: "d9", source: "simulated" },
];

export const SEED_EXPERIMENTS: Experiment[] = [
  { id: "e1", name: "SponsorConnect", hypothesis: "Warm introductions through alumni and partners produce more qualified meetings than cold outreach.", kpiName: "Qualified meeting rate", scaleAt: 40, modifyAt: 20, stopAction: "Stop expansion", actual: null, sampleSize: 0, minSample: 25, durationDays: 0, minDuration: 14, budget: 35000, owner: "Ishita Rao", status: "Planned", source: "simulated" },
  { id: "e2", name: "Sponsor Marketplace", hypothesis: "A public sponsorship catalogue converts inbound interest into qualified inquiries.", kpiName: "Qualified inquiry conversion", scaleAt: 8, modifyAt: 3, stopAction: "Stop paid expansion", actual: null, sampleSize: 0, minSample: 200, durationDays: 0, minDuration: 21, budget: 30000, owner: "Kabir Singh", status: "Planned", source: "simulated" },
  { id: "e3", name: "Deal Closure Accelerator", hypothesis: "A structured playbook for stalled proposals lifts closure of at-risk deals.", kpiName: "At-risk proposal closure", scaleAt: 40, modifyAt: 20, stopAction: "Stop experimental playbook", actual: null, sampleSize: 0, minSample: 16, durationDays: 0, minDuration: 21, budget: 25000, owner: "Aarav Mehta", status: "Planned", source: "simulated" },
  { id: "e4", name: "Precision Outreach", hypothesis: "Fit-score-targeted outreach yields more qualified meetings per contact.", kpiName: "Qualified meeting rate", scaleAt: 15, modifyAt: 5, stopAction: "Stop expansion", actual: null, sampleSize: 0, minSample: 60, durationDays: 0, minDuration: 21, budget: 25000, owner: "Rohan Das", status: "Planned", source: "simulated" },
  { id: "e5", name: "CashFirst", hypothesis: "Advance-payment incentives raise pre-festival collection against forecast.", kpiName: "Forecast collection rate", scaleAt: 80, modifyAt: 65, stopAction: "Change payment approach", actual: null, sampleSize: 0, minSample: 10, durationDays: 0, minDuration: 14, budget: 15000, owner: "Neha Iyer", status: "Planned", source: "simulated" },
];

export const DEFAULT_SIMULATOR: SimulatorInputs = {
  potentialBrands: 300, contactRate: 80, conversationRate: 50, proposalRate: 50, closeRate: 50,
  avgDealSize: 100000, collectionRate: 80, budget: 150000,
};

export const SIMULATOR_PRESETS: Record<"Conservative" | "Base" | "Stretch", SimulatorInputs> = {
  Conservative: { ...DEFAULT_SIMULATOR, closeRate: 100 / 3, avgDealSize: 90000, collectionRate: 70 },
  Base: DEFAULT_SIMULATOR,
  Stretch: { ...DEFAULT_SIMULATOR, contactRate: 90, conversationRate: 150 / 270 * 100, closeRate: 48, avgDealSize: 110000, collectionRate: 90 },
};
