import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { IconGrowth, IconShield } from '@/components/icons';
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
        {/* MoneySense 说明 */}
        <section className="container-wide pt-14 md:pt-20">
          <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-sand-50 to-cream p-7 shadow-card md:p-9">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/5" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/12 text-gold-deep ring-1 ring-gold/25">
                <IconShield width={24} height={24} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  MAS · MoneySense
                </span>
                <p className="mt-2.5 text-[15px] leading-[1.85] text-navy/85">{t('msNote')}</p>
                <a
                  href="https://www.moneysense.gov.sg/planning-your-finances-well/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 text-sm font-medium text-gold-deep transition-colors hover:bg-gold/10 hover:text-gold"
                >
                  {t('msLink')} →
                </a>
              </div>
            </div>
            <p className="relative mt-6 border-t border-navy/10 pt-4 text-xs leading-relaxed text-mist">
              {t('disclaimer')}
            </p>
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
