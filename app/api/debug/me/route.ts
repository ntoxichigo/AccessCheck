import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    return NextResponse.json({
      clerkUserId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress,
      primaryEmail: user.primaryEmailAddress?.emailAddress,
      allEmails: user.emailAddresses?.map(e => e.emailAddress),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
