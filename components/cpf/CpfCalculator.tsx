'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  INCOME_TEMPLATES,
  officialChecks,
  runScenarios,
  type CareerEventKind,
  type CpfInputs,
  type IncomeTemplate,
  type Scenario,
  type ScenarioKey,
} from '@/lib/cpf/engine';
import { CPF_LIFE_TABLE, INTEREST, YEAR_RULES, rulesFor, type Gender, type PlanKey } from '@/lib/cpf/rules';
import { BalanceChart, IncomePreview, SERIES, STATUS_LABEL, Waterfall } from './charts';
import { Callout, Choice, Group, Legend, NumField, Stepper, Toggle, clamp, compact, num, sgd, sgd10, signed } from './ui';

/* ------------------------------------------------------------ 表单原始值 */

type RawEvent = { id: number; kind: CareerEventKind; fromAge: string; years: string; selfMonthly: string };

type Raw = {
  age: string;
  gender: Gender;
  prYear: 0 | 1 | 2;
  oa: string;
  sa: string;
  ma: string;
  ra: string;

  monthly: string;
  bonusMonths: string;
  growthBefore: number;
  peakAge: number;
  dropAtPeak: number;
  changeAfter: number;
  events: RawEvent[];
  stopWorkAge: string;
  reemployOn: boolean;
  reemployFrom: string;
  reemployCut: number;

  housingMonthly: string;
  housingUntil: string;
  pledge: boolean;
  desired: string;
  otherMonthly: string;
  otherFrom: string;
  lifespan: 90 | 95;

  plan: PlanKey;
  payoutAge: number;
  inflation: number;
  sumGrowth: number;
  discountRate: number;

  lump: string;
  yearly: string;
  selfTopUp: string;
  familyTopUp: string;
  topUpUntil: string;
  deferAge: number;
};

const DEFAULTS: Raw = {
  age: '35',
  gender: 'male',
  prYear: 0,
  oa: '45,000',
  sa: '30,000',
  ma: '28,000',
  ra: '',
  monthly: '6,000',
  bonusMonths: '2',
  ...INCOME_TEMPLATES.plateau.shape,
  events: [],
  stopWorkAge: '63',
  reemployOn: false,
  reemployFrom: '60',
  reemployCut: 20,
  housingMonthly: '1,200',
  housingUntil: '60',
  pledge: false,
  desired: '3,000',
  otherMonthly: '',
  otherFrom: '',
  lifespan: 90,
  plan: 'standard',
  payoutAge: 65,
  inflation: 2,
  sumGrowth: 3.5,
  discountRate: 3,
  lump: '20,000',
  yearly: '5,000',
  selfTopUp: '8,000',
  familyTopUp: '8,000',
  topUpUntil: '',
  deferAge: 70,
};

const TABS = ['现状', '收入', '住房与目标', '领取方式'] as const;

const PLAN_NAME: Record<PlanKey, string> = { standard: '标准计划', basic: '基本计划', escalating: '递增计划' };

const EVENT_NAME: Record<CareerEventKind, string> = { unemployed: '失业', childcare: '育儿停工', self: '转自雇' };

const PANEL = 'rounded-[20px] border border-navy/[0.08] bg-[#fffdf9] shadow-[0_18px_50px_-32px_rgba(26,39,68,0.22)]';
const CARD = `${PANEL} p-5 sm:p-7`;

/* ------------------------------------------------------------------ 主组件 */

export default function CpfCalculator() {
  const [raw, setRaw] = useState<Raw>(DEFAULTS);
  const [tab, setTab] = useState(0);
  const [today, setToday] = useState(true);
  const [selected, setSelected] = useState<ScenarioKey>('baseline');
  const [copied, setCopied] = useState<'idle' | 'done' | 'fallback'>('idle');
  const [resultsInView, setResultsInView] = useState(false);
  // 规则表最后一行的年份;到了新的一年由客户端改成今年,规则按外推值走
  const [startYear, setStartYear] = useState(YEAR_RULES[YEAR_RULES.length - 1].year);
  const nextEventId = useRef(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStartYear((y) => Math.max(y, new Date().getFullYear()));
  }, []);

  const set = <K extends keyof Raw>(key: K, value: Raw[K]) => setRaw((p) => ({ ...p, [key]: value }));

  /* ---- 原始值 → 引擎输入:所有夹取都在这里 ---- */
  const inputs: CpfInputs = useMemo(() => {
    const age = clamp(Math.round(num(raw.age)), 20, 64);
    const stopWorkAge = clamp(Math.round(num(raw.stopWorkAge)), age, 80);
    return {
      startYear,
      age,
      gender: raw.gender,
      prYear: raw.prYear,
      oa: clamp(num(raw.oa), 0, 5_000_000),
      sa: age < 55 ? clamp(num(raw.sa), 0, 5_000_000) : 0,
      ma: clamp(num(raw.ma), 0, 1_000_000),
      ra: age >= 55 ? clamp(num(raw.ra), 0, 5_000_000) : 0,
      income: {
        monthly: clamp(num(raw.monthly), 0, 200_000),
        bonusMonths: clamp(num(raw.bonusMonths), 0, 24),
        growthBefore: raw.growthBefore,
        peakAge: raw.peakAge,
        dropAtPeak: raw.dropAtPeak,
        changeAfter: raw.changeAfter,
      },
      events: raw.events.map((e) => ({
        id: String(e.id),
        kind: e.kind,
        fromAge: clamp(Math.round(num(e.fromAge)), age, 80),
        years: clamp(Math.round(num(e.years)), 0, 40),
        selfMonthly: clamp(num(e.selfMonthly), 0, 200_000),
      })),
      stopWorkAge,
      reemploy: { on: raw.reemployOn, fromAge: clamp(Math.round(num(raw.reemployFrom)), 50, 80), cut: raw.reemployCut },
      housing: { monthly: clamp(num(raw.housingMonthly), 0, 50_000), untilAge: clamp(Math.round(num(raw.housingUntil)), 0, 95) },
      pledge: raw.pledge,
      plan: raw.plan,
      payoutAge: raw.payoutAge,
      desiredMonthly: clamp(num(raw.desired), 0, 100_000),
      otherMonthly: clamp(num(raw.otherMonthly), 0, 100_000),
      otherFromAge: raw.otherFrom === '' ? stopWorkAge : clamp(Math.round(num(raw.otherFrom)), age, 100),
      lifespan: raw.lifespan,
      inflation: raw.inflation,
      sumGrowth: raw.sumGrowth,
      discountRate: raw.discountRate,
      actions: {
        oaToSaLump: 0,
        oaToSaYearly: 0,
        selfTopUpYearly: 0,
        topUpUntilAge: 0,
        familyTopUpYearly: 0,
        oaToRaToErs: false,
      },
    };
  }, [raw, startYear]);

  const params = useMemo(
    () => ({
      lump: clamp(num(raw.lump), 0, 1_000_000),
      yearly: clamp(num(raw.yearly), 0, 200_000),
      selfTopUp: clamp(num(raw.selfTopUp), 0, 500_000),
      familyTopUp: clamp(num(raw.familyTopUp), 0, 500_000),
      topUpUntilAge:
        raw.topUpUntil === '' ? Math.max(inputs.age + 1, inputs.stopWorkAge) : clamp(Math.round(num(raw.topUpUntil)), inputs.age + 1, 95),
      deferAge: raw.deferAge,
    }),
    [raw.lump, raw.yearly, raw.selfTopUp, raw.familyTopUp, raw.topUpUntil, raw.deferAge, inputs.age, inputs.stopWorkAge],
  );

  const scenarios = useMemo(() => runScenarios(inputs, params), [inputs, params]);
  const base = scenarios[0];
  const view = scenarios.find((s) => s.key === selected && s.available) ?? base;
  const { sim, gaps } = view;
  const vIn = view.inputs;
  const checks = useMemo(() => officialChecks(), []);

  const defl = (age: number) => Math.pow(1 + inputs.inflation / 100, age - inputs.age);
  const lifeToday = sim.startMonthly / defl(vIn.payoutAge);
  const before55 = inputs.age < 55;
  const R = rulesFor(startYear, inputs.sumGrowth);
  const cohortFrsToday = sim.cohort.frs / defl(55);

  const activeTemplate = (Object.keys(INCOME_TEMPLATES) as IncomeTemplate[]).find((k) => {
    const s = INCOME_TEMPLATES[k].shape;
    return s.growthBefore === raw.growthBefore && s.peakAge === raw.peakAge && s.dropAtPeak === raw.dropAtPeak && s.changeAfter === raw.changeAfter;
  });

  /* ---- 手机上:填写时底部显示一条结果摘要,看到结果区后让位给预约条 ---- */
  useEffect(() => {
    const el = resultsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setResultsInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.body.dataset.cpfView = resultsInView ? 'result' : 'form';
    return () => {
      delete document.body.dataset.cpfView;
    };
  }, [resultsInView]);

  const scrollToResults = () => {
    const top = resultsRef.current?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 80, behavior: 'smooth' });
  };

  const pick = (key: ScenarioKey) => {
    setSelected(key);
    scrollToResults();
  };

  /* ---- 输入面板每一页 ---- */
  const tabBody = [
    /* 现状 */
    <div key="now" className="space-y-6">
      <Group title="关于你">
        <div className="grid grid-cols-2 gap-3">
          <NumField id="cpf-age" label="现在几岁" help="20–64 岁" suffix="岁" value={raw.age} onChange={(v) => set('age', v)} />
          <Choice
            label="性别"
            help="女性月领略低"
            value={raw.gender}
            cols={2}
            onChange={(v) => set('gender', v)}
            options={[
              { value: 'male', label: '男' },
              { value: 'female', label: '女' },
            ]}
          />
        </div>
        <Choice
          label="身份"
          help="新 PR 头两年适用较低的阶梯缴费率"
          value={raw.prYear}
          onChange={(v) => set('prYear', v)}
          options={[
            { value: 0, label: '公民 / PR', sub: 'PR 已满两年' },
            { value: 1, label: 'PR 第 1 年', sub: '合计 9%' },
            { value: 2, label: 'PR 第 2 年', sub: '合计 24%' },
          ]}
        />
      </Group>
      <Group title="现在的 CPF 余额" note="CPF App 首页就能看到">
        <div className="grid grid-cols-2 gap-3">
          <NumField id="cpf-oa" label="OA 普通账户" prefix="S$" money value={raw.oa} onChange={(v) => set('oa', v)} />
          {before55 ? (
            <NumField id="cpf-sa" label="SA 特别账户" prefix="S$" money value={raw.sa} onChange={(v) => set('sa', v)} />
          ) : (
            <NumField id="cpf-ra" label="RA 退休账户" prefix="S$" money value={raw.ra} onChange={(v) => set('ra', v)} />
          )}
          <NumField id="cpf-ma" label="MA 保健储蓄" prefix="S$" money value={raw.ma} onChange={(v) => set('ma', v)} />
        </div>
        {!before55 ? (
          <Callout title="你已经过了 55 岁" tone="navy">
            SA 已经关闭,RA 按你 {sim.cohort.year} 年满 55 岁那一届的 FRS({sgd(sim.cohort.frs)})计算。
          </Callout>
        ) : null}
      </Group>
    </div>,

    /* 收入 */
    <div key="income" className="space-y-6">
      <Group title="现在的收入">
        <div className="grid grid-cols-2 gap-3">
          <NumField id="cpf-salary" label="月薪(税前)" prefix="S$" money value={raw.monthly} onChange={(v) => set('monthly', v)} />
          <NumField id="cpf-bonus" label="每年花红" suffix="个月" value={raw.bonusMonths} onChange={(v) => set('bonusMonths', v)} />
        </div>
        <p className="text-[11px] leading-relaxed text-mist">
          月薪超过 {sgd(R.owCeiling)} 的部分不缴 CPF;连花红在内一年最多按 {sgd(R.annualCeiling)} 缴,封顶 {sgd(R.annualLimit)}。
        </p>
      </Group>

      <Group title="收入曲线" note="先选模板,再微调">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(INCOME_TEMPLATES) as IncomeTemplate[]).map((k) => {
            const t = INCOME_TEMPLATES[k];
            const active = activeTemplate === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={active}
                onClick={() => setRaw((p) => ({ ...p, ...t.shape }))}
                className={`rounded-xl border px-2.5 py-2.5 text-left transition-all ${
                  active ? 'border-navy bg-navy text-cream' : 'border-navy/15 bg-white text-navy hover:border-gold'
                }`}
              >
                <TemplateGlyph kind={k} active={active} />
                <span className="mt-1.5 block text-[12.5px] font-bold">{t.name}</span>
                <span className={`mt-0.5 block text-[10.5px] leading-snug ${active ? 'text-cream/70' : 'text-mist'}`}>{t.note}</span>
              </button>
            );
          })}
        </div>
        <div className="grid gap-2">
          <Stepper id="g-before" label="峰值前每年涨" value={raw.growthBefore} min={-5} max={15} onChange={(v) => set('growthBefore', v)} />
          <Stepper id="g-peak" label="峰值年龄" value={raw.peakAge} step={1} min={30} max={65} unit=" 岁" digits={0} onChange={(v) => set('peakAge', v)} />
          <Stepper id="g-drop" label="过峰值后一次性下调" value={raw.dropAtPeak} step={5} min={0} max={70} digits={0} onChange={(v) => set('dropAtPeak', v)} />
          <Stepper id="g-after" label="之后每年变化" value={raw.changeAfter} min={-10} max={8} onChange={(v) => set('changeAfter', v)} />
        </div>
        <IncomePreview rows={base.sim.rows} ceiling={R.owCeiling} stopAge={inputs.stopWorkAge} />
        <Legend
          items={[
            [STATUS_LABEL.work, SERIES.oa],
            ...(raw.reemployOn ? ([[STATUS_LABEL.reemploy, '#7d9fd6']] as [string, string][]) : []),
            ...(raw.events.some((e) => e.kind === 'self') ? ([[STATUS_LABEL.self, SERIES.ma]] as [string, string][]) : []),
            ...(raw.events.some((e) => e.kind !== 'self') ? ([['没有收入', '#d9d2c3']] as [string, string][]) : []),
          ]}
        />
      </Group>

      <Group title="职业中断" note="失业、育儿停工、转自雇">
        {raw.events.map((e, i) => (
          <div key={e.id} className="rounded-xl border border-navy/10 bg-sand-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-navy">事件 {i + 1}</span>
              <button
                type="button"
                onClick={() => set('events', raw.events.filter((x) => x.id !== e.id))}
                className="text-[11.5px] font-semibold text-gold-deep underline-offset-2 hover:underline"
              >
                删除
              </button>
            </div>
            <div className="mt-2">
              <Choice
                value={e.kind}
                onChange={(kind) => set('events', raw.events.map((x) => (x.id === e.id ? { ...x, kind } : x)))}
                options={(Object.keys(EVENT_NAME) as CareerEventKind[]).map((k) => ({ value: k, label: EVENT_NAME[k] }))}
              />
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <NumField id={`ev-from-${e.id}`} label="从几岁" suffix="岁" value={e.fromAge} onChange={(v) => set('events', raw.events.map((x) => (x.id === e.id ? { ...x, fromAge: v } : x)))} />
              <NumField id={`ev-years-${e.id}`} label="持续" suffix="年" value={e.years} onChange={(v) => set('events', raw.events.map((x) => (x.id === e.id ? { ...x, years: v } : x)))} />
              {e.kind === 'self' ? (
                <div className="col-span-2">
                  <NumField id={`ev-self-${e.id}`} label="自雇月净收入" prefix="S$" money value={e.selfMonthly} onChange={(v) => set('events', raw.events.map((x) => (x.id === e.id ? { ...x, selfMonthly: v } : x)))} />
                </div>
              ) : null}
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-mist">
              {e.kind === 'self'
                ? '自雇只缴 MA(按年龄 8%–10.5%),OA 和 SA 这几年没有新钱进来。'
                : '这几年没有缴费,账户只靠利息增长;结束后按收入曲线恢复。'}
            </p>
          </div>
        ))}
        {raw.events.length < 4 ? (
          <button
            type="button"
            onClick={() =>
              set('events', [
                ...raw.events,
                { id: nextEventId.current++, kind: 'unemployed', fromAge: String(Math.min(inputs.age + 10, 60)), years: '2', selfMonthly: '4,000' },
              ])
            }
            className="w-full rounded-xl border border-dashed border-gold/60 bg-gold/[0.05] py-2.5 text-[12.5px] font-bold text-gold-deep transition-colors hover:bg-gold/10"
          >
            + 加一段中断
          </button>
        ) : null}
      </Group>

      <Group title="什么时候不再工作">
        <NumField
          id="cpf-stop"
          label="你打算几岁停止工作"
          help="由你决定,不预设 65 岁;之后不再缴费,RA 只靠利息增长"
          suffix="岁"
          value={raw.stopWorkAge}
          onChange={(v) => set('stopWorkAge', v)}
        />
        <Toggle
          checked={raw.reemployOn}
          onChange={(v) => set('reemployOn', v)}
          label="60 岁后再雇佣,降薪继续做"
          help="从下面的年龄起按降薪后的月薪缴费,一直做到停止工作"
        />
        {raw.reemployOn ? (
          <>
            <NumField id="cpf-reemp" label="从几岁起再雇佣" suffix="岁" value={raw.reemployFrom} onChange={(v) => set('reemployFrom', v)} />
            <Stepper id="cpf-cut" label="月薪下调" value={raw.reemployCut} step={5} min={0} max={70} digits={0} onChange={(v) => set('reemployCut', v)} />
          </>
        ) : null}
      </Group>
    </div>,

    /* 住房与目标 */
    <div key="goal" className="space-y-6">
      <Group title="住房:用 OA 付房贷" note="影响最大的一项">
        <div className="grid grid-cols-2 gap-3">
          <NumField id="cpf-house" label="每月从 OA 扣" prefix="S$" money value={raw.housingMonthly} onChange={(v) => set('housingMonthly', v)} />
          <NumField id="cpf-house-until" label="扣到几岁" suffix="岁" value={raw.housingUntil} onChange={(v) => set('housingUntil', v)} />
        </div>
        <p className="text-[11px] leading-relaxed text-mist">
          不填房贷,OA 会被严重高估。OA 不够扣时,差额视为你用现金付。
        </p>
        <Toggle
          checked={raw.pledge}
          onChange={(v) => set('pledge', v)}
          label="55 岁时用房产 pledge,RA 只留 BRS"
          help="名下房产剩余租约够你住到 95 岁才可以选;多出来的可以提取,但每月领得更少"
        />
      </Group>
      <Group title="退休目标" note="都按今天的购买力填">
        <NumField
          id="cpf-desired"
          label="期望退休月收入"
          help={`按每年 ${inputs.inflation}% 通胀换算:${vIn.payoutAge} 岁那年约 ${sgd10(gaps.desiredAt)}/月`}
          prefix="S$"
          suffix="/ 月"
          money
          value={raw.desired}
          onChange={(v) => set('desired', v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <NumField id="cpf-other" label="其他退休收入" help="租金、年金、SRS 等" prefix="S$" suffix="/月" money value={raw.otherMonthly} onChange={(v) => set('otherMonthly', v)} />
          <NumField id="cpf-other-from" label="从几岁开始" help={`留空 = 停工那年(${inputs.stopWorkAge} 岁)`} suffix="岁" value={raw.otherFrom} onChange={(v) => set('otherFrom', v)} />
        </div>
        <Choice
          label="规划到几岁"
          help="用来把月缺口折成一笔钱"
          value={raw.lifespan}
          cols={2}
          onChange={(v) => set('lifespan', v)}
          options={[
            { value: 90, label: '90 岁' },
            { value: 95, label: '95 岁' },
          ]}
        />
      </Group>
    </div>,

    /* 领取方式 */
    <div key="payout" className="space-y-6">
      <Group title="CPF LIFE 计划">
        <Choice
          value={raw.plan}
          onChange={(v) => set('plan', v)}
          options={[
            { value: 'standard', label: '标准计划', sub: '每月固定' },
            { value: 'basic', label: '基本计划', sub: '月领少些,留给家人多' },
            { value: 'escalating', label: '递增计划', sub: '起步低约 20%,每年 +2%' },
          ]}
        />
      </Group>
      <Group title="从几岁开始领">
        <Choice
          help="每推迟一年,月领最多多 7%;最晚 70 岁"
          value={raw.payoutAge}
          cols={6}
          onChange={(v) => set('payoutAge', v)}
          options={[65, 66, 67, 68, 69, 70].map((a) => ({ value: a, label: String(a) }))}
        />
      </Group>
      <Group title="测算假设">
        <Stepper id="a-infl" label="期望退休金通胀" value={raw.inflation} min={0} max={6} onChange={(v) => set('inflation', v)} hint="把今天的生活费换算成未来的名义金额" />
        <Stepper
          id="a-sums"
          label="FRS / BRS 每年上调"
          value={raw.sumGrowth}
          min={0}
          max={6}
          onChange={(v) => set('sumGrowth', v)}
          hint="2026、2027 年都约 3.5%;55 岁前的「达到 FRS」是个移动目标"
        />
        <Stepper id="a-disc" label="退休资产年回报" value={raw.discountRate} min={0} max={8} onChange={(v) => set('discountRate', v)} hint="用来把月缺口折成一笔钱" />
      </Group>
    </div>,
  ];

  /* ---- 方案对比 ---- */
  const scenarioCards = scenarios.map((s) => (
    <ScenarioCard
      key={s.key}
      s={s}
      base={base}
      defl={defl}
      selected={view.key === s.key}
      before55={before55}
      onPick={() => pick(s.key)}
    />
  ));

  const summaryText = [
    'CPF 退休计算器 · 新加坡小圆姐',
    `${inputs.age} 岁,${inputs.stopWorkAge} 岁停止工作,${vIn.payoutAge} 岁起领 CPF LIFE(${PLAN_NAME[vIn.plan]})`,
    `55 岁那年(${sim.cohort.year})的 FRS 预计 ${sgd(sim.cohort.frs)},约等于今天的 ${sgd(cohortFrsToday)}`,
    `CPF LIFE 约 ${sgd10(sim.startMonthly)}/月,相当于今天的 ${sgd10(lifeToday)}/月`,
    `期望退休金 ${sgd(inputs.desiredMonthly)}/月(今天的购买力)`,
    `月收入缺口:${gaps.monthlyGapToday > 5 ? `${sgd10(gaps.monthlyGapToday)}/月(今天的购买力)` : '已覆盖'}`,
    `${vIn.payoutAge} 岁时的资本缺口(用到 ${inputs.lifespan} 岁):${compact(gaps.capitalGap)}`,
    gaps.bridge ? `过桥缺口(${gaps.bridge.fromAge}–${gaps.bridge.toAge} 岁):${compact(gaps.bridge.need)},可提取 OA 抵扣后 ${compact(gaps.bridge.net)}` : '无过桥缺口',
    view.key !== 'baseline' ? `当前查看方案:${view.title}` : '',
    '本结果仅作退休规划示意,请以 CPF 官方估算为准。',
  ]
    .filter(Boolean)
    .join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied('done');
      window.setTimeout(() => setCopied('idle'), 2400);
    } catch {
      setCopied('fallback');
    }
  };

  const steps = [
    { label: '期望\n退休金', value: gaps.desiredAt / defl(vIn.payoutAge), color: SERIES.navy, kind: 'total' as const },
    { label: 'CPF\nLIFE', value: gaps.lifeAt / defl(vIn.payoutAge), color: SERIES.ra, kind: 'minus' as const },
    ...(gaps.otherAt > 0 ? [{ label: '其他\n收入', value: gaps.otherAt / defl(vIn.payoutAge), color: SERIES.ma, kind: 'minus' as const }] : []),
    { label: gaps.surplusToday > 5 ? '盈余' : '月缺口', value: gaps.surplusToday > 5 ? gaps.surplusToday : gaps.monthlyGapToday, color: SERIES.sa, kind: 'result' as const },
  ];

  const f = sim.formation;
  // 过渡期的缴费率按满 55 岁那年的规则
  const rules55 = rulesFor(startYear + Math.max(0, 55 - inputs.age), inputs.sumGrowth);
  const r55 = rules55.rates.find((b) => b.fromAge === 55)!;
  const r60 = rules55.rates.find((b) => b.fromAge === 60)!;

  return (
    <div className="container-wide py-10 md:py-14">
      {/* 填写时把底部预约条换成结果摘要;选择器不加引号,避免 hydration 转义差异 */}
      <style>{`body[data-cpf-view=form] [data-mobile-cta]{display:none}`}</style>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12.5px] text-mist">
        <span>无需留下联系方式</span>
        <i aria-hidden className="h-1 w-1 rounded-full bg-gold/60" />
        <span>数据只在你的浏览器里计算</span>
        <i aria-hidden className="h-1 w-1 rounded-full bg-gold/60" />
        <span>规则按 CPF {YEAR_RULES[YEAR_RULES.length - 1].year} 年公布值</span>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
        {/* ============================================================ 输入 */}
        <div className={`${PANEL} min-w-0 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7rem)] lg:flex-col`}>
          <div className="border-b border-navy/[0.08] p-4 sm:px-6">
            <p className="eyebrow">填写你的情况</p>
            <div role="tablist" aria-label="输入分组" className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-sand-100 p-1">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
                  className={`rounded-lg px-1 py-2 text-[12px] font-bold transition-all sm:text-[12.5px] ${
                    tab === i ? 'bg-white text-navy shadow-sm' : 'text-mist hover:text-navy'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div role="tabpanel" className="p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {tabBody[tab]}
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-navy/[0.08] pt-4">
              {tab > 0 ? (
                <button type="button" onClick={() => setTab(tab - 1)} className="text-[12.5px] font-semibold text-mist hover:text-navy">
                  ← {TABS[tab - 1]}
                </button>
              ) : (
                <span />
              )}
              {tab < TABS.length - 1 ? (
                <button type="button" onClick={() => setTab(tab + 1)} className="rounded-[10px] bg-navy px-4 py-2.5 text-[12.5px] font-bold text-cream hover:bg-navy-700">
                  下一项:{TABS[tab + 1]} →
                </button>
              ) : (
                <button type="button" onClick={scrollToResults} className="rounded-[10px] bg-navy px-4 py-2.5 text-[12.5px] font-bold text-cream hover:bg-navy-700 lg:hidden">
                  看结果 ↓
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ 结果 */}
        <div ref={resultsRef} className="min-w-0 scroll-mt-24 space-y-5" aria-live="polite">
          {view.key !== 'baseline' ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/50 bg-[#fffaf0] px-4 py-3 text-[13px]">
              <span className="text-navy">
                正在查看方案:<b>{view.title}</b>
              </span>
              <button type="button" onClick={() => setSelected('baseline')} className="font-semibold text-gold-deep underline-offset-2 hover:underline">
                返回基准
              </button>
            </div>
          ) : null}

          {/* ---- 头条 ---- */}
          <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#172a4b] to-[#223b64] p-6 text-cream shadow-[0_28px_70px_-32px_rgba(22,42,75,0.75)] sm:p-9">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-gold/15" />
            <p className="eyebrow text-gold-light">
              {vIn.payoutAge} 岁起 · CPF LIFE {PLAN_NAME[vIn.plan]}
            </p>
            <p className="mt-3 text-[14px] text-cream/75">每月可以领到</p>
            <p className="mt-1 text-[clamp(40px,7vw,64px)] font-black leading-[1.1] tracking-[-0.045em] text-gold-light">
              {sgd10(sim.startMonthly)}
              <span className="ml-1.5 align-middle text-base font-medium tracking-normal text-cream/60">/ 月</span>
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-cream/70">
              这是 {sim.cohort.year + (vIn.payoutAge - 55)} 年的名义金额,约等于<b className="text-cream">今天的 {sgd10(lifeToday)}/月</b>
              {vIn.plan === 'escalating' ? ',之后每年 +2%' : ',此后终身不变'}。
            </p>
            {sim.belowCpfLife ? (
              <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-[12px] leading-relaxed text-cream/85">
                领取时 RA 不到 S$60,000,不会自动加入 CPF LIFE,而是按退休存款计划(RSS)每月领,领完为止。上面的数字只作参考。
              </p>
            ) : null}

            <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
              <HeroTile
                label="月收入缺口"
                value={gaps.monthlyGapToday > 5 ? `${sgd10(gaps.monthlyGapToday)}/月` : '已覆盖'}
                note={gaps.monthlyGapToday > 5 ? '今天的购买力' : gaps.surplusToday > 5 ? `盈余 ${sgd10(gaps.surplusToday)}/月` : '期望退休金'}
              />
              <HeroTile
                label={`${vIn.payoutAge} 岁的资本缺口`}
                value={gaps.capitalGap > 100 ? compact(gaps.capitalGap) : '无'}
                note={`用到 ${inputs.lifespan} 岁 · 今天约 ${compact(gaps.capitalGapToday)}`}
              />
              <HeroTile
                label="过桥缺口"
                value={gaps.bridge ? compact(gaps.bridge.net) : '无'}
                note={gaps.bridge ? `${gaps.bridge.fromAge}–${gaps.bridge.toAge} 岁 · 已扣可提取 OA` : `${inputs.stopWorkAge} 岁才停工`}
              />
            </div>
          </div>

          {/* ---- 四个阶段 ---- */}
          <div className={CARD}>
            <p className="eyebrow">一生的四个阶段</p>
            <h3 className="mt-2 text-[20px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[23px]">
              CPF 的规则在 55 岁和 {vIn.payoutAge} 岁各变一次
            </h3>
            <ol className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
              <PhaseBox
                n="①"
                range={before55 ? `${inputs.age}–54 岁` : '已经过了'}
                title="累积期"
                muted={!before55}
                lines={
                  before55
                    ? [
                        `OA 2.5%、SA / MA 4%,前 S$60K 再多 1%`,
                        `MA 超过 BHS(今年 ${sgd(R.bhs)})溢出到 SA`,
                        `54 岁年末:SA ${compact(sim.rows.find((r) => r.age === 54)?.sa ?? 0)} · OA ${compact(sim.rows.find((r) => r.age === 54)?.oa ?? 0)}`,
                      ]
                    : ['SA 已关闭,不再有 OA 转 SA']
                }
              />
              <PhaseBox
                n="②"
                range={`55 岁 · ${sim.cohort.year} 年`}
                title="开 RA、关 SA"
                highlight
                lines={
                  f
                    ? [
                        `目标:${raw.pledge ? 'BRS' : 'FRS'} ${sgd(f.target)}(今天约 ${compact(f.target / defl(55))})`,
                        `SA 转入 ${compact(f.fromSa)}${f.fromOa > 0 ? `,OA 补 ${compact(f.fromOa)}` : ''}`,
                        f.saToOa > 0 ? `SA 多出 ${compact(f.saToOa)} 转进 OA,改按 2.5% 计息` : 'SA 没有剩余',
                        f.shortfall > 1 ? `还差 ${compact(f.shortfall)} 才凑满` : '已凑满 ✓',
                      ]
                    : [`那一届 FRS ${sgd(sim.cohort.frs)}`, `现在 RA ${compact(inputs.ra)}`]
                }
              />
              <PhaseBox
                n="③"
                range={`55–${vIn.payoutAge - 1} 岁`}
                title="过渡期"
                lines={[
                  `缴费 ${r55.employer + r55.employee}% → ${r60.employer + r60.employee}%,其中 ${r55.sra}% / ${r60.sra}% 进 RA`,
                  'RA 满当年 FRS 后,这部分改进 OA',
                  `${inputs.stopWorkAge < vIn.payoutAge ? `${Math.max(inputs.stopWorkAge, 55)} 岁起不工作:RA 只靠利息` : '一直工作到领取'}`,
                  `${vIn.payoutAge} 岁时 RA ${compact(sim.premium)}`,
                ]}
              />
              <PhaseBox
                n="④"
                range={`${vIn.payoutAge} 岁起`}
                title="领取期"
                lines={[
                  `RA 全部转为 CPF LIFE 保费`,
                  `${PLAN_NAME[vIn.plan]}:${sgd10(sim.startMonthly)}/月`,
                  `按官方对照表插值,不自己推公式`,
                ]}
              />
            </ol>
          </div>

          {/* ---- 余额图 ---- */}
          <div className={CARD}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">各户头余额 · 逐年模拟</p>
                <h3 className="mt-2 text-[20px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[23px]">
                  55 岁那一刻,SA 变成 RA
                </h3>
              </div>
              <Choice
                value={today ? 1 : 0}
                cols={2}
                onChange={(v) => setToday(v === 1)}
                options={[
                  { value: 1, label: '今天币值' },
                  { value: 0, label: '名义金额' },
                ]}
              />
            </div>
            <BalanceChart
              rows={sim.rows}
              age0={inputs.age}
              inflation={inputs.inflation}
              today={today}
              payoutAge={vIn.payoutAge}
              showUntil={Math.min(inputs.lifespan, vIn.payoutAge + 5)}
              cohortFrs={sim.cohort.frs}
              pledgeTarget={raw.pledge ? sim.cohort.brs : null}
            />
            <Legend
              items={[
                ['OA 普通账户', SERIES.oa],
                ['SA 特别账户(55 岁前)', SERIES.sa],
                ['RA 退休账户(55 岁起)', SERIES.ra],
                ['MA 保健储蓄', SERIES.ma],
              ]}
            />
            <p className="mt-3 text-[12px] leading-[1.8] text-mist">
              虚线是<b className="text-navy">当年的 FRS</b>:它每年上调约 {inputs.sumGrowth}%,所以「凑满 FRS」是个移动的目标。
              你 {sim.cohort.year} 年满 55 岁,那时的 FRS 预计 <b className="text-navy">{sgd(sim.cohort.frs)}</b>,
              约等于今天的 <b className="text-navy">{sgd(cohortFrsToday)}</b>。{vIn.payoutAge} 岁之后 OA / MA 继续计息,图上只画到 {Math.min(inputs.lifespan, vIn.payoutAge + 5)} 岁。
              点按图表可以看当年明细。
            </p>
          </div>

          {/* ---- 三层缺口 ---- */}
          <div className={CARD}>
            <p className="eyebrow">缺口分三层 · {vIn.payoutAge} 岁那年 · 今天币值</p>
            <h3 className="mt-2 text-[20px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[23px]">
              从期望退休金一路减到缺口
            </h3>
            <Waterfall steps={steps} />
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <GapCard
                n="1"
                title="月收入缺口"
                value={gaps.monthlyGapToday > 5 ? `${sgd10(gaps.monthlyGapToday)}/月` : '已覆盖'}
                body={
                  <>
                    期望退休金 − (CPF LIFE + 其他收入)。名义上是 {vIn.payoutAge} 岁那年的 {sgd10(gaps.monthlyGap)}/月。
                    {vIn.plan !== 'escalating' ? ' CPF LIFE 金额固定,生活费却跟着通胀涨,所以缺口会逐年变大。' : ''}
                  </>
                }
              />
              <GapCard
                n="2"
                title={`${vIn.payoutAge} 岁的资本缺口`}
                value={gaps.capitalGap > 100 ? compact(gaps.capitalGap) : '无'}
                body={
                  <>
                    把每年的缺口按 {inputs.discountRate}% 回报折回 {vIn.payoutAge} 岁,用到 {inputs.lifespan} 岁,约等于今天的 {compact(gaps.capitalGapToday)}。
                    {gaps.oaAtStart > 1000 ? ` 届时 OA 里还有约 ${compact(gaps.oaAtStart)} 可提取,能抵掉一部分。` : ''}
                  </>
                }
              />
              <GapCard
                n="3"
                title="过桥缺口"
                value={gaps.bridge ? compact(gaps.bridge.net) : '无'}
                body={
                  gaps.bridge ? (
                    <>
                      {gaps.bridge.fromAge} 岁停工到 {gaps.bridge.toAge} 岁开始领,{gaps.bridge.years} 年生活费合计 {compact(gaps.bridge.need)}
                      {gaps.bridge.needFrom55 > 0
                        ? `;55 岁后的部分可用可提取的 OA(约 ${compact(gaps.bridge.oaAvailable)})抵扣。`
                        : '。这段在 55 岁前,OA 还不能提取。'}
                    </>
                  ) : (
                    <>你工作到 {inputs.stopWorkAge} 岁,CPF LIFE {vIn.payoutAge} 岁开始,中间没有断档。</>
                  )
                }
              />
            </div>
          </div>

          {/* ---- 方案对比 ---- */}
          <div className={CARD}>
            <p className="eyebrow">方案对比 · 并排看</p>
            <h3 className="mt-2 text-[20px] font-black leading-snug tracking-[-0.02em] text-navy md:text-[23px]">
              多领的每一块钱,都锁住了一部分流动性
            </h3>
            <div className="mt-4">
              <Callout title="转进 SA / RA 的钱不可逆">
                OA 转 SA、OA 转 RA、现金填补都<b className="text-navy">不能撤回</b>:转进去之后不能再用来付房贷,也不能在 55 岁提取,
                只能等开始领取后按月领回。每张卡片的「失去的流动性」就是这部分钱。
              </Callout>
            </div>
            <details className="group mt-4 rounded-[14px] border border-navy/10 bg-sand-50">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className="text-[13px] font-bold text-navy">调整方案参数</span>
                <span className="ml-auto text-[11px] text-mist">金额、年限、推迟到几岁</span>
                <span aria-hidden className="text-gold-deep transition-transform duration-300 group-open:rotate-45">＋</span>
              </summary>
              <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 xl:grid-cols-3">
                <NumField id="p-lump" label="OA 一次性转 SA" prefix="S$" money value={raw.lump} onChange={(v) => set('lump', v)} />
                <NumField id="p-yearly" label="OA 每年转 SA" prefix="S$" suffix="/年" money value={raw.yearly} onChange={(v) => set('yearly', v)} />
                <NumField id="p-self" label="每年现金填补给自己" help="税务减免上限 S$8,000" prefix="S$" suffix="/年" money value={raw.selfTopUp} onChange={(v) => set('selfTopUp', v)} />
                <NumField id="p-family" label="每年现金填补给家人" help="另享最多 S$8,000 减免" prefix="S$" suffix="/年" money value={raw.familyTopUp} onChange={(v) => set('familyTopUp', v)} />
                <NumField id="p-until" label="填补做到几岁" help={`留空 = 停工为止(${inputs.stopWorkAge} 岁)`} suffix="岁" value={raw.topUpUntil} onChange={(v) => set('topUpUntil', v)} />
                <Choice
                  label="推迟到几岁领"
                  value={raw.deferAge}
                  cols={3}
                  onChange={(v) => set('deferAge', v)}
                  options={[66, 67, 68, 69, 70].filter((a) => a > inputs.payoutAge || a === 70).map((a) => ({ value: a, label: `${a} 岁` }))}
                />
              </div>
            </details>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{scenarioCards}</div>
            <p className="mt-4 text-[11.5px] leading-relaxed text-mist">
              每个方案都在「不做任何操作」的基础上只改这一项。月领取额与缺口都折成今天的购买力;失去的流动性是名义金额。
              点「看明细」可以把上面的图表切换到这个方案。
            </p>
          </div>

          {/* ---- 逐年明细 ---- */}
          <details className={`${CARD} group`}>
            <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
              <span className="text-[15px] font-black text-navy">逐年明细表</span>
              <span className="ml-auto text-[11px] text-mist">{today ? '今天币值' : '名义金额'} · 年末余额</span>
              <span aria-hidden className="text-gold-deep transition-transform duration-300 group-open:rotate-45">＋</span>
            </summary>
            <YearTable rows={sim.rows} age0={inputs.age} inflation={inputs.inflation} today={today} />
          </details>

          {/* ---- 校验 ---- */}
          <details className={`${CARD} group`}>
            <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
              <span className="text-[15px] font-black text-navy">和 CPF 官方数字对一对</span>
              <span className="ml-auto text-[11px] text-mist">模型校验</span>
              <span aria-hidden className="text-gold-deep transition-transform duration-300 group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-4 text-[12.5px] leading-[1.85] text-mist">
              CPF 公布过 {CPF_LIFE_TABLE.cohort} 年满 55 岁会员的示例:55 岁 RA 存多少、65 岁或 70 岁起每月领多少(男性、标准计划、按 4% 计)。
              把同样的条件喂给本工具,结果如下:
            </p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-navy/10">
              <table className="w-full min-w-[420px] text-[12.5px]">
                <thead className="bg-sand-50 text-left text-mist">
                  <tr>
                    <th className="px-3 py-2 font-semibold">55 岁 RA</th>
                    <th className="px-3 py-2 font-semibold">起领</th>
                    <th className="px-3 py-2 text-right font-semibold">官方</th>
                    <th className="px-3 py-2 text-right font-semibold">本工具</th>
                    <th className="px-3 py-2 text-right font-semibold">误差</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums text-navy">
                  {checks.map((c) => (
                    <tr key={`${c.ra55}-${c.startAge}`} className="border-t border-navy/[0.07]">
                      <td className="px-3 py-2">
                        {sgd(c.ra55)}
                        {c.label.startsWith('RA') ? '' : <span className="ml-1 text-mist">{c.label}</span>}
                      </td>
                      <td className="px-3 py-2">{c.startAge} 岁</td>
                      <td className="px-3 py-2 text-right">{sgd(c.official)}</td>
                      <td className="px-3 py-2 text-right font-bold">{sgd(c.engine)}</td>
                      <td className="px-3 py-2 text-right">{((c.engine / c.official - 1) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[12px] leading-[1.85] text-mist">
              本工具系统性偏高约 2%:官方示例里 RA 从 55 到 65 岁大约只按 9.5 年计息(FRS {sgd(220_400)} → {sgd(330_100)}),
              这里按满 10 年逐月计算。对外使用前,建议用同一组输入再跑一次
              <a
                href="https://www.cpf.gov.sg/member/tools-and-services/calculators/monthly-payout-estimator"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 border-b border-gold/50 font-semibold text-gold-deep"
              >
                CPF 官方退休月入估算器 ↗
              </a>
              对照。
            </p>
          </details>

          {/* ---- 规则参数 ---- */}
          <details className={`${CARD} group`}>
            <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
              <span className="text-[15px] font-black text-navy">用到的 CPF 规则参数</span>
              <span className="ml-auto text-[11px] text-mist">{R.year} 年</span>
              <span aria-hidden className="text-gold-deep transition-transform duration-300 group-open:rotate-45">＋</span>
            </summary>
            <RulesTable year={startYear} sumGrowth={inputs.sumGrowth} />
          </details>

          {/* ---- 保存 ---- */}
          <div className="rounded-[20px] bg-gradient-to-br from-navy to-navy-deep p-6 text-cream md:p-8">
            <p className="eyebrow text-gold-light">下一步</p>
            <h3 className="mt-2 text-lg font-black md:text-xl">先存下这份测算,再决定要不要转、要不要填</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/70">
              转入 SA / RA 不可逆,适不适合要结合房贷、应急金、保险和其他退休资产一起看。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={copy} className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy transition-all hover:bg-gold-light">
                {copied === 'done' ? '已复制 ✓' : '复制测算摘要'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition-all hover:border-gold hover:text-gold-light"
              >
                打印 / 存成 PDF
              </button>
            </div>
            {copied === 'fallback' ? (
              <textarea
                readOnly
                aria-label="测算摘要文本"
                value={summaryText}
                rows={8}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-4 w-full rounded-xl border border-cream/20 bg-navy-deep/60 p-3 text-xs leading-relaxed text-cream/90 outline-none"
              />
            ) : null}
          </div>

          <p className="border-t border-navy/10 pt-6 text-xs leading-[1.9] text-mist">
            <b className="text-navy">重要说明:</b> 本工具按 CPF {YEAR_RULES[YEAR_RULES.length - 1].year} 年公布的缴费率、分配率、工资上限、
            退休存款与利率逐月模拟,未公布年份的 FRS / BRS / BHS 按设定增幅外推;CPF LIFE 月领额按 CPF 官方公布的示例对照表插值,
            基本计划、递增计划与女性的系数为近似值。未计入:低于 S$750 月薪的缴费率、自雇 S$18,000 以下的 MA 费率、
            房屋出售退回 OA、55 岁提取 S$5,000、投资 CPFIS、MediSave 支出与保费扣款等。新 PR 阶梯费率的分配按全额比例缩放。
            结果仅用于退休教育与方向讨论,不构成财务、税务或产品建议;CPF 的实际数字请以 CPF Board 为准。
          </p>
        </div>
      </div>

      {/* ---- 手机:填写时的结果摘要条 ---- */}
      {!resultsInView ? (
        <button
          type="button"
          onClick={scrollToResults}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-2xl border border-gold/40 bg-navy px-4 py-3 text-left text-cream shadow-[0_18px_40px_-16px_rgba(19,29,51,0.8)] md:hidden"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-cream/60">{vIn.payoutAge} 岁起 CPF LIFE · 今天币值</span>
            <span className="block truncate text-[15px] font-black">
              {sgd10(lifeToday)}/月
              <span className="ml-2 text-[12px] font-semibold text-gold-light">
                {gaps.monthlyGapToday > 5 ? `缺 ${sgd10(gaps.monthlyGapToday)}/月` : '已覆盖'}
              </span>
            </span>
          </span>
          <span className="shrink-0 rounded-lg bg-gold px-3 py-2 text-[12px] font-bold text-navy">看结果 ↓</span>
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- 结果小组件 */

function HeroTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[14px] border border-white/10 bg-white/[0.06] px-4 py-3">
      <p className="text-[11.5px] text-cream/60">{label}</p>
      <p className="mt-1 text-[22px] font-black tracking-[-0.03em] text-cream">{value}</p>
      <p className="mt-0.5 text-[11px] text-cream/50">{note}</p>
    </div>
  );
}

function PhaseBox({
  n,
  range,
  title,
  lines,
  highlight,
  muted,
}: {
  n: string;
  range: string;
  title: string;
  lines: string[];
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <li
      className={`rounded-[14px] border p-4 ${
        highlight ? 'border-gold/60 bg-[#fffaf0]' : muted ? 'border-navy/[0.08] bg-sand-50 opacity-70' : 'border-navy/10 bg-white'
      }`}
    >
      <p className="text-[11px] font-semibold tracking-wide text-gold-deep">
        {n} {range}
      </p>
      <p className="mt-1 text-[15px] font-black text-navy">{title}</p>
      <ul className="mt-2 space-y-1 text-[11.5px] leading-[1.65] text-mist">
        {lines.map((l) => (
          <li key={l} className="flex gap-1.5">
            <span aria-hidden className="text-gold">·</span>
            <span>{l}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

function GapCard({ n, title, value, body }: { n: string; title: string; value: string; body: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-navy/10 bg-white p-4">
      <p className="flex items-center gap-2 text-[12px] font-bold text-navy">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-navy text-[10.5px] text-cream">{n}</span>
        {title}
      </p>
      <p className="mt-2 text-[22px] font-black tracking-[-0.03em] text-navy">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-[1.75] text-mist">{body}</p>
    </div>
  );
}

function ScenarioCard({
  s,
  base,
  defl,
  selected,
  before55,
  onPick,
}: {
  s: Scenario;
  base: Scenario;
  defl: (age: number) => number;
  selected: boolean;
  before55: boolean;
  onPick: () => void;
}) {
  const life = s.sim.startMonthly / defl(s.inputs.payoutAge);
  const baseLife = base.sim.startMonthly / defl(base.inputs.payoutAge);
  const gap = s.gaps.monthlyGapToday;
  const isBase = s.key === 'baseline';
  const extra: string[] = [];
  if (s.available && !isBase) {
    if ((s.key === 'oaToSaLump' || s.key === 'oaToSaYearly' || s.key === 'cashTopUp' || s.key === 'oaToRa') && before55) {
      extra.push(`55 岁可提取 OA ${signed(s.oa55Delta, compact)}`);
    }
    if (s.key === 'cashTopUp' && s.sim.taxSaved > 0) {
      extra.push(`省税约 ${sgd10(s.sim.taxSavedFirstYear)}/年,合计 ${compact(s.sim.taxSaved)}`);
    }
    const bridgeDelta = (s.gaps.bridge?.net ?? 0) - (base.gaps.bridge?.net ?? 0);
    if (Math.abs(bridgeDelta) > 100) extra.push(`过桥缺口 ${signed(bridgeDelta, compact)}`);
    if (Math.abs(life - baseLife) < 5 && s.key !== 'defer') {
      extra.push('月领不变:RA 在 55 岁已封顶,多出来的钱回到 OA');
    }
  }

  return (
    <div
      className={`flex flex-col rounded-[16px] border p-4 transition-all ${
        !s.available
          ? 'border-navy/[0.08] bg-sand-50 opacity-60'
          : selected
            ? 'border-gold bg-[#fffaf0] shadow-[0_14px_34px_-20px_rgba(127,89,37,0.6)]'
            : 'border-navy/10 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14.5px] font-black leading-snug text-navy">{s.title}</p>
        {s.irreversible && s.available ? (
          <span className="shrink-0 rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[10.5px] font-bold text-gold-deep">不可逆</span>
        ) : null}
      </div>
      <p className="mt-1 min-h-[32px] text-[11.5px] leading-snug text-mist">{s.available ? s.note : s.reason}</p>
      {s.available ? (
        <>
          <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-navy/[0.08] pt-3">
            <Stat label="月领取额" value={sgd10(life)} delta={isBase ? undefined : signed(life - baseLife, sgd10)} good={life >= baseLife} />
            <Stat
              label="月缺口"
              value={gap > 5 ? sgd10(gap) : '无'}
              delta={isBase ? undefined : signed(gap - base.gaps.monthlyGapToday, sgd10)}
              good={gap <= base.gaps.monthlyGapToday}
            />
            <Stat label="失去的流动性" value={s.locked > 0 ? compact(s.locked) : '—'} />
          </dl>
          <p className="mt-2 text-[10.5px] leading-snug text-mist">{s.lockedLabel}</p>
          {extra.length ? (
            <ul className="mt-2 space-y-0.5 text-[11px] leading-snug text-navy/75">
              {extra.map((x) => (
                <li key={x}>· {x}</li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            onClick={onPick}
            className="mt-auto self-start pt-3 text-[12px] font-semibold text-gold-deep underline-offset-2 hover:underline"
          >
            {selected ? '正在查看 ✓' : '看明细 →'}
          </button>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value, delta, good }: { label: string; value: string; delta?: string; good?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10.5px] text-mist">{label}</dt>
      <dd className="mt-0.5 truncate text-[15px] font-black tracking-[-0.02em] text-navy">{value}</dd>
      {delta && delta !== '±0' ? (
        <dd className={`text-[10.5px] font-semibold ${good ? 'text-[#0e7a6e]' : 'text-[#a8432a]'}`}>{delta}</dd>
      ) : null}
    </div>
  );
}

function TemplateGlyph({ kind, active }: { kind: IncomeTemplate; active: boolean }) {
  const d =
    kind === 'plateau'
      ? 'M2 20 L14 12 L24 7 L38 6'
      : kind === 'decline45'
        ? 'M2 20 L14 12 L22 8 L24 13 L38 16'
        : 'M2 20 L10 8 L16 5 L20 10 L38 17';
  return (
    <svg width="40" height="22" viewBox="0 0 40 22" fill="none" aria-hidden>
      <path d={d} stroke={active ? '#dcc088' : '#2f6cc4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function YearTable({ rows, age0, inflation, today }: { rows: CpfRow[]; age0: number; inflation: number; today: boolean }) {
  const d = (age: number) => (today ? Math.pow(1 + inflation / 100, age - age0) : 1);
  return (
    <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-navy/10">
      <table className="w-full min-w-[640px] text-[12px]">
        <thead className="sticky top-0 bg-sand-50 text-left text-mist">
          <tr>
            {['年龄', '状态', '月薪', 'OA', 'SA', 'RA', 'MA', 'CPF LIFE/月'].map((h) => (
              <th key={h} className="px-2.5 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums text-navy">
          {rows.map((r) => {
            const k = d(r.age + 1);
            return (
              <tr key={r.age} className={`border-t border-navy/[0.06] ${r.age === 55 ? 'bg-[#fffaf0]' : ''}`}>
                <td className="px-2.5 py-1.5 font-bold">{r.age}</td>
                <td className="px-2.5 py-1.5 text-mist">{STATUS_LABEL[r.status]}</td>
                <td className="px-2.5 py-1.5">{r.wage > 0 ? compact(r.wage / d(r.age)) : '—'}</td>
                <td className="px-2.5 py-1.5">{compact(r.oa / k)}</td>
                <td className="px-2.5 py-1.5">{r.sa > 0.5 ? compact(r.sa / k) : '—'}</td>
                <td className="px-2.5 py-1.5">{r.ra > 0.5 ? compact(r.ra / k) : '—'}</td>
                <td className="px-2.5 py-1.5">{compact(r.ma / k)}</td>
                <td className="px-2.5 py-1.5">{r.life > 0 ? sgd10(r.life / d(r.age)) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type CpfRow = Scenario['sim']['rows'][number];

function RulesTable({ year, sumGrowth }: { year: number; sumGrowth: number }) {
  const R = rulesFor(year, sumGrowth);
  const bandName = (i: number) => {
    const from = R.rates[i].fromAge;
    const to = R.rates[i + 1]?.fromAge;
    if (from === 0) return `${to} 岁及以下`;
    return to ? `${from}–${to} 岁` : `${from} 岁以上`;
  };
  return (
    <div className="mt-4 space-y-4">
      <div className="overflow-x-auto rounded-xl border border-navy/10">
        <table className="w-full min-w-[480px] text-[12px]">
          <thead className="bg-sand-50 text-left text-mist">
            <tr>
              {['年龄段', '雇主', '雇员', '→ OA', '→ SA / RA', '→ MA'].map((h) => (
                <th key={h} className="px-2.5 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums text-navy">
            {R.rates.map((b, i) => (
              <tr key={b.fromAge} className="border-t border-navy/[0.06]">
                <td className="px-2.5 py-1.5">{bandName(i)}</td>
                <td className="px-2.5 py-1.5">{b.employer}%</td>
                <td className="px-2.5 py-1.5">{b.employee}%</td>
                <td className="px-2.5 py-1.5">{b.oa}%</td>
                <td className="px-2.5 py-1.5">{b.sra}%</td>
                <td className="px-2.5 py-1.5">{b.ma}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="grid gap-x-6 gap-y-1.5 text-[12px] sm:grid-cols-2">
        {[
          ['月薪上限(OW)', sgd(R.owCeiling)],
          ['年度工资上限', sgd(R.annualCeiling)],
          ['年度缴费上限', sgd(R.annualLimit)],
          [`${R.year} 年 BRS / FRS / ERS`, `${sgd(R.brs)} / ${sgd(R.frs)} / ${sgd(R.ers)}`],
          ['BHS 基本医疗储蓄顶限', sgd(R.bhs)],
          ['利率', `OA ${INTEREST.oa}% · SA / MA / RA ${INTEREST.smra}%`],
          ['额外利息(55 岁前)', '前 S$60K 多 1%(OA 最多算 S$20K)'],
          ['额外利息(55 岁起)', '前 S$30K 多 2%,再 S$30K 多 1%'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-navy/[0.06] py-1.5">
            <dt className="text-mist">{k}</dt>
            <dd className="text-right font-semibold text-navy">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[11.5px] leading-relaxed text-mist">
        55 岁起「SA / RA」一栏进 RA,RA 满当年 FRS 后改进 OA。新 PR 第 1 / 2 年合计费率分别约 9% / 24%(55 岁以下)。
        所有参数集中放在一张按年份的配置表里,CPF 每年调整后只需更新那张表。
      </p>
    </div>
  );
}
