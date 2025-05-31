import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { invalidateUserCache } from '../../lib/userCache';
import { decisions } from '../../../data/story';

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
    const { decisionId, choiceId } = body;
    
    if (!decisionId || !choiceId) {
      return NextResponse.json(
        { error: 'Decision ID and choice ID are required' },
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
    
    // Parse choices or default to empty array
    let choices = [];
    try {
      if (user.choices) {
        if (typeof user.choices === 'string') {
          choices = JSON.parse(user.choices);
        } else if (Array.isArray(user.choices)) {
          choices = user.choices;
        }
        if (!Array.isArray(choices)) {
          choices = [];
        }
      }
    } catch (error) {
      console.error('Error parsing user choices:', error);
      choices = [];
    }
    
    // Find the decision and choice to calculate karma change
    let karmaDelta = 0;
    
    if (decisionId === 'initial') {
      // Initial choices are in a separate structure
      const initialChoices = require('../../../data/story').initialChoices;
      const choice = initialChoices.find((c: any) => c.id === choiceId);
      if (choice) {
        karmaDelta = choice.karmaDelta;
      }
    } else {
      // Regular decision choices
      const decision = decisions.find(d => d.id === decisionId);
      if (decision) {
        const choice = decision.options.find(o => o.id === choiceId);
        if (choice) {
          karmaDelta = choice.karmaDelta;
        }
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        choices: JSON.stringify([...choices, choiceId]),
        karma: (user.karma || 0) + karmaDelta
      }
    });
    
    // Invalidate the user cache to ensure fresh data
    invalidateUserCache(userId);
    
    // Parse the updated choices again
    let updatedChoices = [];
    try {
      if (updatedUser.choices) {
        if (typeof updatedUser.choices === 'string') {
          updatedChoices = JSON.parse(updatedUser.choices);
        } else if (Array.isArray(updatedUser.choices)) {
          updatedChoices = updatedUser.choices;
        }
      }
    } catch (error) {
      console.error('Error parsing updated user choices:', error);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Choice saved successfully',
      choiceId,
      karmaDelta,
      karma: updatedUser.karma,
      choices: updatedChoices
    });
    
  } catch (error) {
    console.error('Error saving choice:', error);
    return NextResponse.json(
      { error: 'Failed to save choice', details: String(error) },
      { status: 500 }
    );
  }
} 