import type { z } from "zod";

export class ApiRequestError extends Error {
  public constructor() {
    super("The API request could not be completed");
    this.name = "ApiRequestError";
  }
}

export interface ApiClient {
  readonly get: <T>(
    path: string,
    schema: z.ZodType<T>,
    signal?: AbortSignal,
  ) => Promise<T>;
}

export function createApiClient(apiBaseUrl: string): ApiClient {
  return Object.freeze({
    async get<T>(
      path: string,
      schema: z.ZodType<T>,
      signal?: AbortSignal,
    ): Promise<T> {
      try {
        const response = await fetch(new URL(path, `${apiBaseUrl}/`), {
          method: "GET",
          headers: { Accept: "application/json" },
          ...(signal === undefined ? {} : { signal }),
        });

        if (!response.ok) {
          throw new ApiRequestError();
        }

        const payload: unknown = await response.json();
        const result = schema.safeParse(payload);

        if (!result.success) {
          throw new ApiRequestError();
        }

        return result.data;
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw error;
        }
        throw new ApiRequestError();
      }
    },
  });
}
