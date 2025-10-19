import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  tier: string;
}

/**
 * Get tier configuration based on subscription
 */
export function getTierConfig(subscription: string): {
  apiKeysLimit: number;
  apiRequestsLimit: number;
  tier: string;
} {
  switch (subscription.toLowerCase()) {
    case 'pro':
    case 'trial':
      return {
        apiKeysLimit: 1,
        apiRequestsLimit: 1000,
        tier: 'pro',
      };
    case 'business':
      return {
        apiKeysLimit: 5,
        apiRequestsLimit: 10000,
        tier: 'business',
      };
    case 'enterprise':
      return {
        apiKeysLimit: 999999, // Effectively unlimited
        apiRequestsLimit: 999999,
        tier: 'enterprise',
      };
    case 'free':
    default:
      return {
        apiKeysLimit: 0,
        apiRequestsLimit: 0,
        tier: 'free',
      };
  }
}

/**
 * Check if user can create more API keys
 */
export async function canCreateApiKey(userId: string): Promise<{
  allowed: boolean;
  currentCount: number;
  limit: number;
  subscription: string;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscription: true,
      ApiKeys: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  if (!user) {
    return { allowed: false, currentCount: 0, limit: 0, subscription: 'free' };
  }

  const config = getTierConfig(user.subscription);
  const currentCount = user.ApiKeys.length;

  return {
    allowed: currentCount < config.apiKeysLimit,
    currentCount,
    limit: config.apiKeysLimit,
    subscription: user.subscription,
  };
}

/**
 * Check rate limit for API key
 */
export async function checkRateLimit(apiKey: string): Promise<RateLimitResult> {
  // Find the API key and user
  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: {
      user: {
        select: {
          subscription: true,
          apiRequestsLimit: true,
          apiRequestsUsed: true,
          billingCycleStart: true,
        },
      },
    },
  });

  if (!apiKeyRecord || !apiKeyRecord.isActive) {
    return {
      allowed: false,
      limit: 0,
      remaining: 0,
      reset: 0,
      tier: 'none',
    };
  }

  const config = getTierConfig(apiKeyRecord.user.subscription);
  const limit = apiKeyRecord.user.apiRequestsLimit || config.apiRequestsLimit;
  const used = apiKeyRecord.user.apiRequestsUsed || 0;
  const remaining = Math.max(0, limit - used);

  // Calculate reset timestamp (start of next billing cycle)
  const billingStart = apiKeyRecord.user.billingCycleStart || new Date();
  const resetDate = new Date(billingStart);
  resetDate.setMonth(resetDate.getMonth() + 1);
  const reset = Math.floor(resetDate.getTime() / 1000);

  // Check if we need to reset the counter (new billing cycle)
  const now = new Date();
  if (now > resetDate) {
    // Reset usage counter
    await prisma.user.update({
      where: { id: apiKeyRecord.userId },
      data: {
        apiRequestsUsed: 0,
        billingCycleStart: now,
      },
    });
    return {
      allowed: true,
      limit,
      remaining: limit,
      reset: Math.floor(new Date(now.setMonth(now.getMonth() + 1)).getTime() / 1000),
      tier: config.tier,
    };
  }

  return {
    allowed: remaining > 0,
    limit,
    remaining,
    reset,
    tier: config.tier,
  };
}

/**
 * Increment API usage counter
 */
export async function incrementUsage(
  apiKeyId: string,
  userId: string,
  endpoint: string,
  responseStatus?: number,
  responseTime?: number
): Promise<void> {
  // Increment user's API request counter
  await prisma.user.update({
    where: { id: userId },
    data: {
      apiRequestsUsed: { increment: 1 },
    },
  });

  // Increment API key's request counter
  await prisma.apiKey.update({
    where: { id: apiKeyId },
    data: {
      requestsUsed: { increment: 1 },
      lastUsedAt: new Date(),
    },
  });

  // Log the API usage
  await prisma.apiUsageLog.create({
    data: {
      apiKeyId,
      userId,
      endpoint,
      responseStatus,
      responseTime,
    },
  });
}

/**
 * Get API usage statistics for a user
 */
export async function getUsageStats(userId: string): Promise<{
  limit: number;
  used: number;
  remaining: number;
  resetDate: Date;
  percentage: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscription: true,
      apiRequestsLimit: true,
      apiRequestsUsed: true,
      billingCycleStart: true,
    },
  });

  if (!user) {
    return {
      limit: 0,
      used: 0,
      remaining: 0,
      resetDate: new Date(),
      percentage: 0,
    };
  }

  const config = getTierConfig(user.subscription);
  const limit = user.apiRequestsLimit || config.apiRequestsLimit;
  const used = user.apiRequestsUsed || 0;
  const remaining = Math.max(0, limit - used);
  const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;

  const billingStart = user.billingCycleStart || new Date();
  const resetDate = new Date(billingStart);
  resetDate.setMonth(resetDate.getMonth() + 1);

  return {
    limit,
    used,
    remaining,
    resetDate,
    percentage,
  };
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
    'X-RateLimit-Tier': result.tier,
  };
}

/**
 * Create rate limit error response
 */
export function createRateLimitError(result: RateLimitResult): NextResponse {
  const resetDate = new Date(result.reset * 1000).toISOString();
  return NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message: `You have exceeded your API rate limit. Limit: ${result.limit} requests per month. Resets at: ${resetDate}`,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      tier: result.tier,
      upgradeUrl: '/pricing',
    },
    {
      status: 429,
      headers: createRateLimitHeaders(result),
    }
  );
}
