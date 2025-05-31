import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../lib/prisma';
import { getToken } from 'next-auth/jwt';

// Get the user ID from the session cookie in the request
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    console.log('[AUTH] Attempting to get user ID from request');
    
    // Try to get token from NextAuth
    const token = await getToken({ req: request });
    console.log('[AUTH] Token retrieved:', token ? 'Found' : 'Not found');
    
    if (token?.id) {
      console.log('[AUTH] User ID from token:', token.id);
      return token.id as string;
    }
    
    // If no token, check headers for a debug session ID
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const sessionId = authHeader.substring(7);
      console.log('[AUTH] Found Authorization header with session ID:', sessionId);
      
      // Try to get user from session
      try {
        const session = await prisma.session.findUnique({
          where: { id: sessionId },
          include: { user: true }
        });
        
        if (session?.user?.id) {
          console.log('[AUTH] User ID from session:', session.user.id);
          return session.user.id;
        }
      } catch (sessionError) {
        console.error('[AUTH] Error getting session:', sessionError);
      }
    }
    
    // Check for debug mode in cookies
    const debugMode = request.cookies.get('debug_mode')?.value;
    if (debugMode === 'true') {
      console.log('[AUTH] Debug mode enabled, using debug user ID');
      return 'debug-user-id';
    }
    
    console.log('[AUTH] No user ID found in request');
    return null;
  } catch (error) {
    console.error('[AUTH] Error getting user ID from request:', error);
    return null;
  }
} 