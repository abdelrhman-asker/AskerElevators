import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/useLocale";

export function EmptyState({ onClear }: { readonly onClear: () => void }): React.JSX.Element {
  const { t } = useLocale();
  return <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center"><div><SearchX aria-hidden="true" className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-4 font-semibold">{t("common.noResults")}</h2><p className="mt-2 text-sm text-muted-foreground">{t("common.noResultsDescription")}</p><Button className="mt-5" onClick={onClear} variant="outline">{t("common.clearFilters")}</Button></div></div>;
}
