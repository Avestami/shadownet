import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { getToken } from 'next-auth/jwt';
import { getUserUpdates } from './updateStore';
import { getCachedUser, setCachedUser } from '../../lib/userCache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = token.id as string;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      karma: user.karma || { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 },
      score: user.score || 0,
      choices: user.choices || [],
      flagsCaptured: user.flagsCaptured || [],
      currentLevel: user.currentLevel || "alpha",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 