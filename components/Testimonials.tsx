'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('home');
  const tt = useTranslations('testimonials');
  const [tab, setTab] = useState<'clients' | 'peers'>('clients');
  const clients = tt.raw('clients') as { quote: string; author: string }[];
  const peers = tt.raw('peers') as { quote: string; author: string }[];
  const items = tab === 'clients' ? clients : peers;
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const arrowBtn =
    'flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-navy transition-all hover:border-gold hover:bg-gold/10 disabled:opacity-30';

  return (
    <div>
      {/* tabs + arrows */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('clients')}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              tab === 'clients' ? 'bg-navy text-cream shadow-card' : 'bg-sand-100 text-mist hover:text-navy'
            }`}
          >
            {t('tabClients')}
          </button>
          <button
            onClick={() => setTab('peers')}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              tab === 'peers' ? 'bg-navy text-cream shadow-card' : 'bg-sand-100 text-mist hover:text-navy'
            }`}
          >
            {t('tabPeers')}
          </button>
        </div>

        {items.length > 0 && (
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scrollBy(-1)} className={arrowBtn} aria-label="上一个">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => scrollBy(1)} className={arrowBtn} aria-label="下一个">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {items.length > 0 ? (
        <div
          ref={scroller}
          className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((c, i) => (
            <figure
              key={i}
              className="card flex w-[80%] shrink-0 snap-start flex-col p-7 sm:w-[340px]"
            >
              <span aria-hidden className="text-4xl font-black leading-none text-gold/40">&ldquo;</span>
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink/80">{c.quote}</blockquote>
              <figcaption className="mt-5 text-xs font-medium tracking-wide text-gold-deep">{c.author}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex items-center justify-center rounded-2xl border border-dashed border-gold/40 bg-sand-50/60 py-16">
          <p className="text-sm text-mist">{t('peersPlaceholder')}</p>
        </div>
      )}

      {tab === 'peers' && items.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mist">
          <span>{tt('peersNote')}</span>
          <a
            href="https://ntuyyuan.wixsite.com/yuanyuan"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold-deep transition-colors hover:text-gold"
          >
            {tt('portfolioLink')} →
          </a>
        </div>
      )}
    </div>
  );
}
