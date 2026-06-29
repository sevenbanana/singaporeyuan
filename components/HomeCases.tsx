'use client';

import type { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/routing';
import { IconShield, IconHome, IconBaby, IconGrowth, IconMoney } from '@/components/icons';

type L = { zh: string; en: string };
type Card = {
  n: number;
  slug: string;
  topIcon: ReactNode;
  age: L;
  stage: L;
  tag: L;
  q: L;
};

const IconBriefcase = (p: { width?: number; height?: number }) => (
  <svg width={p.width} height={p.height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
    <path d="M3 12h18M11 12v2.5h2V12" />
  </svg>
);

const cards: Card[] = [
  {
    n: 1,
    slug: 'first-job',
    topIcon: <IconShield width={22} height={22} />,
    age: { zh: '25 岁', en: 'Age 25' },
    stage: { zh: '初入职场', en: 'New to work' },
    tag: { zh: '公司团险 · 个人保障', en: 'Group cover · Personal' },
    q: {
      zh: '刚来新加坡,只有公司团险,个人保障到底要不要买?',
      en: 'New to Singapore with only company cover — do I need personal insurance?',
    },
  },
  {
    n: 2,
    slug: 'new-home',
    topIcon: <IconHome width={22} height={22} />,
    age: { zh: '30 岁', en: 'Age 30' },
    stage: { zh: '新婚买房', en: 'Newlywed' },
    tag: { zh: '房贷责任 · 家庭保障', en: 'Mortgage · Family cover' },
    q: {
      zh: '买了房、有了房贷,万一一方出事,另一方扛得住吗?',
      en: 'With a home and mortgage — if one of us is hit, can the other cope?',
    },
  },
  {
    n: 3,
    slug: 'new-parents',
    topIcon: <IconBaby width={22} height={22} />,
    age: { zh: '32 岁', en: 'Age 32' },
    stage: { zh: '新手妈妈', en: 'New parent' },
    tag: { zh: '有娃家庭 · 优先级安排', en: 'With a child · Priorities' },
    q: {
      zh: '有了宝宝后,先给孩子买保险,还是先补大人的保障?',
      en: 'After the baby — insure the child first, or shore up the parents?',
    },
  },
  {
    n: 4,
    slug: 'wealth-growth',
    topIcon: <IconGrowth width={22} height={22} />,
    age: { zh: '35 岁', en: 'Age 35' },
    stage: { zh: '规划退休', en: 'Retirement planning' },
    tag: { zh: '50 岁退休 · 现金流设计', en: 'Retire at 50 · Cash flow' },
    q: {
      zh: '想在 50 岁前从容退休,现在的收入该怎么安排?',
      en: 'To retire comfortably before 50 — how should I arrange my income now?',
    },
  },
  {
    n: 5,
    slug: 'usd-retirement',
    topIcon: <IconMoney width={22} height={22} />,
    age: { zh: '40 岁', en: 'Age 40' },
    stage: { zh: '高管', en: 'Executive' },
    tag: { zh: '美元储备 · 退休现金流', en: 'USD savings · Retirement' },
    q: {
      zh: '收入不错,也有美元储备,退休现金流该怎么设计?',
      en: 'Good income and USD savings — how to design retirement cash flow?',
    },
  },
  {
    n: 6,
    slug: 'business-owner',
    topIcon: <IconBriefcase width={22} height={22} />,
    age: { zh: '45 岁', en: 'Age 45' },
    stage: { zh: '企业主', en: 'Business owner' },
    tag: { zh: '被动收入 · 资产配置', en: 'Passive income · Allocation' },
    q: {
      zh: '资产不少,但如何规划更稳定的被动收入?',
      en: 'Plenty of assets — how to build steadier passive income?',
    },
  },
];

function Avatar({ n }: { n: number }) {
  return (
    <span className="relative -mt-16 block h-28 w-28 shrink-0 overflow-hidden rounded-full bg-white shadow-[0_8px_24px_-8px_rgba(20,40,80,0.3)] ring-4 ring-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/avatars/case${n}_banner.png`}
        alt=""
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
    </span>
  );
}

export default function HomeCases() {
  const locale = useLocale();
  const lang = (locale === 'en' ? 'en' : 'zh') as 'zh' | 'en';
  const more = lang === 'zh' ? '查看详情' : 'View details';

  return (
    <div className="grid grid-cols-1 items-stretch gap-x-6 gap-y-16 pt-10 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.slug}
          href={`/cases/${c.slug}`}
          className="card card-hover group relative flex h-56 flex-col p-6 pt-7"
        >
          <span className="absolute right-5 top-5 text-gold/45">{c.topIcon}</span>

          <div className="flex items-start gap-4">
            <Avatar n={c.n} />
            <div className="min-w-0 flex-1 pr-6 pt-1">
              <p className="text-[17px] font-bold leading-tight text-navy">
                {c.age[lang]} · {c.stage[lang]}
              </p>
              <p className="mt-1.5 text-[13px] font-medium text-gold-deep">{c.tag[lang]}</p>
            </div>
          </div>

          <h3 className="flex flex-1 items-center text-[17px] font-bold leading-relaxed text-navy">
            {c.q[lang]}
          </h3>

          <span className="text-[13px] font-medium text-gold-deep transition-colors group-hover:text-gold">
            {more} →
          </span>
        </Link>
      ))}
    </div>
  );
}
