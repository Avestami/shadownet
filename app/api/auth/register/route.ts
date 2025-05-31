import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    
    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1 as test`;
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.', details: dbError.message },
        { status: 500 }
      );
    }
    
    // Check if username already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }
    } catch (findError: any) {
      console.error('Error checking existing user:', findError);
      // If the error indicates table doesn't exist, return a more specific error
      if (findError.message.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Database schema not initialized. Please contact the administrator.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error checking user existence', details: findError.message },
        { status: 500 }
      );
    }
    
    // Check if email is provided and already exists
    if (email) {
      try {
        const existingEmail = await prisma.user.findUnique({
          where: { email },
        });
        
        if (existingEmail) {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 400 }
          );
        }
      } catch (emailError: any) {
        console.error('Error checking existing email:', emailError);
        return NextResponse.json(
          { error: 'Error checking email existence', details: emailError.message },
          { status: 500 }
        );
      }
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          email: email || null,
          password: hashedPassword,
          score: 0,
          karma: {
            loyalty: 0,
            defiance: 0,
            mercy: 0,
            curiosity: 0,
            integration: 0
          },
          choices: [],
          flagsCaptured: [],
          currentLevel: "alpha"
        },
      });
      
      // Return success without exposing the password
      return NextResponse.json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      });
    } catch (createError: any) {
      console.error('Error creating user:', createError);
      return NextResponse.json(
        { error: 'Error creating user account', details: createError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
} 