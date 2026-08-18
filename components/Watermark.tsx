// 极淡稀疏水印:斜向、行距大、词间大间隔、透明度很低(参考案例 HTML 但更克制)
export default function Watermark({
  text,
  density = 'normal',
}: {
  text: string;
  /** light: 行数与重复大幅减少,给数据密集的页面用 */
  density?: 'normal' | 'light';
}) {
  const light = density === 'light';
  const rows = Array.from({ length: light ? 5 : 16 });
  // 用全角空格拉开横向间隔,让水印更稀疏
  const unit = Array.from({ length: light ? 2 : 5 })
    .map(() => text)
    .join('　　　　　　　　');
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-30 select-none overflow-hidden ${
        light ? 'opacity-[0.018]' : 'opacity-[0.0325]'
      }`}
    >
      {rows.map((_, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap font-medium text-navy"
          style={{
            top: `${i * (light ? 340 : 110) - 120}px`,
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
