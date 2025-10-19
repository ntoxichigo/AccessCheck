// Script to list all users in the database
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        subscription: true,
        hadTrial: true,
        trialEnds: true,
        stripeCustomerId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\n📋 Found ${users.length} user(s) in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Subscription: ${user.subscription}`);
      console.log(`   Had Trial: ${user.hadTrial}`);
      console.log(`   Trial Ends: ${user.trialEnds || 'N/A'}`);
      console.log(`   Stripe Customer ID: ${user.stripeCustomerId || 'N/A'}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
