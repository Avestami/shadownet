import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { invalidateUserCache } from '../../lib/userCache';

const prisma = new PrismaClient();

// List of all level IDs in the game
const ALL_LEVEL_IDS = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'sigma',
  'theta',
  'zeta',
  'sigma-2',
  'omega'
];

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        unlockedLevels: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create level unlock records for all levels
    const existingLevelIds = user.unlockedLevels.map(unlock => unlock.levelId);
    const missingLevelIds = ALL_LEVEL_IDS.filter(id => !existingLevelIds.includes(id));
    
    if (missingLevelIds.length > 0) {
      // Create missing level unlocks
      await prisma.levelUnlock.createMany({
        data: missingLevelIds.map(levelId => ({
          userId,
          levelId
        })),
        skipDuplicates: true
      });
      
      // Update user's current level to the highest level
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentLevel: ALL_LEVEL_IDS[ALL_LEVEL_IDS.length - 1]
        }
      });
      
      // Invalidate user cache
      invalidateUserCache(userId);
    }
    
    return NextResponse.json({
      success: true,
      message: 'All levels unlocked successfully',
      unlockedLevels: ALL_LEVEL_IDS
    });
    
  } catch (error) {
    console.error('Error bypassing level locks:', error);
    return NextResponse.json(
      { error: 'Failed to unlock levels', details: String(error) },
      { status: 500 }
    );
  }
} 