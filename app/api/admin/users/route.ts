import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db/prisma';
import { AppError, handleApiError } from '../../../../lib/errors';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        subscription: true,
        isAdmin: true,
        scans: {
          select: { id: true }
        }
      }
    });
    const usersWithScanCount = users.map(u => ({
      ...u,
      scanCount: u.scans?.length || 0
    }));
    return NextResponse.json({ users: usersWithScanCount });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json();
    if (!id || !action) throw new AppError('Missing user id or action', 400);
    let user;
    if (action === 'promote') {
      user = await prisma.user.update({ where: { id }, data: { isAdmin: true } });
    } else if (action === 'demote') {
      user = await prisma.user.update({ where: { id }, data: { isAdmin: false } });
    } else if (action === 'limitScans') {
      user = await prisma.user.update({ where: { id }, data: { subscription: 'limited' } });
    } else if (action === 'upgrade') {
      user = await prisma.user.update({ where: { id }, data: { subscription: 'pro' } });
    } else {
      throw new AppError('Unknown action', 400);
    }
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
