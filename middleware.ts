import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Flag to bypass level locks - this should be disabled in production
const BYPASS_LEVEL_LOCKS = true;

export async function middleware(request: NextRequest) {
  // Get the pathname - Next.js automatically removes basePath from this in middleware
  const path = request.nextUrl.pathname;
  
  // Define public routes that don't need authentication
  const publicPaths = ['/auth/login', '/auth/register', '/auth/error'];
  
  // Check if it is a public path
  const isPublicPath = publicPaths.some(pp => path === pp || path.startsWith(pp + '/'));
  
  // Check if the path is an API route or Next.js internal path
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
    
    // Log for debugging in production
    if (process.env.NODE_ENV === 'production') {
      console.log(`Middleware: path=${path}, basePath=${request.nextUrl.basePath}, isPublic=${isPublicPath}, token=${!!token}`);
    }
    
    // If the user is logged in and trying to access a login page, redirect them to home
    if (token && isPublicPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    
    // If the user is not logged in and trying to access a protected route, redirect to login
    if (!token && !isPublicPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
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