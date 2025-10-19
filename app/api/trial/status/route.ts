import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';
import { log } from '../../../../lib/logger';
import { handleApiError } from '../../../../lib/errors';

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
        hadTrial: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const isTrialActive = dbUser.trialEnds && new Date(dbUser.trialEnds) > now;
    const trialExpired = dbUser.trialEnds && new Date(dbUser.trialEnds) <= now;

    let daysRemaining = 0;
    if (isTrialActive && dbUser.trialEnds) {
      const diff = new Date(dbUser.trialEnds).getTime() - now.getTime();
      daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    // Auto-downgrade if trial expired
    if (trialExpired && dbUser.subscription === 'pro') {
      await prisma.user.update({
        where: { id: user.id },
        data: { subscription: 'free' },
      });

      log.info('Trial expired, user downgraded', { userId: user.id });

      return NextResponse.json({
        hadTrial: dbUser.hadTrial,
        isTrialActive: false,
        trialExpired: true,
        trialEnds: dbUser.trialEnds,
        daysRemaining: 0,
        subscription: 'free',
      });
    }

    return NextResponse.json({
      hadTrial: dbUser.hadTrial,
      isTrialActive,
      trialExpired,
      trialStarted: dbUser.trialStarted,
      trialEnds: dbUser.trialEnds,
      daysRemaining,
      subscription: dbUser.subscription,
    });
  } catch (error) {
    log.error('Trial status error', {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return handleApiError(error);
  }
}
