'use client';

import { useMemo, useRef, useState } from 'react';
import {
  analyse,
  scenarios,
  SRS_AGES,
  SRS_CAP,
  type Assumptions,
  type Residency,
  type RetirementForm,
} from '@/lib/retirement';

/* ---------------------------------------------------------------- 工具函数 */

const sgd = (v: number) =>
  'S$' + Math.round(Math.max(0, v)).toLocaleString('en-SG');

/** 取整到百位,避免给出「精确到个位」的错觉 */
const sgd100 = (v: number) => sgd(Math.round(Math.max(0, v) / 100) * 100);

const compact = (v: number) => {
  const x = Math.max(0, v);
  if (x >= 1_000_000) return `S$${(x / 1_000_000).toFixed(2)}M`;
  if (x >= 1000) return `S$${Math.round(x / 1000)}K`;
  return sgd(x);
};

const num = (s: string) => {
  const v = Number(String(s).replace(/,/g, '').trim());
  return Number.isFinite(v) ? v : 0;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const LIFESTYLE = [
  { max: 3000, name: '轻盈安心', text: '日常有序,开支以基础生活为主' },
  { max: 5000, name: '安稳从容', text: '生活无忧,也保留兴趣和短途旅行' },
  { max: 8000, name: '舒适自在', text: '更从容地安排爱好、家人和旅行' },
  { max: 12_000, name: '品质自由', text: '生活选择更丰富,也有余力支持家人' },
  { max: Infinity, name: '丰盛有余', text: '兼顾高品质生活与长期传承安排' },
];
const lifestyleOf = (v: number) =>
  LIFESTYLE.find((l) => v < l.max) ?? LIFESTYLE[LIFESTYLE.length - 1];

const SERIES = {
  fixed: '#1a2744',
  srs: '#3a4d6e',
  other: '#a75a28',
  invest: '#c9a55c',
  surplus: '#e8d5a8',
};

/* ------------------------------------------------------------ 表单的原始值 */

type RawForm = {
  currentAge: string;
  retirementAge: string;
  planningAge: string;
  monthlyGoal: string;
  inflation: string;
  residency: Residency;
  investments: string;
  monthlyInvest: string;
  preReturn: string;
  srs: string;
  annualSrs: string;
  srsReturn: string;
  srsAge: number;
  fixedIncome: string;
  fixedIncomeStartAge: string;
  fixedIncomeEscalating: boolean;
  otherRetirementAssets: string;
  postReturn: string;
};

const BLANK: RawForm = {
  currentAge: '35',
  retirementAge: '60',
  planningAge: '95',
  monthlyGoal: '6000',
  inflation: '2.5',
  residency: 'citizenPr',
  investments: '0',
  monthlyInvest: '0',
  preReturn: '5',
  srs: '0',
  annualSrs: '0',
  srsReturn: '4',
  srsAge: 64,
  fixedIncome: '0',
  fixedIncomeStartAge: '65',
  fixedIncomeEscalating: false,
  otherRetirementAssets: '0',
  postReturn: '3',
};

const SAMPLE: RawForm = {
  ...BLANK,
  currentAge: '38',
  retirementAge: '60',
  monthlyGoal: '6500',
  investments: '180000',
  monthlyInvest: '2500',
  srs: '50000',
  annualSrs: '15300',
  fixedIncome: '2100',
  otherRetirementAssets: '100000',
};

/* ------------------------------------------------------------------ 主组件 */

export default function RetirementCalculator() {
  const [raw, setRaw] = useState<RawForm>(BLANK);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState<'idle' | 'done' | 'fallback'>('idle');
  const shellRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof RawForm>(key: K, value: RawForm[K]) =>
    setRaw((prev) => ({ ...prev, [key]: value }));

  /** 所有数值在这里统一夹取,输入框本身允许清空 */
  const form: RetirementForm = useMemo(() => {
    const currentAge = clamp(Math.round(num(raw.currentAge)), 18, 70);
    const retirementAge = clamp(Math.round(num(raw.retirementAge)), currentAge + 1, 75);
    const planningAge = clamp(Math.round(num(raw.planningAge)), retirementAge + 1, 110);
    const residency = raw.residency;
    return {
      currentAge,
      retirementAge,
      planningAge,
      monthlyGoal: clamp(num(raw.monthlyGoal), 0, 50_000),
      residency,
      investments: clamp(num(raw.investments), 0, 50_000_000),
      monthlyInvest: clamp(num(raw.monthlyInvest), 0, 200_000),
      srs: clamp(num(raw.srs), 0, 10_000_000),
      annualSrs: clamp(num(raw.annualSrs), 0, SRS_CAP[residency]),
      srsAge: raw.srsAge,
      fixedIncome: clamp(num(raw.fixedIncome), 0, 100_000),
      fixedIncomeStartAge: clamp(Math.round(num(raw.fixedIncomeStartAge)), 55, 75),
      fixedIncomeEscalating: raw.fixedIncomeEscalating,
      otherRetirementAssets: clamp(num(raw.otherRetirementAssets), 0, 50_000_000),
    };
  }, [raw]);

  const assumptions: Assumptions = useMemo(
    () => ({
      inflation: clamp(num(raw.inflation), 0, 8),
      preReturn: clamp(num(raw.preReturn), 0, 12),
      srsReturn: clamp(num(raw.srsReturn), 0, 10),
      postReturn: clamp(num(raw.postReturn), 0, 10),
    }),
    [raw.inflation, raw.preReturn, raw.srsReturn, raw.postReturn],
  );

  const runs = useMemo(
    () => scenarios(assumptions).map((s) => ({ ...s, result: analyse(form, s.assumptions) })),
    [form, assumptions],
  );
  const base = runs[1].result;

  /** 情景区间永远按大小排序,不假设「宽松一定更高」 */
  const spread = useMemo(() => {
    const vals = runs.map((r) => r.result.sustainableMonthly);
    return { low: Math.min(...vals), high: Math.max(...vals) };
  }, [runs]);

  /** 延后 3 年退休 */
  const delayed = useMemo(() => {
    const retirementAge = Math.min(75, form.retirementAge + 3);
    if (retirementAge === form.retirementAge) return null;
    return analyse(
      { ...form, retirementAge, planningAge: Math.max(retirementAge + 1, form.planningAge) },
      assumptions,
    );
  }, [form, assumptions]);

  const yearsToRetirement = form.retirementAge - form.currentAge;
  const goalAtRetirement =
    form.monthlyGoal * Math.pow(1 + assumptions.inflation / 100, yearsToRetirement);

  const readinessPct = clamp(Math.round(base.readiness), 0, 999);
  const ringPct = clamp(readinessPct, 0, 100);

  /** 输入是否有明显不合理之处(仅用于提示,计算已自动夹取) */
  const notes = useMemo(() => {
    const list: string[] = [];
    if (Math.round(num(raw.currentAge)) !== form.currentAge)
      list.push(`当前年龄按 18–70 岁处理,已取 ${form.currentAge} 岁。`);
    if (Math.round(num(raw.retirementAge)) !== form.retirementAge)
      list.push(`退休年龄需晚于当前年龄且不超过 75 岁,已取 ${form.retirementAge} 岁。`);
    if (Math.round(num(raw.planningAge)) !== form.planningAge)
      list.push(`规划年龄需晚于退休年龄,已取 ${form.planningAge} 岁。`);
    if (num(raw.annualSrs) > SRS_CAP[form.residency])
      list.push(
        `SRS 每年供款上限为 ${sgd(SRS_CAP[form.residency])}(${
          form.residency === 'citizenPr' ? '公民 / PR' : '外国人'
        }),已按上限计算。`,
      );
    if (form.srsAge - form.currentAge < 0 && form.annualSrs > 0)
      list.push('你已超过 SRS 提取年龄,达龄之后不能再供款,每年供款已不计入。');
    return list;
  }, [raw, form]);

  const summaryText = [
    '退休自由度测算 · 新加坡小圆姐',
    `目标:${form.retirementAge} 岁退休,相当于今天每月 ${sgd(form.monthlyGoal)} 的生活,规划到 ${form.planningAge} 岁`,
    `假设:通胀 ${assumptions.inflation}% | 退休前投资 ${assumptions.preReturn}% | SRS ${assumptions.srsReturn}% | 退休后 ${assumptions.postReturn}%`,
    `SRS 提取年龄 ${form.srsAge} 岁,分 ${base.srsSpreadYears} 年提取;固定收入自 ${form.fixedIncomeStartAge} 岁开始`,
    `基础情景:可支撑相当于今天 ${sgd100(base.sustainableMonthly)}/月,目标达成率 ${readinessPct}%`,
    `情景范围:${sgd100(spread.low)}–${sgd100(spread.high)}/月`,
    base.assetGap > 0
      ? `资产缺口 ${compact(base.assetGap)},约相当于每月多投入 ${sgd100(base.extraMonthlyNeeded)}`
      : '当前安排已覆盖目标。',
    '本结果仅作退休规划示意,不构成投资、税务或保险建议。',
  ].join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied('done');
      window.setTimeout(() => setCopied('idle'), 2400);
    } catch {
      // 微信内置浏览器等环境常常没有 clipboard 权限,给一个可长按复制的文本框
      setCopied('fallback');
    }
  };

  const goto = (n: number) => {
    setStep(n);
    window.requestAnimationFrame(() =>
      shellRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  return (
    <div ref={shellRef} className="container-wide py-12 md:py-16">
      {/* 步骤条 */}
      <ol className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2">
        {['退休目标', '现有准备', '查看结果'].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li key={label} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goto(n)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  active
                    ? 'border-navy bg-navy text-cream'
                    : done
                      ? 'border-gold/50 bg-gold/10 text-gold-deep'
                      : 'border-navy/15 bg-white text-mist hover:border-gold'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    active ? 'bg-gold text-navy' : done ? 'bg-gold/30 text-gold-deep' : 'bg-navy/10'
                  }`}
                >
                  {done ? '✓' : n}
                </span>
                {label}
              </button>
              {n < 3 ? <span aria-hidden className="hidden h-px w-6 bg-navy/15 sm:block" /> : null}
            </li>
          );
        })}
      </ol>

      {/* ============================================================ 第 1 步 */}
      {step === 1 ? (
        <div className="card p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">第 1 步</p>
              <h2 className="mt-2 text-xl font-black text-navy md:text-2xl">
                先定义你想要的退休生活
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                下面的金额都按<b className="text-navy">今天的购买力</b>填写,更容易判断。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRaw(SAMPLE)}
              className="rounded-lg border border-navy/20 px-3 py-1.5 text-xs font-semibold text-navy/70 transition-colors hover:border-gold hover:text-gold-deep"
            >
              加载示例
            </button>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <NumField
              label="你现在几岁"
              suffix="岁"
              value={raw.currentAge}
              onChange={(v) => set('currentAge', v)}
            />
            <NumField
              label="希望几岁退休"
              suffix="岁"
              value={raw.retirementAge}
              onChange={(v) => set('retirementAge', v)}
            />
            <NumField
              label="希望规划到几岁"
              help="家庭可按较年轻一方考虑"
              suffix="岁"
              value={raw.planningAge}
              onChange={(v) => set('planningAge', v)}
            />
            <NumField
              label="目标退休生活费"
              help="如果今天就退休,每月希望花多少"
              prefix="S$"
              suffix="/ 月"
              value={raw.monthlyGoal}
              onChange={(v) => set('monthlyGoal', v)}
            />
            <NumField
              label="长期通胀率"
              help="默认 2.5%,用于把今天的目标换算成未来金额"
              suffix="% / 年"
              value={raw.inflation}
              onChange={(v) => set('inflation', v)}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-navy/10 bg-sand-50 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-navy">目标生活方式</span>
              <span className="text-sm font-black text-gold-deep">
                {lifestyleOf(form.monthlyGoal).name}
              </span>
            </div>
            <input
              type="range"
              aria-label="调整理想退休生活费"
              min={2000}
              max={20_000}
              step={500}
              value={clamp(form.monthlyGoal, 2000, 20_000)}
              onChange={(e) => set('monthlyGoal', e.target.value)}
              className="mt-3 w-full accent-gold-deep"
            />
            <p className="mt-2 text-xs leading-relaxed text-mist">
              {lifestyleOf(form.monthlyGoal).text}
              {form.monthlyGoal > 20_000 ? '(超过滑块范围,以上方输入框为准)' : ''}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-gold/30 bg-gold/[0.06] p-5">
            <p className="text-sm font-bold text-navy">这里填的是今天的购买力</p>
            <p className="mt-1.5 text-sm leading-[1.9] text-mist">
              按每年 <b className="text-navy">{assumptions.inflation}%</b> 通胀,今天的{' '}
              <b className="text-navy">{sgd(form.monthlyGoal)}/月</b>,到{' '}
              <b className="text-navy">{form.retirementAge} 岁</b>时大约需要{' '}
              <b className="text-navy">{sgd100(goalAtRetirement)}/月</b> 才买得到同样的生活。
            </p>
          </div>

          <div className="mt-7 flex justify-end">
            <PrimaryButton onClick={() => goto(2)}>继续填写现有准备 →</PrimaryButton>
          </div>
        </div>
      ) : null}

      {/* ============================================================ 第 2 步 */}
      {step === 2 ? (
        <div className="card p-6 md:p-8">
          <p className="eyebrow">第 2 步</p>
          <h2 className="mt-2 text-xl font-black text-navy md:text-2xl">现在已经准备了多少</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            不确定的先留 0,方向对了再补细节。
          </p>

          {/* 身份 */}
          <SectionLabel title="身份" note="决定 SRS 每年的供款上限" />
          <div className="grid grid-cols-2 gap-2 sm:max-w-md">
            {(
              [
                ['citizenPr', '公民 / PR'],
                ['foreigner', '外国人(EP 等)'],
              ] as [Residency, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => set('residency', v)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                  raw.residency === v
                    ? 'border-navy bg-navy text-cream'
                    : 'border-navy/15 bg-white text-navy hover:border-gold'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 投资 */}
          <SectionLabel
            title="投资资产与持续投入"
            note={`不含 CPF、不含 SRS;默认按年化 ${assumptions.preReturn}% 增长`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <NumField
              label="现有投资资产"
              prefix="S$"
              value={raw.investments}
              onChange={(v) => set('investments', v)}
            />
            <NumField
              label="每月持续投入"
              help="预计持续到退休"
              prefix="S$"
              suffix="/ 月"
              value={raw.monthlyInvest}
              onChange={(v) => set('monthlyInvest', v)}
            />
            <NumField
              label="投资预计年化"
              help="0–12%"
              suffix="% / 年"
              value={raw.preReturn}
              onChange={(v) => set('preReturn', v)}
            />
          </div>

          {/* SRS */}
          <SectionLabel
            title="SRS 补充退休计划"
            note={`每年供款上限 ${sgd(SRS_CAP[form.residency])};达到提取年龄后不能再供款`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <NumField
              label="现有 SRS 余额"
              prefix="S$"
              value={raw.srs}
              onChange={(v) => set('srs', v)}
            />
            <NumField
              label="每年 SRS 供款"
              help={`上限 ${sgd(SRS_CAP[form.residency])}`}
              prefix="S$"
              suffix="/ 年"
              value={raw.annualSrs}
              onChange={(v) => set('annualSrs', v)}
            />
            <NumField
              label="SRS 预计年化"
              help="账户里的钱如何投资,决定这个数字"
              suffix="% / 年"
              value={raw.srsReturn}
              onChange={(v) => set('srsReturn', v)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-gold/40 bg-gold/[0.07] p-5">
            <p className="text-sm font-bold text-navy">你的 SRS 提取年龄</p>
            <p className="mt-1.5 text-sm leading-[1.9] text-mist">
              SRS 的提取年龄<b className="text-navy">锁定在你第一次供款那一年的法定退休年龄</b>,之后不会再变。
              2022 年 7 月前首次供款 = 62 岁;2022 年 7 月至 2026 年 6 月 = 63 岁;2026 年 7 月起首次供款 = 64 岁。
              在提取年龄之前取钱,要罚 5% 本金,而且全额计入应税收入 —— 所以本工具默认<b className="text-navy">不做提前提取</b>,
              达龄之前 SRS 不计入可用退休金。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SRS_AGES.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => set('srsAge', age)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    raw.srsAge === age
                      ? 'border-navy bg-navy text-cream'
                      : 'border-navy/15 bg-white text-navy hover:border-gold'
                  }`}
                >
                  {age} 岁
                </button>
              ))}
            </div>
          </div>

          {/* 退休收入 */}
          <SectionLabel
            title="退休期固定收入"
            note="CPF LIFE、年金、租金等合计,按开始领取时的未来月金额填写"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <NumField
              label="预计固定月收入"
              help="不确定 CPF LIFE 能领多少?用官方估算器算一下"
              prefix="S$"
              suffix="/ 月"
              value={raw.fixedIncome}
              onChange={(v) => set('fixedIncome', v)}
            />
            <NumField
              label="从几岁开始领"
              help="CPF LIFE 最早 65 岁,最晚可推到 70 岁"
              suffix="岁"
              value={raw.fixedIncomeStartAge}
              onChange={(v) => set('fixedIncomeStartAge', v)}
            />
            <NumField
              label="退休时其他可用资产"
              help="保单满期金、计划变现的资产等;请勿把 CPF RA 填在这里"
              prefix="S$"
              value={raw.otherRetirementAssets}
              onChange={(v) => set('otherRetirementAssets', v)}
            />
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-navy/10 bg-white p-4">
            <input
              type="checkbox"
              checked={raw.fixedIncomeEscalating}
              onChange={(e) => set('fixedIncomeEscalating', e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-gold-deep"
            />
            <span className="text-sm leading-relaxed text-mist">
              <b className="text-navy">这笔收入每年递增 2%</b>
              (CPF LIFE 递增计划 Escalating Plan)。不勾选则按固定金额发放,
              也就是购买力会被通胀慢慢磨掉 —— CPF LIFE 标准计划就是这样。
            </span>
          </label>

          <a
            href="https://www.cpf.gov.sg/member/tools-and-services/calculators/monthly-payout-estimator"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-deep no-underline hover:underline"
          >
            打开 CPF 官方退休月入估算器 ↗
          </a>

          {/* 高级 */}
          <details className="mt-6 rounded-2xl border border-navy/10 bg-sand-50 p-5">
            <summary className="cursor-pointer text-sm font-bold text-navy">
              高级假设 <span className="font-normal text-mist">· 已有默认值,不懂可以不改</span>
            </summary>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <NumField
                label="退休后资产回报"
                help="退休之后配置通常更保守,默认 3%"
                suffix="% / 年"
                value={raw.postReturn}
                onChange={(v) => set('postReturn', v)}
              />
            </div>
          </details>

          {notes.length ? (
            <ul className="mt-5 space-y-1.5 rounded-2xl border border-gold/40 bg-gold/[0.07] p-4 text-xs leading-relaxed text-navy/75">
              {notes.map((n) => (
                <li key={n}>· {n}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-7 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => goto(1)}
              className="rounded-xl border border-navy/20 px-5 py-3 text-sm font-semibold text-navy/75 transition-colors hover:border-gold hover:text-gold-deep"
            >
              ← 返回修改目标
            </button>
            <PrimaryButton onClick={() => goto(3)}>查看我的测算结果 →</PrimaryButton>
          </div>
        </div>
      ) : null}

      {/* ============================================================ 第 3 步 */}
      {step === 3 ? (
        <div className="space-y-6" aria-live="polite">
          {/* 头条 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-deep p-7 text-cream md:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-gold/20"
            />
            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="eyebrow text-gold-light">你的退休准备度</p>
                <p className="mt-3 text-sm text-cream/70">基础情景下,预计可以支撑相当于今天</p>
                <p className="mt-1 text-4xl font-black text-gold-light md:text-5xl">
                  {sgd100(base.sustainableMonthly)}
                  <span className="text-xl font-bold text-cream/60"> / 月</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">
                  不同市场与通胀情景下,合理观察范围约为{' '}
                  <b className="text-cream">
                    {sgd100(spread.low)}–{sgd100(spread.high)}/月
                  </b>
                  。
                </p>
                <span className="mt-4 inline-block rounded-full border border-gold/40 px-4 py-1.5 text-xs font-semibold text-gold-light">
                  {lifestyleOf(base.sustainableMonthly).name} ·{' '}
                  {lifestyleOf(base.sustainableMonthly).text}
                </span>
              </div>
              <div className="shrink-0">
                <div
                  className="flex h-36 w-36 items-center justify-center rounded-full md:h-40 md:w-40"
                  style={{
                    background: `conic-gradient(#c9a55c ${ringPct * 3.6}deg, rgba(250,247,240,0.16) 0deg)`,
                  }}
                >
                  <div className="flex h-[76%] w-[76%] flex-col items-center justify-center rounded-full bg-navy-deep">
                    <strong className="text-2xl font-black text-gold-light md:text-3xl">
                      {readinessPct}%
                    </strong>
                    <span className="mt-0.5 text-[11px] text-cream/60">目标达成率</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 断档警告 */}
          {base.bridge && (base.bridge.shortfallAge !== null || base.liquidityCost > 20) ? (
            <div className="rounded-2xl border-2 border-gold bg-gold/[0.09] p-6">
              <p className="text-base font-black text-navy">
                ⚠ 提前退休 + SRS 锁定,中间这段会缺现金
              </p>
              <p className="mt-2.5 text-sm leading-[1.95] text-navy/75">
                你计划 <b>{form.retirementAge} 岁</b>退休,但 SRS 要到{' '}
                <b>{form.srsAge} 岁</b>才能免罚提取
                {form.fixedIncome > 0 ? (
                  <>
                    ,固定收入要到 <b>{form.fixedIncomeStartAge} 岁</b>才开始
                  </>
                ) : null}
                。中间这 <b>{base.bridge.years} 年</b>,
                <b>{compact(base.bridge.lockedAmount)}</b> 的 SRS 是动不了的,全靠其他资产过桥。
                {base.bridge.shortfallAge !== null ? (
                  <>
                    {' '}
                    按你的目标生活费,资金会在 <b>{base.bridge.shortfallAge} 岁</b>就断掉。
                  </>
                ) : null}
              </p>
              {base.liquidityCost > 20 ? (
                <p className="mt-2.5 text-sm leading-[1.95] text-navy/75">
                  如果只看「一辈子总量够不够」,这笔钱能支撑{' '}
                  <b>{sgd100(base.sustainableIdeal)}/月</b>;但要求
                  <b>每一年现金都够用</b>,就只剩 <b>{sgd100(base.sustainableMonthly)}/月</b> ——
                  差的 <b>{sgd100(base.liquidityCost)}/月</b> 就是提取年龄限制的代价。
                </p>
              ) : null}
              <p className="mt-2.5 text-sm leading-[1.95] text-navy/75">
                常见的解法:把过桥这几年的钱单独放在流动性好的地方,或者把退休年龄往后挪一点,
                或者用一份能在这段时间产生现金流的安排把缺口补上。
              </p>
            </div>
          ) : null}

          {/* 三情景 */}
          <div className="grid gap-4 md:grid-cols-3">
            {runs.map((r) => {
              const isBase = r.key === 'base';
              return (
                <div
                  key={r.key}
                  className={`card p-5 ${isBase ? 'border-gold/50 bg-gold/[0.06]' : ''}`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-bold text-navy">{r.name}</p>
                    {isBase ? <span className="eyebrow">主要参考</span> : null}
                  </div>
                  <p className="mt-2 text-2xl font-black text-navy">
                    {sgd100(r.result.sustainableMonthly)}
                    <span className="text-sm font-bold text-mist">/月</span>
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-mist">{r.note}</p>
                  <p className="mt-3 text-xs text-mist">
                    达成率{' '}
                    <b className="text-gold-deep">{clamp(Math.round(r.result.readiness), 0, 999)}%</b>
                  </p>
                </div>
              );
            })}
          </div>

          {/* 退休后现金流 */}
          <div className="card p-6 md:p-8">
            <p className="eyebrow">RETIREMENT CASH FLOW · 今日购买力</p>
            <h3 className="mt-2 text-lg font-black text-navy md:text-xl">
              退休后每一年,钱从哪里来
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              按你填的目标生活费逐年模拟。留意 <b className="text-navy">{base.srsStartAge} 岁</b>
              才出现的 SRS 色块 —— 在那之前它一分钱都用不上。
            </p>
            <CashflowChart form={form} analysis={base} inflation={assumptions.inflation} />
            <Legend
              items={[
                ['固定收入', SERIES.fixed],
                ['SRS 提取(税后)', SERIES.srs],
                ['动用投资资产', SERIES.invest],
                ['当年结余', SERIES.surplus],
                ...(base.goalRun.ok
                  ? []
                  : ([['浅色底纹 = 投资资产已用完', '#a8843f22']] as [string, string][])),
              ]}
            />
            <p className="mt-4 text-sm leading-[1.9] text-mist">
              {base.goalRun.ok ? (
                <>按目标生活费,资金可以支撑到 {form.planningAge} 岁。</>
              ) : (
                <>
                  按目标生活费,投资资产会在 <b className="text-navy">{base.goalRun.shortfallAge} 岁</b>
                  用完 —— 距离你规划的 {form.planningAge} 岁还差{' '}
                  <b className="text-navy">{form.planningAge - base.goalRun.shortfallAge!} 年</b>
                  ,那之后只剩固定收入可用。
                </>
              )}
            </p>
          </div>

          {/* 组成拆解 */}
          <div className="card p-6 md:p-8">
            <p className="eyebrow">LIFESTYLE LADDER · 今日购买力 / 月</p>
            <h3 className="mt-2 text-lg font-black text-navy md:text-xl">
              这 {sgd100(base.sustainableMonthly)}/月,是谁供出来的
            </h3>
            <LadderChart
              breakdown={base.breakdown}
              total={base.sustainableMonthly}
              goal={form.monthlyGoal}
            />
            <Legend
              items={base.breakdown.map(
                (b) => [b.label, SERIES[b.key as keyof typeof SERIES]] as [string, string],
              )}
            />
            {form.fixedIncome > 0 ? (
              <p className="mt-5 rounded-xl border border-navy/10 bg-sand-50 p-4 text-sm leading-[1.9] text-mist">
                <b className="text-navy">为什么固定收入这一段比我填的少?</b>{' '}
                你填的 {sgd(form.fixedIncome)}/月 是 {form.fixedIncomeStartAge}{' '}
                岁开始领的未来金额
                {form.fixedIncomeEscalating ? '(每年递增 2%)' : '(金额固定不变)'}
                。这里显示的是把它折算成<b className="text-navy">今天的购买力</b>、
                并摊到 {form.retirementAge}–{form.planningAge} 岁整段退休期之后的等价月额 ——
                所以数字会明显更小,这是通胀和「前几年还没开始领」共同造成的。
              </p>
            ) : null}
          </div>

          {/* 积累路径 */}
          <div className="card p-6 md:p-8">
            <p className="eyebrow">PATH TO RETIREMENT · 未来金额</p>
            <h3 className="mt-2 text-lg font-black text-navy md:text-xl">从今天到退休日</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              投资年化 {assumptions.preReturn}% · SRS 年化 {assumptions.srsReturn}%
              {base.srsContribYears < base.yearsToRetirement && form.annualSrs > 0 ? (
                <>
                  {' '}
                  · SRS 供款只算到 <b className="text-navy">{form.srsAge} 岁</b>为止(共{' '}
                  {base.srsContribYears} 年)
                </>
              ) : null}
            </p>
            <AccumulationChart data={base.accumulation} />
            <Legend
              items={[
                ['投资资产', SERIES.invest],
                ['SRS', SERIES.srs],
                ['其他资产(退休当年)', SERIES.other],
              ]}
            />
            <p className="mt-4 text-sm leading-[1.9] text-mist">
              到 {form.retirementAge} 岁,预计名下资产合计约{' '}
              <b className="text-navy">{compact(base.availableAtRetirement)}</b>,其中 SRS{' '}
              <b className="text-navy">{compact(base.srsAtRetirement)}</b> 要等到{' '}
              {base.srsStartAge} 岁才开始分 {base.srsSpreadYears} 年提取。
            </p>
          </div>

          {/* 三个杠杆 */}
          <div className="grid gap-4 md:grid-cols-3">
            <LeverCard
              index="01"
              title="增加每月投入"
              value={
                base.assetGap <= 0
                  ? '暂时不需要'
                  : base.extraMonthlyNeeded > 20_000
                    ? '光靠加投补不上'
                    : `每月 +${sgd100(base.extraMonthlyNeeded)}`
              }
              text={
                base.assetGap <= 0
                  ? '基础情景下,当前安排已经覆盖目标。'
                  : base.extraMonthlyNeeded > 20_000
                    ? `退休时还差 ${compact(base.assetGap)},但离退休只剩 ${base.yearsToRetirement} 年,平摊下来每月要多投 ${sgd100(base.extraMonthlyNeeded)} —— 这个量级通常不现实。更实际的方向是调整退休年龄或重新看生活目标。`
                    : `退休时还差 ${compact(base.assetGap)}。按 ${assumptions.preReturn}% 年化,从现在起每月多投入这个数,可以补上。`
              }
            />
            <LeverCard
              index="02"
              title="把退休推迟 3 年"
              value={
                delayed
                  ? `达成率约 ${clamp(Math.round(delayed.readiness), 0, 999)}%`
                  : '已到年龄上限'
              }
              text={
                delayed
                  ? `${form.retirementAge + 3} 岁退休:多攒 3 年,少花 3 年,而且更接近 SRS 的 ${form.srsAge} 岁提取年龄。`
                  : '退休年龄已经到 75 岁上限。'
              }
            />
            <LeverCard
              index="03"
              title="重新看生活目标"
              value={lifestyleOf(base.sustainableMonthly).name}
              text="把住房、旅行、医疗和支持家人的预算拆开看,会比一个总数更准确。"
            />
          </div>

          {/* 关键数字 */}
          <div className="card p-6 md:p-8">
            <h3 className="text-lg font-black text-navy md:text-xl">关键数字</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label={`${form.retirementAge} 岁时名下资产`} value={compact(base.availableAtRetirement)} />
              <Metric label="其中 SRS(锁到提取年龄)" value={compact(base.srsAtRetirement)} />
              <Metric
                label="资产缺口"
                value={base.assetGap > 0 ? compact(base.assetGap) : '已覆盖'}
                highlight={base.assetGap > 0}
              />
              <Metric
                label="目标生活费(退休时)"
                value={`${sgd100(goalAtRetirement)}/月`}
              />
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border border-navy/10">
              <Line label="SRS 提取安排" value={`${base.srsStartAge} 岁起,分 ${base.srsSpreadYears} 年`} />
              <Line
                label="SRS 供款年数"
                value={`${base.srsContribYears} 年(缴到 ${form.srsAge} 岁为止)`}
              />
              <Line
                label="固定收入开始年龄"
                value={`${form.fixedIncomeStartAge} 岁${form.fixedIncomeEscalating ? ' · 每年递增 2%' : ' · 金额固定'}`}
              />
              <Line
                label="退休期长度"
                value={`${form.planningAge - form.retirementAge} 年(${form.retirementAge}–${form.planningAge} 岁)`}
              />
            </div>
          </div>

          {/* 保存 */}
          <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-deep p-7 text-cream md:p-8">
            <p className="eyebrow text-gold-light">下一步</p>
            <h3 className="mt-2 text-lg font-black md:text-xl">先保存这份方向,再慢慢把细节补齐</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/70">
              正式的退休规划还要考虑住房、医疗与长期护理、税务、投资费用、回报顺序风险和家庭现金流。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy transition-all hover:bg-gold-light"
              >
                {copied === 'done' ? '已复制 ✓' : '复制测算摘要'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition-all hover:border-gold hover:text-gold-light"
              >
                打印 / 存成 PDF
              </button>
              <button
                type="button"
                onClick={() => goto(2)}
                className="rounded-xl border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition-all hover:border-gold hover:text-gold-light"
              >
                返回修改
              </button>
            </div>
            {copied === 'fallback' ? (
              <div className="mt-4">
                <p className="text-xs text-cream/70">
                  当前浏览器不允许自动复制(微信内置浏览器常见)。请长按下方文字手动复制:
                </p>
                <textarea
                  readOnly
                  value={summaryText}
                  rows={8}
                  onFocus={(e) => e.currentTarget.select()}
                  className="mt-2 w-full rounded-xl border border-cream/20 bg-navy-deep/60 p-3 text-xs leading-relaxed text-cream/90 outline-none"
                />
              </div>
            ) : null}
          </div>

          <p className="border-t border-navy/10 pt-6 text-xs leading-[1.9] text-mist">
            <b className="text-navy">重要说明:</b>{' '}
            本工具用单一假设路径加三种示意情景做估算,仅用于退休教育与方向讨论,
            并非收益保证、产品推荐,也不构成投资、税务或法律建议。
            模型已计入 SRS 的提取年龄、10 年分摊提取与 50% 计入应税收入,以及固定收入的开始年龄;
            但未完整计入投资费用、回报顺序风险、医疗与长期护理开支、房产与遗产安排,
            也未考虑 CPF 账户内部(OA / SA / RA)的实际运作与 CPF LIFE 的具体保费与派息机制。
            CPF、SRS 与任何保单的数值,请以 CPF Board、IRAS 及相关产品文件为准。正式行动前请结合个人情况完成完整评估。
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------- 图表 */

const CHART_W = 900;

/** 均匀取刻度,并保证末尾那一格不会和前一格挤在一起 */
function axisTicks(count: number, every: number): number[] {
  const last = count - 1;
  const ticks: number[] = [];
  for (let i = 0; i < last; i += every) ticks.push(i);
  const prev = ticks[ticks.length - 1] ?? -every;
  if (last - prev < every * 0.6) ticks.pop();
  ticks.push(last);
  return ticks;
}

function CashflowChart({
  form,
  analysis,
  inflation,
}: {
  form: RetirementForm;
  analysis: ReturnType<typeof analyse>;
  inflation: number;
}) {
  const H = 300;
  const padL = 62;
  const padR = 16;
  const padT = 16;
  const padB = 34;

  const rows = analysis.goalRun.rows;
  if (!rows.length) return null;

  // 全部折算成今天的购买力
  const data = rows.map((r) => {
    const defl = Math.pow(1 + inflation / 100, r.age - form.currentAge);
    const spend = r.spend / defl;
    const fixed = r.fixedIncome / defl;
    const srs = r.srsNet / defl;
    const income = fixed + srs;
    return {
      age: r.age,
      spend,
      fixed,
      srs,
      assets: Math.max(0, spend - income),
      surplus: Math.max(0, income - spend),
      broken: r.liquidEnd < -0.5,
    };
  });

  const maxV = Math.max(...data.map((d) => Math.max(d.spend, d.fixed + d.srs))) * 1.08 || 1;
  const innerW = CHART_W - padL - padR;
  const innerH = H - padT - padB;
  const bw = innerW / data.length;
  const x = (i: number) => padL + i * bw;
  const y = (v: number) => padT + innerH - (v / maxV) * innerH;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV);
  const labelEvery = Math.ceil(data.length / 12);

  return (
    <div className="mt-6 -mx-2 overflow-x-auto px-2">
      <svg
        viewBox={`0 0 ${CHART_W} ${H}`}
        className="h-auto w-full min-w-[520px]"
        role="img"
        aria-label="退休后每年现金来源构成"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={CHART_W - padR} y1={y(t)} y2={y(t)} stroke="#1a274414" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#7a7264">
              {compact(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const gap = Math.min(2.5, bw * 0.16);
          const w = Math.max(1, bw - gap);
          let cursor = 0;
          const seg = (v: number, color: string, key: string) => {
            if (v <= 0) return null;
            const h = (v / maxV) * innerH;
            const yy = y(cursor + v);
            cursor += v;
            return <rect key={key} x={x(i)} y={yy} width={w} height={h} fill={color} />;
          };
          return (
            <g key={d.age}>
              {seg(d.fixed, SERIES.fixed, 'f')}
              {seg(d.srs, SERIES.srs, 's')}
              {seg(d.assets, SERIES.invest, 'a')}
              {seg(d.surplus, SERIES.surplus, 'p')}
              {d.broken ? (
                <rect
                  x={x(i)}
                  y={padT}
                  width={w}
                  height={innerH}
                  fill="#a8843f"
                  opacity={0.09}
                />
              ) : null}
            </g>
          );
        })}

        {/* 目标支出线 */}
        <path
          d={data
            .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i) + bw / 2},${y(d.spend)}`)
            .join(' ')}
          fill="none"
          stroke="#2a2620"
          strokeWidth="1.6"
          strokeDasharray="5 4"
        />

        {/* SRS 起点标注 */}
        {(() => {
          const idx = data.findIndex((d) => d.srs > 0);
          if (idx <= 0) return null;
          const px = x(idx);
          return (
            <g>
              <line x1={px} x2={px} y1={padT} y2={padT + innerH} stroke="#a8843f" strokeWidth="1.4" />
              <text
                x={px + 6}
                y={padT + 14}
                fontSize="13"
                fontWeight="700"
                fill="#a8843f"
              >
                {data[idx].age} 岁 · SRS 解锁
              </text>
            </g>
          );
        })()}

        <line x1={padL} x2={CHART_W - padR} y1={padT + innerH} y2={padT + innerH} stroke="#1a274426" />
        {axisTicks(data.length, labelEvery).map((i) => (
          <text
            key={data[i].age}
            x={x(i) + bw / 2}
            y={H - 12}
            textAnchor="middle"
            fontSize="12"
            fill="#7a7264"
          >
            {data[i].age}
          </text>
        ))}
      </svg>
    </div>
  );
}

function LadderChart({
  breakdown,
  total,
  goal,
}: {
  breakdown: { key: string; label: string; value: number }[];
  total: number;
  goal: number;
}) {
  const H = 132;
  const padL = 10;
  const padR = 10;
  const scaleMax = Math.max(total, goal) * 1.25 || 1;
  const innerW = CHART_W - padL - padR;
  const w = (v: number) => (v / scaleMax) * innerW;

  let cursor = 0;
  const barY = 46;
  const barH = 42;
  const goalX = padL + w(goal);

  return (
    <div className="mt-6 -mx-2 overflow-x-auto px-2">
      <svg
        viewBox={`0 0 ${CHART_W} ${H}`}
        className="h-auto w-full min-w-[420px]"
        role="img"
        aria-label="可支撑月支出的来源拆解"
      >
        <rect x={padL} y={barY} width={innerW} height={barH} rx="8" fill="#1a27440d" />
        {breakdown.map((b) => {
          if (b.value <= 0) return null;
          const xx = padL + w(cursor);
          const ww = w(b.value);
          cursor += b.value;
          return (
            <rect
              key={b.key}
              x={xx}
              y={barY}
              width={ww}
              height={barH}
              fill={SERIES[b.key as keyof typeof SERIES]}
            />
          );
        })}

        <text x={padL} y={barY - 12} fontSize="15" fontWeight="700" fill="#1a2744">
          可支撑 {sgd100(total)}/月
        </text>

        <line
          x1={goalX}
          x2={goalX}
          y1={barY - 6}
          y2={barY + barH + 8}
          stroke="#2a2620"
          strokeWidth="1.8"
          strokeDasharray="5 4"
        />
        <text
          x={Math.min(goalX + 8, CHART_W - 190)}
          y={barY + barH + 24}
          fontSize="13"
          fontWeight="700"
          fill="#2a2620"
        >
          目标 {sgd100(goal)}/月
        </text>
      </svg>
    </div>
  );
}

function AccumulationChart({
  data,
}: {
  data: { age: number; invest: number; srs: number; other: number }[];
}) {
  const H = 260;
  const padL = 62;
  const padR = 16;
  const padT = 16;
  const padB = 34;
  if (!data.length) return null;

  const maxV = Math.max(...data.map((d) => d.invest + d.srs + d.other)) * 1.08 || 1;
  const innerW = CHART_W - padL - padR;
  const innerH = H - padT - padB;
  const bw = innerW / data.length;
  const x = (i: number) => padL + i * bw;
  const y = (v: number) => padT + innerH - (v / maxV) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV);
  const labelEvery = Math.ceil(data.length / 10);

  return (
    <div className="mt-6 -mx-2 overflow-x-auto px-2">
      <svg
        viewBox={`0 0 ${CHART_W} ${H}`}
        className="h-auto w-full min-w-[520px]"
        role="img"
        aria-label="从现在到退休的资产积累路径"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={CHART_W - padR} y1={y(t)} y2={y(t)} stroke="#1a274414" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#7a7264">
              {compact(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const gap = Math.min(2.5, bw * 0.16);
          const w = Math.max(1, bw - gap);
          let cursor = 0;
          const seg = (v: number, color: string, key: string) => {
            if (v <= 0) return null;
            const h = (v / maxV) * innerH;
            const yy = y(cursor + v);
            cursor += v;
            return <rect key={key} x={x(i)} y={yy} width={w} height={h} fill={color} />;
          };
          return (
            <g key={d.age}>
              {seg(d.invest, SERIES.invest, 'i')}
              {seg(d.srs, SERIES.srs, 's')}
              {seg(d.other, SERIES.other, 'o')}
            </g>
          );
        })}
        <line x1={padL} x2={CHART_W - padR} y1={padT + innerH} y2={padT + innerH} stroke="#1a274426" />
        {axisTicks(data.length, labelEvery).map((i) => (
          <text
            key={data[i].age}
            x={x(i) + bw / 2}
            y={H - 12}
            textAnchor="middle"
            fontSize="12"
            fill="#7a7264"
          >
            {data[i].age}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------- 小组件们 */

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {items.map(([label, color]) => (
        <span key={label} className="flex items-center gap-2 text-xs text-mist">
          <i className="h-3 w-3 shrink-0 rounded-sm" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

function SectionLabel({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-4 mt-8 border-t border-navy/10 pt-6">
      <p className="text-sm font-black text-navy">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-mist">{note}</p>
    </div>
  );
}

function NumField({
  label,
  help,
  prefix,
  suffix,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-navy">{label}</label>
      {help ? <p className="mt-1 text-xs leading-relaxed text-mist">{help}</p> : null}
      <div className="mt-2 flex items-center rounded-xl border border-navy/15 bg-white transition-colors focus-within:border-gold">
        {prefix ? <span className="pl-3.5 text-sm font-bold text-mist">{prefix}</span> : null}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent px-2.5 py-3 text-base font-bold text-navy outline-none"
        />
        {suffix ? <span className="pr-3.5 text-sm font-bold text-mist">{suffix}</span> : null}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? 'border-gold/40 bg-gold/5' : 'border-navy/10 bg-white'
      }`}
    >
      <p className="text-xs leading-relaxed text-mist">{label}</p>
      <p className="mt-1.5 text-lg font-black text-navy">{value}</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-navy/10 px-4 py-3 last:border-0">
      <span className="text-sm text-mist">{label}</span>
      <span className="text-right text-sm font-bold text-navy">{value}</span>
    </div>
  );
}

function LeverCard({
  index,
  title,
  value,
  text,
}: {
  index: string;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="card p-6">
      <p className="eyebrow">{index}</p>
      <p className="mt-2 text-base font-black text-navy">{title}</p>
      <p className="mt-1.5 text-sm font-bold text-gold-deep">{value}</p>
      <p className="mt-3 text-sm leading-[1.9] text-mist">{text}</p>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-navy px-6 py-3.5 text-sm font-bold text-cream transition-all duration-300 hover:bg-navy-700 hover:shadow-cardHover"
    >
      {children}
    </button>
  );
}
