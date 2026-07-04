import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/lib/routing';
import Testimonials from '@/components/Testimonials';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import Typewriter from '@/components/Typewriter';
import { coreIcons, statIcons } from '@/components/icons';
import NavyDecor from '@/components/NavyDecor';
import ServiceFlow from '@/components/ServiceFlow';
import CaseJourney from '@/components/CaseJourney';

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
  const locale = useLocale();
  const stats = t.raw('stats') as { value: string; label: string }[];
  const roles = t.raw('heroRoles') as string[];
  const services = useTranslations('services');
  const core = services.raw('core') as { name: string; question: string; desc: string }[];
  const cases = useTranslations('cases');

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[440px] w-[440px] rounded-full border border-gold/25" />
        <div aria-hidden className="pointer-events-none absolute -right-16 top-6 h-[320px] w-[320px] rounded-full border border-gold/15" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-32 h-2.5 w-2.5 rounded-full bg-gold/50 animate-float" />
        <div aria-hidden className="pointer-events-none absolute right-1/4 bottom-20 h-2 w-2 rounded-full bg-gold/40 animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="container-wide relative grid items-end gap-8 pt-10 md:grid-cols-[1.05fr_0.95fr] md:pt-14">
          <div className="self-center pb-10 md:pb-16">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
              {t('heroGreeting')}
            </p>
            <h1 className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 animate-fade-up leading-[1.05]" style={{ animationDelay: '60ms' }}>
              <span className="text-4xl font-black text-navy md:text-5xl">{t('heroNameLead')}</span>
              <span className={`font-avenir text-4xl font-medium leading-none md:text-5xl ${locale === 'zh' ? 'text-gold/80' : 'text-gold-deep'}`}>
                {t('heroNameScript')}
              </span>
            </h1>
            <p className="mt-4 flex min-h-[1.6em] flex-wrap items-center gap-x-2 animate-fade-up text-xl font-bold md:text-2xl" style={{ animationDelay: '120ms' }}>
              <span className="text-ink/70">{t('heroTyperPrefix')}</span>
              <span className="text-gold-deep">
                <Typewriter words={roles} />
              </span>
            </p>
            <p className="mt-6 max-w-xl animate-fade-up text-[15px] leading-[1.85] text-ink/75" style={{ animationDelay: '200ms' }}>
              {t('heroBody').split('\n')[0]}
            </p>
            <blockquote className="mt-5 max-w-xl animate-fade-up border-l-2 border-gold pl-4 text-[15px] leading-[1.85] text-mist" style={{ animationDelay: '240ms' }}>
              {t('heroBody').split('\n')[1]}
            </blockquote>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '320ms' }}>
              <Link href="/consult" className="btn-primary">{t('heroCtaPrimary')}</Link>
              <Link href="/cases" className="btn-ghost">{t('heroCtaSecondary')}</Link>
            </div>
          </div>

          {/* 照片 + 装饰背景(沙色拱形 + 金色细环同心叠放,整体收纳在固定画框内) */}
          <div className="relative self-end">
            <div className="relative mx-auto h-[500px] w-[340px] sm:h-[580px] sm:w-[400px] md:ml-auto md:mr-0 md:h-[650px] md:w-[470px]">
              {/* 沙色圆形底盘(主背景,偏左下) */}
              <div aria-hidden className="absolute left-[44%] top-[60%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand-300/80 sm:h-[360px] sm:w-[360px] md:h-[440px] md:w-[440px]" />
              {/* 金色细圆环(偏上偏右,与圆盘随意交叠) */}
              <div aria-hidden className="absolute left-[64%] top-[40%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/45 sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[380px]" />
              {/* 小轨道环装饰(呼应 logo) */}
              <div aria-hidden className="absolute left-[10%] top-[14%] h-10 w-10 rounded-full border border-gold/40 md:h-12 md:w-12" />
              {/* 照片(按高度撑满画框,宽度自适应) */}
              <Image
                src="/portrait.png"
                alt="袁媛 Yuan Yuan"
                width={576}
                height={1500}
                priority
                className="absolute bottom-0 left-1/2 z-10 h-full w-auto -translate-x-1/2 animate-fade-in object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAND(全宽蓝色底,左右无限延伸 + 圆形纹理)===== */}
      <section className="relative -mt-px overflow-hidden bg-gradient-to-br from-navy to-navy-deep">
        <NavyDecor />
        <div className="container-wide relative py-14 md:py-16">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
              <span className="eyebrow text-gold-light">{t('statsTitle')}</span>
              <p className="text-xs text-cream/50">{t('statsSubtitle')}</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
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
              {t('statsQuote').split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </blockquote>
            <a
              href="https://www.aia.com.sg/en/agent-profile?cd=011&q=xc30d04090302eb8995342ca4c27664d23e01af37e1139368b1aea5f309e9d5bfa053d0c1cc1febeeea7adf2034fec7870ed3f4c16ad675b3ec334bc074c2d3a9f137dd3f18152a6bdab5835e53955f"
              target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-light transition-colors hover:text-gold"
            >
              {t('statsVerify')} →
            </a>
            <p className="mt-6 text-[11px] leading-relaxed text-cream/40">{t('statsFootnote')}</p>
          </Reveal>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW(左右版式 + 右侧时间轴)===== */}
      <section className="container-wide py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* 左:标题与说明 */}
          <Reveal className="md:sticky md:top-28 md:self-start">
            <span className="eyebrow">{services('eyebrow')}</span>
            <h2 className="section-title mt-4">{t('servicesTitle')}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mist">{t('servicesIntro')}</p>
            <Link href="/services" className="btn-ghost mt-8 inline-flex">{t('servicesLink')} →</Link>
          </Reveal>

          {/* 右:6 项纵向时间轴 */}
          <Reveal className="relative">
            <div aria-hidden className="absolute left-[21px] top-4 bottom-4 w-px bg-gold/30" />
            <ul className="space-y-9">
              {core.map((c, i) => {
                const Icon = coreIcons[i];
                return (
                  <li key={i} className="relative flex items-start gap-5">
                    <span className="z-10 mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-cream text-gold-deep">
                      <Icon width={20} height={20} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <span className="block text-base font-bold text-gold-deep">{c.name}</span>
                      <h3 className="mt-1.5 text-base font-bold leading-snug text-navy">{c.question}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-mist">{c.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===== CASES PREVIEW ===== */}
      <section className="border-t border-gold/15">
        <div className="container-wide py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">{cases('eyebrow')}</span>
            <h2 className="section-title mt-4">{t('casesTitle')}</h2>
            <p className="mt-4 text-base leading-relaxed text-mist">{t('casesIntro')}</p>
          </Reveal>
          <Reveal className="mt-12">
            <CaseJourney locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* ===== SERVICE FLOW(横向时间轴,交互式)===== */}
      <section className="bg-cream">
        <div className="container-wide border-t border-gold/15 py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <h2 className="section-title">{t('flowTitle')}</h2>
            <p className="mt-4 text-base leading-relaxed text-mist">{t('flowIntro')}</p>
          </Reveal>
          <Reveal className="mt-14">
            <ServiceFlow />
          </Reveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="container-wide py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t('tabClients')}</span>
          <h2 className="section-title mt-4">{t('testimonialsTitle')}</h2>
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
            <div className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-deep px-8 py-16 text-center md:px-12 md:py-20">
              <NavyDecor />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-cream md:text-4xl">{t('contactTitle')}</h2>
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/80">{t('contactIntro')}</p>
                <div className="mt-9">
                  <Link href="/consult" className="btn-gold">{t('contactCta')}</Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
