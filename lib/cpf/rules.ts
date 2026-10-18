/**
 * CPF 规则配置表 —— 每年 CPF 调整规则时,只改这个文件,不用动引擎。
 *
 * 结构:
 *  - YEAR_RULES:按年份一行,写当年已公布的缴费率、分配率、工资上限、BRS/FRS/ERS、BHS。
 *    引擎取「不晚于该年份的最后一行」;没公布的未来年份,退休存款与 BHS 按 PROJECTION 的增长率外推。
 *  - INTEREST:基础利率与额外利息档位。
 *  - CPF_LIFE_TABLE:CPF 官方公布的「RA 余额 → 每月领取额」对照表,引擎只做插值,不推导年金公式。
 *
 * 年龄口径:CPF 的「35 岁以上」指满 35 岁之后的月份。这里统一用「已满年龄」,
 * fromAge = 35 表示已满 35 岁(含 35 岁零几个月)起适用。
 */

/** 一个年龄段的缴费与分配,全部是「占工资的百分比」 */
export type RateBand = {
  fromAge: number;
  employer: number;
  employee: number;
  /** 分配到 OA 的部分 */
  oa: number;
  /** 分配到 SA 的部分;55 岁起 SA 关闭,这一栏进 RA(RA 满当年 FRS 后转进 OA) */
  sra: number;
  /** 分配到 MA 的部分 */
  ma: number;
};

/** 新 PR 头两年的阶梯缴费率(G/G,雇主与雇员都按阶梯),只存总费率;分配按全额费率等比缩放 */
export type GraduatedBand = { fromAge: number; year1: number; year2: number };

export type YearRules = {
  year: number;
  /** 普通工资(OW)月上限 */
  owCeiling: number;
  /** 年度工资上限(OW + AW 合计) */
  annualCeiling: number;
  /** 年度缴费上限 = 37% × 年度工资上限 */
  annualLimit: number;
  /** 当年满 55 岁的会员适用的三档退休存款 */
  brs: number;
  frs: number;
  ers: number;
  /** 基本医疗储蓄顶限(满 65 岁那年起对该会员固定) */
  bhs: number;
  rates: RateBand[];
  sprGraduated: GraduatedBand[];
  /** 自雇人士只缴 MA:按年龄段的 MA 缴费率(年净收入超过 S$18,000 的档位) */
  selfEmployedMa: { fromAge: number; rate: number }[];
};

const RATES_UNDER_55: RateBand[] = [
  { fromAge: 0, employer: 17, employee: 20, oa: 23, sra: 6, ma: 8 },
  { fromAge: 35, employer: 17, employee: 20, oa: 21, sra: 7, ma: 9 },
  { fromAge: 45, employer: 17, employee: 20, oa: 19, sra: 8, ma: 10 },
  { fromAge: 50, employer: 17, employee: 20, oa: 15, sra: 11.5, ma: 10.5 },
];

const RATES_ABOVE_65: RateBand[] = [
  { fromAge: 65, employer: 9, employee: 7.5, oa: 1, sra: 5, ma: 10.5 },
  { fromAge: 70, employer: 7.5, employee: 5, oa: 1, sra: 1, ma: 10.5 },
];

/** 2016 年起未变 */
const SPR_GRADUATED: GraduatedBand[] = [
  { fromAge: 0, year1: 9, year2: 24 },
  { fromAge: 55, year1: 9, year2: 18.5 },
  { fromAge: 60, year1: 8.5, year2: 11 },
  { fromAge: 65, year1: 8.5, year2: 8.5 },
];

const SELF_EMPLOYED_MA = [
  { fromAge: 0, rate: 8 },
  { fromAge: 35, rate: 9 },
  { fromAge: 45, rate: 10 },
  { fromAge: 50, rate: 10.5 },
];

/** 只有退休存款的历史行:给「已经 55 岁以上」的用户查自己那一届的 FRS / BRS */
const SUMS_ONLY: Pick<YearRules, 'year' | 'brs' | 'frs' | 'ers'>[] = [
  { year: 2016, brs: 80_500, frs: 161_000, ers: 241_500 },
  { year: 2017, brs: 83_000, frs: 166_000, ers: 249_000 },
  { year: 2018, brs: 85_500, frs: 171_000, ers: 256_500 },
  { year: 2019, brs: 88_000, frs: 176_000, ers: 264_000 },
  { year: 2020, brs: 90_500, frs: 181_000, ers: 271_500 },
  { year: 2021, brs: 93_000, frs: 186_000, ers: 279_000 },
  { year: 2022, brs: 96_000, frs: 192_000, ers: 288_000 },
  { year: 2023, brs: 99_400, frs: 198_800, ers: 298_200 },
  { year: 2024, brs: 102_900, frs: 205_800, ers: 308_700 },
];

export const YEAR_RULES: YearRules[] = [
  {
    year: 2025,
    owCeiling: 7_400,
    annualCeiling: 102_000,
    annualLimit: 37_740,
    brs: 106_500,
    frs: 213_000,
    ers: 426_000,
    bhs: 75_500,
    rates: [
      ...RATES_UNDER_55,
      { fromAge: 55, employer: 15.5, employee: 17, oa: 12, sra: 10, ma: 10.5 },
      { fromAge: 60, employer: 12, employee: 11.5, oa: 3.5, sra: 9.5, ma: 10.5 },
      ...RATES_ABOVE_65,
    ],
    sprGraduated: SPR_GRADUATED,
    selfEmployedMa: SELF_EMPLOYED_MA,
  },
  {
    // 2026:月薪上限升到 S$8,000;55–65 岁缴费率各上调 1.5 个百分点,新增部分全部进 RA
    year: 2026,
    owCeiling: 8_000,
    annualCeiling: 102_000,
    annualLimit: 37_740,
    brs: 110_200,
    frs: 220_400,
    ers: 440_800,
    bhs: 79_000,
    rates: [
      ...RATES_UNDER_55,
      { fromAge: 55, employer: 16, employee: 18, oa: 12, sra: 11.5, ma: 10.5 },
      { fromAge: 60, employer: 12.5, employee: 12.5, oa: 3.5, sra: 11, ma: 10.5 },
      ...RATES_ABOVE_65,
    ],
    sprGraduated: SPR_GRADUATED,
    selfEmployedMa: SELF_EMPLOYED_MA,
  },
];

/** 已公布、但缴费率等其他参数还没公布的年份:只覆盖退休存款 */
const SUMS_ANNOUNCED: Pick<YearRules, 'year' | 'brs' | 'frs' | 'ers'>[] = [
  { year: 2027, brs: 114_100, frs: 228_200, ers: 456_400 },
];

/** 外推假设:界面上可调,这里是默认值 */
export const PROJECTION = {
  /** 未公布年份 FRS / BRS / ERS 的年增幅(2026、2027 都是约 3.5%) */
  retirementSumGrowth: 3.5,
  /** 未公布年份 BHS 的年增幅(2025 → 2026 约 4.6%) */
  bhsGrowth: 4.5,
};

export const INTEREST = {
  /** 年利率 */
  oa: 2.5,
  /** SA / MA / RA 的 4% 保底,已延长至 2027 年底 */
  smra: 4,
  /** 额外利息:计入合并余额时 OA 最多算 S$20,000 */
  oaExtraCap: 20_000,
  /** 55 岁以下:前 S$60,000 额外 1% */
  extraBelow55: [{ upTo: 60_000, rate: 1 }],
  /** 55 岁及以上:前 S$30,000 额外 2%,再往上 S$30,000 额外 1% */
  extra55Plus: [
    { upTo: 30_000, rate: 2 },
    { upTo: 60_000, rate: 1 },
  ],
};

/** 自愿转账 / 填补的上限与税务减免 */
export const VOLUNTARY = {
  /** 现金填补给自己的税务减免上限 */
  selfTopUpRelief: 8_000,
  /** 现金填补给家人的税务减免上限 */
  familyTopUpRelief: 8_000,
};

export type PlanKey = 'standard' | 'basic' | 'escalating';
export type Gender = 'male' | 'female';

/**
 * CPF LIFE 对照表。
 * 来源:CPF Board「How the CPF retirement sum affects your payouts」(2026 年 9 月更新),
 * 2026 年满 55 岁、男性、标准计划(Standard Plan)、按 4% 利率估算。
 * from70 只在官方给出时填写;没给的行,引擎按相邻行的「70 岁 / 65 岁」倍数插值。
 *
 * 每年 CPF 更新这张表时,把新数字替换进来即可。
 */
export const CPF_LIFE_TABLE = {
  cohort: 2026,
  rows: [
    { ra55: 50_000, ra65: 82_400, from65: 490, from70: 670 },
    { ra55: 110_200, ra65: 170_200, from65: 950 },
    { ra55: 220_400, ra65: 330_100, from65: 1_780 },
    { ra55: 440_800, ra65: 650_100, from65: 3_440, from70: 4_580 },
  ] as { ra55: number; ra65: number; from65: number; from70?: number }[],
  /** 低于这个 RA 余额,65 岁不会自动加入 CPF LIFE,改按退休存款计划(RSS)领取 */
  minForCpfLife: 60_000,
  /** 把 65 岁之后才进 RA 的钱折回 65 岁时所用的利率(官方表的假设) */
  tableRate: 4,
};

/**
 * 三种计划相对标准计划的起始月领倍数。
 * 官方只公布标准计划的对照表;另外两种按 CPF LIFE 估算器的典型差距近似:
 * 递增计划起步约低 20%、此后每年 +2%;基本计划约低 9%,留给家人的更多。
 */
export const PLANS: Record<PlanKey, { factor: number; escalation: number }> = {
  standard: { factor: 1, escalation: 0 },
  basic: { factor: 0.91, escalation: 0 },
  escalating: { factor: 0.79, escalation: 2 },
};

/** 官方表以男性为例;女性预期寿命更长,同样的 RA 月领略低,这里按约 5% 近似 */
export const GENDER_FACTOR: Record<Gender, number> = { male: 1, female: 0.95 };

/* ------------------------------------------------------------ 取数函数 */

const round100 = (v: number) => Math.round(v / 100) * 100;

function lastRow(): YearRules {
  return YEAR_RULES[YEAR_RULES.length - 1];
}

/** 某一年的完整规则:缴费率等取最近一行已公布的,退休存款按公布值或外推 */
export function rulesFor(year: number, sumGrowth = PROJECTION.retirementSumGrowth, bhsGrowth = PROJECTION.bhsGrowth): YearRules {
  const base = [...YEAR_RULES].reverse().find((r) => r.year <= year) ?? YEAR_RULES[0];
  return { ...base, year, ...retirementSums(year, sumGrowth), bhs: bhsFor(year, bhsGrowth) };
}

/** 某一年满 55 岁的会员那一届的 BRS / FRS / ERS(也是该年的「当前」数值) */
export function retirementSums(year: number, growth = PROJECTION.retirementSumGrowth) {
  const known = [...SUMS_ONLY, ...YEAR_RULES, ...SUMS_ANNOUNCED].sort((a, b) => a.year - b.year);
  const exact = known.find((r) => r.year === year);
  if (exact) return { brs: exact.brs, frs: exact.frs, ers: exact.ers };
  if (year < known[0].year) {
    const first = known[0];
    return { brs: first.brs, frs: first.frs, ers: first.ers };
  }
  const anchor = known[known.length - 1];
  const g = Math.pow(1 + growth / 100, year - anchor.year);
  // FRS 外推后取整到百位;BRS = FRS ÷ 2,ERS = FRS × 2(2025 年起的关系)
  const frs = round100(anchor.frs * g);
  return { brs: frs / 2, frs, ers: frs * 2 };
}

export function bhsFor(year: number, growth = PROJECTION.bhsGrowth): number {
  const last = lastRow();
  const exact = YEAR_RULES.find((r) => r.year === year);
  if (exact) return exact.bhs;
  if (year < YEAR_RULES[0].year) return YEAR_RULES[0].bhs;
  return round100(last.bhs * Math.pow(1 + growth / 100, year - last.year));
}

/** 按已满年龄挑出所在年龄段 */
export function bandFor<T extends { fromAge: number }>(bands: T[], age: number): T {
  let pick = bands[0];
  for (const b of bands) if (age >= b.fromAge) pick = b;
  return pick;
}
