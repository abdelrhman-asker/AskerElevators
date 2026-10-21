import { describe, expect, it } from "vitest";

import {
  createDatabase,
  createPoolConfig,
  DatabaseConnectionError,
} from "./client.js";

const unreachableDatabaseUrl =
  "postgresql://elevator:do-not-log@127.0.0.1:1/elevator";

describe("database client", () => {
  it("creates bounded pool configuration", () => {
    expect(createPoolConfig(unreachableDatabaseUrl)).toEqual({
      connectionString: unreachableDatabaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  });

  it("does not connect while constructing the resource", async () => {
    const database = createDatabase(unreachableDatabaseUrl);

    await expect(database.close()).resolves.toBeUndefined();
  });

  it("closes the pool idempotently", async () => {
    const database = createDatabase(unreachableDatabaseUrl);

    await expect(
      Promise.all([database.close(), database.close()]),
    ).resolves.toEqual([undefined, undefined]);
  });

  it("sanitizes connection failures and still closes", async () => {
    const database = createDatabase(unreachableDatabaseUrl);

    try {
      await expect(database.checkConnection()).rejects.toBeInstanceOf(
        DatabaseConnectionError,
      );
      await expect(database.checkConnection()).rejects.not.toThrow(
        /do-not-log/u,
      );
    } finally {
      await database.close();
    }
  });
});
