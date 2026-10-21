import { afterEach, describe, expect, it, vi } from "vitest";

describe("Vercel API entry point", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("exports the configured Express application without opening a listener", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("PORT", "3100");
    vi.stubEnv("WEB_ORIGIN", "https://web.example.test");
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://user:password@database.example.test:5432/elevator",
    );

    const { default: app } = await import("./index.js");

    expect(app).toBeTypeOf("function");
    expect(app).not.toHaveProperty("listening", true);
  });

  it("fails closed when required deployment configuration is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("WEB_ORIGIN", "");
    vi.stubEnv("DATABASE_URL", "");

    await expect(import("./index.js")).rejects.toThrow(
      /Invalid API configuration/u,
    );
  });
});
