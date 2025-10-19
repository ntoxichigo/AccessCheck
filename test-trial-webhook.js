/**
 * Test script to simulate Stripe trial webhook locally
 * Usage: node test-trial-webhook.js <userId>
 */

const userId = process.argv[2];

if (!userId) {
  console.error('❌ Please provide a userId: node test-trial-webhook.js user_xxxxx');
  process.exit(1);
}

// Simulate the webhook by directly updating the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateTrialWebhook() {
  try {
    console.log('🔄 Simulating trial webhook for user:', userId);
    
    // This mimics what the Stripe webhook does
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: 'trial',
        trialStarted: now,
        trialEnds: trialEnd,
        hadTrial: true,
      },
      select: {
        id: true,
        email: true,
        subscription: true,
        trialStarted: true,
        trialEnds: true,
      },
    });
    
    console.log('✅ Trial activated successfully:');
    console.log(JSON.stringify(updated, null, 2));
    console.log('\n📊 Now refresh your dashboard to see "Trial (Pro Features)" with 10 scans/day');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

simulateTrialWebhook();
