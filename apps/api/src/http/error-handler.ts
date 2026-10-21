import type { ErrorRequestHandler } from "express";

interface HttpErrorLike {
  readonly status?: unknown;
  readonly type?: unknown;
}

function isMalformedJsonError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as HttpErrorLike;
  return candidate.status === 400 && candidate.type === "entity.parse.failed";
}

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  void _next;

  if (isMalformedJsonError(error)) {
    response.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Request body contains invalid JSON",
      },
    });
    return;
  }

  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
