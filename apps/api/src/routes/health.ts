import {
  healthResponseSchema,
  type HealthResponse,
} from "@elevator/shared";
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (_request, response) => {
  const payload: HealthResponse = {
    status: "ok",
    service: "elevator-api",
    timestamp: new Date().toISOString(),
  };

  response.status(200).json(healthResponseSchema.parse(payload));
});
