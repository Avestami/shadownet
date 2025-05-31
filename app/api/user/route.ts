import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { getToken } from 'next-auth/jwt';
import { getUserUpdates } from './updateStore';
import { getCachedUser, setCachedUser, invalidateUserCache } from '../../lib/userCache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[USER-API] GET request received');
    
    // Check if this is a refresh request
    const searchParams = request.nextUrl.searchParams;
    const isRefresh = searchParams.get('refresh') === 'true';
    
    if (isRefresh) {
      console.log('[USER-API] Refresh request detected');
    }
    
    // Check authentication cookies
    const authCookies = {};
    request.cookies.getAll().forEach(cookie => {
      if (cookie.name.includes('next-auth')) {
        authCookies[cookie.name] = cookie.value ? 'Present' : 'Empty';
      }
    });
    console.log('[USER-API] Auth cookies present:', authCookies);
    
    // Get the user ID from the token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      console.error('[USER-API] No token found in request');
      
      // Redirect to login instead of returning 401
      console.log('[USER-API] Redirecting to login page');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const userId = token.id as string;
    
    if (!userId) {
      console.error('[USER-API] No user ID found in token');
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    console.log('[USER-API] User ID from token:', userId);
    
    // If refresh is requested, invalidate the cache
    if (isRefresh) {
      invalidateUserCache(userId);
      console.log('[USER-API] User cache invalidated for refresh');
    }

    // Try to get cached user first
    const cachedUser = getCachedUser(userId);
    if (cachedUser && !isRefresh) {
      console.log('[USER-API] Using cached user data');
      return NextResponse.json({
        user: {
          id: cachedUser.id,
          email: cachedUser.email,
          username: cachedUser.username,
          karma: cachedUser.karma || { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 },
          score: cachedUser.score || 0,
          choices: cachedUser.choices || [],
          flagsCaptured: cachedUser.flagsCaptured || [],
          currentLevel: cachedUser.currentLevel || "alpha",
          createdAt: cachedUser.createdAt,
          updatedAt: cachedUser.updatedAt
        }
      });
    }

    // Get user data from the database
    console.log('[USER-API] Fetching user data from database for ID:', userId);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('[USER-API] User not found in database:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('[USER-API] User found:', { 
      id: user.id, 
      username: user.username,
      score: user.score, 
      flagsCount: user.flagsCaptured?.length,
      karmaType: typeof user.karma
    });

    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      karma: user.karma || { loyalty: 0, defiance: 0, mercy: 0, curiosity: 0, integration: 0 },
      score: user.score || 0,
      choices: user.choices || [],
      flagsCaptured: user.flagsCaptured || [],
      currentLevel: user.currentLevel || "alpha",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    // Cache the user data
    setCachedUser(userId, user);
    
    // Return the user data in the expected format for the UserProvider
    return NextResponse.json({
      user: userData
    });
    
  } catch (error) {
    console.error('[USER-API] Error getting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
} 