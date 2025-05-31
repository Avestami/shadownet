import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { invalidateUserCache } from '../../lib/userCache';

// Map of level IDs to the next level
const LEVEL_SEQUENCE = {
  'alpha': 'beta',
  'beta': 'gamma',
  'gamma': 'delta',
  'delta': 'sigma',
  'sigma': 'theta',
  'theta': 'zeta',
  'zeta': 'sigma-2',
  'sigma-2': 'omega',
  'omega': 'endings'
};

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
    const { currentLevel } = body;
    
    if (!currentLevel) {
      return NextResponse.json(
        { error: 'Missing currentLevel parameter' },
        { status: 400 }
      );
    }
    
    // Determine next level
    const nextLevel = LEVEL_SEQUENCE[currentLevel as keyof typeof LEVEL_SEQUENCE];
    
    if (!nextLevel) {
      return NextResponse.json(
        { error: 'No next level available' },
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
    
    // Update user's current level
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentLevel: nextLevel
      }
    });
    
    // Create a level unlock record if it doesn't exist
    const existingUnlock = await prisma.levelUnlock.findFirst({
      where: {
        userId: userId,
        levelId: nextLevel
      }
    });
    
    if (!existingUnlock) {
      await prisma.levelUnlock.create({
        data: {
          userId: userId,
          levelId: nextLevel
        }
      });
    }
    
    // Invalidate the user cache
    invalidateUserCache(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Level progression successful',
      nextLevel: nextLevel,
      currentUser: updatedUser
    });
    
  } catch (error) {
    console.error('Error progressing to next level:', error);
    return NextResponse.json(
      { error: 'Failed to progress to next level', details: String(error) },
      { status: 500 }
    );
  }
} 