import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "@/App";
import { createAppQueryClient } from "@/app/query-client";
import { createRoutes } from "@/app/router";
import { createAppI18n } from "@/i18n/i18n";
import { localeStorageKey } from "@/i18n/storage";
import { createApiClient } from "@/lib/api-client";

const validHealthResponse = {
  status: "ok",
  service: "elevator-api",
  timestamp: "2026-10-18T12:00:00.000Z",
};

async function renderApplication(path = "/") {
  const instance = await createAppI18n();
  const apiClient = createApiClient("http://localhost:3100");
  const router = createMemoryRouter(createRoutes(apiClient), {
    initialEntries: [path],
  });

  return render(
    <App
      i18n={instance}
      queryClient={createAppQueryClient()}
      router={router}
    />,
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(validHealthResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );
  });

  it("renders the Arabic application foundation by default", async () => {
    await renderApplication();

    expect(
      screen.getByRole("heading", {
        name: "رؤية واضحة لكل عمليات خدمة المصاعد.",
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("الخدمة متاحة"),
    ).toBeInTheDocument();
  });

  it("switches to English and updates language, direction, and text", async () => {
    const user = userEvent.setup();
    await renderApplication();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(
      await screen.findByRole("heading", {
        name: "One clear view of every elevator service operation.",
      }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(
      screen.getByRole("button", { name: "English" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("restores the persisted language in a new application instance", async () => {
    localStorage.setItem(localeStorageKey, "en");

    await renderApplication();

    expect(
      await screen.findByText("Explore a bilingual product prototype for coordinating maintenance, customers, technicians, and equipment. Demo records are illustrative and are never sent to the API."),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });

  it("renders the accessible localized not-found route", async () => {
    await renderApplication("/missing-page");

    expect(
      screen.getByRole("heading", { name: "الصفحة غير موجودة" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "العودة إلى الصفحة الرئيسية" }),
    ).toHaveAttribute("href", "/");
  });

  it("handles a backend connectivity failure without exposing details", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("secret"))));

    await renderApplication();

    expect(
      await screen.findByText("الخدمة غير متاحة حاليًا"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/secret/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/localhost/i)).not.toBeInTheDocument();
  });

  it("treats a malformed successful response as unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ status: "ok" }), { status: 200 }),
        ),
      ),
    );

    await renderApplication();

    expect(
      await screen.findByText("الخدمة غير متاحة حاليًا"),
    ).toBeInTheDocument();
  });

  it("aborts the health request when the route tree unmounts", async () => {
    let requestSignal: AbortSignal | null = null;
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        requestSignal = init?.signal ?? null;
        return new Promise<Response>(() => undefined);
      }),
    );

    const view = await renderApplication();
    expect(screen.getByText("جارٍ التحقق من الخدمة…")).toBeInTheDocument();

    view.unmount();

    await waitFor(() => {
      expect(requestSignal?.aborted).toBe(true);
    });
  });
});
