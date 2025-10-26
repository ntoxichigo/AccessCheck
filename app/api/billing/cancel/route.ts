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

    // Get user's current subscription from Stripe (include all statuses)
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      limit: 1,
      status: 'all', // Include all subscription statuses
    });

    if (!subscriptions.data.length) {
      return NextResponse.json({ 
        error: 'No active subscription found',
        message: 'You don\'t have an active subscription to cancel' 
      }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    // Check if subscription is already canceled or set to cancel
    if (subscription.status === 'canceled') {
      const canceledAt = subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'previously';
      return NextResponse.json({ 
        error: 'Subscription already canceled',
        message: `Your subscription was already canceled ${canceledAt}` 
      }, { status: 400 });
    }

    if (subscription.cancel_at_period_end) {
      const subData = subscription as unknown as { current_period_end?: number };
      const expiresAt = subData.current_period_end
        ? new Date(subData.current_period_end * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'soon';
      return NextResponse.json({ 
        error: 'Subscription already expiring',
        message: `Your subscription is already set to expire on ${expiresAt}. You can reactivate it anytime before then.` 
      }, { status: 400 });
    }

    // Only allow canceling active or trialing subscriptions
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return NextResponse.json({ 
        error: 'Cannot cancel subscription',
        message: `Your subscription status is "${subscription.status}" and cannot be canceled` 
      }, { status: 400 });
    }

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
