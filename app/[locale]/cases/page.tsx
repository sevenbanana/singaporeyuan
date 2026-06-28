import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/routing';
import { caseOrder, isRich } from '@/lib/caseDetails';
import { caseIconBySlug, IconGrowth } from '@/components/icons';
import PageHero, { ContentLayer } from '@/components/PageHero';

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
  const list = t.raw('list') as { slug: string; tag: string; title: string }[];
  const ordered = caseOrder
    .map((slug) => list.find((c) => c.slug === slug))
    .filter(Boolean) as { slug: string; tag: string; title: string }[];

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ordered.map((c) => {
              const Icon = caseIconBySlug[c.slug];
              const cls = 'card card-hover group block h-full p-7';
              const inner = (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy transition-colors group-hover:bg-gold/15 group-hover:text-gold-deep">
                    {Icon ? <Icon /> : null}
                  </div>
                  <span className="mt-5 block text-xs font-semibold uppercase tracking-wide text-gold-deep">
                    {c.tag}
                  </span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-gold-deep">
                    {c.title}
                  </h3>
                  <span className="mt-4 inline-block text-sm text-gold-deep opacity-0 transition-opacity group-hover:opacity-100">
                    查看案例 →
                  </span>
                </>
              );
              return isRich(c.slug) ? (
                <a key={c.slug} href={`/cases/${c.slug}.html`} className={cls}>{inner}</a>
              ) : (
                <Link key={c.slug} href={`/cases/${c.slug}`} className={cls}>{inner}</Link>
              );
            })}
          </div>
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
