import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/app/shared";
import { OWNERS } from "@/data/mock";
import { useApp } from "@/lib/app-context";
import { dataService, newId, useAppData } from "@/lib/store";
import { DEAL_STAGES, type Deal, type DealStage, type SupportType } from "@/lib/types";

type DealErrorKey = "brand" | "value" | "owner" | "campaign" | "expectedClose" | "nextAction";
type DealErrors = Partial<Record<DealErrorKey, string>>;

export function DealForm({ initial, onClose }: { initial: Deal | null; onClose: () => void }) {
  const { asOf } = useApp();
  const { campaigns } = useAppData();
  const [form, setForm] = useState<Deal>(() => initial ?? {
    id: "",
    brand: "",
    value: 100000,
    supportType: "Cash",
    owner: "",
    stage: "Qualified",
    stageEnteredAt: asOf,
    expectedClose: asOf,
    nextAction: "",
    campaign: "",
    source: "manual",
  });
  const [errors, setErrors] = useState<DealErrors>({});
  const set = <K extends keyof Deal>(key: K, value: Deal[K]) => setForm((current) => ({ ...current, [key]: value }));

  function save() {
    const nextErrors: DealErrors = {};
    if (!form.brand.trim()) nextErrors.brand = "Sponsor name is required";
    if (!Number.isFinite(form.value) || form.value <= 0) nextErrors.value = "Enter an amount greater than zero";
    if (!form.owner) nextErrors.owner = "Assign a deal owner";
    if (!form.campaign) nextErrors.campaign = "Select a campaign";
    if (!form.expectedClose) nextErrors.expectedClose = "Expected closing date is required";
    if (!form.nextAction.trim()) nextErrors.nextAction = "Add the next action";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const stageChanged = initial?.stage !== form.stage;
    dataService.upsert("deals", {
      ...form,
      id: form.id || newId("d"),
      brand: form.brand.trim(),
      nextAction: form.nextAction.trim(),
      stageEnteredAt: stageChanged ? asOf : form.stageEnteredAt,
      source: initial?.source ?? "manual",
    });
    toast.success(initial ? "Deal updated" : "Deal added to the pipeline");
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit deal" : "Add deal"}</DialogTitle>
          <DialogDescription>Changes are saved to this browser's simulation data.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sponsor name" required error={errors.brand}>
            <Input value={form.brand} onChange={(event) => set("brand", event.target.value)} placeholder="e.g. Sim Brand Nova" />
          </Field>
          <Field label="Sponsorship amount (₹)" required error={errors.value}>
            <Input type="number" min={1} step={1000} value={form.value} onChange={(event) => set("value", Number(event.target.value))} />
          </Field>
          <Field label="Support type" required>
            <Select value={form.supportType} onValueChange={(value) => set("supportType", value as SupportType)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="In-kind">In-kind</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Pipeline stage" required>
            <Select value={form.stage} onValueChange={(value) => set("stage", value as DealStage)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{DEAL_STAGES.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Deal owner" required error={errors.owner}>
            <Select value={form.owner} onValueChange={(value) => set("owner", value)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select owner" /></SelectTrigger>
              <SelectContent>{OWNERS.map((owner) => <SelectItem key={owner} value={owner}>{owner}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Campaign" required error={errors.campaign}>
            <Select value={form.campaign} onValueChange={(value) => set("campaign", value)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select campaign" /></SelectTrigger>
              <SelectContent>{campaigns.map((campaign) => <SelectItem key={campaign.id} value={campaign.name}>{campaign.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Expected closing date" required error={errors.expectedClose}>
            <Input type="date" value={form.expectedClose} onChange={(event) => set("expectedClose", event.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Next action" required error={errors.nextAction}>
              <Textarea value={form.nextAction} onChange={(event) => set("nextAction", event.target.value)} placeholder="What should the owner do next?" rows={3} />
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>{initial ? "Save changes" : "Add deal"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
