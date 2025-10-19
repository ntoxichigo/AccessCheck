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

    // Get scans from the last 24 hours, limit to 10 most recent
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const scans = await prisma.scan.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: oneDayAgo // Only scans from the last 24 hours
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10, // Limit to 10 most recent scans
      select: {
        id: true,
        url: true,
        createdAt: true,
        status: true,
        issuesFound: true // Use the stored issue count instead of parsing results
      }
    });

    // Return scan data with issue count from database
    const formattedScans = scans.map((scan) => ({
      id: scan.id,
      url: scan.url,
      createdAt: scan.createdAt,
      status: scan.status,
      issueCount: scan.issuesFound
    }));

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