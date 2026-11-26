import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/app/shared";
import { recordPayment } from "@/lib/calculations";
import { formatINR } from "@/lib/format";
import { useApp } from "@/lib/app-context";
import { dataService, newId } from "@/lib/store";
import type { Payment, VerificationStatus } from "@/lib/types";

type PaymentErrorKey = "paymentId" | "amount" | "date" | "reference";
type PaymentErrors = Partial<Record<PaymentErrorKey, string>>;

export function PaymentForm({ payments, initialPaymentId, onClose }: {
  payments: Payment[];
  initialPaymentId?: string | undefined;
  onClose: () => void;
}) {
  const { asOf } = useApp();
  const eligible = payments.filter((payment) => payment.confirmed - payment.received > 0);
  const [paymentId, setPaymentId] = useState(initialPaymentId ?? eligible[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(asOf);
  const [reference, setReference] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("Verified");
  const [errors, setErrors] = useState<PaymentErrors>({});
  const selected = payments.find((payment) => payment.id === paymentId);
  const outstanding = selected ? Math.max(selected.confirmed - selected.received, 0) : 0;

  function save() {
    const nextErrors: PaymentErrors = {};
    const numericAmount = Number(amount);
    if (!selected) nextErrors.paymentId = "Select a sponsor or deal";
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) nextErrors.amount = "Enter an amount greater than zero";
    else if (numericAmount > outstanding) nextErrors.amount = `Amount cannot exceed ${formatINR(outstanding)} outstanding`;
    if (!date) nextErrors.date = "Payment date is required";
    if (!reference.trim()) nextErrors.reference = "Payment reference is required";
    setErrors(nextErrors);
    if (!selected || Object.keys(nextErrors).length > 0) return;

    const updated = recordPayment({ ...selected, transactions: selected.transactions ?? [] }, {
      id: newId("pt"),
      amount: numericAmount,
      date,
      reference: reference.trim(),
      verificationStatus,
    });
    dataService.upsert("payments", updated);
    toast.success(verificationStatus === "Verified" ? "Verified payment recorded" : "Payment saved without increasing verified collections");
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription>Only verified payments increase actual cash collected. Pending and rejected receipts remain in the audit trail.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Sponsor / confirmed deal" required error={errors.paymentId}>
            <Select value={paymentId} onValueChange={(value) => { setPaymentId(value); setAmount(""); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select a confirmed deal" /></SelectTrigger>
              <SelectContent>
                {eligible.map((payment) => (
                  <SelectItem key={payment.id} value={payment.id}>{payment.sponsor} · {formatINR(payment.confirmed - payment.received)} due</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {selected && (
            <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3 text-xs">
              <div><span className="text-muted-foreground">Confirmed</span><div className="mt-1 font-semibold">{formatINR(selected.confirmed)}</div></div>
              <div><span className="text-muted-foreground">Outstanding</span><div className="mt-1 font-semibold">{formatINR(outstanding)}</div></div>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Payment amount (₹)" required error={errors.amount}>
              <Input type="number" min={1} step={1000} value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" />
            </Field>
            <Field label="Payment date" required error={errors.date}>
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </Field>
          </div>
          <Field label="Payment reference" required error={errors.reference}>
            <Input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="UTR, cheque or receipt number" />
          </Field>
          <Field label="Verification status" required>
            <Select value={verificationStatus} onValueChange={(value) => setVerificationStatus(value as VerificationStatus)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending verification">Pending verification</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={eligible.length === 0}>Record payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
