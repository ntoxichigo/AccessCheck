import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generatePDFReport } from '../../../lib/pdf/generatePDFReport';
import { prisma } from '../../../lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const scanId = searchParams.get('scanId');

    if (!scanId) {
      return NextResponse.json({ error: 'Scan ID is required' }, { status: 400 });
    }

    // Fetch scan from database
    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      include: { user: true },
    });

    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    // Check if user owns this scan
    if (scan.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if user has Pro plan or active trial
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // PDF export available for Pro and Trial users
    if (user.subscription !== 'pro' && user.subscription !== 'trial') {
      return NextResponse.json(
        { error: 'PDF export requires Pro plan or active trial' },
        { status: 403 }
      );
    }

    // Define ScanResults type
    interface ScanResults {
      violations?: Array<{
        id: string;
        impact: string;
        description: string;
        help: string;
        helpUrl: string;
        nodes: Array<{ html: string; target: string[] }>;
      }>;
      passes?: number;
      risk?: {
        standards: string[];
        fines: {
          usUSD: number;
          euEUR: { min: number; max: number };
          note?: string;
        };
      };
    }

    const results = scan.results as ScanResults;
    const scanResult = {
      url: scan.url,
      issuesFound: results.violations?.length || 0,
      violations: results.violations || [],
      passes: results.passes || 0,
      timestamp: scan.createdAt,
      risk: results.risk,
    };

    const pdfBuffer = await generatePDFReport(scanResult);

    // Return PDF as response
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="accessibility-report-${scan.url.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF report',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
