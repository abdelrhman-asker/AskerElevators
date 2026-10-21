import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n/useLocale";

export function SearchField({ value, onChange, placeholder }: { readonly value: string; readonly onChange: (value: string) => void; readonly placeholder: string }): React.JSX.Element {
  const { t } = useLocale();
  return <label className="relative block min-w-0 flex-1"><span className="sr-only">{t("common.search")}</span><Search aria-hidden="true" className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="ps-9" onChange={(event) => { onChange(event.target.value); }} placeholder={placeholder} value={value} /></label>;
}
