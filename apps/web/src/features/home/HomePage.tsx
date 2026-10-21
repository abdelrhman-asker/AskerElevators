import { ArrowUpRight, Globe2, Languages, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ApiStatus } from "@/components/ApiStatus";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { useLocale } from "@/i18n/useLocale";
import type { ApiClient } from "@/lib/api-client";

export function HomePage({ apiClient }: { readonly apiClient: ApiClient }): React.JSX.Element {
  const { direction, t } = useLocale();
  return <PageContainer className="py-10 sm:py-14 lg:py-18">
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-10 shadow-sm sm:px-10 sm:py-14 lg:px-14"><div aria-hidden="true" className="elevator-lines" /><div className="relative max-w-3xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">{t("app.eyebrow")}</p><h1 className="max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{t("app.heading")}</h1><p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">{t("app.introduction")}</p><div className="mt-8 flex flex-wrap gap-3"><Link className={buttonVariants({ size: "lg" })} to="/demo">{t("app.openDemo")}<ArrowUpRight aria-hidden="true" className="size-4" /></Link><Link className={buttonVariants({ size: "lg", variant: "outline" })} to="/website-preview">{t("app.openWebsite")}</Link></div><div className="mt-8 max-w-md"><ApiStatus apiClient={apiClient} /></div></div></section>
    <section className="mt-6 grid gap-6 md:grid-cols-2"><Card className="group transition hover:-translate-y-0.5 hover:shadow-md"><CardHeader><span className="mb-2 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><LayoutDashboard aria-hidden="true" className="size-5" /></span><CardTitle>{t("app.demoCard.title")}</CardTitle><CardDescription>{t("app.demoCard.description")}</CardDescription><Link className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary" to="/demo">{t("app.openDemo")}<ArrowUpRight aria-hidden="true" className="size-4" /></Link></CardHeader></Card><Card className="group transition hover:-translate-y-0.5 hover:shadow-md"><CardHeader><span className="mb-2 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Globe2 aria-hidden="true" className="size-5" /></span><CardTitle>{t("app.websiteCard.title")}</CardTitle><CardDescription>{t("app.websiteCard.description")}</CardDescription><Link className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary" to="/website-preview">{t("app.openWebsite")}<ArrowUpRight aria-hidden="true" className="size-4" /></Link></CardHeader></Card></section>
    <section className="mt-6 grid gap-6 md:grid-cols-2"><Card><CardHeader><Languages aria-hidden="true" className="size-5 text-primary" /><CardTitle>{t("foundation.localization.title")}</CardTitle><CardDescription>{t("foundation.localization.description")}</CardDescription></CardHeader></Card><Card><CardHeader><ShieldCheck aria-hidden="true" className="size-5 text-primary" /><CardTitle>{t("foundation.quality.title")}</CardTitle><CardDescription>{t("foundation.quality.description")}</CardDescription></CardHeader></Card></section>
    <p className="mt-8 text-center text-xs text-muted-foreground">{t("app.localeDirection")}: {t(`app.direction.${direction}`)}</p>
  </PageContainer>;
}
