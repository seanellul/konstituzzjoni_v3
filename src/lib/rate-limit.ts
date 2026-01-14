/**
 * Simple in-memory rate limiter
 * For production with multiple servers, consider using Redis
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private records: Map<string, RateLimitRecord>;
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.records = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up expired records every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP, session ID, etc.)
   * @returns true if request should be allowed, false if rate limited
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.records.get(identifier);

    // No record exists, create new one
    if (!record) {
      this.records.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }

    // Record exists but window has expired, reset
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.windowMs;
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: record.resetTime,
      };
    }

    // Window is still active
    if (record.count < this.maxRequests) {
      record.count++;
      return {
        allowed: true,
        remaining: this.maxRequests - record.count,
        resetTime: record.resetTime,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  /**
   * Clean up expired records to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now > record.resetTime) {
        this.records.delete(key);
      }
    }
  }

  /**
   * Reset a specific identifier (for testing or admin purposes)
   */
  reset(identifier: string): void {
    this.records.delete(identifier);
  }

  /**
   * Get current stats for monitoring
   */
  getStats(): { totalRecords: number } {
    return {
      totalRecords: this.records.size,
    };
  }
}

// Create different rate limiters for different endpoint types
export const analyticsRateLimiter = new RateLimiter(60, 60000); // 60 requests per minute
export const searchRateLimiter = new RateLimiter(30, 60000); // 30 requests per minute
export const generalRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

/**
 * Helper function to get identifier from request
 * Uses session ID from header, or falls back to a combination of IP and User-Agent
 */
export function getRequestIdentifier(request: Request): string {
  // Try to get session ID from header
  const sessionId = request.headers.get('x-session-id');
  if (sessionId) {
    return `session:${sessionId}`;
  }

  // Fallback: Use forwarded IP or connection info
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';

  // Combine with user agent for better uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const hash = simpleHash(`${ip}:${userAgent}`);

  return `ip:${hash}`;
}

/**
 * Simple hash function for creating identifiers
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Middleware function to apply rate limiting to API routes
 */
export function rateLimitMiddleware(
  rateLimiter: RateLimiter = generalRateLimiter
) {
  return (request: Request): Response | null => {
    const identifier = getRequestIdentifier(request);
    const { allowed, remaining, resetTime } = rateLimiter.check(identifier);

    if (!allowed) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimiter['maxRequests'].toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
          },
        }
      );
    }

    return null; // Request allowed, continue processing
  };
}
