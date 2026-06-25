'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Case = {
  tag: string;
  title: string;
  profile: string;
  existing: string;
  risk: string;
  needs: string;
  advice: string;
};

export default function CaseList() {
  const t = useTranslations('cases');
  const list = t.raw('list') as Case[];
  const [open, setOpen] = useState<number | null>(0);

  const rows = (c: Case) => [
    { label: t('labelProfile'), value: c.profile },
    { label: t('labelExisting'), value: c.existing },
    { label: t('labelRisk'), value: c.risk },
    { label: t('labelNeeds'), value: c.needs },
    { label: t('labelAdvice'), value: c.advice },
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
                  {rows(c).map((r, j) => (
                    <div
                      key={j}
                      className="grid gap-1.5 md:grid-cols-[120px_1fr] md:gap-6"
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
