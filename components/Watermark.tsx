// 淡淡的全屏水印(与案例 HTML 一致:斜向重复文字,极低透明度)
export default function Watermark({ text }: { text: string }) {
  const rows = Array.from({ length: 16 });
  const reps = Array.from({ length: 10 });
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden opacity-[0.04]"
    >
      {rows.map((_, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap font-medium text-navy"
          style={{
            top: `${i * 8 - 6}%`,
            left: '-12%',
            transform: 'rotate(-24deg)',
            transformOrigin: 'left center',
            fontSize: '22px',
            letterSpacing: '0.04em',
          }}
        >
          {reps.map((_, j) => (
            <span key={j} className="mr-16">
              {text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
