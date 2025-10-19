import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db/prisma';
import { scanWebsite } from '../../../../lib/scanner/axe-scanner';
import { validateApiKey } from '../../../../lib/auth/validate-api-key';
import type { Prisma } from '@prisma/client';

// POST /api/v1/scan - Create a new scan
export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required. Include it in the x-api-key header.' },
        { status: 401 }
      );
    }

    // Validate API key
    const user = await validateApiKey(apiKey);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired API key' },
        { status: 401 }
      );
    }

    // Check plan limits
    if (user.subscription === 'free') {
      return NextResponse.json(
        { error: 'API access requires Pro plan or higher' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { url, callback_url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
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

    // Check rate limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scansToday = await prisma.scan.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    const limit = user.subscription === 'pro' ? 10 : 100;

    if (scansToday >= limit) {
      return NextResponse.json(
        {
          error: 'Daily scan limit reached',
          limit,
          used: scansToday,
        },
        { status: 429 }
      );
    }

    // Perform scan
    const scanResults = await scanWebsite(url);

    // Save to database
    const scan = await prisma.scan.create({
      data: {
        url,
        userId: user.id,
        results: scanResults as unknown as Prisma.JsonObject,
        status: 'completed',
        issuesFound: (scanResults as { violations?: unknown[] })?.violations?.length || 0,
      },
    });

    // If callback URL provided, send webhook
    if (callback_url) {
      try {
        await fetch(callback_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AccessCheck-Signature': 'hmac-sha256', // TODO: Implement HMAC signature
          },
          body: JSON.stringify({
            scan_id: scan.id,
            url: scan.url,
            status: 'completed',
            issues_found: scanResults.issuesFound,
            timestamp: scan.createdAt.toISOString(),
          }),
        });
      } catch (error) {
        console.error('Webhook delivery failed:', error);
      }
    }

    // Return response
    return NextResponse.json(
      {
        scan_id: scan.id,
        url: scanResults.url,
        status: 'completed',
        issues_found: scanResults.issuesFound,
        violations: scanResults.violations,
        passes: scanResults.passes,
        timestamp: scan.createdAt.toISOString(),
        report_url: `${process.env.NEXT_PUBLIC_APP_URL}/scan/${scan.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/v1/scan - List user's scans
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required. Include it in the x-api-key header.' },
        { status: 401 }
      );
    }

    const user = await validateApiKey(apiKey);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired API key' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch scans
    const scans = await prisma.scan.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        url: true,
        status: true,
        createdAt: true,
        results: true,
        issuesFound: true,
      },
    });

    // Format response
    const formattedScans = scans.map((scan) => ({
      scan_id: scan.id,
      url: scan.url,
      status: scan.status,
      issues_found: scan.issuesFound || 0,
      timestamp: scan.createdAt.toISOString(),
      report_url: `${process.env.NEXT_PUBLIC_APP_URL}/scan/${scan.id}`,
    }));

    return NextResponse.json({
      scans: formattedScans,
      total: formattedScans.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('API list scans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
