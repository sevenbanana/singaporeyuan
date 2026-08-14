import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, sha256 } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;

  // 未配置 SITE_PASSWORD 时不启用保护,避免误锁站点
  if (!sitePassword) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie && cookie === (await sha256(sitePassword))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/password';
  url.search = `?from=${encodeURIComponent(
    request.nextUrl.pathname + request.nextUrl.search
  )}`;
  return NextResponse.redirect(url);
}

export const config = {
  // 排除密码页本身、验证接口、Next 内部资源和带扩展名的静态文件;
  // 脱敏案例页虽是静态 .html,但需要站点密码,故单独列入
  //
  // gaobufan:儿子的英语学习工具,故意不设密码 —— 他每天要用,
  // 站点密码 cookie 只有 7 天,而且「添加到主屏幕」后独立容器可能读不到,
  // 孩子会被锁在外面。页面里只有英语课,没有任何客户或业务信息
  matcher: [
    '/((?!password|api/password|_next|gaobufan|.*\\..*).*)',
    '/proposals/piw-vs-platg-case.html',
  ],
};
