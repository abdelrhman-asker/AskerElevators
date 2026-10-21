import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../create-app.js";
import { errorHandler } from "./error-handler.js";

describe("HTTP error handling", () => {
  it("returns a JSON 404 for an unknown route", async () => {
    const app = createApp({ webOrigin: "http://localhost:5173" });
    const response = await request(app).get("/api/unknown").expect(404);

    expect(response.headers["content-type"]).toMatch(/^application\/json/u);
    expect(response.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    });
  });

  it("rejects malformed JSON without exposing parser details", async () => {
    const app = createApp({ webOrigin: "http://localhost:5173" });
    const response = await request(app)
      .post("/api/unknown")
      .set("Content-Type", "application/json")
      .send('{"password":"secret"')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: "INVALID_JSON",
        message: "Request body contains invalid JSON",
      },
    });
    expect(JSON.stringify(response.body)).not.toContain("secret");
    expect(JSON.stringify(response.body)).not.toContain("stack");
  });

  it("returns a generic 500 without stack traces or secrets", async () => {
    const app = express();
    app.get("/failure", () => {
      throw new Error("database-password=do-not-expose");
    });
    app.use(errorHandler);

    const response = await request(app).get("/failure").expect(500);
    const serializedBody = JSON.stringify(response.body);

    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    });
    expect(serializedBody).not.toContain("database-password");
    expect(serializedBody).not.toContain("stack");
  });
});
