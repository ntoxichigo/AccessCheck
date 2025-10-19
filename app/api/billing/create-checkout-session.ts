import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  try {
    // Authenticate user first
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user email from Clerk (authenticated source) - NEVER trust client-supplied email
    const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Email address not found' }, { status: 400 });
    }

    const body = await req.json();
    const { plan, priceId: incomingPriceId } = body;

    // Determine priceId: prefer explicit priceId, otherwise map from known plans
    let priceId = incomingPriceId || "";
    if (!priceId) {
      if (plan === "pro") priceId = process.env.STRIPE_PRICE_ID_PRO || "";
      else if (plan === "business" || plan === 'enterprise') priceId = process.env.STRIPE_PRICE_ID_BUSINESS || "";
    }

    if (!priceId) {
      return NextResponse.json({ error: "Stripe price ID not configured for selected plan" }, { status: 500 });
    }

    // Check if user already has a Stripe customer ID
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    // Create session with authenticated user's email only
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail, // Always use authenticated email
      client_reference_id: user.id, // Link to our user ID
      metadata: {
        userId: user.id,
        plan: plan || 'unknown',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?upgrade=cancel`,
    };

    // If user already has a Stripe customer, use it instead of customer_email
    if (dbUser?.stripeCustomerId) {
      delete sessionParams.customer_email;
      sessionParams.customer = dbUser.stripeCustomerId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Return the checkout URL
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
