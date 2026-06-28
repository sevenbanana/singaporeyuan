// 案例详情(富文本):房子很多、股市太累,如何拥有稳定被动收入
// 中文内容,中英文站均展示。图表为示意静态图,数据明细标注「整理中」。

function Snum({ n, t }: { n: string; t: string }) {
  return (
    <div className="mb-2">
      <span className="text-xs font-extrabold tracking-[0.15em] text-gold-deep">{n}</span>
      <h2 className="mt-2 text-2xl font-black leading-snug text-navy md:text-3xl">{t}</h2>
    </div>
  );
}

function ListCard({
  title,
  items,
}: {
  title: string;
  items: { t: string; muted?: boolean }[];
}) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-6">
      <p className="mb-3 text-[15px] font-bold text-navy">{title}</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li
            key={i}
            className={`relative pl-4 text-sm leading-relaxed ${
              it.muted ? 'text-mist' : 'text-ink'
            }`}
          >
            <span className="absolute left-0 top-2 text-[8px] text-gold-light">◆</span>
            {it.t}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 示意:每年被动收入(千新币)+ 累计领取
const bars = [7, 14, 21, 28, 35, 35, 36, 37, 38, 39];
function IncomeChart() {
  const w = 640;
  const h = 240;
  const pad = { l: 36, r: 16, t: 16, b: 28 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const max = 60; // 千
  const cum: number[] = [];
  bars.reduce((a, b, i) => (cum[i] = a + b), 0);
  const cumMax = cum[cum.length - 1];
  const bw = cw / bars.length;
  const x = (i: number) => pad.l + i * bw + bw * 0.18;
  const barW = bw * 0.64;
  const y = (v: number) => pad.t + ch - (v / max) * ch;
  const cy = (v: number) => pad.t + ch - (v / cumMax) * ch;
  const line = cum
    .map((v, i) => `${x(i) + barW / 2},${cy(v)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="被动收入走势示意图">
      {[0, 15, 30, 45, 60].map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={w - pad.r} y1={y(g)} y2={y(g)} stroke="#E6DFD4" strokeWidth="1" />
          <text x={pad.l - 6} y={y(g) + 3} textAnchor="end" fontSize="9" fill="#7a7264">
            {g}
          </text>
        </g>
      ))}
      {bars.map((v, i) => (
        <g key={i}>
          <rect x={x(i)} y={y(v)} width={barW} height={pad.t + ch - y(v)} rx="3" fill="#c9a55c" opacity={i < 5 ? 0.55 : 1} />
          <text x={x(i) + barW / 2} y={h - 10} textAnchor="middle" fontSize="9" fill="#7a7264">
            {i + 1}
          </text>
        </g>
      ))}
      <polyline points={line} fill="none" stroke="#1a2744" strokeWidth="2" />
      {cum.map((v, i) => (
        <circle key={i} cx={x(i) + barW / 2} cy={cy(v)} r="2.5" fill="#1a2744" />
      ))}
    </svg>
  );
}

export default function PassiveIncomeCase() {
  return (
    <>
      {/* 01 客户画像 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="01 / 客户画像" t="资产很厚,但风险结构失衡" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          表面上资产配置不少,细看却两头不平衡:稳的太稳、动的太累。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <ListCard
            title="🏠 资产现状"
            items={[
              { t: '不动产:3 套投资房,均无房贷,占比偏高' },
              { t: 'CPF 已顶格充满' },
              { t: '闲钱买了保本年金' },
              { t: '手上还有约 50 万新币闲置资金' },
            ]}
          />
          <ListCard
            title="📉 股市的困扰"
            items={[
              { t: '有投资股市,但觉得太占时间和精力' },
              { t: '总是「管不住手」,频繁操作' },
              { t: '实际盈利不理想' },
              { t: '希望把更多精力留给家人' },
            ]}
          />
          <ListCard
            title="🛡️ 已有保障"
            items={[
              { t: '全球医疗险 ✓' },
              { t: '香港重疾险 ✓' },
              { t: '没有大额寿险 ✕', muted: true },
            ]}
          />
          <ListCard
            title="🎯 核心诉求"
            items={[
              { t: '想要一份稳定、省心的被动收入' },
              { t: '不想再被盘面牵着走' },
              { t: '资产能在自己使用之外,也兼顾家庭' },
            ]}
          />
        </div>
      </section>

      {/* 02 需求分析 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="02 / 需求分析" t="问题不在「钱不够」,在「配比失衡」" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          把现有资产按风险摊开看,问题就清楚了:低风险资产占比过高,真正承担风险的部分(股市)又没换来理想回报。以下结构为示意,仅用于说明再平衡思路。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <ListCard
            title="调整前 · 两头失衡"
            items={[
              { t: '低风险:不动产 + 年金 + CPF · 偏高' },
              { t: '高风险:股市 · 费精力、回报不稳' },
            ]}
          />
          <ListCard
            title="调整后 · 各归其位"
            items={[
              { t: '稳健层:不动产 + 保障型配置' },
              { t: '增长层:分红基金 · 省心的被动现金流' },
            ]}
          />
        </div>
        <p className="mt-6 border-l-2 border-gold pl-4 text-[15px] leading-relaxed text-navy/80">
          他缺的不是收益机会,而是一种<b className="font-semibold text-navy">不用盯盘、能持续产生现金流</b>的安排——把时间和精力,还给家人。
        </p>
      </section>

      {/* 03 方案一 被动收入 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="03 / 方案一 · 被动收入" t="用一笔闲钱,换一条稳定的现金流" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          以下是根据他的情况做的演示,实际可按自己的节奏来定。用部分闲钱配置分红基金:每年投入 10 万新币、定投 5 年,从第一年起就有被动收入,逐年递增。
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['💰 每年投入', 'S$100,000', '定投 5 年'],
            ['📅 收入起点', '第 1 年起', '当年即有现金流'],
            ['📈 第 5 年起每年', 'S$35,000', '约 S$3,000 / 月'],
            ['♻️ 特点', '省心被动', '不用盯盘'],
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-5">
              <p className="text-xs text-mist">{c[0]}</p>
              <p className="mt-2 text-xl font-black text-navy">{c[1]}</p>
              <p className="mt-1 text-xs text-gold-deep">{c[2]}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-6">
          <p className="mb-1 text-sm font-bold text-navy">被动收入走势 · 示意</p>
          <p className="mb-4 text-xs text-mist">金柱 = 每年被动收入 · 蓝线 = 累计领取 · 前 5 年同时在投入本金(单位:千新币)</p>
          <IncomeChart />
          <p className="mt-4 rounded-lg bg-sand-100 px-4 py-3 text-xs text-mist">
            📄 被动收入明细表(逐年投入 / 累计投入 / 当年被动收入 / 累计领取)整理中,方案数据确认后补全。
          </p>
        </div>
      </section>

      {/* 04 方案二 寿险缺口 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="04 / 方案二 · 寿险缺口" t="300 万美元身价,却没有大额寿险" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          客户的不动产合计身价约 US$300 万,但名下没有大额寿险。一旦发生意外,家庭资产可能被迫处置、流动性骤降。我们用万能指数险(IUL)来补足这块缺口——兼顾身故保障与现金价值增长。
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['资产身价', '≈ US$3,000,000', '主要为不动产,流动性较低'],
            ['寿险缺口', '大额寿险缺位', '意外时家庭流动性承压'],
            ['配置方向', '万能指数险 IUL', '身故保障 + 现金价值增长'],
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-6">
              <p className="text-xs text-mist">{c[0]}</p>
              <p className="mt-2 text-lg font-black text-navy">{c[1]}</p>
              <p className="mt-2 text-xs leading-relaxed text-mist">{c[2]}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl border border-dashed border-gold/40 bg-gold/5 px-5 py-4 text-sm text-mist">
          📄 详细方案数据整理中:这一节将放入 IUL 的保额、保费结构与现金价值演示表。方案数据确认后即可补全。
        </p>
      </section>
    </>
  );
}
