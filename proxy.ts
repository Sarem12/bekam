// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserById } from './lib/service';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token")?.value;

  // 1. BYPASS FOR AUTH PAGES (Prevents Firefox Redirect Error)
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (sessionToken) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  // 2. AUTH GUARD
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. DATABASE VALIDATION
  const user = await getUserById(sessionToken);

  if (!user) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete("session_token"); // Kill the dead session
    return response;
  }

  // 4. ADMIN GUARD
  if (pathname.startsWith('/admin') && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 5. DATA RESERVING (Safe Header Injection)
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', user.role);
  response.headers.set('x-user-first-name', user.first);
  response.headers.set('x-user-last-name', user.last);

  return response;
}