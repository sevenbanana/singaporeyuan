// 人生旅程时间轴：6 个案例按年龄升序排成一条可生长的画布。
// 节点用真实人物插画（think 默认 / smile 悬停），点击进入详情页。
// 新增案例只需往 lib/cases.ts 追加，时间轴与首页会自动生长。
import Image from 'next/image';
import { Link } from '@/lib/routing';
import { CASES, HEX_AXES } from '@/lib/cases';

// 六边形补全进度条：6 个维度按 0–3 着色
function HexProgress({ levels, align }: { levels: readonly number[]; align: 'left' | 'right' }) {
  const filled = levels.filter((v) => v >= 2).length;
  return (
    <div>
      <div className={`flex items-center gap-1.5 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {HEX_AXES.map((axis, i) => {
          const lv = levels[i];
          return (
            <span
              key={axis}
              title={axis}
              className={`h-1.5 flex-1 rounded-full ${
                lv >= 2 ? 'bg-gold-deep' : lv === 1 ? 'bg-gold/40' : 'bg-navy/10'
              }`}
            />
          );
        })}
      </div>
      <div className="mt-2 text-xs text-mist">
        保障六边形 <span className="font-semibold text-gold-deep">{filled}/6</span> 已充足
      </div>
    </div>
  );
}

function Avatar({ n, name }: { n: number; name: string }) {
  return (
    <span className="relative block h-20 w-20 overflow-hidden rounded-full border-2 border-gold/40 bg-white shadow-sm md:h-24 md:w-24">
      <Image
        src={`/avatars/case${n}_banner.png`}
        alt={name}
        fill
        sizes="96px"
        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
    </span>
  );
}

export default function CaseJourney() {
  return (
    <div className="relative">
      {/* 中轴线 */}
      <div aria-hidden className="absolute left-[39px] top-4 bottom-10 w-px bg-gradient-to-b from-gold/50 via-gold/30 to-gold/10 md:left-1/2 md:-translate-x-1/2" />

      <ol className="space-y-10 md:space-y-0">
        {CASES.map((c, i) => {
          const left = i % 2 === 0; // 桌面端左右交错
          return (
            <li key={c.slug} className="relative md:grid md:grid-cols-2 md:gap-16 md:py-8">
              {/* 人物节点 */}
              <Link
                href={`/cases/${c.slug}`}
                aria-label={c.mapLabel}
                className="group absolute left-0 top-0 z-10 block md:left-1/2 md:top-8 md:-translate-x-1/2"
              >
                <Avatar n={i + 1} name={c.mapLabel} />
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-cream text-sm font-bold text-gold-deep shadow-sm">
                  {c.age}
                </span>
              </Link>

              {/* 卡片 */}
              <div
                className={`ml-28 md:ml-0 ${
                  left ? 'md:col-start-1 md:pr-10 md:text-right' : 'md:col-start-2 md:pl-10'
                }`}
              >
                <Link href={`/cases/${c.slug}`} className="card card-hover group block p-6">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-mist">{c.mapLabel}</span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-gold-deep">{c.theme}</span>
                  <h3 className="mt-1.5 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-gold-deep">
                    {c.title}
                  </h3>
                  <div className="mt-4">
                    <HexProgress levels={c.hexAfter} align={left ? 'right' : 'left'} />
                  </div>
                  <span className="mt-4 inline-block text-sm font-medium text-gold-deep">查看案例 →</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      {/* 生长提示 */}
      <div className="relative mt-10 md:mt-4">
        <span
          aria-hidden
          className="absolute left-[19px] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-gold/40 bg-cream text-lg text-gold-deep/60 md:left-1/2 md:-translate-x-1/2"
        >
          +
        </span>
        <p className="ml-28 pt-2 text-sm text-mist md:ml-0 md:pt-16 md:text-center">
          人生还在继续，案例库也会随之生长……
        </p>
      </div>
    </div>
  );
}
