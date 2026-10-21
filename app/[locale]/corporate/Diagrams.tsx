// 企业团险页的静态示意图(纯 SVG / Tailwind,无交互,服务端渲染)。
import { Icon, Person, NAVY, GOLD, CREAM, type IconKey } from './icons';

/* ───────────── 起投人数:小人图示 ───────────── */
export function Headcount({
  total,
  emp,
  dep,
  tone,
  label,
  legend,
}: {
  total: string;
  emp: number;
  dep: number;
  tone: 'navy' | 'gold';
  label: string;
  legend: string;
}) {
  const c = tone === 'gold' ? GOLD : NAVY;
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0">
        <p className="text-3xl font-black leading-none text-navy">{total}</p>
        <p className="mt-1 text-[11px] font-semibold text-navy/60">{label}</p>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-end gap-0.5">
          {Array.from({ length: emp }).map((_, i) => (
            <Person key={`e${i}`} filled color={c} size={24} />
          ))}
          <span className="mx-1 self-center text-sm font-black text-mist">+</span>
          {Array.from({ length: dep }).map((_, i) => (
            <Person key={`d${i}`} filled={false} color={c} size={20} />
          ))}
        </div>
        <p className="mt-1 text-[11px] leading-snug text-mist">{legend}</p>
      </div>
    </div>
  );
}

/* ───────────── 两层定位:全员打底 + 高端拔高 ───────────── */
export function PlanLayers({ en }: { en: boolean }) {
  return (
    <div className="relative mx-auto max-w-2xl">
      {/* 上层:高端国际医疗 */}
      <div className="relative mx-auto w-[78%] sm:w-[62%]">
        <div className="flex items-center gap-3 rounded-t-2xl border border-gold/50 bg-gradient-to-r from-gold-deep to-gold px-4 py-3.5 text-white shadow-gold sm:px-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Icon k="globe" size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-black leading-tight sm:text-sm">
              {en ? 'Executives · expats · global teams' : '高管 · 外籍 · 跨国团队'}
            </p>
            <p className="truncate text-[11px] text-white/85">Premier International Medical</p>
          </div>
          <div className="ml-auto hidden gap-0.5 sm:flex">
            {[0, 1, 2].map((i) => (
              <Person key={i} filled color={CREAM} size={18} />
            ))}
          </div>
        </div>
      </div>
      {/* 下层:全员医疗 */}
      <div className="flex items-center gap-3 rounded-2xl bg-navy px-4 py-4 text-cream shadow-card sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold">
          <Icon k="team" size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-black leading-tight sm:text-sm">{en ? 'Every employee' : '全体员工'}</p>
          <p className="truncate text-[11px] text-cream/70">Flexi Vital Care Plus</p>
        </div>
        <div className="ml-auto hidden gap-0.5 sm:flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <Person key={i} filled color={i % 3 === 1 ? GOLD : '#8a96ad'} size={18} />
          ))}
        </div>
      </div>
      {/* 标注 */}
      <div className="mt-3 flex justify-between px-1 text-[11px] font-semibold text-mist">
        <span>{en ? '↑ Top up where it matters' : '↑ 关键人才拔高'}</span>
        <span>{en ? 'Everyone covered ↓' : '全员打底 ↓'}</span>
      </div>
    </div>
  );
}

/* ───────────── 积木式模块:FVCP ───────────── */
type Block = { icon: IconKey; t: string; code: string };

function Stud({ gold }: { gold?: boolean }) {
  return (
    <>
      <span aria-hidden className={`absolute -top-[7px] left-4 h-[7px] w-6 rounded-t-md ${gold ? 'bg-gold-soft' : 'bg-navy'}`} />
      <span aria-hidden className={`absolute -top-[7px] right-4 h-[7px] w-6 rounded-t-md ${gold ? 'bg-gold-soft' : 'bg-navy'}`} />
    </>
  );
}

export function ModuleStack({ en }: { en: boolean }) {
  const riders: Block[] = en
    ? [
        { icon: 'steth', t: 'Outpatient', code: 'GP / SP' },
        { icon: 'tooth', t: 'Dental', code: 'Dental' },
        { icon: 'heart', t: 'Critical illness', code: 'GCI' },
        { icon: 'bolt', t: 'Accident', code: 'GPA' },
      ]
    : [
        { icon: 'steth', t: '门诊', code: '全科 / 专科' },
        { icon: 'tooth', t: '牙科', code: 'Dental' },
        { icon: 'heart', t: '重疾', code: 'GCI' },
        { icon: 'bolt', t: '意外', code: 'GPA' },
      ];
  const core: Block[] = en
    ? [
        { icon: 'bed', t: 'Hospital & surgical', code: 'GHS' },
        { icon: 'life', t: 'Term life', code: 'GTL' },
      ]
    : [
        { icon: 'bed', t: '住院手术', code: 'GHS' },
        { icon: 'life', t: '定期寿险', code: 'GTL' },
      ];

  return (
    <div
      className="relative rounded-2xl border border-navy/10 bg-white/50 p-4 pt-5 sm:p-5"
      style={{
        backgroundImage:
          'linear-gradient(rgba(26,39,68,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,68,.045) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* 自愿加保:悬浮积木 */}
      <div className="mb-5 flex justify-end">
        <span className="relative inline-flex items-center gap-1.5 rounded-xl border border-dashed border-gold bg-white px-3 py-1.5 text-[11px] font-bold text-gold-deep">
          <Icon k="arrowUp" size={15} />
          {en ? 'Voluntary top-up by staff' : '员工可自费升级'}
        </span>
      </div>

      <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-gold-deep">{en ? 'ADD AS NEEDED' : '按需加装'}</p>
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-4">
        {riders.map((b) => (
          <div key={b.code} className="relative rounded-xl border border-gold/60 bg-white px-3 pb-3 pt-3.5 text-center">
            <Stud gold />
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
              <Icon k={b.icon} size={19} />
            </span>
            <p className="mt-1.5 text-[13px] font-black text-navy">{b.t}</p>
            <p className="text-[10.5px] text-mist">{b.code}</p>
          </div>
        ))}
      </div>

      <div aria-hidden className="my-3 flex justify-center text-gold">
        <Icon k="plus" size={22} />
      </div>

      <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-navy/60">{en ? 'CORE' : '打底'}</p>
      <div className="grid grid-cols-2 gap-2.5">
        {core.map((b) => (
          <div key={b.code} className="relative flex items-center gap-2.5 rounded-xl bg-navy px-3 py-3.5 text-cream sm:px-4">
            <Stud />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Icon k={b.icon} size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-black leading-tight">{b.t}</p>
              <p className="text-[10.5px] text-cream/60">{b.code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── 承保区域:三圈嵌套 ───────────── */
export function CoverageRings({ en }: { en: boolean }) {
  const t = en
    ? { ww: 'Worldwide', ex: 'Worldwide ex-USA', asia: 'Asia' }
    : { ww: '全球', ex: '全球（除美国）', asia: '亚洲' };
  return (
    <svg viewBox="0 0 240 240" className="mx-auto h-auto w-full max-w-[250px]" role="img" aria-label={`${t.asia} / ${t.ex} / ${t.ww}`}>
      <circle cx="120" cy="120" r="112" fill={GOLD} fillOpacity=".09" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx="120" cy="120" r="80" fill={GOLD} fillOpacity=".2" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="120" cy="120" r="48" fill={NAVY} />
      {/* 环上小点:像航线 */}
      <circle cx="32" cy="84" r="3" fill={GOLD} />
      <circle cx="214" cy="150" r="3" fill={GOLD} />
      <circle cx="62" cy="178" r="2.5" fill={NAVY} opacity=".5" />
      <text x="120" y="29" textAnchor="middle" fontSize="12" fontWeight="800" fill={NAVY}>
        {t.ww}
      </text>
      <text x="120" y="61" textAnchor="middle" fontSize={en ? 10 : 11} fontWeight="800" fill={NAVY}>
        {t.ex}
      </text>
      {/* 中心:新加坡 */}
      <path d="M120 128s-9-8.3-9-15.2a9 9 0 0 1 18 0c0 6.9-9 15.2-9 15.2z" fill={GOLD} />
      <circle cx="120" cy="112.8" r="3.2" fill={NAVY} />
      <text x="120" y="146" textAnchor="middle" fontSize="12" fontWeight="800" fill={CREAM}>
        {t.asia}
      </text>
    </svg>
  );
}

/* ───────────── 门诊网络:7 个市场(示意位置,非精确地图)───────────── */
export function PanelNetwork({ en }: { en: boolean }) {
  const hub = { x: 128, y: 128 };
  const nodes = [
    { k: 'TH', zh: '泰国', en: 'Thailand', x: 62, y: 56, lx: 62, ly: 43, a: 'middle' },
    { k: 'VN', zh: '越南', en: 'Vietnam', x: 132, y: 60, lx: 142, ly: 64, a: 'start' },
    { k: 'HK', zh: '香港', en: 'Hong Kong', x: 196, y: 32, lx: 196, ly: 19, a: 'middle' },
    { k: 'PH', zh: '菲律宾', en: 'Philippines', x: 222, y: 86, lx: 222, ly: 105, a: 'middle' },
    { k: 'MY', zh: '马来西亚', en: 'Malaysia', x: 60, y: 114, lx: 60, ly: 101, a: 'middle' },
    { k: 'ID', zh: '印尼', en: 'Indonesia', x: 150, y: 180, lx: 160, ly: 184, a: 'start' },
  ] as const;
  return (
    <svg viewBox="0 0 260 200" className="h-auto w-full" role="img" aria-label={en ? 'Outpatient panel in 7 markets' : '门诊网络覆盖 7 个市场'}>
      <defs>
        <pattern id="cw-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill={NAVY} opacity=".12" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="260" height="200" rx="16" fill="url(#cw-dots)" />
      {nodes.map((n) => {
        const mx = (hub.x + n.x) / 2;
        const my = (hub.y + n.y) / 2 - 14;
        return (
          <path
            key={`l${n.k}`}
            d={`M${hub.x} ${hub.y} Q${mx} ${my} ${n.x} ${n.y}`}
            stroke={GOLD}
            strokeWidth="1.6"
            strokeDasharray="4 3"
            fill="none"
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.k}>
          <circle cx={n.x} cy={n.y} r="6" fill="#fff" stroke={GOLD} strokeWidth="2" />
          <circle cx={n.x} cy={n.y} r="2.4" fill={GOLD} />
          <text x={n.lx} y={n.ly} textAnchor={n.a} fontSize="11" fontWeight="700" fill={NAVY}>
            {en ? n.en : n.zh}
          </text>
        </g>
      ))}
      <circle cx={hub.x} cy={hub.y} r="13" fill={GOLD} opacity=".25" />
      <circle cx={hub.x} cy={hub.y} r="8" fill={NAVY} stroke={GOLD} strokeWidth="2.5" />
      <text x={hub.x - 8} y={hub.y + 26} textAnchor="end" fontSize="12" fontWeight="900" fill={NAVY}>
        {en ? 'Singapore' : '新加坡'}
      </text>
    </svg>
  );
}

/* ───────────── 无现金就医流程 ───────────── */
export function ClaimsFlow({ steps }: { steps: { icon: IconKey; t: string; s: string }[] }) {
  return (
    <ol className="grid gap-0 sm:grid-cols-4 sm:gap-4">
      {steps.map((st, i) => (
        <li key={st.t} className="relative flex items-start gap-4 pb-7 last:pb-0 sm:flex-col sm:items-center sm:pb-0 sm:text-center">
          {i < steps.length - 1 && (
            <>
              <span aria-hidden className="absolute bottom-0 left-7 top-14 w-0 border-l-2 border-dashed border-gold/50 sm:hidden" />
              <span
                aria-hidden
                className="absolute top-7 hidden border-t-2 border-dashed border-gold/50 sm:block"
                style={{ left: 'calc(50% + 36px)', width: 'calc(100% - 72px + 1rem)' }}
              />
            </>
          )}
          <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-gold ring-4 ring-cream">
            <Icon k={st.icon} size={24} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-black text-white">
              {i + 1}
            </span>
          </span>
          <div className="pt-1.5 sm:pt-0">
            <p className="text-[15px] font-black text-navy sm:mt-3">{st.t}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-mist">{st.s}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
