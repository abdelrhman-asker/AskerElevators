import { Building2 } from "lucide-react";
import { Outlet } from "react-router-dom";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PageContainer } from "@/components/PageContainer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocale } from "@/i18n/useLocale";

export function AppLayout(): React.JSX.Element {
  const { t } = useLocale();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur">
        <PageContainer className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building2 aria-hidden="true" className="size-5" />
            </span>
            <span className="truncate text-base font-bold tracking-tight sm:text-lg">
              {t("app.title")}
            </span>
          </div>
          <div className="flex items-center gap-2"><LanguageSwitcher /><ThemeToggle /></div>
        </PageContainer>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
