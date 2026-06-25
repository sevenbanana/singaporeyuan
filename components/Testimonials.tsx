'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('home');
  const tt = useTranslations('testimonials');
  const [tab, setTab] = useState<'clients' | 'peers'>('clients');
  const clients = tt.raw('clients') as { quote: string; author: string }[];

  return (
    <div>
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

      {tab === 'clients' ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((c, i) => (
            <figure key={i} className="card card-hover flex flex-col p-7">
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
    </div>
  );
}
