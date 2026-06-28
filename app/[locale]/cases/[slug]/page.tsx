import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Link } from '@/lib/routing';
import { routing } from '@/lib/routing';
import { caseOrder, isRich, richCover } from '@/lib/caseDetails';
import Watermark from '@/components/Watermark';

type Case = {
  slug: string;
  tag: string;
  title: string;
  profile: string;
  existing: string;
  worry: string;
  notAdvice: string;
  firstAdvice: string;
  whyOrder: string;
  outcome: string;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    caseOrder.map((slug) => ({ locale, slug }))
  );
}

async function getCase(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: 'cases' });
  const list = t.raw('list') as Case[];
  return { t, c: list.find((x) => x.slug === slug) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { c } = await getCase(locale, slug);
  return { title: c ? c.title : 'Case' };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { t, c } = await getCase(locale, slug);
  if (!c) notFound();
  // 富文本案例(被动收入 / 退休现金流)使用原始 HTML 设计页,直接跳转
  if (isRich(slug)) redirect(`/cases/${slug}.html`);

  const en = locale === 'en';
  const cover = richCover[slug];
  const eyebrow = cover?.eyebrow ?? `CASE · ${c.tag}`;
  const kicker = cover?.kicker ?? (en ? 'Client case · for illustration only' : '客户案例 · 仅供方案说明');
  const lead = cover?.lead ?? c.profile;
  const pills = cover?.pills ?? [];

  const standardRows = [
    { label: t('labelProfile'), value: c.profile },
    { label: t('labelExisting'), value: c.existing },
    { label: t('labelWorry'), value: c.worry },
    { label: t('labelFirstAdvice'), value: c.firstAdvice },
    { label: t('labelWhyOrder'), value: c.whyOrder },
    { label: t('labelOutcome'), value: c.outcome },
  ];

  return (
    <>
      <Watermark text="新加坡小圆姐 · 客户案例 · 仅供方案说明" />
      {/* COVER — navy 渐变 + 金色细环 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-deep to-navy-700 text-cream">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-gold/30" />
        <div aria-hidden className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full border border-gold/15" />
        <div className="container-wide relative max-w-3xl py-14 md:py-20">
          <Link href="/cases" className="text-sm text-cream/70 transition-colors hover:text-gold-light">
            ← {en ? 'Back to cases' : '返回案例库'}
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
          <p className="mt-3 text-xs tracking-wide text-gold-light/80">{kicker}</p>
          <h1 className="mt-4 text-3xl font-black leading-[1.25] md:text-[2.6rem]">{c.title}</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-cream/80">{lead}</p>
          {pills.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2.5">
              {pills.map((p, i) => (
                <span
                  key={i}
                  className="rounded-full border border-gold/45 px-4 py-1.5 text-xs text-gold-light"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BODY */}
      <article className="container-wide max-w-3xl">
        <div className="py-14">
          <dl className="space-y-6">
            {standardRows.slice(0, 3).map((r, i) => (
              <div key={i} className="grid gap-1.5 md:grid-cols-[140px_1fr] md:gap-6">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gold-deep">{r.label}</dt>
                <dd className="text-[15px] leading-[1.85] text-navy/80">{r.value}</dd>
              </div>
            ))}
            <div className="grid gap-1.5 rounded-2xl border-l-2 border-gold bg-cream/60 px-5 py-5 md:grid-cols-[140px_1fr] md:gap-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-gold-deep">{t('labelNotAdvice')}</dt>
              <dd className="text-[15px] leading-[1.85] text-navy/80">{c.notAdvice}</dd>
            </div>
            {standardRows.slice(3).map((r, i) => (
              <div key={i} className="grid gap-1.5 md:grid-cols-[140px_1fr] md:gap-6">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gold-deep">{r.label}</dt>
                <dd className="text-[15px] leading-[1.85] text-navy/80">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 重要说明 */}
        <p className="border-t border-navy/10 py-10 text-xs leading-relaxed text-mist">
          {t('footerDisclaimer')}
        </p>
      </article>

      {/* CTA */}
      <section className="container-wide pb-24">
        <div className="card relative overflow-hidden">
          <div className="relative bg-gradient-to-br from-navy to-navy-deep px-8 py-14 text-center md:px-12 md:py-16">
            <h2 className="mx-auto max-w-xl text-2xl font-bold leading-tight text-cream md:text-3xl">
              {en ? 'Your situation deserves its own version' : '你的情况,也值得一个专属的版本'}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-cream/80">
              {en
                ? 'Every family is different. The first conversation is free — let’s start from what matters most to you.'
                : '每个家庭的数字都不一样。第一次沟通是免费的,我们可以从你最关心的问题聊起。'}
            </p>
            <div className="mt-8">
              <Link href="/consult" className="btn-gold">
                {en ? 'Book a free chat' : '预约一次免费沟通'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
