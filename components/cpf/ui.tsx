'use client';

/**
 * CPF 计算器的表单小部件。
 * 外观沿用退休自由度测算(components/RetirementCalculator.tsx)那一套:
 * 圆角输入框、金色聚焦环、navy 实心的选中态。
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';

export const sgd = (v: number) => 'S$' + Math.round(Math.max(0, v)).toLocaleString('en-SG');

/** 取整到十位:月领额这类数字,精确到个位反而给人错觉 */
export const sgd10 = (v: number) => sgd(Math.round(Math.max(0, v) / 10) * 10);

export const compact = (v: number) => {
  const x = Math.max(0, v);
  if (x >= 1_000_000) return `S$${(x / 1_000_000).toFixed(2)}M`;
  if (x >= 10_000) return `S$${Math.round(x / 1000)}K`;
  if (x >= 1000) return `S$${(x / 1000).toFixed(1)}K`;
  return sgd(x);
};

/** 带正负号的金额差 */
export const signed = (v: number, fmt: (x: number) => string = sgd) =>
  Math.abs(v) < 0.5 ? '±0' : `${v > 0 ? '+' : '−'}${fmt(Math.abs(v))}`;

export const num = (s: string) => {
  const v = Number(String(s).replace(/,/g, '').trim());
  return Number.isFinite(v) ? v : 0;
};

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const withCommas = (raw: string) => {
  if (raw === '' || raw === '.') return raw;
  const n = num(raw);
  const [int, dec] = String(n).split('.');
  return Number(int).toLocaleString('en-SG') + (dec ? `.${dec}` : '');
};

/** 只保留数字和一个小数点(允许负号时保留开头的「-」),去掉多余的前导 0 */
function sanitise(input: string, allowNegative: boolean): string {
  const neg = allowNegative && input.trim().startsWith('-');
  let v = input.replace(/[^\d.]/g, '');
  const dot = v.indexOf('.');
  if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, '');
  v = v.replace(/^0+(?=\d)/, '');
  return neg ? `-${v}` : v;
}

export function NumField({
  id,
  label,
  help,
  prefix,
  suffix,
  money,
  negative,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help?: string;
  prefix?: string;
  suffix?: string;
  money?: boolean;
  negative?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <label htmlFor={id} className="text-[13px] font-semibold text-navy">
        {label}
      </label>
      {help ? <p className="mt-0.5 text-[11px] leading-[1.5] text-mist">{help}</p> : null}
      <div className="mt-1.5 flex min-h-[46px] items-center gap-2 rounded-[11px] border border-navy/15 bg-white px-3.5 transition-[border-color,box-shadow] duration-150 focus-within:border-gold focus-within:shadow-[0_0_0_4px_rgba(201,165,92,0.13)]">
        {prefix ? <span className="shrink-0 text-xs font-medium text-mist">{prefix}</span> : null}
        <input
          id={id}
          type="text"
          inputMode={negative ? 'text' : 'decimal'}
          autoComplete="off"
          placeholder="0"
          value={value}
          onFocus={(e) => {
            const el = e.currentTarget;
            if (money && el.value.includes(',')) onChange(el.value.replace(/,/g, ''));
            if (el.value === '0') {
              requestAnimationFrame(() => {
                if (document.activeElement === el && el.value === '0') el.select();
              });
            }
          }}
          onChange={(e) => onChange(sanitise(e.target.value, !!negative))}
          onBlur={(e) => {
            const v = e.currentTarget.value;
            if (v === '.' || v === '-') return onChange('');
            const trimmed = v.endsWith('.') ? v.slice(0, -1) : v;
            onChange(money ? withCommas(trimmed) : trimmed);
          }}
          className="w-full min-w-0 bg-transparent py-2.5 text-right text-[16px] font-bold text-navy outline-none placeholder:font-normal placeholder:text-mist/40"
        />
        {suffix ? <span className="shrink-0 text-xs font-medium text-mist">{suffix}</span> : null}
      </div>
    </div>
  );
}

export const optionClass = (active: boolean) =>
  `min-h-[46px] rounded-xl border px-3 text-left text-[13px] font-semibold transition-all duration-200 ${
    active
      ? 'border-navy bg-navy text-cream shadow-[0_8px_20px_-10px_rgba(26,39,68,0.6)]'
      : 'border-navy/15 bg-white text-navy hover:border-gold hover:bg-gold/[0.05]'
  }`;

/** 一排互斥选项 */
export function Choice<T extends string | number>({
  label,
  help,
  value,
  options,
  onChange,
  cols = 3,
}: {
  label?: string;
  help?: string;
  value: T;
  options: { value: T; label: string; sub?: string }[];
  onChange: (v: T) => void;
  cols?: number;
}) {
  const grid: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    6: 'grid-cols-3 sm:grid-cols-6',
  };
  return (
    <div>
      {label ? <span className="block text-[13px] font-semibold text-navy">{label}</span> : null}
      {help ? <p className="mt-0.5 text-[11px] leading-[1.5] text-mist">{help}</p> : null}
      <div role="radiogroup" aria-label={label} className={`mt-1.5 grid gap-1.5 ${grid[cols] ?? 'grid-cols-3'}`}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`${optionClass(active)} ${o.sub ? 'py-2' : ''} ${o.sub ? '' : 'text-center'}`}
            >
              <span className="block">{o.label}</span>
              {o.sub ? (
                <span className={`mt-0.5 block text-[10.5px] font-normal leading-snug ${active ? 'text-cream/70' : 'text-mist'}`}>
                  {o.sub}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  help,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  help?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl border border-navy/[0.12] bg-white px-3.5 py-3 text-left transition-colors hover:border-gold/60"
    >
      <span
        aria-hidden
        className={`relative mt-0.5 h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-navy' : 'bg-navy/15'
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-[left] duration-200 ${
            checked ? 'left-[19px]' : 'left-[3px]'
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-navy">{label}</span>
        {help ? <span className="mt-0.5 block text-[11px] leading-[1.55] text-mist">{help}</span> : null}
      </span>
    </button>
  );
}

/** 百分比步进器:手机上一点就改,不会填进离谱的数字 */
export function Stepper({
  id,
  label,
  value,
  step = 0.5,
  min,
  max,
  unit = '%',
  digits = 1,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  step?: number;
  min: number;
  max: number;
  unit?: string;
  digits?: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const set = (d: number) => onChange(clamp(Math.round((value + d) * 100) / 100, min, max));
  return (
    <div className="rounded-[11px] border border-navy/[0.09] bg-sand-50 px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="min-w-0 text-[12px] font-medium text-navy/80">
          {label}
        </label>
        <div className="flex shrink-0 items-center gap-1">
          <StepButton onClick={() => set(-step)} label={`${label}减少`} minus />
          <output id={id} className="min-w-[58px] text-center text-[14px] font-black tabular-nums text-navy">
            {value.toFixed(digits)}
            {unit}
          </output>
          <StepButton onClick={() => set(step)} label={`${label}增加`} />
        </div>
      </div>
      {hint ? <p className="mt-1 text-[10.5px] leading-relaxed text-mist">{hint}</p> : null}
    </div>
  );
}

function StepButton({ onClick, label, minus }: { onClick: () => void; label: string; minus?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-7 w-7 place-items-center rounded-lg border border-navy/15 bg-white text-navy transition-colors hover:border-gold hover:text-gold-deep"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={minus ? 'M5 12h14' : 'M12 5v14M5 12h14'} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export function Callout({ title, children, tone = 'gold' }: { title: string; children: ReactNode; tone?: 'gold' | 'navy' }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-[13px] border px-4 py-3.5 ${
        tone === 'gold' ? 'border-gold/40 bg-[#fffaf0]' : 'border-navy/10 bg-sand-50'
      }`}
    >
      <span
        aria-hidden
        className="mt-0.5 grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full border border-gold font-serif text-[12px] italic text-gold-deep"
      >
        i
      </span>
      <div className="min-w-0">
        <strong className="block text-[13px] font-bold text-navy">{title}</strong>
        <div className="mt-1 text-[12px] leading-[1.8] text-mist">{children}</div>
      </div>
    </div>
  );
}

/** 小节标题 */
export function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t border-navy/[0.08] pt-5 first:border-0 first:pt-0">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3 className="text-[14px] font-bold text-navy">{title}</h3>
        {note ? <p className="text-[11px] text-mist">{note}</p> : null}
      </div>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

/** 图表宽度跟着容器走:手机上用真实像素画,字号不会被缩小 */
export function useWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(Math.max(280, Math.round(el.getBoundingClientRect().width)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5 text-[11.5px] text-mist">
          <i className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}
