import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero, { ContentLayer } from '@/components/PageHero';
import TaxSavingsCalculator from '@/components/TaxSavingsCalculator';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'en' ? 'Tools' : '小工具' };
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === 'en';

  return (
    <>
      <PageHero
        eyebrow={en ? 'Tools' : '小工具'}
        title={en ? 'CPF / SRS Tax-Saving Calculator' : 'CPF / SRS 省税计算器'}
        subtitle={
          en
            ? 'See how much CPF cash top-ups and SRS contributions could save you in tax — based on Singapore’s latest resident tax rates.'
            : '输入应纳税收入与 CPF / SRS 充值金额,立即看充值前后税额、省多少税、省税比例 —— 依据新加坡最新居民个税税率。'
        }
        accent={
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2.5" />
            <rect x="6.8" y="4.8" width="10.4" height="4" rx="1" />
            <circle cx="8.2" cy="13" r="0.6" />
            <circle cx="12" cy="13" r="0.6" />
            <circle cx="15.8" cy="13" r="0.6" />
            <circle cx="8.2" cy="16.4" r="0.6" />
            <circle cx="12" cy="16.4" r="0.6" />
            <circle cx="15.8" cy="16.4" r="0.6" />
            <circle cx="8.2" cy="19.6" r="0.6" />
            <circle cx="12" cy="19.6" r="0.6" />
            <circle cx="15.8" cy="19.6" r="0.6" />
          </svg>
        }
      />
      <ContentLayer>
        <TaxSavingsCalculator locale={locale} />
      </ContentLayer>
    </>
  );
}
