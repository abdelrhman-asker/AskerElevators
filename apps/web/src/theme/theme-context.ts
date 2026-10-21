import { createContext, useContext } from "react";

export type Theme = "light" | "dark";
export const themeStorageKey = "elevator.theme.v1";
export interface ThemeContextValue { readonly theme: Theme; readonly toggleTheme: () => void }
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
