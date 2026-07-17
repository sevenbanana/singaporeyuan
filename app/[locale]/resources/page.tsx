import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import PageHero, { ContentLayer } from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { Link } from '@/lib/routing';

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

type Resource = {
  key: string;
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
      key: 'healthcare',
      tag: en ? 'Guide' : '就医指南',
      title: en ? 'Singapore Healthcare Guide' : '新加坡就医指南',
      desc: en
        ? 'Where to see a doctor, what it costs, and how insurance claims work — GP vs polyclinic, specialists, A&E, TCM and more, all in one page. (In Chinese)'
        : '看病去哪里、要花多少钱、保险怎么报,一篇讲清楚。GP与Polyclinic对比、专科两条路、急诊分诊、中医与社区医院、费用速查、理赔七个习惯。',
      icon: IconSteth,
      external: '/guides/healthcare.html',
      cta: en ? 'Read the guide' : '阅读指南',
    },
    {
      key: 'taxguide',
      tag: en ? 'Guide' : '省税指南',
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
      tag: en ? 'Guide' : 'PR指南',
      title: en ? 'After Your Singapore PR Is Approved' : '新加坡PR落地指南',
      desc: en
        ? 'From health declaration and ICA formalities to your blue IC, insurance and tax re-planning, REP and NS — with official links for every step. (In Chinese)'
        : '从健康申报、ICA手续到小蓝卡,从换身份到保险与省税重排,再到REP和NS。每一步都配好官方直达入口,照着办就行。',
      icon: IconSpark,
      external: '/guides/pr-checklist.html',
      cta: en ? 'Read the guide' : '阅读指南',
    },
    {
      key: 'tax',
      tag: en ? 'Tool' : '小工具',
      title: en ? 'CPF / SRS Tax-Saving Calculator' : 'CPF / SRS 省税计算器',
      desc: en
        ? 'Enter your taxable income and top-up amounts to instantly see tax before and after, how much you save, and the savings rate — based on the latest resident tax rates.'
        : '输入应纳税收入与 CPF / SRS 充值金额,立即看充值前后税额、省多少税、省税比例,依据新加坡最新居民个税税率。',
      icon: IconCalc,
      href: '/tools',
      cta: en ? 'Open calculator' : '打开计算器',
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
      <PageHero
        eyebrow={en ? 'Resources' : '资源中心'}
        title={en ? 'Tools & guides, made for you' : '给你的实用工具与干货'}
        subtitle={
          en
            ? 'Practical tools and plain-language guides for living in Singapore — use them anytime, no strings attached. New pieces are added as I write them.'
            : '在新加坡生活用得上的小工具和白话干货,随时取用,不设门槛。我会持续把新的内容更新到这里。'
        }
        accent={IconSpark}
      />
      <ContentLayer>
        <div className="container-wide py-16 md:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((r, i) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold-deep transition-colors duration-500 group-hover:bg-gold/25">
                      {r.icon}
                    </span>
                    <span className="eyebrow">{r.tag}</span>
                  </div>
                  <h2 className="mt-6 text-xl font-black leading-snug text-navy md:text-2xl">
                    {r.title}
                  </h2>
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
                </>
              );
              const cardClass =
                'card card-hover group flex h-full flex-col p-7 no-underline md:p-8';
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

          {/* CPF 官方工具箱 */}
          <Reveal delay={160}>
            <div className="mt-16">
              <p className="eyebrow">{en ? 'CPF Official Tools' : 'CPF 官方工具'}</p>
              <h2 className="mt-2 text-xl font-black leading-snug text-navy md:text-2xl">
                {en ? 'CPF toolbox, with a map' : 'CPF 官方工具箱，中文导航'}
              </h2>
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
