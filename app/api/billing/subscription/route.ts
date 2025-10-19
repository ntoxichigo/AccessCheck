import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import { log } from '@/lib/logger';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { plan: 'free', isAuthenticated: false },
        { status: 200 }
      );
    }

    // Fetch user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        subscription: true,
      },
    });

    const plan = dbUser?.subscription || 'free';

    log.info('Subscription fetched', { 
      userId: user.id, 
      plan,
    });

    return NextResponse.json({
      plan,
      isAuthenticated: true,
    });
  } catch (error) {
    log.error('Subscription fetch error', { 
      error: error instanceof Error ? error : new Error(String(error)) 
    });
    
    return NextResponse.json(
      { plan: 'free', isAuthenticated: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
