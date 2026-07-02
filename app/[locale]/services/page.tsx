import { useTranslations } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/lib/routing';
import PageHero, { ContentLayer } from '@/components/PageHero';
import NavyDecor from '@/components/NavyDecor';
import {
  IconShield,
  coreIcons,
  strategicIcons,
  IconUsers,
  IconShieldHeart,
  IconCheck,
  IconGrowth,
} from '@/components/icons';

const diffIcons = [IconUsers, IconShieldHeart, IconCheck, IconGrowth];

const CheckMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 6.5" />
  </svg>
);
const CrossMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

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
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('intro')}
        accent={<IconShield width="100%" height="100%" />}
      />

      <ContentLayer>
        {/* ===== 1a. 我能帮你解决什么, 图标 + 内容 ===== */}
        <section className="container-wide py-16 md:py-24">
          <h2 className="section-title">{t('coreTitle')}</h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {core.map((c, i) => {
              const Icon = coreIcons[i];
              return (
                <div key={i} className="flex gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold-deep ring-1 ring-gold/20">
                    {Icon ? <Icon width={24} height={24} /> : null}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-navy">{c.name}</h3>
                    <p className="mt-1.5 text-[15px] font-semibold leading-snug text-gold-deep">{c.question}</p>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== 1b. 战略合作, 图标 + 内容 ===== */}
        <section className="container-wide border-t border-navy/10 py-16 md:py-24">
          <h2 className="section-title">{t('strategicTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">{t('strategicIntro')}</p>
          <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {strategic.map((s, i) => {
              const Icon = strategicIcons[i];
              return (
                <div key={i} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-deep ring-1 ring-gold/20">
                    {Icon ? <Icon width={22} height={22} /> : null}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-navy">{s.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-mist">{t('strategicNote')}</p>
        </section>

        {/* ===== 2. 适合 / 不适合, 浅绿 / 浅粉 ===== */}
        <section className="container-wide border-t border-navy/10 py-16 md:py-24">
          <h2 className="section-title">{t('fitTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">{t('fitIntro')}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* 适合 · 浅绿 */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckMark />
                </span>
                <p className="text-lg font-bold text-emerald-900">{t('fitYesTitle')}</p>
              </div>
              <ul className="mt-6 space-y-3.5">
                {fitYes.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-navy/80">
                    <span className="mt-0.5 shrink-0 text-emerald-500">
                      <CheckMark />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* 不适合 · 浅粉 */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <CrossMark />
                </span>
                <p className="text-lg font-bold text-rose-900">{t('fitNoTitle')}</p>
              </div>
              <ul className="mt-6 space-y-3.5">
                {fitNo.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-navy/70">
                    <span className="mt-0.5 shrink-0 text-rose-400">
                      <CrossMark />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== 3. 我提供的,不只是一张保单 ===== */}
        <section className="container-wide border-t border-navy/10 py-16 md:py-24">
          <h2 className="section-title">{t('diffTitle')}</h2>
          <div className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2">
            {diff.map((d, i) => {
              const Icon = diffIcons[i];
              return (
                <div key={i} className="flex gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy/[0.06] text-navy">
                    {Icon ? <Icon width={24} height={24} /> : null}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-navy">{d.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist">{d.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-12 border-t border-navy/10 pt-6 text-xs leading-relaxed text-mist">{t('complianceNote')}</p>
        </section>

        {/* ===== CTA(深蓝底 + 圆形纹理)===== */}
        <section className="relative mt-4 overflow-hidden bg-navy text-cream">
          <NavyDecor />
          <div className="container-wide relative py-20 text-center md:py-24">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight md:text-4xl">{t('ctaTitle')}</h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/80">{t('ctaBody')}</p>
            <div className="mt-9">
              <Link href="/consult" className="btn-gold">{t('ctaBtn')}</Link>
            </div>
          </div>
        </section>
      </ContentLayer>
    </>
  );
}
