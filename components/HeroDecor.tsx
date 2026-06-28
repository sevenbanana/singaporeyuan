'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// 首屏「大圆小圆」装饰 + 轻微滚动视差(尊重 prefers-reduced-motion)
export default function HeroDecor({ accent }: { accent?: ReactNode }) {
  const [y, setY] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        // 仅首屏附近生效,缓慢下移制造纵深
        setY(Math.min(window.scrollY, 700) * 0.18);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
      >
        <div className="absolute right-[-7%] top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full border border-gold/30" />
        <div className="absolute right-[6%] top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-gold/[0.06]" />
        <div className="absolute right-[24%] top-[20%] h-16 w-16 rounded-full border border-gold/40" />
        <div className="absolute right-[40%] top-[26%] h-2.5 w-2.5 rounded-full bg-gold/50" />
        <div className="absolute bottom-[18%] right-[14%] h-2 w-2 rounded-full bg-gold/40" />
        {accent && (
          <div className="absolute right-[8%] top-1/2 flex h-44 w-44 -translate-y-1/2 items-center justify-center text-gold/25 lg:h-56 lg:w-56">
            {accent}
          </div>
        )}
      </div>
    </div>
  );
}
