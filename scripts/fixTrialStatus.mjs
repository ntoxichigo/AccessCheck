// Fix user subscription to show trial instead of pro when trial is active
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function fixTrialStatus(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscription: true,
        trialEnds: true,
        trialStarted: true,
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('📊 Current user status:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Subscription: ${user.subscription}`);
    console.log(`   Trial Ends: ${user.trialEnds}`);
    
    const now = new Date();
    const isTrialActive = user.trialEnds && now < user.trialEnds;
    
    if (isTrialActive && user.subscription !== 'trial') {
      console.log('\n🔧 Trial is active but subscription shows as', user.subscription);
      console.log('   Updating to "trial"...');
      
      await prisma.user.update({
        where: { id: userId },
        data: { subscription: 'trial' }
      });
      
      console.log('✅ Updated subscription to "trial"');
    } else if (!isTrialActive && user.subscription === 'trial') {
      console.log('\n🔧 Trial has ended but subscription still shows as "trial"');
      console.log('   Updating to "free"...');
      
      await prisma.user.update({
        where: { id: userId },
        data: { subscription: 'free' }
      });
      
      console.log('✅ Updated subscription to "free"');
    } else {
      console.log('\n✅ Subscription status is correct');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const userId = process.argv[2];

if (!userId) {
  console.error('❌ Please provide a user ID');
  console.log('Usage: npm run db:fix-trial <userId>');
  process.exit(1);
}

fixTrialStatus(userId);
