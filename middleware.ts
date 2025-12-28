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
  const isPublicPath = publicPaths.some(pp => path.startsWith(pp));
  
  // Check if the path is already a public path or API route
  const isApiPath = path.includes('/api/');
  const isNextInternal = path.startsWith('/_next/') || 
                         path.includes('/favicon.ico') ||
                         path.startsWith('/public/');
  
  // If it's a Next.js internal path or API, let it through immediately
  if (isNextInternal || isApiPath) {
    return NextResponse.next();
  }
  
  try {
    // Get the token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    const baseUrl = process.env.NODE_ENV === 'production' ? '/cts' : '';
    
    // If the user is logged in and trying to access a login page, redirect them to home
    if (token && isPublicPath) {
      // With basePath: '/cts', we should NOT include /cts in the URL string
      // because Next.js adds it automatically for relative paths
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // If the user is not logged in and trying to access a protected route, redirect to login
    if (!token && !isPublicPath) {
      // With basePath: '/cts', we should NOT include /cts in the URL string
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Allow access to the requested route
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