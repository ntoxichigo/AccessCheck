import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Redis } from '@upstash/redis';
import { AppError, handleApiError } from '../../../../lib/errors';
import { log } from '../../../../lib/logger';

const redis = Redis.fromEnv();

// Get admin IDs from environment variable (comma-separated)
const ADMIN_IDS = process.env.ADMIN_USER_IDS?.split(',').map(id => id.trim()).filter(Boolean) || [];

export async function GET() {
  try {
    const user = await currentUser();
    if (!user?.id) {
      log.warn('Admin check: Unauthorized access attempt');
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const isAdmin = ADMIN_IDS.includes(user.id) || 
                   await redis.get(`user:${user.id}:isAdmin`);

    log.info('Admin check performed', { userId: user.id, isAdmin: Boolean(isAdmin) });
    return NextResponse.json({ isAdmin: Boolean(isAdmin) });
  } catch (error) {
    log.error('Admin check error', { error: error instanceof Error ? error : new Error(String(error)) });
    return handleApiError(error);
  }
}