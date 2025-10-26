/**
 * Script to fix users stuck in "trial" status when their Stripe subscription is actually "active"
 * Run this to sync database with Stripe after deploying the webhook fix
 * 
 * Usage: npx tsx scripts/fix-trial-to-pro.ts
 */

import Stripe from 'stripe';
import { prisma } from '../lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

async function fixTrialSubscriptions() {
  console.log('🔍 Finding users with trial subscriptions...\n');

  // Find all users with "trial" subscription
  const trialUsers = await prisma.user.findMany({
    where: {
      subscription: 'trial',
      stripeCustomerId: { not: null },
    },
    select: {
      id: true,
      email: true,
      subscription: true,
      trialEnds: true,
      stripeCustomerId: true,
    },
  });

  console.log(`Found ${trialUsers.length} users with trial subscription\n`);

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of trialUsers) {
    try {
      console.log(`Checking user: ${user.email} (${user.id})`);

      if (!user.stripeCustomerId) {
        console.log(`  ⏭️  Skipped - No Stripe customer ID\n`);
        skipped++;
        continue;
      }

      // Fetch their Stripe subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 1,
        status: 'all',
      });

      if (subscriptions.data.length === 0) {
        console.log(`  ⚠️  No Stripe subscription found\n`);
        skipped++;
        continue;
      }

      const subscription = subscriptions.data[0];
      console.log(`  📋 Stripe status: ${subscription.status}`);
      console.log(`  📅 Trial end: ${subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : 'N/A'}`);

      // Determine the correct plan
      let plan = 'free';
      if (subscription.items.data.length > 0) {
        const priceId = subscription.items.data[0].price.id;
        
        if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
          plan = 'pro';
        } else if (priceId === process.env.STRIPE_PRICE_ID_BUSINESS) {
          plan = 'business';
        }
      }

      const isTrialing = subscription.status === 'trialing';
      const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
      const trialHasEnded = trialEnd && trialEnd.getTime() <= Date.now();
      
      // Keep paid plan if subscription is active, trialing, past_due, or canceled (but not deleted)
      const shouldKeepPaidPlan = subscription.status === 'active' || 
                                 subscription.status === 'trialing' || 
                                 subscription.status === 'past_due' ||
                                 subscription.status === 'canceled';

      // Determine correct subscription status
      const correctStatus = !shouldKeepPaidPlan ? 'free' : (isTrialing ? 'trial' : plan);

      if (correctStatus !== user.subscription) {
        console.log(`  🔧 Updating: "${user.subscription}" → "${correctStatus}"`);

        const updateData: {
          subscription: string;
          trialEnds?: Date | null;
          hadTrial?: boolean;
        } = {
          subscription: correctStatus,
        };

        // If trial has ended, clear trial end date
        if (trialHasEnded && !isTrialing) {
          updateData.trialEnds = null;
          updateData.hadTrial = true;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });

        console.log(`  ✅ Fixed!\n`);
        fixed++;
      } else {
        console.log(`  ✓ Already correct\n`);
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error instanceof Error ? error.message : String(error)}\n`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log(`  ✅ Fixed: ${fixed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log('='.repeat(50));
}

// Run the script
fixTrialSubscriptions()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
