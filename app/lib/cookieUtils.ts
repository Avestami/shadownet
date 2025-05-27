import { cookies } from 'next/headers';
import { getSession } from './userService';

// Cookie name for user session
const SESSION_COOKIE_NAME = 'session_id';

// Set user session cookie
export async function setSessionCookie(userId: string): Promise<void> {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    // Expires in 7 days
    maxAge: 7 * 24 * 60 * 60
  });
}

// Get user ID from session cookie
export const getSessionCookie = async (): Promise<string | undefined> => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value;
};

// Remove session cookie
export async function clearSessionCookie(): Promise<void> {
  cookies().delete(SESSION_COOKIE_NAME);
}

// Validate user session from cookie
export const validateSession = async (): Promise<{ 
  isValid: boolean; 
  userId?: string;
  username?: string;
}> => {
  const userId = await getSessionCookie();
  
  if (!userId) {
    return { isValid: false };
  }
  
  const session = getSession(userId);
  
  if (!session) {
    return { isValid: false };
  }
  
  // Check if session is not too old (e.g., 7 days)
  const sessionAge = Date.now() - session.lastActive;
  const maxSessionAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  if (sessionAge > maxSessionAge) {
    await clearSessionCookie();
    return { isValid: false };
  }
  
  return { 
    isValid: true, 
    userId: session.userId,
    username: session.username
  };
}; 