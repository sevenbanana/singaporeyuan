// 手绘门厅插画:开着的门、钥匙、绿植与飘着的图表卡片。纯 SVG,无外部依赖。
export default function DoorArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 560"
      className={className}
      role="img"
      aria-label="一扇为你打开的门"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="pw-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.024" numOctaves="3" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id="pw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF8F1" />
          <stop offset="100%" stopColor="#EFE6D2" />
        </linearGradient>
      </defs>

      <g filter="url(#pw-rough)">
        {/* 门内的光 */}
        <path d="M186 92h188v352H186z" fill="url(#pw-sky)" />
        <circle cx="330" cy="168" r="26" fill="#F1DFB4" />
        <g stroke="#C9A55C" strokeWidth="2" opacity=".7">
          <path d="M210 300h20M244 300h16M276 300h22" />
        </g>
        {/* 门内远景:摩天楼与摩天轮 */}
        <g stroke="#1a2744" strokeWidth="2" opacity=".28" strokeLinecap="round" strokeLinejoin="round">
          <path d="M204 444v-92h26v92M240 444v-118h22v118M272 444v-70h24v70M306 444v-104h26v104M342 444v-56h20v56" />
          <path d="M204 372h26M240 356h22M306 372h26" />
          <circle cx="356" cy="300" r="22" />
          <path d="M356 278v44M334 300h44M340 284l32 32M372 284l-32 32" />
        </g>

        {/* 门框 */}
        <path
          d="M178 84h204v364H178z"
          stroke="#1a2744"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path d="M166 448h228" stroke="#1a2744" strokeWidth="7" strokeLinecap="round" />

        {/* 打开的门板 */}
        <path
          d="M178 84 60 128v378l118-58z"
          fill="#1a2744"
          stroke="#131d33"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M84 160h70v122H84zM84 306h70v122H84z"
          stroke="#3a4d6e"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* 门把手与锁孔 */}
        <circle cx="164" cy="300" r="9" fill="#C9A55C" />
        <path d="M164 310v22" stroke="#C9A55C" strokeWidth="5" strokeLinecap="round" />
        {/* 挂着的钥匙 */}
        <path d="M140 214v34" stroke="#C9A55C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="140" cy="262" r="15" stroke="#C9A55C" strokeWidth="4" />
        <path d="M140 276v26M132 292h8M132 302h8" stroke="#C9A55C" strokeWidth="4" strokeLinecap="round" />

        {/* 右侧飘着的两张卡片 */}
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M404 108h96v78h-96z" fill="#FBF8F1" stroke="#1a2744" strokeWidth="3.5" />
          <path d="M418 168l18-24 16 14 22-32" stroke="#C9A55C" strokeWidth="3.5" />
          <path d="M470 126h14v14" stroke="#C9A55C" strokeWidth="3.5" />

          <path d="M414 232h92v72h-92z" fill="#FBF8F1" stroke="#1a2744" strokeWidth="3.5" />
          <circle cx="444" cy="268" r="19" stroke="#1a2744" strokeWidth="3.5" />
          <path d="M444 268v-19a19 19 0 0 1 16 29z" fill="#C9A55C" stroke="#C9A55C" strokeWidth="2" />
          <path d="M478 256h18M478 270h18M478 284h12" stroke="#1a2744" strokeWidth="3" opacity=".45" />
        </g>

        {/* 绿植 */}
        <g stroke="#4E7A69" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M92 508v-58" />
          <path d="M92 462c-26-4-34-30-34-30 28-4 34 30 34 30z" fill="#D9E7DF" />
          <path d="M92 448c24-6 30-32 30-32-26 2-30 32-30 32z" fill="#E7F0EA" />
          <path d="M62 508h60l-8 34H70z" fill="#EFE6D2" stroke="#1a2744" strokeWidth="3.5" />

          <path d="M456 512v-54" />
          <path d="M456 470c22-6 28-30 28-30-24 2-28 30-28 30z" fill="#E7F0EA" />
          <path d="M456 486c-24-4-32-28-32-28 26-4 32 28 32 28z" fill="#D9E7DF" />
          <path d="M428 512h56l-7 32h-42z" fill="#EFE6D2" stroke="#1a2744" strokeWidth="3.5" />
        </g>

        {/* 星芒 */}
        <g fill="#C9A55C">
          <path d="M398 62l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" />
          <path d="M478 206l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" />
          <path d="M126 108l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
          <path d="M368 348l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
        </g>
      </g>
    </svg>
  );
}
