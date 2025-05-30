import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { invalidateUserCache } from '../../lib/userCache';

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
    const { flagId, baseScore = 100, allFlags = false, flagList = [] } = body;
    console.log('[API] Flag capture request:', { flagId, baseScore, allFlags });
    
    if (!flagId && !allFlags) {
      console.error('[API] Missing flagId or allFlags parameter');
      return NextResponse.json(
        { error: 'Missing flagId or allFlags parameter' },
        { status: 400 }
      );
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    console.log('[API] User found:', { 
      id: user?.id, 
      score: user?.score, 
      flagsCount: user?.flagsCaptured?.length 
    });
    
    if (!user) {
      console.error('[API] User not found for ID:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get karma as an object
    let karmaObj;
    try {
      karmaObj = typeof user.karma === 'string' 
        ? JSON.parse(user.karma) 
        : (user.karma || { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 });
      console.log('[API] Parsed karma object:', karmaObj);
    } catch (error) {
      console.error('[API] Error parsing karma:', error);
      karmaObj = { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 };
    }
    
    // Calculate average karma for multiplier
    const karmaValues = Object.values(karmaObj);
    const avgKarma = karmaValues.length > 0 
      ? karmaValues.reduce((sum, val) => sum + val, 0) / karmaValues.length 
      : 0;
    
    // Calculate score boost based on karma
    const karmaMultiplier = 1 + avgKarma / 100;
    console.log('[API] Karma multiplier:', karmaMultiplier);
    
    // Handle debug mode capturing all flags
    if (allFlags) {
      // Define all flags or use the provided list
      const ALL_FLAGS = flagList.length > 0 ? flagList : [
        'SHADOWNET{DTHEREFORTH}',
        'SHADOWNET{SOUND876}',
        'SHADOWNET{S3CR3T_D34TH}',
        'SHADOWNET{M3M0RY_DUMP_1337}',
        'SHADOWNET{P4CK3T_W1Z4RD}',
        'SHADOWNET{FIRMWARE_BACKDOOR_X23}',
        'SHADOWNET{VULN_HUNTER_PRO}',
        'SHADOWNET{CRYPTO_BREAKER_9000}',
        'SHADOWNET{FINAL_ASCENSION}'
      ];
      
      // Get current flags and add new ones
      const flagsCaptured = user.flagsCaptured || [];
      const newFlags = ALL_FLAGS.filter(flag => !flagsCaptured.includes(flag));
      console.log('[API] New flags to add:', newFlags);
      
      if (newFlags.length === 0) {
        console.log('[API] All flags already captured');
        return NextResponse.json({
          success: false,
          message: 'All flags already captured',
          score: user.score || 0,
          flagsCaptured,
          karma: karmaObj
        });
      }
      
      // Calculate total score to add
      const scoreToAdd = Math.round(newFlags.length * baseScore * karmaMultiplier);
      console.log('[API] Score to add:', scoreToAdd);
      
      // Update user with all flags
      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            flagsCaptured: [...flagsCaptured, ...newFlags],
            score: (user.score || 0) + scoreToAdd
          }
        });
        console.log('[API] Database update successful', { 
          oldScore: user.score, 
          newScore: updatedUser.score,
          addedFlags: newFlags.length
        });
        
        // Invalidate the user cache
        invalidateUserCache(userId);
        console.log('[API] User cache invalidated');
        
        return NextResponse.json({
          success: true,
          message: `${newFlags.length} flags captured successfully`,
          score: updatedUser.score,
          scoreAdded: scoreToAdd,
          flagsCaptured: updatedUser.flagsCaptured,
          karma: updatedUser.karma,
          karmaMultiplier: karmaMultiplier.toFixed(2),
          newFlags,
          karmaDetails: karmaObj
        });
      } catch (dbError) {
        console.error('[API] Database update error:', dbError);
        throw dbError;
      }
    }
    
    // Handle single flag capture (original logic)
    // Check if flag already captured
    const flagsCaptured = user.flagsCaptured || [];
    console.log('[API] Current flags captured:', flagsCaptured);
    console.log('[API] Flag to check:', flagId);
    
    if (flagsCaptured.includes(flagId)) {
      console.log('[API] Flag already captured:', flagId);
      return NextResponse.json({
        success: false,
        message: 'Flag already captured',
        score: user.score || 0,
        flagsCaptured,
        karma: karmaObj,
        karmaDetails: karmaObj
      });
    }
    
    // Calculate final score
    const scoreToAdd = Math.round(baseScore * karmaMultiplier);
    console.log('[API] Score to add for single flag:', scoreToAdd);
    
    // Update user
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          flagsCaptured: [...flagsCaptured, flagId],
          score: (user.score || 0) + scoreToAdd
        }
      });
      console.log('[API] User updated successfully', { 
        oldScore: user.score, 
        newScore: updatedUser.score,
        addedFlag: flagId
      });
      
      // Invalidate the user cache to ensure fresh data
      invalidateUserCache(userId);
      console.log('[API] User cache invalidated');
      
      return NextResponse.json({
        success: true,
        message: 'Flag captured successfully',
        score: updatedUser.score,
        scoreAdded: scoreToAdd,
        flagsCaptured: updatedUser.flagsCaptured,
        karma: updatedUser.karma,
        karmaMultiplier: karmaMultiplier.toFixed(2),
        karmaDetails: karmaObj
      });
    } catch (dbError) {
      console.error('[API] Database update error:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('[API] Error capturing flag:', error);
    return NextResponse.json(
      { error: 'Failed to capture flag', details: String(error) },
      { status: 500 }
    );
  }
} 
    
    // Update user
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          flagsCaptured: [...flagsCaptured, flagId],
          score: (user.score || 0) + scoreToAdd
        }
      });
      console.log('[API] User updated successfully', { 
        oldScore: user.score, 
        newScore: updatedUser.score,
        addedFlag: flagId
      });
      
      // Invalidate the user cache to ensure fresh data
      invalidateUserCache(userId);
      console.log('[API] User cache invalidated');
      
      return NextResponse.json({
        success: true,
        message: 'Flag captured successfully',
        score: updatedUser.score,
        scoreAdded: scoreToAdd,
        flagsCaptured: updatedUser.flagsCaptured,
        karma: updatedUser.karma,
        karmaMultiplier: karmaMultiplier.toFixed(2),
        karmaDetails: karmaObj
      });
    } catch (dbError) {
      console.error('[API] Database update error:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('[API] Error capturing flag:', error);
    return NextResponse.json(
      { error: 'Failed to capture flag', details: String(error) },
      { status: 500 }
    );
  }
} 