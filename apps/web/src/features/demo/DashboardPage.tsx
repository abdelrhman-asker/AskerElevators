import { CalendarCheck2, CircleCheckBig, ClipboardList, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/demo/PageHeader";
import { StatCard } from "@/components/demo/StatCard";
import { StatusBadge } from "@/components/demo/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { demoActivity, demoElevators, demoRequests, demoTechnicians, demoVisits, findTechnician } from "@/demo/data";
import { formatDate, formatDateTime } from "@/demo/format";
import { useLocale } from "@/i18n/useLocale";

export function DashboardPage(): React.JSX.Element {
  const { locale, t } = useLocale();
  const activeRequests = demoRequests.filter((item) => item.status !== "completed").length;
  const operational = demoElevators.filter((item) => item.status === "operational").length;
  const available = demoTechnicians.filter((item) => item.status === "available").length;
  return <div className="space-y-7"><PageHeader descriptionKey="dashboard.description" icon={CircleCheckBig} titleKey="dashboard.title" />
    <section aria-label={t("dashboard.title")} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={ClipboardList} label={t("dashboard.activeRequests")} note={t("demo.label")} value={activeRequests} /><StatCard icon={CircleCheckBig} label={t("dashboard.totalElevators")} note={`${operational} ${t("status.operational")}`} value={demoElevators.length} /><StatCard icon={CalendarCheck2} label={t("dashboard.scheduledVisits")} note={t("demo.label")} value={demoVisits.length} /><StatCard icon={UsersRound} label={t("dashboard.availableTechnicians")} note={`${available} / ${demoTechnicians.length}`} value={available} /></section>
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><Card><CardHeader><CardTitle>{t("dashboard.recentActivity")}</CardTitle><CardDescription>{t("demo.description")}</CardDescription></CardHeader><ul className="divide-y divide-border px-6 pb-2">{demoActivity.map((item) => <li className="flex gap-4 py-4" key={`${item.key}-${item.at}`}><span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary ring-4 ring-primary/10" /><div><p className="text-sm font-medium">{t(item.key)}</p><time className="mt-1 block text-xs text-muted-foreground" dateTime={item.at}>{formatDateTime(item.at, locale)}</time></div></li>)}</ul></Card>
      <Card><CardHeader><CardTitle>{t("dashboard.upcoming")}</CardTitle><CardDescription>{t("schedule.preventive")}</CardDescription></CardHeader><div className="space-y-3 px-6 pb-6">{demoVisits.slice(0, 3).map((visit) => { const technician = findTechnician(visit.technicianId); return <div className="rounded-xl border border-border p-4" key={visit.id}><div className="flex items-center justify-between gap-3"><strong className="text-sm">{visit.elevatorId}</strong><span className="text-xs font-semibold text-primary">{visit.startTime}</span></div><p className="mt-2 text-sm text-muted-foreground">{t(visit.buildingKey)}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(visit.date, locale)} · {technician ? t(technician.nameKey) : t("common.notAssigned")}</p></div>; })}</div></Card></div>
    <div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>{t("dashboard.statusOverview")}</CardTitle></CardHeader><div className="space-y-4 px-6 pb-6">{(["operational", "maintenance", "outOfService"] as const).map((status) => { const count = demoElevators.filter((item) => item.status === status).length; return <div key={status}><div className="mb-2 flex items-center justify-between"><StatusBadge status={status} /><span className="text-sm font-bold">{count}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(count / demoElevators.length) * 100}%` }} /></div></div>; })}</div></Card>
      <Card><CardHeader><CardTitle>{t("dashboard.quickActions")}</CardTitle><CardDescription>{t("dashboard.quickActionsDescription")}</CardDescription></CardHeader><div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">{([["/demo/requests", "nav.requests"], ["/demo/elevators", "nav.elevators"], ["/demo/schedule", "nav.schedule"]] as const).map(([to, key]) => <Button asChild key={to} variant="outline"><Link to={to}>{t(key)}</Link></Button>)}<Button disabled title={t("common.previewOnly")} variant="outline">{t("dashboard.exportReport")}</Button></div></Card></div>
  </div>;
}
