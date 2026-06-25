'use client';

import { useEffect, useRef, useState } from 'react';

// 把 "SGD 20.9M" / "254" / "6000+" 拆成 前缀 + 数字 + 后缀,只滚动数字部分
function parse(value: string) {
  const m = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!m) return { prefix: '', num: 0, suffix: value, decimals: 0, raw: value };
  const prefix = m[1];
  const numStr = m[2].replace(/,/g, '');
  const suffix = m[3];
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  return { prefix, num: parseFloat(numStr), suffix, decimals, raw: value };
}

export default function CountUp({
  value,
  className = '',
}: {
  value: string;
  className?: string;
}) {
  const { prefix, num, suffix, decimals } = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState('0');
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1400;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              const current = num * eased;
              setDisplay(
                current.toLocaleString('en-US', {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                })
              );
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [num, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
