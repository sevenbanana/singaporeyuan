'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { flowIcons, IconGrowth } from '@/components/icons';

type Step = { t: string; d: string; deliver: string };

function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServiceFlow() {
  const t = useTranslations('home');
  const steps = t.raw('flowSteps') as Step[];
  const [active, setActive] = useState(3);
  const ActiveIcon = flowIcons[active];

  return (
    <div>
      {/* ===== 横向时间轴 ===== */}
      <div className="grid grid-cols-3 gap-y-10 sm:grid-cols-6">
        {steps.map((s, i) => {
          const Icon = flowIcons[i];
          const done = i < active;
          const on = i === active;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-pressed={on}
              className="group relative flex flex-col items-center text-center outline-none"
            >
              {/* 连接线(桌面):当前之前实金线,之后虚灰线 */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-1/2 top-7 hidden w-full sm:block ${
                    i < active ? 'h-[2px] bg-gold/60' : 'h-0 border-t-2 border-dashed border-mist/30'
                  }`}
                />
              )}

              {/* 序号圆环 */}
              <span
                className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold transition-all duration-300 ${
                  on
                    ? 'scale-110 bg-navy text-cream ring-2 ring-gold ring-offset-2 ring-offset-cream'
                    : done
                    ? 'border border-gold/50 bg-cream text-gold-deep group-hover:border-gold'
                    : 'border border-mist/25 bg-cream text-mist group-hover:border-gold/50'
                }`}
              >
                {i + 1}
                {done && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-white">
                    <Check />
                  </span>
                )}
              </span>

              {/* 小图标 + 标签 */}
              <Icon
                className={`mt-5 transition-colors ${on || done ? 'text-gold-deep' : 'text-mist'}`}
                width={26}
                height={26}
              />
              <span className={`mt-2.5 text-sm font-bold ${on ? 'text-navy' : 'text-navy/65'}`}>
                {s.t}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===== 详情卡片 ===== */}
      <div className="relative mt-12 overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-sand-50 to-cream p-8 md:p-12">
        {/* 超大水印数字 */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none text-[7rem] font-black leading-none text-gold/10 md:text-[11rem]"
        >
          {('0' + (active + 1)).slice(-2)}
        </span>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* 深蓝圆形图标徽章 */}
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy text-gold ring-1 ring-gold/50 ring-offset-2 ring-offset-cream">
            <ActiveIcon width={28} height={28} />
          </span>

          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-navy md:text-3xl">{steps[active].t}</h3>
            <div className="my-4 h-px w-10 bg-gold" />
            <p className="text-[15px] leading-[1.95] text-mist">{steps[active].d}</p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-xs font-medium text-gold-deep">
              <IconGrowth width={15} height={15} />
              {t('flowDeliverLabel')}:{steps[active].deliver}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
