import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';

/**
 * Debug endpoint to check current user's subscription status
 * Helps troubleshoot Pro users who appear as free users
 * 
 * Usage: Visit /api/debug/user while logged in
 */
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        subscription: true,
        stripeCustomerId: true,
        hadTrial: true,
        trialStarted: true,
        trialEnds: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Get scan usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scansToday = await prisma.scan.count({
      where: {
        userId: user.id,
        createdAt: { gte: today },
      },
    });

    const scansTotal = await prisma.scan.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      clerk: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      database: dbUser,
      usage: {
        scansToday,
        scansTotal,
        limit: dbUser.subscription === 'free' ? 1 : dbUser.subscription === 'pro' ? 10 : 999999,
      },
      debug: {
        isPro: dbUser.subscription === 'pro' || dbUser.subscription === 'enterprise',
        hasStripeCustomer: !!dbUser.stripeCustomerId,
        isInTrial: dbUser.trialEnds ? new Date(dbUser.trialEnds) > new Date() : false,
      },
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
