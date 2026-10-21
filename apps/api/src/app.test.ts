import { describe, expect, it } from "vitest";

describe("API application module", () => {
  it("can be imported and configured without opening a listener", async () => {
    const { createApp } = await import("./create-app.js");
    const app = createApp({ webOrigin: "http://localhost:5173" });

    expect(createApp).toBeTypeOf("function");
    expect(app).toBeTypeOf("function");
    expect(app).not.toHaveProperty("listening", true);
  });
});
