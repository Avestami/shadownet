import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      // Even if no token, we can still "logout" by clearing client-side data
      return NextResponse.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    }

    try {
      // Verify the token and get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
      const userId = decoded.userId;

      if (userId) {
        // Delete all sessions for this user (optional - for enhanced security)
        await prisma.session.deleteMany({
          where: { userId: userId }
        });

        console.log(`User logged out: ${userId}`);
      }
    } catch (tokenError) {
      // Token might be invalid or expired, but we can still logout
      console.log('Token verification failed during logout:', tokenError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });

  } catch (error) {
    console.error('Error during logout:', error);
    
    // Even if there's an error, we should still allow logout
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully',
      note: 'Session cleanup may have failed but logout completed'
    });
  }
} 