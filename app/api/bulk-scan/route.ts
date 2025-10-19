import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/db/prisma';
import { log } from '../../../lib/logger';
import { handleApiError } from '../../../lib/errors';
import { scanQueue } from '../../../lib/queue/scan-queue';

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { subscription: true },
    });

    // Check if user has Pro or Enterprise plan
    if (dbUser?.subscription !== 'pro' && dbUser?.subscription !== 'enterprise') {
      return NextResponse.json(
        { error: 'Bulk scanning requires Pro or Enterprise plan' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { urls, name } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
    }

    // Enforce limits based on plan
    const maxUrls = dbUser.subscription === 'enterprise' ? 500 : 50;
    if (urls.length > maxUrls) {
      return NextResponse.json(
        { error: `Maximum ${maxUrls} URLs allowed for your plan` },
        { status: 400 }
      );
    }

    // Validate URLs
    const validUrls: string[] = [];
    const invalidUrls: string[] = [];

    for (const url of urls) {
      if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
        validUrls.push(url.trim());
      } else {
        invalidUrls.push(url);
      }
    }

    if (validUrls.length === 0) {
      return NextResponse.json({ error: 'No valid URLs provided' }, { status: 400 });
    }

    // Create batch scan record
    const batchScan = await prisma.batchScan.create({
      data: {
        userId: user.id,
        name: name || `Batch scan ${new Date().toLocaleDateString()}`,
        totalUrls: validUrls.length,
        status: 'pending',
      },
    });

    // Create individual scan records
    const scanRecords = await Promise.all(
      validUrls.map(async (url) => {
        return await prisma.scan.create({
          data: {
            url,
            userId: user.id,
            status: 'pending',
            issuesFound: 0,
            results: {},
            batchId: batchScan.id,
          },
        });
      })
    );

    // Add scans to processing queue
    const jobs = scanRecords.map((scan) => ({
      scanId: scan.id,
      url: scan.url,
      userId: user.id,
      batchId: batchScan.id,
    }));

    await scanQueue.addBulkJobs(jobs);

    log.info('Batch scan created and queued', {
      userId: user.id,
      batchId: batchScan.id,
      totalUrls: validUrls.length,
    });

    return NextResponse.json({
      success: true,
      batchId: batchScan.id,
      totalUrls: validUrls.length,
      invalidUrls,
      message: `Batch scan created with ${validUrls.length} URLs. Processing started.`,
    });
  } catch (error) {
    log.error('Bulk scan creation error', {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return handleApiError(error);
  }
}

// Get batch scan status
export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');

    if (batchId) {
      // Get specific batch
      const batch = await prisma.batchScan.findUnique({
        where: { id: batchId },
        include: {
          scans: {
            select: {
              id: true,
              url: true,
              status: true,
              issuesFound: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!batch) {
        return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
      }

      if (batch.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      return NextResponse.json(batch);
    } else {
      // Get all user's batches
      const batches = await prisma.batchScan.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return NextResponse.json({ batches });
    }
  } catch (error) {
    log.error('Bulk scan fetch error', {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return handleApiError(error);
  }
}
