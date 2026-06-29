// 淡淡的稀疏水印(与案例 HTML 一致:斜向、行距 70px、词间大间隔、极低透明度 0.05)
export default function Watermark({ text }: { text: string }) {
  const rows = Array.from({ length: 32 });
  // 用全角空格拉开横向间隔,让水印更稀疏
  const unit = Array.from({ length: 8 })
    .map(() => text)
    .join('　　　　　');
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden opacity-[0.05]"
    >
      {rows.map((_, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap font-medium text-navy"
          style={{
            top: `${i * 70 - 160}px`,
            left: '-160px',
            transform: 'rotate(-24deg)',
            transformOrigin: 'left center',
            fontSize: '22px',
            letterSpacing: '0.04em',
          }}
        >
          {unit}
        </div>
      ))}
    </div>
  );
}
