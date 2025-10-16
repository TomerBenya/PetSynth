// Rate limiting middleware
import { Context, Next } from 'hono';
import { User } from './auth.js';

/**
 * Token bucket for rate limiting
 */
class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRate: number; // tokens per millisecond

  constructor(capacity: number, refillPerMinute: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.lastRefill = Date.now();
    this.refillRate = refillPerMinute / 60000; // convert to tokens per ms
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Try to consume a token
   * @returns true if token consumed, false if rate limit exceeded
   */
  consume(): boolean {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }

    return false;
  }
}

/**
 * In-memory store for token buckets
 * Key format: "routeKey:identifier" where identifier is userId or IP
 */
const buckets = new Map<string, TokenBucket>();

/**
 * Get client identifier (userId if authenticated, otherwise IP address)
 */
function getClientIdentifier(c: Context): string {
  // Try to get authenticated user ID
  try {
    const user = c.get('user') as User | undefined;
    if (user?.id) {
      return `user:${user.id}`;
    }
  } catch {
    // User not set, fall back to IP
  }

  // Fall back to IP address
  const forwarded = c.req.header('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `ip:${ip}`;
}

/**
 * Rate limiting middleware factory
 * @param routeKey - Optional route identifier for separate rate limit buckets
 * @returns Hono middleware function
 */
export function rateLimit(routeKey?: string) {
  return async (c: Context, next: Next) => {
    const identifier = getClientIdentifier(c);
    const bucketKey = routeKey ? `${routeKey}:${identifier}` : identifier;

    // Get or create token bucket for this key
    let bucket = buckets.get(bucketKey);
    if (!bucket) {
      // Capacity: 10 tokens, Refill: 10 tokens per minute
      bucket = new TokenBucket(10, 10);
      buckets.set(bucketKey, bucket);
    }

    // Try to consume a token
    if (!bucket.consume()) {
      return c.json({ error: 'rate_limited' }, 429);
    }

    // Token consumed successfully, proceed
    await next();
  };
}

/**
 * Clean up old buckets periodically (optional utility)
 * Call this periodically to prevent memory leaks in long-running processes
 */
export function cleanupBuckets(): void {
  // In a production system, you'd track last access time and remove stale buckets
  // For now, we keep it simple - buckets stay in memory
  // Alternative: use Redis or another external store for distributed systems
}
