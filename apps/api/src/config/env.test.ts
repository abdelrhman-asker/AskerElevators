import { describe, expect, it } from "vitest";

import {
  ConfigurationError,
  parseApiEnv,
  parseDatabaseUrl,
} from "./env.js";

const validSource = {
  NODE_ENV: "test",
  PORT: "4100",
  WEB_ORIGIN: "http://localhost:5173",
  DATABASE_URL: "postgresql://elevator:local-password@localhost:5432/elevator",
};

describe("parseApiEnv", () => {
  it("parses valid configuration", () => {
    expect(parseApiEnv(validSource)).toEqual({
      nodeEnv: "test",
      port: 4100,
      webOrigin: "http://localhost:5173",
      databaseUrl:
        "postgresql://elevator:local-password@localhost:5432/elevator",
    });
  });

  it("uses documented development defaults", () => {
    expect(
      parseApiEnv({
        WEB_ORIGIN: validSource.WEB_ORIGIN,
        DATABASE_URL: validSource.DATABASE_URL,
      }),
    ).toEqual({
      nodeEnv: "development",
      port: 3100,
      webOrigin: "http://localhost:5173",
      databaseUrl:
        "postgresql://elevator:local-password@localhost:5432/elevator",
    });
  });

  it.each(["0", "65536", "not-a-port"])(
    "rejects invalid port %s",
    (port) => {
      expect(() => parseApiEnv({ ...validSource, PORT: port })).toThrow(
        ConfigurationError,
      );
    },
  );

  it("requires a valid frontend origin", () => {
    expect(() =>
      parseApiEnv({ ...validSource, WEB_ORIGIN: "not a URL" }),
    ).toThrow(/WEB_ORIGIN/u);
  });

  it.each([
    "http://localhost:5173/",
    "http://localhost:5173/path",
    "http://localhost:5173?mode=dev",
  ])("rejects a frontend URL that is not an exact origin: %s", (webOrigin) => {
    expect(() =>
      parseApiEnv({ ...validSource, WEB_ORIGIN: webOrigin }),
    ).toThrow(/WEB_ORIGIN must be an origin/u);
  });

  it("requires the frontend origin", () => {
    expect(() =>
      parseApiEnv({
        NODE_ENV: validSource.NODE_ENV,
        PORT: validSource.PORT,
        DATABASE_URL: validSource.DATABASE_URL,
      }),
    ).toThrow(/WEB_ORIGIN/u);
  });

  it("does not include supplied values in validation errors", () => {
    const secretLikeValue = "https://secret-token.example.test invalid";

    try {
      parseApiEnv({ ...validSource, WEB_ORIGIN: secretLikeValue });
      expect.fail("Expected invalid configuration to throw");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ConfigurationError);

      if (error instanceof Error) {
        expect(error.message).not.toContain(secretLikeValue);
      }
    }
  });
});

describe("parseDatabaseUrl", () => {
  it.each([
    "postgres://user:password@localhost:5432/database",
    "postgresql://user:password@localhost:5432/database",
  ])("accepts PostgreSQL URL %s", (databaseUrl) => {
    expect(parseDatabaseUrl({ DATABASE_URL: databaseUrl })).toBe(databaseUrl);
  });

  it("rejects a missing database URL", () => {
    expect(() => parseDatabaseUrl({})).toThrow(/DATABASE_URL/u);
  });

  it("rejects non-PostgreSQL protocols", () => {
    expect(() =>
      parseDatabaseUrl({ DATABASE_URL: "https://database.example.test" }),
    ).toThrow(/PostgreSQL protocol/u);
  });

  it("wraps malformed database URLs in a sanitized configuration error", () => {
    const malformedUrl = "not-a-url-with-secret-text";

    try {
      parseDatabaseUrl({ DATABASE_URL: malformedUrl });
      expect.fail("Expected malformed database configuration to throw");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ConfigurationError);

      if (error instanceof Error) {
        expect(error.message).toContain("DATABASE_URL");
        expect(error.message).not.toContain(malformedUrl);
      }
    }
  });

  it("does not expose the database URL in validation errors", () => {
    const secretUrl = "https://admin:secret@example.test/database";

    try {
      parseDatabaseUrl({ DATABASE_URL: secretUrl });
      expect.fail("Expected invalid database configuration to throw");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ConfigurationError);

      if (error instanceof Error) {
        expect(error.message).not.toContain(secretUrl);
        expect(error.message).not.toContain("secret");
      }
    }
  });
});
