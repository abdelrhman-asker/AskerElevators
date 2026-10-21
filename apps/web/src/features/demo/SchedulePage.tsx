import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/demo/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { demoVisits, findTechnician } from "@/demo/data";
import { formatDate, formatMonth } from "@/demo/format";
import { useLocale } from "@/i18n/useLocale";

const demoMonth = new Date(2026, 9, 1);
function calendarDays(month: Date): readonly (number | null)[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [...Array<null>(first).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
}

export function SchedulePage(): React.JSX.Element {
  const { locale, t } = useLocale(); const [month, setMonth] = useState(demoMonth);
  const days = useMemo(() => calendarDays(month), [month]);
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", { weekday: "short" }).format(new Date(2026, 1, 1 + index))), [locale]);
  const changeMonth = (amount: number): void => { setMonth((value) => new Date(value.getFullYear(), value.getMonth() + amount, 1)); };
  return <div className="space-y-7"><PageHeader descriptionKey="schedule.description" icon={CalendarDays} titleKey="schedule.title" /><div className="grid gap-6 xl:grid-cols-[1fr_22rem]"><Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-border p-4 sm:p-5"><Button aria-label={t("common.previous")} onClick={() => { changeMonth(-1); }} size="icon" variant="ghost"><ChevronLeft aria-hidden="true" /></Button><div className="text-center"><h2 className="font-bold">{formatMonth(month, locale)}</h2><Button className="mt-1 h-auto p-0 text-xs" onClick={() => { setMonth(demoMonth); }} variant="ghost">{t("schedule.today")}</Button></div><Button aria-label={t("common.next")} onClick={() => { changeMonth(1); }} size="icon" variant="ghost"><ChevronRight aria-hidden="true" /></Button></div><div className="grid grid-cols-7 border-b border-border bg-muted/50">{weekdays.map((day, index) => <div className="p-2 text-center text-xs font-bold text-muted-foreground" key={`${day}-${index}`}>{day}</div>)}</div><div className="grid grid-cols-7">{days.map((day, index) => { const isoDate = day ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : ""; const visits = demoVisits.filter((visit) => visit.date === isoDate); return <div className="min-h-20 border-b border-e border-border p-1.5 sm:min-h-28 sm:p-2" key={`${day ?? "blank"}-${index}`}>{day && <><span className="text-xs font-semibold">{new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(day)}</span><div className="mt-1 space-y-1">{visits.map((visit) => <div className="truncate rounded-md bg-primary px-1.5 py-1 text-[10px] font-semibold text-primary-foreground sm:text-xs" key={visit.id} title={`${visit.elevatorId} ${visit.startTime}`}>{visit.elevatorId}<span className="hidden sm:inline"> · {visit.startTime}</span></div>)}</div></>}</div>; })}</div></Card>
      <Card><CardHeader><CardTitle>{t("schedule.upcomingVisits")}</CardTitle></CardHeader><div className="space-y-3 px-5 pb-5">{demoVisits.map((visit) => { const technician = findTechnician(visit.technicianId); return <article className="rounded-xl border border-border p-4" key={visit.id}><div className="flex items-center justify-between gap-3"><strong className="text-sm">{visit.elevatorId}</strong><span className="flex items-center gap-1 text-xs text-primary"><Clock3 aria-hidden="true" className="size-3" />{visit.startTime}–{visit.endTime}</span></div><p className="mt-2 text-sm text-muted-foreground">{t(visit.buildingKey)}</p><p className="mt-2 text-xs text-muted-foreground">{formatDate(visit.date, locale)} · {technician ? t(technician.nameKey) : t("common.notAssigned")}</p></article>; })}</div></Card></div></div>;
}
