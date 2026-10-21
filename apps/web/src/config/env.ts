import { z } from "zod";

const absoluteHttpUrlSchema = z
  .string()
  .min(1)
  .url()
  .refine((value) => {
    if (!URL.canParse(value)) {
      return false;
    }
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }, "must use the HTTP or HTTPS protocol")
  .transform((value) => value.replace(/\/+$/, ""));

const webEnvSchema = z.object({
  VITE_API_BASE_URL: absoluteHttpUrlSchema,
});

export type WebEnvironmentSource = Record<string, unknown>;

export interface WebConfig {
  readonly apiBaseUrl: string;
}

export class WebConfigurationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "WebConfigurationError";
  }
}

export function parseWebEnv(source: WebEnvironmentSource): WebConfig {
  const result = webEnvSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `VITE_API_BASE_URL: ${issue.message}`)
      .join("; ");
    throw new WebConfigurationError(`Invalid web configuration: ${details}`);
  }

  return Object.freeze({ apiBaseUrl: result.data.VITE_API_BASE_URL });
}
