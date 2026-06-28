'use client';

import { useEffect, useRef, useState } from 'react';

// 打字机效果:轮流展示多个身份词;尊重 prefers-reduced-motion
export default function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setText(words[0]);
      setDone(true);
      return;
    }

    let wi = 0;
    let ci = 0;
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const w = words[wi];
      if (!deleting) {
        ci++;
        setText(w.slice(0, ci));
        if (ci === w.length) {
          deleting = true;
          timer.current = setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        setText(w.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          timer.current = setTimeout(tick, 320);
          return;
        }
      }
      timer.current = setTimeout(tick, deleting ? 60 : 130);
    };

    timer.current = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [words]);

  return (
    <span>
      {text}
      <span
        aria-hidden
        className={`ml-0.5 inline-block w-[2px] -translate-y-0.5 self-center bg-gold-deep align-middle ${
          done ? 'opacity-0' : 'animate-pulse'
        }`}
        style={{ height: '0.9em' }}
      />
    </span>
  );
}
