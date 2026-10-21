import cors from "cors";
import express, { type Express } from "express";

import { errorHandler } from "./http/error-handler.js";
import { notFoundHandler } from "./http/not-found.js";
import { healthRouter } from "./routes/health.js";

export interface AppConfig {
  readonly webOrigin: string;
}

export function createApp(config: AppConfig): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    cors({
      origin: [config.webOrigin],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
