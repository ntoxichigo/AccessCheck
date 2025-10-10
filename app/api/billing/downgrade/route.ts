import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

/**
 * Downgrade subscription (schedule for end of period)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

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

    // Schedule downgrade at period end
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
      metadata: {
        scheduled_plan: planId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Downgrade scheduled for end of billing period',
    });
  } catch (error) {
    console.error('Downgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to downgrade subscription' },
      { status: 500 }
    );
  }
}
