// 全站密码保护的公共工具:Cookie 名称与哈希函数
// 通过环境变量 SITE_PASSWORD 设置密码;未设置时保护不生效

export const AUTH_COOKIE = 'site-auth';

// Cookie 里只存密码的 SHA-256 哈希,不存明文
// 使用 Web Crypto,兼容 Edge 中间件与 Node 路由
export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
