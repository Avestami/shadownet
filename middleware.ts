import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Flag to bypass level locks - this should be disabled in production
const BYPASS_LEVEL_LOCKS = true;

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  // Define public routes that don't need authentication
  const publicPaths = ['/auth/login', '/auth/register', '/auth/error'];
  const isPublicPath = publicPaths.includes(path);
  
  // Check if the path is already a public path or API route
  const isApiPath = path.includes('/api/');
  const isNextInternal = path.startsWith('/_next/') || 
                         path.includes('/favicon.ico') ||
                         path.startsWith('/public/');
  
  // If it's a Next.js internal path or API, let it through
  if (isNextInternal || isApiPath) {
    return NextResponse.next();
  }
  
  // Check for existing redirect cookie to prevent loops
  const redirectAttempt = request.cookies.get('redirect_attempt')?.value;
  const redirectCount = redirectAttempt ? parseInt(redirectAttempt, 10) : 0;
  
  // If we've redirected too many times, just proceed to prevent loops
  if (redirectCount > 2) {
    console.log('Too many redirects detected, allowing request to proceed');
    
    // Clear the redirect cookie to reset the counter for future requests
    const response = NextResponse.next();
    response.cookies.set('redirect_attempt', '0', {
      maxAge: 60,
      path: '/'
    });
    
    return response;
  }
  
  try {
    // Get the token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // If the user is logged in and trying to access a login page, redirect them to home
    if (token && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // If the user is not logged in and trying to access a protected route, redirect to login
    if (!token && !isPublicPath) {
      const url = new URL('/auth/login', request.url);
      
      // Don't add callbackUrl parameter to avoid potential redirect issues
      // url.searchParams.set('callbackUrl', path);
      
      // Set a cookie to track redirect attempts
      const response = NextResponse.redirect(url);
      response.cookies.set('redirect_attempt', String(redirectCount + 1), {
        maxAge: 60, // Short-lived cookie (60 seconds)
        path: '/'
      });
      
      return response;
    }
    
    // Allow access to ALL routes (including level pages)
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Apply this middleware to all pages except APIs and Next.js internals
    '/((?!api/|_next/static|_next/image|favicon.ico|public/).*)',
    '/levels/:path*',
  ],
}; 