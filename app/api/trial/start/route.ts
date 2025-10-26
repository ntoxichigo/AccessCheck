import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';
import { log } from '../../../../lib/logger';
import { handleApiError } from '../../../../lib/errors';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY!;
console.log('🔑 DEBUG: Stripe key being used:', stripeKey.substring(0, 15) + '***');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-09-30.clover',
});

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { hadTrial: true, trialEnds: true, subscription: true, email: true },
    });
    
    // Get user email from Clerk or database (prioritize Clerk as source of truth)
    const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || dbUser?.email;
    
    console.log('🔍 DEBUG: User email sources:', {
      userId: user.id,
      dbUserEmail: dbUser?.email,
      clerkEmailAddresses: user.emailAddresses?.[0]?.emailAddress,
      clerkPrimaryEmail: user.primaryEmailAddress?.emailAddress,
      finalUserEmail: userEmail,
      hasValidEmail: userEmail && userEmail.includes('@')
    });
    
    // CRITICAL: Validate that we have a real email, not a userId
    if (!userEmail || !userEmail.includes('@')) {
      log.error('Cannot start trial - no valid email found', {
        userId: user.id,
        attemptedEmail: userEmail,
      });
      return NextResponse.json(
        { error: 'No valid email address found. Please add an email to your account before starting a trial.' },
        { status: 400 }
      );
    }

    // Check if user already had a trial
    // Only block if they had a trial AND it wasn't immediately canceled
    if (dbUser?.hadTrial) {
      // Check if they have a Stripe subscription that shows they used the trial
      const hasUsedTrial = dbUser.subscription !== 'free' || 
                           (dbUser.trialEnds && new Date(dbUser.trialEnds) < new Date());
      
      if (hasUsedTrial) {
        return NextResponse.json(
          { error: 'You have already used your free trial' },
          { status: 400 }
        );
      }
      // If hadTrial is true but they're still on free and no trial end date, allow retry
      log.info('Allowing trial retry - previous trial may have been incomplete', {
        userId: user.id,
        hadTrial: dbUser.hadTrial,
        subscription: dbUser.subscription,
        trialEnds: dbUser.trialEnds,
      });
    }

    // Check if user is already on a paid plan
    if (dbUser?.subscription === 'pro' || dbUser?.subscription === 'enterprise') {
      return NextResponse.json(
        { error: 'You are already on a paid plan' },
        { status: 400 }
      );
    }

    // Check if trial is already active
    if (dbUser?.trialEnds && new Date(dbUser.trialEnds) > new Date()) {
      return NextResponse.json(
        { error: 'You already have an active trial', trialEnds: dbUser.trialEnds },
        { status: 400 }
      );
    }

    // Get the Pro plan price ID from environment
    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session with 3-day trial
    console.log('🎯 DEBUG: Creating Stripe session with email:', userEmail);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        isTrial: 'true',
        userEmail: userEmail, // Store email in metadata for validation
      },
      subscription_data: {
        trial_period_days: 3, // 3-day trial
        metadata: {
          userId: user.id,
          startedAt: new Date().toISOString(),
          userEmail: userEmail,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?trial=started`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?trial=canceled`,
    });

    // DO NOT activate trial immediately - wait for webhook confirmation
    // This ensures trial only activates if user completes checkout
    console.log('🔔 Trial checkout session created - waiting for completion:', {
      userId: user.id,
      sessionId: session.id,
      userEmail: userEmail,
    });

    // Log trial start attempt
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'trial_checkout_created',
        details: {
          sessionId: session.id,
          createdAt: new Date().toISOString(),
        },
      },
    });

    log.info('Trial checkout session created', {
      userId: user.id,
      sessionId: session.id,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    log.error('Trial start error', {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return handleApiError(error);
  }
}
