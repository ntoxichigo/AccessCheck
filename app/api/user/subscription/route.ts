import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';
import { log } from '../../../../lib/logger';
import { handleApiError } from '../../../../lib/errors';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

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
        trialEnds: true,
        trialStarted: true,
        stripeCustomerId: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({
        subscription: 'free',
        status: 'active',
      });
    }

    // Use subscription field from database (webhook sets it to "trial" when active)
    const subscription = dbUser.subscription || 'free';

    // If user has a Stripe customer ID, check Stripe for cancellation status
    let cancelAtPeriodEnd = false;
    let currentPeriodEnd = dbUser.trialEnds?.toISOString();

    if (dbUser.stripeCustomerId && subscription !== 'free') {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: dbUser.stripeCustomerId,
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const stripeSub = subscriptions.data[0];
          cancelAtPeriodEnd = stripeSub.cancel_at_period_end;
          currentPeriodEnd = stripeSub.current_period_end
            ? new Date(stripeSub.current_period_end * 1000).toISOString()
            : currentPeriodEnd;
        }
      } catch (stripeError) {
        log.warn('Failed to fetch Stripe subscription status', { error: stripeError });
        // Continue with database values
      }
    }

    log.info('Subscription fetched', {
      userId: user.id,
      subscription,
      cancelAtPeriodEnd,
    });

    return NextResponse.json({
      subscription,
      status: cancelAtPeriodEnd ? 'canceled' : 'active',
      currentPeriodEnd,
      trialEnds: dbUser.trialEnds?.toISOString(),
      cancelAtPeriodEnd,
    });
  } catch (error) {
    log.error('Subscription fetch error', {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return handleApiError(error);
  }
}
