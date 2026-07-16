import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  // 标题模板交由 app/[locale]/layout.tsx 按语言提供,这里只留一个兜底
  title: '袁媛 Yuan Yuan · 新加坡财富规划经理',
  description:
    '新加坡财富规划经理,全球 MDRT 百万圆桌会员。陪在新加坡生活的家庭,做保险与理财规划，用专业和耐心,陪你一起日富一日。',
  metadataBase: new URL('https://singaporeyuan.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
