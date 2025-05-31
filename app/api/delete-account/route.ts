import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all related data first (due to foreign key constraints)
    
    // Delete user sessions
    await prisma.session.deleteMany({
      where: { userId: userId }
    });

    // Delete user level unlocks
    await prisma.levelUnlock.deleteMany({
      where: { userId: userId }
    });

    // Delete user player choices
    await prisma.playerChoice.deleteMany({
      where: { userId: userId }
    });

    // Note: Add any other tables that reference the user as needed

    // Finally, delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    console.log(`User account deleted: ${user.username} (${userId})`);

    return NextResponse.json({ 
      success: true, 
      message: 'Account successfully deleted' 
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ 
      error: 'Failed to delete account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also handle POST requests for compatibility
export async function POST(request: NextRequest) {
  return DELETE(request);
} 