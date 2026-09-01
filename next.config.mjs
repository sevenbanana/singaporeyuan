import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Bufan 的英语学习工具:静态单文件放在 public/gaobufan/english.html,
      // 这里把干净地址 /gaobufan/english 指过去(public/ 不做目录索引,不加这条会 404)
      { source: '/gaobufan/english', destination: '/gaobufan/english.html' },
      { source: '/gaobufan/english/', destination: '/gaobufan/english.html' },

      // 客户专属页:静态单文件放在 public/clients/**,这里把干净地址映射过去
      // (public/ 不做目录索引,不加这条会 404);页面自带独立访问密码
      { source: '/clients/:path*', destination: '/clients/:path*.html' },
    ];
  },
};

export default withNextIntl(nextConfig);
