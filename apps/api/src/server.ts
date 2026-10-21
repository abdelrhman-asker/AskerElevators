import { createApp } from "./app.js";
import { ConfigurationError, parseApiEnv } from "./config/env.js";
import { createDatabase } from "./db/client.js";

function startServer(): void {
  const config = parseApiEnv(process.env);
  const app = createApp({ webOrigin: config.webOrigin });
  const database = createDatabase(config.databaseUrl);

  const server = app.listen(config.port, () => {
    console.info(`Elevator API listening on port ${config.port}.`);
  });

  let isShuttingDown = false;

  async function closeHttpServer(): Promise<void> {
    if (!server.listening) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error !== undefined) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  async function shutdown(
    reason: string,
    requestedExitCode = 0,
  ): Promise<void> {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    console.info(`Elevator API received ${reason}; shutting down.`);

    const forcedExit = setTimeout(() => {
      console.error("Elevator API shutdown timed out.");
      server.closeAllConnections();
      process.exit(1);
    }, 10_000);
    forcedExit.unref();

    try {
      await closeHttpServer();
      await database.close();
      process.exitCode = requestedExitCode;
    } catch {
      console.error("Elevator API shutdown failed.");
      process.exitCode = 1;
    } finally {
      clearTimeout(forcedExit);
    }
  }

  server.on("error", () => {
    console.error("Elevator API failed to start.");
    void shutdown("a server error", 1);
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

try {
  startServer();
} catch (error: unknown) {
  if (error instanceof ConfigurationError) {
    console.error(error.message);
  } else {
    console.error("Elevator API failed to initialize.");
  }

  process.exitCode = 1;
}
