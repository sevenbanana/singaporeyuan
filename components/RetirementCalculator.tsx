'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  analyse,
  scenarios,
  SRS_CAP,
  type Analysis,
  type Assumptions,
  type Phase,
  type Residency,
  type RetirementForm,
} from '@/lib/retirement';

/* ---------------------------------------------------------------- 工具函数 */

const sgd = (v: number) => 'S$' + Math.round(Math.max(0, v)).toLocaleString('en-SG');

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

/** 给金额加千位符;输入框失焦时用 */
const withCommas = (raw: string) => {
  if (raw === '' || raw === '.') return raw;
  const n = num(raw);
  if (!Number.isFinite(n)) return raw;
  const [int, dec] = String(n).split('.');
  return Number(int).toLocaleString('en-SG') + (dec ? `.${dec}` : '');
};

const LIFESTYLE = [
  { max: 3000, name: '轻盈安心' },
  { max: 5000, name: '安稳自在' },
  { max: 8000, name: '从容品质' },
  { max: 12_000, name: '自由享受' },
  { max: Infinity, name: '丰盛有余' },
];
const lifestyleOf = (v: number) => LIFESTYLE.find((l) => v < l.max) ?? LIFESTYLE[LIFESTYLE.length - 1];

/** 第一步的三张生活方式选择卡 */
const GOAL_PRESETS = [
  { key: 'steady', name: '安稳自在', desc: '日常生活舒适,偶尔旅行', amount: 4000 },
  { key: 'quality', name: '从容品质', desc: '保持生活品质,每年安排旅行', amount: 6000 },
  { key: 'free', name: '自由享受', desc: '更多旅行、兴趣和家庭支持', amount: 9000 },
];

/** 「帮我估算」里的支出科目 */
const BUDGET_ITEMS = [
  { key: 'daily', label: '日常生活', hint: '吃饭、交通、水电、通讯' },
  { key: 'housing', label: '住房支出', hint: '房贷、租金、管理费、保养' },
  { key: 'travel', label: '旅行娱乐', hint: '按每年预算 ÷ 12 折成每月' },
  { key: 'health', label: '医疗保健', hint: '保费、体检、长期用药' },
  { key: 'family', label: '支持父母 / 孩子', hint: '给家人的固定支出' },
] as const;

const SERIES = {
  cpf: '#1a2744',
  other: '#3a4d6e',
  srs: '#5a7397',
  lump: '#a75a28',
  invest: '#c9a55c',
  surplus: '#e8d5a8',
};

/* --------------------------------------------------------------- 样式常量 */

const PANEL =
  'rounded-[22px] border border-navy/[0.08] bg-[#fffdf9] p-6 shadow-[0_18px_50px_-32px_rgba(26,39,68,0.22)] sm:p-8 md:p-11';
const SUBCARD = 'rounded-[18px] border border-navy/[0.08] bg-[#fffdf9] p-6 sm:p-7';
const CHIP_BUTTON =
  'inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border border-gold/45 bg-gold/[0.07] px-3.5 py-2 text-xs font-bold text-gold-deep transition-all duration-200 hover:-translate-y-px hover:border-gold hover:bg-gold/15';
/** 单选卡片:身份、SRS 状态、CPF LIFE 计划等都用它 */
const optionClass = (active: boolean) =>
  `min-h-[52px] rounded-xl border px-4 text-left text-sm font-semibold transition-all duration-200 ${
    active
      ? 'border-navy bg-navy text-cream shadow-[0_8px_20px_-10px_rgba(26,39,68,0.6)]'
      : 'border-navy/15 bg-white text-navy hover:border-gold hover:bg-gold/[0.05]'
  }`;

/* ------------------------------------------------------------ 表单的原始值 */

type SrsStatus = 'active' | 'unknownAmount' | 'none' | 'whatIsIt';
type SrsStart = 'before2022Jul' | 'mid' | 'from2026Jul' | 'unsure';
type CpfMode = 'flat' | 'escalating' | 'unsure';

/** 首次供款时间 → 提取年龄。记不清就按最晚的 64 算,结论更保守。 */
const SRS_AGE_BY_START: Record<SrsStart, number> = {
  before2022Jul: 62,
  mid: 63,
  from2026Jul: 64,
  unsure: 64,
};

type RawForm = {
  currentAge: string;
  retirementAge: string;
  planningAge: string;
  monthlyGoal: string;
  budget: Record<string, string>;
  residency: Residency;
  investments: string;
  monthlyInvest: string;
  otherRetirementAssets: string;
  srsStatus: SrsStatus;
  srs: string;
  annualSrs: string;
  srsStart: SrsStart;
  cpfLifeMonthly: string;
  cpfLifeStartAge: string;
  cpfLifeMode: CpfMode;
  otherIncomeMonthly: string;
  otherIncomeStartAge: string;
  inflation: string;
  preReturn: string;
  srsReturn: string;
  postReturn: string;
};

const BLANK: RawForm = {
  currentAge: '35',
  retirementAge: '60',
  planningAge: '95',
  monthlyGoal: '6000',
  budget: {},
  residency: 'citizenPr',
  investments: '',
  monthlyInvest: '',
  otherRetirementAssets: '',
  srsStatus: 'none',
  srs: '',
  annualSrs: '',
  srsStart: 'unsure',
  cpfLifeMonthly: '',
  cpfLifeStartAge: '65',
  cpfLifeMode: 'flat',
  otherIncomeMonthly: '',
  otherIncomeStartAge: '60',
  inflation: '2.5',
  preReturn: '5',
  srsReturn: '4',
  postReturn: '3',
};

const SAMPLE: RawForm = {
  ...BLANK,
  currentAge: '38',
  monthlyGoal: '6500',
  investments: '180,000',
  monthlyInvest: '2,500',
  otherRetirementAssets: '100,000',
  srsStatus: 'active',
  srs: '50,000',
  annualSrs: '15,300',
  srsStart: 'from2026Jul',
  cpfLifeMonthly: '2,100',
};

/* ------------------------------------------------------------------ 主组件 */

const STEPS = ['退休目标', '现有资产', 'CPF 与 SRS', '查看结果'];

export default function RetirementCalculator() {
  const [raw, setRaw] = useState<RawForm>(BLANK);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState<'idle' | 'done' | 'fallback'>('idle');
  const [toast, setToast] = useState<string | null>(null);
  const [tweak, setTweak] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<RawForm | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof RawForm>(key: K, value: RawForm[K]) =>
    setRaw((prev) => ({ ...prev, [key]: value }));

  /** 填写过程中把底部的微信/预约条收起来,到结果页再出现 */
  useEffect(() => {
    document.body.dataset.retirementStep = step < 4 ? 'form' : 'result';
    return () => {
      delete document.body.dataset.retirementStep;
    };
  }, [step]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  /** 所有数值在这里统一夹取,输入框本身允许留空 */
  const form: RetirementForm = useMemo(() => {
    const currentAge = clamp(Math.round(num(raw.currentAge)), 18, 70);
    const retirementAge = clamp(Math.round(num(raw.retirementAge)), currentAge + 1, 75);
    const planningAge = clamp(Math.round(num(raw.planningAge)), retirementAge + 1, 110);
    const hasSrs = raw.srsStatus === 'active';
    return {
      currentAge,
      retirementAge,
      planningAge,
      monthlyGoal: clamp(num(raw.monthlyGoal), 0, 50_000),
      residency: raw.residency,
      investments: clamp(num(raw.investments), 0, 50_000_000),
      monthlyInvest: clamp(num(raw.monthlyInvest), 0, 200_000),
      srs: hasSrs ? clamp(num(raw.srs), 0, 10_000_000) : 0,
      annualSrs: hasSrs ? clamp(num(raw.annualSrs), 0, SRS_CAP[raw.residency]) : 0,
      srsAge: SRS_AGE_BY_START[raw.srsStart],
      cpfLife: {
        monthly: clamp(num(raw.cpfLifeMonthly), 0, 100_000),
        startAge: clamp(Math.round(num(raw.cpfLifeStartAge)), 60, 75),
        escalating: raw.cpfLifeMode === 'escalating',
      },
      otherIncome: {
        monthly: clamp(num(raw.otherIncomeMonthly), 0, 100_000),
        startAge: clamp(Math.round(num(raw.otherIncomeStartAge)), 40, 90),
        escalating: false,
      },
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

  const spread = useMemo(() => {
    const vals = runs.map((r) => r.result.sustainableMonthly);
    return { low: Math.min(...vals), high: Math.max(...vals) };
  }, [runs]);

  const yearsToRetirement = form.retirementAge - form.currentAge;
  const goalAtRetirement =
    form.monthlyGoal * Math.pow(1 + assumptions.inflation / 100, yearsToRetirement);
  const readinessPct = clamp(Math.round(base.readiness), 0, 999);
  const ringPct = clamp(readinessPct, 0, 100);
  const monthlyShort = Math.max(0, form.monthlyGoal - base.sustainableMonthly);

  const budgetTotal = BUDGET_ITEMS.reduce((s, i) => s + num(raw.budget[i.key] ?? ''), 0);

  const goto = (n: number) => {
    setStep(n);
    // 立刻回到新步骤顶部,不用等平滑滚动
    window.requestAnimationFrame(() => {
      const top = shellRef.current?.getBoundingClientRect().top ?? 0;
      window.scrollTo({ top: window.scrollY + top - 16, behavior: 'auto' });
    });
  };

  /** 结果页的三个即时调整 */
  const applyTweak = (kind: 'save' | 'delay' | 'goal') => {
    if (!baseline) setBaseline(raw);
    if (kind === 'save') {
      const add = Math.max(50, Math.round(base.extraMonthlyNeeded / 50) * 50);
      setRaw((p) => ({ ...p, monthlyInvest: withCommas(String(num(p.monthlyInvest) + add)) }));
      setTweak(`每月投入 +${sgd(add)}`);
    } else if (kind === 'delay') {
      const next = Math.min(75, form.retirementAge + 3);
      setRaw((p) => ({
        ...p,
        retirementAge: String(next),
        planningAge: String(Math.max(next + 1, num(p.planningAge))),
      }));
      setTweak(`退休年龄改到 ${next} 岁`);
    } else {
      const target = Math.max(1000, Math.round(base.sustainableMonthly / 100) * 100);
      setRaw((p) => ({ ...p, monthlyGoal: String(target) }));
      setTweak(`目标生活费改到 ${sgd(target)}/月`);
    }
  };

  const undoTweak = () => {
    if (baseline) setRaw(baseline);
    setBaseline(null);
    setTweak(null);
  };

  const summaryText = [
    '退休自由度测算 · 新加坡小圆姐',
    `目标:${form.retirementAge} 岁退休,相当于今天每月 ${sgd(form.monthlyGoal)} 的生活,规划到 ${form.planningAge} 岁`,
    `假设:通胀 ${assumptions.inflation}% | 退休前投资 ${assumptions.preReturn}% | SRS ${assumptions.srsReturn}% | 退休后 ${assumptions.postReturn}%`,
    form.srs > 0 || form.annualSrs > 0
      ? `SRS 提取年龄 ${form.srsAge} 岁,分 ${base.srsSpreadYears} 年提取`
      : '未计入 SRS',
    form.cpfLife.monthly > 0
      ? `CPF LIFE ${sgd(form.cpfLife.monthly)}/月,自 ${form.cpfLife.startAge} 岁起${form.cpfLife.escalating ? '(每年递增 2%)' : ''}`
      : '未填写 CPF LIFE',
    `结论:可支撑相当于今天 ${sgd100(base.sustainableMonthly)}/月,目标覆盖 ${readinessPct}%`,
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
      setCopied('fallback');
    }
  };

  return (
    <div ref={shellRef} className="container-wide py-10 md:py-14">
      {/* 填写阶段收起底部的微信/预约条 */}
      {/* 选择器里不写引号:属性值带引号时,服务端与客户端的转义不一致,
          会触发 hydration mismatch。form 是合法 CSS 标识符,可以裸写。 */}
      <style>{`body[data-retirement-step=form] [data-mobile-cta]{display:none}`}</style>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12.5px] text-mist">
        <span>无需留下联系方式</span>
        <i aria-hidden className="h-1 w-1 rounded-full bg-gold/60" />
        <span>数据只在你的浏览器里计算</span>
        <i aria-hidden className="h-1 w-1 rounded-full bg-gold/60" />
        <span>约 3 分钟</span>
      </div>

      {/* 专业细节收进折叠区,不挡在开始之前 */}
      {step === 1 ? (
        <details className="group mx-auto mb-8 max-w-[640px] rounded-[14px] border border-navy/[0.09] bg-sand-50">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 [&::-webkit-details-marker]:hidden">
            <span className="text-[13px] font-bold text-navy">这个测算包含什么?</span>
            <span
              aria-hidden
              className="ml-auto shrink-0 text-gold-deep transition-transform duration-300 group-open:rotate-45"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <div className="space-y-2.5 px-5 pb-5 text-[12.5px] leading-[1.85] text-mist">
            <p>
              和多数计算器不同,这里是<b className="text-navy">逐年模拟</b>你退休后的每一年,
              而不是把所有钱堆成一个池子平均分。
            </p>
            <p>
              · <b className="text-navy">SRS</b> 会严格按你的提取年龄(62 / 63 / 64)才计入,
              达龄后分 10 年提取,并按 50% 计入应税收入;
            </p>
            <p>· <b className="text-navy">CPF LIFE</b> 按你选的开始年龄(65 或 70)才开始发;</p>
            <p>· 想提前退休的人,能直接看到中间那段<b className="text-navy">现金缺口</b>。</p>
            <p className="pt-1">全部计算都在你的浏览器里完成,不会上传,也不需要留联系方式。</p>
          </div>
        </details>
      ) : null}

      {/* 步骤条 */}
      <ol className="relative mx-auto mb-9 grid max-w-[760px] grid-cols-4">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[21px] h-[2px]">
          <div className="absolute left-[12.5%] right-[12.5%] h-full rounded-full bg-navy/[0.13]" />
          <div
            className="absolute left-[12.5%] h-full w-[75%] origin-left rounded-full bg-gold"
            style={{ transform: `scaleX(${(step - 1) / (STEPS.length - 1)})` }}
          />
        </div>
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li key={label} className="relative z-10 flex justify-center">
              <button
                type="button"
                onClick={() => goto(n)}
                aria-current={active ? 'step' : undefined}
                className="group flex flex-col items-center gap-2.5 px-1"
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
                  className={`text-center text-[12px] font-semibold leading-tight transition-colors duration-300 sm:text-[12.5px] ${
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

      {toast ? (
        <div className="mx-auto mb-5 max-w-[560px] rounded-xl border border-gold/45 bg-[#fffaf0] px-4 py-3 text-center text-[13px] font-semibold text-gold-deep">
          {toast}
        </div>
      ) : null}

      {/* ============================================================ 第 1 步 */}
      {step === 1 ? (
        <div className={PANEL}>
          <StepHead
            step="第 1 步"
            title="你想要什么样的退休生活"
            sub="金额都按今天的购买力填写,更容易判断。"
            action={
              <button
                type="button"
                onClick={() => {
                  setRaw(SAMPLE);
                  setBaseline(null);
                  setTweak(null);
                  setToast('已加载示例数据,可以直接跳到第 4 步看结果');
                }}
                className="shrink-0 whitespace-nowrap border-b border-gold/45 pb-1.5 text-[13px] font-semibold text-gold-deep transition-colors hover:border-gold"
              >
                先用示例体验
              </button>
            }
          />

          <div className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-3">
            <NumField id="current-age" label="你现在几岁" suffix="岁" value={raw.currentAge} onChange={(v) => set('currentAge', v)} />
            <NumField id="retire-age" label="希望几岁退休" suffix="岁" value={raw.retirementAge} onChange={(v) => set('retirementAge', v)} />
            <NumField id="planning-age" label="希望规划到几岁" help="家庭可按较年轻一方考虑" suffix="岁" value={raw.planningAge} onChange={(v) => set('planningAge', v)} />
          </div>

          <SectionLabel title="想过什么样的生活" note="先选一个大方向,金额随时可以改" />
          <div className="grid gap-3 sm:grid-cols-3">
            {GOAL_PRESETS.map((p) => {
              const active = Math.abs(form.monthlyGoal - p.amount) < 250;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => set('monthlyGoal', String(p.amount))}
                  className={`rounded-[16px] border p-5 text-left transition-all duration-200 ${
                    active
                      ? 'border-gold bg-[#fffaf0] shadow-[0_12px_30px_-18px_rgba(127,89,37,0.5)]'
                      : 'border-navy/12 bg-white hover:border-gold/60'
                  }`}
                >
                  <p className={`text-[15px] font-black ${active ? 'text-gold-deep' : 'text-navy'}`}>{p.name}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-mist">{p.desc}</p>
                  <p className="mt-3 text-[13px] font-bold text-navy">参考 {sgd(p.amount)}/月</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <NumField
              id="monthly-goal"
              label="目标退休生活费"
              help="今天的购买力,可以直接改成你自己的数字"
              prefix="S$"
              suffix="/ 月"
              money
              value={raw.monthlyGoal}
              onChange={(v) => set('monthlyGoal', v)}
            />
            <div className="flex items-end pb-1">
              <p className="text-[12.5px] leading-relaxed text-mist">
                当前档位:<b className="text-navy">{lifestyleOf(form.monthlyGoal).name}</b>
                <br />
                按每年 {assumptions.inflation}% 通胀,到 {form.retirementAge} 岁时约需{' '}
                <b className="text-navy">{sgd100(goalAtRetirement)}/月</b>。
              </p>
            </div>
          </div>

          <details className="group mt-6 rounded-[14px] border border-navy/10 bg-sand-50">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="text-[13px] font-bold text-navy">帮我估算</span>
              <small className="ml-auto text-[11px] text-mist">按几项开支加总,比拍脑袋准</small>
              <span aria-hidden className="shrink-0 text-gold-deep transition-transform duration-300 group-open:rotate-45">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-6 pt-1">
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {BUDGET_ITEMS.map((it) => (
                  <NumField
                    key={it.key}
                    id={`budget-${it.key}`}
                    label={it.label}
                    help={it.hint}
                    prefix="S$"
                    suffix="/ 月"
                    money
                    value={raw.budget[it.key] ?? ''}
                    onChange={(v) => set('budget', { ...raw.budget, [it.key]: v })}
                  />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-4">
                <p className="text-[13px] text-mist">
                  合计 <b className="text-base text-navy">{sgd(budgetTotal)}/月</b>
                </p>
                <button
                  type="button"
                  disabled={budgetTotal <= 0}
                  onClick={() => {
                    set('monthlyGoal', withCommas(String(Math.round(budgetTotal))));
                    setToast(`目标生活费已按估算结果设为 ${sgd(budgetTotal)}/月`);
                  }}
                  className={`${CHIP_BUTTON} disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  用这个数字作为目标
                </button>
              </div>
            </div>
          </details>

          <StepFooter
            hint={`距离你的目标退休年龄,还有 ${yearsToRetirement} 年可以准备。`}
            next={() => goto(2)}
            nextLabel="下一步:现有资产 →"
          />
        </div>
      ) : null}

      {/* ============================================================ 第 2 步 */}
      {step === 2 ? (
        <div className={PANEL}>
          <StepHead
            step="第 2 步"
            title="现在已经攒了多少"
            sub="只算 CPF 和 SRS 以外的钱,不确定的先留空。"
          />

          <div className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <NumField
              id="investments"
              label="现有投资资产"
              help="存款、基金、股票、储蓄险现金价值等"
              prefix="S$"
              money
              value={raw.investments}
              onChange={(v) => set('investments', v)}
            />
            <NumField
              id="monthly-invest"
              label="每月还会继续投入"
              help="预计一直持续到退休"
              prefix="S$"
              suffix="/ 月"
              money
              value={raw.monthlyInvest}
              onChange={(v) => set('monthlyInvest', v)}
            />
          </div>

          <SectionLabel title="退休时的一次性资产" note="选填,没有就留空" />
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <NumField
              id="other-assets"
              label="退休那一年预计能拿到"
              help="保单满期金、计划变现的资产等"
              prefix="S$"
              money
              value={raw.otherRetirementAssets}
              onChange={(v) => set('otherRetirementAssets', v)}
            />
            <div className="flex items-end pb-1">
              <Callout title="填的是退休那一年的金额" compact>
                这里要的是<b className="text-navy">到你 {form.retirementAge} 岁时预计能拿到的钱</b>,
                不是这笔资产今天的市值。CPF 退休账户(RA)不要填在这里,它会在下一步单独处理。
              </Callout>
            </div>
          </div>

          <StepFooter
            hint={
              form.investments + form.monthlyInvest > 0
                ? `按 ${assumptions.preReturn}% 年化,这些钱到 ${form.retirementAge} 岁大约会长到 ${compact(base.investAtRetirement)}。`
                : '先留空也没关系,下一步填完 CPF 和 SRS 一样能看到结果。'
            }
            back={() => goto(1)}
            next={() => goto(3)}
            nextLabel="下一步:CPF 与 SRS →"
          />
        </div>
      ) : null}

      {/* ============================================================ 第 3 步 */}
      {step === 3 ? (
        <div className={PANEL}>
          <StepHead
            step="第 3 步"
            title="CPF 与 SRS"
            sub="这两笔钱有各自的领取年龄,单独问一下才算得准。"
          />

          {/* ---- CPF LIFE ---- */}
          <SectionLabel title="CPF LIFE" note="65 岁以后每月发到你手上的那笔钱" />
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <NumField
              id="cpf-life"
              label="预计每月能领多少"
              help="不知道就先留空,或用官方估算器算一下"
              prefix="S$"
              suffix="/ 月"
              money
              value={raw.cpfLifeMonthly}
              onChange={(v) => set('cpfLifeMonthly', v)}
            />
            <div>
              <span className="text-sm font-semibold text-navy">从几岁开始领</span>
              <p className="mt-0.5 min-h-[17px] text-[11px] leading-[1.5] text-mist">
                最早 65 岁,最晚可以推到 70 岁,推得越晚每月越多
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['65', '70'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => set('cpfLifeStartAge', age)}
                    className={optionClass(raw.cpfLifeStartAge === age)}
                  >
                    {age} 岁开始
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <span className="text-sm font-semibold text-navy">领的是哪一种计划</span>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(
                [
                  ['flat', '固定金额', '标准计划,每月一样多'],
                  ['escalating', '每年递增 2%', '递增计划,起步低但会涨'],
                  ['unsure', '不确定', '先按固定金额算,更保守'],
                ] as [CpfMode, string, string][]
              ).map(([v, name, desc]) => (
                <button key={v} type="button" onClick={() => set('cpfLifeMode', v)} className={`${optionClass(raw.cpfLifeMode === v)} py-3`}>
                  <span className="block">{name}</span>
                  <span className={`mt-0.5 block text-[11px] font-normal ${raw.cpfLifeMode === v ? 'text-cream/70' : 'text-mist'}`}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <a
            href="https://www.cpf.gov.sg/member/tools-and-services/calculators/monthly-payout-estimator"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 border-b border-gold/40 pb-1 text-[13px] font-semibold text-gold-deep no-underline transition-colors hover:border-gold"
          >
            打开 CPF 官方退休月入估算器 ↗
          </a>

          {/* ---- SRS ---- */}
          <SectionLabel title="SRS 补充退休计划" note="没有 SRS 也没关系,选一下就跳过" />
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ['active', '有,正在使用', '知道余额和每年供款'],
                ['unknownAmount', '有,但不清楚金额', '先按 0 算,查到再回来填'],
                ['none', '没有', '直接跳过这一段'],
                ['whatIsIt', '不确定 SRS 是什么', '看一句话解释'],
              ] as [SrsStatus, string, string][]
            ).map(([v, name, desc]) => (
              <button key={v} type="button" onClick={() => set('srsStatus', v)} className={`${optionClass(raw.srsStatus === v)} py-3.5`}>
                <span className="block">{name}</span>
                <span className={`mt-0.5 block text-[11px] font-normal ${raw.srsStatus === v ? 'text-cream/70' : 'text-mist'}`}>{desc}</span>
              </button>
            ))}
          </div>

          {raw.srsStatus === 'whatIsIt' ? (
            <Callout title="一句话说清 SRS">
              SRS 是政府的自愿退休储蓄账户:每年存进去的钱可以抵税,账户里的钱还能拿去投资。
              代价是<b className="text-navy">要到法定退休年龄才能免罚提取</b>,提前取要罚 5% 并全额计税。
              公民 / PR 每年最多存 {sgd(SRS_CAP.citizenPr)},外国人 {sgd(SRS_CAP.foreigner)}。
              想了解可以先看我写的省税指南,这次测算就先按「没有」处理。
            </Callout>
          ) : null}

          {raw.srsStatus === 'unknownAmount' ? (
            <Callout title="先按 0 算">
              查余额:登录 <b className="text-navy">SRS 开户银行</b>(DBS / OCBC / UOB)的网银,
              或在 IRAS 的报税记录里看每年的 SRS 供款。查到之后回来填,结果会更准 ——
              现在这个数字是<b className="text-navy">偏保守</b>的。
            </Callout>
          ) : null}

          {raw.srsStatus === 'active' ? (
            <>
              <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <NumField id="srs-balance" label="现在的 SRS 余额" prefix="S$" money value={raw.srs} onChange={(v) => set('srs', v)} />
                <NumField
                  id="srs-annual"
                  label="每年还会存多少"
                  help={`上限 ${sgd(SRS_CAP[raw.residency])}(${raw.residency === 'citizenPr' ? '公民 / PR' : '外国人'})`}
                  prefix="S$"
                  suffix="/ 年"
                  money
                  value={raw.annualSrs}
                  onChange={(v) => set('annualSrs', v)}
                />
              </div>

              <div className="mt-5">
                <span className="text-sm font-semibold text-navy">身份</span>
                <p className="mt-0.5 text-[11px] text-mist">决定每年的供款上限</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:max-w-md">
                  {(
                    [
                      ['citizenPr', '公民 / PR'],
                      ['foreigner', '外国人(EP 等)'],
                    ] as [Residency, string][]
                  ).map(([v, label]) => (
                    <button key={v} type="button" onClick={() => set('residency', v)} className={optionClass(raw.residency === v)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <span className="text-sm font-semibold text-navy">你第一次往 SRS 存钱是什么时候</span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-mist">
                  提取年龄锁定在你首次供款那一年的法定退休年龄,之后不会再变 —— 所以问时间比问年龄好答
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ['before2022Jul', '2022 年 7 月以前'],
                      ['mid', '2022 年 7 月 – 2026 年 6 月'],
                      ['from2026Jul', '2026 年 7 月以后'],
                      ['unsure', '不记得了'],
                    ] as [SrsStart, string][]
                  ).map(([v, label]) => (
                    <button key={v} type="button" onClick={() => set('srsStart', v)} className={`${optionClass(raw.srsStart === v)} py-3.5`}>
                      <span className="block">{label}</span>
                      <span className={`mt-0.5 block text-[11px] font-normal ${raw.srsStart === v ? 'text-cream/70' : 'text-mist'}`}>
                        提取年龄 {SRS_AGE_BY_START[v]} 岁{v === 'unsure' ? '(按最晚的算)' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* ---- 其他固定收入 ---- */}
          <SectionLabel title="其他退休期固定收入" note="选填:租金、年金、其他每月都有的钱" />
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <NumField
              id="other-income"
              label="每月大约多少"
              help="租金、商业年金等合计,不含 CPF LIFE"
              prefix="S$"
              suffix="/ 月"
              money
              value={raw.otherIncomeMonthly}
              onChange={(v) => set('otherIncomeMonthly', v)}
            />
            <NumField
              id="other-income-age"
              label="从几岁开始有"
              help="一般填退休年龄"
              suffix="岁"
              value={raw.otherIncomeStartAge}
              onChange={(v) => set('otherIncomeStartAge', v)}
            />
          </div>

          {/* ---- 高级假设 ---- */}
          <div className="mt-9 rounded-[14px] border border-navy/10 bg-sand-50 px-5 py-4">
            <p className="text-[12.5px] leading-relaxed text-mist">
              本次测算按每年 <b className="text-navy">{assumptions.inflation}% 通胀</b>
              和稳健的长期回报假设计算。
            </p>
            <details className="group mt-2">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 border-b border-gold/40 pb-0.5 text-[13px] font-semibold text-gold-deep [&::-webkit-details-marker]:hidden">
                调整测算假设
                <span aria-hidden className="transition-transform duration-300 group-open:rotate-45">＋</span>
              </summary>
              <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                <NumField id="a-inflation" label="长期通胀率" suffix="% / 年" value={raw.inflation} onChange={(v) => set('inflation', v)} />
                <NumField id="a-pre" label="退休前投资年化" suffix="% / 年" value={raw.preReturn} onChange={(v) => set('preReturn', v)} />
                <NumField id="a-srs" label="SRS 年化" suffix="% / 年" value={raw.srsReturn} onChange={(v) => set('srsReturn', v)} />
                <NumField id="a-post" label="退休后资产回报" suffix="% / 年" value={raw.postReturn} onChange={(v) => set('postReturn', v)} />
              </div>
            </details>
          </div>

          <StepFooter
            hint={
              form.srs > 0
                ? `你的 SRS 要到 ${form.srsAge} 岁才能免罚提取,这一点会体现在结果里。`
                : 'CPF LIFE 和其他收入都会按各自的开始年龄计入。'
            }
            back={() => goto(2)}
            next={() => goto(4)}
            nextLabel="看我的测算结果 →"
          />
        </div>
      ) : null}

      {/* ============================================================ 第 4 步 */}
      {step === 4 ? (
        <div className="space-y-5" aria-live="polite">
          {/* 头条 */}
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#172a4b] to-[#223b64] p-7 text-cream shadow-[0_28px_70px_-32px_rgba(22,42,75,0.75)] sm:p-10 md:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-gold/15" />
            <div className="relative grid items-center gap-9 md:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <p className="eyebrow text-gold-light">你的退休准备度</p>
                <p className="mt-3 text-[15px] font-medium text-cream/80">按目前的计划,退休后可支撑相当于今天</p>
                <p className="mt-1.5 text-[clamp(44px,7vw,72px)] font-black leading-[1.12] tracking-[-0.055em] text-gold-light">
                  {sgd100(base.sustainableMonthly)}
                  <span className="ml-1.5 align-middle text-base font-medium tracking-normal text-cream/60">/ 月</span>
                </p>
                <p className="mt-3 max-w-[620px] text-sm leading-[1.75] text-cream/70">
                  不同市场与通胀情景下,合理观察范围约为{' '}
                  <b className="font-bold text-cream">{sgd100(spread.low)}–{sgd100(spread.high)}/月</b>。
                </p>
              </div>
              <div className="shrink-0 justify-self-start md:justify-self-end">
                <div
                  className="grid h-[168px] w-[168px] place-items-center rounded-full p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] md:h-[190px] md:w-[190px]"
                  style={{ background: `conic-gradient(#c9a55c ${ringPct * 3.6}deg, rgba(250,247,240,0.14) 0deg)` }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#1d3458]">
                    <strong className="text-[34px] font-black tracking-[-0.04em] text-gold-light md:text-[39px]">{readinessPct}%</strong>
                    <span className="mt-0.5 text-[11px] text-[#bdc6d3]">目标覆盖比例</span>
                  </div>
                </div>
                <p className="mt-3 max-w-[190px] text-center text-[10.5px] leading-snug text-cream/50">
                  这是目标覆盖比例,不是成功概率
                </p>
              </div>
            </div>
          </div>

          {/* 行动卡:先说怎么办,再讲分析 */}
          <div className="rounded-[20px] border border-gold/60 bg-[#fffaf0] p-6 sm:p-8">
            <p className="text-[15px] leading-[1.9] text-navy/85">
              目标是 <b>{sgd(form.monthlyGoal)}/月</b>,
              {/* 显示只精确到百位,差额不到 50 就当作已覆盖,免得出现「还差 S$0」 */}
              {monthlyShort >= 50 ? (
                <>
                  {' '}目前预计 <b>{sgd100(base.sustainableMonthly)}/月</b>,还差约{' '}
                  <b className="text-gold-deep">{sgd100(monthlyShort)}/月</b>。
                </>
              ) : (
                <> 目前的安排已经覆盖得住。</>
              )}
            </p>
            {monthlyShort >= 50 ? (
              <p className="mt-3 text-[17px] font-black leading-snug text-navy sm:text-[19px]">
                {base.extraMonthlyNeeded > 20_000 || yearsToRetirement <= 3
                  ? `离退休只剩 ${yearsToRetirement} 年,靠加投很难补上 —— 优先考虑晚几年退休或调整生活目标`
                  : `若维持 ${form.retirementAge} 岁退休,建议每月增加投入约 ${sgd100(base.extraMonthlyNeeded)}`}
              </p>
            ) : (
              <p className="mt-3 text-[17px] font-black leading-snug text-navy sm:text-[19px]">
                维持现在的投入就可以,余下的重点是控制风险和税务效率
              </p>
            )}

            <p className="mt-5 text-[12px] font-semibold text-mist">点一下试试,结果会立刻重算:</p>
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              <button type="button" onClick={() => applyTweak('save')} className={CHIP_BUTTON}>
                每月多存一点
              </button>
              <button type="button" onClick={() => applyTweak('delay')} className={CHIP_BUTTON}>
                晚 3 年退休
              </button>
              <button type="button" onClick={() => applyTweak('goal')} className={CHIP_BUTTON}>
                调整生活目标
              </button>
            </div>
            {tweak ? (
              <p className="mt-4 flex flex-wrap items-center gap-3 border-t border-gold/30 pt-3.5 text-[12.5px] text-mist">
                <span>已调整:<b className="text-navy">{tweak}</b></span>
                <button type="button" onClick={undoTweak} className="border-b border-gold/50 font-semibold text-gold-deep">
                  撤销,恢复原来的填写
                </button>
              </p>
            ) : null}
          </div>

          {/* 断档警告 */}
          {base.bridge && (base.bridge.shortfallAge !== null || base.liquidityCost > 20) ? (
            <div className="rounded-[18px] border border-gold bg-[#fffaf0] p-6 sm:p-7">
              <p className="flex items-center gap-2.5 text-base font-black text-navy">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-[13px] text-white">!</span>
                提前退休 + SRS 锁定,中间这段会缺现金
              </p>
              <p className="mt-2.5 text-sm leading-[1.95] text-navy/75">
                你计划 <b>{form.retirementAge} 岁</b>退休,但 SRS 要到 <b>{form.srsAge} 岁</b>才能免罚提取
                {form.cpfLife.monthly > 0 ? <>,CPF LIFE 要到 <b>{form.cpfLife.startAge} 岁</b>才开始</> : null}。
                中间这 <b>{base.bridge.years} 年</b>,<b>{compact(base.bridge.lockedAmount)}</b> 的 SRS 是动不了的,全靠其他资产过桥。
                {base.bridge.shortfallAge !== null ? <> 按你的目标生活费,资金会在 <b>{base.bridge.shortfallAge} 岁</b>就断掉。</> : null}
              </p>
              {base.liquidityCost > 20 ? (
                <p className="mt-2.5 text-sm leading-[1.95] text-navy/75">
                  只看「一辈子总量够不够」能支撑 <b>{sgd100(base.sustainableIdeal)}/月</b>;要求
                  <b>每一年现金都够用</b>,就只剩 <b>{sgd100(base.sustainableMonthly)}/月</b> ——
                  差的 <b>{sgd100(base.liquidityCost)}/月</b> 就是提取年龄限制的代价。
                </p>
              ) : null}
            </div>
          ) : null}

          {/* 分阶段:先给结论 */}
          <div className={SUBCARD}>
            <p className="eyebrow">退休后的三个阶段 · 今日购买力</p>
            <h3 className="mt-2 text-[21px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[25px]">
              每个阶段,钱主要从哪里来
            </h3>
            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {base.phases.map((p) => (
                <PhaseCard key={p.fromAge} phase={p} />
              ))}
            </div>

            <details className="group mt-6">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 border-b border-gold/40 pb-0.5 text-[13px] font-semibold text-gold-deep [&::-webkit-details-marker]:hidden">
                查看每一年的详细现金流
                <span aria-hidden className="transition-transform duration-300 group-open:rotate-45">＋</span>
              </summary>
              <div className="mt-2">
                <p className="mt-4 text-sm leading-relaxed text-mist">
                  按你填的目标生活费逐年模拟。
                  {form.srs > 0 ? (
                    <>留意 <b className="text-navy">{base.srsStartAge} 岁</b>才出现的 SRS 色块 —— 在那之前它一分钱都用不上。</>
                  ) : null}
                </p>
                <CashflowChart form={form} analysis={base} inflation={assumptions.inflation} />
                <Legend
                  items={[
                    ['CPF LIFE', SERIES.cpf],
                    ['租金 / 年金等', SERIES.other],
                    ['SRS 提取(税后)', SERIES.srs],
                    ['动用投资资产', SERIES.invest],
                    ['当年结余', SERIES.surplus],
                  ]}
                />
                <HoverHint />
                <p className="mt-4 text-sm leading-[1.9] text-mist">
                  {base.goalRun.ok ? (
                    <>按目标生活费,资金可以支撑到 {form.planningAge} 岁。</>
                  ) : (
                    <>
                      按目标生活费,投资资产会在 <b className="text-navy">{base.goalRun.shortfallAge} 岁</b>用完 ——
                      距离你规划的 {form.planningAge} 岁还差{' '}
                      <b className="text-navy">{form.planningAge - base.goalRun.shortfallAge!} 年</b>,那之后只剩固定收入可用。
                    </>
                  )}
                </p>
              </div>
            </details>
          </div>

          {/* 组成拆解 */}
          <div className={SUBCARD}>
            <p className="eyebrow">来源拆解 · 今日购买力 / 月</p>
            <h3 className="mt-2 text-[21px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[25px]">
              这 {sgd100(base.sustainableMonthly)}/月,是谁供出来的
            </h3>
            <LadderChart breakdown={base.breakdown} total={base.sustainableMonthly} goal={form.monthlyGoal} />
            <Legend items={base.breakdown.filter((b) => b.value > 0).map((b) => [b.label, SERIES[b.key as keyof typeof SERIES]] as [string, string])} />
            <p className="mt-3 text-[11px] text-mist">把鼠标移到色块上看每一段的金额与占比(手机上点一下)。</p>
            {form.cpfLife.monthly > 0 ? (
              <Callout title="为什么 CPF LIFE 这一段比我填的少">
                你填的 {sgd(form.cpfLife.monthly)}/月 是 {form.cpfLife.startAge} 岁开始领的未来金额
                {form.cpfLife.escalating ? '(每年递增 2%)' : '(金额固定不变)'}。
                这里显示的是把它折算成<b className="text-navy">今天的购买力</b>、并摊到{' '}
                {form.retirementAge}–{form.planningAge} 岁整段退休期之后的等价月额 ——
                所以数字会明显更小,这是通胀和「前几年还没开始领」共同造成的。
              </Callout>
            ) : null}
          </div>

          {/* 积累路径 */}
          <details className={`${SUBCARD} group`}>
            <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
              <div>
                <p className="eyebrow">从今天到退休日 · 未来金额</p>
                <h3 className="mt-1.5 text-[17px] font-black text-navy">
                  {form.retirementAge} 岁时预计名下 {compact(base.availableAtRetirement)}
                </h3>
              </div>
              <span aria-hidden className="ml-auto shrink-0 text-gold-deep transition-transform duration-300 group-open:rotate-45">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <AccumulationChart data={base.accumulation} srsAge={form.srsAge} />
            <Legend
              items={[
                ['投资资产', SERIES.invest],
                ['SRS', SERIES.srs],
                ['一次性资产(退休当年)', SERIES.lump],
              ]}
            />
            <HoverHint />
          </details>

          {/* 关键数字 */}
          <div className={SUBCARD}>
            <h3 className="text-[21px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[25px]">关键数字</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label={`${form.retirementAge} 岁时名下资产`} value={compact(base.availableAtRetirement)} />
              <Metric label="其中 SRS(锁到提取年龄)" value={form.srs > 0 ? compact(base.srsAtRetirement) : '未填写'} />
              <Metric label="资产缺口" value={base.assetGap > 0 ? compact(base.assetGap) : '已覆盖'} highlight={base.assetGap > 0} />
              <Metric label="目标生活费(退休时)" value={`${sgd100(goalAtRetirement)}/月`} />
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border border-navy/10">
              {form.srs > 0 ? (
                <>
                  <Line label="SRS 提取安排" value={`${base.srsStartAge} 岁起,分 ${base.srsSpreadYears} 年`} />
                  <Line label="SRS 供款年数" value={`${base.srsContribYears} 年(缴到 ${form.srsAge} 岁为止)`} />
                </>
              ) : null}
              {form.cpfLife.monthly > 0 ? (
                <Line
                  label="CPF LIFE"
                  value={`${sgd(form.cpfLife.monthly)}/月 · ${form.cpfLife.startAge} 岁起${form.cpfLife.escalating ? ' · 每年递增 2%' : ' · 金额固定'}`}
                />
              ) : null}
              {form.otherIncome.monthly > 0 ? (
                <Line label="其他固定收入" value={`${sgd(form.otherIncome.monthly)}/月 · ${form.otherIncome.startAge} 岁起`} />
              ) : null}
              <Line label="退休期长度" value={`${form.planningAge - form.retirementAge} 年(${form.retirementAge}–${form.planningAge} 岁)`} />
              <Line label="测算假设" value={`通胀 ${assumptions.inflation}% · 退休前 ${assumptions.preReturn}% · 退休后 ${assumptions.postReturn}%`} />
            </div>
          </div>

          {/* 保存 */}
          <div className="rounded-[20px] bg-gradient-to-br from-navy to-navy-deep p-7 text-cream md:p-8">
            <p className="eyebrow text-gold-light">下一步</p>
            <h3 className="mt-2 text-lg font-black md:text-xl">先保存这份方向,再慢慢把细节补齐</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/70">
              正式的退休规划还要考虑住房、医疗与长期护理、税务、投资费用、回报顺序风险和家庭现金流。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={copy} className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy transition-all hover:bg-gold-light">
                {copied === 'done' ? '已复制 ✓' : '复制测算摘要'}
              </button>
              <button type="button" onClick={() => window.print()} className="rounded-xl border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition-all hover:border-gold hover:text-gold-light">
                打印 / 存成 PDF
              </button>
              <button type="button" onClick={() => goto(1)} className="rounded-xl border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition-all hover:border-gold hover:text-gold-light">
                重新测算
              </button>
            </div>
            {copied === 'fallback' ? (
              <div className="mt-4">
                <p className="text-xs text-cream/70">当前浏览器不允许自动复制(微信内置浏览器常见)。请长按下方文字手动复制:</p>
                <textarea
                  readOnly
                  aria-label="测算摘要文本"
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
            本工具用单一假设路径加三种示意情景做估算,仅用于退休教育与方向讨论,并非收益保证、产品推荐,
            也不构成投资、税务或法律建议。模型已计入 SRS 的提取年龄、10 年分摊提取与 50% 计入应税收入,
            以及 CPF LIFE 与其他固定收入各自的开始年龄;但未完整计入投资费用、回报顺序风险、
            医疗与长期护理开支、房产与遗产安排,也未考虑 CPF 账户内部(OA / SA / RA)的实际运作
            与 CPF LIFE 的具体保费与派息机制。CPF、SRS 与任何保单的数值,请以 CPF Board、IRAS
            及相关产品文件为准。正式行动前请结合个人情况完成完整评估。
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------- 表单结构小组件 */

function StepHead({
  step,
  title,
  sub,
  action,
}: {
  step: string;
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
      <div>
        <p className="eyebrow">{step}</p>
        <h2 className="mt-2 text-[26px] font-black leading-[1.25] tracking-[-0.025em] text-navy md:text-[34px]">
          {title}
        </h2>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-mist">{sub}</p>
      </div>
      {action}
    </div>
  );
}

/** 每一步底部:一句进度反馈 + 上下步按钮 */
function StepFooter({
  hint,
  back,
  next,
  nextLabel,
}: {
  hint: string;
  back?: () => void;
  next: () => void;
  nextLabel: string;
}) {
  return (
    <>
      <p className="mt-9 flex items-start gap-2.5 rounded-xl bg-sand-50 px-4 py-3.5 text-[13px] leading-relaxed text-mist">
        <span aria-hidden className="mt-0.5 text-gold-deep">◆</span>
        {hint}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {back ? <SecondaryButton onClick={back}>← 上一步</SecondaryButton> : <span />}
        <PrimaryButton onClick={next}>{nextLabel}</PrimaryButton>
      </div>
    </>
  );
}

function SectionLabel({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-5 mt-9 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-navy/[0.08] pt-7">
      <span className="text-base font-bold text-navy">{title}</span>
      <p className="text-[11.5px] leading-relaxed text-mist">{note}</p>
    </div>
  );
}

function Callout({
  title,
  compact: isCompact,
  children,
}: {
  title: string;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3.5 rounded-[13px] border border-gold/35 bg-[#fffaf0] px-5 py-4 ${
        isCompact ? '' : 'mt-5'
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
  id,
  label,
  help,
  prefix,
  suffix,
  money,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help?: string;
  prefix?: string;
  suffix?: string;
  /** 金额字段:失焦时补千位符 */
  money?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <label htmlFor={id} className="text-sm font-semibold text-navy">
        {label}
      </label>
      {/* 固定最小高度,没有说明文字的字段也能和相邻字段对齐 */}
      <p className="mt-0.5 min-h-[17px] text-[11.5px] leading-[1.5] text-mist">{help ?? ''}</p>
      <div className="mt-2 flex min-h-[52px] items-center gap-2 rounded-[11px] border border-navy/15 bg-white px-4 transition-[border-color,box-shadow] duration-150 focus-within:border-gold focus-within:shadow-[0_0_0_4px_rgba(201,165,92,0.13)]">
        {prefix ? <span className="shrink-0 text-xs font-medium text-mist">{prefix}</span> : null}
        <input
          id={id}
          // 用 text + inputMode 而不是 type=number:
          // 这样才能自己控制选中、前导 0 和千位符,滚轮也不会误改数值
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          aria-label={label}
          value={value}
          onFocus={(e) => {
            const el = e.currentTarget;
            // 编辑时去掉千位符,免得和光标打架
            if (money && el.value.includes(',')) onChange(el.value.replace(/,/g, ''));
            if (el.value === '0') {
              // 浏览器会在 focus 处理完之后才安放光标,同步 select() 会被覆盖
              requestAnimationFrame(() => {
                if (document.activeElement === el && el.value === '0') el.select();
              });
            }
          }}
          onChange={(e) => onChange(sanitiseNumeric(e.target.value))}
          onBlur={(e) => {
            const v = e.currentTarget.value;
            if (v === '.') return onChange('');
            const trimmed = v.endsWith('.') ? v.slice(0, -1) : v;
            onChange(money ? withCommas(trimmed) : trimmed);
          }}
          className="w-full min-w-0 bg-transparent py-3 text-right text-lg font-bold text-navy outline-none placeholder:font-normal placeholder:text-mist/40"
        />
        {suffix ? <span className="shrink-0 text-xs font-medium text-mist">{suffix}</span> : null}
      </div>
    </div>
  );
}

/** 结果页的阶段卡:一句结论 + 来源占比条 */
function PhaseCard({ phase }: { phase: Phase }) {
  const sources = [
    { key: 'cpf', label: 'CPF LIFE', value: phase.cpfLife },
    { key: 'other', label: '租金 / 年金', value: phase.otherIncome },
    { key: 'srs', label: 'SRS', value: phase.srsNet },
    { key: 'invest', label: '动用投资资产', value: phase.fromAssets },
  ].filter((s) => s.value > 1);
  const total = sources.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <div className={`rounded-[16px] border p-5 ${phase.short ? 'border-gold/70 bg-[#fffaf0]' : 'border-navy/[0.1] bg-white'}`}>
      <p className="text-[11px] font-semibold tracking-wide text-gold-deep">
        {phase.fromAge}–{phase.toAge} 岁
      </p>
      <p className="mt-1.5 text-[16px] font-black text-navy">{phase.label}</p>
      <p className="mt-1.5 min-h-[34px] text-[11.5px] leading-relaxed text-mist">{phase.note}</p>

      <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-navy/[0.07]">
        {sources.map((s) => (
          <span
            key={s.key}
            style={{ width: `${(s.value / total) * 100}%`, background: SERIES[s.key as keyof typeof SERIES] }}
          />
        ))}
      </div>
      <div className="mt-3 space-y-1">
        {sources.map((s) => (
          <div key={s.key} className="flex items-baseline justify-between gap-3 text-[11.5px]">
            <span className="flex items-center gap-1.5 text-mist">
              <i className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: SERIES[s.key as keyof typeof SERIES] }} />
              {s.label}
            </span>
            <b className="font-bold text-navy">{sgd100(s.value)}</b>
          </div>
        ))}
      </div>
      {phase.short ? (
        <p className="mt-3 border-t border-gold/30 pt-2.5 text-[11.5px] font-semibold text-gold-deep">
          这一阶段投资资产会被用光
        </p>
      ) : null}
    </div>
  );
}
/* -------------------------------------------------------------- 图表 */

/** 所有图表共用的坐标系宽度(viewBox),再按容器等比缩放 */
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
    const cpf = r.cpfLife / defl;
    const other = r.otherIncome / defl;
    const srs = r.srsNet / defl;
    const income = cpf + other + srs;
    return {
      age: r.age,
      spend,
      cpf,
      other,
      srs,
      srsGross: r.srsGross / defl,
      srsTax: r.srsTax / defl,
      assets: Math.max(0, spend - income),
      surplus: Math.max(0, income - spend),
      broken: r.liquidEnd < -0.5,
    };
  });

  const maxV =
    Math.max(...data.map((d) => Math.max(d.spend, d.cpf + d.other + d.srs))) * 1.08 || 1;
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
              {seg(d.cpf, SERIES.cpf, 'c')}
              {seg(d.other, SERIES.other, 'o')}
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
            ...(hovered.cpf > 0
              ? [{ label: 'CPF LIFE', value: sgd100(hovered.cpf), color: SERIES.cpf }]
              : []),
            ...(hovered.other > 0
              ? [{ label: '租金 / 年金等', value: sgd100(hovered.other), color: SERIES.other }]
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
              {seg(d.other, SERIES.lump, 'o')}
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
              ? [{ label: '一次性资产', value: compact(hovered.other), color: SERIES.lump }]
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

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
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
