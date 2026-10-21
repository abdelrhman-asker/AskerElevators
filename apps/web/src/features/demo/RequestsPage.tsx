import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { DataTable, type DataColumn } from "@/components/demo/DataTable";
import { DetailPanel } from "@/components/demo/DetailPanel";
import { EmptyState } from "@/components/demo/EmptyState";
import { PageHeader } from "@/components/demo/PageHeader";
import { SearchField } from "@/components/demo/SearchField";
import { PriorityBadge, StatusBadge } from "@/components/demo/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { demoRequests, findTechnician, type DemoRequest, type Priority, type RequestStatus } from "@/demo/data";
import { formatDate, formatDateTime } from "@/demo/format";
import { useLocale } from "@/i18n/useLocale";

const statuses: readonly RequestStatus[] = ["open", "inProgress", "scheduled", "completed", "onHold"];
const priorities: readonly Priority[] = ["low", "medium", "high", "critical"];

function RequestDetails({ request, onClose }: { readonly request: DemoRequest | undefined; readonly onClose: () => void }): React.JSX.Element | null {
  const { locale, t } = useLocale();
  if (!request) return null;
  const technician = findTechnician(request.technicianId);
  return <DetailPanel onClose={onClose} open title={request.id}>
    <div className="space-y-7"><div><p className="text-lg font-semibold">{t(request.subjectKey)}</p><p className="mt-2 text-sm text-muted-foreground">{t(request.customerKey)} · {t(request.buildingKey)}</p><div className="mt-4 flex flex-wrap gap-2"><StatusBadge status={request.status} /><PriorityBadge priority={request.priority} /></div></div>
      <dl className="grid grid-cols-2 gap-4 rounded-xl bg-muted/60 p-4 text-sm"><div><dt className="text-muted-foreground">{t("requests.opened")}</dt><dd className="mt-1 font-semibold">{formatDate(request.openedAt, locale)}</dd></div><div><dt className="text-muted-foreground">{t("requests.technician")}</dt><dd className="mt-1 font-semibold">{technician ? t(technician.nameKey) : t("common.notAssigned")}</dd></div></dl>
      <section><h3 className="font-semibold">{t("requests.timeline")}</h3><ol className="mt-4 space-y-4 border-s border-border ps-5">{request.timeline.map((item) => <li className="relative" key={`${item.key}-${item.at}`}><span className="absolute -start-[1.42rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" /><p className="text-sm font-medium">{t(item.key)}</p><time className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.at, locale)}</time></li>)}</ol></section>
      <div className="grid grid-cols-2 gap-3"><Button disabled title={t("common.previewOnly")}>{t("requests.addNote")}</Button><Button disabled title={t("common.previewOnly")} variant="outline">{t("requests.archive")}</Button></div>
    </div>
  </DetailPanel>;
}

export function RequestsPage(): React.JSX.Element {
  const { locale, t } = useLocale();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | RequestStatus>("all");
  const [priority, setPriority] = useState<"all" | Priority>("all");
  const [selected, setSelected] = useState<DemoRequest>();
  const normalized = query.trim().toLocaleLowerCase(locale);
  const filtered = demoRequests.filter((item) =>
    (status === "all" || item.status === status) &&
    (priority === "all" || item.priority === priority) &&
    (!normalized || [item.id, t(item.subjectKey), t(item.buildingKey)].some((value) => value.toLocaleLowerCase(locale).includes(normalized))),
  );
  const clear = (): void => { setQuery(""); setStatus("all"); setPriority("all"); };
  const columns: readonly DataColumn<DemoRequest>[] = [
    { key: "request", header: t("requests.subject"), cell: (item) => <><strong>{item.id}</strong><span className="mt-1 block text-muted-foreground">{t(item.subjectKey)}</span></> },
    { key: "status", header: t("common.status"), cell: (item) => <StatusBadge status={item.status} /> },
    { key: "priority", header: t("requests.priority"), cell: (item) => <PriorityBadge priority={item.priority} /> },
    { key: "technician", header: t("requests.technician"), cell: (item) => { const technician = findTechnician(item.technicianId); return technician ? t(technician.nameKey) : t("common.notAssigned"); } },
    { key: "updated", header: t("requests.updated"), cell: (item) => <span className="text-muted-foreground">{formatDate(item.updatedAt, locale)}</span> },
    { key: "actions", header: t("common.actions"), cell: (item) => <Button aria-label={`${t("common.viewDetails")} ${item.id}`} onClick={() => { setSelected(item); }} size="sm" variant="ghost">{t("common.viewDetails")}</Button> },
  ];

  return <div className="space-y-7"><PageHeader descriptionKey="requests.description" icon={ClipboardList} titleKey="requests.title" />
    <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-[1fr_13rem_13rem]"><SearchField onChange={setQuery} placeholder={t("requests.searchPlaceholder")} value={query} /><Select aria-label={t("requests.statusFilter")} onChange={(event) => { setStatus(event.target.value as typeof status); }} value={status}><option value="all">{t("common.all")}</option>{statuses.map((item) => <option key={item} value={item}>{t(`status.${item}`)}</option>)}</Select><Select aria-label={t("requests.priorityFilter")} onChange={(event) => { setPriority(event.target.value as typeof priority); }} value={priority}><option value="all">{t("common.all")}</option>{priorities.map((item) => <option key={item} value={item}>{t(`priority.${item}`)}</option>)}</Select></div>
    {filtered.length === 0 ? <EmptyState onClear={clear} /> : <><DataTable columns={columns} items={filtered} rowKey={(item) => item.id} /><div className="grid gap-3 md:hidden">{filtered.map((item) => <Card className="p-4" key={item.id}><div className="flex items-start justify-between gap-3"><div><strong>{item.id}</strong><p className="mt-1 text-sm text-muted-foreground">{t(item.subjectKey)}</p></div><StatusBadge status={item.status} /></div><div className="mt-4 flex items-center justify-between"><PriorityBadge priority={item.priority} /><Button onClick={() => { setSelected(item); }} size="sm" variant="outline">{t("common.viewDetails")}</Button></div></Card>)}</div></>}
    <RequestDetails onClose={() => { setSelected(undefined); }} request={selected} />
  </div>;
}
