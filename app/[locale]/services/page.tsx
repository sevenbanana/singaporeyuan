import { useTranslations } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/lib/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return { title: t('metaTitle') };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Services />;
}

function Services() {
  const t = useTranslations('services');
  const core = t.raw('core') as { name: string; question: string; desc: string }[];
  const strategic = t.raw('strategic') as { name: string; desc: string }[];
  const diff = t.raw('diff') as { name: string; desc: string }[];
  const fitYes = t.raw('fitYes') as string[];
  const fitNo = t.raw('fitNo') as string[];

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-cream">
        <div className="container-wide py-20 md:py-24">
          <span className="eyebrow text-gold">{t('eyebrow')}</span>
          <h1 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
            {t('title')}
          </h1>
          <div className="my-7 rule-gold" />
          <p className="max-w-3xl text-base leading-[1.9] text-cream/85">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Core */}
      <section className="container-wide py-20 md:py-24">
        <h2 className="section-title">{t('coreTitle')}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {core.map((c, i) => (
            <div
              key={i}
              className="rounded-sm border border-navy/10 bg-white p-8 transition-colors hover:border-gold/50"
            >
              <span className="font-serif text-sm text-gold-deep">0{i + 1}</span>
              <h3 className="mt-2 font-serif text-lg font-semibold text-navy md:text-xl">
                {c.question}
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gold-deep">
                {c.name}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-mist">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fit / not fit */}
      <section className="bg-cream">
        <div className="container-wide border-t border-navy/10 py-20 md:py-24">
          <h2 className="section-title">{t('fitTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">
            {t('fitIntro')}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-gold/40 bg-white p-8">
              <p className="font-serif text-lg font-semibold text-navy">
                {t('fitYesTitle')}
              </p>
              <ul className="mt-5 space-y-3">
                {fitYes.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-navy/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-navy/10 bg-white p-8">
              <p className="font-serif text-lg font-semibold text-navy">
                {t('fitNoTitle')}
              </p>
              <ul className="mt-5 space-y-3">
                {fitNo.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-mist">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-mist/50" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic */}
      <section className="bg-cream">
        <div className="container-wide border-t border-navy/10 py-20 md:py-24">
          <h2 className="section-title">{t('strategicTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">
            {t('strategicIntro')}
          </p>
          <div className="mt-10 divide-y divide-navy/10 border-y border-navy/10">
            {strategic.map((s, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:gap-8"
              >
                <h3 className="font-serif text-lg font-semibold text-navy md:w-48 md:shrink-0">
                  {s.name}
                </h3>
                <p className="text-sm leading-relaxed text-mist">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-mist">
            {t('strategicNote')}
          </p>
        </div>
      </section>

      {/* Differentiation */}
      <section className="container-wide py-20 md:py-24">
        <h2 className="section-title">{t('diffTitle')}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {diff.map((d, i) => (
            <div key={i} className="border-t-2 border-gold/40 pt-5">
              <h3 className="font-serif text-base font-semibold text-navy">
                {d.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{d.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-navy/10 pt-6 text-xs leading-relaxed text-mist">
          {t('complianceNote')}
        </p>
      </section>

      {/* CTA */}
      <section className="bg-navy text-cream">
        <div className="container-wide py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold leading-tight">
            {t('ctaTitle')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/80">
            {t('ctaBody')}
          </p>
          <div className="mt-9">
            <Link href="/consult" className="btn-primary bg-gold text-navy hover:bg-gold-light">
              {t('ctaBtn')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
