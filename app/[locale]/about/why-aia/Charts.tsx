'use client';

import { useEffect, useRef, useState } from 'react';

export type Row = {
  label: string;
  /** 单值条 */
  value?: number;
  /** 区间条(行业区间) */
  from?: number;
  to?: number;
  /** 显示在右侧的读数 */
  read: string;
  tone?: 'gold' | 'mist';
  note?: string;
};

/**
 * 横向条形图:滚到视野里才长出来。
 * 不点名同业,只呈现 AIA 的绝对值与行业区间/中位。
 */
export default function BarChart({
  rows,
  max,
  axis,
  caption,
}: {
  rows: Row[];
  max: number;
  axis: string[];
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setLive(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pct = (v: number) => Math.max(1.5, (v / max) * 100);

  return (
    <div ref={ref} className="mt-6">
      <div className="space-y-4">
        {rows.map((r, i) => {
          const gold = r.tone !== 'mist';
          const isRange = r.from !== undefined && r.to !== undefined;
          const left = isRange ? (r.from! / max) * 100 : 0;
          const width = isRange ? pct(r.to! - r.from!) : pct(r.value ?? 0);
          return (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-bold text-navy">{r.label}</span>
                <span
                  className={`text-sm font-black tabular-nums ${
                    gold ? 'text-gold-deep' : 'text-mist'
                  }`}
                >
                  {r.read}
                </span>
              </div>
              <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-sand-100">
                <span
                  className={`absolute inset-y-0 rounded-full ${
                    gold ? 'bg-gold' : 'bg-navy/25'
                  }`}
                  style={{
                    left: `${left}%`,
                    width: live ? `${width}%` : 0,
                    transition: 'width .9s cubic-bezier(.2,.8,.2,1)',
                    transitionDelay: `${i * 110}ms`,
                  }}
                />
              </div>
              {r.note && <p className="mt-1.5 text-xs leading-relaxed text-mist">{r.note}</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between border-t border-navy/10 pt-2 text-[11px] tabular-nums text-mist">
        {axis.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
      {caption && <p className="mt-3 text-xs leading-[1.9] text-mist">{caption}</p>}
    </div>
  );
}
