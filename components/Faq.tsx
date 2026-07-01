'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Cat = { name: string; items: { q: string; a: string }[] };

// 分类小图标:规划流程 / 保障医疗 / 退休传承 / 新移民·EP
function TabIcon({ i }: { i: number }) {
  const p = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (i === 0) return <svg {...p}><path d="M4 6h16M4 12h10M4 18h7" /></svg>;
  if (i === 1) return <svg {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 11.5c1 1 2 1.8 3 2.8 1-1 2-1.8 3-2.8" /></svg>;
  if (i === 2) return <svg {...p}><path d="M4 19h16" /><path d="M5 15l4-4 3 3 6-7" /><path d="M18 7h-3M18 7v3" /></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" /></svg>;
}

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
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              tab === i ? 'bg-navy text-cream shadow-card' : 'bg-sand-100 text-mist hover:text-navy'
            }`}
          >
            <span className={tab === i ? 'text-gold-light' : 'text-gold-deep/70'}>
              <TabIcon i={i} />
            </span>
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
                className="flex w-full items-center gap-3 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold transition-colors ${
                    isOpen ? 'bg-gold text-white' : 'bg-gold/12 text-gold-deep'
                  }`}
                  aria-hidden
                >
                  Q
                </span>
                <span className="flex-1 text-[15px] font-semibold text-navy">{item.q}</span>
                <span
                  className={`shrink-0 text-gold-deep transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <p className="mb-5 ml-9 border-l-2 border-gold/40 pl-4 pr-6 text-sm leading-relaxed text-navy/75">
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
