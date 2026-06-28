'use client';

import { useMemo, useState } from 'react';

type Locale = 'zh' | 'en';
type Residency = 'citizenPr' | 'foreigner';

// 新加坡居民个人所得税累进税率(YA2024 起,适用 YA2026)
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

const SRS_CAP = { citizenPr: 15_300, foreigner: 35_700 };
const CPF_SELF_CAP = 8000;
const CPF_FAMILY_CAP = 8000;

function tax(income: number) {
  const x = Math.max(0, income);
  const b = [...BRACKETS].reverse().find((k) => x >= k.floor) ?? BRACKETS[0];
  return b.base + (x - b.floor) * b.rate;
}
const num = (s: string) => {
  const v = Number(String(s).replace(/,/g, ''));
  return Number.isFinite(v) ? Math.max(0, v) : 0;
};
const clamp = (v: number, max: number) => Math.min(Math.max(0, v), max);
const sgd = (v: number) =>
  'S$' + Math.round(v).toLocaleString('en-SG');
const pct = (v: number) => (Number.isFinite(v) ? (v * 100).toFixed(1) : '0') + '%';

const copy = {
  zh: {
    inputs: '填写信息',
    reset: '重置',
    residency: '身份',
    citizenPr: 'PR / 公民',
    foreigner: '外国人(EP / 工作准证)',
    income: '应纳税收入(Chargeable Income)',
    incomeHelp: '一般是年收入扣除其他常规减免后的金额。',
    cpfSelf: 'CPF 现金充值 · 给自己',
    cpfFamily: 'CPF 现金充值 · 给家人',
    srs: 'SRS 充值',
    cpfForeignNote: '外国人通常不是 CPF 会员,无法享受 CPF 现金充值的税务减免;但可以使用 SRS(上限更高)。',
    results: '测算结果',
    saveBig: '预计省税',
    savePct: '省税比例',
    before: '原本需要交税',
    after: '充值后需要交税',
    incomeAfter: '充值后应纳税收入',
    reliefTotal: '充值合计(计入减免)',
    tableTitle: '不同收入的省税参考',
    tablePr: 'PR / 公民',
    tableForeign: '外国人',
    thIncome: '应纳税收入',
    thCpf: 'CPF 8,000',
    thSrs: (n: string) => `SRS ${n}`,
    thBoth: 'CPF + SRS',
    thSave: '预计省税',
    faqSrsTitle: 'SRS 常见问题',
    faqCpfTitle: 'CPF 常见问题',
    disclaimer:
      '本工具仅供教育与初步估算,不构成税务、投资或保险建议。税率依据新加坡居民个人所得税表(YA2024 起);实际可减免金额还受个人减免总上限 S$80,000、家人资格、CPF 账户状态等影响。具体以 IRAS、CPF Board 与你的实际情况为准。',
    srsFaqs: [
      ['SRS 每年可以存多少?', 'PR / 公民每年最高 S$15,300;外国人每年最高 S$35,700。'],
      ['SRS 为什么能省税?', '当年存入 SRS 的金额可作为税务减免,直接降低当年的应纳税收入,从而少交税。'],
      ['SRS 是免税还是延迟交税?', '更准确说是「延迟交税」。退休后提取时,通常只有 50% 计入应税收入,且可分多年提取以摊低税率。'],
      ['存进去的钱可以投资吗?', '可以。SRS 账户里的资金可用于投资(基金、股票、保险等),让它在延税的同时增值。'],
    ],
    cpfFaqs: [
      ['CPF 现金充值能省多少税?', '给自己最高 S$8,000 税务减免,给符合条件的家人可再享最高 S$8,000,合计最高 S$16,000。'],
      ['可以给哪些家人充值并享减免?', '常见包括父母、配偶、祖父母、兄弟姐妹等,需满足 CPF 的收入与年龄等条件。'],
      ['CPF 转账(transfer)也能省税吗?', '不能。税务减免一般只适用于「现金充值」(cash top-up),账户间转账不算。'],
      ['为什么实际省税可能比输入少?', '会受个人减免总上限 S$80,000、家人账户余额、年龄,以及配对补助(MRSS)等因素影响。'],
    ],
  },
  en: {
    inputs: 'Inputs',
    reset: 'Reset',
    residency: 'Status',
    citizenPr: 'Citizen / PR',
    foreigner: 'Foreigner (EP / Work Pass)',
    income: 'Chargeable income',
    incomeHelp: 'Usually your annual income after other regular reliefs.',
    cpfSelf: 'CPF cash top-up · self',
    cpfFamily: 'CPF cash top-up · family',
    srs: 'SRS contribution',
    cpfForeignNote: 'Foreigners are usually not CPF members and cannot claim CPF cash top-up relief — but SRS is available (with a higher cap).',
    results: 'Results',
    saveBig: 'Estimated tax saved',
    savePct: 'Savings ratio',
    before: 'Tax before top-up',
    after: 'Tax after top-up',
    incomeAfter: 'Chargeable income after top-up',
    reliefTotal: 'Total top-up (relief)',
    tableTitle: 'Savings by income level',
    tablePr: 'Citizen / PR',
    tableForeign: 'Foreigner',
    thIncome: 'Income',
    thCpf: 'CPF 8,000',
    thSrs: (n: string) => `SRS ${n}`,
    thBoth: 'CPF + SRS',
    thSave: 'Tax saved',
    faqSrsTitle: 'SRS FAQ',
    faqCpfTitle: 'CPF FAQ',
    disclaimer:
      'For education and rough estimates only — not tax, investment, or insurance advice. Rates follow Singapore resident income tax (YA2024 onwards); actual relief is also affected by the S$80,000 personal relief cap, family eligibility and CPF account status. IRAS, CPF Board and your own situation prevail.',
    srsFaqs: [
      ['How much can I put into SRS each year?', 'Citizens/PRs: up to S$15,300. Foreigners: up to S$35,700.'],
      ['How does SRS save tax?', "The amount you contribute reduces that year's chargeable income, so you pay less tax."],
      ['Is SRS tax-free or tax-deferred?', 'It is tax deferral. At withdrawal in retirement, usually only 50% is taxable, and you can spread withdrawals over years.'],
      ['Can the money be invested?', 'Yes. SRS funds can be invested (funds, shares, insurance, etc.) to grow while tax-deferred.'],
    ],
    cpfFaqs: [
      ['How much can CPF cash top-up save?', 'Up to S$8,000 relief for yourself, plus up to S$8,000 for eligible family — up to S$16,000 total.'],
      ['Which family members qualify?', 'Commonly parents, spouse, grandparents and siblings, subject to CPF income/age conditions.'],
      ['Do CPF transfers qualify?', 'No. Relief generally applies to cash top-ups, not account-to-account transfers.'],
      ['Why might actual savings be lower?', 'The S$80,000 relief cap, recipient balances and age, and matching grants (MRSS) can reduce eligible relief.'],
    ],
  },
};

export default function TaxSavingsCalculator({ locale }: { locale: string }) {
  const lang: Locale = locale === 'en' ? 'en' : 'zh';
  const t = copy[lang];

  const [residency, setResidency] = useState<Residency>('citizenPr');
  const [income, setIncome] = useState('150000');
  const [cpfSelf, setCpfSelf] = useState('8000');
  const [cpfFamily, setCpfFamily] = useState('0');
  const [srs, setSrs] = useState('15300');

  const r = useMemo(() => {
    const inc = num(income);
    const srsCap = SRS_CAP[residency];
    const cS = residency === 'citizenPr' ? clamp(num(cpfSelf), CPF_SELF_CAP) : 0;
    const cF = residency === 'citizenPr' ? clamp(num(cpfFamily), CPF_FAMILY_CAP) : 0;
    const s = clamp(num(srs), srsCap);
    const relief = cS + cF + s;
    const incomeAfter = Math.max(0, inc - relief);
    const before = tax(inc);
    const after = tax(incomeAfter);
    const saved = Math.max(0, before - after);
    return {
      srsCap,
      relief,
      incomeAfter,
      before,
      after,
      saved,
      ratio: before > 0 ? saved / before : 0,
    };
  }, [income, cpfSelf, cpfFamily, srs, residency]);

  const reset = () => {
    setResidency('citizenPr');
    setIncome('150000');
    setCpfSelf('8000');
    setCpfFamily('0');
    setSrs('15300');
  };

  const isForeign = residency === 'foreigner';

  return (
    <>
      {/* ===== 计算器 ===== */}
      <section className="container-wide grid gap-6 py-14 md:py-16 lg:grid-cols-2 lg:gap-8">
        {/* 输入 */}
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">{t.inputs}</h2>
            <button
              onClick={reset}
              className="rounded-lg border border-navy/20 px-3 py-1.5 text-xs font-semibold text-navy/70 transition-colors hover:border-gold hover:text-gold-deep"
            >
              {t.reset}
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {/* 身份 */}
            <div>
              <Label>{t.residency}</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['citizenPr', 'foreigner'] as Residency[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setResidency(v)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                      residency === v
                        ? 'border-navy bg-navy text-cream'
                        : 'border-navy/15 bg-white text-navy hover:border-gold'
                    }`}
                  >
                    {t[v]}
                  </button>
                ))}
              </div>
            </div>

            <Field label={t.income} help={t.incomeHelp} value={income} onChange={setIncome} />

            {isForeign ? (
              <p className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-xs leading-relaxed text-navy/70">
                {t.cpfForeignNote}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t.cpfSelf} value={cpfSelf} onChange={setCpfSelf} max={CPF_SELF_CAP} />
                <Field label={t.cpfFamily} value={cpfFamily} onChange={setCpfFamily} max={CPF_FAMILY_CAP} />
              </div>
            )}

            <Field
              label={`${t.srs} · ${lang === 'zh' ? '上限' : 'cap'} ${sgd(r.srsCap)}`}
              value={srs}
              onChange={setSrs}
              max={r.srsCap}
            />
          </div>
        </div>

        {/* 结果 */}
        <div className="flex flex-col gap-5">
          {/* 大数字:省税 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-deep p-7 text-cream md:p-8">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-gold/25" />
            <p className="text-xs font-semibold uppercase tracking-widest2 text-gold-light">{t.saveBig}</p>
            <p className="mt-2 text-5xl font-black text-gold-light">{sgd(r.saved)}</p>
            <p className="mt-2 text-sm text-cream/70">
              {t.savePct} · {pct(r.ratio)}
            </p>
          </div>

          <div className="card p-6 md:p-7">
            <h2 className="text-xl font-bold text-navy">{t.results}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label={t.before} value={sgd(r.before)} />
              <Metric label={t.after} value={sgd(r.after)} highlight />
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-navy/10">
              <Line label={t.incomeAfter} value={sgd(r.incomeAfter)} />
              <Line label={t.reliefTotal} value={sgd(r.relief)} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 省税参考表 ===== */}
      <section className="container-wide pb-14">
        <h2 className="section-title">{t.tableTitle}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <RefTable
            title={t.tablePr}
            headers={[t.thIncome, t.thCpf, t.thSrs('15,300'), t.thBoth]}
            rows={[80_000, 120_000, 160_000, 200_000, 320_000].map((inc) => [
              sgd(inc),
              sgd(tax(inc) - tax(inc - 8000)),
              sgd(tax(inc) - tax(inc - 15_300)),
              sgd(tax(inc) - tax(inc - 23_300)),
            ])}
          />
          <RefTable
            title={t.tableForeign}
            headers={[t.thIncome, t.thSrs('35,700'), t.thSave]}
            rows={[80_000, 120_000, 160_000, 200_000, 320_000].map((inc) => [
              sgd(inc),
              sgd(tax(inc - 35_700)),
              sgd(tax(inc) - tax(inc - 35_700)),
            ])}
          />
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="container-wide grid gap-6 pb-14 lg:grid-cols-2">
        <Faq title={t.faqSrsTitle} items={t.srsFaqs} />
        <Faq title={t.faqCpfTitle} items={t.cpfFaqs} />
      </section>

      <section className="container-wide pb-16">
        <p className="border-t border-navy/10 pt-6 text-xs leading-relaxed text-mist">{t.disclaimer}</p>
      </section>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-bold text-navy">{children}</label>;
}

function Field({
  label,
  help,
  value,
  onChange,
  max,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {help ? <p className="mt-1 text-xs leading-relaxed text-mist">{help}</p> : null}
      <div className="mt-2 flex items-center rounded-xl border border-navy/15 bg-white transition-colors focus-within:border-gold">
        <span className="pl-3.5 text-sm font-bold text-mist">S$</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-2.5 py-3 text-base font-bold text-navy outline-none"
        />
      </div>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-gold/40 bg-gold/5' : 'border-navy/10 bg-white'}`}>
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1.5 text-xl font-black text-navy">{value}</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-navy/10 px-4 py-3 last:border-0">
      <span className="text-sm text-mist">{label}</span>
      <span className="text-sm font-bold text-navy">{value}</span>
    </div>
  );
}

function RefTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-gold/20 px-5 py-4">
        <h3 className="text-base font-bold text-navy">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-navy text-cream">
              {headers.map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-xs font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-navy/10 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className={`whitespace-nowrap px-4 py-3 ${j === 0 ? 'font-bold text-navy' : 'text-gold-deep'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Faq({ title, items }: { title: string; items: string[][] }) {
  return (
    <div className="card p-6 md:p-7">
      <h3 className="text-lg font-bold text-navy">{title}</h3>
      <div className="mt-4 divide-y divide-navy/10">
        {items.map(([q, a]) => (
          <details key={q} className="group py-4 first:pt-0 last:pb-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-navy">
              {q}
              <span className="shrink-0 text-gold-deep transition-transform duration-300 group-open:rotate-45">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-mist">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
