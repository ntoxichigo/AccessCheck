import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { prisma } from '../../../../lib/db/prisma';
import { log } from '../../../../lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

/**
 * Create Stripe Customer Portal session
 * Allows users to manage subscription, update payment method, view invoices
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    // If no customer ID exists, find or create Stripe customer
    if (!customerId) {
      // Try to find customer by email
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: userId,
          },
        });
        customerId = customer.id;
      }

      // Save customer ID to database
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create portal session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    log.info('Creating portal session', {
      userId,
      customerId,
      baseUrl,
      returnUrl: `${baseUrl}/settings?tab=subscription`,
    });
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/settings?tab=subscription`,
    });

    log.info('Customer portal session created', {
      userId,
      customerId,
      sessionId: session.id,
      returnUrl: `${baseUrl}/settings?tab=subscription`,
      url: session.url,
    });

    // Redirect directly to Stripe portal
    return NextResponse.redirect(session.url);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    log.error('Portal session error:', { 
      error: error as Error,
      message: errorMessage,
      stack: errorStack,
    });
    
    console.error('Full portal error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create portal session',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
