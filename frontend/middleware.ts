import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-storage')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/profile') ||
                          request.nextUrl.pathname.startsWith('/interests');

  // Check if user is authenticated
  let isAuthenticated = false;
  if (authCookie) {
    try {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      isAuthenticated = !!(authData.token && authData.user);
    } catch (error) {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/interests/:path*', '/messages/:path*', '/login', '/register'],
};
