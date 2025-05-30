import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { invalidateUserCache } from '../../lib/userCache';

export async function POST(request: NextRequest) {
  try {
    // Get user ID
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { flagId, baseScore = 100 } = body;
    
    if (!flagId) {
      return NextResponse.json(
        { error: 'Missing flagId' },
        { status: 400 }
      );
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if flag already captured
    const flagsCaptured = user.flagsCaptured || [];
    if (flagsCaptured.includes(flagId)) {
      return NextResponse.json({
        success: false,
        message: 'Flag already captured',
        score: user.score || 0,
        flagsCaptured
      });
    }
    
    // Calculate score boost based on user's karma
    // Higher karma = higher score multiplier (incentive for ethical choices)
    const karma = user.karma || 0;
    const karmaMultiplier = 1 + karma / 100; // 0 karma = 1x, 100 karma = 2x, -50 karma = 0.5x
    
    // Calculate final score
    const scoreToAdd = Math.round(baseScore * karmaMultiplier);
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        flagsCaptured: [...flagsCaptured, flagId],
        score: (user.score || 0) + scoreToAdd
      }
    });
    
    // Invalidate the user cache to ensure fresh data
    invalidateUserCache(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Flag captured successfully',
      score: updatedUser.score,
      scoreAdded: scoreToAdd,
      flagsCaptured: updatedUser.flagsCaptured,
      karma: updatedUser.karma
    });
    
  } catch (error) {
    console.error('Error capturing flag:', error);
    return NextResponse.json(
      { error: 'Failed to capture flag', details: String(error) },
      { status: 500 }
    );
  }
} 