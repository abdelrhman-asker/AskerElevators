import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { parseDatabaseUrl } from "../config/env.js";
import { createDatabase } from "./client.js";

loadEnv({
  path: fileURLToPath(new URL("../../../../.env", import.meta.url)),
  quiet: true,
});

describe("PostgreSQL connectivity", () => {
  it("executes SELECT 1 against the configured database", async () => {
    const database = createDatabase(parseDatabaseUrl(process.env));

    try {
      await expect(database.checkConnection()).resolves.toBeUndefined();
    } finally {
      await database.close();
    }
  });
});
