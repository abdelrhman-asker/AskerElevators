import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createAppI18n } from "./i18n";
import { LocaleProvider } from "./LocaleProvider";
import { localeStorageKey, readStoredLocale } from "./storage";
import { useLocale } from "./useLocale";

function LocaleHarness(): React.JSX.Element {
  const { locale, setLocale, t } = useLocale();

  return (
    <div>
      <span>{t("app.title")}</span>
      <span data-testid="locale">{locale}</span>
      <button
        onClick={() => {
          setLocale("en");
        }}
        type="button"
      >
        {t("language.english")}
      </button>
    </div>
  );
}

async function renderLocaleProvider(): Promise<void> {
  const instance = await createAppI18n();
  render(
    <LocaleProvider instance={instance}>
      <LocaleHarness />
    </LocaleProvider>,
  );
}

describe("LocaleProvider", () => {
  it("defaults to Arabic and synchronizes RTL document attributes", async () => {
    await renderLocaleProvider();

    expect(screen.getByText("منصة المصاعد")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "ar");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
  });

  it("restores a valid stored English preference", async () => {
    localStorage.setItem(localeStorageKey, "en");

    await renderLocaleProvider();

    expect(screen.getByText("Elevator Platform")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
  });

  it("falls back to Arabic for an invalid stored locale", async () => {
    localStorage.setItem(localeStorageKey, "invalid");

    await renderLocaleProvider();

    expect(screen.getByTestId("locale")).toHaveTextContent("ar");
  });

  it("updates and persists the locale from one source of truth", async () => {
    const user = userEvent.setup();
    await renderLocaleProvider();

    await user.click(screen.getByRole("button", { name: "English" }));

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("lang", "en");
    });
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(localStorage.getItem(localeStorageKey)).toBe("en");
  });

  it("continues to work when browser storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(readStoredLocale()).toBe("ar");
    await renderLocaleProvider();

    expect(screen.getByText("منصة المصاعد")).toBeInTheDocument();
  });
});
