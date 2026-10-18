import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero, { ContentLayer } from '@/components/PageHero';
import CpfCalculator from '@/components/cpf/CpfCalculator';
import Watermark from '@/components/Watermark';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === 'en';
  return {
    title: en ? 'CPF Retirement Calculator' : 'CPF 退休计算器',
    description: en
      ? 'Simulates your OA, SA, MA and RA year by year, applying the different CPF rules before 55, at 55, from 55 to 65 and after payouts start, then shows your CPF LIFE payout and three layers of retirement gap.'
      : '按年龄逐年模拟 OA / SA / MA / RA:55 岁前、55 岁节点、55–65 岁和领取期各套不同的 CPF 规则,看清 CPF LIFE 能领多少、缺口有多大,以及每个操作锁住了多少流动性。',
  };
}

export default async function CpfToolPage({
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
        density="light"
        text={en ? 'Yuan Yuan SG · Tools · For reference only' : '新加坡小圆姐 · 小工具 · 仅供参考'}
      />
      <PageHero
        eyebrow={en ? 'Tools' : '小工具'}
        title={en ? 'CPF Retirement Calculator' : 'CPF 退休计算器'}
        subtitle={
          en
            ? 'Not a straight line: your CPF is simulated stage by stage, with the rules that change at 55 and when CPF LIFE starts. See your payout, your gaps, and what each top-up or transfer really costs. (In Chinese)'
            : '不是一条直线:按年龄分阶段模拟你的 CPF,55 岁和开始领取时套用不同的规则。看清 CPF LIFE 能领多少、还差多少,以及每一次转账、填补真正的代价。'
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
            <path d="M3 20h18" />
            <path d="M5 20v-5h3v5M10.5 20v-9h3v9M16 20V7h3v13" />
            <path d="M4 10l5-4 4 3 7-6" />
            <path d="M17 3h3v3" />
          </svg>
        }
      />
      <ContentLayer>
        <CpfCalculator />
      </ContentLayer>
    </>
  );
}
