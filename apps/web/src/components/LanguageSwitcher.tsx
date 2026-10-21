import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/useLocale";

export function LanguageSwitcher(): React.JSX.Element {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      aria-label={t("language.label")}
      className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 shadow-sm"
      role="group"
    >
      <Languages aria-hidden="true" className="mx-2 size-4 text-primary" />
      <Button
        aria-pressed={locale === "ar"}
        className="min-w-20"
        onClick={() => {
          setLocale("ar");
        }}
        size="sm"
        type="button"
        variant={locale === "ar" ? "default" : "ghost"}
      >
        {t("language.arabic")}
      </Button>
      <Button
        aria-pressed={locale === "en"}
        className="min-w-20"
        onClick={() => {
          setLocale("en");
        }}
        size="sm"
        type="button"
        variant={locale === "en" ? "default" : "ghost"}
      >
        {t("language.english")}
      </Button>
    </div>
  );
}
