import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow API routes through always
  if (pathname.startsWith('/api')) return NextResponse.next();

  // Allow preview mode with secret
  const preview = searchParams.get('preview');
  if (preview === 'heatherhickory2026') {
    const res = NextResponse.next();
    res.cookies.set('preview_mode', 'true', { maxAge: 60 * 60 * 24 }); // 24 hours
    return res;
  }

  // Allow if preview cookie is set
  const previewCookie = req.cookies.get('preview_mode');
  if (previewCookie?.value === 'true') return NextResponse.next();

  // Everyone else sees maintenance page
  if (pathname !== '/maintenance') {
    return NextResponse.rewrite(new URL('/maintenance', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.mp4).*)'],
};