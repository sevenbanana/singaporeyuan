import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, sha256 } from '@/lib/auth';

// 只允许站内相对路径,防止开放重定向
function safePath(from: unknown): string {
  if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) {
    return from;
  }
  return '/';
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get('password');
  const from = safePath(formData.get('from'));

  const sitePassword = process.env.SITE_PASSWORD;

  if (sitePassword && password === sitePassword) {
    const response = NextResponse.redirect(new URL(from, request.url), 303);
    response.cookies.set(AUTH_COOKIE, await sha256(sitePassword), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 天内免重复输入
    });
    return response;
  }

  const url = new URL('/password', request.url);
  url.searchParams.set('error', '1');
  url.searchParams.set('from', from);
  return NextResponse.redirect(url, 303);
}
