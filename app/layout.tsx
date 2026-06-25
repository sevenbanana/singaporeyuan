import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '袁媛 Yuan Yuan · 新加坡小圆姐 | AIA 财富管理顾问',
    template: '%s | 袁媛 Yuan Yuan',
  },
  description:
    '新加坡 AIA 财富管理顾问,全球 MDRT 百万圆桌会员。陪在新加坡生活的家庭,做保险与理财配置——陪你一起,慢慢变富。',
  metadataBase: new URL('https://singaporeyuan.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
