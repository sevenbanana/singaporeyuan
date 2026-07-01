import { Fragment, type ReactNode } from 'react';

// 把字符串里的 「…」 / “…” / "…" 转成「加粗 + 棕金」强调，并去掉引号本身。
// onDark=true 用于深蓝底(封面),用较亮的金色。
export function rich(text: string, onDark = false): ReactNode {
  if (!text || !/[「『“"]/.test(text)) return text;
  const cls = onDark ? 'font-semibold text-gold-light' : 'font-semibold text-gold-deep';
  const parts = text.split(/(「[^」]*」|『[^』]*』|“[^”]*”|"[^"]*")/g);
  return parts.map((seg, i) => {
    let inner: string | null = null;
    if (seg.length >= 2) {
      const a = seg[0];
      const b = seg[seg.length - 1];
      if (
        (a === '「' && b === '」') ||
        (a === '『' && b === '』') ||
        (a === '“' && b === '”') ||
        (a === '"' && b === '"')
      ) {
        inner = seg.slice(1, -1);
      }
    }
    return inner !== null ? (
      <b key={i} className={cls}>
        {inner}
      </b>
    ) : (
      <Fragment key={i}>{seg}</Fragment>
    );
  });
}
