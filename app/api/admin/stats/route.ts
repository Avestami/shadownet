import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Check for admin role
    if (!token || (token as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [userCount, levelCount, activeSessions] = await Promise.all([
      prisma.user.count(),
      prisma.level.count(),
      prisma.session.count({
        where: {
          expiresAt: {
            gt: new Date()
          }
        }
      })
    ]);

    return NextResponse.json({
      userCount,
      levelCount,
      activeSessions
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
