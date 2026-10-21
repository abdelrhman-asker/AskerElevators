import { createApp } from "./src/app.js";
import { parseApiEnv } from "./src/config/env.js";

const config = parseApiEnv(process.env);

export default createApp({ webOrigin: config.webOrigin });
