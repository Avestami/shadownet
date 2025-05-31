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
  console.log('[SCOREBOARD] Normalizing karma object:', karma);
  
  const defaultKarma = {
    loyalty: 0,
    defiance: 0,
    mercy: 0,
    curiosity: 0,
    integration: 0
  };
  
  if (!karma) {
    console.log('[SCOREBOARD] No karma data, using defaults');
    return defaultKarma;
  }
  
  try {
    // Handle string format (JSON string)
    let karmaObj = karma;
    
    if (typeof karma === 'string') {
      console.log('[SCOREBOARD] Parsing karma from string');
      try {
        karmaObj = JSON.parse(karma);
      } catch (e) {
        console.error('[SCOREBOARD] Error parsing karma string:', e, karma);
        return defaultKarma;
      }
    }
    
    // Handle number format (legacy)
    if (typeof karmaObj === 'number') {
      console.log('[SCOREBOARD] Karma is a number value, using defaults');
      return defaultKarma;
    }
    
    // Handle object format
    if (typeof karmaObj === 'object' && karmaObj !== null) {
      console.log('[SCOREBOARD] Using karma object values');
      const result = {
        loyalty: Number(karmaObj.loyalty || 0),
        defiance: Number(karmaObj.defiance || 0),
        mercy: Number(karmaObj.mercy || 0),
        curiosity: Number(karmaObj.curiosity || 0),
        integration: Number(karmaObj.integration || 0)
      };
      console.log('[SCOREBOARD] Normalized karma:', result);
      return result;
    }
    
    console.log('[SCOREBOARD] Unhandled karma format, using defaults');
    return defaultKarma;
  } catch (error) {
    console.error('[SCOREBOARD] Error normalizing karma:', error, karma);
    return defaultKarma;
  }
}

// Calculate total karma from karma object
function calculateTotalKarma(karma: any) {
  console.log('[SCOREBOARD] Calculating total karma from:', karma);
  
  if (!karma) {
    console.log('[SCOREBOARD] No karma data, returning 0');
    return 0;
  }
  
  try {
    // Handle direct number format
    if (typeof karma === 'number') {
      console.log('[SCOREBOARD] Karma is already a number:', karma);
      return karma;
    }
    
    // Handle string format
    let karmaObj = karma;
    if (typeof karma === 'string') {
      console.log('[SCOREBOARD] Parsing karma string');
      try {
        karmaObj = JSON.parse(karma);
      } catch (e) {
        console.error('[SCOREBOARD] Failed to parse karma string:', e, karma);
        return 0;
      }
    }
    
    // Handle object format
    if (typeof karmaObj === 'object' && karmaObj !== null) {
      const values = [
        Number(karmaObj.loyalty || 0),
        Number(karmaObj.defiance || 0),
        Number(karmaObj.mercy || 0),
        Number(karmaObj.curiosity || 0),
        Number(karmaObj.integration || 0)
      ];
      
      const sum = values.reduce((acc, val) => acc + val, 0);
      const result = values.length > 0 ? Math.floor(sum / values.length) : 0;
      
      console.log('[SCOREBOARD] Calculated total karma:', {values, sum, result});
      return result;
    }
    
    console.log('[SCOREBOARD] Unhandled karma format, returning 0');
    return 0;
  } catch (error) {
    console.error('[SCOREBOARD] Error calculating total karma:', error, karma);
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
      console.log('[SCOREBOARD] Processing user:', user.username, 'karma type:', typeof user.karma);
      
      try {
        const normalizedKarma = normalizeKarmaObject(user.karma);
        const totalKarma = calculateTotalKarma(user.karma);
        
        console.log('[SCOREBOARD] User processed:', {
          username: user.username,
          totalKarma,
          normalizedKarma
        });
        
        return {
          username: user.username,
          score: user.score || 0,
          karma: normalizedKarma, // Return full karma object
          totalKarma // Add the calculated total
        };
      } catch (error) {
        console.error('[SCOREBOARD] Error processing user:', user.username, error);
        return {
<<<<<<< HEAD
          username: user.username,
          score: user.score || 0,
=======
      username: user.username,
      score: user.score || 0,
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
          karma: { 
            loyalty: 0, 
            defiance: 0, 
            mercy: 0, 
            curiosity: 0, 
            integration: 0 
          },
          totalKarma: 0
        };
      }
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