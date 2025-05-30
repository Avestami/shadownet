import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../lib/prisma';
import { getToken } from 'next-auth/jwt';

// Get the user ID from the session cookie in the request
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const token = await getToken({ req: request });
    return token?.id as string || null;
  } catch (error) {
    console.error('Error getting user ID from request:', error);
    return null;
  }
} 