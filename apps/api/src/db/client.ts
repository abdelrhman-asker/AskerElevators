import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

import * as schema from "./schema.js";

const poolLimits = Object.freeze({
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export class DatabaseConnectionError extends Error {
  public constructor() {
    super("Database connectivity check failed.");
    this.name = "DatabaseConnectionError";
  }
}

export type Database = NodePgDatabase<typeof schema>;

export interface DatabaseResource {
  readonly db: Database;
  checkConnection(): Promise<void>;
  close(): Promise<void>;
}

export function createPoolConfig(databaseUrl: string): PoolConfig {
  return {
    connectionString: databaseUrl,
    ...poolLimits,
  };
}

export function createDatabase(databaseUrl: string): DatabaseResource {
  const pool = new Pool(createPoolConfig(databaseUrl));
  const db = drizzle(pool, { schema });
  let closePromise: Promise<void> | undefined;

  return {
    db,
    async checkConnection(): Promise<void> {
      try {
        await pool.query("select 1");
      } catch {
        throw new DatabaseConnectionError();
      }
    },
    async close(): Promise<void> {
      closePromise ??= pool.end();
      await closePromise;
    },
  };
}
