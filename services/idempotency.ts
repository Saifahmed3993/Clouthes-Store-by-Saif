"use client";

import { useCallback, useRef } from "react";

/**
 * Generate a unique idempotency key using the browser's crypto API.
 * Falls back to a timestamp-based key if crypto.randomUUID is unavailable.
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * React hook that provides a stable idempotency key per component mount.
 * The key remains constant across re-renders so retries send the same key.
 * Call `reset()` after a successful mutation to generate a fresh key for the next action.
 */
export function useIdempotencyKey(scope: string) {
  const keyRef = useRef<string>(generateIdempotencyKey());

  const getKey = useCallback(() => {
    return `${scope}:${keyRef.current}`;
  }, [scope]);

  const reset = useCallback(() => {
    keyRef.current = generateIdempotencyKey();
  }, []);

  return { getKey, reset };
}
