// 45 企业主 · 分红/增值基金的两个退休方案(即时分红 vs 先增长后分红)
// 同一笔投入 $10万/年 × 5年 = $50万;数字为情景测算、非保证。产品名已隐去。
import type { ReactNode } from 'react';

type L = { zh: string; en: string };
type Node = { age: string; sub: L; rows: { l: L; v: string }[]; total?: string; pills?: L[]; kind?: 'start' | 'hl' | 'end' };
type Plan = {
  tag: L;
  title: L;
  invest: L;
  phases: { head: L; items: L[] }[];
  nodes: Node[];
  stats: { l: L; v: string; s: L }[];
};

const t = (zh: string, en: string): L => ({ zh, en });

const PLANS: Plan[] = [
  {
    tag: t('方案 1 · 即时分红', 'Plan 1 · Dividends from day one'),
    title: t('保单生效即领，终身现金流', 'Cash flow from day one, for life'),
    invest: t('$10 万 / 年 × 5 年 · 合计投入 $50 万', 'S$100k/yr × 5 yrs · S$500k total'),
    phases: [
      {
        head: t('立即开始（保单生效起）', 'Starts immediately'),
        items: [
          t('迎新红利 $12,000（12% 一次性发放）', 'Welcome bonus S$12,000 (12%, one-off)'),
          t('季度稳定分红 7% p.a.，现金直接到手', 'Steady 7% p.a. quarterly dividends, paid in cash'),
          t('年化保证基金红利 0.4% p.a. 持续累计', 'Guaranteed fund bonus 0.4% p.a., compounding'),
        ],
      },
      {
        head: t('第 8 年起 · 额外叠加', 'From year 8 · extra layers'),
        items: [
          t('额外投资红利（Y8–11）叠加派发', 'Extra investment bonus layered on (Y8–11)'),
          t('每年保证基金红利持续滚存', 'Yearly guaranteed fund bonus keeps compounding'),
          t('可随时提取现金价值，不影响身故保障', 'Withdraw cash value anytime, without cutting the death benefit'),
        ],
      },
    ],
    nodes: [
      { age: '45', sub: t('开始投保', 'Start'), kind: 'start', rows: [{ l: t('5 年总投入', '5-yr total in'), v: 'S$500,000' }], pills: [t('第 5 年起每年 S$35,000', 'S$35,000/yr from year 5')] },
      { age: '60', sub: t('现金流累计', 'Cash flow'), kind: 'hl', rows: [{ l: t('保单价值', 'Policy value'), v: 'S$500,000' }, { l: t('累计到手分红', 'Dividends received'), v: 'S$455,000' }], total: 'S$955,000' },
      { age: '70', sub: t('现金流累计', 'Cash flow'), kind: 'hl', rows: [{ l: t('保单价值', 'Policy value'), v: 'S$500,000' }, { l: t('累计到手分红', 'Dividends received'), v: 'S$805,000' }], total: 'S$1,305,000' },
      { age: '80', sub: t('现金流累计', 'Cash flow'), kind: 'hl', rows: [{ l: t('保单价值', 'Policy value'), v: 'S$500,000' }, { l: t('累计到手分红', 'Dividends received'), v: 'S$1,155,000' }], total: 'S$1,655,000' },
      { age: '100', sub: t('现金流累计', 'Cash flow'), kind: 'end', rows: [{ l: t('保单价值', 'Policy value'), v: 'S$500,000' }, { l: t('累计到手分红', 'Dividends received'), v: 'S$1,855,000' }], total: 'S$2,355,000' },
    ],
    stats: [
      { l: t('第 5 年起 · 每年分红', 'From year 5 · yearly'), v: 'S$35,000', s: t('约 S$2,917 / 月', '~S$2,917 / mo') },
      { l: t('70 岁 · 累计到手', 'By 70 · received'), v: 'S$805,000', s: t('约本金 1.6 倍', '~1.6× premiums') },
      { l: t('100 岁 · 保单总收益', 'By 100 · total'), v: 'S$2,355,000', s: t('含保单价值', 'incl. policy value') },
    ],
  },
  {
    tag: t('方案 2 · 先增长后分红', 'Plan 2 · Grow first, then draw'),
    title: t('前 15 年增值，60 岁起切分红', 'Grow for 15 years, draw from 60'),
    invest: t('$10 万 / 年 × 5 年 · 合计投入 $50 万', 'S$100k/yr × 5 yrs · S$500k total'),
    phases: [
      {
        head: t('阶段一 ｜ 45–60 岁：增值', 'Phase 1 · 45–60: grow'),
        items: [
          t('资金配置到增值 / 指数基金，专注退休前的账户成长', 'Allocate to a growth / index fund, focused on pre-retirement growth'),
          t('参考测算：60 岁账户价值约 $1,081,000', 'Illustrated: account value ~S$1,081,000 at 60'),
        ],
      },
      {
        head: t('阶段二 ｜ 60 岁起：分红现金流', 'Phase 2 · from 60: draw'),
        items: [
          t('60 岁将账户价值切换到分红基金，作为退休现金流', 'At 60, switch the account value to a participating fund for retirement income'),
          t('保守口径：基金 0 增长，每年领取 7% 分红 ≈ $75,700', 'Conservative: 0% fund growth, draw 7%/yr ≈ S$75,700'),
        ],
      },
    ],
    nodes: [
      { age: '45', sub: t('开始投入', 'Start'), kind: 'start', rows: [{ l: t('5 年总投入', '5-yr total in'), v: 'S$500,000' }], pills: [t('先做增长', 'Grow first'), t('投到 60 岁', 'Until 60')] },
      { age: '60', sub: t('切换分红', 'Switch'), kind: 'hl', rows: [{ l: t('账户价值', 'Account value'), v: 'S$1,081,000' }], total: 'S$1,081,000' },
      { age: '70', sub: t('现金流累计', 'Cash flow'), kind: 'hl', rows: [{ l: t('账户价值', 'Account value'), v: 'S$1,081,000' }, { l: t('累计到手分红', 'Dividends received'), v: 'S$757,000' }], total: 'S$1,838,000' },
      { age: '80', sub: t('现金流累计', 'Cash flow'), kind: 'hl', rows: [{ l: t('账户价值', 'Account value'), v: 'S$1,081,000' }, { l: t('累计到手分红', 'Dividends received'), v: 'S$1,514,000' }], total: 'S$2,595,000' },
      { age: '100', sub: t('现金流累计', 'Cash flow'), kind: 'end', rows: [{ l: t('账户价值', 'Account value'), v: 'S$1,081,000' }, { l: t('累计到手分红', 'Dividends received'), v: 'S$3,028,000' }], total: 'S$4,109,000' },
    ],
    stats: [
      { l: t('60 岁 · 账户价值', 'By 60 · account'), v: 'S$1,081,000', s: t('先增值再领取', 'grow, then draw') },
      { l: t('60 岁起 · 每年分红', 'From 60 · yearly'), v: 'S$75,700', s: t('约 S$6,300 / 月', '~S$6,300 / mo') },
      { l: t('100 岁 · 保单总收益', 'By 100 · total'), v: 'S$4,109,000', s: t('含账户价值', 'incl. account value') },
    ],
  },
];

// 对比柱状图数据:两方案在 60/70/80/100 岁的「保单总收益」
const CHART = {
  ages: ['60', '70', '80', '100'],
  p1: [955000, 1305000, 1655000, 2355000],
  p2: [1081000, 1838000, 2595000, 4109000],
};

function money(n: number) {
  return 'S$' + (n / 1000000).toFixed(2) + 'M';
}

function ComparisonBars({ en }: { en: boolean }) {
  const max = 4109000;
  const groups = CHART.ages.length;
  const W = 640;
  const H = 300;
  const padL = 20;
  const padB = 44;
  const padT = 16;
  const gw = (W - padL * 2) / groups;
  const bw = 30;
  const chartH = H - padB - padT;
  const y = (v: number) => padT + chartH * (1 - v / max);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={en ? 'Total-return comparison' : '保单总收益对比'}>
      {[0, 0.5, 1].map((f, i) => (
        <line key={i} x1={padL} x2={W - padL} y1={y(max * f)} y2={y(max * f)} stroke="#1a2744" strokeOpacity={0.08} />
      ))}
      {CHART.ages.map((age, i) => {
        const cx = padL + gw * i + gw / 2;
        const v1 = CHART.p1[i];
        const v2 = CHART.p2[i];
        return (
          <g key={age}>
            <rect x={cx - bw - 3} y={y(v1)} width={bw} height={y(0) - y(v1)} rx={4} fill="#c9a55c" />
            <rect x={cx + 3} y={y(v2)} width={bw} height={y(0) - y(v2)} rx={4} fill="#3f5b4a" />
            <text x={cx - bw / 2 - 3} y={y(v1) - 6} textAnchor="middle" fontSize="10" fontWeight="700" className="fill-gold-deep">{money(v1)}</text>
            <text x={cx + bw / 2 + 3} y={y(v2) - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#3f5b4a">{money(v2)}</text>
            <text x={cx} y={H - 24} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-navy">{age}{en ? '' : ' 岁'}</text>
          </g>
        );
      })}
      <text x={padL} y={H - 6} fontSize="11" className="fill-mist">{en ? 'Age' : '年龄'}</text>
    </svg>
  );
}

function Timeline({ plan, en }: { plan: Plan; en: boolean }) {
  const lang = en ? 'en' : 'zh';
  return (
    <div className="mt-5 overflow-x-auto pb-2">
      <div className="flex min-w-[640px] gap-3">
        {plan.nodes.map((n, i) => (
          <div key={i} className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 shrink-0 rounded-full ${
                  n.kind === 'start' ? 'bg-[#3f5b4a]' : n.kind === 'end' ? 'bg-gold-deep' : 'border-2 border-gold bg-white'
                }`}
              />
              {i < plan.nodes.length - 1 && <span className="h-px flex-1 bg-gold/40" />}
            </div>
            <div className="mt-2 text-2xl font-black leading-none text-navy">{n.age}</div>
            <div className="text-[10px] text-mist">{n.sub[lang]}</div>
            <div
              className={`mt-2 rounded-xl border p-3 ${
                n.kind === 'end' ? 'border-navy bg-navy text-cream' : n.kind === 'hl' ? 'border-gold/40 bg-gold/[0.06]' : 'border-gold/25 bg-white'
              }`}
            >
              {n.rows.map((r, j) => (
                <div key={j} className="mb-1.5 last:mb-0">
                  <div className={`text-[10px] ${n.kind === 'end' ? 'text-cream/55' : 'text-mist'}`}>{r.l[lang]}</div>
                  <div className={`text-sm font-bold ${n.kind === 'end' ? 'text-gold-light' : 'text-navy'}`}>{r.v}</div>
                </div>
              ))}
              {n.total && (
                <div className={`mt-2 border-t pt-1.5 ${n.kind === 'end' ? 'border-cream/20' : 'border-gold/20'}`}>
                  <div className={`text-[10px] font-bold ${n.kind === 'end' ? 'text-cream/70' : 'text-gold-deep'}`}>{en ? 'Total' : '保单总收益'}</div>
                  <div className={`text-[15px] font-black ${n.kind === 'end' ? 'text-gold-light' : 'text-gold-deep'}`}>{n.total}</div>
                </div>
              )}
              {n.pills && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {n.pills.map((p, k) => (
                    <span key={k} className="rounded-full border border-[#3f5b4a]/25 bg-[#3f5b4a]/[0.06] px-2 py-0.5 text-[10px] text-[#3f5b4a]">{p[lang]}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RetirementPlans({ locale = 'zh' }: { locale?: string }): ReactNode {
  const en = locale === 'en';
  const lang = en ? 'en' : 'zh';
  return (
    <div className="mt-6">
      {/* 对比柱状图 */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-card md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-base font-bold text-navy">{en ? 'Total return compared (same S$500k in)' : '两方案「保单总收益」对比（同样投入 $50 万）'}</h4>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#c9a55c]" />{en ? 'Plan 1' : '方案1'}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#3f5b4a]" />{en ? 'Plan 2' : '方案2'}</span>
          </div>
        </div>
        <div className="mt-4">
          <ComparisonBars en={en} />
        </div>
      </div>

      {/* 两个方案块 */}
      <div className="mt-5 space-y-5">
        {PLANS.map((plan, pi) => (
          <div key={pi} className="rounded-3xl border border-gold/20 bg-gradient-to-br from-sand-50 to-cream p-6 shadow-card md:p-7">
            <span className="inline-flex rounded-full bg-gold/12 px-3 py-1 text-xs font-bold text-gold-deep">{plan.tag[lang]}</span>
            <h4 className="mt-3 text-lg font-bold text-navy">{plan.title[lang]}</h4>
            <p className="mt-1 text-sm text-mist">{plan.invest[lang]}</p>

            {/* 两阶段逻辑 */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {plan.phases.map((ph, j) => (
                <div key={j} className="rounded-xl border border-gold/20 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-gold-deep">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    {ph.head[lang]}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {ph.items.map((it, k) => (
                      <li key={k} className="flex gap-2 text-xs leading-relaxed text-navy/75">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {it[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* 时间轴 */}
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-gold-deep">{en ? 'Retirement cash-flow timeline' : '退休现金流时间轴'}</p>
            <Timeline plan={plan} en={en} />

            {/* 关键数字 */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {plan.stats.map((st, j) => (
                <div key={j} className="rounded-xl border border-gold/20 bg-white p-4">
                  <div className="text-[11px] text-mist">{st.l[lang]}</div>
                  <div className="mt-1 text-lg font-black text-gold-deep">{st.v}</div>
                  <div className="mt-0.5 text-[11px] text-mist">{st.s[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-mist">
        {en
          ? 'Illustrative scenario for the “grow first / draw first” retirement logic only, not a guarantee of returns. Dividends are non-guaranteed; account values, payout, fees and switching are subject to the insurer’s official BI, product summary, fund performance and policy terms.'
          : '以上为「先成长 / 先领取」退休逻辑的情景测算，不构成保证收益承诺。分红为非保证部分；实际账户价值、派发、费用与转换以保险公司正式 BI、产品摘要、基金表现及保单条款为准。'}
      </p>
    </div>
  );
}
