import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getUserIdFromRequest } from '../../lib/authUtils';
import { getToken } from 'next-auth/jwt';
import { getUserUpdates } from './updateStore';
import { getCachedUser, setCachedUser } from '../../lib/userCache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Force refresh if requested (used after score/karma updates)
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
    
    // Check for debug header
    const isDebug = request.headers.get('X-Debug-Mode') === 'true';
    
    // Try to get user ID from NextAuth session directly
    const token = await getToken({ req: request });
    let userId = token?.id as string | null;

    // If that didn't work, try the custom getUserIdFromRequest method
    if (!userId && !isDebug) {
      userId = await getUserIdFromRequest(request);
    }
    
    // Only log user API calls if not already cached
    const userCacheKey = userId || 'debug-user';
    if (forceRefresh || !getCachedUser(userCacheKey)) {
      console.log('User API called, userId:', userId);
    }
    
    if (!userId && !isDebug) {
      console.log('No userId found, not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // For debug mode, return dummy data
    if (isDebug) {
      // Check if there's a cache entry and it's still valid
      const cachedDebugUser = getCachedUser('debug-user');
      if (!forceRefresh && cachedDebugUser) {
        return NextResponse.json(cachedDebugUser);
      }
      
      console.log('Debug mode, returning dummy user data');
      const dummyUserId = 'debug-user';
      
      // Check localStorage data if available (in a real implementation, this would be read from a database)
      // We're simulating this by returning predefined values
      const dummyData = {
        id: dummyUserId,
        email: null,
        username: 'debug_user',
        password: 'debug_pass',
        karma: 0,
        score: 0,
        choices: '[]',
        flagsCaptured: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Cache the result
      setCachedUser('debug-user', dummyData);
      
      return NextResponse.json(dummyData);
    }
    
    // Check if there's a cache entry and it's still valid (skip if force refresh)
    const cachedUser = getCachedUser(userCacheKey);
    if (!forceRefresh && cachedUser) {
      return NextResponse.json(cachedUser);
    }
    
    // Ensure userId is defined for TypeScript
    if (!userId) {
      userId = 'unknown-user';
    }
    
    // Get user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.log('User not found for ID:', userId);
      
      // Clear any existing sessions for this non-existent user
      try {
        await prisma.session.deleteMany({
          where: { userId: userId }
        });
        console.log('Cleared sessions for non-existent user:', userId);
      } catch (error) {
        console.error('Error clearing sessions:', error);
      }
      
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('User found:', user.username);
    
    // Parse choices or default to empty array
    let choices = [];
    try {
      // Fix for empty or malformed choices
      if (user.choices && typeof user.choices === 'string' && user.choices.trim() !== '') {
        // Attempt to parse JSON
        choices = JSON.parse(user.choices);
        
        // Verify if choices is an array
        if (!Array.isArray(choices)) {
          console.log('Choices is not an array, resetting to empty array');
          choices = [];
          
          // Fix the database
          await prisma.user.update({
            where: { id: userId },
            data: { choices: '[]' }
          });
        }
      } else {
        // Fix empty choices in database
        console.log('Empty choices, updating database with empty array');
        await prisma.user.update({
          where: { id: userId },
          data: { choices: '[]' }
        });
      }
    } catch (error) {
      console.error('Error parsing user choices:', error);
      // Fix invalid choices in database
      await prisma.user.update({
        where: { id: userId },
        data: { choices: '[]' }
      });
    }
    
    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      karma: user.karma || 0,
      score: user.score || 0,
      choices: user.choices,
      flagsCaptured: user.flagsCaptured || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    // Cache the result
    setCachedUser(userCacheKey, userData);
    
    // Return user data
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
} 