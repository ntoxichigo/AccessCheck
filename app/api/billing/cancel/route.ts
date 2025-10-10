import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { log } from '@/lib/logger';

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

    // Get user's current subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: userId, // Replace with actual customer ID from database
      limit: 1,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    // Cancel at period end (not immediately)
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
      metadata: {
        cancel_reason: reason,
        canceled_by: userId,
        canceled_at: new Date().toISOString(),
      },
    });

    // Log cancellation reason
    log.info('Subscription canceled', {
      userId,
      subscriptionId: subscription.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    });
  } catch (error) {
    log.error('Cancel subscription error:', { error: error as Error });
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
