import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Redis environment variables are not set');
}

const redis = Redis.fromEnv();

export default redis;

// Helper functions for common Redis operations
export async function incrementMetric(key: string): Promise<void> {
  await redis.incr(`metrics:${key}`);
}

export async function setMetric(key: string, value: number): Promise<void> {
  await redis.set(`metrics:${key}`, value);
}

export async function getMetric(key: string): Promise<number> {
  const value = await redis.get(`metrics:${key}`);
  return Number(value) || 0;
}

export async function logError(error: Error, context?: Record<string, unknown>): Promise<void> {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  };

  await redis.lpush('logs:error', JSON.stringify(errorLog));
  // Keep only last 1000 errors
  await redis.ltrim('logs:error', 0, 999);
}

export async function isAdmin(userId: string): Promise<boolean> {
  const adminStatus = await redis.get(`user:${userId}:isAdmin`);
  return Boolean(adminStatus);
}

// Cache helpers
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  const fresh = await fetchFn();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}

// Health check helper
export async function ping(): Promise<boolean> {
  try {
    const start = Date.now();
    await redis.ping();
    const latency = Date.now() - start;
    await setMetric('latency:redis', latency);
    return true;
  } catch (error) {
    return false;
  }
}