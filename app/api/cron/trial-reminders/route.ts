/**
 * API Route: Send Trial Reminder Emails
 * This should be called by a cron job daily to check for users needing trial reminders
 * 
 * Cron schedule: Run daily at 9 AM UTC
 * Vercel Cron: https://vercel.com/docs/cron-jobs
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendTrialDay7Email, sendTrialDay12Email, sendTrialDay13Email } from '@/lib/trial-reminder-emails';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = {
      day7: 0,
      day12: 0,
      day13: 0,
      errors: [] as string[],
    };

    // Find users currently in trial
    const trialUsers = await prisma.user.findMany({
      where: {
        trialStarted: { not: null },
        trialEnds: { 
          not: null,
          gt: now, // Trial hasn't ended yet
        },
        hadTrial: false, // Still in first trial
      },
      select: {
        id: true,
        email: true,
        trialStarted: true,
        trialEnds: true,
      },
    });

    console.log(`📧 Processing ${trialUsers.length} trial users for reminders`);

    for (const user of trialUsers) {
      if (!user.trialStarted || !user.trialEnds) continue;

      const trialStartDate = new Date(user.trialStarted);
      const trialEndDate = new Date(user.trialEnds);
      const daysInTrial = Math.floor((now.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Get user name (you may want to add firstName/lastName fields to User model)
      const userName = user.email.split('@')[0]; // Fallback to email username

      const emailData = {
        userName,
        userEmail: user.email,
        daysRemaining,
        trialEndsDate: trialEndDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      };

      try {
        // Day 7 reminder (halfway through)
        if (daysInTrial === 7) {
          await sendTrialDay7Email(emailData);
          results.day7++;
          
          // Log to audit
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'trial_reminder_day7_sent',
              details: { email: user.email, daysRemaining },
            },
          });
        }

        // Day 12 reminder (2 days left)
        if (daysRemaining === 2) {
          await sendTrialDay12Email(emailData);
          results.day12++;
          
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'trial_reminder_day12_sent',
              details: { email: user.email, daysRemaining: 2 },
            },
          });
        }

        // Day 13 reminder (last day!)
        if (daysRemaining === 1) {
          await sendTrialDay13Email(emailData);
          results.day13++;
          
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'trial_reminder_day13_sent',
              details: { email: user.email, daysRemaining: 1 },
            },
          });
        }
      } catch (error) {
        const errorMsg = `Failed to send reminder to ${user.email}: ${error}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    console.log(`✅ Trial reminders sent:`, results);

    return NextResponse.json({
      success: true,
      message: 'Trial reminders processed',
      results,
      totalUsersProcessed: trialUsers.length,
    });

  } catch (error) {
    console.error('❌ Error processing trial reminders:', error);
    return NextResponse.json(
      { error: 'Failed to process trial reminders', details: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
