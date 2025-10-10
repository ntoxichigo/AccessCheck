import { RateLimiter } from 'limiter';
import { Redis } from '@upstash/redis';
import { log } from './logger';
import { AppError } from './errors';

const redis = Redis.fromEnv();

interface RateLimitConfig {
  tokens: number;      // Number of requests allowed
  interval: number;    // Time window in milliseconds
  uniqueKey: string;   // Unique identifier (e.g., IP, userId)
}

export async function checkRateLimit({ tokens, interval, uniqueKey }: RateLimitConfig): Promise<void> {
  try {
    const key = `ratelimit:${uniqueKey}`;
    const now = Date.now();
    
    // Get current rate limit data
    const data = await redis.get<{ tokens: number; reset: number }>(key);
    
    if (!data) {
      // First request, initialize rate limit
      await redis.set(key, { tokens: tokens - 1, reset: now + interval });
      return;
    }

    if (now >= data.reset) {
      // Reset period has passed
      await redis.set(key, { tokens: tokens - 1, reset: now + interval });
      return;
    }

    if (data.tokens <= 0) {
      // Rate limit exceeded
      const timeToReset = Math.ceil((data.reset - now) / 1000);
      throw new AppError(
        `Rate limit exceeded. Please try again in ${timeToReset} seconds.`,
        429,
        'RATE_LIMIT_EXCEEDED',
        { timeToReset }
      );
    }

    // Update remaining tokens
    await redis.set(key, { ...data, tokens: data.tokens - 1 });
  } catch (error) {
    log.error('Rate limit check failed', { error: error instanceof Error ? error : new Error(String(error)), uniqueKey });
    throw error;
  }
}

// Rate limit configurations
export const rateLimits = {
  scan: {
    free: { tokens: 5, interval: 24 * 60 * 60 * 1000 },     // 5 requests per day
    pro: { tokens: 100, interval: 24 * 60 * 60 * 1000 },    // 100 requests per day
    enterprise: { tokens: 1000, interval: 24 * 60 * 60 * 1000 }, // 1000 requests per day
  },
  api: {
    free: { tokens: 100, interval: 60 * 60 * 1000 },        // 100 requests per hour
    pro: { tokens: 1000, interval: 60 * 60 * 1000 },        // 1000 requests per hour
    enterprise: { tokens: 10000, interval: 60 * 60 * 1000 }, // 10000 requests per hour
  },
};