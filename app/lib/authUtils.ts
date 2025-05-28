import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../lib/prisma';
import { getToken } from 'next-auth/jwt';

// Get the user ID from the session cookie in the request
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    // Try to get the user ID from NextAuth token first
    const token = await getToken({ req: request });
    if (token && token.id) {
      return token.id as string;
    }
    
    // Fallback to legacy session cookie if NextAuth token not found
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
    if (!sessionId) {
      return null;
    }
    
    // Get the session from the database
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });
    
    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    
    return session.userId;
  } catch (error) {
    console.error('Error getting user ID from request:', error);
    return null;
  }
} 