import { z } from "zod";
import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { ThemeContext, themeStorageKey, type Theme } from "./theme-context";

const themeSchema = z.enum(["light", "dark"]);
type ValidTheme = z.infer<typeof themeSchema>;

function readTheme(): ValidTheme {
  try {
    const stored = themeSchema.safeParse(localStorage.getItem(themeStorageKey));
    if (stored.success) return stored.data;
  } catch { return "light"; }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [theme, setTheme] = useState<Theme>(readTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem(themeStorageKey, theme); } catch { /* Session-only fallback. */ }
  }, [theme]);
  const toggleTheme = useCallback(() => { setTheme((value) => value === "light" ? "dark" : "light"); }, []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

