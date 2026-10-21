import { describe, expect, it } from "vitest";

import { healthResponseSchema, type HealthResponse } from "../index.js";

const validHealthResponse = {
  status: "ok",
  service: "elevator-api",
  timestamp: "2026-10-18T12:00:00.000Z",
} satisfies HealthResponse;

describe("healthResponseSchema", () => {
  it("accepts a valid health response", () => {
    expect(healthResponseSchema.parse(validHealthResponse)).toEqual(
      validHealthResponse,
    );
  });

  it("rejects a status other than ok", () => {
    expect(() =>
      healthResponseSchema.parse({
        ...validHealthResponse,
        status: "degraded",
      }),
    ).toThrow();
  });

  it("rejects a missing service", () => {
    const responseWithoutService = {
      status: validHealthResponse.status,
      timestamp: validHealthResponse.timestamp,
    };

    expect(() => healthResponseSchema.parse(responseWithoutService)).toThrow();
  });

  it("rejects a malformed timestamp", () => {
    expect(() =>
      healthResponseSchema.parse({
        ...validHealthResponse,
        timestamp: "not-a-timestamp",
      }),
    ).toThrow();
  });
});
