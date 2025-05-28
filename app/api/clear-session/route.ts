import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get the token to find the user ID
    const token = await getToken({ req: request });
    const userId = token?.id as string;
    
    if (userId) {
      // Clear database sessions
      await prisma.session.deleteMany({
        where: { userId: userId }
      });
      console.log('Cleared database sessions for user:', userId);
    }
    
    // Create response that clears the NextAuth cookies
    const response = NextResponse.json({ success: true, message: 'Session cleared' });
    
    // Clear NextAuth cookies
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
    });
    
    response.cookies.set('__Secure-next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      secure: true,
    });
    
    response.cookies.set('next-auth.csrf-token', '', {
      expires: new Date(0),
      path: '/',
    });
    
    response.cookies.set('__Host-next-auth.csrf-token', '', {
      expires: new Date(0),
      path: '/',
      secure: true,
    });
    
    return response;
    
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
} 