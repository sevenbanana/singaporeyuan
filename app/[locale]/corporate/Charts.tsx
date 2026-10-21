'use client';

import { useEffect, useRef, useState } from 'react';
import { P, NAVY, GOLD, CREAM, type IconKey } from './icons';

/** 滚到视野里才触发动画(尊重 prefers-reduced-motion) */
function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, live };
}

/* ───────────── PIM 年度限额五档:柱状图 ───────────── */
export function LimitTiers({
  tiers,
  note,
}: {
  tiers: { v: number; read: string; plan: string; top?: string }[];
  note: string;
}) {
  const { ref, live } = useInView<HTMLDivElement>();
  const max = Math.max(...tiers.map((t) => t.v));
  return (
    <div ref={ref}>
      <div className="relative flex h-48 items-end gap-2 border-b-2 border-navy/15 sm:gap-3">
        {/* 横向参考线(很淡) */}
        {[0.25, 0.5, 0.75].map((f) => (
          <span key={f} aria-hidden className="absolute inset-x-0 border-t border-dashed border-navy/[0.08]" style={{ bottom: `${f * 100}%` }} />
        ))}
        {tiers.map((t, i) => {
          const h = (t.v / max) * 100;
          const isTop = i === tiers.length - 1;
          return (
            <div key={t.plan} className="group relative flex h-full flex-1 flex-col justify-end" title={`${t.plan} · ${t.read}`}>
              <div
                className="relative flex flex-col items-center justify-end"
                style={{
                  height: live ? `${h}%` : '0%',
                  transition: 'height .9s cubic-bezier(.2,.8,.2,1)',
                  transitionDelay: `${i * 110}ms`,
                }}
              >
                <span
                  className={`absolute -top-6 whitespace-nowrap text-xs font-black tabular-nums text-navy transition-opacity duration-500 sm:text-sm ${
                    live ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${i * 110 + 500}ms` }}
                >
                  {t.read}
                </span>
                <span
                  className={`block h-full w-full rounded-t-[4px] transition-colors ${
                    isTop ? 'bg-gradient-to-t from-gold-deep to-gold' : 'bg-gradient-to-t from-gold to-gold-light group-hover:from-gold-deep group-hover:to-gold'
                  }`}
                />
                {isTop && t.top && (
                  <span className="absolute -top-12 whitespace-nowrap rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-gold">
                    {t.top}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {tiers.map((t) => (
          <span key={t.plan} className="flex-1 text-center text-[11px] font-semibold text-navy/60">
            {t.plan}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-mist">{note}</p>
    </div>
  );
}

/* ───────────── 连续 20 年金奖:奖牌连线 ───────────── */
export function AwardStreak({ from, to, label }: { from: number; to: number; label: string }) {
  const { ref, live } = useInView<HTMLDivElement>(0.3);
  const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-cream/80">{label}</p>
        <p className="hidden shrink-0 text-[11px] tabular-nums text-cream/50 sm:block">
          {from}–{to}
        </p>
      </div>
      <div className="relative mt-3">
        <span aria-hidden className="absolute inset-x-2 top-1/2 hidden h-px bg-gold/30 sm:block" />
        <div className="relative grid grid-cols-10 gap-y-2.5 sm:grid-cols-[repeat(20,minmax(0,1fr))]">
          {years.map((y, i) => {
            const last = i === years.length - 1;
            return (
              <span
                key={y}
                title={`${y}`}
                className="flex justify-center"
                style={{
                  opacity: live ? 1 : 0,
                  transform: live ? 'scale(1)' : 'scale(.4)',
                  transition: 'opacity .4s ease, transform .5s cubic-bezier(.3,1.6,.5,1)',
                  transitionDelay: `${i * 55}ms`,
                }}
              >
                <svg width={last ? 26 : 20} height={last ? 26 : 20} viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="10.5" fill={last ? GOLD : NAVY} stroke={GOLD} strokeWidth="1.6" />
                  <path
                    d="m12 6.6 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"
                    fill={last ? NAVY : GOLD}
                  />
                </svg>
              </span>
            );
          })}
        </div>
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-cream/45 sm:hidden">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}

/* ───────────── WorkWell 一年活动日历:可交互圆盘 ───────────── */
export type Month = { m: string; icon: IconKey; cat: string; t: string };

export function CalendarWheel({ months, hint }: { months: Month[]; hint: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref, live } = useInView<HTMLDivElement>(0.4);

  useEffect(() => {
    if (!live || paused) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % months.length), 2400);
    return () => window.clearInterval(id);
  }, [live, paused, months.length]);

  const c = 160;
  const R = 152;
  const r = 98;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (radius: number, deg: number) => [c + radius * Math.cos(rad(deg)), c + radius * Math.sin(rad(deg))];
  const seg = (i: number) => {
    const a0 = -105 + i * 30;
    const a1 = a0 + 30;
    const [x0, y0] = pt(R, a0);
    const [x1, y1] = pt(R, a1);
    const [x2, y2] = pt(r, a1);
    const [x3, y3] = pt(r, a0);
    return `M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 0 0 ${x3} ${y3}Z`;
  };

  const pick = (i: number) => {
    setPaused(true);
    setActive(i);
  };
  const cur = months[active];

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[340px]">
      <svg viewBox="0 0 320 320" className="h-auto w-full" role="group" aria-label={hint}>
        {months.map((mo, i) => {
          const on = i === active;
          const deg = -90 + i * 30;
          const [ix, iy] = pt(136, deg);
          const [tx, ty] = pt(111, deg);
          return (
            <g
              key={mo.m}
              role="button"
              tabIndex={0}
              aria-label={`${mo.m} ${mo.cat} ${mo.t}`}
              aria-pressed={on}
              onMouseEnter={() => pick(i)}
              onFocus={() => pick(i)}
              onClick={() => pick(i)}
              className="cursor-pointer outline-none"
            >
              <path
                d={seg(i)}
                fill={on ? NAVY : i % 3 === 0 ? '#efe6d2' : '#f5efe1'}
                stroke={CREAM}
                strokeWidth="3"
                style={{ transition: 'fill .3s ease' }}
              />
              <svg
                x={ix - 10}
                y={iy - 10}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={on ? GOLD : NAVY}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={on ? 1 : 0.7}
              >
                {P[mo.icon]}
              </svg>
              <text
                x={tx}
                y={ty + 3.5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill={on ? CREAM : NAVY}
                opacity={on ? 1 : 0.55}
              >
                {mo.m}
              </text>
            </g>
          );
        })}
        <circle cx={c} cy={c} r="88" fill="#fff" stroke={GOLD} strokeOpacity=".35" />
        <circle cx={c} cy={c} r="80" fill="none" stroke={GOLD} strokeOpacity=".2" strokeDasharray="2 4" />
      </svg>

      {/* 圆心详情(HTML 叠在 SVG 上,文字更清晰) */}
      <div aria-live="polite" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[30%] text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {P[cur.icon]}
          </svg>
        </span>
        <p className="mt-2 text-2xl font-black leading-none text-navy">{cur.m}</p>
        <p className="mt-1.5 text-[11px] font-bold tracking-wide text-gold-deep">{cur.cat}</p>
        <p className="mt-0.5 text-sm font-bold leading-snug text-navy">{cur.t}</p>
      </div>
    </div>
  );
}
