import { NextRequest, NextResponse } from 'next/server';
import { getScore, updateScore } from '../../lib/userService';
import { validateSession } from '../../lib/cookieUtils';

// GET endpoint to retrieve user's score
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
    
    // Get score from query parameter if provided, otherwise use session userId
    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get('userId');
    const userIdToUse = queryUserId || userId;
    
    // Get user's score
    const score = getScore(userIdToUse);
    
    return NextResponse.json({ score });
  } catch (error) {
    console.error('Get score error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to update user's score
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
    
    // Get deltaScore from request body
    const body = await request.json();
    const { deltaScore } = body;
    
    if (deltaScore === undefined || typeof deltaScore !== 'number') {
      return NextResponse.json(
        { error: 'Delta score is required and must be a number' },
        { status: 400 }
      );
    }
    
    // Update user's score
    const newScore = updateScore(userId, deltaScore);
    
    return NextResponse.json({ score: newScore });
  } catch (error) {
    console.error('Update score error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 