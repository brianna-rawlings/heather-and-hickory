import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === 'GolfRocks') {
    const res = NextResponse.json({ success: true });
    res.cookies.set('site_password', 'GolfRocks', { maxAge: 60 * 60 * 24 }); // 24 hours
    return res;
  }
  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
}