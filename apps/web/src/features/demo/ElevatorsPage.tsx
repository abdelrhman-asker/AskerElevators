import { useState } from "react";
import { Building2 } from "lucide-react";
import { DetailPanel } from "@/components/demo/DetailPanel";
import { EmptyState } from "@/components/demo/EmptyState";
import { PageHeader } from "@/components/demo/PageHeader";
import { SearchField } from "@/components/demo/SearchField";
import { StatusBadge } from "@/components/demo/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { demoElevators, type DemoElevator, type ElevatorStatus } from "@/demo/data";
import { formatDate } from "@/demo/format";
import { useLocale } from "@/i18n/useLocale";

const statuses: readonly ElevatorStatus[] = ["operational", "maintenance", "outOfService"];
export function ElevatorsPage(): React.JSX.Element {
  const { locale, t } = useLocale(); const [query, setQuery] = useState(""); const [status, setStatus] = useState<"all" | ElevatorStatus>("all"); const [selected, setSelected] = useState<DemoElevator>(); const normalized = query.trim().toLocaleLowerCase(locale);
  const filtered = demoElevators.filter((item) => (status === "all" || item.status === status) && (!normalized || [item.id, t(item.buildingKey), t(item.customerKey)].some((value) => value.toLocaleLowerCase(locale).includes(normalized))));
  return <div className="space-y-7"><PageHeader descriptionKey="elevators.description" icon={Building2} titleKey="elevators.title" /><div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-[1fr_15rem]"><SearchField onChange={setQuery} placeholder={t("elevators.searchPlaceholder")} value={query} /><Select aria-label={t("elevators.statusFilter")} onChange={(e) => { setStatus(e.target.value as typeof status); }} value={status}><option value="all">{t("common.all")}</option>{statuses.map((item) => <option key={item} value={item}>{t(`status.${item}`)}</option>)}</Select></div>
    {filtered.length === 0 ? <EmptyState onClear={() => { setQuery(""); setStatus("all"); }} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <Card className="p-5" key={item.id}><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 aria-hidden="true" className="size-5" /></span><StatusBadge status={item.status} /></div><h2 className="mt-5 font-bold">{item.id}</h2><p className="mt-1 text-sm text-muted-foreground">{t(item.buildingKey)}</p><dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm"><div><dt className="text-xs text-muted-foreground">{t("elevators.model")}</dt><dd className="mt-1 font-semibold">{item.model}</dd></div><div><dt className="text-xs text-muted-foreground">{t("elevators.nextService")}</dt><dd className="mt-1 font-semibold">{formatDate(item.nextService, locale)}</dd></div></dl><Button className="mt-5 w-full" onClick={() => { setSelected(item); }} variant="outline">{t("common.viewDetails")}</Button></Card>)}</div>}
    {selected && <DetailPanel onClose={() => { setSelected(undefined); }} open title={t("elevators.details")}><div className="space-y-6"><div><p className="text-2xl font-bold">{selected.id}</p><p className="mt-2 text-muted-foreground">{t(selected.buildingKey)} · {t(selected.customerKey)}</p><div className="mt-4"><StatusBadge status={selected.status} /></div></div><dl className="grid gap-4 rounded-xl bg-muted/60 p-5 sm:grid-cols-2">{[["elevators.model", selected.model], ["elevators.serial", selected.serial], ["elevators.floors", String(selected.floors)], ["elevators.lastService", formatDate(selected.lastService, locale)], ["elevators.nextService", formatDate(selected.nextService, locale)]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{t(label as "elevators.model")}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>)}</dl></div></DetailPanel>}
  </div>;
}
