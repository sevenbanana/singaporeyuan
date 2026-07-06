import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '访问验证',
  robots: { index: false, follow: false },
};

// 根布局是透传的(<html> 由 [locale]/layout.tsx 渲染),
// 密码页在 [locale] 之外,因此这里需要自己渲染 <html> 和 <body>
export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
