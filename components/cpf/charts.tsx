'use client';

import { useId, useState } from 'react';
import type { WorkStatus, YearRow } from '@/lib/cpf/engine';
import { clamp, compact, sgd, sgd10, useWidth } from './ui';

/**
 * 系列配色:经过色盲安全校验(相邻 ΔE ≥ 11,deutan)。
 * SA 与 RA 同一层叠放位置、金 → 铜同一色系,55 岁那一刻能看出「SA 变成 RA」。
 */
export const SERIES = {
  oa: '#2f6cc4',
  sa: '#c99a3c',
  ra: '#b0532a',
  ma: '#0e9384',
  ink: '#2a2620',
  navy: '#1a2744',
};

const SURFACE = '#fffdf9';
const GRID = '#1a274414';
const AXIS = '#7a7264';

/** 把最大值抬到好看的整数刻度 */
function niceMax(v: number): { max: number; step: number } {
  if (v <= 0) return { max: 1, step: 1 };
  const raw = v / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  return { max: Math.ceil(v / step) * step, step };
}

/** 坐标轴上的金额:越短越好,手机上不会被裁掉 */
const axisMoney = (v: number) => {
  if (v >= 1_000_000) return `S$${+(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1000) return `S$${+(v / 1000).toFixed(1)}K`;
  return `S$${Math.round(v)}`;
};

type TipRow = { label: string; value: string; color?: string; strong?: boolean };

function Tooltip({ leftPct, title, rows, footer }: { leftPct: number; title: string; rows: TipRow[]; footer?: string }) {
  return (
    <div
      className="pointer-events-none absolute top-1 z-10 w-[196px] -translate-x-1/2 rounded-xl border border-navy/15 bg-white/[0.97] p-3 shadow-[0_12px_34px_-12px_rgba(26,39,68,0.4)]"
      style={{ left: `${clamp(leftPct, 22, 78)}%` }}
      role="status"
    >
      <p className="text-[12px] font-bold text-navy">{title}</p>
      <div className="mt-1.5 space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-mist">
              {r.color ? <i className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: r.color }} /> : null}
              {r.label}
            </span>
            <b className={`tabular-nums ${r.strong ? 'font-black text-navy' : 'font-bold text-navy'}`}>{r.value}</b>
          </div>
        ))}
      </div>
      {footer ? <p className="mt-1.5 border-t border-navy/10 pt-1.5 text-[10px] leading-snug text-gold-deep">{footer}</p> : null}
    </div>
  );
}

/* ================================================================ 余额堆叠面积图 */

type Pt = { x: number; sra: number; ma: number; oa: number };

export function BalanceChart({
  rows,
  age0,
  inflation,
  today,
  payoutAge,
  showUntil,
  cohortFrs,
  pledgeTarget,
}: {
  rows: YearRow[];
  age0: number;
  inflation: number;
  /** true = 折回今天的购买力 */
  today: boolean;
  payoutAge: number;
  showUntil: number;
  cohortFrs: number;
  /** pledge 时 RA 只要 BRS */
  pledgeTarget: number | null;
}) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const clipId = useId().replace(/:/g, '');
  const narrow = W < 520;
  const H = narrow ? 250 : 300;
  const padL = narrow ? 50 : 56;
  const padR = 12;
  const padT = 26;
  const padB = 28;

  const shown = rows.filter((r) => r.age < showUntil);
  if (!shown.length) return <div ref={ref} />;
  const defl = (x: number) => (today ? Math.pow(1 + inflation / 100, x - age0) : 1);

  // 每个年龄放两个点:上一年年末 + 本年年初。两者不同的地方(55 岁开 RA、开始领取、转账)
  // 会画成一条竖直的台阶,而不是被线性插值抹成斜坡
  const pts: Pt[] = [];
  shown.forEach((r, i) => {
    const prev = shown[i - 1];
    if (prev) pts.push({ x: r.age, sra: (prev.sa + prev.ra) / defl(r.age), ma: prev.ma / defl(r.age), oa: prev.oa / defl(r.age) });
    pts.push({ x: r.age, sra: (r.saStart + r.raStart) / defl(r.age), ma: r.maStart / defl(r.age), oa: r.oaStart / defl(r.age) });
  });
  const last = shown[shown.length - 1];
  const xEnd = last.age + 1;
  pts.push({ x: xEnd, sra: (last.sa + last.ra) / defl(xEnd), ma: last.ma / defl(xEnd), oa: last.oa / defl(xEnd) });

  // FRS:55 岁前每年都在涨(移动目标),55 岁那一刻锁定为自己那一届
  const frsPts = shown.filter((r) => r.age <= 55).map((r) => ({ x: r.age, v: (r.age === 55 ? cohortFrs : r.frsNow) / defl(r.age) }));

  const top = Math.max(...pts.map((p) => p.sra + p.ma + p.oa), ...frsPts.map((p) => p.v));
  const { max, step } = niceMax(top * 1.04);
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x0 = age0;
  const sx = (x: number) => padL + ((x - x0) / Math.max(1, xEnd - x0)) * innerW;
  const sy = (v: number) => padT + innerH - (Math.max(0, v) / max) * innerH;

  const band = (lo: (p: Pt) => number, hi: (p: Pt) => number) =>
    `M${pts.map((p) => `${sx(p.x)},${sy(hi(p))}`).join('L')}L${[...pts]
      .reverse()
      .map((p) => `${sx(p.x)},${sy(lo(p))}`)
      .join('L')}Z`;
  const edge = (f: (p: Pt) => number) => `M${pts.map((p) => `${sx(p.x)},${sy(f(p))}`).join('L')}`;

  const ticks: number[] = [];
  for (let v = 0; v <= max + 0.5; v += step) ticks.push(v);
  const every = narrow ? 10 : 5;
  const xTicks: number[] = [];
  for (let a = Math.ceil(x0 / every) * every; a <= xEnd; a += every) xTicks.push(a);

  const split = sx(55);
  // 55 岁的标注放在竖线左边;领取年龄的标注右边放得下就放右边,否则也放左边(两条线之间)
  const roomRight = W - padR - sx(payoutAge);
  const markers = [
    ...(x0 < 55 ? [{ x: 55, label: narrow ? '55 岁' : '55 岁 · 开 RA', side: 'left' as const }] : []),
    ...(payoutAge < xEnd
      ? [
          roomRight > (narrow ? 56 : 112)
            ? { x: payoutAge, label: narrow ? `${payoutAge} 岁起领` : `${payoutAge} 岁起领 CPF LIFE`, side: 'right' as const }
            : { x: payoutAge, label: `${payoutAge} 岁`, side: 'left' as const },
        ]
      : []),
  ];

  const hoverRow = hover !== null ? shown[hover] : null;
  const onMove = (clientX: number, rect: DOMRect) => {
    const px = ((clientX - rect.left) / rect.width) * W;
    const age = x0 + ((px - padL) / innerW) * (xEnd - x0);
    // 竖线落在最近的「某一年年末」上
    setHover(clamp(Math.round(age - x0) - 1, 0, shown.length - 1));
  };

  return (
    <div ref={ref} className="relative mt-4 w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="各户头余额随年龄的变化"
        className="block touch-pan-y"
        onPointerMove={(e) => onMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerDown={(e) => onMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <clipPath id={`${clipId}-a`}>
            <rect x={0} y={0} width={Math.max(0, split)} height={H} />
          </clipPath>
          <clipPath id={`${clipId}-b`}>
            <rect x={split} y={0} width={Math.max(0, W - split)} height={H} />
          </clipPath>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={sy(t)} y2={sy(t)} stroke={GRID} />
            <text x={padL - 6} y={sy(t) + 4} textAnchor="end" fontSize="11" fill={AXIS} className="tabular-nums">
              {axisMoney(t)}
            </text>
          </g>
        ))}

        {/* 最底层 SA/RA 同一位置:55 岁前着 SA 色,之后着 RA 色 */}
        <path d={band(() => 0, (p) => p.sra)} fill={SERIES.sa} opacity={0.85} clipPath={`url(#${clipId}-a)`} />
        <path d={band(() => 0, (p) => p.sra)} fill={SERIES.ra} opacity={0.85} clipPath={`url(#${clipId}-b)`} />
        <path d={band((p) => p.sra, (p) => p.sra + p.ma)} fill={SERIES.ma} opacity={0.8} />
        <path d={band((p) => p.sra + p.ma, (p) => p.sra + p.ma + p.oa)} fill={SERIES.oa} opacity={0.78} />
        {/* 2px 底色分隔,代替描边 */}
        <path d={edge((p) => p.sra)} fill="none" stroke={SURFACE} strokeWidth={2} />
        <path d={edge((p) => p.sra + p.ma)} fill="none" stroke={SURFACE} strokeWidth={2} />

        {frsPts.length > 1 ? (
          <g>
            <path
              d={`M${frsPts.map((p) => `${sx(p.x)},${sy(p.v)}`).join('L')}`}
              fill="none"
              stroke={SERIES.ink}
              strokeWidth={1.6}
              strokeDasharray="5 4"
            />
            <circle cx={sx(frsPts[frsPts.length - 1].x)} cy={sy(frsPts[frsPts.length - 1].v)} r={4} fill={SERIES.ink} stroke={SURFACE} strokeWidth={2} />
            <text
              x={sx(frsPts[frsPts.length - 1].x) - 8}
              y={sy(frsPts[frsPts.length - 1].v) - 9}
              textAnchor="end"
              fontSize="11"
              fontWeight="700"
              fill={SERIES.ink}
              stroke={SURFACE}
              strokeWidth={3}
              paintOrder="stroke"
            >
              FRS {compact(frsPts[frsPts.length - 1].v)}
            </text>
          </g>
        ) : null}

        {pledgeTarget && x0 < 55 ? (
          <text x={split + 6} y={sy(pledgeTarget / defl(55)) - 6} fontSize="10.5" fill={SERIES.ink}>
            pledge:只留 BRS
          </text>
        ) : null}

        {markers.map((m) => (
          <g key={m.x}>
            <line x1={sx(m.x)} x2={sx(m.x)} y1={padT - 6} y2={padT + innerH} stroke={SERIES.navy} strokeWidth={1} opacity={0.55} />
            <text
              x={sx(m.x) + (m.side === 'left' ? -5 : 5)}
              y={padT - 10}
              textAnchor={m.side === 'left' ? 'end' : 'start'}
              fontSize="11"
              fontWeight="700"
              fill={SERIES.navy}
            >
              {m.label}
            </text>
          </g>
        ))}

        <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="#1a274426" />
        {xTicks.map((a) => (
          <text key={a} x={sx(a)} y={H - 9} textAnchor="middle" fontSize="11" fill={AXIS} className="tabular-nums">
            {a}
          </text>
        ))}

        {hoverRow ? (
          <line
            x1={sx(hoverRow.age + 1)}
            x2={sx(hoverRow.age + 1)}
            y1={padT}
            y2={padT + innerH}
            stroke={SERIES.navy}
            strokeWidth={1}
            opacity={0.35}
            pointerEvents="none"
          />
        ) : null}
      </svg>

      {hoverRow ? (
        <Tooltip
          leftPct={(sx(hoverRow.age + 1) / W) * 100}
          title={`${hoverRow.age} 岁 · ${hoverRow.year} 年末${today ? '(今天币值)' : ''}`}
          rows={[
            { label: 'OA', value: compact(hoverRow.oa / defl(hoverRow.age + 1)), color: SERIES.oa },
            ...(hoverRow.sa > 0.5 ? [{ label: 'SA', value: compact(hoverRow.sa / defl(hoverRow.age + 1)), color: SERIES.sa }] : []),
            ...(hoverRow.ra > 0.5 ? [{ label: 'RA', value: compact(hoverRow.ra / defl(hoverRow.age + 1)), color: SERIES.ra }] : []),
            { label: 'MA', value: compact(hoverRow.ma / defl(hoverRow.age + 1)), color: SERIES.ma },
            ...(hoverRow.life > 0
              ? [{ label: 'CPF LIFE / 月', value: sgd10(hoverRow.life / defl(hoverRow.age)), strong: true }]
              : []),
          ]}
          footer={
            hoverRow.age === 55
              ? 'SA 已关闭:SA 先进 RA,不够再用 OA 补'
              : hoverRow.age === payoutAge
                ? 'RA 全部转为 CPF LIFE 保费,开始按月领'
                : hoverRow.age < 55
                  ? `当年 FRS ${compact(hoverRow.frsNow / defl(hoverRow.age))}`
                  : undefined
          }
        />
      ) : null}
    </div>
  );
}

/* ====================================================================== 瀑布图 */

export type WaterStep = { label: string; value: number; color: string; kind: 'total' | 'minus' | 'result' };

export function Waterfall({ steps, unit = '/月' }: { steps: WaterStep[]; unit?: string }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const narrow = W < 480;
  const H = narrow ? 230 : 260;
  const padT = 28;
  const padB = narrow ? 40 : 34;
  const padX = 8;

  // 逐级往下减;减到 0 以下就截在 0(那部分是盈余,由最后一根柱子说明)
  let level = steps[0]?.value ?? 0;
  const bars = steps.map((s, i) => {
    if (i === 0 || s.kind === 'total') {
      level = s.value;
      return { ...s, lo: 0, hi: s.value };
    }
    if (s.kind === 'minus') {
      const hi = level;
      const lo = Math.max(0, level - s.value);
      level -= s.value;
      return { ...s, lo, hi };
    }
    return { ...s, lo: 0, hi: Math.max(0, s.value) };
  });

  const top = Math.max(1, ...bars.map((b) => b.hi));
  const innerH = H - padT - padB;
  const sy = (v: number) => padT + innerH - (v / (top * 1.06)) * innerH;
  const slot = (W - padX * 2) / bars.length;
  const bw = Math.min(narrow ? 44 : 64, slot * 0.56);
  const cx = (i: number) => padX + slot * i + slot / 2;

  return (
    <div ref={ref} className="relative mt-4 w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="从期望退休金一路减到月缺口" className="block">
        <line x1={padX} x2={W - padX} y1={sy(0)} y2={sy(0)} stroke="#1a274426" />
        {bars.map((b, i) => {
          const y = sy(b.hi);
          const h = Math.max(b.hi > b.lo ? 2 : 0, sy(b.lo) - sy(b.hi));
          const next = bars[i + 1];
          return (
            <g key={b.label} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <rect x={cx(i) - slot / 2} y={padT} width={slot} height={innerH} fill="transparent" />
              {h > 0 ? <rect x={cx(i) - bw / 2} y={y} width={bw} height={h} rx={4} fill={b.color} opacity={hover === null || hover === i ? 1 : 0.55} /> : null}
              {/* 连接线:上一级的落点 */}
              {next && next.kind === 'minus' ? (
                <line
                  x1={cx(i) + bw / 2}
                  x2={cx(i + 1) - bw / 2}
                  y1={sy(b.kind === 'minus' ? b.lo : b.hi)}
                  y2={sy(b.kind === 'minus' ? b.lo : b.hi)}
                  stroke="#1a274440"
                  strokeWidth={1}
                />
              ) : null}
              <text x={cx(i)} y={y - 7} textAnchor="middle" fontSize={narrow ? 11 : 12.5} fontWeight="800" fill={SERIES.navy} className="tabular-nums">
                {b.kind === 'minus' ? '−' : ''}
                {sgd10(b.kind === 'minus' ? Math.min(b.value, b.hi) : b.value)}
              </text>
              {b.label.split('\n').map((line, li) => (
                <text key={li} x={cx(i)} y={H - padB + 16 + li * 13} textAnchor="middle" fontSize="11" fill={AXIS}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      {hover !== null && bars[hover].kind === 'minus' && bars[hover].value > bars[hover].hi + 0.5 ? (
        <Tooltip
          leftPct={(cx(hover) / W) * 100}
          title={bars[hover].label.replace('\n', '')}
          rows={[
            { label: '金额', value: `${sgd10(bars[hover].value)}${unit}`, strong: true },
            { label: '其中超出目标', value: sgd10(bars[hover].value - bars[hover].hi) },
          ]}
        />
      ) : null}
    </div>
  );
}

/* ================================================================== 收入曲线预览 */

const STATUS_COLOR: Record<WorkStatus, string> = {
  work: SERIES.oa,
  reemploy: '#7d9fd6',
  self: SERIES.ma,
  unemployed: '#d9d2c3',
  childcare: '#d9d2c3',
  retired: '#d9d2c3',
};

export const STATUS_LABEL: Record<WorkStatus, string> = {
  work: '受雇',
  reemploy: '再雇佣(降薪)',
  self: '自雇(只缴 MA)',
  unemployed: '失业',
  childcare: '育儿停工',
  retired: '已停止工作',
};

export function IncomePreview({ rows, ceiling, stopAge }: { rows: YearRow[]; ceiling: number; stopAge: number }) {
  const [ref, W] = useWidth<HTMLDivElement>(360);
  const [hover, setHover] = useState<number | null>(null);
  const shown = rows.filter((r) => r.age < Math.max(stopAge, rows[0]?.age + 1));
  const H = 150;
  const padL = 46;
  const padR = 6;
  const padT = 14;
  const padB = 22;
  if (!shown.length) return <div ref={ref} />;
  const top = Math.max(ceiling, ...shown.map((r) => r.wage));
  const { max } = niceMax(top * 1.05);
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const slot = innerW / shown.length;
  const bw = Math.max(1.5, Math.min(18, slot - 2));
  const sy = (v: number) => padT + innerH - (v / max) * innerH;
  const every = shown.length > 30 ? 10 : 5;
  const r = hover !== null ? shown[hover] : null;

  return (
    <div ref={ref} className="relative w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="月薪随年龄变化" className="block touch-pan-y" onPointerLeave={() => setHover(null)}>
        {[0, max / 2, max].map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={sy(t)} y2={sy(t)} stroke={GRID} />
            <text x={padL - 5} y={sy(t) + 4} textAnchor="end" fontSize="10.5" fill={AXIS}>
              {axisMoney(t)}
            </text>
          </g>
        ))}
        {shown.map((row, i) => {
          const x = padL + slot * i + (slot - bw) / 2;
          const v = row.status === 'unemployed' || row.status === 'childcare' ? 0 : row.wage;
          return (
            <g key={row.age} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)}>
              <rect x={padL + slot * i} y={padT} width={slot} height={innerH} fill="transparent" />
              {v > 0 ? (
                <rect x={x} y={sy(v)} width={bw} height={sy(0) - sy(v)} rx={Math.min(2, bw / 2)} fill={STATUS_COLOR[row.status]} opacity={hover === null || hover === i ? 1 : 0.6} />
              ) : (
                <rect x={x} y={sy(0) - 3} width={bw} height={3} rx={1} fill={STATUS_COLOR[row.status]} />
              )}
            </g>
          );
        })}
        <line x1={padL} x2={W - padR} y1={sy(ceiling)} y2={sy(ceiling)} stroke={SERIES.ink} strokeWidth={1.2} strokeDasharray="4 3" />
        {/* 标在左端:起点通常低于上限,不会压在柱子上 */}
        <text
          x={padL + 4}
          y={sy(ceiling) - 5}
          fontSize="10.5"
          fontWeight="700"
          fill={SERIES.ink}
          stroke={SURFACE}
          strokeWidth={3}
          paintOrder="stroke"
        >
          月薪上限 {sgd(ceiling)}
        </text>
        {shown.map((row, i) =>
          row.age % every === 0 ? (
            <text key={row.age} x={padL + slot * i + slot / 2} y={H - 6} textAnchor="middle" fontSize="10.5" fill={AXIS}>
              {row.age}
            </text>
          ) : null,
        )}
      </svg>
      {r ? (
        <Tooltip
          leftPct={((padL + slot * hover! + slot / 2) / W) * 100}
          title={`${r.age} 岁 · ${STATUS_LABEL[r.status]}`}
          rows={[
            { label: r.status === 'self' ? '月净收入' : '月薪', value: sgd(r.status === 'unemployed' || r.status === 'childcare' ? 0 : r.wage), strong: true },
            { label: '当年进 CPF', value: sgd(r.contrib) },
          ]}
          footer={r.wage > ceiling && r.status !== 'self' ? `超过 ${sgd(ceiling)} 的部分不缴 CPF` : undefined}
        />
      ) : null}
    </div>
  );
}
