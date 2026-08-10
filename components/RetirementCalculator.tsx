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

/* --------------------------------------------------------------- 样式常量 */

/** 主面板:大圆角 + 大留白 + 很淡的落地阴影 */
const PANEL =
  'rounded-[22px] border border-navy/10 bg-[#fffdf9] p-6 shadow-[0_24px_70px_-30px_rgba(26,39,68,0.28)] sm:p-8 md:p-11';

/** 结果区的次级卡片 */
const SUBCARD = 'rounded-[18px] border border-navy/10 bg-[#fffdf9] p-6 sm:p-7';

/** 小的金色描边按钮,用于「修改资料」这类回跳 */
const CHIP_BUTTON =
  'inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border border-gold/45 bg-gold/[0.07] px-3.5 py-2 text-xs font-bold text-gold-deep transition-all duration-200 hover:-translate-y-px hover:border-gold hover:bg-gold/15';

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
    <div ref={shellRef} className="container-wide py-10 md:py-14">
      {/* 信任行 */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-mist">
        <span>无需留下联系方式</span>
        <i aria-hidden className="h-1 w-1 rounded-full bg-gold/60" />
        <span>数据只在你的浏览器里计算</span>
        <i aria-hidden className="h-1 w-1 rounded-full bg-gold/60" />
        <span>约 3 分钟</span>
      </div>

      {/* 步骤条 */}
      <ol className="relative mx-auto mb-9 grid max-w-[680px] grid-cols-3">
        {/*
          连接三个圆点的轨道。必须套一层普通 div:
          栅格容器里的绝对定位子元素,百分比宽度会解析成 0
          (只有同时给 left 和 right 才算得出来),套一层就恢复正常了。
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[21px] h-[2px]"
        >
          {/* 底轨:第 1 个圆心 → 第 3 个圆心(三等分栅格 = 16.667% ~ 83.333%) */}
          <div className="absolute left-[16.667%] right-[16.667%] h-full rounded-full bg-navy/[0.13]" />
          {/*
            已走过的部分。宽度写死成整条轨道,用 scaleX 表示进度。
            这里刻意不加过渡:页面被浏览器节流时 CSS 过渡会卡在起始值,
            那样整条金线就直接不显示了 —— 连上线比动画重要。
          */}
          <div
            className="absolute left-[16.667%] h-full w-[66.667%] origin-left rounded-full bg-gold"
            style={{ transform: `scaleX(${(step - 1) / 2})` }}
          />
        </div>
        {['退休目标', '现有准备', '查看结果'].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li key={label} className="relative z-10 flex justify-center">
              <button
                type="button"
                onClick={() => goto(n)}
                aria-current={active ? 'step' : undefined}
                className="group flex flex-col items-center gap-2.5 px-2"
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full border text-[13px] font-bold transition-all duration-300 ${
                    active
                      ? 'border-gold bg-white text-gold-deep shadow-[0_0_0_5px_rgba(201,165,92,0.13)]'
                      : done
                        ? 'border-navy bg-navy text-cream'
                        : 'border-navy/15 bg-sand-50 text-mist group-hover:border-gold/60'
                  }`}
                >
                  {done ? '✓' : n}
                </span>
                <b
                  className={`text-[12.5px] font-semibold transition-colors duration-300 ${
                    active ? 'text-navy' : done ? 'text-gold-deep' : 'text-mist'
                  }`}
                >
                  {label}
                </b>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ============================================================ 第 1 步 */}
      {step === 1 ? (
        <div className={PANEL}>
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
            <div>
              <p className="eyebrow">第 1 步</p>
              <h2 className="mt-2 text-[26px] font-black leading-[1.25] tracking-[-0.025em] text-navy md:text-[34px]">
                先定义你想要的退休生活
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-mist">
                下面的金额都按<b className="text-navy">今天的购买力</b>填写,更容易判断。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRaw(SAMPLE)}
              className="shrink-0 whitespace-nowrap border-b border-gold/45 pb-1.5 text-[13px] font-semibold text-gold-deep transition-colors hover:border-gold"
            >
              加载示例
            </button>
          </div>

          <div className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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

          <div className="mt-7 rounded-2xl border border-navy/[0.09] bg-sand-50 px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-mist">目标生活方式</span>
              <strong className="text-sm font-bold text-gold-deep">
                {lifestyleOf(form.monthlyGoal).name}
              </strong>
            </div>
            <input
              type="range"
              aria-label="调整理想退休生活费"
              min={2000}
              max={20_000}
              step={500}
              value={clamp(form.monthlyGoal, 2000, 20_000)}
              onChange={(e) => set('monthlyGoal', e.target.value)}
              className="my-4 w-full accent-gold-deep"
            />
            <p className="text-right text-xs leading-relaxed text-mist">
              {lifestyleOf(form.monthlyGoal).text}
              {form.monthlyGoal > 20_000 ? '(超过滑块范围,以上方输入框为准)' : ''}
            </p>
          </div>

          <Callout title="这里填的是今天的购买力">
            按每年 <b className="text-gold-deep">{assumptions.inflation}%</b> 通胀,今天的{' '}
            <b className="text-navy">{sgd(form.monthlyGoal)}/月</b>,到{' '}
            <b className="text-navy">{form.retirementAge} 岁</b>时大约需要{' '}
            <b className="text-navy">{sgd100(goalAtRetirement)}/月</b> 才买得到同样的生活。
          </Callout>

          <div className="mt-10 flex justify-end">
            <PrimaryButton onClick={() => goto(2)}>继续填写现有准备 →</PrimaryButton>
          </div>
        </div>
      ) : null}

      {/* ============================================================ 第 2 步 */}
      {step === 2 ? (
        <div className={PANEL}>
          <p className="eyebrow">第 2 步</p>
          <h2 className="mt-2 text-[26px] font-black leading-[1.25] tracking-[-0.025em] text-navy md:text-[34px]">
            现在已经准备了多少
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-mist">
            不确定的先留空,方向对了再补细节。
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
                className={`min-h-[52px] rounded-xl border px-3 text-sm font-semibold transition-all duration-200 ${
                  raw.residency === v
                    ? 'border-navy bg-navy text-cream shadow-[0_8px_20px_-10px_rgba(26,39,68,0.6)]'
                    : 'border-navy/15 bg-white text-navy hover:border-gold hover:bg-gold/[0.05]'
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
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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

          <Callout title="你的 SRS 提取年龄" tone="strong">
            SRS 的提取年龄<b className="text-navy">锁定在你第一次供款那一年的法定退休年龄</b>,之后不会再变。
            2022 年 7 月前首次供款 = 62 岁;2022 年 7 月至 2026 年 6 月 = 63 岁;2026 年 7 月起首次供款 = 64 岁。
            在提取年龄之前取钱,要罚 5% 本金,而且全额计入应税收入 —— 所以本工具默认
            <b className="text-navy">不做提前提取</b>,达龄之前 SRS 不计入可用退休金。
            <span className="mt-4 flex flex-wrap gap-2">
              {SRS_AGES.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => set('srsAge', age)}
                  className={`min-w-[76px] rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    raw.srsAge === age
                      ? 'border-navy bg-navy text-cream shadow-[0_8px_20px_-10px_rgba(26,39,68,0.6)]'
                      : 'border-navy/15 bg-white text-navy hover:border-gold hover:bg-gold/[0.05]'
                  }`}
                >
                  {age} 岁
                </button>
              ))}
            </span>
          </Callout>

          {/* 退休收入 */}
          <SectionLabel
            title="退休期固定收入"
            note="CPF LIFE、年金、租金等合计,按开始领取时的未来月金额填写"
          />
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-navy/10 bg-white p-4 transition-colors hover:border-gold/50">
            <input
              type="checkbox"
              checked={raw.fixedIncomeEscalating}
              onChange={(e) => set('fixedIncomeEscalating', e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold-deep"
            />
            <span className="text-[13px] leading-[1.85] text-mist">
              <b className="text-navy">这笔收入每年递增 2%</b>
              (CPF LIFE 递增计划 Escalating Plan)。不勾选则按固定金额发放,
              也就是购买力会被通胀慢慢磨掉 —— CPF LIFE 标准计划就是这样。
            </span>
          </label>

          <a
            href="https://www.cpf.gov.sg/member/tools-and-services/calculators/monthly-payout-estimator"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 border-b border-gold/40 pb-1 text-[13px] font-semibold text-gold-deep no-underline transition-colors hover:border-gold"
          >
            打开 CPF 官方退休月入估算器 ↗
          </a>

          {/* 高级 */}
          <details className="group mt-8 rounded-[14px] border border-navy/10 bg-sand-50">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="text-[13px] font-bold text-navy">高级假设</span>
              <small className="ml-auto text-[11px] text-mist">已有默认值,不懂可以不改</small>
              <span
                aria-hidden
                className="shrink-0 text-gold-deep transition-transform duration-300 group-open:rotate-45"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <div className="grid gap-x-6 gap-y-5 px-5 pb-6 pt-1 sm:grid-cols-2">
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
            <ul className="mt-5 space-y-1.5 rounded-[13px] border border-gold/40 bg-[#fffaf0] px-5 py-4 text-xs leading-[1.8] text-navy/75">
              {notes.map((n) => (
                <li key={n}>· {n}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <SecondaryButton onClick={() => goto(1)}>← 返回修改目标</SecondaryButton>
            <PrimaryButton onClick={() => goto(3)}>查看我的测算结果 →</PrimaryButton>
          </div>
        </div>
      ) : null}

      {/* ============================================================ 第 3 步 */}
      {step === 3 ? (
        <div className="space-y-5" aria-live="polite">
          {/* 头条 */}
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#172a4b] to-[#223b64] p-7 text-cream shadow-[0_28px_70px_-32px_rgba(22,42,75,0.75)] sm:p-10 md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-gold/15"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border border-gold/10"
            />
            <div className="relative grid items-center gap-9 md:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <p className="eyebrow text-gold-light">你的退休准备度</p>
                <p className="mt-3 text-[15px] font-medium text-cream/80">
                  基础情景下,预计可以支撑相当于今天
                </p>
                <p className="mt-1.5 text-[clamp(44px,7vw,72px)] font-black leading-[1.12] tracking-[-0.055em] text-gold-light">
                  {sgd100(base.sustainableMonthly)}
                  <span className="ml-1.5 align-middle text-base font-medium tracking-normal text-cream/60">
                    / 月
                  </span>
                </p>
                <p className="mt-3 max-w-[620px] text-sm leading-[1.75] text-cream/70">
                  不同市场与通胀情景下,合理观察范围约为{' '}
                  <b className="font-bold text-cream">
                    {sgd100(spread.low)}–{sgd100(spread.high)}/月
                  </b>
                  。
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-gold-light/40 px-3.5 py-2 text-[11px] font-medium text-[#f0d2a5]">
                    {lifestyleOf(base.sustainableMonthly).name} ·{' '}
                    {lifestyleOf(base.sustainableMonthly).text}
                  </span>
                  <button
                    type="button"
                    onClick={() => goto(1)}
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-[9px] border border-gold-light/60 bg-white/[0.08] px-3.5 text-xs font-bold text-cream transition-all duration-200 hover:-translate-y-px hover:bg-white/[0.16]"
                  >
                    <EditIcon />
                    重新测算
                  </button>
                </div>
              </div>
              <div className="shrink-0 justify-self-start md:justify-self-end">
                <div
                  className="grid h-[168px] w-[168px] place-items-center rounded-full p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] md:h-[190px] md:w-[190px]"
                  style={{
                    background: `conic-gradient(#c9a55c ${ringPct * 3.6}deg, rgba(250,247,240,0.14) 0deg)`,
                  }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#1d3458]">
                    <strong className="text-[34px] font-black tracking-[-0.04em] text-gold-light md:text-[39px]">
                      {readinessPct}%
                    </strong>
                    <span className="mt-0.5 text-[11px] text-[#bdc6d3]">目标达成率</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 目标对照 */}
          <div className={SUBCARD}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-mist">目标对照</span>
                <strong className="mt-0.5 block text-base font-bold text-navy">
                  目标 {sgd(form.monthlyGoal)}/月
                </strong>
              </div>
              <button type="button" onClick={() => goto(1)} className={CHIP_BUTTON}>
                <EditIcon />
                修改资料
              </button>
            </div>
            <div className="relative my-5 h-2.5 rounded-full bg-[#e8e2d8]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#b58849] to-[#e2bd83] transition-[width] duration-500"
                style={{ width: `${ringPct}%` }}
              />
              <span
                className="absolute top-1/2 -ml-2 h-[18px] w-[18px] -translate-y-1/2 rounded-full border-4 border-white bg-navy shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition-[left] duration-500"
                style={{ left: `${ringPct}%` }}
              />
            </div>
            <div className="flex flex-wrap justify-between gap-3 text-[11px] text-mist">
              <span>当前预计 {sgd100(base.sustainableMonthly)}/月</span>
              <span className={base.assetGap > 0 ? 'text-gold-deep' : 'font-bold text-navy'}>
                {base.assetGap > 0
                  ? `还差约 ${sgd100(Math.max(0, form.monthlyGoal - base.sustainableMonthly))}/月`
                  : '已达到目标'}
              </span>
            </div>
          </div>

          {/* 断档警告 */}
          {base.bridge && (base.bridge.shortfallAge !== null || base.liquidityCost > 20) ? (
            <div className="rounded-[18px] border border-gold bg-[#fffaf0] p-6 shadow-[0_12px_38px_-20px_rgba(127,89,37,0.45)] sm:p-7">
              <p className="flex items-center gap-2.5 text-base font-black text-navy">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-[13px] text-white">
                  !
                </span>
                提前退休 + SRS 锁定,中间这段会缺现金
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
          <div className="grid gap-4 sm:grid-cols-3">
            {runs.map((r) => {
              const isBase = r.key === 'base';
              return (
                <article
                  key={r.key}
                  className={`relative rounded-[17px] border bg-[#fffdf9] p-6 ${
                    isBase
                      ? 'border-gold shadow-[0_12px_38px_-20px_rgba(127,89,37,0.5)]'
                      : 'border-navy/10'
                  }`}
                >
                  {isBase ? (
                    <span className="absolute right-[18px] top-0 rounded-b-[7px] bg-gold px-2.5 py-1 text-[9px] font-bold tracking-[0.08em] text-white">
                      主要参考
                    </span>
                  ) : null}
                  <p className="text-[11px] text-mist">{r.name}</p>
                  <strong className="mt-2 block text-[27px] font-black tracking-[-0.035em] text-navy">
                    {sgd100(r.result.sustainableMonthly)}
                    <small className="ml-0.5 text-[11px] font-medium tracking-normal text-mist">
                      /月
                    </small>
                  </strong>
                  <p className="mb-5 mt-1 min-h-[18px] text-[11px] text-mist">{r.note}</p>
                  <div className="flex justify-between border-t border-navy/[0.08] pt-3.5 text-[11px] text-mist">
                    <span>达成率</span>
                    <b className="text-[13px] font-bold text-gold-deep">
                      {clamp(Math.round(r.result.readiness), 0, 999)}%
                    </b>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 退休后现金流 */}
          <div className="rounded-[20px] border border-navy/10 bg-[#fffdf9] p-6 sm:p-7 md:p-9">
            <p className="eyebrow">RETIREMENT CASH FLOW · 今日购买力</p>
            <h3 className="mt-2 text-[21px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[25px]">
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
            <HoverHint />
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
          <div className="rounded-[20px] border border-navy/10 bg-[#fffdf9] p-6 sm:p-7 md:p-9">
            <p className="eyebrow">LIFESTYLE LADDER · 今日购买力 / 月</p>
            <h3 className="mt-2 text-[21px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[25px]">
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
            <p className="mt-3 text-[11px] text-mist">把鼠标移到色块上看每一段的金额与占比(手机上点一下)。</p>
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
          <div className="rounded-[20px] border border-navy/10 bg-[#fffdf9] p-6 sm:p-7 md:p-9">
            <p className="eyebrow">PATH TO RETIREMENT · 未来金额</p>
            <h3 className="mt-2 text-[21px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[25px]">从今天到退休日</h3>
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
            <AccumulationChart data={base.accumulation} srsAge={form.srsAge} />
            <Legend
              items={[
                ['投资资产', SERIES.invest],
                ['SRS', SERIES.srs],
                ['其他资产(退休当年)', SERIES.other],
              ]}
            />
            <HoverHint />
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
          <div className="rounded-[20px] border border-navy/10 bg-[#fffdf9] p-6 sm:p-7 md:p-9">
            <h3 className="text-[21px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[25px]">关键数字</h3>
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

/* ---------------------------------------------------- 图表的悬停信息浮层 */

type TipRow = { label: string; value: string; color?: string; strong?: boolean };

/**
 * 跟着鼠标位置浮在图表上的明细卡片。
 * leftPct 是图表宽度上的百分比,夹在 [16,84] 之内保证不会被裁掉。
 */
function ChartTooltip({
  leftPct,
  title,
  rows,
  footer,
}: {
  leftPct: number;
  title: string;
  rows: TipRow[];
  footer?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute top-2 z-10 w-[212px] -translate-x-1/2 rounded-xl border border-navy/15 bg-white/[0.97] p-3 shadow-[0_12px_34px_-12px_rgba(26,39,68,0.4)]"
      style={{ left: `${clamp(leftPct, 16, 84)}%` }}
      role="status"
    >
      <p className="text-[12px] font-bold text-navy">{title}</p>
      <div className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-mist">
              {r.color ? (
                <i className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: r.color }} />
              ) : null}
              {r.label}
            </span>
            <b className={r.strong ? 'font-black text-navy' : 'font-bold text-navy'}>{r.value}</b>
          </div>
        ))}
      </div>
      {footer ? (
        <p className="mt-2 border-t border-navy/10 pt-1.5 text-[10px] leading-snug text-gold-deep">
          {footer}
        </p>
      ) : null}
    </div>
  );
}

/** 图表下方的操作提示 */
function HoverHint() {
  return (
    <p className="mt-3 text-[11px] text-mist">
      把鼠标移到柱子上看当年明细(手机上点一下)。
    </p>
  );
}

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
  const [hover, setHover] = useState<number | null>(null);

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
      srsGross: r.srsGross / defl,
      srsTax: r.srsTax / defl,
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

  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className="mt-6 -mx-2 overflow-x-auto px-2">
      <div className="relative min-w-[520px]">
      <svg
        viewBox={`0 0 ${CHART_W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="退休后每年现金来源构成"
        onPointerLeave={() => setHover(null)}
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

        {/* 悬停:高亮当前这一格 */}
        {hover !== null ? (
          <rect
            x={x(hover)}
            y={padT}
            width={bw}
            height={innerH}
            fill="#1a2744"
            opacity={0.07}
            pointerEvents="none"
          />
        ) : null}

        {/* 捕获层:整列都能感应,比细柱子好点中 */}
        {data.map((d, i) => (
          <rect
            key={`hit-${d.age}`}
            x={x(i)}
            y={padT}
            width={bw}
            height={innerH}
            fill="transparent"
            onPointerEnter={() => setHover(i)}
            onPointerDown={() => setHover(i)}
          />
        ))}
      </svg>

      {hovered ? (
        <ChartTooltip
          leftPct={((x(hover!) + bw / 2) / CHART_W) * 100}
          title={`${hovered.age} 岁`}
          rows={[
            { label: '当年支出', value: `${sgd100(hovered.spend)}/年`, strong: true },
            ...(hovered.fixed > 0
              ? [{ label: '固定收入', value: sgd100(hovered.fixed), color: SERIES.fixed }]
              : []),
            ...(hovered.srs > 0
              ? [
                  { label: 'SRS 提取(税后)', value: sgd100(hovered.srs), color: SERIES.srs },
                  { label: '　其中所得税', value: `−${sgd100(hovered.srsTax)}` },
                ]
              : []),
            ...(hovered.assets > 0
              ? [{ label: '动用投资资产', value: sgd100(hovered.assets), color: SERIES.invest }]
              : []),
            ...(hovered.surplus > 0
              ? [{ label: '当年结余', value: sgd100(hovered.surplus), color: SERIES.surplus }]
              : []),
          ]}
          footer={
            hovered.broken
              ? '投资资产已用完,这一年的缺口没有来源'
              : hovered.srs > 0
                ? undefined
                : hovered.age < analysis.srsStartAge
                  ? `SRS 要到 ${analysis.srsStartAge} 岁才解锁`
                  : undefined
          }
        />
      ) : null}
      </div>
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
  const [hover, setHover] = useState<string | null>(null);

  const H = 132;
  const padL = 10;
  const padR = 10;
  const scaleMax = Math.max(total, goal) * 1.25 || 1;
  const innerW = CHART_W - padL - padR;
  const w = (v: number) => (v / scaleMax) * innerW;

  const barY = 46;
  const barH = 42;
  const goalX = padL + w(goal);

  // 先算好每一段的位置,悬停层和浮层都要用
  let acc = 0;
  const segments = breakdown
    .filter((b) => b.value > 0)
    .map((b) => {
      const seg = { ...b, x: padL + w(acc), w: w(b.value) };
      acc += b.value;
      return seg;
    });
  const hovered = segments.find((s) => s.key === hover) ?? null;

  return (
    <div className="mt-6 -mx-2 overflow-x-auto px-2">
      <div className="relative min-w-[420px]">
      <svg
        viewBox={`0 0 ${CHART_W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="可支撑月支出的来源拆解"
        onPointerLeave={() => setHover(null)}
      >
        <rect x={padL} y={barY} width={innerW} height={barH} rx="8" fill="#1a27440d" />
        {segments.map((s) => (
          <rect
            key={s.key}
            x={s.x}
            y={hover === s.key ? barY - 4 : barY}
            width={s.w}
            height={hover === s.key ? barH + 8 : barH}
            fill={SERIES[s.key as keyof typeof SERIES]}
            onPointerEnter={() => setHover(s.key)}
            onPointerDown={() => setHover(s.key)}
          />
        ))}

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

      {hovered ? (
        <ChartTooltip
          leftPct={((hovered.x + hovered.w / 2) / CHART_W) * 100}
          title={hovered.label}
          rows={[
            {
              label: '折合今日购买力',
              value: `${sgd100(hovered.value)}/月`,
              color: SERIES[hovered.key as keyof typeof SERIES],
              strong: true,
            },
            {
              label: '占可支撑总额',
              value: total > 0 ? `${Math.round((hovered.value / total) * 100)}%` : '—',
            },
            {
              label: '占目标生活费',
              value: goal > 0 ? `${Math.round((hovered.value / goal) * 100)}%` : '—',
            },
          ]}
        />
      ) : null}
      </div>
    </div>
  );
}

function AccumulationChart({
  data,
  srsAge,
}: {
  data: { age: number; invest: number; srs: number; other: number }[];
  srsAge: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
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

  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className="mt-6 -mx-2 overflow-x-auto px-2">
      <div className="relative min-w-[520px]">
      <svg
        viewBox={`0 0 ${CHART_W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="从现在到退休的资产积累路径"
        onPointerLeave={() => setHover(null)}
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

        {hover !== null ? (
          <rect
            x={x(hover)}
            y={padT}
            width={bw}
            height={innerH}
            fill="#1a2744"
            opacity={0.07}
            pointerEvents="none"
          />
        ) : null}
        {data.map((d, i) => (
          <rect
            key={`hit-${d.age}`}
            x={x(i)}
            y={padT}
            width={bw}
            height={innerH}
            fill="transparent"
            onPointerEnter={() => setHover(i)}
            onPointerDown={() => setHover(i)}
          />
        ))}
      </svg>

      {hovered ? (
        <ChartTooltip
          leftPct={((x(hover!) + bw / 2) / CHART_W) * 100}
          title={`${hovered.age} 岁`}
          rows={[
            {
              label: '名下资产合计',
              value: compact(hovered.invest + hovered.srs + hovered.other),
              strong: true,
            },
            { label: '投资资产', value: compact(hovered.invest), color: SERIES.invest },
            { label: 'SRS', value: compact(hovered.srs), color: SERIES.srs },
            ...(hovered.other > 0
              ? [{ label: '其他资产', value: compact(hovered.other), color: SERIES.other }]
              : []),
          ]}
          footer={
            hovered.srs > 0 && hovered.age < srsAge
              ? `这笔 SRS 要到 ${srsAge} 岁才能动`
              : undefined
          }
        />
      ) : null}
      </div>
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
    <div className="mb-5 mt-9 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-navy/[0.09] pt-7">
      <span className="text-base font-bold text-navy">{title}</span>
      <p className="text-[11px] leading-relaxed text-mist">{note}</p>
    </div>
  );
}

/** 米色底、金色描边的说明块,左侧一个圆形斜体 i */
function Callout({
  title,
  tone = 'soft',
  children,
}: {
  title: string;
  tone?: 'soft' | 'strong';
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mt-5 flex items-start gap-3.5 rounded-[13px] bg-[#fffaf0] px-5 py-4 ${
        tone === 'strong' ? 'border border-gold/70' : 'border border-gold/35'
      }`}
    >
      <span
        aria-hidden
        className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border border-gold font-serif text-[13px] italic text-gold-deep"
      >
        i
      </span>
      <div className="min-w-0">
        <strong className="block text-[13px] font-bold text-navy">{title}</strong>
        <p className="mt-1 text-[12.5px] leading-[1.8] text-mist">{children}</p>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M4 13.8V16h2.2L15 7.2 12.8 5 4 13.8Z" />
      <path d="m11.8 6 2.2 2.2" />
    </svg>
  );
}

/**
 * 只保留数字和一个小数点,并去掉多余的前导 0。
 * 「05000」→「5000」;保留输入中途的「2.」和单独的「0」「0.5」。
 */
function sanitiseNumeric(input: string): string {
  let v = input.replace(/[^\d.]/g, '');
  const dot = v.indexOf('.');
  if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, '');
  return v.replace(/^0+(?=\d)/, '');
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
    <div className="flex min-w-0 flex-col">
      <label className="text-sm font-semibold text-navy">{label}</label>
      {/* 固定最小高度,没有说明文字的字段也能和相邻字段对齐 */}
      <p className="mt-0.5 min-h-[17px] text-[11px] leading-[1.5] text-mist">{help ?? ''}</p>
      <div className="mt-2 flex min-h-[52px] items-center gap-2 rounded-[11px] border border-navy/15 bg-white px-4 transition-[border-color,box-shadow] duration-150 focus-within:border-gold focus-within:shadow-[0_0_0_4px_rgba(201,165,92,0.13)]">
        {prefix ? (
          <span className="shrink-0 text-xs font-medium text-mist">{prefix}</span>
        ) : null}
        <input
          // 用 text + inputMode 而不是 type=number:
          // 这样才能自己控制选中和前导 0,滚轮也不会误改数值
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={value}
          // 停留在默认值 0 时,聚焦即全选,输入直接顶掉那个 0。
          // 必须延后一帧:浏览器会在 focus 事件处理完之后才安放光标,
          // 同步调用 select() 会被它覆盖掉。
          onFocus={(e) => {
            const el = e.currentTarget;
            if (el.value === '0') {
              requestAnimationFrame(() => {
                if (document.activeElement === el && el.value === '0') el.select();
              });
            }
          }}
          onChange={(e) => onChange(sanitiseNumeric(e.target.value))}
          onBlur={(e) => {
            // 「2.」「.」这类打字中途的状态,失焦时收拾干净。
            // 留空不强行填回 0:空着按 0 计算,灰色占位符里已经写着 0,
            // 比塞一个真的 0 回去再让用户删一次更省事。
            const v = e.currentTarget.value;
            if (v === '.') onChange('');
            else if (v.endsWith('.')) onChange(v.slice(0, -1));
          }}
          className="w-full min-w-0 bg-transparent py-3 text-right text-lg font-bold text-navy outline-none placeholder:font-normal placeholder:text-mist/40"
        />
        {suffix ? (
          <span className="shrink-0 text-xs font-medium text-mist">{suffix}</span>
        ) : null}
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
      className={`rounded-[13px] border p-4 ${
        highlight ? 'border-gold/45 bg-[#fffaf0]' : 'border-navy/[0.09] bg-white'
      }`}
    >
      <p className="text-[11px] leading-[1.6] text-mist">{label}</p>
      <p className="mt-1.5 text-[19px] font-black tracking-[-0.03em] text-navy">{value}</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-navy/[0.08] px-4 py-3.5 last:border-0">
      <span className="text-[13px] text-mist">{label}</span>
      <span className="text-right text-[13px] font-bold text-navy">{value}</span>
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
    <div className="flex h-full flex-col rounded-[17px] border border-navy/10 bg-[#fffdf9] p-6">
      <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-gold">{index}</span>
      <p className="mt-2.5 text-base font-black text-navy">{title}</p>
      <p className="mt-1.5 text-sm font-bold text-gold-deep">{value}</p>
      <p className="mt-3.5 text-[13px] leading-[1.85] text-mist">{text}</p>
    </div>
  );
}

const BUTTON_BASE =
  'inline-flex min-h-[48px] items-center justify-center gap-3 rounded-[10px] px-6 text-[13px] font-bold transition-all duration-200';

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
      className={`${BUTTON_BASE} border border-navy bg-navy text-cream hover:-translate-y-px hover:bg-navy-700 hover:shadow-[0_14px_30px_-14px_rgba(26,39,68,0.75)]`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
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
      className={`${BUTTON_BASE} border border-navy/20 bg-transparent text-navy hover:border-gold hover:text-gold-deep`}
    >
      {children}
    </button>
  );
}
