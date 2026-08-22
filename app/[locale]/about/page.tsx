import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/routing';
import PageHero, { ContentLayer } from '@/components/PageHero';
import NavyDecor from '@/components/NavyDecor';
import { IconUsers } from '@/components/icons';
import { rich } from '@/lib/rich';

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
          {rich(p)}
        </p>
      ))}
    </>
  );
}

function About() {
  const t = useTranslations('about');
  const en = useLocale() === 'en';
  const home = useTranslations('home');
  const creds = t.raw('creds') as { name: string; desc: string }[];
  const edu = t.raw('edu') as string[];
  const quickStats = t.raw('quickStats') as { value: string; label: string }[];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        accent={<IconUsers width="100%" height="100%" />}
      />

      <ContentLayer>
      {/* intro lead */}
      <section className="container-wide max-w-3xl pt-14 md:pt-20">
        <p className="text-lg leading-[1.95] text-navy/80">{t('intro')}</p>
      </section>

      {/* 30-second intro */}
      <section className="container-wide max-w-3xl pt-10 md:pt-12">
        <div className="card p-8 md:p-10">
          <span className="eyebrow">{t('quickTitle')}</span>
          <div className="mt-4 space-y-3 text-base leading-[1.9] text-navy/80">
            {t('quickBody').split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-gold/20 pt-7 sm:grid-cols-4">
            {quickStats.map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-black text-gold-deep md:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-mist">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么我选择 AIA */}
      <section className="container-wide max-w-3xl pt-10 md:pt-12">
        <Link
          href="/about/why-aia"
          className="card card-hover group flex items-center gap-5 p-7 no-underline md:p-8"
        >
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold-deep sm:flex">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
              <path d="M9.2 12.2l2.1 2.1 4-4.5" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="eyebrow">{en ? 'My own judgement' : '我的判断标准'}</span>
            <span className="mt-2 block text-lg font-black leading-snug text-navy md:text-xl">
              {en
                ? 'The six things I look at before trusting an insurer'
                : '我用这六件事，判断一家保险公司值不值得托付'}
            </span>
            <span className="mt-2 block text-sm leading-[1.9] text-mist">
              {en
                ? 'Capital, claims speed, what doctors say, service, business, technology. This is the checklist I use, and what the public data says about AIA. Every figure links back to its source.'
                : '资本、理赔速度、医生怎么说、服务、经营、科技。这是我自己用的那张清单，以及公开数据里的 AIA，每个数字都能点回原文。'}
            </span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden shrink-0 text-gold-deep transition-transform duration-300 group-hover:translate-x-1 sm:block" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </section>

      {/* Story sections */}
      <article className="container-wide max-w-3xl py-16 md:py-20">
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
          <h2 className="text-2xl font-semibold text-navy">
            {t('mediaTitle')}
          </h2>
          <p className="mt-4 text-base leading-[1.9] text-navy/80">
            {t('mediaBody')}
          </p>
          <ul className="mt-6 space-y-2 text-sm text-navy/70">
            {!en && <li>📕 {t('mediaXhs')}</li>}
            <li>📺 {t('mediaWx')}</li>
          </ul>
          <p className="mt-4 text-sm text-gold-deep">{t('mediaFollowers')}</p>
        </div>
      </section>

      {/* Credentials(深蓝底 + 圆形纹理)*/}
      <section className="relative mt-16 overflow-hidden bg-navy-deep text-cream">
        <NavyDecor />
        <div className="container-wide relative grid gap-12 py-16 md:grid-cols-2 md:py-20">
          <div>
            <span className="eyebrow text-gold">{t('credsTitle')}</span>
            <ul className="mt-6 space-y-5">
              {creds.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <div>
                    <p className="text-sm font-medium text-cream">{c.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-cream/60">{c.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow text-gold">{t('eduTitle')}</span>
            <ul className="mt-6 space-y-3">
              {edu.map((e, i) => (
                <li key={i} className="flex gap-3 text-sm text-cream/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
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
      </ContentLayer>
    </>
  );
}
