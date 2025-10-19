// Script to manually sync a user's trial from Stripe to database
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

const prisma = new PrismaClient();

async function syncTrialFromStripe(stripeCustomerId) {
  try {
    console.log('🔍 Fetching Stripe customer:', stripeCustomerId);
    
    // Get customer details
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    console.log('📧 Customer email:', customer.email);
    
    // Get subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
    });
    
    console.log(`📋 Found ${subscriptions.data.length} subscription(s)`);
    
    if (subscriptions.data.length === 0) {
      console.log('❌ No subscriptions found for this customer');
      return;
    }
    
    // Find the trialing subscription
    const trialingSub = subscriptions.data.find(sub => sub.status === 'trialing');
    
    if (!trialingSub) {
      console.log('❌ No trialing subscription found');
      console.log('Available subscriptions:', subscriptions.data.map(s => ({
        id: s.id,
        status: s.status,
        trial_end: s.trial_end ? new Date(s.trial_end * 1000).toISOString() : null
      })));
      return;
    }
    
    console.log('✅ Found trialing subscription:', trialingSub.id);
    console.log('📅 Trial ends:', new Date(trialingSub.trial_end * 1000).toISOString());
    
    // Find user in database by stripeCustomerId
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: stripeCustomerId }
    });
    
    if (!user) {
      console.log('❌ No user found with stripeCustomerId:', stripeCustomerId);
      console.log('💡 Try finding by email:', customer.email);
      
      const userByEmail = await prisma.user.findUnique({
        where: { email: customer.email }
      });
      
      if (userByEmail) {
        console.log('✅ Found user by email:', userByEmail.id);
        console.log('🔧 Updating user with trial info and stripeCustomerId...');
        
        await prisma.user.update({
          where: { id: userByEmail.id },
          data: {
            subscription: 'trial',
            trialStarted: new Date(),
            trialEnds: new Date(trialingSub.trial_end * 1000),
            hadTrial: true,
            stripeCustomerId: stripeCustomerId,
          }
        });
        
        console.log('✅ Successfully synced trial for user:', userByEmail.id);
        console.log('📊 New status:');
        console.log('  - subscription: trial');
        console.log('  - trialEnds:', new Date(trialingSub.trial_end * 1000).toISOString());
        console.log('  - stripeCustomerId:', stripeCustomerId);
      } else {
        console.log('❌ No user found with email:', customer.email);
      }
      return;
    }
    
    console.log('✅ Found user:', user.id);
    console.log('🔧 Updating user with trial info...');
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription: 'trial',
        trialStarted: new Date(),
        trialEnds: new Date(trialingSub.trial_end * 1000),
        hadTrial: true,
      }
    });
    
    console.log('✅ Successfully synced trial for user:', user.id);
    console.log('📊 New status:');
    console.log('  - subscription: trial');
    console.log('  - trialEnds:', new Date(trialingSub.trial_end * 1000).toISOString());
    
  } catch (error) {
    console.error('❌ Error syncing trial:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
const customerId = process.argv[2] || 'cus_TFqTTcVgS8Wnvo';
console.log('🚀 Starting sync for customer:', customerId);
syncTrialFromStripe(customerId);
