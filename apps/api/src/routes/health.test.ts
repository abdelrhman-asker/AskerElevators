import { healthResponseSchema } from "@elevator/shared";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../create-app.js";

const app = createApp({ webOrigin: "http://localhost:5173" });

describe("GET /api/health", () => {
  it("returns a schema-valid JSON health response", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.headers["content-type"]).toMatch(/^application\/json/u);
    expect(healthResponseSchema.safeParse(response.body).success).toBe(true);
    expect(response.body).toMatchObject({
      status: "ok",
      service: "elevator-api",
    });
  });

  it("does not expose server configuration", async () => {
    const response = await request(app).get("/api/health").expect(200);
    const serializedBody = JSON.stringify(response.body);

    expect(serializedBody).not.toContain("localhost:5173");
    expect(serializedBody).not.toContain("PORT");
  });

  it("allows the configured frontend origin", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", "http://localhost:5173")
      .expect(200);

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
  });

  it("does not grant CORS access to another origin", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", "https://untrusted.example")
      .expect(200);

    expect(response.headers).not.toHaveProperty("access-control-allow-origin");
  });
});
