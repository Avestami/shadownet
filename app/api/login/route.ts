import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '../../lib/cookieUtils';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get username from request body
    const body = await request.json();
    const { username } = body;
    
    // Validate username
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Create user if doesn't exist, or get existing user
    const user = await prisma.user.upsert({
      where: { username: username.trim() },
      update: {}, // No updates needed, just retrieving the user
      create: {
        username: username.trim(),
        password: '', // Empty password as it's not required for this login method
        score: 0,
        karma: 0,
        choices: JSON.stringify([]),
        flagsCaptured: []
      }
    });
    
    // Create session for the user
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    });
    
    // Set session cookie
    await setSessionCookie(user.id);
    
    // Return user data
    return NextResponse.json({ 
      userId: user.id,
      username: user.username,
      score: user.score,
      karma: user.karma,
      choices: JSON.parse(user.choices as string),
      flagsCaptured: user.flagsCaptured
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 