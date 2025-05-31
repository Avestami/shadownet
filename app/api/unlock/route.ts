import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../lib/cookieUtils';
import { 
  unlockLevel, 
  updateScore, 
  getUser
} from '../../lib/userService';
import { 
  verifyUnlockCode, 
  getNextLevelId, 
  getLevelScoreReward 
} from '../../lib/levelService';

// POST endpoint to unlock a level using a code
export async function POST(request: NextRequest) {
  try {
    // Validate session
    const { isValid, userId } = await validateSession();
    
    if (!isValid || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get level ID and unlock code from request body
    const body = await request.json();
    const { levelId, unlockCode } = body;
    
    if (!levelId || !unlockCode) {
      return NextResponse.json(
        { error: 'Level ID and unlock code are required' },
        { status: 400 }
      );
    }
    
    // Verify the unlock code for the specified level
    const isCodeValid = verifyUnlockCode(levelId, unlockCode);
    
    if (!isCodeValid) {
      return NextResponse.json(
        { error: 'Invalid unlock code' },
        { status: 400 }
      );
    }
    
    // Get next level ID
    const nextLevelId = getNextLevelId(levelId);
    
    if (!nextLevelId) {
      return NextResponse.json(
        { error: 'No next level available' },
        { status: 400 }
      );
    }
    
    // Unlock the next level for the user
    const unlockedLevels = unlockLevel(userId, nextLevelId);
    
    // Award score for completing the level
    const scoreReward = getLevelScoreReward(levelId);
    const newScore = updateScore(userId, scoreReward);
    
    // Get updated user data
    const user = getUser(userId);
    
    return NextResponse.json({
      success: true,
      nextLevelId,
      unlockedLevels,
      score: newScore,
      user
    });
  } catch (error) {
    console.error('Unlock level error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to get unlocked levels for the current user
export async function GET(request: NextRequest) {
  try {
    // Validate session
    const { isValid, userId } = await validateSession();
    
    if (!isValid || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user data
    const user = getUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      unlockedLevels: user.unlockedLevels
    });
  } catch (error) {
    console.error('Get unlocked levels error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 