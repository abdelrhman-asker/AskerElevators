import type { ElevatorStatus, Priority, RequestStatus, TechnicianStatus } from "@/demo/data";
import { useLocale } from "@/i18n/useLocale";
import { cn } from "@/lib/utils";

type Status = ElevatorStatus | RequestStatus | TechnicianStatus;
const positive: readonly Status[] = ["operational", "available", "completed"];
const warning: readonly Status[] = ["maintenance", "scheduled", "onHold", "busy"];
const danger: readonly Status[] = ["outOfService"];

export function StatusBadge({ status }: { readonly status: Status }): React.JSX.Element {
  const { t } = useLocale();
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", positive.includes(status) && "bg-success/10 text-success", warning.includes(status) && "bg-warning/12 text-warning", danger.includes(status) && "bg-danger/10 text-danger", !positive.includes(status) && !warning.includes(status) && !danger.includes(status) && "bg-primary/10 text-primary")}>{t(`status.${status}`)}</span>;
}

export function PriorityBadge({ priority }: { readonly priority: Priority }): React.JSX.Element {
  const { t } = useLocale();
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", priority === "critical" && "border-danger/25 bg-danger/10 text-danger", priority === "high" && "border-warning/25 bg-warning/10 text-warning", priority === "medium" && "border-primary/20 bg-primary/8 text-primary", priority === "low" && "text-muted-foreground")}>{t(`priority.${priority}`)}</span>;
}
