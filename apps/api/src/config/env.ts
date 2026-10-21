import { z } from "zod";

export const databaseUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    if (!URL.canParse(value)) {
      return false;
    }
    const protocol = new URL(value).protocol;
    return protocol === "postgres:" || protocol === "postgresql:";
  }, "DATABASE_URL must use the PostgreSQL protocol");

const webOriginSchema = z
  .string()
  .url()
  .refine(
    (value) => URL.canParse(value) && new URL(value).origin === value,
    "WEB_ORIGIN must be an origin without a path, query, or trailing slash",
  );

export const apiEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3100),
  WEB_ORIGIN: webOriginSchema,
  DATABASE_URL: databaseUrlSchema,
});

export type EnvironmentSource = Record<string, string | undefined>;

export interface ApiConfig {
  readonly nodeEnv: z.infer<typeof apiEnvSchema>["NODE_ENV"];
  readonly port: number;
  readonly webOrigin: string;
  readonly databaseUrl: string;
}

export class ConfigurationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

function formatConfigurationIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path[0]?.toString() ?? "configuration";
      return `${field}: ${issue.message}`;
    })
    .join("; ");
}

export function parseDatabaseUrl(source: EnvironmentSource): string {
  const result = z
    .object({ DATABASE_URL: databaseUrlSchema })
    .safeParse(source);

  if (!result.success) {
    throw new ConfigurationError(
      `Invalid database configuration: ${formatConfigurationIssues(result.error)}`,
    );
  }

  return result.data.DATABASE_URL;
}

export function parseApiEnv(source: EnvironmentSource): ApiConfig {
  const result = apiEnvSchema.safeParse(source);

  if (!result.success) {
    throw new ConfigurationError(
      `Invalid API configuration: ${formatConfigurationIssues(result.error)}`,
    );
  }

  return Object.freeze({
    nodeEnv: result.data.NODE_ENV,
    port: result.data.PORT,
    webOrigin: result.data.WEB_ORIGIN,
    databaseUrl: result.data.DATABASE_URL,
  });
}
