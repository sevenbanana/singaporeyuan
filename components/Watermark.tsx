// 极淡稀疏水印:斜向、行距大、词间大间隔、透明度很低(参考案例 HTML 但更克制)
export default function Watermark({ text }: { text: string }) {
  const rows = Array.from({ length: 16 });
  // 用全角空格拉开横向间隔,让水印更稀疏
  const unit = Array.from({ length: 5 })
    .map(() => text)
    .join('　　　　　　　　');
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden opacity-[0.0325]"
    >
      {rows.map((_, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap font-medium text-navy"
          style={{
            top: `${i * 110 - 120}px`,
            left: '-160px',
            transform: 'rotate(-24deg)',
            transformOrigin: 'left center',
            fontSize: '20px',
            letterSpacing: '0.06em',
          }}
        >
          {unit}
        </div>
      ))}
    </div>
  );
}
