import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ContentLayer } from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { Link } from '@/lib/routing';
import ResourceArt from './ResourceArt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'en' ? 'Resources' : '资源中心' };
}

const ic = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconSteth = (
  <svg {...ic}>
    <path d="M5 3H4a1 1 0 0 0-1 1v5a5 5 0 0 0 10 0V4a1 1 0 0 0-1-1h-1" />
    <path d="M8 14v2.5a5.5 5.5 0 0 0 11 0v-4" />
    <circle cx="19" cy="10" r="2.4" />
  </svg>
);

const IconCalc = (
  <svg {...ic}>
    <rect x="5" y="2.5" width="14" height="19" rx="2" />
    <rect x="8" y="5.5" width="8" height="3.5" rx="0.8" />
    <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" />
  </svg>
);

const IconPercent = (
  <svg {...ic}>
    <path d="M19 5 5 19" />
    <circle cx="7.5" cy="7.5" r="2.6" />
    <circle cx="16.5" cy="16.5" r="2.6" />
  </svg>
);

const IconSpark = (
  <svg {...ic}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);

const IconCycles = (
  <svg {...ic}>
    <path d="M3 17.2c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 2.1 1.1 3.5.6" />
    <path d="M4 12.6 9 7.8l3.4 3.1L20 3.8" />
    <path d="M15.4 3.8H20v4.6" />
  </svg>
);

const IconRoute = (
  <svg {...ic}>
    <circle cx="6" cy="6" r="2.6" />
    <circle cx="18" cy="18" r="2.6" />
    <path d="M8.6 6h5.4a3.4 3.4 0 0 1 0 6.8h-4a3.4 3.4 0 0 0 0 6.8h5.4" />
  </svg>
);

const IconClock = (
  <svg {...ic}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </svg>
);

type ResourceGroup = 'care' | 'money' | 'settle';

type Resource = {
  key: string;
  /** 主题分组:看病 / 钱 / 落地 */
  group: ResourceGroup;
  /** 内容形式:互动专题 / 长文指南 / 小工具 / 流程说明 */
  tag: string;
  title: string;
  desc: string;
  icon: ReactNode;
  /** 站内 next-intl 路由(与 external 二选一) */
  href?: string;
  /** public/ 下的独立页面等,不走 locale 前缀 */
  external?: string;
  cta: string;
};

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === 'en';

  const resources: Resource[] = [
    {
      key: 'cycles',
      group: 'money',
      tag: en ? 'Interactive' : '互动专题',
      title: en ? 'Family Wealth Beyond Cycles' : '让家庭财富穿越周期',
      desc: en
        ? 'A scrollable story on why time in the market beats timing it: 37 years of crises, what holding for 15 years actually looks like, how dollar-cost averaging and compounding work, and how to split family money into three pots. Charts draw themselves as you scroll, plus a compounding calculator you can drag. (In Chinese)'
        : '一页滚动读完:市场为什么值得长期待着、持有15年到底是什么概率、定投和复利怎么起作用、家庭的钱该怎么分成三个钱袋子。图表跟着你往下滑一笔笔画出来,末尾还有个复利计算器,可以自己拖到65岁看看差多少。',
      icon: IconCycles,
      external: '/guides/wealth-across-cycles.html',
      cta: en ? 'Scroll the story' : '滚动看看',
    },
    {
      key: 'healthcare',
      group: 'care',
      tag: en ? 'Interactive' : '互动专题',
      title: en ? 'Singapore Healthcare Guide' : '新加坡就医指南',
      desc: en
        ? 'Where to see a doctor, what it costs, and how insurance claims work. Answer two questions and it points you to the right door; charts compare clinic fees and 20 common surgeries across public and private hospitals. (In Chinese)'
        : '看病去哪里、要花多少钱、保险怎么报,一篇讲清楚。点两下就知道该去 GP、Polyclinic 还是急诊;图表对照门诊费用区间,以及 20 种常见手术在公立和私立的账单差距。',
      icon: IconSteth,
      external: '/guides/healthcare.html',
      cta: en ? 'Read the guide' : '阅读指南',
    },
    {
      key: 'journey',
      group: 'care',
      tag: en ? 'How it works' : '流程说明',
      title: en ? 'How Applying & Claiming Actually Works' : '投保与理赔的完整流程',
      desc: en
        ? 'What actually happens from the first conversation to a claim paid out, online or in person: who does what at each step, how long it takes, and what to prepare. (In Chinese)'
        : '住院险、意外险的投保和理赔,从第一次沟通到理赔款到账。线上线下两条路径,每一步谁负责什么、需要多久、要准备哪些材料,有既往病史怎么核保、事前授权怎么申请,都写清楚了。',
      icon: IconRoute,
      external: '/guides/insurance-journey.html',
      cta: en ? 'See the full flow' : '看看流程',
    },
    {
      key: 'taxguide',
      group: 'money',
      tag: en ? 'Guide' : '长文指南',
      title: en ? 'Singapore Tax-Saving Guide: 24 Ways' : '新加坡省税指南:24个方法',
      desc: en
        ? '16 reliefs, 4 deductions, 2 rebates and 2 fixes — tax brackets, an SRS deep-dive and top-up strategy, all on one page. (In Chinese)'
        : '16个税务减免、4个扣除、2个退税、2个补救错漏,一篇讲清楚。含最新税率表、SRS专题、CPF/SRS充值策略和工具速查。',
      icon: IconPercent,
      external: '/guides/tax-savings.html',
      cta: en ? 'Read the guide' : '阅读指南',
    },
    {
      key: 'pr',
      group: 'settle',
      tag: en ? 'Guide' : '长文指南',
      title: en ? 'After Your Singapore PR Is Approved' : '新加坡PR落地指南',
      desc: en
        ? 'From health declaration and ICA formalities to your blue IC, insurance and tax re-planning, REP and NS — with official links for every step.'
        : '从健康申报、ICA手续到小蓝卡,从换身份到保险与省税重排,再到REP和NS。每一步都配好官方直达入口,照着办就行。',
      icon: IconSpark,
      external: en ? '/guides/pr-checklist-en.html' : '/guides/pr-checklist.html',
      cta: en ? 'Read the guide' : '阅读指南',
    },
    {
      key: 'tax',
      group: 'money',
      tag: en ? 'Tool' : '小工具',
      title: en ? 'CPF / SRS Tax-Saving Calculator' : 'CPF / SRS 省税计算器',
      desc: en
        ? 'Enter your taxable income and top-up amounts to instantly see tax before and after, how much you save, and the savings rate — based on the latest resident tax rates.'
        : '输入应纳税收入与 CPF / SRS 充值金额,立即看充值前后税额、省多少税、省税比例,依据新加坡最新居民个税税率。',
      icon: IconCalc,
      href: '/tools',
      cta: en ? 'Open calculator' : '打开计算器',
    },
    {
      key: 'retirement',
      group: 'money',
      tag: en ? 'Tool' : '小工具',
      title: en ? 'Retirement Readiness Calculator' : '退休自由度测算',
      desc: en
        ? 'Put CPF LIFE, SRS and your investments on one timeline. SRS is modelled as locked until your statutory withdrawal age (62 / 63 / 64) and CPF LIFE as starting at 65 — so an early-retirement plan shows the cash-flow gap instead of hiding it. (In Chinese)'
        : '把 CPF LIFE、SRS 和投资资产放在同一条时间线上,逐年模拟退休后每一笔钱从哪里来。SRS 严格按你的提取年龄(62 / 63 / 64)才解锁,CPF LIFE 按开始领取年龄计入,想提前退休的人能直接看到中间那段现金缺口。',
      icon: IconClock,
      href: '/tools/retirement',
      cta: en ? 'Open calculator' : '开始测算',
    },
  ];

  const quickLinks: {
    key: string;
    img: string;
    lines: [string, string];
    href?: string;
    external?: string;
  }[] = [
    {
      key: 'q-care',
      img: '/resources/q-care.webp',
      lines: en ? ['Where do I', 'see a doctor?'] : ['生病了，', '该去哪里看？'],
      external: '/guides/healthcare.html',
    },
    {
      key: 'q-tax',
      img: '/resources/q-tax.webp',
      lines: en ? ['How much tax', 'can I save?'] : ['今年还能', '省多少税？'],
      href: '/tools',
    },
    {
      key: 'q-retire',
      img: '/resources/q-retire.webp',
      lines: en ? ['When can', 'I retire?'] : ['我几岁', '可以退休？'],
      href: '/tools/retirement',
    },
    {
      key: 'q-cycles',
      img: '/resources/q-cycles.webp',
      lines: en ? ['Family wealth', 'beyond cycles'] : ['让家庭财富', '穿越周期'],
      external: '/guides/wealth-across-cycles.html',
    },
  ];

  const groups: {
    key: ResourceGroup;
    eyebrow: string;
    title: string;
    intro: string;
  }[] = [
    {
      key: 'care',
      eyebrow: en ? 'Care & claims' : '看病与理赔',
      title: en ? 'When someone at home falls ill' : '家里有人生病的时候',
      intro: en
        ? 'Where to go, what it costs, and what actually happens when you make a claim.'
        : '该去哪看、要花多少钱、真要理赔那天怎么走。',
    },
    {
      key: 'money',
      eyebrow: en ? 'Money, tax & retirement' : '钱、税与退休',
      title: en ? 'Letting the money grow up slowly' : '让钱慢慢长大',
      intro: en
        ? 'How to keep money invested through the cycles, how to pay less tax, and two calculators you can run on yourself.'
        : '怎么让钱穿越周期、怎么合法少交税，还有两个算给自己看的计算器。',
    },
    {
      key: 'settle',
      eyebrow: en ? 'Settling in' : '在新加坡落地',
      title: en ? 'The paperwork of arriving' : '刚落地的那些手续',
      intro: en
        ? 'Identity, formalities, and what needs re-planning once your status changes.'
        : '身份、手续，以及身份变了之后要重新排的事。',
    },
  ];

  // CPF 官方工具箱:中文导航,外链直达 cpf.gov.sg
  const cpfTools: {
    zh: string;
    en2: string;
    desc: string;
    url: string;
    hot?: boolean;
  }[] = [
    {
      zh: en ? 'Top up SA / RA (cash top-up)' : '给 SA / RA 充值',
      en2: 'Retirement Sum Topping-Up',
      desc: en
        ? 'Cash top-ups or OA transfers to your own or loved ones’ Special / Retirement Account, with tax relief. “Make a top-up now” inside.'
        : '退休储蓄充值入口:给自己或家人的特别/退休账户充现金或转OA,可享税务减免。页面内有官方充值按钮。',
      url: 'https://www.cpf.gov.sg/member/growing-your-savings/saving-more-with-cpf/top-up-to-enjoy-higher-retirement-payouts',
      hot: true,
    },
    {
      zh: en ? 'Top up MediSave' : '给 MediSave 充值',
      en2: 'MediSave Top-Up',
      desc: en
        ? 'Top up your MediSave for medical expenses and premiums — also with tax relief. “Make a top-up now” inside.'
        : '保健储蓄充值入口:MA用来付住院险/终身健保保费和医疗开销,充值同样可抵税。页面内有官方充值按钮。',
      url: 'https://www.cpf.gov.sg/member/growing-your-savings/saving-more-with-cpf/top-up-your-medisave-savings',
      hot: true,
    },
    {
      zh: en ? 'Monthly payout estimator' : '退休月入估算器',
      en2: 'Monthly Payout Estimator',
      desc: en
        ? 'Estimate your CPF LIFE monthly payouts from age 65.'
        : '估算 CPF LIFE 65岁起每月能领多少,规划退休现金流的第一步。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/monthly-payout-estimator',
    },
    {
      zh: en ? 'CPF housing usage calculator' : '购房公积金计算器',
      en2: 'CPF Housing Usage Calculator',
      desc: en
        ? 'How much OA you can use for your home and the impact on retirement.'
        : '算买房能动用多少 OA、要留多少利息,以及对退休储蓄的影响。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/cpf-housing-usage',
    },
    {
      zh: en ? 'Mortgage calculator' : '房贷计算器',
      en2: 'Mortgage Calculator',
      desc: en
        ? 'Estimate monthly instalments and total interest for your home loan.'
        : '估算房贷月供和总利息,买房前先心里有数。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/mortgage-calculator',
    },
    {
      zh: en ? 'CPF contribution calculator' : 'CPF 缴交计算器',
      en2: 'CPF Contribution Calculator',
      desc: en
        ? 'Employer + employee CPF contributions on your monthly wage.'
        : '按月薪算雇主+雇员每月各缴多少公积金。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/cpf-contribution-calculator',
    },
    {
      zh: en ? 'Contribution allocation calculator' : '缴交分配计算器',
      en2: 'Contribution Allocation Calculator',
      desc: en
        ? 'See how each contribution splits into OA, SA and MA.'
        : '看每月缴交的钱怎么分进 OA / SA / MA 三个账户。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/cpf-contribution-allocation-calculator',
    },
    {
      zh: en ? 'Additional Wage ceiling calculator' : '花红缴交顶限计算器',
      en2: 'Additional Wage Ceiling Calculator',
      desc: en
        ? 'How much of your bonus attracts CPF contributions.'
        : '算年终花红有多少需要缴公积金(AW顶限)。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/additional-wage-ceiling-calculator',
    },
    {
      zh: en ? 'MediSave / MediShield Life claims' : '住院报销估算器',
      en2: 'MediSave & MediShield Life Claims Calculator',
      desc: en
        ? 'Estimate how much of a hospital bill MediSave and MediShield Life can cover.'
        : '估算一笔住院账单里,保健储蓄和终身健保能报销多少。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/medisave-medishield-life-claims',
    },
    {
      zh: en ? 'Self-employed MediSave calculator' : '自雇人士 MA 缴交计算器',
      en2: 'Self-Employed MediSave Contribution Calculator',
      desc: en
        ? 'MediSave obligations for the self-employed and business owners.'
        : '自雇或开公司的朋友,算每年要给 MediSave 缴多少。',
      url: 'https://www.cpf.gov.sg/member/tools-and-services/calculators/self-employed-medisave-contribution-calculator',
    },
    {
      zh: en ? 'CPF: burning questions answered' : '公积金的十万个为什么',
      en2: en ? 'Interactive · Lianhe Zaobao' : '互动专题 · 联合早报',
      desc: en
        ? 'Lianhe Zaobao’s interactive Q&A on the CPF questions everyone asks — a good companion to the official tools above (in Chinese).'
        : '联合早报的互动问答专题,把大家最常问的公积金问题用中文一条条讲明白,和上面的官方工具搭配着看。',
      url: 'https://interactive.zaobao.com.sg/2025/cpf-burning-questions-answered/',
    },
  ];

  return (
    <>
      {/* 首屏:工具箱插画 + 四个快捷入口 */}
      <section className="relative isolate overflow-hidden bg-[#FBF8F1]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-[-18%] h-[520px] w-[520px] rounded-full border border-gold/20"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[22%] top-[8%] hidden h-[260px] w-[260px] rounded-full border border-gold/15 lg:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-cream"
        />

        <div className="container-wide relative grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-8 lg:py-16">
          <div className="order-2 lg:order-1">
            <p className="eyebrow animate-fade-up">{en ? 'Resources' : '资源中心'}</p>
            <span className="rule-gold mt-3 block animate-fade-up" />
            <h1
              className="mt-6 animate-fade-up text-[2rem] font-black leading-[1.3] text-navy md:text-[2.75rem]"
              style={{ animationDelay: '80ms' }}
            >
              {en ? "Yuan Yuan's toolbox" : '小圆姐的实用工具箱'}
              <span className="mt-2 block text-[1.6rem] leading-[1.4] md:text-[2rem]">
                {en
                  ? 'When these things come up in Singapore, start here'
                  : '在新加坡遇到这些事，先来这里找答案'}
              </span>
            </h1>
            <p
              className="mt-6 max-w-xl animate-fade-up text-base leading-[1.95] text-mist"
              style={{ animationDelay: '160ms' }}
            >
              {en
                ? 'Getting care, making claims, filing tax, retiring, and planning family money — I turn the official material into plain language, and into tools you can use right away.'
                : '看病、理赔、报税、退休和家庭财富规划，我把复杂的官方资料翻成中文，也做成了可以直接使用的小工具。'}
            </p>

            <div
              className="mt-8 grid animate-fade-up gap-3 sm:grid-cols-2"
              style={{ animationDelay: '240ms' }}
            >
              {quickLinks.map((q) => {
                const inner = (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={q.img}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 shrink-0 object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="min-w-0 flex-1 text-[15px] font-bold leading-[1.5] text-navy [text-wrap:balance]">
                      {q.lines[0]}
                      <br />
                      {q.lines[1]}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-gold-deep transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                );
                const cls =
                  'group flex items-center gap-3 rounded-2xl border border-gold/30 bg-white/70 px-4 py-3.5 no-underline shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white';
                return q.external ? (
                  <a key={q.key} href={q.external} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link key={q.key} href={q.href!} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/resources/hero-toolbox.webp"
              alt={en ? 'Yuan Yuan with her toolbox' : '小圆姐和她的工具箱'}
              width={1200}
              height={800}
              className="mx-auto w-full max-w-[520px] animate-fade-in lg:max-w-none"
            />
          </div>
        </div>

        <div className="relative flex justify-center pb-8">
          <a
            href="#care"
            aria-label={en ? 'Scroll to the resources' : '向下看资源列表'}
            className="animate-fade-in text-gold-deep/70 transition-colors duration-300 hover:text-gold-deep"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>
      </section>

      <ContentLayer>
        <div className="container-wide py-12 md:py-16">
          <Reveal>
            <div className="mb-12 flex flex-wrap gap-2.5 md:mb-14">
              {groups.map((g) => (
                <a
                  key={g.key}
                  href={`#${g.key}`}
                  className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/70 px-4 py-2 text-sm font-semibold text-navy no-underline transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10"
                >
                  {g.eyebrow}
                  <span className="text-xs font-normal text-mist">
                    {resources.filter((r) => r.group === g.key).length}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          {groups.map((g, gi) => {
            const items = resources.filter((r) => r.group === g.key);
            if (items.length === 0) return null;
            return (
              <section
                key={g.key}
                id={g.key}
                className={gi === 0 ? 'scroll-mt-28' : 'mt-16 scroll-mt-28 md:mt-20'}
              >
                <Reveal>
                  <div className={gi === 0 ? '' : 'border-t border-navy/10 pt-10'}>
                    <p className="eyebrow">
                      {g.eyebrow} · {items.length} {en ? (items.length > 1 ? 'items' : 'item') : '项'}
                    </p>
                    <h2 className="mt-2 text-2xl font-black leading-snug text-navy md:text-3xl">
                      {g.title}
                    </h2>
                    <p className="mt-2.5 max-w-2xl text-sm leading-[1.9] text-mist">{g.intro}</p>
                  </div>
                </Reveal>
                <div className="mt-7 grid gap-6 md:grid-cols-2">
                  {items.map((r, i) => {
              const inner = (
                <>
                  <div className="relative border-b border-gold/20 bg-sand-100/60">
                    <ResourceArt
                      k={r.key}
                      className="h-[148px] w-full transition-transform duration-700 group-hover:scale-[1.03] md:h-[164px]"
                    />
                    <span className="eyebrow absolute right-4 top-4 rounded-full bg-cream/85 px-3 py-1 shadow-sm backdrop-blur-sm">
                      {r.tag}
                    </span>
                    <span className="absolute -bottom-6 left-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/25 bg-white text-gold-deep shadow-card transition-colors duration-500 group-hover:bg-gold/10 md:left-8">
                      {r.icon}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7 pt-10 md:p-8 md:pt-11">
                    <h3 className="text-xl font-black leading-snug text-navy md:text-2xl">
                      {r.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-[1.95] text-mist">{r.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-deep">
                    {r.cta}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                    </span>
                  </div>
                </>
              );
              const cardClass =
                'card card-hover group flex h-full flex-col overflow-hidden no-underline';
              return (
                <Reveal key={r.key} delay={i * 90}>
                  {r.external ? (
                    <a href={r.external} className={cardClass}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={r.href!} className={cardClass}>
                      {inner}
                    </Link>
                  )}
                </Reveal>
              );
                  })}
                </div>

                {/* CPF 官方工具箱:属于「钱」这一类,挂在该组下面 */}
                {g.key === 'money' && (
                  <Reveal delay={160}>
                    <div className="mt-12">
                      <p className="eyebrow">{en ? 'CPF Official Tools' : 'CPF 官方工具'}</p>
                      <h3 className="mt-2 text-xl font-black leading-snug text-navy md:text-2xl">
                        {en ? 'CPF toolbox, with a map' : 'CPF 官方工具箱，中文导航'}
                      </h3>
              <p className="mt-2 max-w-2xl text-sm leading-[1.9] text-mist">
                {en
                  ? 'The most useful calculators and top-up entries on cpf.gov.sg — click through to the official CPF platform (Singpass login needed for some).'
                  : '公积金官网最常用的计算器和充值入口,配上中文说明,点击直达 CPF 官方平台(部分功能需要 Singpass 登录)。'}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cpfTools.map((t) => (
                  <a
                    key={t.url}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`card card-hover group flex h-full flex-col p-5 no-underline ${
                      t.hot ? 'border-gold/50 bg-gold/[0.07]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[15px] font-bold leading-snug text-navy">{t.zh}</p>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0 text-gold-deep transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-gold-deep">
                      {t.hot ? (en ? 'Top-up entry · ' : '充值入口 · ') : ''}
                      {t.en2}
                    </p>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mist">{t.desc}</p>
                  </a>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}
              </section>
            );
          })}

          {/* 更多内容预告 + 咨询引导 */}
          <Reveal delay={200}>
            <div className="card mt-6 flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div>
                <p className="text-base font-bold text-navy">
                  {en ? 'More on the way' : '更多内容陆续更新中'}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">
                  {en
                    ? 'Have a topic you want covered — CPF, insurance, retirement? Tell me and I may write it next.'
                    : '想看哪个话题?公积金、保险、退休规划……告诉我,说不定下一篇就写它。'}
                </p>
              </div>
              <Link
                href="/consult"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gold/50 px-6 py-3 text-sm font-semibold text-gold-deep transition-all duration-300 hover:bg-gold/10"
              >
                {en ? 'Suggest a topic' : '来聊聊'}
              </Link>
            </div>
          </Reveal>
        </div>
      </ContentLayer>
    </>
  );
}
