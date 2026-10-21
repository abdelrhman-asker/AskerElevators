import { createInstance, type i18n } from "i18next";

import { arabicMessages } from "./messages/ar";
import { englishMessages } from "./messages/en";
import { readStoredLocale } from "./storage";
import { defaultLocale, supportedLocales, type Locale } from "./types";

export async function createAppI18n(
  initialLocale: Locale = readStoredLocale(),
): Promise<i18n> {
  const instance = createInstance();

  await instance.init({
    lng: initialLocale,
    fallbackLng: defaultLocale,
    supportedLngs: [...supportedLocales],
    resources: {
      ar: { translation: arabicMessages },
      en: { translation: englishMessages },
    },
    interpolation: {
      escapeValue: false,
    },
    initAsync: false,
  });

  return instance;
}
