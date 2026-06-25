import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import CaseList from '@/components/CaseList';
import { useTranslations } from 'next-intl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cases' });
  return { title: t('metaTitle') };
}

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Cases />;
}

function Cases() {
  const t = useTranslations('cases');

  return (
    <>
      <section className="bg-navy text-cream">
        <div className="container-wide py-20 md:py-24">
          <span className="eyebrow text-gold">{t('eyebrow')}</span>
          <h1 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">
            {t('title')}
          </h1>
          <div className="my-7 rule-gold" />
          <p className="max-w-3xl text-base leading-[1.9] text-cream/85">
            {t('intro')}
          </p>
          <div className="mt-8 rounded-sm border border-gold/30 bg-navy-deep/50 p-6">
            <p className="text-sm leading-relaxed text-cream/80">{t('msNote')}</p>
            <a
              href="https://www.moneysense.gov.sg/planning-your-finances-well/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-light"
            >
              {t('msLink')} →
            </a>
            <p className="mt-4 text-xs leading-relaxed text-cream/50">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-20">
        <CaseList />
      </section>

      <section className="bg-cream">
        <div className="container-wide border-t border-navy/10 py-12">
          <p className="text-xs leading-relaxed text-mist">
            {t('footerDisclaimer')}
          </p>
        </div>
      </section>
    </>
  );
}
