import { FlaskConical } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

export function DemoBadge({ compact = false }: { readonly compact?: boolean }): React.JSX.Element {
  const { t } = useLocale();
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-xs font-bold text-primary"><FlaskConical aria-hidden="true" className="size-3.5" />{compact ? t("demo.label") : t("demo.description")}</span>;
}
