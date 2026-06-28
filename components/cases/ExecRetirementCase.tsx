// 案例详情(富文本):40 岁大厂高管的长期现金流规划
// 中文内容,中英文站均展示。明细表标注「整理中」。

function Snum({ n, t }: { n: string; t: string }) {
  return (
    <div className="mb-2">
      <span className="text-xs font-extrabold tracking-[0.15em] text-gold-deep">{n}</span>
      <h2 className="mt-2 text-2xl font-black leading-snug text-navy md:text-3xl">{t}</h2>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-6">
      <p className="mb-3 text-[15px] font-bold text-navy">{title}</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="relative pl-4 text-sm leading-relaxed text-ink">
            <span className="absolute left-0 top-2 text-[8px] text-gold-light">◆</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExecRetirementCase() {
  return (
    <>
      {/* 01 客户画像 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="01 / 客户画像" t="他是谁,在意什么" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          每个家庭的状况都不同。先把客户的处境理清楚,方案才有依据。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <ListCard
            title="👤 基本画像"
            items={[
              '年龄:40 岁',
              '职业:互联网大厂高管',
              '家庭阶段:已婚,育有 1–2 个孩子',
              '可规划资产:US$500,000',
            ]}
          />
          <ListCard
            title="📈 收入与资产"
            items={[
              '年收入:约 S$35 万 / 年',
              '家庭可动用存款:约 US$50 万',
              '现金流:日常充足,短期无大额资金压力',
            ]}
          />
          <ListCard
            title="🛡️ 已有保障配置"
            items={[
              '公司团体医疗保障',
              '基础住院险(家庭已配置)',
              '一定额度的寿险 / 重疾保障',
              '基础意外保障',
            ]}
          />
          <ListCard
            title="🎯 核心需求"
            items={[
              '为未来准备一笔长期现金流',
              '兼顾资产稳健性与未来使用灵活性',
              '若职业节奏变化,希望有可提前启动的安排',
              '在自己使用之外,也能兼顾家庭资产传承',
            ]}
          />
        </div>
        <p className="mt-6 border-l-2 border-gold pl-4 text-[15px] leading-relaxed text-navy/80">
          核心诉求:不是追求短期高波动,而是把一笔<b className="font-semibold text-navy">短期用不上的资金</b>,转化为未来<b className="font-semibold text-navy">可进可退</b>的长期安排。
        </p>
      </section>

      {/* 02 方案设计 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="02 / 方案设计" t="领取节奏,他自己选" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          同样一笔 US$500,000、只交一次,区别只在「什么时候开始领」——早领灵活、晚领更厚。以下为两种演示,实际领取可按自己来定。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <p className="text-sm font-bold text-navy">45 岁起领 · 灵活</p>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              较早启动年度现金流;若职业节奏变化,45 岁就能接住,灵活性更高。
            </p>
          </div>
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <p className="text-sm font-bold text-navy">55 岁起领 · 更厚</p>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              延到 55 岁领,本金多滚 10 年复利,年领金额翻倍以上,更适合短期无需求的资金。
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['一次性投入', 'US$500,000'],
            ['缴费方式', '只交一次(趸交)'],
            ['演示利率', '6.25% 演示'],
            ['保障期', '保至 100 岁'],
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-5">
              <p className="text-xs text-mist">{c[0]}</p>
              <p className="mt-2 text-lg font-black text-navy">{c[1]}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl border border-dashed border-gold/40 bg-gold/5 px-5 py-4 text-sm text-mist">
          📄 提取方案明细表(保单年 / 年龄 / 当年领取 / 累计领取 / 保单总价值 / IRR)与交互图表整理中,方案数据确认后补全。
        </p>
      </section>

      {/* 03 为什么这样设计 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="03 / 为什么这样设计" t="不是卖产品,是给他一个「可进可退」的结构" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          这套安排回应的,正是他最初的几个诉求。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['⏳ 可早可晚', '若职业节奏变化,45 岁就能启动现金流;若无需求,延到 55 岁领,本金多滚 10 年复利,年领金额翻倍以上。'],
            ['💧 稳健为先', '不追求短期高波动,把一笔闲置美元转为长期、可预期的年度现金流,降低择时焦虑。'],
            ['🔄 进退有据', '领取之外仍保留退保价值,需要时本金侧仍有支撑,而非一次性锁死。'],
            ['🏛️ 兼顾传承', '保至 100 岁,在自己使用之外,也为家庭资产传承留出空间。'],
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-6">
              <p className="text-[15px] font-bold text-navy">{c[0]}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist">{c[1]}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
