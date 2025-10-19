import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db/prisma';

// Helper to validate API key
// Note: API key authentication not yet implemented - using user ID as placeholder
async function validateAPIKey(apiKey: string) {
  const user = await prisma.user.findFirst({
    where: { id: apiKey }, // Using ID as placeholder until apiKey field is added
  });

  if (!user) {
    return null;
  }

  return user;
}

// GET /api/v1/scan/[id] - Get scan details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required. Include it in the x-api-key header.' },
        { status: 401 }
      );
    }

    const user = await validateAPIKey(apiKey);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Fetch scan
    const scan = await prisma.scan.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (scan.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Format response
    const results = scan.results as Record<string, unknown>;

    return NextResponse.json({
      scan_id: scan.id,
      url: scan.url,
      status: scan.status,
      issues_found: results?.issuesFound || 0,
      violations: results?.violations || [],
      passes: results?.passes || 0,
      timestamp: scan.createdAt.toISOString(),
      report_url: `${process.env.NEXT_PUBLIC_APP_URL}/scan/${scan.id}`,
    });
  } catch (error) {
    console.error('API get scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
