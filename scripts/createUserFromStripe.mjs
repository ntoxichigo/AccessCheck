// Script to create a user from existing Stripe customer data
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

async function createUserFromStripe(clerkUserId, stripeCustomerId) {
  try {
    console.log('🔍 Fetching Stripe customer:', stripeCustomerId);
    
    // Get customer and subscription from Stripe
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
    });
    
    console.log('📧 Customer email:', customer.email);
    console.log('📋 Found', subscriptions.data.length, 'subscription(s)');
    
    const trialingSub = subscriptions.data.find(sub => sub.status === 'trialing');
    
    if (!trialingSub) {
      console.log('⚠️  No trialing subscription found, creating user with free plan');
    } else {
      console.log('✅ Found trialing subscription:', trialingSub.id);
      console.log('📅 Trial ends:', new Date(trialingSub.trial_end * 1000).toISOString());
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: clerkUserId }
    });
    
    if (existingUser) {
      console.log('⚠️  User already exists, updating...');
      
      const updateData = {
        email: customer.email,
        stripeCustomerId: stripeCustomerId,
      };
      
      if (trialingSub) {
        updateData.subscription = 'trial';
        updateData.trialStarted = new Date();
        updateData.trialEnds = new Date(trialingSub.trial_end * 1000);
        updateData.hadTrial = true;
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: clerkUserId },
        data: updateData
      });
      
      console.log('✅ Successfully updated user!');
      console.log('📊 User data:');
      console.log('   ID:', updatedUser.id);
      console.log('   Email:', updatedUser.email);
      console.log('   Subscription:', updatedUser.subscription);
      console.log('   Trial Ends:', updatedUser.trialEnds);
      console.log('   Stripe Customer ID:', updatedUser.stripeCustomerId);
      
      return;
    }
    
    // Create new user
    console.log('🔧 Creating new user...');
    
    const userData = {
      id: clerkUserId,
      email: customer.email,
      stripeCustomerId: stripeCustomerId,
      subscription: 'free',
      hadTrial: false,
    };
    
    if (trialingSub) {
      userData.subscription = 'trial';
      userData.trialStarted = new Date();
      userData.trialEnds = new Date(trialingSub.trial_end * 1000);
      userData.hadTrial = true;
    }
    
    const newUser = await prisma.user.create({
      data: userData
    });
    
    console.log('✅ Successfully created user!');
    console.log('📊 User data:');
    console.log('   ID:', newUser.id);
    console.log('   Email:', newUser.email);
    console.log('   Subscription:', newUser.subscription);
    console.log('   Trial Ends:', newUser.trialEnds);
    console.log('   Stripe Customer ID:', newUser.stripeCustomerId);
    
  } catch (error) {
    console.error('❌ Error creating/updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get parameters from command line
const clerkUserId = process.argv[2];
const stripeCustomerId = process.argv[3] || 'cus_TFqTTcVgS8Wnvo';

if (!clerkUserId) {
  console.error('❌ Please provide your Clerk user ID');
  console.log('Usage: npm run db:create-user <clerkUserId> [stripeCustomerId]');
  console.log('Example: npm run db:create-user user_abc123 cus_TFqTTcVgS8Wnvo');
  console.log('\nYour Clerk user ID should be visible in your app logs when you load a page while logged in.');
  process.exit(1);
}

createUserFromStripe(clerkUserId, stripeCustomerId);
