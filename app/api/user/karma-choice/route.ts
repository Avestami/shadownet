import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getUserIdFromRequest } from '../../../lib/authUtils';
import { invalidateUserCache } from '../../../lib/userCache';

export async function POST(request: NextRequest) {
  try {
    console.log('[API] karma-choice route started');
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
    const { levelId, choiceId, karmaType, karmaValue, score = 0 } = body;
    console.log('[API] Karma choice request:', { levelId, choiceId, karmaType, karmaValue, score });
    
    if (!levelId || !choiceId || !karmaType || karmaValue === undefined) {
      console.error('[API] Missing required fields:', { levelId, choiceId, karmaType, karmaValue });
      return NextResponse.json(
        { error: 'Missing required fields: levelId, choiceId, karmaType, karmaValue' },
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
      karmaType: typeof user?.karma 
    });
    
    if (!user) {
      console.error('[API] User not found for ID:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Parse current karma object or create a new one
    let karmaObject;
    
    try {
      karmaObject = typeof user.karma === 'string' 
        ? JSON.parse(user.karma) 
        : (user.karma || { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 });
      console.log('[API] Parsed karma object:', karmaObject);
    } catch (error) {
      console.error('[API] Error parsing karma:', error);
      karmaObject = { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 };
    }
    
    // Update the specific karma type
    if (!karmaObject[karmaType]) {
      karmaObject[karmaType] = 0;
    }
    
    karmaObject[karmaType] += karmaValue;
    console.log('[API] Updated karma object:', karmaObject);
    
    // Save the karma choice in the KarmaChoice table
    try {
      await prisma.karmaChoice.create({
        data: {
          userId,
          levelId,
          karmaType,
          karmaValue,
          choiceText: choiceId
        }
      });
      console.log('[API] Karma choice recorded in KarmaChoice table');
      
      // Update the user's karma and score
      console.log('[API] Current user score:', user.score);
      console.log('[API] Score to add:', score);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          karma: karmaObject,
          score: (user.score || 0) + score
        }
      });
      console.log('[API] User updated successfully', {
        oldScore: user.score,
        newScore: updatedUser.score,
        karmaType,
        newKarmaValue: karmaObject[karmaType]
      });
      
      // Invalidate the user cache to ensure fresh data
      invalidateUserCache(userId);
      console.log('[API] User cache invalidated');
      
      return NextResponse.json({
        success: true,
        message: 'Karma choice recorded',
        karma: updatedUser.karma,
        score: updatedUser.score,
        karmaUpdated: {
          type: karmaType,
          value: karmaValue
        }
      });
    } catch (dbError) {
      console.error('[API] Database update error:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('[API] Error recording karma choice:', error);
    return NextResponse.json(
      { error: 'Failed to record karma choice', details: String(error) },
      { status: 500 }
    );
  }
} 
      
      // Invalidate the user cache to ensure fresh data
      invalidateUserCache(userId);
      console.log('[API] User cache invalidated');
      
      return NextResponse.json({
        success: true,
        message: 'Karma choice recorded',
        karma: updatedUser.karma,
        score: updatedUser.score,
        karmaUpdated: {
          type: karmaType,
          value: karmaValue
        }
      });
    } catch (dbError) {
      console.error('[API] Database update error:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('[API] Error recording karma choice:', error);
    return NextResponse.json(
      { error: 'Failed to record karma choice', details: String(error) },
      { status: 500 }
    );
  }
} 