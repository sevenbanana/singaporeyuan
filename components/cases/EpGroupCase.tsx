// 案例详情(富文本):刚来新加坡,只有公司团险,个人保障到底要不要买?
// 中文内容,中英文站均展示。金额为示意,以保险公司正式文件为准。

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

export default function EpGroupCase() {
  return (
    <>
      {/* 01 客户画像 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="01 / 客户画像" t="他是谁,在意什么" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          刚来新加坡、刚进职场,手里只有公司给的团体保险。先把他的处境理清楚,方案才有依据。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <ListCard
            title="👤 基本画像"
            items={[
              '年龄:28 岁',
              '身份:EP 工作准证',
              '刚来新加坡,进入一家科技公司',
              '单身,父母在国内,暂无被赡养人',
            ]}
          />
          <ListCard
            title="💰 收入与现状"
            items={[
              '年收入:约 S$90,000',
              '有一定储蓄,但应急金还不够厚',
              '日常现金流尚可,不想被保费占用太多',
            ]}
          />
          <ListCard
            title="🛡️ 已有保障"
            items={[
              '公司团体医疗 ✓(离职 / 换工作即失效)',
              '公司团体意外 ✓(同样跟着工作走)',
              '个人保单 ✕(完全空白)',
            ]}
          />
          <ListCard
            title="🎯 最担心的"
            items={[
              '万一生一场大病或出意外,收入会中断',
              '公司团险会跟着工作一起消失',
              '不想为保险花太多、影响现在的生活',
            ]}
          />
        </div>
      </section>

      {/* 02 方案设计 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="02 / 方案设计" t="三层基础保障,先把地基打牢" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          依据 MAS MoneySense 对 19–29 岁的建议——先建立应急基金,再用不超过收入 15% 的预算配置保障。我为他搭了三层「跟人走、不随工作失效」的个人基础保障。以下金额为示意,实际以核保结果与保险公司正式文件为准。
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['① 住院医疗险', 'Integrated Shield Plan', '跟人走、保终身,不随工作变动失效', '年保费 示意 ~S$500'],
            ['② 个人意外险', '保额 ~S$200,000', '年轻人通勤、运动频繁,性价比高', '年保费 示意 ~S$250'],
            ['③ 早期重疾险', '保额 ~S$100,000(定期)', '趁年轻费率低,锁定未来可保性', '年保费 示意 ~S$400'],
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-navy/10 bg-white p-6">
              <p className="text-sm font-bold text-navy">{c[0]}</p>
              <p className="mt-2 text-base font-black text-navy">{c[1]}</p>
              <p className="mt-2 text-xs leading-relaxed text-mist">{c[2]}</p>
              <p className="mt-3 text-xs font-semibold text-gold-deep">{c[3]}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl border-l-2 border-gold bg-gold/5 px-5 py-4 text-sm leading-relaxed text-navy/80">
          三项合计年保费约 <b className="font-semibold text-navy">S$1,150(示意)</b>,约占年收入的 1.3%,远在 15% 预算之内。这一阶段我<b className="font-semibold text-navy">没有建议任何储蓄或投资型产品</b>——对他而言,最划算的「投资」就是趁年轻、用低费率锁定健康保障。
        </p>
      </section>

      {/* 03 为什么这样设计 */}
      <section className="border-b border-navy/10 py-14">
        <Snum n="03 / 为什么这样设计" t="为什么先保障、不先理财" />
        <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-mist">
          这套顺序回应的,正是他最担心的几件事。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['🏢 公司团险是「借来的」', '离职、换工作、被裁,团险就没了;真正属于他自己的保障几乎为零。'],
            ['⏳ 趁年轻费率低', '年轻健康时核保简单、保费低;早锁定就锁住了未来的可保性,等身体出状况可能买不到或要加费。'],
            ['🩺 先兜「一旦发生就影响很大」的风险', '大病和意外对收入的冲击最大,优先用医疗 + 重疾兜住,比追求收益更重要。'],
            ['💵 理财不是不做,而是排在后面', '等应急金更厚、现金流更稳,再开始储蓄和投资,顺序不能反。'],
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
