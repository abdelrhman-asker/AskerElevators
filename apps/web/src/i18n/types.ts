export const supportedLocales = ["ar", "en"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "ar";

export const localeDirection: Readonly<Record<Locale, "rtl" | "ltr">> = {
  ar: "rtl",
  en: "ltr",
};

export function isLocale(value: unknown): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}
