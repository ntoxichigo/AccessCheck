/**
 * Trial Management Helper Functions
 * Use these to manage 7-day trial periods for new users
 */

import { PrismaClient } from '@prisma/client';
import { sendTrialWelcomeEmail } from './trial-reminder-emails';

const prisma = new PrismaClient();

/**
 * Start a 7-day trial for a new user
 * Call this when a user signs up
 */
export async function startUserTrial(userId: string, userEmail: string) {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  try {
    // Update user with trial dates
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        trialStarted: now,
        trialEnds: trialEnd,
        hadTrial: false,
        subscription: 'pro', // Give them Pro features during trial
      },
    });

    // Log the trial start
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'trial_started',
        details: {
          email: userEmail,
          trialStarted: now,
          trialEnds: trialEnd,
        },
      },
    });

    // Send welcome email
    await sendTrialWelcomeEmail({
      userName: userEmail.split('@')[0],
      userEmail,
      daysRemaining: 7,
      trialEndsDate: trialEnd.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    console.log(`✅ Trial started for user ${userId} (${userEmail})`);
    return user;
  } catch (error) {
    console.error(`❌ Error starting trial for user ${userId}:`, error);
    throw error;
  }
}

/**
 * End a user's trial and downgrade to free plan
 * This should be called by a daily cron job
 */
export async function endExpiredTrials() {
  const now = new Date();

  try {
    // Find all users with expired trials
    const expiredTrials = await prisma.user.findMany({
      where: {
        trialEnds: { lte: now },
        hadTrial: false, // Still marked as in trial
        subscription: 'pro', // Still has Pro access
      },
    });

    console.log(`🔍 Found ${expiredTrials.length} expired trials`);

    let downgraded = 0;
    const errors: string[] = [];

    for (const user of expiredTrials) {
      try {
        // Downgrade to free plan
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscription: 'free',
            hadTrial: true, // Mark that they've had their trial
          },
        });

        // Log the downgrade
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'trial_expired',
            details: {
              email: user.email,
              expiredAt: now,
            },
          },
        });

        downgraded++;
        console.log(`📉 Downgraded ${user.email} from trial to free`);
      } catch (error) {
        const errorMsg = `Failed to downgrade ${user.email}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return {
      total: expiredTrials.length,
      downgraded,
      errors,
    };
  } catch (error) {
    console.error('❌ Error ending expired trials:', error);
    throw error;
  }
}

/**
 * Get trial status for a user
 */
export async function getTrialStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      trialStarted: true,
      trialEnds: true,
      hadTrial: true,
      subscription: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();

  // Not in trial
  if (!user.trialStarted || !user.trialEnds) {
    return {
      inTrial: false,
      canStartTrial: !user.hadTrial,
      message: user.hadTrial ? 'Trial already used' : 'No active trial',
    };
  }

  // Trial expired
  if (user.trialEnds < now) {
    return {
      inTrial: false,
      canStartTrial: false,
      message: 'Trial expired',
      expiredAt: user.trialEnds,
    };
  }

  // Active trial
  const daysRemaining = Math.ceil((user.trialEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    inTrial: true,
    canStartTrial: false,
    daysRemaining,
    trialEnds: user.trialEnds,
    message: `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`,
  };
}

/**
 * Check if user is eligible for a trial
 */
export async function isEligibleForTrial(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hadTrial: true },
  });

  return user ? !user.hadTrial : false;
}

/**
 * Convert trial user to paid subscription
 * Call this after successful Stripe payment
 */
export async function convertTrialToPaid(userId: string, plan: 'pro' | 'enterprise') {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: plan,
        hadTrial: true, // Mark trial as used
      },
    });

    // Log the conversion
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'trial_converted',
        details: {
          plan,
          convertedAt: new Date(),
        },
      },
    });

    console.log(`🎉 Trial converted to ${plan} for user ${userId}`);
    return user;
  } catch (error) {
    console.error(`❌ Error converting trial for user ${userId}:`, error);
    throw error;
  }
}
