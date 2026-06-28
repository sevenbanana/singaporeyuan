import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '袁媛 Yuan Yuan · 新加坡小圆姐 | 新加坡资产配置顾问',
    template: '%s | 袁媛 Yuan Yuan',
  },
  description:
    '新加坡资产配置顾问,全球 MDRT 百万圆桌会员。陪在新加坡生活的家庭,做保险与理财规划——用专业和耐心,陪你一起日富一日。',
  metadataBase: new URL('https://singaporeyuan.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
