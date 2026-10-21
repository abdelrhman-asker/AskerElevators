import type { Locale } from "@/i18n/types";

function intlLocale(locale: Locale): string { return locale === "ar" ? "ar-EG" : "en-US"; }
export function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`));
}
export function formatDateTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
export function formatMonth(value: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { month: "long", year: "numeric" }).format(value);
}
