import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  const body = await req.json();
  const { plan, priceId: incomingPriceId, email } = body;

  // Determine priceId: prefer explicit priceId, otherwise map from known plans
  let priceId = incomingPriceId || "";
  if (!priceId) {
    if (plan === "pro") priceId = process.env.STRIPE_PRICE_ID_PRO || "";
    else if (plan === "business" || plan === 'enterprise') priceId = process.env.STRIPE_PRICE_ID_BUSINESS || "";
  }

  if (!priceId) {
    return NextResponse.json({ error: "Stripe price ID not configured for selected plan" }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?upgrade=cancel`,
    });

    // Stripe's session object may include a hosted URL (session.url) in newer API versions
    const url = (session as any).url || null;

    return NextResponse.json({ sessionId: session.id, url });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
