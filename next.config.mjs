import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

// 诺元控股官网:静态文件放在 public/nourra/,通过子域名访问
const NOURRA_HOST = [{ type: 'host', value: 'nourra.singaporeyuan.com' }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // 按域名分流必须在 beforeFiles 里做,否则子域名的 / 和 /en 会先命中本站的页面
      // 页面里的资源用相对路径(assets/…),最后一条把它们一并指到 /nourra/ 下
      beforeFiles: [
        { source: '/', has: NOURRA_HOST, destination: '/nourra/index.html' },
        { source: '/en', has: NOURRA_HOST, destination: '/nourra/en/index.html' },
        { source: '/:path((?!nourra/).+)', has: NOURRA_HOST, destination: '/nourra/:path' },
      ],
      afterFiles: [
        // Bufan 的英语学习工具:静态单文件放在 public/gaobufan/english.html,
        // 这里把干净地址 /gaobufan/english 指过去(public/ 不做目录索引,不加这条会 404)
        { source: '/gaobufan/english', destination: '/gaobufan/english.html' },
        { source: '/gaobufan/english/', destination: '/gaobufan/english.html' },

        // 老公的生日惊喜页:静态单文件 public/birthday.html
        { source: '/birthday', destination: '/birthday.html' },
        { source: '/birthday/', destination: '/birthday.html' },

        // 客户专属页:静态单文件放在 public/clients/**,这里把干净地址映射过去
        // (public/ 不做目录索引,不加这条会 404);页面自带独立访问密码
        { source: '/clients/:path*', destination: '/clients/:path*.html' },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
