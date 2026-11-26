import { describe, expect, it } from "vitest";
import { BASE_CASH_COLLECTION_TARGET, HISTORICAL_REFERENCE, SEED_DEALS, SEED_PAYMENTS } from "@/data/mock";
import { collectionTargetSummary, dealSummary, paymentSummary, recordPayment } from "@/lib/calculations";
import type { Payment, PaymentTransaction } from "@/lib/types";

const transaction = (verificationStatus: PaymentTransaction["verificationStatus"]): PaymentTransaction => ({
  id: "test-receipt",
  amount: 10000,
  date: "2027-03-15",
  reference: "TEST-UTR-001",
  verificationStatus,
});

const payment: Payment = {
  id: "payment-test",
  dealId: "deal-test",
  sponsor: "Sim Test Brand",
  owner: "Aarav Mehta",
  campaign: "Partner Interest Form",
  confirmed: 100000,
  received: 40000,
  dueDate: "2027-03-20",
  transactions: [],
  source: "simulated",
};

describe("Deal pipeline simulation snapshot", () => {
  it("contains exactly 42 opportunities and 20 confirmed partnerships", () => {
    const summary = dealSummary(SEED_DEALS);
    expect(summary.total).toBe(42);
    expect(summary.confirmedCount).toBe(20);
  });

  it("reconciles confirmed cash to ₹21,00,000", () => {
    expect(dealSummary(SEED_DEALS).confirmedCash).toBe(2100000);
  });

  it("calculates active pipeline value from open deal records", () => {
    const openValue = SEED_DEALS.filter((deal) => ["Qualified", "Proposal Sent", "Negotiation"].includes(deal.stage)).reduce((sum, deal) => sum + deal.value, 0);
    expect(dealSummary(SEED_DEALS).activePipeline).toBe(openValue);
    expect(openValue).toBe(2995000);
  });
});

describe("Revenue simulation snapshot on 15 March 2027", () => {
  it("reconciles verified cash, outstanding cash and overdue cash", () => {
    const summary = paymentSummary(SEED_PAYMENTS, "2027-03-15");
    expect(summary.confirmed).toBe(2100000);
    expect(summary.received).toBe(1350000);
    expect(summary.outstanding).toBe(750000);
    expect(summary.overdue).toBe(280000);
    expect(summary.outstanding - summary.overdue).toBe(470000);
  });

  it("calculates 64.29% collection efficiency from verified cash", () => {
    expect(paymentSummary(SEED_PAYMENTS, "2027-03-15").collectionRate).toBeCloseTo(64.285714, 5);
  });

  it("calculates 56.25% target achievement and a ₹10,50,000 gap", () => {
    const target = collectionTargetSummary(1350000, BASE_CASH_COLLECTION_TARGET);
    expect(target.achievement).toBe(56.25);
    expect(target.remainingGap).toBe(1050000);
  });
});

describe("Payment verification rules", () => {
  it("adds a verified payment to actual cash collected", () => {
    expect(recordPayment(payment, transaction("Verified")).received).toBe(50000);
  });

  it("does not add a pending payment to actual cash collected", () => {
    expect(recordPayment(payment, transaction("Pending verification")).received).toBe(40000);
  });

  it("does not add a rejected payment to actual cash collected", () => {
    expect(recordPayment(payment, transaction("Rejected")).received).toBe(40000);
  });

  it("rejects a verified payment above the outstanding balance", () => {
    expect(() => recordPayment({ ...payment, received: 95000 }, transaction("Verified"))).toThrow("exceeds");
  });
});

describe("Historical collection availability", () => {
  it("keeps missing historical cash collection unavailable rather than zero", () => {
    expect(HISTORICAL_REFERENCE.cashCollected).toBeNull();
    expect(HISTORICAL_REFERENCE.cashCollected).not.toBe(0);
  });
});
