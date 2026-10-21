import type { LucideIcon } from "lucide-react";
import type { MessageKey } from "@/i18n/messages/en";
import { useLocale } from "@/i18n/useLocale";

export function PageHeader({ titleKey, descriptionKey, icon: Icon }: { readonly titleKey: MessageKey; readonly descriptionKey: MessageKey; readonly icon: LucideIcon }): React.JSX.Element {
  const { t } = useLocale();
  return <header className="flex items-start gap-4"><span className="mt-1 grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(titleKey)}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{t(descriptionKey)}</p></div></header>;
}
