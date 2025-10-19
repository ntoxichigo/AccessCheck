import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { log } from '@/lib/logger';
import { prisma } from '@/lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

/**
 * Cancel subscription (with feedback)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reason } = await req.json();

    // Get user from database to retrieve Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    // Get user's current subscription from Stripe (include trialing)
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      limit: 1,
      // omit status filter to include 'trialing' subscriptions
    });

    if (!subscriptions.data.length) {
      return NextResponse.json({ error: 'No subscription found to cancel' }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    // Cancel at period end (not immediately)
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
      metadata: {
        cancel_reason: reason || 'No reason provided',
        canceled_by: userId,
        canceled_at: new Date().toISOString(),
      },
    });

    // Update database to reflect cancellation status
    await prisma.user.update({
      where: { id: userId },
      data: {
        // Keep subscription as-is but we'll check cancelAtPeriodEnd in the UI
        // The webhook will handle downgrading to 'free' when period ends
      },
    });

    // Log cancellation reason
    log.info('Subscription canceled', {
      userId,
      subscriptionId: subscription.id,
      reason: reason || 'No reason provided',
      cancelAt: updatedSubscription.cancel_at ? new Date(updatedSubscription.cancel_at * 1000).toISOString() : null,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: updatedSubscription.cancel_at ? new Date(updatedSubscription.cancel_at * 1000).toISOString() : null,
    });
  } catch (error) {
    log.error('Cancel subscription error:', { error: error as Error });
    return NextResponse.json(
      { error: 'Failed to cancel subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
