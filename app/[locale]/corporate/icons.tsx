// 企业团险页的图标与插画。
// 线性图标:24 栅格、currentColor 描边(和全站 icons 同一笔触);
// 扁平插画:64 栅格、海军蓝主体 + 香槟金点缀(和 why-aia/SectionArt 同一语言)。

export const NAVY = '#1a2744';
export const GOLD = '#c9a55c';
export const GOLD_LIGHT = '#dcc088';
export const CREAM = '#FBF8F1';

/* ───────────── 线性图标路径(可嵌进任意 <svg viewBox="0 0 24 24">)───────────── */
export const P = {
  team: (
    <>
      <circle cx="9" cy="8.5" r="3.1" />
      <path d="M3.5 20c.4-3.4 2.8-5.2 5.5-5.2s5.1 1.8 5.5 5.2" />
      <path d="M15.3 5.7a3.1 3.1 0 0 1 0 5.6M17.4 15c2 .7 3.3 2.3 3.6 5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20.5c.5-4 3.3-6.5 7-6.5s6.5 2.5 7 6.5" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.5" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 5h3M11 18.5h2" />
    </>
  ),
  heart: (
    <path d="M12 20.3C7.2 16.5 3.5 13.2 3.5 9.2 3.5 6.4 5.6 4.5 8 4.5c1.6 0 3 .8 4 2.1 1-1.3 2.4-2.1 4-2.1 2.4 0 4.5 1.9 4.5 4.7 0 4-3.7 7.3-8.5 11.1z" />
  ),
  clinic: (
    <>
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M12 12.5v5M9.5 15h5" />
    </>
  ),
  bed: (
    <>
      <path d="M3 6v13M3 15h18v4" />
      <path d="M21 15v-3a3 3 0 0 0-3-3h-7v6" />
      <circle cx="7" cy="11.5" r="2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18" />
      <path d="M6.8 15.5h4.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.3 3.7 5.2 3.7 8.5s-1.3 6.2-3.7 8.5c-2.4-2.3-3.7-5.2-3.7-8.5s1.3-6.2 3.7-8.5z" />
    </>
  ),
  plus: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.4 2.6 2.6 5-5.6" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />,
  steth: (
    <>
      <path d="M5 3H4a1 1 0 0 0-1 1v5a5 5 0 0 0 10 0V4a1 1 0 0 0-1-1h-1" />
      <path d="M8 14v2.5a5.5 5.5 0 0 0 11 0v-4" />
      <circle cx="19" cy="10" r="2.4" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </>
  ),
  run: (
    <>
      <circle cx="14" cy="5" r="2" />
      <path d="m8 21 3-6-2.5-3 3-4 2.5 3H18" />
      <path d="m6 12 2.5-4.5L12 6" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-.8-.5-1.3-.5-2 0-1 .8-1.8 1.9-1.8h2A3.3 3.3 0 0 0 20.5 12c0-4.7-3.8-8.5-8.5-8.5z" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16" cy="10" r="1" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v4.5A4.5 4.5 0 0 1 11.5 18h-3A4.5 4.5 0 0 1 4 13.5z" />
      <path d="M16 10h2.2a2.4 2.4 0 0 1 0 4.8H16" />
      <path d="M7.5 3.5c-.9 1.1-.9 2.2 0 3.3M11.5 3.5c-.9 1.1-.9 2.2 0 3.3" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  tent: (
    <>
      <path d="m12 4 9 16H3z" />
      <path d="M12 12v8" />
      <path d="m9.5 20 2.5-4 2.5 4" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M8.6 10.2 5.8 3.5h3.8l2.4 5.2M15.4 10.2l2.8-6.7h-3.8L12 8.7" />
      <path d="m12 12 .9 1.6 1.8.3-1.3 1.3.3 1.8-1.7-.9-1.7.9.3-1.8-1.3-1.3 1.8-.3z" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19c0 1.5-1.5 2.5-4 2.5h-2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h2M14 14h2M8 17h2" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v10H10l-4.5 3.5v-3.5H4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  compare: (
    <>
      <rect x="3" y="5" width="7.5" height="14" rx="1.5" />
      <rect x="13.5" y="5" width="7.5" height="14" rx="1.5" />
      <path d="M5.5 9h2.5M16 9h2.5M5.5 12.5h2.5M16 12.5h2.5" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5h14a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1z" />
      <path d="M4 7.5 15 4v3.5" />
      <circle cx="16" cy="14" r="1.2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5z" />
      <path d="m9 11 2 2 4-4" />
    </>
  ),
  tooth: (
    <path d="M8 3.5c-2.7 0-4.5 2-4.5 4.8 0 2.4 1 3.8 1.6 5.6.7 2.2.9 6.6 2.9 6.6 1.7 0 1.6-4.5 4-4.5s2.3 4.5 4 4.5c2 0 2.2-4.4 2.9-6.6.6-1.8 1.6-3.2 1.6-5.6 0-2.8-1.8-4.8-4.5-4.8-1.6 0-2.6.8-4 .8s-2.4-.8-4-.8z" />
  ),
  stroller: (
    <>
      <path d="M3.5 5H6l1.6 9h10" />
      <path d="M7 10h12a5 5 0 0 0-5-5h-1v5" />
      <circle cx="9" cy="18.5" r="2" />
      <circle cx="16" cy="18.5" r="2" />
    </>
  ),
  glasses: (
    <>
      <circle cx="6.5" cy="14" r="3.5" />
      <circle cx="17.5" cy="14" r="3.5" />
      <path d="M10 13.4c1.3-1 2.7-1 4 0M3 13l1.6-6M21 13l-1.6-6" />
    </>
  ),
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  tag: (
    <>
      <path d="M3.5 12.5V4.5h8l9 9-8 8z" />
      <circle cx="8" cy="9" r="1.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6.5" width="12.5" height="11" rx="2" />
      <path d="m15.5 10.5 5-3v9l-5-3" />
    </>
  ),
  arrowUp: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 16.5v-9M8.5 11 12 7.5l3.5 3.5" />
    </>
  ),
  life: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m6 6 3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
} as const;

export type IconKey = keyof typeof P;

export function Icon({
  k,
  size = 22,
  sw = 1.7,
  className = '',
}: {
  k: IconKey;
  size?: number;
  sw?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {P[k]}
    </svg>
  );
}

/* ───────────── 扁平插画 ───────────── */

/** 首屏主插画:盾牌护住一个团队 + 爱心徽章 + 医疗徽章 */
export function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="100" cy="104" r="92" fill={GOLD} opacity=".08" />
      <path d="M100 18 164 40v56c0 44-28 72-64 86-36-14-64-42-64-86V40z" fill={NAVY} />
      <path
        d="M100 31 152 49v47c0 36-23 59-52 71-29-12-52-35-52-71V49z"
        stroke={GOLD}
        strokeWidth="1.6"
        opacity=".55"
      />
      {/* 两侧同事 */}
      <circle cx="68" cy="94" r="10" fill={CREAM} opacity=".92" />
      <path d="M50 136c1-14 8-22 18-22s17 8 18 22z" fill={CREAM} opacity=".92" />
      <circle cx="132" cy="94" r="10" fill={CREAM} opacity=".92" />
      <path d="M114 136c1-14 8-22 18-22s17 8 18 22z" fill={CREAM} opacity=".92" />
      {/* 中间主角 */}
      <circle cx="100" cy="84" r="12.5" fill={GOLD} />
      <path d="M77 140c1-20 10-32 23-32s22 12 23 32z" fill={GOLD} />
      <path d="M56 140h88" stroke={GOLD_LIGHT} strokeWidth="3" strokeLinecap="round" />
      {/* 爱心徽章 */}
      <circle cx="162" cy="42" r="21" fill={GOLD} />
      <circle cx="162" cy="42" r="21" stroke={CREAM} strokeWidth="3" />
      <path
        d="M162 53c-9.5-6.8-13.5-11.6-13.5-16 0-3.8 2.9-6.4 6.3-6.4 3 0 5.6 1.8 7.2 4.3 1.6-2.5 4.2-4.3 7.2-4.3 3.4 0 6.3 2.6 6.3 6.4 0 4.4-4 9.2-13.5 16z"
        fill={NAVY}
      />
      {/* 医疗徽章 */}
      <circle cx="38" cy="150" r="17" fill={CREAM} stroke={GOLD} strokeWidth="3" />
      <path d="M38 141v18M29 150h18" stroke={NAVY} strokeWidth="4.5" strokeLinecap="round" />
      {/* 点缀 */}
      <circle cx="30" cy="58" r="4" fill={GOLD} opacity=".7" />
      <circle cx="176" cy="132" r="3" fill={GOLD} opacity=".6" />
      <path d="M180 92v10M175 97h10" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

/** 为什么值得做:三张扁平插画 */
export function WhyArt({ k, className = '' }: { k: 'talent' | 'duty' | 'paperless'; className?: string }) {
  const p = { viewBox: '0 0 64 64', className, fill: 'none' as const, xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true };
  switch (k) {
    /* 引才留才:磁铁吸住人才 */
    case 'talent':
      return (
        <svg {...p}>
          <path d="M11 24v13a15 15 0 0 0 30 0V24" stroke={NAVY} strokeWidth="9" />
          <rect x="6.5" y="17" width="9" height="8" rx="1.5" fill={GOLD} />
          <rect x="36.5" y="17" width="9" height="8" rx="1.5" fill={GOLD} />
          <circle cx="50" cy="9" r="5.5" fill={GOLD} />
          <path d="M41 27c.6-7 4-10.5 9-10.5s8.4 3.5 9 10.5z" fill={GOLD} />
          <path d="M30 9c3-2 6-2.5 9-2M28 15c3-1.5 6-1.8 9-1.5" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" opacity=".45" />
        </svg>
      );
    /* 雇主责任:伞下有人 */
    case 'duty':
      return (
        <svg {...p}>
          <path
            d="M5 30C5 16.5 17 6 32 6s27 10.5 27 24c-4.4-3.2-9-3.2-13.5 0-4.5-3.2-9-3.2-13.5 0-4.5-3.2-9-3.2-13.5 0C14 26.8 9.4 26.8 5 30z"
            fill={NAVY}
          />
          <circle cx="32" cy="5" r="2.6" fill={GOLD} />
          <path d="M32 30v20a4.5 4.5 0 0 1-9 0" stroke={NAVY} strokeWidth="3.6" strokeLinecap="round" />
          <circle cx="46" cy="40" r="5" fill={GOLD} />
          <path d="M38 60c.6-7.5 3.8-11.5 8-11.5s7.4 4 8 11.5z" fill={GOLD} />
        </svg>
      );
    /* HR 零纸质:手机 + 已完成清单 */
    case 'paperless':
      return (
        <svg {...p}>
          <rect x="12" y="4" width="30" height="56" rx="6" fill={NAVY} />
          <rect x="17" y="11" width="20" height="34" rx="3" fill={CREAM} />
          <rect x="20" y="16" width="14" height="3.5" rx="1.75" fill={GOLD} />
          <rect x="20" y="24" width="10" height="3.5" rx="1.75" fill={GOLD_LIGHT} />
          <rect x="20" y="32" width="12" height="3.5" rx="1.75" fill={GOLD_LIGHT} />
          <circle cx="27" cy="52" r="3.2" fill={GOLD} />
          <circle cx="47" cy="17" r="12" fill={GOLD} stroke={CREAM} strokeWidth="3" />
          <path d="m41.5 17.3 3.8 3.8 7.2-7.8" stroke={NAVY} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

/** 员工 / 家属小人(实心=员工,描边=家属) */
export function Person({ filled, color, size = 22 }: { filled: boolean; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {filled ? (
        <>
          <circle cx="12" cy="7" r="4" fill={color} />
          <path d="M3.5 22c.6-5.6 3.9-8.8 8.5-8.8s7.9 3.2 8.5 8.8z" fill={color} />
        </>
      ) : (
        <>
          <circle cx="12" cy="7.5" r="3.4" fill="none" stroke={color} strokeWidth="2" />
          <path d="M5 21.5c.6-4.9 3.3-7.6 7-7.6s6.4 2.7 7 7.6z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
