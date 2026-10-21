import { I18nextProvider } from "react-i18next";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { i18n } from "i18next";

import { synchronizeDocumentLocale } from "./document";
import {
  LocaleContext,
  type LocaleContextValue,
} from "./locale-context";
import type { MessageKey } from "./messages/en";
import { storeLocale } from "./storage";
import {
  defaultLocale,
  isLocale,
  localeDirection,
  type Locale,
} from "./types";

function resolveLocale(instance: i18n): Locale {
  const language = instance.resolvedLanguage ?? instance.language;
  return isLocale(language) ? language : defaultLocale;
}

interface LocaleProviderProps extends PropsWithChildren {
  readonly instance: i18n;
}

export function LocaleProvider({
  children,
  instance,
}: LocaleProviderProps): React.JSX.Element {
  const [locale, setActiveLocale] = useState<Locale>(() =>
    resolveLocale(instance),
  );

  useEffect(() => {
    const synchronize = (nextLanguage: string): void => {
      const nextLocale = isLocale(nextLanguage) ? nextLanguage : defaultLocale;
      setActiveLocale(nextLocale);
      synchronizeDocumentLocale(nextLocale);
      storeLocale(nextLocale);
    };

    synchronize(resolveLocale(instance));
    instance.on("languageChanged", synchronize);

    return () => {
      instance.off("languageChanged", synchronize);
    };
  }, [instance]);

  const setLocale = useCallback(
    (nextLocale: Locale): void => {
      void instance.changeLanguage(nextLocale);
    },
    [instance],
  );

  const translate = useCallback(
    (key: MessageKey): string => instance.t(key, { lng: locale }),
    [instance, locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: localeDirection[locale],
      setLocale,
      t: translate,
    }),
    [locale, setLocale, translate],
  );

  return (
    <I18nextProvider i18n={instance}>
      <LocaleContext.Provider value={value}>
        {children}
      </LocaleContext.Provider>
    </I18nextProvider>
  );
}
