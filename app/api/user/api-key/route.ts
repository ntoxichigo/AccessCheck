import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/db/prisma';
import { generateApiKey, hashApiKey } from '../../../../lib/auth/api-key';
import { canCreateApiKey, getUsageStats } from '../../../../lib/api/rateLimiter';

// GET /api/user/api-key - List user's API keys
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        key: true, // Masked version will be returned
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
        isActive: true,
      },
    });

    // Mask the API keys (show only last 8 characters)
    const maskedKeys = apiKeys.map((key) => ({
      ...key,
      key: `ak_live_${'*'.repeat(24)}${key.key.slice(-8)}`,
    }));

    // Get usage stats
    const usageStats = await getUsageStats(userId);

    return NextResponse.json({ 
      apiKeys: maskedKeys,
      usage: usageStats,
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user/api-key - Create new API key
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist in database, create them
    if (!user) {
      // Get user email from Clerk
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@temp.com`;

      user = await prisma.user.create({
        data: {
          id: userId,
          email: email,
          subscription: 'free',
        },
      });
    }

    // Check if user can create API keys based on their subscription
    const canCreate = await canCreateApiKey(userId);
    
    if (!canCreate.allowed) {
      if (canCreate.subscription === 'free' || canCreate.subscription === 'trial') {
        return NextResponse.json(
          { 
            error: 'API access requires Pro plan or higher',
            currentPlan: canCreate.subscription,
            upgradeUrl: '/pricing',
          },
          { status: 403 }
        );
      } else {
        return NextResponse.json(
          { 
            error: `API key limit reached. Your ${canCreate.subscription} plan allows ${canCreate.limit} API key(s). You currently have ${canCreate.currentCount} active key(s).`,
            currentCount: canCreate.currentCount,
            limit: canCreate.limit,
            upgradeUrl: '/pricing',
          },
          { status: 400 }
        );
      }
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      );
    }

    // Generate new API key
    const apiKey = generateApiKey();
    const hashedKey = hashApiKey(apiKey);

    // Store in database (store hashed version)
    const newKey = await prisma.apiKey.create({
      data: {
        userId,
        name: name.trim(),
        key: hashedKey,
        isActive: true,
      },
    });

    // Return the plain API key ONLY on creation (user must save it)
    return NextResponse.json(
      {
        apiKey,
        keyId: newKey.id,
        name: newKey.name,
        createdAt: newKey.createdAt,
        warning:
          'This is the only time you will see this API key. Please save it securely.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generate API key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/api-key - Revoke API key
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');

    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // Find and verify ownership
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    if (apiKey.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete by setting isActive to false
    await prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
