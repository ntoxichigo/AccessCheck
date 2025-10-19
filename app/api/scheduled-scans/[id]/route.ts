import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';

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

// PATCH /api/scheduled-scans/[id] - Update scheduled scan
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { enabled, frequency, alertOnNewIssues } = body;

    // Verify ownership
    const existingScan = await prisma.scheduledScan.findUnique({
      where: { id: params.id },
    });

    if (!existingScan) {
      return NextResponse.json({ error: 'Scheduled scan not found' }, { status: 404 });
    }

    if (existingScan.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update fields
    const updateData: {
      enabled?: boolean;
      frequency?: string;
      alertOnNewIssues?: boolean;
      nextRun?: Date;
    } = {};

    if (typeof enabled === 'boolean') updateData.enabled = enabled;
    if (frequency && ['daily', 'weekly', 'monthly'].includes(frequency)) {
      updateData.frequency = frequency;
      updateData.nextRun = calculateNextRun(frequency);
    }
    if (typeof alertOnNewIssues === 'boolean') updateData.alertOnNewIssues = alertOnNewIssues;

    const updatedScan = await prisma.scheduledScan.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedScan);
  } catch (error) {
    console.error('Update scheduled scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/scheduled-scans/[id] - Delete scheduled scan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingScan = await prisma.scheduledScan.findUnique({
      where: { id: params.id },
    });

    if (!existingScan) {
      return NextResponse.json({ error: 'Scheduled scan not found' }, { status: 404 });
    }

    if (existingScan.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete
    await prisma.scheduledScan.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete scheduled scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
