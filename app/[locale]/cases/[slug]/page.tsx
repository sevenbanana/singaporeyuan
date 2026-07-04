import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/routing';
import { routing } from '@/lib/routing';
import { CASES, getCase, getCases, getHexAxes, getDisclaimers } from '@/lib/cases';
import CaseHexagon from '@/components/CaseHexagon';
import Watermark from '@/components/Watermark';
import Reveal from '@/components/Reveal';
import RetirementPlans from '@/components/RetirementPlans';
import { rich } from '@/lib/rich';

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
  const { locale, slug } = await params;
  const c = getCase(slug, locale);
  if (!c) return {};
  return { title: `${c.mapLabel} · ${c.theme}` };
}

function Title({ title, hi }: { title: string; hi?: string }) {
  if (!hi || !title.includes(hi)) return <>{rich(title, true)}</>;
  const [pre, post] = title.split(hi);
  return (
    <>
      {rich(pre, true)}
      <b className="text-gold-light">{hi}</b>
      {rich(post, true)}
    </>
  );
}

// 咖啡杯小图标(带热气)
const CupGlyph = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h12v4.5A4.5 4.5 0 0 1 11.5 18h-3A4.5 4.5 0 0 1 4 13.5z" />
    <path d="M16 10h2.2a2.4 2.4 0 0 1 0 4.8H16" />
    <path d="M7.5 2.5c-.9 1.1-.9 2.2 0 3.3M11.5 2.5c-.9 1.1-.9 2.2 0 3.3" />
    <path d="M4 21h13" />
  </svg>
);

// 方案里三份保险的图标:意外 / 住院 / 重疾
function PlanIcon({ i }: { i: number }) {
  const p = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (i === 0) return <svg {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M12 8v4M12 15v.5" /></svg>;
  if (i === 1) return <svg {...p}><path d="M4 21V7l8-4 8 4v14" /><path d="M2 21h20" /><path d="M12 10v5M9.5 12.5h5" /></svg>;
  return <svg {...p}><path d="M20.8 8.6a5 5 0 0 0-8.8-3 5 5 0 0 0-8.8 3c0 4 5.5 8 8.8 10.4 3.3-2.4 8.8-6.4 8.8-10.4z" /><path d="M3.5 12h3l1.5-3 2.5 5 1.5-3h4" /></svg>;
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
  };
  if (HTML_CASE[slug]) redirect(HTML_CASE[slug]);

  const c = getCase(slug, locale);
  if (!c) notFound();

  const en = locale === 'en';
  const cases = getCases(locale);
  const hexAxes = getHexAxes(locale);
  const disclaimers = getDisclaimers(locale);
  const idx = cases.findIndex((x) => x.slug === c.slug);
  const n = idx + 1;
  const next = cases[(idx + 1) % cases.length];

  return (
    <>
      <Watermark text={en ? 'Yuan Yuan SG · Client case · Illustration only' : '新加坡小圆姐 · 客户案例 · 仅供方案说明'} />

      {/* ===== COVER ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4b3620] to-[#2e2012] text-cream">
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
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-cream/80">{rich(c.lead, true)}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {c.pills.map((p, i) => (
                <span
                  key={i}
                  className={`rounded-full px-4 py-1.5 text-xs ${
                    i === 0 ? 'bg-gold font-semibold text-[#2e2012]' : 'border border-gold/45 text-gold-light'
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

      {/* ===== A4 报告:与 banner 无缝衔接,像从打印机吐出的方案书 ===== */}
      <div className="container-wide">
        <article className="report-sheet mx-auto max-w-4xl">
          {/* 右上角圆形装饰 */}
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-navy/[0.07]" />
          <div aria-hidden className="pointer-events-none absolute -right-7 -top-7 h-32 w-32 rounded-full bg-gold/15" />
          <div aria-hidden className="pointer-events-none absolute right-24 top-16 h-2.5 w-2.5 rounded-full bg-gold/50" />
          {/* 内层细金线,呼应报告封面的双线金边 */}
          <div aria-hidden className="pointer-events-none absolute inset-x-2 bottom-2 top-0 rounded-b-[14px] border border-t-0 border-gold/25" />

          {/* ===== 01 客户画像(含保障六边形)===== */}
          <Reveal>
            <section className="report-panel">
              <div className="report-eyebrow">
                <span className="report-mark">✦</span> {en ? '01 · CLIENT PROFILE' : '01 · 客户画像'}
              </div>
              <h2 className="report-headline mt-2.5">{en ? 'First, understand the situation' : '先看清他的处境'}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {c.profile.map((card, i) => (
                  <div key={i} className="report-mini h-full">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{card.icon}</span>
                      <h4 className="text-sm font-extrabold text-navy">{rich(card.title)}</h4>
                    </div>
                    <ul className="report-body mt-3 space-y-2">
                      {card.items.map((it, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          <span>{rich(it)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* 保障六边形 */}
              <div className="report-divider" />
              <h3 className="report-subhead">
                {en ? 'Protection hexagon' : '保障六边形'} · {c.hexAfterLabel}
              </h3>
              <div className="mt-5 grid items-center gap-8 md:grid-cols-[280px_1fr]">
                <CaseHexagon
                  before={c.hexBefore}
                  after={c.hexAfter}
                  beforeLabel={c.hexBeforeLabel}
                  afterLabel={c.hexAfterLabel}
                  axes={hexAxes}
                  ariaLabel={en ? 'Protection hexagon: before and after' : '保障六边形：配置前后对比'}
                />
                <div>
                  <p className="report-body">{rich(c.hexNote)}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    {hexAxes.map((axis, i) => {
                      const lv = c.hexAfter[i];
                      const status =
                        lv >= 3 ? (en ? 'Strong' : '充足') : lv === 2 ? (en ? 'Basic' : '基础') : lv === 1 ? (en ? 'Started' : '起步') : en ? 'To add' : '待补';
                      return (
                        <span
                          key={axis}
                          className={`rounded-full px-3 py-1.5 font-bold ${
                            lv >= 2
                              ? 'border border-[#ecdfc0] bg-[#fbf0d3] text-gold-deep'
                              : lv === 1
                                ? 'bg-sand-200 text-mist'
                                : 'bg-navy/5 text-mist/60'
                          }`}
                        >
                          {axis} {status}
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
            <section className="report-panel mt-5">
              <div className="report-eyebrow">
                <span className="report-mark">◈</span> {en ? '02 · NEEDS ANALYSIS' : '02 · 需求分析'}
              </div>
              <h2 className="report-headline mt-2.5 max-w-2xl">{rich(c.analysisTitle)}</h2>
              <div className="report-body mt-4 max-w-3xl space-y-3">
                {c.analysis.map((p, i) => (
                  <p key={i}>{rich(p)}</p>
                ))}
              </div>
              {c.quote && (
                <blockquote className="report-summary mt-5 max-w-3xl text-sm font-bold leading-relaxed text-navy">
                  {rich(c.quote)}
                </blockquote>
              )}
            </section>
          </Reveal>

          {/* ===== 03 方案 ===== */}
          <Reveal>
            <section className="report-panel mt-5">
              <div className="report-eyebrow">
                <span className="report-mark">✚</span> {en ? '03 · THE PLAN' : '03 · 规划方案'}
              </div>
              <h2 className="report-headline mt-2.5 max-w-2xl">{rich(c.solutionTitle)}</h2>
              <div className="mt-3.5">
                <span className="report-chip">
                  {c.solutionEyebrow.split('·').slice(1).join('·').trim() || c.solutionEyebrow}
                </span>
              </div>
              <p className="report-body mt-3.5 max-w-3xl">{rich(c.solutionLead)}</p>

              {/* 数据卡:beige 为主,最后一项(合计/结论)用深一档的棕金变体 */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {c.meta.map((m, i) => {
                  const last = i === c.meta.length - 1;
                  return (
                    <div key={i} className={`report-stat ${last ? 'report-stat--strong' : ''}`}>
                      <div className="text-xs text-[#8a7d5f]">{m.label}</div>
                      <div className={`mt-1.5 text-xl font-extrabold leading-tight ${last ? 'text-[#6b4f1d]' : 'text-gold-deep'}`}>
                        {m.value}
                      </div>
                      {m.sub && <div className="mt-1 text-[11px] leading-snug text-[#8a7d5f]">{m.sub}</div>}
                    </div>
                  );
                })}
              </div>

              {/* 45 企业主:分红/增值基金两方案(时间轴 + 柱状图)*/}
              {c.slug === 'business-owner' && <RetirementPlans locale={locale} />}

              {/* 详细保障方案清单 */}
              {c.plans && (
                <div className="mt-5 space-y-4">
                  {c.plans.map((plan, i) => (
                    <div key={i} className="report-mini p-5 md:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/15 text-gold-deep">
                            <PlanIcon i={i} />
                          </span>
                          <div className="min-w-0">
                            <span className="inline-block rounded-lg bg-gold-deep px-3 py-1 text-[11px] font-extrabold tracking-wide text-white">{plan.no}</span>
                            <h4 className="mt-2 text-base font-extrabold leading-snug text-navy">{plan.name}</h4>
                            <p className="report-note mt-1">{plan.tagline}</p>
                          </div>
                        </div>
                        <div className="report-stat shrink-0 px-5">
                          <div className="text-xs text-[#8a7d5f]">{plan.sumLabel}</div>
                          <div className="mt-1 text-xl font-extrabold leading-tight text-gold-deep">{plan.sum}</div>
                          <div className="mt-0.5 text-[11px] text-[#8a7d5f]">{plan.price}</div>
                        </div>
                      </div>
                      <ul className="mt-4 grid gap-x-6 gap-y-3 border-t border-[#eeddb4] pt-4 sm:grid-cols-2">
                        {plan.benefits.map((bn, j) => (
                          <li key={j} className="flex gap-2.5">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-navy">{rich(bn.b)}</p>
                              <p className="report-note mt-0.5">{rich(bn.s)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {!c.plans && c.table && (
                <div className="mt-5 overflow-x-auto">
                  <table className="report-table">
                    <thead>
                      <tr>
                        {c.table.head.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.table.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 数据摘要卡 */}
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {c.dataChips.map((d, i) => (
                  <div key={i} className="report-summary">
                    <div className="text-xs text-[#8a7d5f]">{d.label}</div>
                    <div className="mt-1 text-base font-extrabold text-gold-deep">{d.value}</div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <div className="report-divider" />

          {/* ===== 重要说明 ===== */}
          <section className="relative">
            <h3 className="report-subhead text-sm">{en ? '⚖️ Important notes' : '⚖️ 重要说明'}</h3>
            <ul className="mt-3 space-y-1.5">
              {disclaimers.map((d, i) => (
                <li key={i} className="report-notice flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                  {d}
                </li>
              ))}
            </ul>
          </section>

          {/* ===== 报告落款 ===== */}
          <div className="mt-9 text-center text-xs tracking-[0.2em] text-[#8a7d5f]">
            {en ? 'Yuan Yuan SG · Growing richer with you, day by day' : '新加坡小圆姐 · 用专业和耐心，陪你一起日富一日'}
          </div>
        </article>
      </div>

      {/* ===== CTA · 咖啡主题 ===== */}
      <section className="container-wide mt-14 pb-24 md:mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-[#f8efe2] via-[#f1e2cd] to-[#e9d6bb] px-8 py-14 text-center shadow-card md:px-12 md:py-16">
          {/* 大咖啡杯线条装饰 */}
          <svg
            aria-hidden
            viewBox="0 0 120 120"
            className="pointer-events-none absolute -bottom-6 -right-3 h-48 w-48 text-[#a9763f]/[0.13]"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M26 50h52v20a18 18 0 0 1-18 18H44a18 18 0 0 1-18-18z" />
            <path d="M78 54h9a12 12 0 0 1 0 24h-9" />
            <path d="M42 28c-3 4-3 8 0 12M58 24c-3 4-3 8 0 12M74 28c-3 4-3 8 0 12" />
            <path d="M22 98h62" />
          </svg>
          {/* 咖啡豆点缀 */}
          <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-8 top-9 h-7 w-7 -rotate-12 text-[#a9763f]/15" fill="currentColor">
            <ellipse cx="12" cy="12" rx="6" ry="9" />
          </svg>

          <div className="relative">
            <h2 className="mx-auto max-w-xl text-2xl font-black leading-tight text-[#43301f] md:text-3xl">
              {en ? 'Your situation deserves its own plan' : '你的情况也很特别，方案应该为你量身定制'}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#6b5240]">
              {en
                ? 'Let’s sit down over coffee and talk through your goals, and see if we can plan a calmer future together. The first chat is always free.'
                : '不妨约杯咖啡，聊聊你的现状和目标，看看能不能一起，规划一个更安心的未来。第一次沟通是免费的。'}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <Link href="/consult" className="btn-gold">
                <CupGlyph />
                {en ? 'Book a free chat' : '预约免费咨询'}
              </Link>
              <Link
                href={`/cases/${next.slug}`}
                className="text-sm font-medium text-[#8a6438] transition-colors hover:text-gold-deep"
              >
                {en ? 'Next case' : '下一个案例'} · {next.mapLabel} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
