// 品牌标识:深蓝圆环 + 金色轨道圆点(近似还原 logo);可后续替换为 public/logo.png
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden role="img" fill="none">
      {/* 深蓝主环,右上留缺口 */}
      <circle
        cx="22"
        cy="23"
        r="15"
        stroke="#1a2744"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="72 22"
        transform="rotate(-55 22 23)"
      />
      {/* 金色轨道弧(右上) */}
      <path
        d="M22 8 A15 15 0 0 1 35.5 17.5"
        stroke="#c9a55c"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* 金色圆点 */}
      <circle cx="35" cy="16" r="2.7" fill="#c9a55c" />
    </svg>
  );
}
