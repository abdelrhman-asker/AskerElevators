import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({ icon: Icon, label, value, note }: { readonly icon: LucideIcon; readonly label: string; readonly value: number; readonly note: string }): React.JSX.Element {
  return <Card className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p></div><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span></div></Card>;
}
