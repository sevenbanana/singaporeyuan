'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Cat = { name: string; items: { q: string; a: string }[] };

export default function Faq() {
  const t = useTranslations('consult');
  const cats = t.raw('faqCategories') as Cat[];
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {cats.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              setTab(i);
              setOpen(null);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              tab === i
                ? 'bg-navy text-cream shadow-card'
                : 'bg-sand-100 text-mist hover:text-navy'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="mt-6 divide-y divide-navy/10 border-y border-navy/10">
        {cats[tab].items.map((item, j) => {
          const id = `${tab}-${j}`;
          const isOpen = open === id;
          return (
            <div key={id}>
              <button
                onClick={() => setOpen(isOpen ? null : id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-navy">{item.q}</span>
                <span
                  className={`shrink-0 text-gold-deep transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <p className="pb-5 pr-8 text-sm leading-relaxed text-navy/75">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
