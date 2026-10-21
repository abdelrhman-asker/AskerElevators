import { createContext } from "react";

import type { MessageKey } from "./messages/en";
import type { Locale } from "./types";

export interface LocaleContextValue {
  readonly locale: Locale;
  readonly direction: "rtl" | "ltr";
  readonly setLocale: (locale: Locale) => void;
  readonly t: (key: MessageKey) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
