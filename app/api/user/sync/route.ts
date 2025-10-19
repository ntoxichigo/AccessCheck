import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: existingUser,
        alreadyExists: true 
      });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: userEmail,
        subscription: 'free',
        hadTrial: false,
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: newUser,
      created: true 
    });
  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
