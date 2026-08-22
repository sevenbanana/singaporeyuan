// 六个评估角度的扁平图标,和资源中心那套同一语言:海军蓝主体 + 金色点缀。
const NAVY = '#1a2744';
const GOLD = '#c9a55c';
const CREAM = '#FBF8F1';

export default function SectionArt({ k, className = '' }: { k: string; className?: string }) {
  const p = {
    viewBox: '0 0 64 64',
    className,
    fill: 'none' as const,
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  };

  switch (k) {
    /* 01 偿付能力:盾牌 + 资本柱 */
    case 'capital':
      return (
        <svg {...p}>
          <path d="M32 5 54 13v18c0 14-9.5 23-22 27C19.5 54 10 45 10 31V13z" fill={NAVY} />
          <path d="M22 38v-9h6v9zm10 0V23h6v15zm10 0V17h6v21z" fill={GOLD} />
          <path d="M19 43h26" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    /* 02 理赔:时钟 + 已批文件 */
    case 'claims':
      return (
        <svg {...p}>
          <circle cx="26" cy="26" r="19" fill={NAVY} />
          <path d="M26 15v12l8 5" stroke={CREAM} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="34" y="34" width="24" height="26" rx="4" fill={GOLD} />
          <path d="M40 47l4 4 8-9" stroke={NAVY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    /* 03 医疗端:听诊器 + 评价星 */
    case 'doctor':
      return (
        <svg {...p}>
          <path d="M14 8v12a10 10 0 0 0 20 0V8" stroke={NAVY} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M24 30v9a12 12 0 0 0 24 0v-5" stroke={NAVY} strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="48" cy="30" r="7" fill={GOLD} />
          <circle cx="14" cy="8" r="4" fill={NAVY} />
          <circle cx="34" cy="8" r="4" fill={NAVY} />
          <path d="M48 46l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill={GOLD} />
        </svg>
      );
    /* 04 客户口碑:对话气泡 + 勾 */
    case 'client':
      return (
        <svg {...p}>
          <path d="M8 12a5 5 0 0 1 5-5h30a5 5 0 0 1 5 5v20a5 5 0 0 1-5 5H24l-11 9V37h-0a5 5 0 0 1-5-5z" fill={NAVY} />
          <path d="M20 22l5 5 11-12" stroke={CREAM} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="46" r="11" fill={GOLD} />
          <path d="M45 46l3.5 3.5 6.5-7" stroke={NAVY} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    /* 05 经营:上升柱 + 箭头 */
    case 'profit':
      return (
        <svg {...p}>
          <rect x="8" y="38" width="11" height="18" rx="2.5" fill={NAVY} />
          <rect x="24" y="28" width="11" height="28" rx="2.5" fill={NAVY} />
          <rect x="40" y="16" width="11" height="40" rx="2.5" fill={GOLD} />
          <path d="M10 26l14-10 10 7 16-14" stroke={NAVY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M40 8h12v12" stroke={NAVY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    /* 06 数码化:手机 + 自动流程 */
    case 'digital':
      return (
        <svg {...p}>
          <rect x="14" y="4" width="30" height="56" rx="6" fill={NAVY} />
          <rect x="20" y="12" width="18" height="24" rx="3" fill={CREAM} />
          <path d="M24 24l4 4 7-8" stroke={GOLD} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="29" cy="50" r="4" fill={GOLD} />
          <path d="M50 20a12 12 0 0 1 0 24" stroke={GOLD} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M46 16l5 4-5 4" stroke={GOLD} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    /* 我自己的记录:人 + 心 */
    case 'mine':
      return (
        <svg {...p}>
          <circle cx="24" cy="18" r="10" fill={NAVY} />
          <path d="M6 56c0-11 8-18 18-18s18 7 18 18z" fill={NAVY} />
          <path d="M48 22c3.6-4 10-2.4 10 3.4 0 5-6 9.4-10 12.6-4-3.2-10-7.6-10-12.6 0-5.8 6.4-7.4 10-3.4z" fill={GOLD} />
        </svg>
      );
    default:
      return null;
  }
}
