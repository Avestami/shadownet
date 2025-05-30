import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getUserIdFromRequest } from '../../../lib/authUtils';
import { invalidateUserCache } from '../../../lib/userCache';

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
    const { levelId, choiceId, karmaType, karmaValue, score = 0 } = body;
    
    if (!levelId || !choiceId || !karmaType || karmaValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: levelId, choiceId, karmaType, karmaValue' },
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
    
    // Parse current karma object or create a new one
    let karmaObject;
    
    try {
      karmaObject = typeof user.karma === 'string' 
        ? JSON.parse(user.karma) 
        : (user.karma || { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 });
    } catch (error) {
      console.error('Error parsing karma:', error);
      karmaObject = { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 };
    }
    
    // Update the specific karma type
    if (!karmaObject[karmaType]) {
      karmaObject[karmaType] = 0;
    }
    
    karmaObject[karmaType] += karmaValue;
    
    // Save the karma choice in the KarmaChoice table
    await prisma.karmaChoice.create({
      data: {
        userId,
        levelId,
        karmaType,
        karmaValue,
        choiceText: choiceId
      }
    });
    
    // Update the user's karma and score
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        karma: karmaObject,
        score: (user.score || 0) + score
      }
    });
    
    // Invalidate the user cache to ensure fresh data
    invalidateUserCache(userId);
    
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
    
  } catch (error) {
    console.error('Error recording karma choice:', error);
    return NextResponse.json(
      { error: 'Failed to record karma choice', details: String(error) },
      { status: 500 }
    );
  }
} 