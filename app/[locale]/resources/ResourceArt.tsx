// 资源中心每张卡片的手绘封面。纯 SVG,跟着站点配色走:navy 线稿 + gold 点缀。
type Props = { k: string; className?: string };

const NAVY = '#1a2744';
const GOLD = '#c9a55c';
const SAND = '#efe6d2';

export default function ResourceArt({ k, className = '' }: Props) {
  const common = {
    viewBox: '0 0 400 170',
    className,
    fill: 'none' as const,
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
    preserveAspectRatio: 'xMidYMid meet',
  };
  const line = {
    stroke: NAVY,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const gold = { ...line, stroke: GOLD };

  switch (k) {
    /* 就医指南:诊所 + 听诊器 */
    case 'healthcare':
      return (
        <svg {...common}>
          <g {...line}>
            <path d="M96 138V72h108v66z" fill={SAND} />
            <path d="M88 72h124" />
            <path d="M118 90h26v20h-26zM160 90h26v20h-26z" />
            <path d="M138 138v-22h24v22" fill="#fff" />
            <rect x="104" y="46" width="34" height="22" rx="4" fill="rgba(201,165,92,.2)" stroke={GOLD} />
            <path d="M121 51v12M115 57h12" stroke={GOLD} strokeWidth="2.6" />
            <path d="M228 138V96h64v42z" fill="#fff" />
            <path d="M242 110h36M242 124h24" opacity=".45" />
            <path d="M40 138h330" strokeWidth="2.8" />
          </g>
          <g {...gold}>
            <circle cx="316" cy="58" r="17" />
            <circle cx="316" cy="58" r="8" opacity=".5" />
            <path d="M316 41c0-20-22-30-44-24-24 6-34 1-38-9" />
            <circle cx="230" cy="10" r="4" />
            <path d="M62 122c0-16 8-24 16-24s16 8 16 24" opacity=".7" />
            <path d="M78 98V82" opacity=".7" />
          </g>
        </svg>
      );

    /* 投保与理赔流程:表单 → 盾牌 → 打勾 */
    case 'journey':
      return (
        <svg {...common}>
          <g {...line}>
            <path d="M56 34h84v104H56z" fill="#fff" />
            <path d="M72 58h52M72 78h52M72 98h32" opacity=".45" />
            <path d="M170 86h44" stroke={GOLD} strokeWidth="2.6" />
            <path d="M208 79l10 7-10 7z" fill={GOLD} stroke={GOLD} />
            <path d="M244 40l38 14v34c0 26-18 40-38 46-20-6-38-20-38-46V54z" fill={SAND} />
            <path d="M230 88l11 11 21-24" stroke={GOLD} strokeWidth="3.4" />
            <path d="M310 106h50v32h-50z" fill="#fff" />
            <path d="M322 122h26" opacity=".5" />
            <path d="M30 152h340" strokeWidth="2.8" opacity=".35" />
          </g>
          <g {...gold}>
            <path d="M126 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={GOLD} stroke="none" />
            <path d="M336 74v18M327 83h18" />
          </g>
        </svg>
      );

    /* 穿越周期:帆船 + 上升曲线 */
    case 'cycles':
      return (
        <svg {...common}>
          <g {...line}>
            <path d="M150 116h96l-14 20q-34 8-68 0z" fill={SAND} />
            <path d="M198 116V32" />
            <path d="M204 42v70h44z" fill="rgba(201,165,92,.25)" />
            <path d="M192 48v64h-40z" fill="#fff" />
            <path d="M198 32l20 8-20 8z" fill={GOLD} stroke={GOLD} />
            <path d="M20 138q26-14 52 0t52 0 52 0 52 0 52 0 52 0 52 0" strokeWidth="2.4" />
            <path d="M14 158q28-14 56 0t56 0 56 0 56 0 56 0 56 0" opacity=".55" />
          </g>
          <g {...gold}>
            <path d="M276 96l24-26 18 16 34-46" strokeWidth="2.8" />
            <path d="M334 40h20v20" strokeWidth="2.8" />
            <circle cx="74" cy="44" r="16" />
            <path d="M74 20v-8M74 76v8M50 44h-8M98 44h8M57 27l-6-6M91 61l6 6M91 27l6-6M57 61l-6 6" opacity=".7" />
          </g>
        </svg>
      );

    /* 省税指南:收据 + 百分号 + 硬币 */
    case 'taxguide':
      return (
        <svg {...common}>
          <g {...line}>
            <path d="M76 24h118v122l-15-10-14 10-15-10-14 10-15-10-14 10-15-10-16 10z" fill="#fff" />
            <path d="M98 52h74M98 74h74M98 96h48" opacity=".45" />
            <path d="M98 118h74" stroke={GOLD} strokeWidth="3" />
            <ellipse cx="316" cy="112" rx="34" ry="12" fill={SAND} />
            <path d="M282 112v20c0 7 15 12 34 12s34-5 34-12v-20" />
            <ellipse cx="316" cy="92" rx="34" ry="12" fill="#fff" />
            <path d="M30 156h340" strokeWidth="2.8" opacity=".35" />
          </g>
          <g {...gold}>
            <path d="M300 26l-44 44" strokeWidth="3" />
            <circle cx="264" cy="34" r="9" strokeWidth="3" />
            <circle cx="292" cy="62" r="9" strokeWidth="3" />
          </g>
        </svg>
      );

    /* CPF / SRS 计算器 */
    case 'tax':
      return (
        <svg {...common}>
          <g {...line}>
            <rect x="60" y="22" width="112" height="126" rx="10" fill="#fff" />
            <rect x="76" y="38" width="80" height="26" rx="4" fill={SAND} />
            <path d="M84 86h.01M116 86h.01M148 86h.01M84 108h.01M116 108h.01M148 108h.01M84 128h.01M116 128h.01" strokeWidth="7" />
            <path d="M214 148V96h34v52zM258 148V70h34v78zM302 148V44h34v104z" fill={SAND} />
            <path d="M200 148h150" strokeWidth="2.8" />
            <path d="M226 116h10M270 92h10M314 68h10" opacity=".45" />
          </g>
          <g {...gold}>
            <path d="M214 76l30-26 26 18 44-32" strokeWidth="2.8" />
            <path d="M296 34h20v20" strokeWidth="2.8" />
            <path d="M116 48h.01" strokeWidth="8" />
          </g>
        </svg>
      );

    /* 退休测算:沙漏 + 时间线 + 棕榈 */
    case 'retirement':
      return (
        <svg {...common}>
          <g {...line}>
            <path d="M76 26h68M76 140h68" strokeWidth="2.6" />
            <path d="M138 140v-22c0-4-2-7-4-9l-24-26-24 26c-2 2-4 5-4 9v22" fill={SAND} />
            <path d="M82 26v22c0 4 2 7 4 9l24 26 24-26c2-2 4-5 4-9V26" fill="#fff" />
            <path d="M200 132h150" strokeWidth="2.6" />
            <path d="M212 132v-12M254 132v-12M296 132v-12M338 132v-12" opacity=".5" />
            <path d="M338 120V64" strokeWidth="2.6" />
          </g>
          <g {...gold}>
            <path d="M110 68v34" strokeWidth="3" />
            <path d="M338 64h30v18h-30z" fill="rgba(201,165,92,.25)" />
            <path d="M212 116l42-14 42-24 44-18" strokeWidth="2.8" />
            <circle cx="212" cy="116" r="4" fill={GOLD} />
            <circle cx="338" cy="60" r="4" fill={GOLD} />
          </g>
        </svg>
      );

    /* PR 落地指南:证件 + 行李箱 + 地图针 */
    case 'pr':
      return (
        <svg {...common}>
          <g {...line}>
            <rect x="62" y="34" width="92" height="118" rx="8" fill={SAND} />
            <rect x="74" y="46" width="68" height="94" rx="5" fill="#fff" />
            <circle cx="108" cy="80" r="15" />
            <path d="M86 118h44M94 132h28" opacity=".45" />
            <rect x="196" y="70" width="104" height="76" rx="10" fill="#fff" />
            <path d="M222 70V54a8 8 0 0 1 8-8h36a8 8 0 0 1 8 8v16" />
            <path d="M196 100h104" opacity=".45" />
            <path d="M244 100v46" opacity=".45" />
            <path d="M30 158h340" strokeWidth="2.8" opacity=".35" />
          </g>
          <g {...gold}>
            <path d="M334 118c0 0-24-20-24-38a24 24 0 0 1 48 0c0 18-24 38-24 38z" fill="rgba(201,165,92,.2)" />
            <circle cx="334" cy="78" r="8" />
            <path d="M108 74v12M102 80h12" strokeWidth="2.6" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}
