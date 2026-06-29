import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { IconGrowth } from '@/components/icons';
import PageHero, { ContentLayer } from '@/components/PageHero';
import CaseJourney from '@/components/CaseJourney';

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
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('intro')}
        accent={<IconGrowth width="100%" height="100%" />}
      />

      <ContentLayer>
        {/* MoneySense 说明(轻量化) */}
        <section className="container-wide pt-14 md:pt-20">
          <div className="rounded-2xl border border-gold/30 bg-sand-50 p-6 md:p-7">
            <p className="text-sm leading-relaxed text-navy/80">{t('msNote')}</p>
            <a
              href="https://www.moneysense.gov.sg/planning-your-finances-well/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-gold-deep transition-colors hover:text-gold"
            >
              {t('msLink')} →
            </a>
            <p className="mt-4 text-xs leading-relaxed text-mist">{t('disclaimer')}</p>
          </div>
        </section>

        <section className="container-wide py-14 md:py-20">
          <CaseJourney />
        </section>

        <section className="container-wide border-t border-navy/10 py-12">
          <p className="text-xs leading-relaxed text-mist">
            {t('footerDisclaimer')}
          </p>
        </section>
      </ContentLayer>
    </>
  );
}
