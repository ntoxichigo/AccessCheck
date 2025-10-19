import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../../lib/db/prisma";
import { log } from "../../../../lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      log.error("Webhook error: No signature");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      log.error("Webhook signature verification failed", { error: err instanceof Error ? err : new Error(errorMessage) });
      return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
    }

    log.info("Stripe webhook received", { type: event.type, id: event.id });

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        log.info("Unhandled webhook event type", { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("Webhook handler error", { error: error instanceof Error ? error : new Error(errorMessage) });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const customerEmail = session.customer_email;

  if (!userId && !customerEmail) {
    log.error("Checkout completed but no user identifier found", { sessionId: session.id });
    return;
  }

  // SECURITY: Validate that the Stripe customer email matches the user's registered email
  if (userId && customerEmail) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (dbUser && dbUser.email.toLowerCase() !== customerEmail.toLowerCase()) {
      log.error("EMAIL MISMATCH DETECTED: Stripe customer email does not match user's registered email", {
        userId,
        registeredEmail: dbUser.email,
        stripeEmail: customerEmail,
        sessionId: session.id,
      });
      // Still process but log the mismatch for investigation
    }
  }

  // Determine which plan was purchased
  let plan = "free";
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  
  if (lineItems.data.length > 0) {
    const priceId = lineItems.data[0].price?.id;
    
    // Map price IDs to plans
    if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
      plan = "pro";
    } else if (priceId === process.env.STRIPE_PRICE_ID_BUSINESS) {
      plan = "business";
    }
  }

  log.info("Checkout completed", { userId: userId ?? undefined, customerEmail: customerEmail ?? undefined, plan, sessionId: session.id });

  // Update user subscription
  if (userId) {
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: customerEmail || userId,
        subscription: plan,
        stripeCustomerId: session.customer as string,
      },
      update: {
        subscription: plan,
        stripeCustomerId: session.customer as string,
      },
    });
  }

  // Create billing record
  // TODO: Prisma client needs IDE restart to recognize Billing model after prisma generate
  // Uncomment after restarting TypeScript server or reopening VS Code
  /* 
  await prisma.billing.create({
    data: {
      userId: userId || `email:${customerEmail}`,
      plan,
      status: "active",
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || "usd",
    },
  });
  */

  log.info("User subscription updated", { userId: userId ?? undefined, plan });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const metadataUserId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;
  // Use metadata userId if present, otherwise fall back to stored stripeCustomerId
  let userId: string | undefined = metadataUserId;
  if (!userId) {
    const dbUser = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
    if (dbUser) {
      userId = dbUser.id;
    }
  }

  if (!userId) {
    log.warn("Subscription change but no userId in metadata or stripeCustomerId match", { subscriptionId: subscription.id, customerId });
    return;
  }

  // Determine plan from subscription
  let plan = "free";
  if (subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id;
    
    if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
      plan = "pro";
    } else if (priceId === process.env.STRIPE_PRICE_ID_BUSINESS) {
      plan = "business";
    }
  }

  const status = subscription.status === "active" ? "active" :
                 subscription.status === "past_due" ? "past_due" :
                 subscription.status === "canceled" ? "cancelled" : "active";

  // Check if this is a trial subscription
  const isTrialing = subscription.status === "trialing";
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;

  // Update user
  const updateData: {
    subscription: string;
    trialStarted?: Date;
    trialEnds?: Date;
    hadTrial?: boolean;
  } = {
    subscription: isTrialing ? "trial" : plan,
  };

  // If trial is active, set trial dates
  if (isTrialing && trialEnd) {
    updateData.trialStarted = new Date();
    updateData.trialEnds = trialEnd;
    updateData.hadTrial = true;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  // Update or create billing record (temporarily commented out until Prisma regenerated)
  // await prisma.billing.upsert({
  //   where: { id: subscription.id },
  //   create: {
  //     id: subscription.id,
  //     userId,
  //     plan,
  //     status,
  //     amount: subscription.items.data[0]?.price?.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0,
  //     currency: subscription.currency || "usd",
  //     expiresAt: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
  //   },
  //   update: {
  //     plan,
  //     status,
  //     expiresAt: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
  //   },
  // });

  log.info("Subscription updated", { 
    userId, 
    plan, 
    status, 
    isTrialing, 
    trialEnd: trialEnd?.toISOString(),
    updateData 
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const metadataUserId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;
  // Use metadata userId if present, otherwise fall back to stored stripeCustomerId
  let userId: string | undefined = metadataUserId;
  if (!userId) {
    const dbUser = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
    if (dbUser) {
      userId = dbUser.id;
    }
  }

  if (!userId) {
    log.warn("Subscription deleted but no userId in metadata or stripeCustomerId match", { subscriptionId: subscription.id, customerId });
    return;
  }

  // Downgrade user to free
  await prisma.user.update({
    where: { id: userId },
    data: { subscription: "free" },
  });

  // Update billing record (temporarily commented out until Prisma regenerated)
  // await prisma.billing.updateMany({
  //   where: { userId },
  //   data: { status: "cancelled" },
  // });

  log.info("Subscription cancelled, user downgraded to free", { userId });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  log.info("Payment succeeded", { customerId, amount: invoice.amount_paid });

  // You can send a thank you email here or update billing records
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  log.error("Payment failed", { customerId, amount: invoice.amount_due });

  // You can send a payment failure email here
  // Note: Subscription status will be updated via subscription.updated webhook
}
