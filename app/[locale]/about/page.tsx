import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('metaTitle') };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <About />;
}

function Para({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className="mt-4 text-base leading-[1.9] text-navy/80 first:mt-0">
          {p}
        </p>
      ))}
    </>
  );
}

function About() {
  const t = useTranslations('about');
  const home = useTranslations('home');
  const creds = t.raw('creds') as string[];
  const edu = t.raw('edu') as string[];

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-cream">
        <div className="container-wide py-20 md:py-24">
          <span className="eyebrow text-gold">{t('eyebrow')}</span>
          <h1 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 text-lg text-gold-light">{t('subtitle')}</p>
          <div className="my-7 rule-gold" />
          <p className="max-w-3xl text-base leading-[1.9] text-cream/85">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Story sections */}
      <article className="container-wide max-w-3xl py-20 md:py-24">
        <section>
          <h2 className="section-title">{t('section1Title')}</h2>
          <div className="mt-6">
            <Para text={t('section1Body')} />
          </div>
        </section>

        <section className="mt-16 border-t border-navy/10 pt-16">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="section-title mt-3">{t('section2Title')}</h2>
          <div className="mt-6">
            <Para text={t('section2Body')} />
          </div>
        </section>

        <section className="mt-16 border-t border-navy/10 pt-16">
          <h2 className="section-title">{t('section3Title')}</h2>
          <div className="mt-6">
            <Para text={t('section3Body')} />
          </div>
        </section>
      </article>

      {/* Media */}
      <section className="bg-cream">
        <div className="container-wide max-w-3xl border-t border-navy/10 py-16">
          <h2 className="font-serif text-2xl font-semibold text-navy">
            {t('mediaTitle')}
          </h2>
          <p className="mt-4 text-base leading-[1.9] text-navy/80">
            {t('mediaBody')}
          </p>
          <ul className="mt-6 space-y-2 text-sm text-navy/70">
            <li>📕 {t('mediaXhs')}</li>
            <li>📺 {t('mediaWx')}</li>
          </ul>
          <p className="mt-4 text-sm text-gold-deep">{t('mediaFollowers')}</p>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-navy-deep text-cream">
        <div className="container-wide grid gap-12 py-16 md:grid-cols-2">
          <div>
            <span className="eyebrow text-gold">{t('credsTitle')}</span>
            <ul className="mt-6 space-y-3">
              {creds.map((c, i) => (
                <li key={i} className="flex gap-3 text-sm text-cream/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow text-gold">{t('eduTitle')}</span>
            <ul className="mt-6 space-y-3">
              {edu.map((e, i) => (
                <li key={i} className="flex gap-3 text-sm text-cream/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-16 text-center">
        <Link href="/consult" className="btn-primary">
          {home('contactCta')}
        </Link>
      </section>
    </>
  );
}
