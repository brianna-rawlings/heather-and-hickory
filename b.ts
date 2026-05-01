import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow API routes through always
  if (pathname.startsWith('/api')) return NextResponse.next();
  if (pathname.startsWith('/.well-known')) return NextResponse.next();

  // Allow if password cookie is set
  const passwordCookie = req.cookies.get('site_password');
  if (passwordCookie?.value === 'GolfRocks') return NextResponse.next();

  // Allow password entry page
  if (pathname === '/password') return NextResponse.next();

  // Everyone else goes to password page
  return NextResponse.redirect(new URL('/password', req.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.mp4|.*\\.svg|.*\\.mov).*)'],
};