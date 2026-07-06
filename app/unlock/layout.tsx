import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '访问验证 · singaporeyuan.com',
  robots: { index: false, follow: false },
};

export default function UnlockLayout({
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
