import { healthResponseSchema, type HealthResponse } from "@elevator/shared";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { ApiClient } from "@/lib/api-client";

export function useHealthQuery(
  apiClient: ApiClient,
): UseQueryResult<HealthResponse, Error> {
  return useQuery({
    queryKey: ["system", "health"],
    queryFn: ({ signal }) =>
      apiClient.get("/api/health", healthResponseSchema, signal),
    retry: false,
    staleTime: 30_000,
  });
}
