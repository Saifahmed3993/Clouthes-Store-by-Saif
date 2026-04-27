import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/api";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
        networkMode: "online",
        throwOnError: false,
        retry: (failureCount, error) => {
          const maybeApiError = error as unknown as Partial<ApiError>;
          const statusCode = typeof maybeApiError.statusCode === "number" ? maybeApiError.statusCode : undefined;

          // Never retry 4xx client errors
          if (statusCode && statusCode >= 400 && statusCode < 500) {
            return false;
          }

          // Retry up to 2 times for server/network errors
          return failureCount < 2;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      },
      mutations: {
        retry: false,
        networkMode: "online",
      }
    }
  });
}
