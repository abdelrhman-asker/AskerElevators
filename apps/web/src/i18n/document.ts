import { localeDirection, type Locale } from "./types";

export function synchronizeDocumentLocale(locale: Locale): void {
  document.documentElement.lang = locale;
  document.documentElement.dir = localeDirection[locale];
}
