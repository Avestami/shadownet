import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getUserIdFromRequest } from '../../../lib/authUtils';
import { invalidateUserCache } from '../../../lib/userCache';

export async function POST(request: NextRequest) {
  try {
    console.log('[FORCE-UPDATE] API route started');
    // Get user ID
    const userId = await getUserIdFromRequest(request);
    console.log('[FORCE-UPDATE] User ID from request:', userId);
    
    if (!userId) {
      console.error('[FORCE-UPDATE] Authentication error: No user ID found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { 
      scoreChange = 0, 
      flagId = null, 
      karmaType = null, 
      karmaValue = 0,
      choiceId = null 
    } = body;
    
    console.log('[FORCE-UPDATE] Request:', { scoreChange, flagId, karmaType, karmaValue, choiceId });
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('[FORCE-UPDATE] User not found for ID:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('[FORCE-UPDATE] Current user state:', { 
      id: user.id, 
      score: user.score, 
      flagsCount: Array.isArray(user.flagsCaptured) ? user.flagsCaptured.length : 0,
      karma: user.karma,
      choicesType: typeof user.choices,
      choicesCount: Array.isArray(user.choices) ? user.choices.length : 
                  (typeof user.choices === 'string' ? JSON.parse(user.choices || '[]').length : 0)
    });
    
    // Debug choices handling
    console.log('[FORCE-UPDATE] Inspecting choices field type:', {
      type: typeof user.choices,
      isArray: Array.isArray(user.choices),
      value: user.choices,
      stringified: JSON.stringify(user.choices)
    });
    
    // Prepare update data
    const updateData: any = {};
    let updatedKarma = user.karma;
    
    // Update score if provided
    if (scoreChange !== 0) {
      updateData.score = (user.score || 0) + scoreChange;
      console.log('[FORCE-UPDATE] Updating score:', user.score, '+', scoreChange, '=', updateData.score);
    }
    
    // Add flag if provided
    if (flagId) {
      const currentFlags = user.flagsCaptured || [];
      if (!currentFlags.includes(flagId)) {
        updateData.flagsCaptured = [...currentFlags, flagId];
        console.log('[FORCE-UPDATE] Adding flag:', flagId);
      } else {
        console.log('[FORCE-UPDATE] Flag already captured:', flagId);
      }
    }
    
    // Update karma if provided
    if (karmaType && karmaValue !== 0) {
      // Parse current karma object
      let karmaObj;
      try {
        karmaObj = typeof user.karma === 'string' 
          ? JSON.parse(user.karma) 
          : (user.karma || { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 });
      } catch (error) {
        console.error('[FORCE-UPDATE] Error parsing karma:', error);
        karmaObj = { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 };
      }
      
      // Update the specific karma type
      if (!karmaObj[karmaType]) {
        karmaObj[karmaType] = 0;
      }
      
      karmaObj[karmaType] += karmaValue;
      console.log('[FORCE-UPDATE] Updating karma:', karmaType, '+', karmaValue, '=', karmaObj[karmaType]);
      
      // Save updated karma
      updateData.karma = karmaObj;
      updatedKarma = karmaObj;
    }
    
    // Record choice ID in user's choices array
    if (choiceId) {
      console.log('[FORCE-UPDATE] Processing choice:', choiceId);
      
      // Parse choices data
      let currentChoices: string[] = [];
      try {
        // Handle both string and array formats
        if (typeof user.choices === 'string') {
          currentChoices = JSON.parse(user.choices || '[]');
          console.log('[FORCE-UPDATE] Parsed choices from string:', currentChoices);
        } else if (Array.isArray(user.choices)) {
          // Ensure all elements are strings
          currentChoices = user.choices.map(item => String(item));
          console.log('[FORCE-UPDATE] Using existing array choices:', currentChoices);
        } else {
          console.log('[FORCE-UPDATE] Choices is neither string nor array, using empty array');
        }
      } catch (error) {
        console.error('[FORCE-UPDATE] Error parsing choices:', error);
        currentChoices = [];
      }
      
      if (!currentChoices.includes(choiceId)) {
        const updatedChoices = [...currentChoices, choiceId];
        console.log('[FORCE-UPDATE] Adding choice ID to user record:', choiceId);
        console.log('[FORCE-UPDATE] Updated choices array:', updatedChoices);
        updateData.choices = updatedChoices;
      } else {
        console.log('[FORCE-UPDATE] Choice already made:', choiceId);
        console.log('[FORCE-UPDATE] Existing choices array:', currentChoices);
      }
    }
    
    // Record karma choice if provided
    if (choiceId && karmaType && karmaValue) {
      try {
        await prisma.karmaChoice.create({
          data: {
            userId,
            levelId: flagId?.split('_')[1] || 'unknown',
            karmaType,
            karmaValue,
            choiceText: choiceId
          }
        });
        console.log('[FORCE-UPDATE] Karma choice recorded in database');
      } catch (error) {
        console.error('[FORCE-UPDATE] Error recording karma choice:', error);
      }
    }
    
    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      console.log('[FORCE-UPDATE] No changes to update');
      return NextResponse.json({
        success: false,
        message: 'No changes requested',
        user
      });
    }
    
    // Update user
    console.log('[FORCE-UPDATE] Updating user with data:', updateData);
    
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData
      });
      
      console.log('[FORCE-UPDATE] User updated successfully:', { 
        oldScore: user.score, 
        newScore: updatedUser.score,
        oldFlags: Array.isArray(user.flagsCaptured) ? user.flagsCaptured.length : 0,
        newFlags: Array.isArray(updatedUser.flagsCaptured) ? updatedUser.flagsCaptured.length : 0,
        oldChoicesCount: getChoicesCount(user.choices),
        newChoicesCount: getChoicesCount(updatedUser.choices)
      });
      
      // Function to safely get choices count
      function getChoicesCount(choices: any): number {
        if (Array.isArray(choices)) {
          return choices.length;
        } else if (typeof choices === 'string') {
          try {
            return JSON.parse(choices || '[]').length;
          } catch {
            return 0;
          }
        }
        return 0;
      }
      
      // Invalidate the user cache
      invalidateUserCache(userId);
      console.log('[FORCE-UPDATE] User cache invalidated');
      
      return NextResponse.json({
        success: true,
        message: 'User updated successfully',
        score: updatedUser.score,
        scoreChange,
        flagsCaptured: updatedUser.flagsCaptured,
        karma: updatedKarma,
        choices: updatedUser.choices,
        karmaUpdated: karmaType ? {
          type: karmaType,
          value: karmaValue
        } : null
      });
    } catch (updateError) {
      console.error('[FORCE-UPDATE] Database update error:', updateError);
      return NextResponse.json(
        { error: 'Database update failed', details: String(updateError) },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[FORCE-UPDATE] Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: String(error) },
      { status: 500 }
    );
  }
} 