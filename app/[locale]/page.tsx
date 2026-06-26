import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/lib/routing';
import Testimonials from '@/components/Testimonials';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import { coreIcons, caseIcons, statIcons } from '@/components/icons';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home />;
}

function Home() {
  const t = useTranslations('home');
  const stats = t.raw('stats') as { value: string; label: string }[];
  const services = useTranslations('services');
  const core = services.raw('core') as { name: string; question: string; desc: string }[];
  const cases = useTranslations('cases');
  const caseList = cases.raw('list') as { tag: string; title: string }[];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[440px] w-[440px] rounded-full border border-gold/25" />
        <div aria-hidden className="pointer-events-none absolute -right-16 top-6 h-[320px] w-[320px] rounded-full border border-gold/15" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-32 h-2.5 w-2.5 rounded-full bg-gold/50 animate-float" />
        <div aria-hidden className="pointer-events-none absolute right-1/4 bottom-20 h-2 w-2 rounded-full bg-gold/40 animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="container-wide relative grid items-end gap-8 pt-14 md:grid-cols-[1.15fr_0.85fr] md:pt-20">
          <div className="pb-14 md:pb-20">
            <div className="animate-fade-up">
              <span className="tag-navy text-xs">{t('heroBadge')}</span>
            </div>
            <h1 className="mt-6 animate-fade-up text-3xl font-black leading-[1.25] text-navy md:text-4xl lg:text-[2.75rem]" style={{ animationDelay: '60ms' }}>
              {t('heroTitle')}
            </h1>
            <div className="mt-5 max-w-xl animate-fade-up space-y-1 text-base font-medium leading-[1.7] text-gold-deep md:text-lg" style={{ animationDelay: '120ms' }}>
              {t('heroSubtitle').split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="my-6 rule-gold animate-fade-up" style={{ animationDelay: '160ms' }} />
            <div className="max-w-xl animate-fade-up space-y-2 text-[15px] leading-[1.85] text-ink/80" style={{ animationDelay: '200ms' }}>
              {t('heroBody').split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-7 animate-fade-up text-lg font-bold text-navy md:text-xl" style={{ animationDelay: '260ms' }}>
              {t('heroName')}
            </p>
            <div className="mt-7 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '320ms' }}>
              <Link href="/consult" className="btn-gold">{t('heroCtaPrimary')}</Link>
              <Link href="/cases" className="btn-ghost">{t('heroCtaSecondary')}</Link>
            </div>
          </div>

          {/* 透明照片,无框;底部与下方数据模块无缝衔接 */}
          <div className="relative flex justify-center self-end md:justify-end">
            <div aria-hidden className="absolute bottom-0 left-1/2 h-[72%] w-[70%] -translate-x-1/2 rounded-full bg-gradient-to-t from-gold/15 to-transparent blur-2xl" />
            <Image
              src="/portrait.png"
              alt="袁媛 Yuan Yuan"
              width={576}
              height={1500}
              priority
              className="relative z-10 block h-auto w-[230px] animate-fade-in object-contain align-bottom md:w-[300px] lg:w-[340px]"
            />
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="relative -mt-px">
        <div className="container-wide">
          <Reveal className="card overflow-hidden">
            <div className="bg-gradient-to-br from-navy to-navy-deep px-8 py-12 md:px-12">
              <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
                <span className="eyebrow text-gold-light">{t('statsTitle')}</span>
                <p className="text-xs text-cream/50">{t('statsSubtitle')}</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
                {stats.map((s, i) => {
                  const Icon = statIcons[i];
                  return (
                    <div key={i} className="border-l-2 border-gold/40 pl-4">
                      <Icon className="mb-2.5 text-gold/70" width={22} height={22} />
                      <CountUp value={s.value} className="block text-2xl font-black text-gold-light md:text-3xl" />
                      <div className="mt-1.5 text-xs text-cream/70">{s.label}</div>
                    </div>
                  );
                })}
              </div>
              <blockquote className="mt-10 max-w-3xl border-l-2 border-gold pl-6 text-lg font-medium leading-relaxed text-cream/90 md:text-xl">
                {t('statsQuote')}
              </blockquote>
              <a
                href="https://www.aia.com.sg/en/agent-profile?cd=011&q=xc30d04090302eb8995342ca4c27664d23e01af37e1139368b1aea5f309e9d5bfa053d0c1cc1febeeea7adf2034fec7870ed3f4c16ad675b3ec334bc074c2d3a9f137dd3f18152a6bdab5835e53955f"
                target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-light transition-colors hover:text-gold"
              >
                {t('statsVerify')} →
              </a>
              <p className="mt-6 text-[11px] leading-relaxed text-cream/40">{t('statsFootnote')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="container-wide py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{services('eyebrow')}</span>
          <h2 className="section-title mt-4">{t('servicesTitle')}</h2>
          <p className="mt-4 text-base leading-relaxed text-mist">{t('servicesIntro')}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {core.map((c, i) => {
            const Icon = coreIcons[i];
            return (
              <Reveal key={i} delay={i * 90}>
                <div className="card card-hover h-full p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-deep">
                      <Icon />
                    </div>
                    <span className="text-2xl font-black text-gold/40">0{i + 1}</span>
                  </div>
                  <span className="mt-5 block text-xs font-semibold uppercase tracking-wide text-gold-deep">{c.name}</span>
                  <h3 className="mt-2 text-base font-bold leading-snug text-navy">{c.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{c.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-10">
          <Link href="/services" className="btn-ghost">{t('servicesLink')} →</Link>
        </Reveal>
      </section>

      {/* ===== CASES PREVIEW ===== */}
      <section className="border-t border-gold/15">
        <div className="container-wide py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">{cases('eyebrow')}</span>
            <h2 className="section-title mt-4">{t('casesTitle')}</h2>
            <p className="mt-4 text-base leading-relaxed text-mist">{t('casesIntro')}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {caseList.slice(0, 3).map((c, i) => {
              const Icon = caseIcons[i];
              return (
                <Reveal key={i} delay={i * 100}>
                  <Link href="/cases" className="card card-hover group block h-full p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy transition-colors group-hover:bg-gold/15 group-hover:text-gold-deep">
                      <Icon />
                    </div>
                    <span className="mt-5 block text-xs font-semibold uppercase tracking-wide text-gold-deep">{c.tag}</span>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-gold-deep">{c.title}</h3>
                    <span className="mt-4 inline-block text-sm text-gold-deep opacity-0 transition-opacity group-hover:opacity-100">展开查看 →</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-10">
            <Link href="/cases" className="btn-ghost">{t('casesLink')} →</Link>
          </Reveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="container-wide py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t('testimonialsTitle')}</span>
          <p className="mt-4 text-base leading-relaxed text-mist">{t('testimonialsIntro')}</p>
        </Reveal>
        <Reveal className="mt-12">
          <Testimonials />
        </Reveal>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section className="container-wide pb-24">
        <Reveal>
          <div className="card relative overflow-hidden">
            <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-gold/20" />
            <div className="relative bg-gradient-to-br from-navy to-navy-deep px-8 py-16 text-center md:px-12 md:py-20">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-cream md:text-4xl">{t('contactTitle')}</h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/80">{t('contactIntro')}</p>
              <div className="mt-9">
                <Link href="/consult" className="btn-gold">{t('contactCta')}</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
