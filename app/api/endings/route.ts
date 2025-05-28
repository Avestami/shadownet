import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { endings } from '../../../data/story';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Parse user choices
    const userChoices = JSON.parse(user.choices as string) as string[];
    
    // Determine the appropriate ending
    let bestEnding = null;
    
    // Check for the sacrifice ending first (it's special)
    const sacrificeEnding = endings.find(e => e.id === 'sacrifice');
    if (sacrificeEnding && sacrificeEnding.requiredChoice && userChoices.includes(sacrificeEnding.requiredChoice)) {
      bestEnding = sacrificeEnding;
    } else {
      // Check other endings based on karma
      const karmaEndings = endings.filter(e => e.id !== 'sacrifice');
      
      if (user.karma < 30) {
        // Find ending with maxKarma condition
        bestEnding = karmaEndings.find(e => e.maxKarma && e.maxKarma >= user.karma);
      } else {
        // Find the highest minKarma ending that the user qualifies for
        const qualifiedEndings = karmaEndings.filter(e => e.minKarma && e.minKarma <= user.karma);
        if (qualifiedEndings.length > 0) {
          bestEnding = qualifiedEndings.reduce((highest, current) => {
            return (current.minKarma || 0) > (highest.minKarma || 0) ? current : highest;
          }, qualifiedEndings[0]);
        }
      }
    }
    
    // If no ending matches, use the neutral ending as default
    if (!bestEnding) {
      bestEnding = endings.find(e => e.id === 'neutral') || endings[0];
    }
    
    // Calculate final score with karma multiplier
    const karmaMultiplier = 1 + (user.karma / 200);
    const finalScore = Math.round(user.score * karmaMultiplier);
    
    // Return ending data
    return NextResponse.json({
      ending: bestEnding,
      karma: user.karma,
      rawScore: user.score,
      karmaMultiplier: karmaMultiplier,
      finalScore: finalScore
    });
    
  } catch (error) {
    console.error('Error getting ending:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 