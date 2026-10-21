import { LoaderCircle } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export function PageLoader(): React.JSX.Element {
  const { t } = useLocale();
  return <div aria-live="polite" className="grid min-h-72 place-items-center" role="status"><span className="flex items-center gap-3 text-sm text-muted-foreground"><LoaderCircle aria-hidden="true" className="size-5 animate-spin" />{t("health.loading")}</span></div>;
}
