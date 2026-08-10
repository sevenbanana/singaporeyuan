/**
 * 退休自由度测算引擎 —— 逐年现金流账本
 *
 * 与「单池现值折现」的做法不同,这里按年模拟退休后每一年的收支,
 * 因为只有逐年账本才能表达「这笔钱要到某个年龄才能动」:
 *
 *  - SRS 在「提取年龄」(首次供款时的法定退休年龄,62 / 63 / 64) 之前不计入可用现金流;
 *  - SRS 供款只能缴到提取年龄为止;
 *  - SRS 自提取年龄起分 10 年提取,每次提取 50% 计入应税收入;
 *  - CPF LIFE / 年金 / 租金按各自的开始年龄(默认 65)才开始计入;
 *  - 全程统一年复利,定期投入按年中平均计入。
 *
 * 所有对外的「每月金额」都以今天的购买力表示。
 */

export type Residency = 'citizenPr' | 'foreigner';

/** SRS 每年供款上限 */
export const SRS_CAP: Record<Residency, number> = {
  citizenPr: 15_300,
  foreigner: 35_700,
};

/** 可选的 SRS 提取年龄:取决于首次供款时的法定退休年龄 */
export const SRS_AGES = [62, 63, 64] as const;

/** SRS 达龄后可分摊提取的最长年限 */
export const SRS_SPREAD_YEARS = 10;

/** 提取 SRS 时计入应税收入的比例 */
export const SRS_TAXABLE_SHARE = 0.5;

/** CPF LIFE 「递增计划」的年递增率 */
export const ESCALATING_RATE = 0.02;

/**
 * 新加坡居民个人所得税累进税率(YA2024 起)。
 * 与 components/TaxSavingsCalculator.tsx 内的税表保持一致,
 * 此处保留独立副本以免两个工具互相牵连。
 */
const BRACKETS = [
  { floor: 0, base: 0, rate: 0 },
  { floor: 20_000, base: 0, rate: 0.02 },
  { floor: 30_000, base: 200, rate: 0.035 },
  { floor: 40_000, base: 550, rate: 0.07 },
  { floor: 80_000, base: 3350, rate: 0.115 },
  { floor: 120_000, base: 7950, rate: 0.15 },
  { floor: 160_000, base: 13_950, rate: 0.18 },
  { floor: 200_000, base: 21_150, rate: 0.19 },
  { floor: 240_000, base: 28_750, rate: 0.195 },
  { floor: 280_000, base: 36_550, rate: 0.2 },
  { floor: 320_000, base: 44_550, rate: 0.22 },
  { floor: 500_000, base: 84_150, rate: 0.23 },
  { floor: 1_000_000, base: 199_150, rate: 0.24 },
];

export function residentTax(chargeableIncome: number): number {
  const x = Math.max(0, chargeableIncome);
  const b = [...BRACKETS].reverse().find((k) => x >= k.floor) ?? BRACKETS[0];
  return b.base + (x - b.floor) * b.rate;
}

export type RetirementForm = {
  currentAge: number;
  retirementAge: number;
  planningAge: number;
  /** 今天购买力下的目标月支出 */
  monthlyGoal: number;

  residency: Residency;

  /** 投资资产(不含 CPF、不含 SRS) */
  investments: number;
  monthlyInvest: number;

  srs: number;
  annualSrs: number;
  /** SRS 提取年龄:62 / 63 / 64 */
  srsAge: number;

  /** CPF LIFE、年金、租金等合计,退休开始时的未来月金额 */
  fixedIncome: number;
  /** 上述固定收入的开始年龄(CPF LIFE 默认 65) */
  fixedIncomeStartAge: number;
  /** 固定收入是否逐年递增(CPF LIFE 递增计划 = 每年 +2%) */
  fixedIncomeEscalating: boolean;

  /** 退休当年一次性可动用的其他资产(保单满期金、计划变现的资产等) */
  otherRetirementAssets: number;
};

export type Assumptions = {
  inflation: number;
  preReturn: number;
  srsReturn: number;
  postReturn: number;
};

export type LedgerRow = {
  age: number;
  /** 当年名义支出 */
  spend: number;
  /** 当年名义固定收入 */
  fixedIncome: number;
  /** 当年 SRS 提取毛额 */
  srsGross: number;
  /** 当年 SRS 提取产生的所得税 */
  srsTax: number;
  /** 当年 SRS 提取净额 */
  srsNet: number;
  /** 当年需要从投资资产净提取的金额(负数表示当年有结余) */
  fromAssets: number;
  /** 年末投资资产余额 */
  liquidEnd: number;
  /** 年末 SRS 余额 */
  srsEnd: number;
};

export type SimResult = {
  ok: boolean;
  /** 首次出现资金缺口的年龄 */
  shortfallAge: number | null;
  rows: LedgerRow[];
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * 年复利累积。定期投入按年中平均计入(半年增长),
 * 避免原版「本金按月复利、定期投入按年复利」的口径不一致。
 */
export function accumulate(
  start: number,
  annualFlow: number,
  years: number,
  ratePct: number,
  flowYears = years,
): number {
  const r = ratePct / 100;
  const halfYear = Math.pow(1 + r, 0.5);
  let balance = Math.max(0, start);
  for (let y = 0; y < years; y += 1) {
    balance = balance * (1 + r) + (y < flowYears ? annualFlow * halfYear : 0);
  }
  return balance;
}

/** 退休当天各个池子的余额 */
export function potsAtRetirement(f: RetirementForm, a: Assumptions) {
  const yearsToRetirement = Math.max(0, f.retirementAge - f.currentAge);
  // SRS 只能缴到提取年龄为止(达龄后不得再供款)
  const srsContribYears = clamp(f.srsAge - f.currentAge, 0, yearsToRetirement);

  const invest = accumulate(
    f.investments,
    f.monthlyInvest * 12,
    yearsToRetirement,
    a.preReturn,
  );
  const srs = accumulate(f.srs, f.annualSrs, yearsToRetirement, a.srsReturn, srsContribYears);

  return {
    yearsToRetirement,
    srsContribYears,
    invest,
    srs,
    other: Math.max(0, f.otherRetirementAssets),
    liquid: invest + Math.max(0, f.otherRetirementAssets),
  };
}

/** SRS 实际开始提取的年龄,以及分摊年限 */
export function srsSchedule(f: RetirementForm) {
  const lastAge = f.planningAge - 1;
  const startAge = Math.min(Math.max(f.retirementAge, f.srsAge), lastAge);
  const spreadYears = Math.max(1, Math.min(SRS_SPREAD_YEARS, f.planningAge - startAge));
  return { startAge, spreadYears };
}

/**
 * 按给定的「今日购买力月支出」跑完整退休期的现金流。
 * extraLump 用于反解资产缺口:相当于退休当天额外多出的一笔钱。
 */
export function simulate(
  f: RetirementForm,
  a: Assumptions,
  todayMonthlySpend: number,
  extraLump = 0,
): SimResult {
  const pots = potsAtRetirement(f, a);
  const { startAge: srsStartAge, spreadYears } = srsSchedule(f);

  const infl = a.inflation / 100;
  const post = a.postReturn / 100;
  const srsGrowth = a.srsReturn / 100;

  let liquid = pots.liquid + Math.max(0, extraLump);
  let srsBalance = pots.srs;
  let srsYearsLeft = spreadYears;

  const rows: LedgerRow[] = [];
  let shortfallAge: number | null = null;

  for (let age = f.retirementAge; age < f.planningAge; age += 1) {
    const spend = todayMonthlySpend * 12 * Math.pow(1 + infl, age - f.currentAge);

    let fixedIncome = 0;
    if (age >= f.fixedIncomeStartAge) {
      const escalation = f.fixedIncomeEscalating
        ? Math.pow(1 + ESCALATING_RATE, age - f.fixedIncomeStartAge)
        : 1;
      fixedIncome = f.fixedIncome * 12 * escalation;
    }

    let srsGross = 0;
    let srsTax = 0;
    if (age >= srsStartAge && srsYearsLeft > 0 && srsBalance > 0.5) {
      srsGross = srsBalance / srsYearsLeft;
      srsBalance -= srsGross;
      srsYearsLeft -= 1;
      // 达龄提取:50% 计入当年应税收入
      srsTax = residentTax(srsGross * SRS_TAXABLE_SHARE);
    }
    const srsNet = srsGross - srsTax;

    const fromAssets = spend - fixedIncome - srsNet;
    liquid -= fromAssets;

    if (liquid < -0.5 && shortfallAge === null) shortfallAge = age;

    rows.push({
      age,
      spend,
      fixedIncome,
      srsGross,
      srsTax,
      srsNet,
      fromAssets,
      liquidEnd: liquid,
      srsEnd: srsBalance,
    });

    if (liquid > 0) liquid *= 1 + post;
    srsBalance *= 1 + srsGrowth;
  }

  return { ok: shortfallAge === null, shortfallAge, rows };
}

/** 二分求解:在不出现缺口的前提下,最高能支撑多少「今日购买力月支出」 */
export function solveSustainable(f: RetirementForm, a: Assumptions): number {
  let lo = 0;
  let hi = 200_000;
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (simulate(f, a, mid).ok) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** 二分求解:要达成目标,退休当天还需要额外多少一次性资产 */
export function solveGap(f: RetirementForm, a: Assumptions): number {
  if (simulate(f, a, f.monthlyGoal).ok) return 0;
  let lo = 0;
  let hi = 1;
  // 先把上界撑到可行
  for (let i = 0; i < 60 && !simulate(f, a, f.monthlyGoal, hi).ok; i += 1) hi *= 2;
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (simulate(f, a, f.monthlyGoal, mid).ok) hi = mid;
    else lo = mid;
  }
  return hi;
}

export type Breakdown = { key: string; label: string; value: number };

export type Analysis = {
  yearsToRetirement: number;
  investAtRetirement: number;
  srsAtRetirement: number;
  otherAtRetirement: number;
  availableAtRetirement: number;

  srsContribYears: number;
  srsStartAge: number;
  srsSpreadYears: number;

  /** 账本解:每一年现金都够用的前提下,能支撑的今日购买力月支出 */
  sustainableMonthly: number;
  /**
   * 上限解:只要求「一辈子总量够」,不要求「每一年现金都够」。
   * 当 SRS 未达提取年龄、CPF LIFE 未开始时,中途会出现现金断档,
   * 这个上限就会明显高于账本解。
   */
  sustainableIdeal: number;
  /** 两者之差 = 中途现金断档造成的损失 */
  liquidityCost: number;

  readiness: number;
  goalRun: SimResult;
  assetGap: number;
  extraMonthlyNeeded: number;
  breakdown: Breakdown[];
  spendingFactor: number;

  /** 退休年龄早于 SRS 提取年龄时的过桥提示 */
  bridge: { years: number; lockedAmount: number; shortfallAge: number | null } | null;

  accumulation: { age: number; invest: number; srs: number; other: number }[];
};

export function analyse(f: RetirementForm, a: Assumptions): Analysis {
  const pots = potsAtRetirement(f, a);
  const { startAge: srsStartAge, spreadYears } = srsSchedule(f);
  const post = a.postReturn / 100;
  const infl = a.inflation / 100;

  const sustainableMonthly = solveSustainable(f, a);
  const goalRun = simulate(f, a, f.monthlyGoal);

  // 支出因子:退休时点上,「今日每月 S$1」终身开销的现值
  let spendingFactor = 0;
  for (let age = f.retirementAge; age < f.planningAge; age += 1) {
    spendingFactor +=
      (12 * Math.pow(1 + infl, age - f.currentAge)) / Math.pow(1 + post, age - f.retirementAge);
  }

  // 各来源在退休时点的现值(SRS 提取计划与支出无关,可直接取 goalRun)
  let pvFixed = 0;
  let pvSrsNet = 0;
  for (const row of goalRun.rows) {
    const d = Math.pow(1 + post, row.age - f.retirementAge);
    pvFixed += row.fixedIncome / d;
    pvSrsNet += row.srsNet / d;
  }
  const pvTotal = pots.invest + pots.other + pvFixed + pvSrsNet;
  const sustainableIdeal = spendingFactor > 0 ? pvTotal / spendingFactor : 0;

  // 拆解按现值占比分配到账本解上,保证各段之和等于头条数字
  const share = (v: number) => (pvTotal > 0 ? (v / pvTotal) * sustainableMonthly : 0);
  const breakdown: Breakdown[] = [
    { key: 'fixed', label: 'CPF LIFE / 固定收入', value: share(pvFixed) },
    { key: 'srs', label: 'SRS(已扣提取所得税)', value: share(pvSrsNet) },
    { key: 'other', label: '保单 / 其他资产', value: share(pots.other) },
    { key: 'invest', label: '投资资产', value: share(pots.invest) },
  ];

  const assetGap = solveGap(f, a);
  const fvPerMonthlyDollar = accumulate(0, 12, pots.yearsToRetirement, a.preReturn);
  const extraMonthlyNeeded = fvPerMonthlyDollar > 0 ? assetGap / fvPerMonthlyDollar : 0;

  const bridgeYears = Math.max(0, srsStartAge - f.retirementAge);
  const bridge =
    bridgeYears > 0 && pots.srs > 0
      ? {
          years: bridgeYears,
          lockedAmount: pots.srs,
          shortfallAge:
            goalRun.shortfallAge !== null && goalRun.shortfallAge < srsStartAge
              ? goalRun.shortfallAge
              : null,
        }
      : null;

  // 积累路径:每一年年末各池子的余额(未来金额)
  const accumulation: { age: number; invest: number; srs: number; other: number }[] = [];
  for (let y = 0; y <= pots.yearsToRetirement; y += 1) {
    const age = f.currentAge + y;
    accumulation.push({
      age,
      invest: accumulate(f.investments, f.monthlyInvest * 12, y, a.preReturn),
      srs: accumulate(
        f.srs,
        f.annualSrs,
        y,
        a.srsReturn,
        Math.min(pots.srsContribYears, y),
      ),
      other: y === pots.yearsToRetirement ? pots.other : 0,
    });
  }

  return {
    yearsToRetirement: pots.yearsToRetirement,
    investAtRetirement: pots.invest,
    srsAtRetirement: pots.srs,
    otherAtRetirement: pots.other,
    availableAtRetirement: pots.invest + pots.srs + pots.other,
    srsContribYears: pots.srsContribYears,
    srsStartAge,
    srsSpreadYears: spreadYears,
    sustainableMonthly,
    sustainableIdeal,
    liquidityCost: Math.max(0, sustainableIdeal - sustainableMonthly),
    readiness: f.monthlyGoal > 0 ? (sustainableMonthly / f.monthlyGoal) * 100 : 0,
    goalRun,
    assetGap,
    extraMonthlyNeeded,
    breakdown,
    spendingFactor,
    bridge,
    accumulation,
  };
}

/** 三种情景,所有假设都夹在合理区间内 */
export function scenarios(a: Assumptions) {
  const list = [
    {
      key: 'stress',
      name: '压力情景',
      note: '回报较低、通胀较高',
      assumptions: {
        preReturn: clamp(a.preReturn - 1.5, 0, 12),
        srsReturn: clamp(a.srsReturn - 1, 0, 10),
        postReturn: clamp(a.postReturn - 1, 0, 10),
        inflation: clamp(a.inflation + 0.5, 0, 8),
      },
    },
    {
      key: 'base',
      name: '基础情景',
      note: '按当前设置测算',
      assumptions: { ...a },
    },
    {
      key: 'upside',
      name: '宽松情景',
      note: '回报较高、通胀较低',
      assumptions: {
        preReturn: clamp(a.preReturn + 1.5, 0, 12),
        srsReturn: clamp(a.srsReturn + 1, 0, 10),
        postReturn: clamp(a.postReturn + 1, 0, 10),
        inflation: clamp(a.inflation - 0.25, 0, 8),
      },
    },
  ];
  return list;
}
