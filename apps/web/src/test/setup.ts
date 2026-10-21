import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
  document.documentElement.classList.remove("dark");
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
