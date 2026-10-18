/**
 * CPF 一生分阶段模拟引擎
 *
 * 不是一条直线外推,而是按年龄逐月走一遍,每个阶段套用不同的规则:
 *
 *  ① 55 岁前(累积期):按年龄段分配 OA / SA / MA,月薪与年度工资封顶;
 *     OA 2.5%、SA / MA 4%,外加额外利息;MA 超过 BHS 的部分溢出到 SA(SA 满 FRS 后进 OA);
 *     OA 转 SA 只在这一阶段可做,最多转到当年 FRS。
 *  ② 55 岁节点:开设 RA,先用 SA、不够再用 OA,凑到 FRS(有房产选 pledge 则只留 BRS);
 *     SA 关闭,剩余 SA 转入 OA,从此按 2.5% 计息。
 *  ③ 55 岁到开始领取:缴费里原本进 SA 的那部分进 RA,直到当年 FRS;
 *     可以把 OA 转进 RA 或现金填补 RA,上限都是当年 ERS;不工作时 RA 只靠利息增长。
 *  ④ 开始领取(65–70 岁):RA 全部变成 CPF LIFE 保费,月领取额用 CPF 官方对照表插值,
 *     不自己推导年金公式。
 *
 * 利息按月计提、每个模拟年末入账(和 CPF 一样按年复利)。所有金额都是名义金额,
 * 需要「今天的购买力」时由调用方按通胀折回。
 */

import { residentTax } from '../retirement';
import {
  CPF_LIFE_TABLE,
  GENDER_FACTOR,
  INTEREST,
  PLANS,
  VOLUNTARY,
  bandFor,
  retirementSums,
  rulesFor,
  type Gender,
  type PlanKey,
} from './rules';

/* ------------------------------------------------------------------ 输入 */

export type WorkStatus = 'work' | 'reemploy' | 'unemployed' | 'childcare' | 'self' | 'retired';
export type IncomeTemplate = 'plateau' | 'decline45' | 'cyclical';

export type IncomeShape = {
  /** 现在的月薪(普通工资 OW,税前) */
  monthly: number;
  /** 每年花红月数(额外工资 AW) */
  bonusMonths: number;
  /** 峰值之前每年涨幅 % */
  growthBefore: number;
  peakAge: number;
  /** 过了峰值那一年一次性下调 %(转岗、被优化) */
  dropAtPeak: number;
  /** 峰值之后每年变化 %(负数 = 逐年下滑) */
  changeAfter: number;
};

export const INCOME_TEMPLATES: Record<
  IncomeTemplate,
  { name: string; note: string; shape: Omit<IncomeShape, 'monthly' | 'bonusMonths'> }
> = {
  plateau: {
    name: '稳定上升',
    note: '一路稳步上涨,50 岁左右进入平台期',
    shape: { growthBefore: 4, peakAge: 50, dropAtPeak: 0, changeAfter: 0 },
  },
  decline45: {
    name: '45 岁后下滑',
    note: '转岗或被优化:收入下一个台阶,之后缓慢走低',
    shape: { growthBefore: 4, peakAge: 45, dropAtPeak: 20, changeAfter: -2 },
  },
  cyclical: {
    name: '前高后低',
    note: '行业周期型:年轻时涨得快,40 岁后回落',
    shape: { growthBefore: 7, peakAge: 40, dropAtPeak: 15, changeAfter: -3 },
  },
};

export type CareerEventKind = 'unemployed' | 'childcare' | 'self';

export type CareerEvent = {
  id: string;
  kind: CareerEventKind;
  fromAge: number;
  years: number;
  /** 自雇期间的月净收入(只缴 MA) */
  selfMonthly: number;
};

/** 自愿操作:方案对比就是在基准上分别打开其中一项 */
export type Actions = {
  /** 现在一次性把 OA 转进 SA(仅限 55 岁前,SA 最多到当年 FRS) */
  oaToSaLump: number;
  /** 每年把 OA 转进 SA,一直做到 55 岁 */
  oaToSaYearly: number;
  /** 每年现金填补给自己(55 岁前进 SA、之后进 RA) */
  selfTopUpYearly: number;
  /** 填补(含给家人)做到几岁为止(不含该岁) */
  topUpUntilAge: number;
  /** 每年现金填补给家人:不进自己的户头,只带来税务减免 */
  familyTopUpYearly: number;
  /** 55 岁起每年把 OA 转进 RA,填到当年 ERS */
  oaToRaToErs: boolean;
};

export const NO_ACTIONS: Actions = {
  oaToSaLump: 0,
  oaToSaYearly: 0,
  selfTopUpYearly: 0,
  topUpUntilAge: 0,
  familyTopUpYearly: 0,
  oaToRaToErs: false,
};

export type CpfInputs = {
  /** 模拟开始的年份(今年) */
  startYear: number;
  age: number;
  gender: Gender;
  /** 0 = 公民,或成为 PR 已满两年;1 / 2 = 今年是成为 PR 的第 1 / 2 年 */
  prYear: 0 | 1 | 2;
  oa: number;
  /** 55 岁以下才有 SA */
  sa: number;
  ma: number;
  /** 55 岁以上才有 RA */
  ra: number;

  income: IncomeShape;
  events: CareerEvent[];
  /** 停止工作的年龄:由用户自己填,不默认 65 */
  stopWorkAge: number;
  /** 再雇佣:从某个年龄起降薪继续做 */
  reemploy: { on: boolean; fromAge: number; cut: number };
  /** 每月从 OA 扣的房贷,扣到几岁 */
  housing: { monthly: number; untilAge: number };
  /** 有房产,55 岁时选择 pledge,RA 只留 BRS */
  pledge: boolean;

  plan: PlanKey;
  /** 开始领取 CPF LIFE 的年龄:65–70 */
  payoutAge: number;

  /** 期望退休月收入,今天的购买力 */
  desiredMonthly: number;
  /** 其他退休收入(租金、年金、SRS 等),今天的购买力,随通胀增长 */
  otherMonthly: number;
  otherFromAge: number;
  /** 规划到几岁:90 或 95 */
  lifespan: number;

  /** 期望退休金的通胀 % */
  inflation: number;
  /** FRS / BRS 未公布年份的年增幅 % */
  sumGrowth: number;
  /** 把月缺口折成一笔钱时用的年回报 % */
  discountRate: number;

  actions: Actions;
};

/* ------------------------------------------------------------------ 输出 */

export type YearRow = {
  age: number;
  year: number;
  status: WorkStatus;
  /** 当年月薪(未封顶);自雇时为月净收入 */
  wage: number;
  /** 当年进 CPF 的缴费合计 */
  contrib: number;
  /** 当年从 OA 扣掉的房贷 */
  housing: number;
  /** 当年自愿从 OA 转出的金额 */
  moved: number;
  /** 当年现金填补给自己的金额 */
  cash: number;
  /** 年初(当年节点与操作之后)的余额;55 岁起 OA 这部分可以提取 */
  oaStart: number;
  saStart: number;
  maStart: number;
  raStart: number;
  /** 年末余额 */
  oa: number;
  sa: number;
  ma: number;
  ra: number;
  /** 当年每月领到的 CPF LIFE(未领取为 0) */
  life: number;
  /** 当年的 FRS:55 岁前它每年都在涨 */
  frsNow: number;
};

export type Formation55 = {
  year: number;
  /** RA 要凑到的目标:FRS,或 pledge 时的 BRS */
  target: number;
  fromSa: number;
  fromOa: number;
  /** SA 关闭后转进 OA 的余额 */
  saToOa: number;
  /** 凑完之后的 RA */
  ra: number;
  /** 离目标还差多少 */
  shortfall: number;
};

export type SimResult = {
  rows: YearRow[];
  /** 自己那一届(满 55 岁那年)的 BRS / FRS / ERS */
  cohort: { year: number; brs: number; frs: number; ers: number };
  /** 已经 55 岁以上时为 null */
  formation: Formation55 | null;
  /** 65 岁时 RA 余额 */
  ra65: number;
  /** 开始领取那一刻的保费(RA 全额) */
  premium: number;
  /** 折回 65 岁口径的保费,用来查官方对照表 */
  premium65: number;
  /** 第一年的每月 CPF LIFE */
  startMonthly: number;
  /** 保费低于 S$60,000:不会自动加入 CPF LIFE,改按 RSS 领取 */
  belowCpfLife: boolean;
  /** 55 岁时(RA 凑完、当年操作之后)可提取的 OA */
  oaAt55: number;
  /** 自愿从 OA 转进 SA / RA 的总额(不可逆) */
  oaMoved: number;
  /** 现金填补给自己的总额(不可逆) */
  cashIn: number;
  /** 填补带来的税务减免合计(含给家人) */
  taxSaved: number;
  /** 第一年的省税额 */
  taxSavedFirstYear: number;
};

/* ----------------------------------------------------------- CPF LIFE 查表 */

const tableRows = [...CPF_LIFE_TABLE.rows].sort((a, b) => a.ra65 - b.ra65);

/** 65 岁口径的保费 → 65 岁开始领的标准计划月领额(男性) */
export function tableFrom65(premium65: number): number {
  if (premium65 <= 0) return 0;
  const first = tableRows[0];
  // 最小一行以下按比例,避免线性外推出「零保费也有钱领」
  if (premium65 <= first.ra65) return (first.from65 * premium65) / first.ra65;
  for (let i = 1; i < tableRows.length; i += 1) {
    const a = tableRows[i - 1];
    const b = tableRows[i];
    if (premium65 <= b.ra65) {
      return a.from65 + ((premium65 - a.ra65) / (b.ra65 - a.ra65)) * (b.from65 - a.from65);
    }
  }
  // 最大一行以上:沿最后一段的斜率延伸
  const a = tableRows[tableRows.length - 2];
  const b = tableRows[tableRows.length - 1];
  return b.from65 + ((premium65 - b.ra65) / (b.ra65 - a.ra65)) * (b.from65 - a.from65);
}

/** 推迟到 70 岁的倍数:官方只给了部分行,中间按 RA 余额线性插值 */
export function deferralRatio70(premium65: number): number {
  const known = tableRows.filter((r) => r.from70).map((r) => ({ x: r.ra65, y: r.from70! / r.from65 }));
  if (premium65 <= known[0].x) return known[0].y;
  for (let i = 1; i < known.length; i += 1) {
    if (premium65 <= known[i].x) {
      const a = known[i - 1];
      const b = known[i];
      return a.y + ((premium65 - a.x) / (b.x - a.x)) * (b.y - a.y);
    }
  }
  return known[known.length - 1].y;
}

/** 开始领取那一年的月领额(未计递增) */
export function cpfLifeMonthly(premium65: number, startAge: number, plan: PlanKey, gender: Gender): number {
  const years = Math.min(5, Math.max(0, startAge - 65));
  const defer = Math.pow(deferralRatio70(premium65), years / 5);
  return tableFrom65(premium65) * defer * PLANS[plan].factor * GENDER_FACTOR[gender];
}

/* ------------------------------------------------------------- 收入模型 */

/** 收入曲线在某个年龄的月薪(不考虑中断、再雇佣、停工) */
export function curveAt(shape: IncomeShape, age0: number, age: number): number {
  const up = 1 + shape.growthBefore / 100;
  const after = 1 + shape.changeAfter / 100;
  // 已经过了峰值:下调早已发生,只剩峰值后的变化
  if (age0 > shape.peakAge) return Math.max(0, shape.monthly * Math.pow(after, age - age0));
  if (age <= shape.peakAge) return shape.monthly * Math.pow(up, age - age0);
  const peak = shape.monthly * Math.pow(up, shape.peakAge - age0);
  return Math.max(0, peak * (1 - shape.dropAtPeak / 100) * Math.pow(after, age - shape.peakAge - 1));
}

export function workAt(inp: CpfInputs, age: number): { status: WorkStatus; ow: number; aw: number; selfNti: number } {
  if (age >= inp.stopWorkAge) return { status: 'retired', ow: 0, aw: 0, selfNti: 0 };
  const ev = inp.events.find((e) => e.years > 0 && age >= e.fromAge && age < e.fromAge + e.years);
  if (ev) {
    if (ev.kind === 'self') return { status: 'self', ow: 0, aw: 0, selfNti: Math.max(0, ev.selfMonthly) * 12 };
    return { status: ev.kind, ow: 0, aw: 0, selfNti: 0 };
  }
  let ow = curveAt(inp.income, inp.age, age);
  let status: WorkStatus = 'work';
  if (inp.reemploy.on && age >= inp.reemploy.fromAge) {
    ow *= 1 - inp.reemploy.cut / 100;
    status = 'reemploy';
  }
  return { status, ow, aw: ow * Math.max(0, inp.income.bonusMonths), selfNti: 0 };
}

/* -------------------------------------------------------------- 利息工具 */

/** 额外利息:按顺序吃掉各个户头的余额,返回每个户头分到的年额外利息 */
function tieredExtra(parts: number[], tiers: { upTo: number; rate: number }[]): number[] {
  const out = parts.map(() => 0);
  let used = 0;
  parts.forEach((p, i) => {
    let left = Math.max(0, p);
    for (const t of tiers) {
      if (left <= 0) break;
      const take = Math.min(left, Math.max(0, t.upTo - used));
      out[i] += (take * t.rate) / 100;
      used += take;
      left -= take;
    }
  });
  return out;
}

/* ---------------------------------------------------------------- 主模拟 */

export function simulate(inp: CpfInputs): SimResult {
  const A0 = inp.age;
  const Y0 = inp.startYear;
  const act = inp.actions;
  const cohortYear = Y0 + (55 - A0);
  const cohort = { year: cohortYear, ...retirementSums(cohortYear, inp.sumGrowth) };
  const tableRate = 1 + CPF_LIFE_TABLE.tableRate / 100;

  let oa = Math.max(0, inp.oa);
  let sa = A0 < 55 ? Math.max(0, inp.sa) : 0;
  let ma = Math.max(0, inp.ma);
  let ra = A0 >= 55 ? Math.max(0, inp.ra) : 0;

  let formation: Formation55 | null = null;
  let bhsFixed: number | null = null;
  let started = false;
  let ra65 = A0 >= 65 ? ra : 0;
  let premium65 = 0;
  let premium = 0;
  let lifeBase = 0;
  let startMonthly = 0;
  /** 65 岁之后才进 RA 的钱(缴费、填补、溢出),折回 65 岁 */
  let lateInflow65 = 0;
  /** 已开始领取后又进来的 RA 钱,年末追加为保费 */
  let pendingPremium = 0;

  let oaAt55 = A0 >= 55 ? oa : 0;
  let oaMoved = 0;
  let cashIn = 0;
  let taxSaved = 0;
  let taxSavedFirstYear = 0;

  const rows: YearRow[] = [];

  for (let age = A0; age < inp.lifespan; age += 1) {
    const year = Y0 + age - A0;
    const R = rulesFor(year, inp.sumGrowth);
    if (age >= 65 && bhsFixed === null) bhsFixed = R.bhs;
    const bhs = bhsFixed ?? R.bhs;

    /** RA 收到一笔「新钱」:65 岁后记账,领取后追加保费 */
    const intoRa = (amt: number) => {
      if (amt <= 0) return;
      if (started) {
        pendingPremium += amt;
        return;
      }
      ra += amt;
      if (age >= 65) lateInflow65 += amt / Math.pow(tableRate, age - 65 + 0.5);
    };

    /** MA 进钱:超过 BHS 的部分溢出 */
    const intoMa = (amt: number) => {
      ma += amt;
      const over = Math.max(0, ma - bhs);
      if (over <= 0) return;
      ma -= over;
      if (age < 55) {
        const toSa = Math.min(over, Math.max(0, R.frs - sa));
        sa += toSa;
        oa += over - toSa;
      } else if (!started) {
        const toRa = Math.min(over, Math.max(0, R.frs - ra));
        intoRa(toRa);
        oa += over - toRa;
      } else {
        oa += over;
      }
    };

    /** 雇主 + 雇员缴费按分配率入账 */
    const credit = (toOa: number, toSra: number, toMa: number) => {
      oa += toOa;
      if (age < 55) {
        sa += toSra;
      } else if (!started) {
        // 55 岁起:原本进 SA 的那部分进 RA,RA 满当年 FRS 后转进 OA
        const toRa = Math.min(toSra, Math.max(0, R.frs - ra));
        intoRa(toRa);
        oa += toSra - toRa;
      } else {
        intoRa(toSra);
      }
      intoMa(toMa);
    };

    /* ---- ② 55 岁节点:开 RA、关 SA ---- */
    if (age === 55 && A0 < 55) {
      const target = inp.pledge ? cohort.brs : cohort.frs;
      const fromSa = Math.min(sa, target);
      sa -= fromSa;
      ra += fromSa;
      const fromOa = Math.min(oa, Math.max(0, target - ra));
      oa -= fromOa;
      ra += fromOa;
      const saToOa = sa;
      oa += sa;
      sa = 0;
      formation = { year, target, fromSa, fromOa, saToOa, ra, shortfall: Math.max(0, target - ra) };
    }

    if (age === 65) ra65 = ra;

    /* ---- ④ 开始领取:RA 全部变成保费 ---- */
    if (age === inp.payoutAge && !started) {
      if (age === 65) ra65 = ra;
      premium = ra;
      premium65 = (age === 65 ? ra : ra65) + (age === 65 ? 0 : lateInflow65);
      lifeBase = cpfLifeMonthly(premium65, inp.payoutAge, inp.plan, inp.gender);
      startMonthly = lifeBase;
      ra = 0;
      started = true;
    }

    /* ---- 当年年初的自愿操作 ---- */
    let moved = 0;
    let cash = 0;
    if (age < 55) {
      const lump = age === A0 ? act.oaToSaLump : 0;
      const want = lump + act.oaToSaYearly;
      if (want > 0) {
        const amt = Math.min(want, oa, Math.max(0, R.frs - sa));
        oa -= amt;
        sa += amt;
        moved += amt;
      }
    } else if (act.oaToRaToErs && !started) {
      const amt = Math.min(oa, Math.max(0, R.ers - ra));
      oa -= amt;
      intoRa(amt);
      moved += amt;
    }

    const work = workAt(inp, age);
    const band = bandFor(R.rates, age);
    const fullRate = band.employer + band.employee;
    const prNow = inp.prYear > 0 ? inp.prYear + (age - A0) : 0;
    let rate = fullRate;
    if (prNow === 1 || prNow === 2) {
      const g = bandFor(R.sprGraduated, age);
      rate = prNow === 1 ? g.year1 : g.year2;
    }
    const scale = rate / fullRate;
    const owSubject = Math.min(work.ow, R.owCeiling);
    const awSubject = Math.min(work.aw, Math.max(0, R.annualCeiling - owSubject * 12));

    if (age < act.topUpUntilAge) {
      if (act.selfTopUpYearly > 0) {
        let room = 0;
        if (age < 55) room = Math.max(0, R.frs - sa);
        else if (!started) room = Math.max(0, R.ers - ra);
        else room = Math.max(0, R.ers - premium - pendingPremium);
        cash = Math.min(act.selfTopUpYearly, room);
        if (age < 55) sa += cash;
        else intoRa(cash);
        cashIn += cash;
      }
      // 只有当年有应税收入,减免才有意义
      const relief =
        Math.min(cash, VOLUNTARY.selfTopUpRelief) +
        Math.min(Math.max(0, act.familyTopUpYearly), VOLUNTARY.familyTopUpRelief);
      if (relief > 0) {
        const gross = work.selfNti > 0 ? work.selfNti : work.ow * 12 + work.aw;
        const employeeCpf = ((owSubject * 12 + awSubject) * band.employee * scale) / 100;
        const chargeable = Math.max(0, gross - employeeCpf - 1_000);
        const saved = residentTax(chargeable) - residentTax(Math.max(0, chargeable - relief));
        taxSaved += saved;
        if (age === A0) taxSavedFirstYear = saved;
      }
    }

    if (age === 55 && A0 < 55) oaAt55 = oa;
    const start = { oaStart: oa, saStart: sa, maStart: ma, raStart: ra };

    /* ---- 逐月:利息计提 → 缴费 → 房贷 ---- */
    const acc = { oa: 0, sa: 0, ma: 0, ra: 0 };
    let contrib = 0;
    let housing = 0;
    const seRate = bandFor(R.selfEmployedMa, age).rate;

    for (let m = 0; m < 12; m += 1) {
      // 利息按月初余额计提(相当于 CPF 的当月最低余额)
      acc.oa += (oa * INTEREST.oa) / 100 / 12;
      acc.sa += (sa * INTEREST.smra) / 100 / 12;
      acc.ma += (ma * INTEREST.smra) / 100 / 12;
      acc.ra += (ra * INTEREST.smra) / 100 / 12;
      const oaPart = Math.min(oa, INTEREST.oaExtraCap);
      if (age < 55) {
        const [eOa, eSa, eMa] = tieredExtra([oaPart, sa, ma], INTEREST.extraBelow55);
        acc.sa += (eOa + eSa) / 12; // OA 赚到的额外利息进 SA
        acc.ma += eMa / 12;
      } else if (!started) {
        const [eRa, eOa, eMa] = tieredExtra([ra, oaPart, ma], INTEREST.extra55Plus);
        acc.ra += (eRa + eOa) / 12; // 55 岁起 OA 的额外利息进 RA
        acc.ma += eMa / 12;
      }
      // 领取之后 CPF LIFE 保费先吃掉额外利息额度,已计入官方对照表

      if (owSubject > 0) {
        const k = (owSubject * scale) / 100;
        credit(band.oa * k, band.sra * k, band.ma * k);
        contrib += owSubject * (rate / 100);
      }
      if (m === 11 && awSubject > 0) {
        const k = (awSubject * scale) / 100;
        credit(band.oa * k, band.sra * k, band.ma * k);
        contrib += awSubject * (rate / 100);
      }
      if (work.selfNti > 0) {
        const amt = (Math.min(work.selfNti, R.owCeiling * 12) * seRate) / 100 / 12;
        intoMa(amt);
        contrib += amt;
      }

      if (age < inp.housing.untilAge && inp.housing.monthly > 0) {
        const h = Math.min(inp.housing.monthly, oa);
        oa -= h;
        housing += h;
      }
    }

    /* ---- 年末利息入账 ---- */
    oa += acc.oa;
    sa += acc.sa;
    if (started) {
      // 领取后 RA 已清零,零星利息并入下一次保费
      pendingPremium += acc.ra;
    } else {
      ra += acc.ra;
    }
    intoMa(acc.ma);

    const life = started ? lifeBase * Math.pow(1 + PLANS[inp.plan].escalation / 100, age - inp.payoutAge) : 0;

    // 领取之后再进来的钱:每年追加一次保费,月领额随之上调
    if (started && pendingPremium > 1) {
      premium += pendingPremium;
      premium65 += pendingPremium / Math.pow(tableRate, age + 1 - 65);
      pendingPremium = 0;
      lifeBase = cpfLifeMonthly(premium65, inp.payoutAge, inp.plan, inp.gender);
    }

    oaMoved += moved;
    rows.push({
      age,
      year,
      status: work.status,
      wage: work.selfNti > 0 ? work.selfNti / 12 : work.ow,
      contrib,
      housing,
      moved,
      cash,
      ...start,
      oa,
      sa,
      ma,
      ra,
      life,
      frsNow: R.frs,
    });
  }

  return {
    rows,
    cohort,
    formation,
    ra65,
    premium,
    premium65,
    startMonthly,
    belowCpfLife: premium < CPF_LIFE_TABLE.minForCpfLife,
    oaAt55,
    oaMoved,
    cashIn,
    taxSaved,
    taxSavedFirstYear,
  };
}

/* ---------------------------------------------------------------- 三层缺口 */

export type Gaps = {
  startAge: number;
  /** 以下「at」都是开始领取那一年的名义月额 */
  desiredAt: number;
  lifeAt: number;
  otherAt: number;
  monthlyGap: number;
  /** 同一个缺口折回今天的购买力 */
  monthlyGapToday: number;
  surplusToday: number;
  /** 把月缺口按寿命折现到开始领取那一年的一笔钱(名义) */
  capitalGap: number;
  capitalGapToday: number;
  /** 开始领取时 CPF 里可提取的 OA(没拿去过桥的话) */
  oaAtStart: number;
  /** 停止工作到开始领 CPF LIFE 之间的生活费 */
  bridge: {
    fromAge: number;
    toAge: number;
    years: number;
    /** 名义总额 */
    need: number;
    /** 其中 55 岁以后的部分,可以用可提取的 OA 抵 */
    needFrom55: number;
    oaAvailable: number;
    net: number;
  } | null;
};

export function gapsFor(inp: CpfInputs, sim: SimResult): Gaps {
  const infl = 1 + inp.inflation / 100;
  const disc = 1 + inp.discountRate / 100;
  const start = inp.payoutAge;
  const deflate = (age: number) => Math.pow(infl, age - inp.age);
  const desired = (age: number) => inp.desiredMonthly * deflate(age);
  const other = (age: number) => (age >= inp.otherFromAge ? inp.otherMonthly * deflate(age) : 0);
  const rowAt = (age: number) => sim.rows.find((r) => r.age === age);

  const lifeAt = rowAt(start)?.life ?? 0;
  const gapAt = desired(start) - lifeAt - other(start);

  let capitalGap = 0;
  for (let age = Math.max(start, inp.stopWorkAge); age < inp.lifespan; age += 1) {
    const g = desired(age) - (rowAt(age)?.life ?? 0) - other(age);
    if (g > 0) capitalGap += (g * 12) / Math.pow(disc, age - start);
  }

  let bridge: Gaps['bridge'] = null;
  if (inp.stopWorkAge < start) {
    let need = 0;
    let needFrom55 = 0;
    for (let age = Math.max(inp.stopWorkAge, inp.age); age < start; age += 1) {
      const y = Math.max(0, desired(age) - other(age)) * 12;
      need += y;
      if (age >= 55) needFrom55 += y;
    }
    const unlock = Math.max(inp.stopWorkAge, 55, inp.age);
    const oaAvailable = unlock < start ? (rowAt(unlock)?.oaStart ?? 0) : 0;
    bridge = {
      fromAge: inp.stopWorkAge,
      toAge: start,
      years: start - Math.max(inp.stopWorkAge, inp.age),
      need,
      needFrom55,
      oaAvailable,
      net: need - Math.min(needFrom55, oaAvailable),
    };
  }

  return {
    startAge: start,
    desiredAt: desired(start),
    lifeAt,
    otherAt: other(start),
    monthlyGap: Math.max(0, gapAt),
    monthlyGapToday: Math.max(0, gapAt) / deflate(start),
    surplusToday: Math.max(0, -gapAt) / deflate(start),
    capitalGap,
    capitalGapToday: capitalGap / deflate(start),
    oaAtStart: rowAt(start)?.oaStart ?? 0,
    bridge,
  };
}

/* ---------------------------------------------------------------- 方案对比 */

export type ScenarioKey = 'baseline' | 'oaToSaLump' | 'oaToSaYearly' | 'cashTopUp' | 'oaToRa' | 'defer';

export type ScenarioParams = {
  lump: number;
  yearly: number;
  selfTopUp: number;
  familyTopUp: number;
  topUpUntilAge: number;
  deferAge: number;
};

export type Scenario = {
  key: ScenarioKey;
  title: string;
  note: string;
  available: boolean;
  reason?: string;
  /** 转入是否不可逆 */
  irreversible: boolean;
  inputs: CpfInputs;
  sim: SimResult;
  gaps: Gaps;
  /** 失去的流动性:转进去 / 少领的钱(名义) */
  locked: number;
  lockedLabel: string;
  /** 和基准相比,55 岁可提取的 OA 变化 */
  oa55Delta: number;
};

export function runScenarios(base: CpfInputs, p: ScenarioParams): Scenario[] {
  const plain = { ...base, actions: NO_ACTIONS };
  const baseSim = simulate(plain);
  const baseGaps = gapsFor(plain, baseSim);
  const before55 = base.age < 55;

  const make = (
    key: ScenarioKey,
    title: string,
    note: string,
    inputs: CpfInputs,
    opts: { available?: boolean; reason?: string; irreversible?: boolean; locked?: (s: SimResult) => number; lockedLabel?: string },
  ): Scenario => {
    const sim = key === 'baseline' ? baseSim : simulate(inputs);
    return {
      key,
      title,
      note,
      available: opts.available ?? true,
      reason: opts.reason,
      irreversible: opts.irreversible ?? false,
      inputs,
      sim,
      gaps: key === 'baseline' ? baseGaps : gapsFor(inputs, sim),
      locked: opts.locked ? opts.locked(sim) : 0,
      lockedLabel: opts.lockedLabel ?? '',
      oa55Delta: sim.oaAt55 - baseSim.oaAt55,
    };
  };

  const withActions = (a: Partial<Actions>): CpfInputs => ({ ...plain, actions: { ...NO_ACTIONS, ...a } });

  // 推迟期间少领的钱:基准在这几年本来能领到的
  const forgone = (toAge: number) =>
    baseSim.rows.filter((r) => r.age >= base.payoutAge && r.age < toAge).reduce((s, r) => s + r.life * 12, 0);
  const deferTo = base.payoutAge >= p.deferAge ? 70 : p.deferAge;
  const canDefer = base.payoutAge < 70;

  return [
    make('baseline', '不做任何操作', '按你现在的填写,什么都不额外做', plain, {
      lockedLabel: '没有额外锁定',
    }),
    make('oaToSaLump', 'OA 一次性转 SA', `现在转 ${fmt(p.lump)},SA 最多到当年 FRS`, withActions({ oaToSaLump: p.lump }), {
      available: before55,
      reason: '仅限 55 岁前',
      irreversible: true,
      locked: (s) => s.oaMoved,
      lockedLabel: '55 岁前不能再用于房贷;55 岁时 SA 超过 FRS 的部分会回到 OA',
    }),
    make('oaToSaYearly', 'OA 每年定期转 SA', `每年转 ${fmt(p.yearly)},一直到 55 岁`, withActions({ oaToSaYearly: p.yearly }), {
      available: before55,
      reason: '仅限 55 岁前',
      irreversible: true,
      locked: (s) => s.oaMoved,
      lockedLabel: '累计从 OA 转出;55 岁时 SA 超过 FRS 的部分会回到 OA',
    }),
    make(
      'cashTopUp',
      '现金填补',
      `每年给自己 ${fmt(p.selfTopUp)}${p.familyTopUp > 0 ? ` + 给家人 ${fmt(p.familyTopUp)}` : ''},到 ${p.topUpUntilAge} 岁`,
      withActions({ selfTopUpYearly: p.selfTopUp, familyTopUpYearly: p.familyTopUp, topUpUntilAge: p.topUpUntilAge }),
      {
        irreversible: true,
        locked: (s) => s.cashIn,
        lockedLabel: '累计填补给自己:55 岁前进 SA,之后进 RA(给家人的不进你的户头)',
      },
    ),
    make('oaToRa', '55 岁后 OA 转 RA', '55 岁起每年把 OA 转进 RA,填到当年 ERS', withActions({ oaToRaToErs: true }), {
      irreversible: true,
      locked: (s) => s.oaMoved,
      lockedLabel: '从可提取的 OA 转进 RA,之后只能按月领回',
    }),
    make('defer', `推迟到 ${deferTo} 岁领取`, `从 ${base.payoutAge} 岁推迟到 ${deferTo} 岁,每推一年最多多领 7%`, { ...plain, payoutAge: deferTo }, {
      available: canDefer,
      reason: '你已经选择 70 岁开始领取',
      locked: () => forgone(deferTo),
      lockedLabel: `推迟期间少领的 CPF LIFE`,
    }),
  ];
}

const fmt = (v: number) => 'S$' + Math.round(Math.max(0, v)).toLocaleString('en-SG');

/* ---------------------------------------------------------------- 官方校验 */

/**
 * 用 CPF 官方对照表里的几行反过来跑一遍引擎:2026 年满 55 岁、RA 刚好等于该行金额、
 * 之后不再工作也不再填补,看引擎给出的月领额和官方数字差多少。
 */
export function officialChecks(): { label: string; ra55: number; startAge: number; official: number; engine: number }[] {
  const out: { label: string; ra55: number; startAge: number; official: number; engine: number }[] = [];
  const labels: Record<number, string> = { 110_200: 'BRS', 220_400: 'FRS', 440_800: 'ERS' };
  for (const row of CPF_LIFE_TABLE.rows) {
    const cases: [number, number][] = [[65, row.from65]];
    if (row.from70) cases.push([70, row.from70]);
    for (const [startAge, official] of cases) {
      const sim = simulate({
        startYear: CPF_LIFE_TABLE.cohort,
        age: 55,
        gender: 'male',
        prYear: 0,
        oa: 0,
        sa: 0,
        ma: 0,
        ra: row.ra55,
        income: { monthly: 0, bonusMonths: 0, growthBefore: 0, peakAge: 55, dropAtPeak: 0, changeAfter: 0 },
        events: [],
        stopWorkAge: 55,
        reemploy: { on: false, fromAge: 60, cut: 0 },
        housing: { monthly: 0, untilAge: 0 },
        pledge: false,
        plan: 'standard',
        payoutAge: startAge,
        desiredMonthly: 0,
        otherMonthly: 0,
        otherFromAge: 65,
        lifespan: 90,
        inflation: 2,
        sumGrowth: 3.5,
        discountRate: 4,
        actions: NO_ACTIONS,
      });
      out.push({
        label: labels[row.ra55] ?? `RA ${fmt(row.ra55)}`,
        ra55: row.ra55,
        startAge,
        official,
        engine: sim.startMonthly,
      });
    }
  }
  return out;
}
