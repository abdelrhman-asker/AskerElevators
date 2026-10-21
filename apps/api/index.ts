import express from "express";

import { parseApiEnv } from "./src/config/env.js";
import { createApp } from "./src/create-app.js";

const config = parseApiEnv(process.env);
const app: ReturnType<typeof express> = createApp({
  webOrigin: config.webOrigin,
});

export default app;
