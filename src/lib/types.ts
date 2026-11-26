// Centralized domain types. Shapes mirror future database tables so mock data can be swapped for queries.
export type DataSource = "historical" | "simulated" | "manual";
export type DataMode = "historical" | "simulation";

export type Qualification = "Unqualified" | "In Review" | "Qualified" | "Disqualified";
export const QUALIFICATIONS: Qualification[] = ["Unqualified", "In Review", "Qualified", "Disqualified"];

export interface FitCriteria {
  audience: number; // 0-10
  cash: number;
  access: number;
  activation: number;
  speed: number;
}

export interface Sponsor {
  id: string;
  brand: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  qualification: Qualification;
  owner: string;
  criteria: FitCriteria;
  potential: number;
  nextAction: string;
  lastInteraction: string | null;
  source: DataSource;
}

export type DealStage = "Qualified" | "Proposal Sent" | "Negotiation" | "Confirmed" | "Lost";
export const DEAL_STAGES: DealStage[] = ["Qualified", "Proposal Sent", "Negotiation", "Confirmed", "Lost"];
export type SupportType = "Cash" | "In-kind";

export interface Deal {
  id: string;
  brand: string;
  sponsorId?: string | undefined;
  value: number;
  supportType: SupportType;
  owner: string;
  stage: DealStage;
  stageEnteredAt: string;
  expectedClose: string;
  nextAction: string;
  campaign: string;
  source: DataSource;
}

export type TaskStatus = "To Do" | "In Progress" | "Completed";
export const TASK_STATUSES: TaskStatus[] = ["To Do", "In Progress", "Completed"];
export type Priority = "Low" | "Medium" | "High";
export const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export interface Task {
  description?: string;
  origin?: "manual" | "ai";
  id: string;
  title: string;
  status: TaskStatus;
  owner: string;
  dueDate: string;
  priority: Priority;
  sponsorId?: string | undefined;
  dealId?: string | undefined;
  campaign?: string | undefined;
  source: DataSource;
}

export type VerificationStatus = "Verified" | "Pending verification" | "Rejected";
export interface PaymentTransaction {
  id: string;
  amount: number;
  date: string;
  reference: string;
  verificationStatus: VerificationStatus;
}

export interface Payment {
  id: string;
  sponsor: string;
  dealId?: string | undefined;
  owner: string;
  campaign: string;
  confirmed: number;
  received: number; // Verified receipts only; pending receipts never count as collected cash.
  dueDate: string;
  transactions: PaymentTransaction[];
  source: DataSource;
}
export type PaymentStatus = "Paid" | "Partial" | "Pending" | "Overdue";

export type CampaignStatus = "Active" | "Paused" | "Completed";
export interface Campaign {
  id: string;
  name: string;
  channel: string;
  opportunities: number;
  confirmed: number;
  cashValue: number;
  status: CampaignStatus;
  source: DataSource;
}

export type ExperimentStatus = "Planned" | "Running" | "Completed" | "Paused";
export type Recommendation = "Scale" | "Modify" | "Stop" | "Insufficient Data";
export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  kpiName: string;
  scaleAt: number; // percent
  modifyAt: number; // percent
  stopAction: string;
  actual: number | null; // percent
  sampleSize: number;
  minSample: number;
  durationDays: number;
  minDuration: number;
  budget: number;
  owner: string;
  status: ExperimentStatus;
  source: DataSource;
}

export interface SimulatorInputs {
  potentialBrands: number;
  contactRate: number; // percent
  conversationRate: number;
  proposalRate: number;
  closeRate: number;
  avgDealSize: number;
  collectionRate: number;
  budget: number;
}

export interface SimulatorOutputs {
  contacted: number;
  conversations: number;
  proposals: number;
  signedDeals: number;
  confirmedValue: number;
  projectedCollection: number;
  costPerSponsor: number | null;
  cashPerRupee: number | null;
  exceedsValueCap: boolean;
  exceedsSlotCap: boolean;
}
