import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import PageHero, { ContentLayer } from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { Link } from '@/lib/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'en' ? 'Corporate Employee Benefits' : '企业团险与员工福利' };
}

const ic = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const I = {
  team: (
    <svg {...ic}><circle cx="9" cy="8.5" r="3.1" /><path d="M3.5 20c.4-3.4 2.8-5.2 5.5-5.2s5.1 1.8 5.5 5.2" /><path d="M15.3 5.7a3.1 3.1 0 0 1 0 5.6M17.4 15c2 .7 3.3 2.3 3.6 5" /></svg>
  ),
  shield: (
    <svg {...ic}><path d="m12 3 8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m8.8 12 2.2 2.2 4.2-4.5" /></svg>
  ),
  phone: (
    <svg {...ic}><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10.5 5h3M11 18.5h2" /></svg>
  ),
  heart: (
    <svg {...ic}><path d="M12 20.3C7.2 16.5 3.5 13.2 3.5 9.2 3.5 6.4 5.6 4.5 8 4.5c1.6 0 3 .8 4 2.1 1-1.3 2.4-2.1 4-2.1 2.4 0 4.5 1.9 4.5 4.7 0 4-3.7 7.3-8.5 11.1z" /></svg>
  ),
  puzzle: (
    <svg {...ic}><path d="M4 7h4V5.5a2 2 0 1 1 4 0V7h4v4h1.5a2 2 0 1 1 0 4H16v4h-4v-1.5a2 2 0 1 0-4 0V19H4v-4h1.5a2 2 0 1 0 0-4H4z" /></svg>
  ),
  clinic: (
    <svg {...ic}><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M12 12.5v5M9.5 15h5" /></svg>
  ),
  card: (
    <svg {...ic}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10.5h18" /><path d="M6.8 15.5h4.5" /></svg>
  ),
  globe: (
    <svg {...ic}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.4 2.3 3.7 5.2 3.7 8.5s-1.3 6.2-3.7 8.5c-2.4-2.3-3.7-5.2-3.7-8.5s1.3-6.2 3.7-8.5z" /></svg>
  ),
  plus: (
    <svg {...ic}><circle cx="12" cy="12" r="8.5" /><path d="M12 8v8M8 12h8" /></svg>
  ),
  check: (
    <svg {...ic}><circle cx="12" cy="12" r="8.5" /><path d="m8.3 12.4 2.6 2.6 5-5.6" /></svg>
  ),
  star: (
    <svg {...ic}><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" /></svg>
  ),
  steth: (
    <svg {...ic}><path d="M5 3H4a1 1 0 0 0-1 1v5a5 5 0 0 0 10 0V4a1 1 0 0 0-1-1h-1" /><path d="M8 14v2.5a5.5 5.5 0 0 0 11 0v-4" /><circle cx="19" cy="10" r="2.4" /></svg>
  ),
  mic: (
    <svg {...ic}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></svg>
  ),
  run: (
    <svg {...ic}><circle cx="14" cy="5" r="2" /><path d="m8 21 3-6-2.5-3 3-4 2.5 3H18" /><path d="m6 12 2.5-4.5L12 6" /></svg>
  ),
  palette: (
    <svg {...ic}><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-.8-.5-1.3-.5-2 0-1 .8-1.8 1.9-1.8h2A3.3 3.3 0 0 0 20.5 12c0-4.7-3.8-8.5-8.5-8.5z" /><circle cx="8" cy="10" r="1" /><circle cx="12" cy="7.5" r="1" /><circle cx="16" cy="10" r="1" /></svg>
  ),
  coffee: (
    <svg {...ic}><path d="M4 9h12v4.5A4.5 4.5 0 0 1 11.5 18h-3A4.5 4.5 0 0 1 4 13.5z" /><path d="M16 10h2.2a2.4 2.4 0 0 1 0 4.8H16" /><path d="M7.5 3.5c-.9 1.1-.9 2.2 0 3.3M11.5 3.5c-.9 1.1-.9 2.2 0 3.3" /></svg>
  ),
  book: (
    <svg {...ic}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
  ),
  tent: (
    <svg {...ic}><path d="m12 4 9 16H3z" /><path d="M12 12v8" /><path d="m9.5 20 2.5-4 2.5 4" /></svg>
  ),
};

export default async function CorporatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === 'en';

  const whys: { icon: ReactNode; t: string; d: string }[] = [
    { icon: I.team, t: en ? 'Attract & retain talent' : '引才留才', d: en ? 'A solid benefits programme is the most cost-effective retention tool.' : '一份像样的医疗福利，是性价比最高的留人工具。' },
    { icon: I.shield, t: en ? 'Duty of care' : '雇主责任', d: en ? 'When employees need help most, the company has it covered.' : '员工真出事的时候，公司有一套体面的应对。' },
    { icon: I.phone, t: en ? 'Zero paperwork' : 'HR零纸质', d: en ? 'Claims on the eBenefits app; HR manages everything online.' : '员工手机理赔，HR后台管名单账单，不碰纸质表格。' },
  ];

  const stats = en
    ? [
        { v: '50+', l: 'years in employee benefits' },
        { v: '1.3m+', l: 'insured employees in SG' },
        { v: '300+', l: 'support staff' },
        { v: '19 yrs', l: 'Best Employee Insurance Gold' },
      ]
    : [
        { v: '50+', l: '年员工福利经验' },
        { v: '130万+', l: '新加坡受保会员' },
        { v: '300+', l: '人服务团队' },
        { v: '19年', l: '最佳雇员保险金奖' },
      ];

  const plans = [
    {
      tag: en ? 'For SMEs · All staff' : '中小企业 · 全员医疗',
      name: 'AIA Flexi Vital Care Plus',
      zhName: en ? 'Flexible SME employee insurance' : '模块化中小企业团险',
      color: 'navy' as const,
      stats: en
        ? [
            { v: '5', l: 'lives to start', s: '3 employees + 2 dependants counts' },
            { v: '24/7', l: 'worldwide cover', s: 'incl. teleconsultation' },
            { v: 'Portfolio', l: 'pricing', s: 'claims don’t push up renewal' },
          ]
        : [
            { v: '5人', l: '起投', s: '3员工+2家属也可' },
            { v: '7×24', l: '全球保障', s: '含远程问诊' },
            { v: '组合', l: '定价', s: '理赔不直接推高续保' },
          ],
      feats: en
        ? [
            { icon: I.puzzle, t: 'Mix & match modules', s: 'GHS / GTL core + outpatient, dental, CI, accident riders' },
            { icon: I.clinic, t: 'Cashless clinic network', s: 'Panel GP & SP, medication delivered to your door' },
            { icon: I.card, t: 'Inpatient pre-authorisation', s: 'AIA settles the hospital bill directly' },
            { icon: I.plus, t: 'Voluntary top-ups', s: 'Employees & dependants upgrade at their own cost' },
          ]
        : [
            { icon: I.puzzle, t: '模块自由组合', s: '住院GHS/寿险GTL打底，门诊、牙科、重疾、意外按需加装' },
            { icon: I.clinic, t: '无现金诊所网络', s: '合作全科+专科看诊免掏钱，远程问诊药品送上门' },
            { icon: I.card, t: '住院预授权直赔', s: '友邦直接与医院结算，出院不垫大额账单' },
            { icon: I.plus, t: '员工自愿加保', s: '员工和家属可自费升级，公司不用额外掏钱' },
          ],
    },
    {
      tag: en ? 'For executives · Global teams' : '高管与外籍人才 · 高端医疗',
      name: 'AIA Premier International Medical',
      zhName: en ? 'High-end international medical (PIM)' : '友邦卓越国际医疗保险（PIM）',
      color: 'gold' as const,
      stats: en
        ? [
            { v: '4', l: 'lives to start', s: '3 employees + 1 dependant counts' },
            { v: 'S$3.5m', l: 'top annual limit', s: 'five tiers from S$500k' },
            { v: '3', l: 'coverage areas', s: 'Asia / WW ex-USA / Worldwide' },
          ]
        : [
            { v: '4人', l: '起投', s: '3员工+1家属也可' },
            { v: '350万', l: '最高年限额', s: '50万起共五档，新元/美元' },
            { v: '3种', l: '承保区域', s: '亚洲 / 全球除美 / 全球' },
          ],
      feats: en
        ? [
            { icon: I.globe, t: 'Cashless worldwide', s: 'Global guarantee letters + panel clinics in 7 markets' },
            { icon: I.plus, t: 'Rich optional benefits', s: 'Outpatient, dental, maternity, optical, wellness' },
            { icon: I.check, t: 'Pre-existing conditions OK', s: 'Groups of 11+ can opt for “no questions asked” underwriting' },
            { icon: I.star, t: 'Concierge-level care', s: '24/7 service centre, case management, mental health support' },
          ]
        : [
            { icon: I.globe, t: '全球无现金就医', s: '住院保函直赔，新加坡等7地门诊网络' },
            { icon: I.plus, t: '福利想加就加', s: '门诊、牙科、孕产、眼科、体检五项可选' },
            { icon: I.check, t: '既往症也能保', s: '11人以上团体可选"既往症不咎"核保' },
            { icon: I.star, t: '管家级服务', s: '7×24专属中心 + 个案管理 + 心理健康' },
          ],
    },
  ];

  const cmp: { k: string; a: string; b: string }[] = en
    ? [
        { k: 'Best for', a: 'SMEs covering all staff', b: 'Executives, expats, global teams' },
        { k: 'Minimum lives', a: '5 (3 employees + 2 dependants)', b: '4 (3 employees + 1 dependant)' },
        { k: 'Annual limit', a: 'Tiered by module & plan', b: 'S$500k – S$3.5m, five tiers' },
        { k: 'Coverage area', a: 'Worldwide, 24/7', b: 'Asia / WW ex-USA / Worldwide' },
        { k: 'Cashless network', a: 'Panel clinics + tele-consult + pre-auth', b: 'Global guarantee letters + 7-market panels' },
        { k: 'Pricing', a: 'Portfolio pricing, GST included', b: 'Age-banded, quoted per census' },
      ]
    : [
        { k: '适合团队', a: '中小企业全员保障', b: '高管、外籍员工、跨国团队' },
        { k: '起投人数', a: '5人（3员工+2家属也可）', b: '4人（3员工+1家属也可）' },
        { k: '年度限额', a: '按模块和档位选择', b: '50万–350万新元/美元，五档' },
        { k: '保障范围', a: '全球7×24', b: '亚洲 / 全球除美 / 全球 三选一' },
        { k: '无现金网络', a: '合作诊所+远程问诊+住院预授权', b: '全球住院保函直赔+七地门诊网络' },
        { k: '定价方式', a: '组合定价，理赔不直接推高续保', b: '按年龄段与名单精准报价' },
      ];

  const acts: { icon: ReactNode; t: string; items: string[] }[] = en
    ? [
        { icon: I.steth, t: 'Health checks', items: ['Onsite screening', 'Cancer screening', 'Spinal assessment', 'Eye check', 'Body composition', 'TCM consult'] },
        { icon: I.mic, t: 'Health talks', items: ['Cancer prevention', 'Breast / prostate', 'Heart & diabetes', 'Stress relief'] },
        { icon: I.run, t: 'Fitness', items: ['Yoga', 'Pilates', 'Spinning', 'HIIT', 'Muay Thai', 'Bounce'] },
        { icon: I.palette, t: 'Team crafts', items: ['Pottery', 'Perfume making', 'Leather craft', 'Terrarium', 'Watch assembly', 'Flower art', 'Crochet'] },
        { icon: I.coffee, t: 'Tasting', items: ['Coffee / tea', 'Barista', 'Ice-cream making', 'Mooncake baking', 'Wine'] },
        { icon: I.book, t: 'Financial wellness', items: ['LPA & wills', 'CPF & retirement', 'Company vs personal cover', 'Insurance AMA', 'Legacy planning'] },
        { icon: I.tent, t: 'Big days', items: ['Family carnival', 'Charity run', 'Wellness bazaar'] },
      ]
    : [
        { icon: I.steth, t: '健康检测', items: ['上门体检', '癌症筛查', '脊椎评估', '眼科检查', '体脂分析', '中医体质'] },
        { icon: I.mic, t: '健康讲座', items: ['癌症防治', '乳腺/前列腺', '心脏与三高', '心理减压'] },
        { icon: I.run, t: '运动课程', items: ['瑜伽', '普拉提', '动感单车', 'HIIT', '泰拳', '蹦床'] },
        { icon: I.palette, t: '手作团建', items: ['陶艺', '香水调制', '皮具', '微景观', '手表组装', '花艺', '钩织'] },
        { icon: I.coffee, t: '品鉴体验', items: ['咖啡/茶品鉴', '咖啡师体验', '冰淇淋制作', '月饼烘焙', '品酒会'] },
        { icon: I.book, t: '财务讲座', items: ['LPA与遗嘱', 'CPF退休', '公司险×个人险', '保险你问我答', '传承规划'] },
        { icon: I.tent, t: '大型活动', items: ['家庭嘉年华', '慈善跑', '健康集市'] },
      ];

  const steps = en
    ? [
        { t: 'Tell me about your team', d: '20 minutes: headcount, budget, current cover.' },
        { t: 'Proposal in 1–3 days', d: 'Tailored design, premiums side by side.' },
        { t: 'Go live', d: 'Enrolment done for you; e-cards in the app.' },
        { t: 'Year-round support', d: 'Claims, renewals, WorkWell calendar.' },
      ]
    : [
        { t: '聊聊你的团队', d: '20分钟：人数、预算、现有福利。' },
        { t: '1–3个工作日出方案', d: '定制设计，保费并排对比。' },
        { t: '投保生效', d: '手续我来跑，电子卡进手机。' },
        { t: '全年陪跑', d: '理赔、续保、员工活动日历。' },
      ];

  return (
    <>
      <PageHero
        eyebrow={en ? 'Corporate' : '企业团险'}
        title={en ? 'Group insurance & employee benefits' : '企业团险与员工福利'}
        subtitle={
          en
            ? 'From 4-person startups to regional teams: coverage employees feel, claims HR loves, activities your team talks about.'
            : '从4人小团队到跨国企业:给员工看得见的保障、让HR省心的理赔、说得出口的员工活动。'
        }
        accent={I.heart}
      />
      <ContentLayer>
        <div className="container-wide py-16 md:py-20">
          {/* 为什么值得做 */}
          <div className="grid gap-6 md:grid-cols-3">
            {whys.map((w, i) => (
              <Reveal key={w.t} delay={i * 90}>
                <div className="card flex h-full items-start gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold-deep">
                    {w.icon}
                  </span>
                  <div>
                    <h2 className="text-base font-black text-navy">{w.t}</h2>
                    <p className="mt-1.5 text-[13px] leading-[1.8] text-mist">{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 信任数字带 */}
          <Reveal delay={100}>
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold/25 bg-gold/25 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.l} className="bg-navy px-5 py-6 text-center">
                  <p className="text-2xl font-black text-gold md:text-3xl">{s.v}</p>
                  <p className="mt-1 text-xs text-white/70">{s.l}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-right text-[11px] text-mist">
              {en ? 'AIA Singapore employee benefits, company data' : 'AIA新加坡员工福利业务数据'}
            </p>
          </Reveal>

          {/* 两大主力方案 */}
          <Reveal delay={120}>
            <div className="mt-14">
              <p className="eyebrow">{en ? 'Two flagship solutions' : '两大主力方案'}</p>
              <h2 className="mt-2 text-xl font-black leading-snug text-navy md:text-2xl">
                {en ? 'All-staff coverage, or high-end international medical' : '全员医疗打底，高端国际医疗拔高'}
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {plans.map((p) => (
                  <div
                    key={p.name}
                    className={`card h-full p-6 md:p-7 ${
                      p.color === 'gold' ? 'border-t-4 border-t-gold' : 'border-t-4 border-t-navy'
                    }`}
                  >
                    <span
                      className={`inline-block rounded-full border px-3.5 py-1 text-xs font-semibold ${
                        p.color === 'gold' ? 'border-gold/60 text-gold-deep' : 'border-navy/40 text-navy'
                      }`}
                    >
                      {p.tag}
                    </span>
                    <h3 className="mt-3.5 text-lg font-black text-navy md:text-xl">{p.name}</h3>
                    <p className="mt-0.5 text-sm text-gold-deep">{p.zhName}</p>

                    {/* 三格关键数据 */}
                    <div className="mt-5 grid grid-cols-3 gap-2.5">
                      {p.stats.map((st) => (
                        <div key={st.l} className={`rounded-xl px-3 py-3.5 text-center ${p.color === 'gold' ? 'bg-gold/10' : 'bg-navy/[0.06]'}`}>
                          <p className="text-lg font-black leading-tight text-navy">{st.v}</p>
                          <p className="text-[11px] font-semibold text-navy/70">{st.l}</p>
                          <p className="mt-1 text-[10.5px] leading-snug text-mist">{st.s}</p>
                        </div>
                      ))}
                    </div>

                    {/* 图标特性行 */}
                    <ul className="mt-5 space-y-3.5">
                      {p.feats.map((f) => (
                        <li key={f.t} className="flex items-start gap-3">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${p.color === 'gold' ? 'bg-gold/15 text-gold-deep' : 'bg-navy/[0.07] text-navy'}`}>
                            {f.icon}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-navy">{f.t}</p>
                            <p className="text-xs leading-relaxed text-mist">{f.s}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* 对比表 */}
          <Reveal delay={140}>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-gold/20 bg-white">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="bg-navy text-left text-white">
                    <th className="whitespace-nowrap px-5 py-3.5 font-medium">{en ? 'At a glance' : '一眼对比'}</th>
                    <th className="whitespace-nowrap px-5 py-3.5 font-medium">Flexi Vital Care Plus</th>
                    <th className="whitespace-nowrap px-5 py-3.5 font-medium">Premier International Medical</th>
                  </tr>
                </thead>
                <tbody>
                  {cmp.map((r, i) => (
                    <tr key={r.k} className={i % 2 ? 'bg-sand-50' : ''}>
                      <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-navy">{r.k}</td>
                      <td className="px-5 py-3.5 text-navy/80">{r.a}</td>
                      <td className="px-5 py-3.5 text-navy/80">{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* WorkWell */}
          <Reveal delay={160}>
            <div className="mt-16">
              <p className="eyebrow">WorkWell with AIA</p>
              <h2 className="mt-2 text-xl font-black leading-snug text-navy md:text-2xl">
                {en ? 'Employee wellness, sponsored' : '员工福利活动，我们来赞助'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-[1.9] text-mist">
                {en
                  ? 'Corporate clients get WorkWell with AIA: most activities complimentary, planned as an annual calendar for your team.'
                  : '成为团险客户后即可使用:大部分活动免费,我帮你排成一整年的员工活动日历。'}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {acts.map((g) => (
                  <div key={g.t} className="card h-full p-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
                        {g.icon}
                      </span>
                      <h3 className="text-[15px] font-bold text-navy">{g.t}</h3>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {g.items.map((it) => (
                        <span key={it} className="rounded-full bg-gold/10 px-3 py-1 text-xs leading-relaxed text-navy/80">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-mist">
                {en
                  ? 'Availability depends on team size and plan; some partner services at preferential rates (LPA, will writing); plus partner perks like citizen cancer screening slots and home-based children vaccination.'
                  : '活动视团队规模与方案而定;部分合作伙伴服务享优惠价(LPA认证、遗嘱服务),另有公民癌症筛查名额、儿童上门疫苗等伙伴福利。'}
              </p>
            </div>
          </Reveal>

          {/* 流程 */}
          <Reveal delay={180}>
            <div className="mt-16">
              <p className="eyebrow">{en ? 'How it works' : '合作流程'}</p>
              <h2 className="mt-2 text-xl font-black leading-snug text-navy md:text-2xl">
                {en ? 'From first chat to full coverage' : '从第一次沟通到全员保障'}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((s, i) => (
                  <div key={s.t} className="card h-full p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-[15px] font-bold text-navy">{s.t}</h3>
                    <p className="mt-1.5 text-[13px] leading-[1.8] text-mist">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={200}>
            <div className="card mt-14 flex flex-col items-start gap-5 border-gold/40 bg-gradient-to-br from-white to-sand-50 p-7 sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div>
                <p className="text-lg font-black text-navy">
                  {en ? 'Get a proposal for your team' : '给你的团队要一份方案'}
                </p>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-mist">
                  {en
                    ? 'Headcount + budget → tailored comparison in 1–3 working days. Renewing soon? Get a free review of your current plan.'
                    : '人数+预算 → 1–3个工作日拿到可并排对比的方案。现有团险快到期?顺便做一次免费方案复核。'}
                </p>
              </div>
              <Link
                href="/corporate/consult"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-deep"
              >
                {en ? 'Book a consultation' : '预约企业咨询'}
              </Link>
            </div>
          </Reveal>

          {/* 合规说明 */}
          <p className="mt-10 text-xs leading-[1.9] text-mist">
            {en
              ? 'The above is a summary for general reference only and does not form part of any insurance contract. All plans are underwritten by AIA Singapore Private Limited (Reg. No. 201106386R); applications are subject to underwriting and acceptance. Exact terms, conditions and exclusions are as per the policy contract. Premium indications are non-guaranteed. Policies are protected under the Policy Owners’ Protection Scheme administered by SDIC.'
              : '以上内容为一般参考摘要,不构成保险合同的一部分。所有计划由友邦新加坡私人有限公司承保(注册编号:201106386R),投保申请须经核保与受理;确切条款、条件与不保事项以保单合同为准,保费测算为非保证。保单受新加坡存款保险机构(SDIC)管理的保单持有人保障计划保护。'}
          </p>
        </div>
      </ContentLayer>
    </>
  );
}
