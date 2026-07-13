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
