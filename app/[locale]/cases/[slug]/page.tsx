import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/routing';
import { routing } from '@/lib/routing';
import { CASES, getCase, DISCLAIMERS, HEX_AXES } from '@/lib/cases';
import CaseHexagon from '@/components/CaseHexagon';
import Watermark from '@/components/Watermark';
import Reveal from '@/components/Reveal';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASES.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return { title: `${c.mapLabel} · ${c.theme} | 新加坡小圆姐` };
}

function Title({ title, hi }: { title: string; hi?: string }) {
  if (!hi || !title.includes(hi)) return <>{title}</>;
  const [pre, post] = title.split(hi);
  return (
    <>
      {pre}
      <b className="text-gold-light">{hi}</b>
      {post}
    </>
  );
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // 这两个案例保留手作的图表 HTML 版本(/public/cases/*.html)
  const HTML_CASE: Record<string, string> = {
    'usd-retirement': '/cases/exec-retirement.html',
    'business-owner': '/cases/passive-income.html',
  };
  if (HTML_CASE[slug]) redirect(HTML_CASE[slug]);

  const c = getCase(slug);
  if (!c) notFound();

  const en = locale === 'en';
  const idx = CASES.findIndex((x) => x.slug === c.slug);
  const n = idx + 1;
  const next = CASES[(idx + 1) % CASES.length];

  return (
    <>
      <Watermark text="新加坡小圆姐 · 客户案例 · 仅供方案说明" />

      {/* ===== COVER ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-deep to-navy-700 text-cream">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-gold/30" />
        <div aria-hidden className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full border border-gold/15" />
        <div className="container-wide relative grid items-end gap-8 py-14 md:grid-cols-[1fr_auto] md:py-20">
          <div className="max-w-3xl">
            <Link href="/cases" className="text-sm text-cream/70 transition-colors hover:text-gold-light">
              ← {en ? 'Back to cases' : '返回案例库'}
            </Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{c.tag}</p>
            <p className="mt-3 text-xs tracking-wide text-gold-light/80">{c.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-black leading-[1.25] md:text-[2.6rem]">
              <Title title={c.title} hi={c.titleHi} />
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-cream/80">{c.lead}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {c.pills.map((p, i) => (
                <span
                  key={i}
                  className={`rounded-full px-4 py-1.5 text-xs ${
                    i === 0 ? 'bg-gold font-semibold text-navy' : 'border border-gold/45 text-gold-light'
                  }`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          {/* 人物半身像:贴 banner 底部站立 */}
          <div className="pointer-events-none relative -mb-14 hidden select-none self-end md:-mb-20 md:block">
            <Image
              src={`/avatars/case${n}_banner.png`}
              alt={c.mapLabel}
              width={420}
              height={420}
              className="h-[20rem] w-auto object-contain object-bottom lg:h-[24rem]"
              priority
            />
          </div>
        </div>
      </section>

      <article className="container-wide max-w-4xl">
        {/* ===== 01 客户画像 ===== */}
        <Reveal>
          <section className="py-14 md:py-16">
            <span className="text-xs font-extrabold tracking-[0.18em] text-gold-deep">01 / 客户画像</span>
            <h2 className="mt-2 text-2xl font-black leading-snug text-navy md:text-3xl">先看清他的处境</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.profile.map((card, i) => (
                <div key={i} className="card h-full p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{card.icon}</span>
                    <h3 className="font-bold text-navy">{card.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-navy/75">
                    {card.items.map((it, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ===== 保障六边形（位于客户画像下方）===== */}
        <Reveal>
          <section className="border-t border-navy/10 py-14 md:py-16">
            <span className="text-xs font-extrabold tracking-[0.18em] text-gold-deep">保障六边形</span>
            <h2 className="mt-2 text-2xl font-black leading-snug text-navy md:text-3xl">{c.hexAfterLabel}</h2>
            <div className="mt-7 grid items-center gap-10 md:grid-cols-[300px_1fr]">
              <CaseHexagon
                before={c.hexBefore}
                after={c.hexAfter}
                beforeLabel={c.hexBeforeLabel}
                afterLabel={c.hexAfterLabel}
              />
              <div>
                <p className="text-[15px] leading-[1.95] text-navy/80">{c.hexNote}</p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs">
                  {HEX_AXES.map((axis, i) => {
                    const lv = c.hexAfter[i];
                    return (
                      <span
                        key={axis}
                        className={`rounded-lg px-3 py-1.5 font-medium ${
                          lv >= 2 ? 'bg-gold/15 text-gold-deep' : lv === 1 ? 'bg-sand-200 text-mist' : 'bg-navy/5 text-mist/60'
                        }`}
                      >
                        {axis} {lv >= 3 ? '充足' : lv === 2 ? '基础' : lv === 1 ? '起步' : '待补'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ===== 02 需求分析 ===== */}
        <Reveal>
          <section className="border-t border-navy/10 py-14 md:py-16">
            <span className="text-xs font-extrabold tracking-[0.18em] text-gold-deep">02 / 需求分析</span>
            <h2 className="mt-2 max-w-2xl text-2xl font-black leading-snug text-navy md:text-3xl">{c.analysisTitle}</h2>
            <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-[1.95] text-navy/80">
              {c.analysis.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {c.quote && (
              <blockquote className="mt-8 max-w-3xl border-l-2 border-gold bg-gold/5 py-4 pl-6 pr-4 text-lg font-medium leading-relaxed text-navy">
                {c.quote}
              </blockquote>
            )}
          </section>
        </Reveal>

        {/* ===== 03 方案 ===== */}
        <Reveal>
          <section className="border-t border-navy/10 py-14 md:py-16">
            <span className="text-xs font-extrabold tracking-[0.18em] text-gold-deep">{c.solutionEyebrow}</span>
            <h2 className="mt-2 max-w-2xl text-2xl font-black leading-snug text-navy md:text-3xl">{c.solutionTitle}</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-mist">{c.solutionLead}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {c.meta.map((m, i) => (
                <div key={i} className="rounded-2xl border border-gold/25 bg-gradient-to-br from-sand-50 to-cream p-6">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gold-deep">{m.label}</div>
                  <div className="mt-2 text-2xl font-black text-navy">{m.value}</div>
                  {m.sub && <div className="mt-1.5 text-xs text-mist">{m.sub}</div>}
                </div>
              ))}
            </div>

            {c.table && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-navy text-cream">
                    <tr>
                      {c.table.head.map((h, i) => (
                        <th key={i} className="px-5 py-3.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.table.rows.map((row, i) => (
                      <tr key={i} className={i % 2 ? 'bg-sand-50/60' : 'bg-white'}>
                        {row.map((cell, j) => (
                          <td key={j} className={`px-5 py-3.5 text-navy/80 ${j === 0 ? 'font-medium text-navy' : ''}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {c.dataChips.map((d, i) => (
                <div key={i} className="rounded-2xl bg-gradient-to-br from-navy to-navy-deep px-6 py-5 text-cream">
                  <div className="text-xs text-cream/60">{d.label}</div>
                  <div className="mt-1.5 text-lg font-bold text-gold-light">{d.value}</div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ===== 重要说明 ===== */}
        <section className="border-t border-navy/10 py-10">
          <div className="rounded-2xl border border-navy/10 bg-white/60 p-6">
            <div className="text-sm font-semibold text-navy">⚖️ 重要说明</div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-mist">
              {DISCLAIMERS.map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>

      {/* ===== CTA ===== */}
      <section className="container-wide pb-24">
        <div className="card relative overflow-hidden">
          <div className="relative bg-gradient-to-br from-navy to-navy-deep px-8 py-14 text-center md:px-12 md:py-16">
            <h2 className="mx-auto max-w-xl text-2xl font-bold leading-tight text-cream md:text-3xl">
              {en ? 'Your situation deserves its own version' : '你的情况也很特别，方案应该为你量身定制'}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-cream/80">
              {en
                ? 'Every family is different. The first conversation is free — let’s start from what matters most to you.'
                : '聊一聊你的现状和目标，看看我们能不能一起规划更安心的未来。第一次沟通是免费的。'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/consult" className="btn-gold">
                {en ? 'Book a free chat' : '预约免费咨询'}
              </Link>
              <Link href={`/cases/${next.slug}`} className="text-sm font-medium text-gold-light transition-colors hover:text-gold">
                {en ? 'Next case' : '下一个案例'} · {next.mapLabel} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
