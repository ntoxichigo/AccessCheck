/**
 * API Route: End Expired Trials
 * This should be called by a cron job daily to downgrade users whose trials have ended
 * 
 * Cron schedule: Run daily at 1 AM UTC (after reminder emails)
 * Vercel Cron: https://vercel.com/docs/cron-jobs
 */

import { NextRequest, NextResponse } from 'next/server';
import { endExpiredTrials } from '@/lib/trial-management';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Checking for expired trials...');

    const results = await endExpiredTrials();

    console.log(`✅ Expired trials processed:`, results);

    return NextResponse.json({
      success: true,
      message: 'Expired trials processed',
      ...results,
    });

  } catch (error) {
    console.error('❌ Error processing expired trials:', error);
    return NextResponse.json(
      { error: 'Failed to process expired trials', details: String(error) },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
