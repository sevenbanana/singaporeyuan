import { NextRequest, NextResponse } from 'next/server';

// 全站密码保护:在 Vercel 环境变量里设置 SITE_PASSWORD 即启用;
// 删掉该变量并重新部署,网站恢复公开访问。
const COOKIE_NAME = 'site_unlock';

async function sha256(text: string) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie && cookie === (await sha256(password))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const from = url.pathname + url.search;
  url.pathname = '/unlock';
  url.search = from === '/' ? '' : `?from=${encodeURIComponent(from)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // 排除密码页本身、验证接口、Next 静态资源和 public 里的文件(带扩展名)
  matcher: ['/((?!unlock|api/unlock|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
