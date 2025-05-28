import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

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
    });
    
    // Format user data
    const formattedUsers = users.map(user => ({
      username: user.username,
      score: user.score || 0,
              karma: user.karma || 0
    }));
    
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
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
} 