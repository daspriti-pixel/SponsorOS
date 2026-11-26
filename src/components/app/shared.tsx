import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DataSource } from "@/lib/types";

export function PageHeader({ title, subtitle, actions, badge }: { title: string; subtitle?: string; actions?: ReactNode; badge?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

const SOURCE_STYLE: Record<DataSource, string> = {
  historical: "border-primary/30 bg-primary/10 text-primary",
  simulated: "border-warning/40 bg-warning/10 text-warning-foreground",
  manual: "border-success/40 bg-success/10 text-success",
};
const SOURCE_LABEL: Record<DataSource, string> = { historical: "Historical (preliminary)", simulated: "Simulated", manual: "Manually entered" };
export function SourceBadge({ source, className }: { source: DataSource; className?: string }) {
  return <Badge variant="outline" className={cn("font-medium", SOURCE_STYLE[source], className)}>{SOURCE_LABEL[source]}</Badge>;
}

export function NotAvailable({ reason }: { reason: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center gap-1 text-muted-foreground">
          Not Available <Info className="h-3.5 w-3.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{reason}</TooltipContent>
    </Tooltip>
  );
}

export function KpiCard({ label, value, hint, icon, footer }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; footer?: ReactNode }) {
  return (
    <Card className="min-w-0 gap-0 py-4 shadow-sm">
      <CardContent className="px-4">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{label}</span>
          {icon}
        </div>
        <div className="mt-2 break-words text-xl font-semibold tabular-nums tracking-tight text-foreground xl:text-2xl">{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        {footer && <div className="mt-3">{footer}</div>}
      </CardContent>
    </Card>
  );
}

export function Panel({ title, description, action, children, className }: { title: string; description?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("min-w-0 gap-3 py-4 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 px-4">
        <div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description && <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="px-4">{children}</CardContent>
    </Card>
  );
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-lg border p-4" aria-label="Loading records" aria-busy="true">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  );
}

export function EmptyState({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {detail && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{detail}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const TONE: Record<string, string> = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning-foreground border-warning/40",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  info: "bg-primary/10 text-primary border-primary/30",
  muted: "bg-muted text-muted-foreground border-border",
};
export function ToneBadge({ tone, children }: { tone: keyof typeof TONE | string; children: ReactNode }) {
  return <Badge variant="outline" className={cn("font-medium", TONE[tone] ?? TONE['muted'])}>{children}</Badge>;
}

export function Field({ label, error, children, required }: { label: string; error?: string | undefined; children: ReactNode; required?: boolean | undefined }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}{required && <span className="text-destructive"> *</span>}</span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
