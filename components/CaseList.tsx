'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Case = {
  tag: string;
  title: string;
  profile: string;
  existing: string;
  worry: string;
  notAdvice: string;
  firstAdvice: string;
  whyOrder: string;
  outcome: string;
};

export default function CaseList() {
  const t = useTranslations('cases');
  const list = t.raw('list') as Case[];
  const [open, setOpen] = useState<number | null>(0);

  const rows = (c: Case) => [
    { label: t('labelProfile'), value: c.profile },
    { label: t('labelExisting'), value: c.existing },
    { label: t('labelWorry'), value: c.worry },
    { label: t('labelFirstAdvice'), value: c.firstAdvice },
    { label: t('labelWhyOrder'), value: c.whyOrder },
    { label: t('labelOutcome'), value: c.outcome },
  ];

  return (
    <div className="space-y-4">
      {list.map((c, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-sm border border-navy/10 bg-white"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-cream/50"
              aria-expanded={isOpen}
            >
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-gold-deep">
                  {c.tag}
                </span>
                <h3 className="mt-1.5 font-serif text-lg font-semibold text-navy">
                  {c.title}
                </h3>
              </div>
              <span
                className={`shrink-0 text-gold-deep transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : ''
                }`}
                aria-hidden
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-navy/10 px-6 py-6">
                <dl className="space-y-5">
                  {/* 客户画像 / 当前配置 / 最担心的问题 */}
                  {rows(c).slice(0, 3).map((r, j) => (
                    <div
                      key={j}
                      className="grid gap-1.5 md:grid-cols-[140px_1fr] md:gap-6"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gold-deep">
                        {r.label}
                      </dt>
                      <dd className="text-sm leading-relaxed text-navy/80">
                        {r.value}
                      </dd>
                    </div>
                  ))}

                  {/* 我没有建议什么 —— 重点突出,体现先做需求分析 */}
                  <div className="grid gap-1.5 rounded-sm border-l-2 border-gold bg-cream/60 px-5 py-4 md:grid-cols-[140px_1fr] md:gap-6">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gold-deep">
                      {t('labelNotAdvice')}
                    </dt>
                    <dd className="text-sm leading-relaxed text-navy/80">
                      {c.notAdvice}
                    </dd>
                  </div>

                  {/* 我建议先做什么 / 为什么这样排序 / 客户最后得到的结果 */}
                  {rows(c).slice(3).map((r, j) => (
                    <div
                      key={j}
                      className="grid gap-1.5 md:grid-cols-[140px_1fr] md:gap-6"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gold-deep">
                        {r.label}
                      </dt>
                      <dd className="text-sm leading-relaxed text-navy/80">
                        {r.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
