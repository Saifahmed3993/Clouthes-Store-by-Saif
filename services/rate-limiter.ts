type RateLimiterConfig = {
  /** Maximum number of attempts allowed within the window */
  maxAttempts: number;
  /** Sliding window duration in milliseconds */
  windowMs: number;
};

/**
 * Client-side sliding-window rate limiter.
 * Defense-in-depth layer — prevents accidental spam from UI, does not replace server-side limits.
 */
export class RateLimiter {
  private attempts = new Map<string, number[]>();
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  /**
   * Check if an action can proceed. Returns `true` if within limits.
   * Automatically records the attempt if allowed.
   */
  canProceed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing attempts and prune expired ones
    const existing = (this.attempts.get(key) ?? []).filter((t) => t > windowStart);

    if (existing.length >= this.config.maxAttempts) {
      this.attempts.set(key, existing);
      return false;
    }

    existing.push(now);
    this.attempts.set(key, existing);
    return true;
  }

  /** Get remaining attempts for a key */
  remaining(key: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const existing = (this.attempts.get(key) ?? []).filter((t) => t > windowStart);
    return Math.max(0, this.config.maxAttempts - existing.length);
  }

  /** Reset attempts for a key */
  reset(key: string) {
    this.attempts.delete(key);
  }
}

/** Auth endpoints: 5 attempts per 60 seconds */
export const authLimiter = new RateLimiter({ maxAttempts: 5, windowMs: 60_000 });

/** Payment/order endpoints: 3 attempts per 60 seconds */
export const paymentLimiter = new RateLimiter({ maxAttempts: 3, windowMs: 60_000 });
