import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { endpoints } from "@/services/endpoints";
import { reportError } from "@/services/error-reporter";
import { tokenManager } from "@/services/token-manager";
import type { ApiError } from "@/types/api";
import type { AuthResponse } from "@/types/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7228/api";

export const apiClient = axios.create({
  baseURL,
  timeout: 12_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

/** Per-endpoint timeout tiers (ms) */
const TIMEOUT_TIERS: Record<string, number> = {
  "/v1/auth/": 8_000,
  "/v1/cart": 10_000,
  "/v1/payments": 15_000,
  "/v1/orders": 12_000,
};

function getTimeoutForUrl(url?: string): number | undefined {
  if (!url) return undefined;
  for (const [prefix, timeout] of Object.entries(TIMEOUT_TIERS)) {
    if (url.includes(prefix)) return timeout;
  }
  return undefined;
}

let refreshPromise: Promise<AuthResponse> | null = null;

function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    const response = axiosError.response;

    // Detect network/timeout errors
    if (axiosError.code === "ECONNABORTED" || axiosError.code === "ERR_NETWORK") {
      return {
        message: "Network request timed out. Please check your connection and try again.",
        statusCode: 0,
        code: axiosError.code,
      };
    }

    return {
      message: response?.data?.message ?? axiosError.message ?? "Request failed",
      statusCode: response?.status ?? 500,
      code: response?.data?.code,
      details: response?.data?.details
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500
    };
  }

  return {
    message: "Unexpected request error",
    statusCode: 500
  };
}

async function refreshAccessToken() {
  // Call our local Next.js proxy route which pulls the HttpOnly cookie
  refreshPromise ??= axios
    .post<AuthResponse>("/api/auth/refresh", null, {
      headers: {
        Accept: "application/json"
      }
    })
    .then((response) => response.data);

  try {
    const session = await refreshPromise;
    tokenManager.setAccessToken(session.accessToken);
    return session;
  } finally {
    refreshPromise = null;
  }
}

// ── Request interceptor: auth token + per-endpoint timeout + AbortController ──
apiClient.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Apply per-endpoint timeout tier
  const tierTimeout = getTimeoutForUrl(config.url);
  if (tierTimeout) {
    config.timeout = tierTimeout;
  }

  // Attach AbortController signal if not already present
  // This enables React Query's automatic cancellation on unmount
  if (!config.signal) {
    const controller = new AbortController();
    config.signal = controller.signal;
  }

  return config;
});

// ── Response interceptor: 401 refresh + error reporting ──
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isRefreshCall = originalRequest?.url?.includes("/api/auth/refresh") || originalRequest?.url?.includes(endpoints.auth.refresh);

    // Skip reporting for cancelled requests (user navigated away)
    const isCancelled = axios.isCancel(error) || error.code === "ERR_CANCELED";

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        const session = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenManager.clear();
        return Promise.reject(normalizeApiError(refreshError));
      }
    }

    // Report 5xx errors and network failures to the error reporter
    const statusCode = error.response?.status;
    if (!isCancelled && (statusCode === undefined || statusCode >= 500)) {
      reportError(error, {
        url: originalRequest?.url,
        method: originalRequest?.method,
        statusCode,
      });
    }

    return Promise.reject(normalizeApiError(error));
  }
);

export function getApiError(error: unknown): ApiError {
  return normalizeApiError(error);
}
