import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { fileURLToPath } from "node:url";

import { parseDatabaseUrl } from "./src/config/env.js";

loadEnv({
  path: fileURLToPath(new URL("../../.env", import.meta.url)),
  quiet: true,
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: parseDatabaseUrl(process.env),
  },
  strict: true,
  verbose: true,
});
