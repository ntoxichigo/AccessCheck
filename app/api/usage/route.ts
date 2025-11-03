import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/db/prisma';
import { log } from '../../../lib/logger';
import { handleApiError } from '../../../lib/errors';

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        subscription: true,
        trialStarted: true,
        trialEnds: true,
      },
    });

    // Get user's plan - subscription field is already set by webhook
    // It can be: 'free', 'trial', 'pro', 'enterprise'
    const plan = dbUser?.subscription || 'free';

    // Get usage based on plan
    let scansUsed = 0;
    let scansLimit = 3; // Default for free: 3 scans per day
    let period: 'total' | 'daily' = 'daily';

    if (plan === 'free') {
      // Free users: 3 scans per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      scansUsed = await prisma.scan.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: today,
          },
        },
      });
      scansLimit = 3;
      period = 'daily';
    } else if (plan === 'pro' || plan === 'trial') {
      // Pro and Trial users: 10 scans per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      scansUsed = await prisma.scan.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: today,
          },
        },
      });
      scansLimit = 10;
      period = 'daily';
    } else {
      // Enterprise: unlimited
      scansUsed = await prisma.scan.count({
        where: { userId: user.id },
      });
      scansLimit = 999999;
      period = 'total';
    }

    log.info('Usage data fetched', {
      userId: user.id,
      plan,
      scansUsed,
      scansLimit,
    });

    return NextResponse.json({
      scansUsed,
      scansLimit,
      plan,
      period,
      remaining: Math.max(0, scansLimit - scansUsed),
      percentage: (scansUsed / scansLimit) * 100,
    });
  } catch (error) {
    log.error('Usage fetch error', {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return handleApiError(error);
  }
}
