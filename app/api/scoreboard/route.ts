import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple caching mechanism to reduce database calls
const scoreboardCache: {
  data: any;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

// Cache timeout (5 seconds)
const CACHE_TIMEOUT = 5000;

// Get normalized karma object
function normalizeKarmaObject(karma: any) {
  const defaultKarma = {
    loyalty: 0,
    defiance: 0,
    mercy: 0,
    curiosity: 0,
    integration: 0
  };
  
  if (!karma) return defaultKarma;
  
  try {
    const karmaObj = typeof karma === 'string' ? JSON.parse(karma) : karma;
    
    return {
      loyalty: karmaObj.loyalty || 0,
      defiance: karmaObj.defiance || 0,
      mercy: karmaObj.mercy || 0,
      curiosity: karmaObj.curiosity || 0,
      integration: karmaObj.integration || 0
    };
  } catch (error) {
    console.error('Error normalizing karma:', error);
    return defaultKarma;
  }
}

// Calculate total karma from karma object
function calculateTotalKarma(karma: any) {
  if (!karma) return 0;
  try {
    const karmaObj = typeof karma === 'string' ? JSON.parse(karma) : karma;
    return Math.round(
      (karmaObj.loyalty + karmaObj.defiance + karmaObj.mercy + karmaObj.curiosity + karmaObj.integration) / 5
    );
  } catch (error) {
    console.error('Error calculating karma:', error);
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if there's a cache entry and it's still valid
    if (scoreboardCache.data && Date.now() - scoreboardCache.timestamp < CACHE_TIMEOUT) {
      return NextResponse.json(scoreboardCache.data);
    }
    
    // Get all users from the database (limit to top 20)
    const users = await prisma.user.findMany({
      select: {
        username: true,
        score: true,
        karma: true
      },
      orderBy: {
        score: 'desc'
      },
      take: 20
    }).catch(error => {
      console.error('Database connection error:', error);
      // Return empty array if database is not available
      return [];
    });
    
    // Format user data with detailed karma
    const formattedUsers = users.map(user => {
      const normalizedKarma = normalizeKarmaObject(user.karma);
      return {
        username: user.username,
        score: user.score || 0,
        karma: normalizedKarma, // Return full karma object
      };
    });
    
    // Prepare response
    const response = {
      users: formattedUsers,
      timestamp: new Date().toISOString()
    };
    
    // Cache the result
    scoreboardCache.data = response;
    scoreboardCache.timestamp = Date.now();
    
    // Return scoreboard data
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error getting scoreboard data:', error);
    // Return empty scoreboard instead of error during static generation
    return NextResponse.json({
      users: [],
      timestamp: new Date().toISOString()
    });
  }
} 