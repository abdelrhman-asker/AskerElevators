import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/useLocale";
import { useTheme } from "@/theme/theme-context";

export function ThemeToggle(): React.JSX.Element {
  const { t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "dark" : "light";
  return <Button aria-label={t(`theme.${nextTheme}`)} onClick={toggleTheme} size="icon" type="button" variant="ghost">
    {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
  </Button>;
}
