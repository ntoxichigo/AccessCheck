import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/db/prisma';

// Calculate next run time based on frequency
function calculateNextRun(frequency: string): Date {
  const now = new Date();
  const nextRun = new Date(now);

  switch (frequency) {
    case 'daily':
      nextRun.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      nextRun.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      nextRun.setMonth(now.getMonth() + 1);
      break;
  }

  // Set to 9 AM
  nextRun.setHours(9, 0, 0, 0);

  return nextRun;
}

// GET /api/scheduled-scans - List user's scheduled scans
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scans = await prisma.scheduledScan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ scans });
  } catch (error) {
    console.error('Get scheduled scans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/scheduled-scans - Create new scheduled scan
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has Pro plan or higher
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.subscription === 'free') {
      return NextResponse.json(
        { error: 'Scheduled scans require Pro plan or higher' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url, frequency, alertOnNewIssues } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    // Check if user has reached scheduled scan limit (max 10 per user)
    const existingScans = await prisma.scheduledScan.count({
      where: { userId, enabled: true },
    });

    if (existingScans >= 10) {
      return NextResponse.json(
        { error: 'Maximum scheduled scan limit reached (10 scans per user)' },
        { status: 400 }
      );
    }

    // Calculate next run time
    const nextRun = calculateNextRun(frequency);

    // Create scheduled scan
    const scheduledScan = await prisma.scheduledScan.create({
      data: {
        url,
        frequency,
        alertOnNewIssues: alertOnNewIssues ?? true,
        enabled: true,
        userId,
        nextRun,
      },
    });

    return NextResponse.json(scheduledScan, { status: 201 });
  } catch (error) {
    console.error('Create scheduled scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
