import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { invalidateUserCache } from '../../lib/userCache';
import { getAllFlags, isValidFlag } from '../../lib/flagConstants';

export async function POST(request: NextRequest) {
  try {
    console.log('[API] capture-flag route started');
    // Get user ID
    const userId = await getUserIdFromRequest(request);
    console.log('[API] User ID from request:', userId);
    
    if (!userId) {
      console.error('[API] Authentication error: No user ID found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { flagId, baseScore = 100 } = body;
    
    if (!flagId) {
      console.error('[API] No flag ID provided');
      return NextResponse.json(
        { error: 'No flag ID provided' },
        { status: 400 }
      );
    }
    
    console.log('[API] Attempting to capture flag:', flagId);
    
    // Check if this is a new format flag (flag_levelname) or the actual flag value
    let validFlag = false;
    let flagToStore = flagId;
    
    // If it starts with flag_, it's using the new client-side format
    if (flagId.startsWith('flag_')) {
      // Extract the level ID from the flag format
      const levelId = flagId.substring(5); // Remove 'flag_' prefix
      
      // Get the actual flag value for this level from the environment variables
      const allFlags = getAllFlags();
      
      // Find a flag that contains the level name
      for (const flag of allFlags) {
        // This is a simple mapping - in a real implementation you'd want a more robust mapping
        if (flag.toLowerCase().includes(levelId.toLowerCase())) {
          flagToStore = flag;
          validFlag = true;
          break;
        }
      }
      
      console.log(`[API] Mapped client flag ${flagId} to actual flag: ${flagToStore}`);
    } else {
      // It's the actual flag value, check if it's valid
      validFlag = isValidFlag(flagId);
      flagToStore = flagId;
    }
    
    if (!validFlag) {
      console.error('[API] Invalid flag:', flagId);
      return NextResponse.json(
        { error: 'Invalid flag' },
        { status: 400 }
      );
    }
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        flagsCaptured: true,
        score: true
      }
    });
    
    if (!user) {
      console.error('[API] User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Parse the flags array
    let flagsCaptured: string[] = [];
    try {
      flagsCaptured = JSON.parse(user.flagsCaptured as string || '[]');
      if (!Array.isArray(flagsCaptured)) {
        flagsCaptured = [];
      }
    } catch (error) {
      console.error('[API] Error parsing flags:', error);
      flagsCaptured = [];
    }
    
    // Check if flag is already captured
    if (flagsCaptured.includes(flagToStore)) {
      console.log('[API] Flag already captured:', flagToStore);
      return NextResponse.json({
        message: 'Flag already captured',
        score: user.score
      });
    }
    
    // Add the flag to the user's captured flags
    flagsCaptured.push(flagToStore);
    
    // Calculate new score
    const newScore = (user.score || 0) + baseScore;
    
    // Update the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        flagsCaptured: JSON.stringify(flagsCaptured),
        score: newScore
      }
    });
    
    // Invalidate user cache
    invalidateUserCache(userId);
    
    console.log('[API] Flag captured successfully:', flagToStore);
    console.log('[API] New score:', newScore);
    
    return NextResponse.json({
      message: 'Flag captured successfully',
      score: newScore
    });
  } catch (error) {
    console.error('[API] Error capturing flag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 