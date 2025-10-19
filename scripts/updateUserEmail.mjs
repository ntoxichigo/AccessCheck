// Script to update a user's email to match their Stripe customer
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function updateUserEmail(userId, newEmail, stripeCustomerId) {
  try {
    console.log(`🔧 Updating user ${userId}...`);
    console.log(`   New email: ${newEmail}`);
    console.log(`   Stripe Customer ID: ${stripeCustomerId}`);
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        stripeCustomerId: stripeCustomerId,
        subscription: 'trial',
        trialStarted: new Date(),
        trialEnds: new Date('2025-10-20T21:01:59.000Z'),
        hadTrial: true,
      }
    });
    
    console.log('✅ Successfully updated user!');
    console.log('📊 New user data:');
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Subscription: ${updatedUser.subscription}`);
    console.log(`   Trial Ends: ${updatedUser.trialEnds}`);
    console.log(`   Stripe Customer ID: ${updatedUser.stripeCustomerId}`);
    
  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get parameters from command line
const userId = process.argv[2];
const email = process.argv[3] || 'gabrieledelmonte65@gmail.com';
const stripeCustomerId = process.argv[4] || 'cus_TFqTTcVgS8Wnvo';

if (!userId) {
  console.error('❌ Please provide a user ID');
  console.log('Usage: npm run db:update-user-email <userId> [email] [stripeCustomerId]');
  console.log('Example: npm run db:update-user-email user_33sZn3KK8SmaXCDE213I40HTApN gabrieledelmonte65@gmail.com cus_TFqTTcVgS8Wnvo');
  process.exit(1);
}

updateUserEmail(userId, email, stripeCustomerId);
