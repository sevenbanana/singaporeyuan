import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'site_unlock';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 天内免重复输入

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  const fromRaw = String(form.get('from') ?? '/');
  // 只允许跳回站内路径,防止开放重定向
  const from = fromRaw.startsWith('/') && !fromRaw.startsWith('//') ? fromRaw : '/';

  const expected = process.env.SITE_PASSWORD;

  if (!expected || password !== expected) {
    const url = new URL('/unlock', request.url);
    url.searchParams.set('error', '1');
    if (from !== '/') url.searchParams.set('from', from);
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(from, request.url), 303);
  response.cookies.set(COOKIE_NAME, createHash('sha256').update(expected).digest('hex'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return response;
}
