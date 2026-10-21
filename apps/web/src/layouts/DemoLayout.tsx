import { useCallback, useState } from "react";
import { Building2, CalendarDays, ChevronsLeftRight, Gauge, Globe2, Menu, PanelLeftClose, PanelLeftOpen, Users, Wrench, type LucideIcon } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { DemoBadge } from "@/components/demo/DemoBadge";
import { DetailPanel } from "@/components/demo/DetailPanel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import type { MessageKey } from "@/i18n/messages/en";
import { useLocale } from "@/i18n/useLocale";
import { cn } from "@/lib/utils";

interface NavItem { readonly to: string; readonly labelKey: MessageKey; readonly icon: LucideIcon; readonly end?: boolean }
const navItems: readonly NavItem[] = [
  { to: "/demo", labelKey: "nav.dashboard", icon: Gauge, end: true },
  { to: "/demo/requests", labelKey: "nav.requests", icon: Wrench },
  { to: "/demo/elevators", labelKey: "nav.elevators", icon: Building2 },
  { to: "/demo/customers", labelKey: "nav.customers", icon: Globe2 },
  { to: "/demo/technicians", labelKey: "nav.technicians", icon: Users },
  { to: "/demo/schedule", labelKey: "nav.schedule", icon: CalendarDays },
];

function SidebarNavigation({ collapsed = false, onNavigate }: { readonly collapsed?: boolean; readonly onNavigate?: (() => void) | undefined }): React.JSX.Element {
  const { t } = useLocale();
  return <nav aria-label={t("demo.workspace")} className="space-y-1">
    {navItems.map(({ end, icon: Icon, labelKey, to }) => <NavLink className={({ isActive }) => cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground", collapsed && "justify-center px-0")} end={end ?? false} key={to} onClick={() => { onNavigate?.(); }} {...(collapsed ? { title: t(labelKey) } : {})} to={to}><Icon aria-hidden="true" className="size-5 shrink-0" />{!collapsed && <span>{t(labelKey)}</span>}</NavLink>)}
  </nav>;
}

function SidebarContent({ collapsed = false, onNavigate }: { readonly collapsed?: boolean; readonly onNavigate?: (() => void) | undefined }): React.JSX.Element {
  const { t } = useLocale();
  return <div className="flex h-full flex-col">
    <div className={cn("flex h-20 items-center gap-3 border-b border-border px-5", collapsed && "justify-center px-2")}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><ChevronsLeftRight aria-hidden="true" className="size-5" /></span>{!collapsed && <div className="min-w-0"><p className="truncate font-bold">{t("app.title")}</p><p className="truncate text-xs text-muted-foreground">{t("demo.workspace")}</p></div>}</div>
    <div className="flex-1 overflow-y-auto p-3"><SidebarNavigation collapsed={collapsed} onNavigate={onNavigate} /></div>
    <div className="space-y-3 border-t border-border p-3">{!collapsed && <DemoBadge />}
      <NavLink className={({ isActive }) => cn("flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground", isActive && "bg-muted text-foreground", collapsed && "justify-center px-0")} onClick={onNavigate} title={collapsed ? t("nav.website") : undefined} to="/website-preview"><Globe2 aria-hidden="true" className="size-5 shrink-0" />{!collapsed && t("nav.website")}</NavLink>
      <NavLink className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onNavigate} to="/"><Building2 aria-hidden="true" className="size-5 shrink-0" />{!collapsed && t("nav.foundation")}</NavLink>
      {!collapsed && <div className="lg:hidden"><LanguageSwitcher /></div>}
    </div>
  </div>;
}

function currentTitle(pathname: string): MessageKey {
  return navItems.find((item) => item.end ? pathname === item.to : pathname.startsWith(item.to))?.labelKey ?? "nav.dashboard";
}

export function DemoLayout(): React.JSX.Element {
  const { t } = useLocale();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => { setMobileOpen(false); }, []);
  const titleKey = currentTitle(location.pathname);

  return <div className="flex min-h-dvh bg-background text-foreground">
    <aside className={cn("sticky top-0 hidden h-dvh shrink-0 border-e border-border bg-surface transition-[width] lg:block", collapsed ? "w-20" : "w-64")}><SidebarContent collapsed={collapsed} /><Button aria-label={t(collapsed ? "common.expand" : "common.collapse")} className="absolute -end-5 top-24 z-10 rounded-full bg-surface shadow-md" onClick={() => { setCollapsed((value) => !value); }} size="icon" variant="outline">{collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}</Button></aside>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-3 border-b border-border bg-background/92 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3"><Button aria-label={t("common.menu")} className="lg:hidden" onClick={() => { setMobileOpen(true); }} size="icon" variant="outline"><Menu aria-hidden="true" /></Button><div className="min-w-0"><p className="truncate text-xs font-semibold text-primary">{t("demo.breadcrumb")} / {t(titleKey)}</p><p className="truncate font-bold sm:text-lg">{t(titleKey)}</p></div></div>
        <div className="flex items-center gap-1"><div className="hidden md:block"><LanguageSwitcher /></div><ThemeToggle /></div>
      </header>
      <main className="mx-auto w-full max-w-[96rem] p-4 sm:p-6 lg:p-8"><Outlet /></main>
    </div>
    <DetailPanel onClose={closeMobile} open={mobileOpen} title={t("demo.workspace")}><div className="-mx-3"><SidebarContent onNavigate={closeMobile} /></div></DetailPanel>
  </div>;
}
