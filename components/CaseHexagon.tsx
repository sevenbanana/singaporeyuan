// 保障六边形雷达图：展示「配置前 → 配置后」六个维度的变化。
// 纯展示组件（SVG），可在服务端渲染。取值 0–3。
import { HEX_AXES, type HexLevels } from '@/lib/cases';

const SIZE = 260;
const C = SIZE / 2;
const R = 84; // 满值半径
const LEVELS = 3;

// 第 i 个轴的角度：从正上方开始，顺时针每 60°
function angle(i: number) {
  return (-90 + i * 60) * (Math.PI / 180);
}

function point(i: number, value: number) {
  const r = (Math.max(0, Math.min(3, value)) / 3) * R;
  return [C + r * Math.cos(angle(i)), C + r * Math.sin(angle(i))] as const;
}

function polygon(levels: HexLevels) {
  return levels.map((v, i) => point(i, v).join(',')).join(' ');
}

function ring(level: number) {
  return HEX_AXES.map((_, i) => point(i, (level / LEVELS) * 3).join(',')).join(' ');
}

export default function CaseHexagon({
  before,
  after,
  beforeLabel = '配置前',
  afterLabel = '配置后',
  className = '',
}: {
  before: HexLevels;
  after: HexLevels;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto block w-full max-w-[300px]" role="img" aria-label="保障六边形：配置前后对比">
        {/* 背景网格环 */}
        {Array.from({ length: LEVELS }, (_, l) => (
          <polygon key={l} points={ring(l + 1)} fill="none" stroke="#1a2744" strokeOpacity={0.08} strokeWidth={1} />
        ))}
        {/* 轴线 */}
        {HEX_AXES.map((_, i) => {
          const [x, y] = point(i, 3);
          return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="#1a2744" strokeOpacity={0.1} strokeWidth={1} />;
        })}

        {/* 配置前：虚线灰多边形 */}
        <polygon points={polygon(before)} fill="#7a7264" fillOpacity={0.1} stroke="#7a7264" strokeOpacity={0.55} strokeWidth={1.5} strokeDasharray="4 3" />

        {/* 配置后：金色填充 */}
        <polygon points={polygon(after)} fill="#c9a55c" fillOpacity={0.28} stroke="#a8843f" strokeWidth={2} />
        {after.map((v, i) => {
          if (v <= 0) return null;
          const [x, y] = point(i, v);
          return <circle key={i} cx={x} cy={y} r={3.2} fill="#a8843f" />;
        })}

        {/* 维度标签 */}
        {HEX_AXES.map((axis, i) => {
          const [x, y] = point(i, 3.52);
          const anchor = Math.abs(x - C) < 4 ? 'middle' : x > C ? 'start' : 'end';
          return (
            <text key={axis} x={x} y={y + 4} textAnchor={anchor} className="fill-navy" fontSize={12.5} fontWeight={600}>
              {axis}
            </text>
          );
        })}
      </svg>

      <div className="mt-3 flex items-center justify-center gap-5 text-xs text-mist">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-mist/70 bg-mist/10" />
          {beforeLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-gold-deep bg-gold/30" />
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
