import { CheckCircle2, LoaderCircle, WifiOff } from "lucide-react";

import { useHealthQuery } from "@/hooks/useHealthQuery";
import { useLocale } from "@/i18n/useLocale";
import type { ApiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface ApiStatusProps {
  readonly apiClient: ApiClient;
}

export function ApiStatus({ apiClient }: ApiStatusProps): React.JSX.Element {
  const health = useHealthQuery(apiClient);
  const { t } = useLocale();
  const state = health.isPending
    ? "loading"
    : health.isSuccess
      ? "reachable"
      : "unavailable";

  const Icon =
    state === "loading"
      ? LoaderCircle
      : state === "reachable"
        ? CheckCircle2
        : WifiOff;

  return (
    <div
      aria-live="polite"
      className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-muted/45 px-4 py-3"
      role="status"
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full",
          state === "loading" && "bg-primary/10 text-primary",
          state === "reachable" && "bg-success/10 text-success",
          state === "unavailable" && "bg-warning/10 text-warning",
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn("size-4", state === "loading" && "animate-spin")}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("health.label")}
        </span>
        <span className="mt-0.5 block text-sm font-medium">
          {t(`health.${state}`)}
        </span>
      </span>
    </div>
  );
}
