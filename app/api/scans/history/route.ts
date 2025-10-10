import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';

export async function GET() {
  try {
    const user = await currentUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const scans = await prisma.scan.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        url: true,
        createdAt: true,
        status: true,
        results: true
      }
    });

    // Transform the data to include issue count
    const formattedScans = scans.map((scan) => {
      let issueCount = 0;
      try {
        if (scan.results && typeof scan.results === 'string') {
          const parsed = JSON.parse(scan.results);
          issueCount = parsed.violations?.length || 0;
        } else if (scan.results && typeof scan.results === 'object') {
          issueCount = (scan.results as { violations?: unknown[] }).violations?.length || 0;
        }
      } catch {
        issueCount = 0;
      }
      
      return {
        id: scan.id,
        url: scan.url,
        createdAt: scan.createdAt,
        status: scan.status,
        issueCount
      };
    });

    return NextResponse.json({ 
      success: true, 
      scans: formattedScans 
    });

  } catch (error) {
    console.error('Error fetching scan history:', error);
    
    // Check if it's a database connection error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code?: string; message?: string };
      if (prismaError.code === 'P1001' || prismaError.message?.includes("Can't reach database")) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Database connection failed. Please check if your Supabase database is running.',
            details: 'Visit https://supabase.com/dashboard to check your database status.',
            scans: [] // Return empty array to prevent UI crashes
          },
          { status: 503 } // Service Unavailable
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch scan history',
        scans: [] // Return empty array to prevent UI crashes
      },
      { status: 500 }
    );
  }
}