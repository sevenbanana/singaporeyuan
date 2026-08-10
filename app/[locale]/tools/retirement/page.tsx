import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero, { ContentLayer } from '@/components/PageHero';
import RetirementCalculator from '@/components/RetirementCalculator';
import Watermark from '@/components/Watermark';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === 'en';
  return {
    title: en ? 'Retirement Readiness Calculator' : '退休自由度测算',
    description: en
      ? 'Put CPF LIFE, SRS and your investments on one timeline — with SRS locked until your statutory withdrawal age, the way it actually works.'
      : '把 CPF LIFE、SRS 和投资资产放在同一条时间线上,按 SRS 真实的提取年龄逐年测算你的退休准备。',
  };
}

export default async function RetirementToolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === 'en';

  return (
    <>
      <Watermark
        text={
          en
            ? 'Yuan Yuan SG · Tools · For reference only'
            : '新加坡小圆姐 · 小工具 · 仅供参考'
        }
      />
      <PageHero
        eyebrow={en ? 'Tools' : '小工具'}
        title={en ? 'Retirement Readiness Calculator' : '退休自由度测算'}
        subtitle={
          en
            ? 'Put CPF LIFE, SRS and your investments on one timeline. Unlike most calculators, this one models SRS as locked until your statutory withdrawal age (62 / 63 / 64) and CPF LIFE as starting at 65 — so early-retirement plans show the cash-flow gap instead of hiding it. (In Chinese)'
            : '把 CPF LIFE、SRS 和投资资产放在同一条时间线上,逐年模拟退休后每一笔钱从哪里来。SRS 会严格按你的提取年龄(62 / 63 / 64)才计入,CPF LIFE 也按开始领取的年龄计入 —— 想提前退休的人,能直接看到中间那段现金缺口。'
        }
        accent={
          <svg
            viewBox="0 0 24 24"
            className="h-full w-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.2 2" />
            <path d="M3.4 9.2 5.8 10M20.6 9.2 18.2 10" />
          </svg>
        }
      />
      <ContentLayer>
        <RetirementCalculator />
      </ContentLayer>
    </>
  );
}
