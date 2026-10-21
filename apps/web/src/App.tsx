import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import type { i18n } from "i18next";
import { RouterProvider } from "react-router-dom";

import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

type ApplicationRouter = ComponentProps<typeof RouterProvider>["router"];

interface AppProps {
  readonly i18n: i18n;
  readonly router: ApplicationRouter;
  readonly queryClient: QueryClient;
}

export function App({
  i18n,
  queryClient,
  router,
}: AppProps): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocaleProvider instance={i18n}>
          <RouterProvider router={router} />
        </LocaleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
