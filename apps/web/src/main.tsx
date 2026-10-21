import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/App";
import { createAppQueryClient } from "@/app/query-client";
import { createAppRouter } from "@/app/router";
import { parseWebEnv } from "@/config/env";
import { createAppI18n } from "@/i18n/i18n";
import { synchronizeDocumentLocale } from "@/i18n/document";
import { isLocale } from "@/i18n/types";
import { createApiClient } from "@/lib/api-client";

import "./index.css";

async function bootstrap(): Promise<void> {
  const config = parseWebEnv(import.meta.env);
  const i18n = await createAppI18n();
  const locale = i18n.resolvedLanguage;

  if (isLocale(locale)) {
    synchronizeDocumentLocale(locale);
  }

  const rootElement = document.querySelector<HTMLDivElement>("#root");
  if (rootElement === null) {
    throw new Error("Application root element was not found");
  }

  const apiClient = createApiClient(config.apiBaseUrl);

  createRoot(rootElement).render(
    <StrictMode>
      <App
        i18n={i18n}
        queryClient={createAppQueryClient()}
        router={createAppRouter(apiClient)}
      />
    </StrictMode>,
  );
}

void bootstrap();
