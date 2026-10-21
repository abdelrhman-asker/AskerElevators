import { parseApiEnv } from "./src/config/env.js";
import { createApp } from "./src/create-app.js";

const config = parseApiEnv(process.env);

export default createApp({ webOrigin: config.webOrigin });
