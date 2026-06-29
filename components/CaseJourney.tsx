// 人生旅程时间轴：6 个案例按年龄升序排成一条可生长的画布。
// 节点用真实人物半身像，点击进入详情页。卡片展示内容在下方 cardContent 维护。
import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/routing';
import { CASES } from '@/lib/cases';
import { IconShield, IconHome, IconBaby, IconGrowth, IconMoney } from '@/components/icons';

const IconBriefcase = (p: { width?: number; height?: number }) => (
  <svg width={p.width} height={p.height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
    <path d="M3 12h18M11 12v2.5h2V12" />
  </svg>
);

// 每张卡片的展示内容（标题/年龄来自 lib/cases.ts）
const cardContent: Record<string, { lead: string; pills: string[]; icon: ReactNode }> = {
  'first-job': {
    lead: '收入刚起步、储蓄还薄,最怕一场病或意外打乱节奏——先用小预算把健康和意外的底兜住。',
    pills: ['基础保障', '预算友好', '安心起步'],
    icon: <IconShield width={20} height={20} />,
  },
  'new-home': {
    lead: '新婚、刚扛起房贷,最怕一方出事另一方扛不住——用定期寿险锁住房贷责任,补上双方重疾。',
    pills: ['房贷责任', '夫妻互保', '守住的家'],
    icon: <IconHome width={20} height={20} />,
  },
  'new-parents': {
    lead: '有了孩子,保障顺序更要排对——先补好经济支柱大人的重疾与人寿,再为孩子搭基础与教育金。',
    pills: ['先保大人', '孩子基础', '教育金'],
    icon: <IconBaby width={20} height={20} />,
  },
  'wealth-growth': {
    lead: '保障已经齐了,接下来是增值——用稳健储蓄搭一条到 50 岁可领取的现金流,顺带把税省下来。',
    pills: ['先保后增', '节税增值', '提前退休'],
    icon: <IconGrowth width={20} height={20} />,
  },
  'usd-retirement': {
    lead: '手握一笔暂时用不上的美元,与其追短期波动,不如换一份按年领取、保至百岁的稳定现金流。',
    pills: ['美元储备', '稳定现金流', '保至百岁'],
    icon: <IconMoney width={20} height={20} />,
  },
  'business-owner': {
    lead: '公司与家庭的钱先分账,再用稳健现金流兜底、补人寿做传承——进可攻、退可守。',
    pills: ['公私分账', '稳健兜底', '资产传承'],
    icon: <IconBriefcase width={20} height={20} />,
  },
};

const PillCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 6.5" />
  </svg>
);

function Avatar({ n, name }: { n: number; name: string }) {
  return (
    <span className="relative block h-20 w-20 overflow-hidden rounded-full border-2 border-gold/40 bg-white shadow-sm md:h-24 md:w-24">
      <Image
        src={`/avatars/case${n}_banner.png`}
        alt={name}
        fill
        sizes="96px"
        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
    </span>
  );
}

export default function CaseJourney() {
  return (
    <div className="relative">
      {/* 中轴线 */}
      <div aria-hidden className="absolute left-[39px] top-4 bottom-10 w-px bg-gradient-to-b from-gold/50 via-gold/30 to-gold/10 md:left-1/2 md:-translate-x-1/2" />

      <ol>
        {CASES.map((c, i) => {
          const left = i % 2 === 0; // 桌面端左右交错
          const cc = cardContent[c.slug];
          return (
            <li
              key={c.slug}
              className={`relative md:grid md:grid-cols-2 md:gap-16 md:py-4 ${i > 0 ? 'mt-10 md:-mt-28' : ''}`}
            >
              {/* 人物节点 */}
              <Link
                href={`/cases/${c.slug}`}
                aria-label={c.mapLabel}
                className="group absolute left-0 top-0 z-10 block md:left-1/2 md:top-4 md:-translate-x-1/2"
              >
                <Avatar n={i + 1} name={c.mapLabel} />
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-cream text-sm font-bold text-gold-deep shadow-sm">
                  {c.age}
                </span>
              </Link>

              {/* 卡片 */}
              <div className={`ml-28 md:ml-0 ${left ? 'md:col-start-1 md:pr-10' : 'md:col-start-2 md:pl-10'}`}>
                <Link href={`/cases/${c.slug}`} className="card card-hover group relative block p-6 text-left">
                  {/* 指向对应头像的小三角(气泡尾巴),只在桌面端显示 */}
                  <span
                    aria-hidden
                    className={`absolute top-12 hidden h-3 w-3 -translate-y-1/2 rotate-45 border-gold/30 bg-sand-50 md:block ${
                      left ? '-right-1.5 border-r border-t' : '-left-1.5 border-b border-l'
                    }`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-mist">{c.mapLabel}</span>
                    {cc?.icon && (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-deep ring-1 ring-gold/20 transition-colors group-hover:bg-gold/15">
                        {cc.icon}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 h-0.5 w-10 rounded-full bg-gold/60" />

                  <h3 className="mt-3 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-gold-deep">
                    {c.title}
                  </h3>

                  {cc?.lead && <p className="mt-2.5 text-sm leading-relaxed text-mist">{cc.lead}</p>}

                  {cc?.pills && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cc.pills.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/[0.06] px-3 py-1 text-xs font-medium text-gold-deep"
                        >
                          <PillCheck />
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-5 inline-block text-sm font-medium text-gold-deep transition-colors group-hover:text-gold">
                    查看案例 →
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      {/* 生长提示 */}
      <div className="relative mt-10 md:mt-4">
        <span
          aria-hidden
          className="absolute left-[19px] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-gold/40 bg-cream text-lg text-gold-deep/60 md:left-1/2 md:-translate-x-1/2"
        >
          +
        </span>
        <p className="ml-28 pt-2 text-sm text-mist md:ml-0 md:pt-16 md:text-center">
          人生还在继续，案例库也会随之生长……
        </p>
      </div>
    </div>
  );
}
