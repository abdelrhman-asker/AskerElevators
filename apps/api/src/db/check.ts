import { parseDatabaseUrl } from "../config/env.js";
import { createDatabase } from "./client.js";

const database = createDatabase(parseDatabaseUrl(process.env));

try {
  await database.checkConnection();
  console.info("Database connection succeeded.");
} catch {
  console.error("Database connection failed.");
  process.exitCode = 1;
} finally {
  try {
    await database.close();
  } catch {
    console.error("Database cleanup failed.");
    process.exitCode = 1;
  }
}
