type ErrorReport = {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  context?: Record<string, unknown>;
};

const isDev = process.env.NODE_ENV === "development";
const FLUSH_INTERVAL = 3_000;
const MAX_BATCH_SIZE = 5;
const ENDPOINT = "/api/errors";

let buffer: ErrorReport[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flush();
    flushTimer = null;
  }, FLUSH_INTERVAL);
}

function flush() {
  if (buffer.length === 0) return;

  const batch = buffer.splice(0, MAX_BATCH_SIZE);

  // Fire-and-forget — never block the app
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, JSON.stringify({ errors: batch }));
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errors: batch }),
        keepalive: true,
      }).catch(() => {
        // Silently swallow — logging failures must never crash the app
      });
    }
  } catch {
    // Swallow all errors
  }

  // If there are remaining items, schedule another flush
  if (buffer.length > 0) {
    scheduleFlush();
  }
}

/**
 * Report an error to the logging endpoint.
 * Batches errors and flushes periodically. Never throws.
 * No-ops in development to avoid noise.
 */
export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (isDev) {
    return;
  }

  const errorObj = error instanceof Error ? error : new Error(String(error));

  const report: ErrorReport = {
    message: errorObj.message,
    stack: errorObj.stack,
    url: typeof window !== "undefined" ? window.location.href : "server",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
    timestamp: new Date().toISOString(),
    context,
  };

  buffer.push(report);

  // Cap the buffer to prevent memory leaks if flush keeps failing
  if (buffer.length > 50) {
    buffer = buffer.slice(-MAX_BATCH_SIZE);
  }

  scheduleFlush();
}

/**
 * Immediately flush any pending error reports.
 * Call this on page unload.
 */
export function flushErrors() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  flush();
}
