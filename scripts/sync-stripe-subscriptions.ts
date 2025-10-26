/**
 * Script to sync database subscription status with Stripe
 * Fixes users who show "pro" in database but don't have active Stripe subscriptions
 * 
 * Usage: npx tsx scripts/sync-stripe-subscriptions.ts
 */

import Stripe from 'stripe';
import { prisma } from '../lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

async function syncSubscriptions() {
  console.log('🔄 Syncing database with Stripe subscription status...\n');

  // Find all users with paid subscriptions
  const paidUsers = await prisma.user.findMany({
    where: {
      subscription: { in: ['pro', 'trial', 'business', 'enterprise'] },
      stripeCustomerId: { not: null },
    },
    select: {
      id: true,
      email: true,
      subscription: true,
      stripeCustomerId: true,
    },
  });

  console.log(`Found ${paidUsers.length} users with paid subscriptions\n`);

  let synced = 0;
  let downgraded = 0;
  let errors = 0;
  let alreadyCorrect = 0;

  for (const user of paidUsers) {
    try {
      console.log(`Checking: ${user.email} (${user.subscription})`);

      if (!user.stripeCustomerId) {
        console.log(`  ⚠️  No Stripe customer ID - downgrading to free\n`);
        await prisma.user.update({
          where: { id: user.id },
          data: { subscription: 'free' },
        });
        downgraded++;
        continue;
      }

      // Fetch their Stripe subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 1,
        status: 'all',
      });

      if (subscriptions.data.length === 0) {
        console.log(`  ⚠️  No Stripe subscription found - downgrading to free\n`);
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            subscription: 'free',
            trialEnds: null,
          },
        });
        downgraded++;
        continue;
      }

      const subscription = subscriptions.data[0];
      console.log(`  📋 Stripe status: ${subscription.status}`);
      
      // Determine the correct plan
      let correctPlan = 'free';
      if (subscription.items.data.length > 0) {
        const priceId = subscription.items.data[0].price.id;
        
        if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
          correctPlan = 'pro';
        } else if (priceId === process.env.STRIPE_PRICE_ID_BUSINESS) {
          correctPlan = 'business';
        }
      }

      const isTrialing = subscription.status === 'trialing';
      const isActive = subscription.status === 'active';
      const isCanceled = subscription.status === 'canceled';
      const isPastDue = subscription.status === 'past_due';

      // Determine what subscription should be in database
      let dbSubscription = 'free';
      
      if (isTrialing) {
        dbSubscription = 'trial';
      } else if (isActive || isPastDue) {
        dbSubscription = correctPlan;
      } else if (isCanceled) {
        // Check if canceled but still in grace period
        const subData = subscription as unknown as { current_period_end?: number };
        const periodEnd = subData.current_period_end;
        if (periodEnd && periodEnd * 1000 > Date.now()) {
          // Still has access until period ends
          dbSubscription = correctPlan;
          console.log(`  ⏰ Canceled but active until ${new Date(periodEnd * 1000).toISOString()}`);
        } else {
          dbSubscription = 'free';
        }
      }

      if (user.subscription !== dbSubscription) {
        console.log(`  🔧 Updating: "${user.subscription}" → "${dbSubscription}"`);
        
        const updateData: {
          subscription: string;
          trialEnds?: Date | null;
        } = {
          subscription: dbSubscription,
        };

        // Clear trial end if no longer trialing
        if (!isTrialing) {
          updateData.trialEnds = null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
        
        synced++;
        console.log(`  ✅ Synced!\n`);
      } else {
        console.log(`  ✓ Already correct\n`);
        alreadyCorrect++;
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error instanceof Error ? error.message : String(error)}\n`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  🔄 Synced: ${synced}`);
  console.log(`  ⬇️  Downgraded to free: ${downgraded}`);
  console.log(`  ✓ Already correct: ${alreadyCorrect}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log('='.repeat(60));
}

// Run the script
syncSubscriptions()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
