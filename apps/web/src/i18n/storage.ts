import { defaultLocale, isLocale, type Locale } from "./types";

export const localeStorageKey = "elevator.locale.v1";

export function readStoredLocale(): Locale {
  try {
    const storedLocale = globalThis.localStorage?.getItem(localeStorageKey);
    return isLocale(storedLocale) ? storedLocale : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export function storeLocale(locale: Locale): void {
  try {
    globalThis.localStorage?.setItem(localeStorageKey, locale);
  } catch {
    // A blocked preference store must not prevent language switching.
  }
}
