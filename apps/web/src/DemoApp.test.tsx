import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "@/App";
import { createAppQueryClient } from "@/app/query-client";
import { createRoutes } from "@/app/router";
import { createAppI18n } from "@/i18n/i18n";
import { localeStorageKey } from "@/i18n/storage";
import { createApiClient } from "@/lib/api-client";
import { themeStorageKey } from "@/theme/theme-context";

async function renderAt(path: string, locale: "ar" | "en" = "en") {
  localStorage.setItem(localeStorageKey, locale);
  const instance = await createAppI18n();
  const router = createMemoryRouter(createRoutes(createApiClient("http://localhost:3100")), { initialEntries: [path] });
  return { router, ...render(<App i18n={instance} queryClient={createAppQueryClient()} router={router} />) };
}

describe("interactive frontend preview", () => {
  beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });

  it("navigates between demo routes without a page reload", async () => {
    const user = userEvent.setup();
    await renderAt("/demo");
    expect(await screen.findByRole("heading", { name: "Operations overview" })).toBeInTheDocument();
    const navigation = screen.getByRole("navigation", { name: "Operations workspace" });
    await user.click(within(navigation).getByRole("link", { name: "Requests" }));
    expect(await screen.findByRole("heading", { name: "Maintenance requests" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Requests" })).toHaveAttribute("aria-current", "page");
  });

  it("filters request data and exposes a recoverable empty state", async () => {
    const user = userEvent.setup();
    await renderAt("/demo/requests");
    const search = await screen.findByPlaceholderText("Search request ID, subject, or building");
    await user.type(search, "record-that-does-not-exist");
    expect(screen.getByRole("heading", { name: "No matching demo records" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.queryByRole("heading", { name: "No matching demo records" })).not.toBeInTheDocument();
    expect(screen.getAllByText("REQ-DEMO-1042").length).toBeGreaterThan(0);
  });

  it("filters by status and opens a request detail panel", async () => {
    const user = userEvent.setup();
    await renderAt("/demo/requests");
    await user.selectOptions(await screen.findByLabelText("Filter by status"), "open");
    expect(screen.getAllByText("REQ-DEMO-1045").length).toBeGreaterThan(0);
    expect(screen.queryByText("REQ-DEMO-1042")).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "View details" })[0]!);
    const dialog = screen.getByRole("dialog", { name: "REQ-DEMO-1045" });
    expect(within(dialog).getByText("Activity timeline")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Archive request" })).toBeDisabled();
  });

  it("provides a keyboard-accessible mobile navigation drawer", async () => {
    const user = userEvent.setup();
    await renderAt("/demo");
    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    const dialog = screen.getByRole("dialog", { name: "Operations workspace" });
    await user.click(within(dialog).getByRole("link", { name: "Customers" }));
    expect(await screen.findByRole("heading", { name: "Customer organizations" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Operations workspace" })).not.toBeInTheDocument();
  });

  it("keeps the demo context visible and preview mutations disabled", async () => {
    await renderAt("/demo");
    expect((await screen.findAllByText("Demo Preview")).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Elevators" }).some((link) => link.getAttribute("href") === "/demo/elevators")).toBe(true);
    expect(screen.getByRole("button", { name: "Export report" })).toBeDisabled();
  });

  it("renders the website preview without unsupported commercial claims", async () => {
    await renderAt("/website-preview");
    expect(await screen.findByRole("heading", { name: "Elevator service built around safety, clarity, and care." })).toBeInTheDocument();
    expect(screen.getByText("Concept preview — no commercial claims or live enquiry submission")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Discuss your requirements" }).every((button) => button.hasAttribute("disabled"))).toBe(true);
  });

  it("switches language and direction from inside the demo shell", async () => {
    const user = userEvent.setup();
    await renderAt("/demo", "ar");
    expect(await screen.findByRole("heading", { name: "نظرة عامة على العمليات" })).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "English" })[0]!);
    expect(await screen.findByRole("heading", { name: "Operations overview" })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
  });

  it("persists a selected dark theme", async () => {
    const user = userEvent.setup();
    await renderAt("/demo");
    await user.click(screen.getByRole("button", { name: "Use dark theme" }));
    await waitFor(() => { expect(document.documentElement).toHaveClass("dark"); });
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");
    expect(screen.getByRole("button", { name: "Use light theme" })).toBeInTheDocument();
  });

  it.each([
    ["/demo/elevators", "Elevators"],
    ["/demo/customers", "Customer organizations"],
    ["/demo/technicians", "Maintenance technicians"],
  ])("renders the %s demo route", async (path, heading) => {
    await renderAt(path);
    expect(await screen.findByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("navigates the interactive maintenance calendar", async () => {
    const user = userEvent.setup();
    await renderAt("/demo/schedule");
    expect(await screen.findByRole("heading", { name: "October 2026" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "November 2026" })).toBeInTheDocument();
  });
});
