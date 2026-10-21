import { useEffect, useId, useRef, type PropsWithChildren } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/useLocale";

export function DetailPanel({ children, open, onClose, title }: PropsWithChildren<{ readonly open: boolean; readonly onClose: () => void; readonly title: string }>): React.JSX.Element | null {
  const { t } = useLocale();
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || panelRef.current === null) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])")];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, [onClose, open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50"><button aria-label={t("common.close")} className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]" onClick={onClose} type="button" /><aside aria-labelledby={titleId} aria-modal="true" className="absolute inset-y-0 end-0 w-full max-w-lg overflow-y-auto border-s border-border bg-background p-6 shadow-2xl outline-none sm:p-8" ref={panelRef} role="dialog" tabIndex={-1}><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-bold" id={titleId}>{title}</h2><Button aria-label={t("common.close")} onClick={onClose} size="icon" variant="ghost"><X aria-hidden="true" /></Button></div><div className="mt-7">{children}</div></aside></div>;
}
