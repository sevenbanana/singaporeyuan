import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero, { ContentLayer } from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import NavyDecor from '@/components/NavyDecor';
import { Link } from '@/lib/routing';
import { Icon, HeroArt, WhyArt, type IconKey } from './icons';
import { Headcount, PlanLayers, ModuleStack, CoverageRings, PanelNetwork, ClaimsFlow } from './Diagrams';
import { LimitTiers, AwardStreak, CalendarWheel, type Month } from './Charts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'en' ? 'Corporate Employee Benefits' : '企业团险与员工福利' };
}

export default async function CorporatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === 'en';

  /* ── 为什么值得做 ── */
  const whys: { art: 'talent' | 'duty' | 'paperless'; t: string; d: string }[] = [
    { art: 'talent', t: en ? 'Attract & retain talent' : '引才留才', d: en ? 'The most cost-effective retention tool.' : '性价比最高的留人工具' },
    { art: 'duty', t: en ? 'Duty of care' : '雇主责任', d: en ? 'Covered when staff need it most.' : '员工出事时有体面应对' },
    { art: 'paperless', t: en ? 'Zero paperwork' : 'HR零纸质', d: en ? 'Claims in the app, HR admin online.' : '手机理赔，后台管账单' },
  ];

  /* ── 信任数字(AIA 新加坡官网,2026年10月查阅)── */
  const stats: { icon: IconKey; v: string; l: string }[] = en
    ? [
        { icon: 'clock', v: '50+', l: 'years in employee benefits' },
        { icon: 'team', v: '1.3m+', l: 'insured employees in SG' },
        { icon: 'headset', v: '300+', l: 'support staff' },
        { icon: 'medal', v: '20 yrs', l: 'Best Employee Insurance Gold' },
      ]
    : [
        { icon: 'clock', v: '50+', l: '年员工福利经验' },
        { icon: 'team', v: '130万+', l: '新加坡受保会员' },
        { icon: 'headset', v: '300+', l: '人服务团队' },
        { icon: 'medal', v: '20年', l: '连续最佳雇员保险金奖' },
      ];

  /* ── FVCP 亮点 ── */
  const fvcpTiles: { icon: IconKey; t: string; s: string }[] = en
    ? [
        { icon: 'globe', t: '24/7 worldwide', s: 'incl. teleconsultation' },
        { icon: 'tag', t: 'Portfolio pricing', s: 'claims don’t push up renewal' },
        { icon: 'clinic', t: 'Cashless clinics', s: 'GP & SP, meds delivered' },
        { icon: 'card', t: 'Pre-authorised', s: 'AIA settles the hospital bill' },
      ]
    : [
        { icon: 'globe', t: '全球 7×24', s: '含远程问诊' },
        { icon: 'tag', t: '组合定价', s: '理赔不直接推高续保' },
        { icon: 'clinic', t: '无现金诊所', s: '全科+专科，药品送上门' },
        { icon: 'card', t: '住院预授权', s: '友邦直接与医院结算' },
      ];

  /* ── PIM 年度限额五档(AIA 官方手册)── */
  const tiers = en
    ? [
        { v: 0.5, read: '500k', plan: 'Plan 1' },
        { v: 0.75, read: '750k', plan: 'Plan 2' },
        { v: 1, read: '1m', plan: 'Plan 3' },
        { v: 2, read: '2m', plan: 'Plan 4' },
        { v: 3.5, read: 'S$3.5m', plan: 'Plan 5', top: 'Highest' },
      ]
    : [
        { v: 0.5, read: '50万', plan: '第1档' },
        { v: 0.75, read: '75万', plan: '第2档' },
        { v: 1, read: '100万', plan: '第3档' },
        { v: 2, read: '200万', plan: '第4档' },
        { v: 3.5, read: '350万', plan: '第5档', top: '最高档' },
      ];

  const pimBenefits: { icon: IconKey; t: string }[] = en
    ? [
        { icon: 'steth', t: 'Outpatient' },
        { icon: 'tooth', t: 'Dental' },
        { icon: 'stroller', t: 'Maternity' },
        { icon: 'glasses', t: 'Optical' },
        { icon: 'pulse', t: 'Wellness' },
      ]
    : [
        { icon: 'steth', t: '门诊' },
        { icon: 'tooth', t: '牙科' },
        { icon: 'stroller', t: '孕产' },
        { icon: 'glasses', t: '眼科' },
        { icon: 'pulse', t: '体检' },
      ];

  /* ── 无现金就医 ── */
  const flow: { icon: IconKey; t: string; s: string }[] = en
    ? [
        { icon: 'phone', t: 'Show the e-card', s: 'Right in the app' },
        { icon: 'clinic', t: 'Visit a panel provider', s: 'Clinics, or pre-authorised hospital stay' },
        { icon: 'wallet', t: 'No upfront payment', s: 'No big bills to advance' },
        { icon: 'receipt', t: 'AIA settles directly', s: 'HR never touches paper claims' },
      ]
    : [
        { icon: 'phone', t: '手机出示电子卡', s: 'App 里一卡在手' },
        { icon: 'clinic', t: '合作网络就医', s: '门诊走合作诊所，住院先预授权' },
        { icon: 'wallet', t: '员工不用垫付', s: '不用先掏大额账单' },
        { icon: 'receipt', t: '友邦直接结算', s: 'HR 不碰纸质单据' },
      ];

  /* ── 一眼对比 ── */
  const cmp: { icon: IconKey; k: string; a: string; b: string }[] = en
    ? [
        { icon: 'team', k: 'Best for', a: 'SMEs covering all staff', b: 'Executives, expats, global teams' },
        { icon: 'user', k: 'Minimum lives', a: '5 (3 staff + 2 dependants)', b: '4 (3 staff + 1 dependant)' },
        { icon: 'shield', k: 'Annual limit', a: 'By module & plan', b: '500k – S$3.5m, five tiers' },
        { icon: 'globe', k: 'Coverage area', a: 'Worldwide, 24/7', b: 'Asia / WW ex-USA / Worldwide' },
        { icon: 'card', k: 'Cashless', a: 'Panel clinics + tele + pre-auth', b: 'Global guarantee letters + 7-market panel' },
        { icon: 'tag', k: 'Pricing', a: 'Portfolio pricing', b: 'Age-banded, per census' },
      ]
    : [
        { icon: 'team', k: '适合团队', a: '中小企业全员保障', b: '高管、外籍、跨国团队' },
        { icon: 'user', k: '起投人数', a: '5人（3员工+2家属）', b: '4人（3员工+1家属）' },
        { icon: 'shield', k: '年度限额', a: '按模块与档位', b: '50万–350万，五档' },
        { icon: 'globe', k: '保障范围', a: '全球 7×24', b: '亚洲 / 全球除美 / 全球' },
        { icon: 'card', k: '无现金', a: '合作诊所+远程问诊+预授权', b: '全球保函直赔+七地门诊网络' },
        { icon: 'tag', k: '定价方式', a: '组合定价', b: '按年龄段与名单报价' },
      ];

  /* ── WorkWell:一年示例日历 + 七类活动 ── */
  const months: Month[] = en
    ? [
        { m: 'Jan', icon: 'mic', cat: 'Health talk', t: 'Stress relief' },
        { m: 'Feb', icon: 'coffee', cat: 'Tasting', t: 'Coffee / tea' },
        { m: 'Mar', icon: 'steth', cat: 'Health check', t: 'Onsite screening' },
        { m: 'Apr', icon: 'run', cat: 'Fitness', t: 'Yoga' },
        { m: 'May', icon: 'book', cat: 'Financial', t: 'CPF & retirement' },
        { m: 'Jun', icon: 'palette', cat: 'Team craft', t: 'Pottery' },
        { m: 'Jul', icon: 'mic', cat: 'Health talk', t: 'Heart & diabetes' },
        { m: 'Aug', icon: 'run', cat: 'Fitness', t: 'HIIT' },
        { m: 'Sep', icon: 'coffee', cat: 'Tasting', t: 'Mooncake baking' },
        { m: 'Oct', icon: 'steth', cat: 'Health check', t: 'Cancer screening' },
        { m: 'Nov', icon: 'book', cat: 'Financial', t: 'LPA & wills' },
        { m: 'Dec', icon: 'tent', cat: 'Big day', t: 'Family carnival' },
      ]
    : [
        { m: '1月', icon: 'mic', cat: '健康讲座', t: '心理减压' },
        { m: '2月', icon: 'coffee', cat: '品鉴体验', t: '咖啡/茶品鉴' },
        { m: '3月', icon: 'steth', cat: '健康检测', t: '上门体检' },
        { m: '4月', icon: 'run', cat: '运动课程', t: '瑜伽' },
        { m: '5月', icon: 'book', cat: '财务讲座', t: 'CPF退休' },
        { m: '6月', icon: 'palette', cat: '手作团建', t: '陶艺' },
        { m: '7月', icon: 'mic', cat: '健康讲座', t: '心脏与三高' },
        { m: '8月', icon: 'run', cat: '运动课程', t: 'HIIT' },
        { m: '9月', icon: 'coffee', cat: '品鉴体验', t: '月饼烘焙' },
        { m: '10月', icon: 'steth', cat: '健康检测', t: '癌症筛查' },
        { m: '11月', icon: 'book', cat: '财务讲座', t: 'LPA与遗嘱' },
        { m: '12月', icon: 'tent', cat: '大型活动', t: '家庭嘉年华' },
      ];

  const acts: { icon: IconKey; t: string; items: string[] }[] = en
    ? [
        { icon: 'steth', t: 'Health checks', items: ['Onsite screening', 'Cancer screening', 'Spinal assessment', 'Eye check', 'Body composition', 'TCM consult'] },
        { icon: 'mic', t: 'Health talks', items: ['Cancer prevention', 'Breast / prostate', 'Heart & diabetes', 'Stress relief'] },
        { icon: 'run', t: 'Fitness', items: ['Yoga', 'Pilates', 'Spinning', 'HIIT', 'Muay Thai', 'Bounce'] },
        { icon: 'palette', t: 'Team crafts', items: ['Pottery', 'Perfume making', 'Leather craft', 'Terrarium', 'Watch assembly', 'Flower art', 'Crochet'] },
        { icon: 'coffee', t: 'Tasting', items: ['Coffee / tea', 'Barista', 'Ice-cream making', 'Mooncake baking', 'Wine'] },
        { icon: 'book', t: 'Financial wellness', items: ['LPA & wills', 'CPF & retirement', 'Company vs personal cover', 'Insurance AMA', 'Legacy planning'] },
        { icon: 'tent', t: 'Big days', items: ['Family carnival', 'Charity run', 'Wellness bazaar'] },
      ]
    : [
        { icon: 'steth', t: '健康检测', items: ['上门体检', '癌症筛查', '脊椎评估', '眼科检查', '体脂分析', '中医体质'] },
        { icon: 'mic', t: '健康讲座', items: ['癌症防治', '乳腺/前列腺', '心脏与三高', '心理减压'] },
        { icon: 'run', t: '运动课程', items: ['瑜伽', '普拉提', '动感单车', 'HIIT', '泰拳', '蹦床'] },
        { icon: 'palette', t: '手作团建', items: ['陶艺', '香水调制', '皮具', '微景观', '手表组装', '花艺', '钩织'] },
        { icon: 'coffee', t: '品鉴体验', items: ['咖啡/茶品鉴', '咖啡师体验', '冰淇淋制作', '月饼烘焙', '品酒会'] },
        { icon: 'book', t: '财务讲座', items: ['LPA与遗嘱', 'CPF退休', '公司险×个人险', '保险你问我答', '传承规划'] },
        { icon: 'tent', t: '大型活动', items: ['家庭嘉年华', '慈善跑', '健康集市'] },
      ];
  const actTotal = acts.reduce((n, g) => n + g.items.length, 0);

  /* ── 合作流程 ── */
  const steps: { icon: IconKey; t: string; chip: string }[] = en
    ? [
        { icon: 'chat', t: 'Tell me about your team', chip: '20 min' },
        { icon: 'compare', t: 'Side-by-side proposal', chip: '1–3 working days' },
        { icon: 'shield', t: 'Go live', chip: 'Enrolment done for you' },
        { icon: 'calendar', t: 'Year-round support', chip: 'Claims · renewal · WorkWell' },
      ]
    : [
        { icon: 'chat', t: '聊聊你的团队', chip: '20分钟' },
        { icon: 'compare', t: '方案并排对比', chip: '1–3个工作日' },
        { icon: 'shield', t: '投保生效', chip: '手续我来跑' },
        { icon: 'calendar', t: '全年陪跑', chip: '理赔·续保·活动' },
      ];

  const H2 = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-black leading-snug text-navy md:text-2xl">{title}</h2>
    </>
  );

  return (
    <>
      <PageHero
        eyebrow={en ? 'Corporate' : '企业团险'}
        title={en ? 'Group insurance & employee benefits' : '企业团险与员工福利'}
        subtitle={
          en
            ? 'From 4-person startups to regional teams: cover employees feel, claims HR loves, activities your team talks about.'
            : '从4人小团队到跨国企业：员工看得见的保障，HR省心的理赔，说得出口的员工活动。'
        }
        accent={<HeroArt className="h-full w-full" />}
      >
        <HeroArt className="mb-6 h-28 w-28 sm:hidden" />
        <div className="flex flex-wrap gap-2">
          {(en
            ? [
                { icon: 'team' as IconKey, t: 'From 4 lives' },
                { icon: 'card' as IconKey, t: 'Cashless care' },
                { icon: 'calendar' as IconKey, t: 'WorkWell activities' },
              ]
            : [
                { icon: 'team' as IconKey, t: '4人起投' },
                { icon: 'card' as IconKey, t: '无现金就医' },
                { icon: 'calendar' as IconKey, t: '全年员工活动' },
              ]
          ).map((c) => (
            <span key={c.t} className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-white/70 px-3.5 py-1.5 text-xs font-bold text-navy">
              <span className="text-gold-deep">
                <Icon k={c.icon} size={15} sw={2} />
              </span>
              {c.t}
            </span>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/corporate/consult" className="btn-primary">
            {en ? 'Book a consultation' : '预约企业咨询'}
          </Link>
          <a href="#plans" className="btn-ghost">
            {en ? 'See the plans' : '看两大方案'}
          </a>
        </div>
      </PageHero>

      <ContentLayer>
        <div className="container-wide py-14 md:py-20">
          {/* ═══ 为什么值得做:三张插画卡 ═══ */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {whys.map((w, i) => (
              <Reveal key={w.t} delay={i * 90}>
                <div className="card card-hover flex h-full flex-col items-center px-2.5 py-5 text-center sm:px-6 sm:py-8">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 sm:h-24 sm:w-24">
                    <WhyArt k={w.art} className="h-10 w-10 sm:h-14 sm:w-14" />
                  </span>
                  <h2 className="mt-3 text-[13px] font-black leading-snug text-navy sm:mt-5 sm:text-base">{w.t}</h2>
                  <p className="mt-1 text-[11px] leading-snug text-mist sm:text-[13px]">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ═══ 信任数字带 + 连续金奖 ═══ */}
          <Reveal delay={100}>
            <div className="relative mt-8 overflow-hidden rounded-3xl bg-navy px-5 py-7 md:px-10 md:py-9">
              <NavyDecor />
              <div className="relative grid grid-cols-2 gap-y-7 md:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.l} className="flex flex-col items-center text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <Icon k={s.icon} size={20} />
                    </span>
                    <CountUp value={s.v} className="mt-3 text-2xl font-black text-gold md:text-3xl" />
                    <p className="mt-1 text-xs text-white/70">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="relative mt-8 border-t border-white/10 pt-6">
                <AwardStreak
                  from={2006}
                  to={2025}
                  label={
                    en
                      ? 'HR Vendors of the Year · Best Employee Insurance Provider, Gold'
                      : 'HR Vendors of the Year · 最佳雇员保险供应商金奖'
                  }
                />
              </div>
            </div>
            <p className="mt-2 text-right text-[11px] text-mist">
              {en ? 'Source: AIA Singapore website, Oct 2026' : '数据来源：AIA新加坡官网（2026年10月）'}
            </p>
          </Reveal>

          {/* ═══ 两大主力方案:定位图 ═══ */}
          <section id="plans" className="scroll-mt-24 pt-16">
            <Reveal>
              <div className="text-center">
                <H2
                  eyebrow={en ? 'Two flagship solutions' : '两大主力方案'}
                  title={en ? 'All-staff cover as the base, international medical on top' : '全员医疗打底，高端国际医疗拔高'}
                />
              </div>
              <div className="mt-8">
                <PlanLayers en={en} />
              </div>
            </Reveal>

            {/* ── 方案一:FVCP ── */}
            <Reveal delay={80}>
              <div className="card mt-10 border-t-4 border-t-navy p-5 md:p-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="rounded-full border border-navy/40 px-3.5 py-1 text-xs font-semibold text-navy">
                    {en ? 'For SMEs · All staff' : '中小企业 · 全员医疗'}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-black text-navy md:text-xl">AIA Flexi Vital Care Plus</h3>
                <p className="text-sm text-gold-deep">{en ? 'Modular SME employee insurance' : '模块化中小企业团险'}</p>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-black text-navy">
                      <Icon k="compare" size={17} className="text-gold-deep" />
                      {en ? 'Build it like blocks' : '像搭积木一样配置'}
                    </p>
                    <ModuleStack en={en} />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="rounded-2xl bg-navy/[0.05] p-4">
                      <Headcount
                        total={en ? '5' : '5人'}
                        emp={3}
                        dep={2}
                        tone="navy"
                        label={en ? 'lives to start' : '起投'}
                        legend={en ? '3 employees + 2 dependants counts' : '3名员工 + 2名家属也可'}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {fvcpTiles.map((f) => (
                        <div key={f.t} className="rounded-xl border border-navy/10 bg-white/70 p-3.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-gold">
                            <Icon k={f.icon} size={18} />
                          </span>
                          <p className="mt-2.5 text-sm font-black text-navy">{f.t}</p>
                          <p className="mt-0.5 text-[11px] leading-snug text-mist">{f.s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── 方案二:PIM ── */}
            <Reveal delay={80}>
              <div className="card mt-6 border-t-4 border-t-gold p-5 md:p-8">
                <span className="inline-block rounded-full border border-gold/60 px-3.5 py-1 text-xs font-semibold text-gold-deep">
                  {en ? 'For executives · Global teams' : '高管与外籍人才 · 高端医疗'}
                </span>
                <h3 className="mt-3 text-lg font-black text-navy md:text-xl">AIA Premier International Medical</h3>
                <p className="text-sm text-gold-deep">{en ? 'High-end international medical (PIM)' : '友邦卓越国际医疗保险（PIM）'}</p>

                <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8">
                  {/* 限额柱状图 */}
                  <div className="rounded-2xl border border-gold/25 bg-white/60 p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-sm font-black text-navy">
                      <Icon k="shield" size={17} className="text-gold-deep" />
                      {en ? 'Annual limit · five tiers' : '年度总限额 · 五档可选'}
                    </p>
                    <div className="mt-12">
                      <LimitTiers
                        tiers={tiers}
                        note={
                          en
                            ? 'Per insured member, per policy year. Plans 1–4 in SGD or USD; Plan 5 in SGD only.'
                            : '每位受保人每保单年度；第1–4档可选新元或美元，第5档仅限新元。'
                        }
                      />
                    </div>
                  </div>
                  {/* 承保区域 */}
                  <div className="flex flex-col rounded-2xl border border-gold/25 bg-white/60 p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-sm font-black text-navy">
                      <Icon k="globe" size={17} className="text-gold-deep" />
                      {en ? 'Coverage area · pick one of three' : '承保区域 · 三选一'}
                    </p>
                    <div className="flex flex-1 items-center justify-center py-4">
                      <CoverageRings en={en} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.1fr_1fr] md:gap-5">
                  {/* 起投 + 既往症 */}
                  <div className="flex flex-col gap-3">
                    <div className="rounded-2xl bg-gold/10 p-4">
                      <Headcount
                        total={en ? '4' : '4人'}
                        emp={3}
                        dep={1}
                        tone="gold"
                        label={en ? 'lives to start' : '起投'}
                        legend={en ? '3 employees + 1 dependant counts' : '3名员工 + 1名家属也可'}
                      />
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-white/70 p-4">
                      <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full bg-navy text-gold">
                        <span className="text-sm font-black leading-none">11+</span>
                      </span>
                      <div>
                        <p className="text-sm font-black text-navy">{en ? 'Pre-existing conditions OK' : '既往症也能保'}</p>
                        <p className="text-[11px] leading-snug text-mist">
                          {en ? 'Groups of 11+ can opt to have medical history disregarded' : '11人以上团体可选“既往症不咎”核保'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* 门诊网络 */}
                  <div className="rounded-2xl border border-gold/25 bg-white/60 p-4">
                    <p className="flex items-center gap-2 text-sm font-black text-navy">
                      <Icon k="clinic" size={17} className="text-gold-deep" />
                      {en ? 'Outpatient panel · 7 markets' : '门诊网络 · 7个市场'}
                    </p>
                    <div className="mt-2">
                      <PanelNetwork en={en} />
                    </div>
                    <p className="text-[11px] text-mist">{en ? 'Inpatient: global guarantee letters' : '住院：全球保函直赔'}</p>
                  </div>
                  {/* 可选福利 */}
                  <div className="rounded-2xl border border-gold/25 bg-white/60 p-4">
                    <p className="flex items-center gap-2 text-sm font-black text-navy">
                      <Icon k="plus" size={17} className="text-gold-deep" />
                      {en ? 'Optional benefits · up to 5' : '可选福利 · 最多5项'}
                    </p>
                    <div className="mt-4 grid grid-cols-5 gap-1.5 md:grid-cols-3 md:gap-2.5">
                      {pimBenefits.map((b) => (
                        <div key={b.t} className="flex flex-col items-center">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                            <Icon k={b.icon} size={20} />
                          </span>
                          <span className="mt-1.5 text-[11px] font-bold text-navy">{b.t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-navy px-3 py-2.5 text-cream">
                      <Icon k="star" size={16} className="mt-0.5 shrink-0 text-gold" />
                      <p className="text-[11px] leading-snug">
                        {en ? '24/7 service centre · case management · mental health support' : '7×24专属中心 · 个案管理 · 心理健康'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ═══ 无现金就医流程 ═══ */}
          <Reveal delay={100}>
            <section className="pt-16">
              <H2
                eyebrow={en ? 'Cashless care' : '无现金就医'}
                title={en ? 'Seeing a doctor, without paying first' : '在合作网络看病，员工不用先垫钱'}
              />
              <div className="card mt-6 p-6 md:p-8">
                <ClaimsFlow steps={flow} />
              </div>
              <p className="mt-2 text-[11px] text-mist">
                {en ? 'Other claims are submitted in the app. Details per plan terms.' : '其余理赔在 App 线上提交；具体以方案条款为准。'}
              </p>
            </section>
          </Reveal>

          {/* ═══ 一眼对比 ═══ */}
          <Reveal delay={100}>
            <section className="pt-14">
              <H2 eyebrow={en ? 'At a glance' : '一眼对比'} title={en ? 'Which one fits your team?' : '哪一个更适合你的团队？'} />
              <div className="mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-white">
                <div className="grid grid-cols-2 sm:grid-cols-[170px_1fr_1fr]">
                  <div className="hidden bg-sand-50 sm:block" />
                  <div className="flex items-center gap-2 bg-navy px-4 py-3 text-[13px] font-bold text-white">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/80" />
                    Flexi Vital Care Plus
                  </div>
                  <div className="flex items-center gap-2 bg-gold-deep px-4 py-3 text-[13px] font-bold text-white">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/80" />
                    Premier Intl Medical
                  </div>
                </div>
                {cmp.map((r, i) => (
                  <div key={r.k} className={`grid grid-cols-2 sm:grid-cols-[170px_1fr_1fr] ${i % 2 ? 'bg-sand-50' : ''}`}>
                    <div className="col-span-2 flex items-center gap-2 px-4 pt-3 text-[13px] font-black text-navy sm:col-span-1 sm:py-3.5">
                      <span className="text-gold-deep">
                        <Icon k={r.icon} size={16} sw={2} />
                      </span>
                      {r.k}
                    </div>
                    <p className="px-4 pb-3 pt-1 text-[13px] leading-snug text-navy/80 sm:py-3.5">{r.a}</p>
                    <p className="border-l border-gold/20 px-4 pb-3 pt-1 text-[13px] leading-snug text-navy/80 sm:py-3.5">{r.b}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ═══ WorkWell ═══ */}
          <Reveal delay={100}>
            <section className="pt-16">
              <H2 eyebrow="WorkWell with AIA" title={en ? 'Employee wellness, sponsored' : '员工福利活动，我们来赞助'} />
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
                {en ? 'Most activities complimentary. I plan them into a year-round calendar.' : '大部分活动免费，我帮你排成一整年的员工日历。'}
              </p>

              <div className="mt-8 grid items-center gap-8 lg:grid-cols-[360px_1fr] lg:gap-10">
                <div className="min-w-0">
                  <CalendarWheel months={months} hint={en ? 'Sample annual activity calendar' : '一年活动示例日历'} />
                  <p className="mt-3 text-center text-[11px] text-mist">
                    {en ? 'Sample calendar · tap a month' : '示例日历 · 点一下月份看看'}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="mb-4 flex items-end gap-3">
                    <CountUp value={`${actTotal}`} className="text-4xl font-black leading-none text-gold-deep" />
                    <p className="pb-1 text-sm font-bold text-navy">
                      {en ? `activities across ${acts.length} categories` : `种活动可选 · ${acts.length} 大类`}
                    </p>
                  </div>
                  {/* 手机端横向滑动,平板以上两列网格 */}
                  <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                    {acts.map((g) => (
                      <div key={g.t} className="card w-[76%] shrink-0 snap-start p-4 sm:w-auto">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-gold">
                            <Icon k={g.icon} size={19} />
                          </span>
                          <h3 className="text-[15px] font-bold text-navy">{g.t}</h3>
                          <span className="ml-auto text-xs font-black tabular-nums text-gold-deep">{g.items.length}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {g.items.map((it) => (
                            <span key={it} className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11.5px] leading-relaxed text-navy/80">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-mist sm:hidden">{en ? 'Swipe for more →' : '左右滑动查看 →'}</p>
                </div>
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-mist">
                {en
                  ? 'Availability depends on team size and plan; some partner services at preferential rates (LPA, will writing); plus partner perks like citizen cancer screening slots and home-based children vaccination.'
                  : '活动视团队规模与方案而定；部分合作伙伴服务享优惠价（LPA认证、遗嘱服务），另有公民癌症筛查名额、儿童上门疫苗等伙伴福利。'}
              </p>
            </section>
          </Reveal>

          {/* ═══ 合作流程 ═══ */}
          <Reveal delay={100}>
            <section className="pt-16">
              <H2 eyebrow={en ? 'How it works' : '合作流程'} title={en ? 'From first chat to full coverage' : '从第一次沟通到全员保障'} />
              <ol className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {steps.map((s, i) => (
                  <li key={s.t} className="card relative overflow-hidden p-5">
                    <span aria-hidden className="pointer-events-none absolute -right-1 -top-3 select-none text-[4.5rem] font-black leading-none text-gold/10">
                      {i + 1}
                    </span>
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-gold">
                      <Icon k={s.icon} size={21} />
                    </span>
                    <h3 className="relative mt-4 text-[15px] font-black leading-snug text-navy">{s.t}</h3>
                    <span className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-bold text-gold-deep">
                      <Icon k="clock" size={12} sw={2.2} />
                      {s.chip}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          {/* ═══ CTA ═══ */}
          <Reveal delay={120}>
            <div className="relative mt-14 overflow-hidden rounded-3xl bg-navy p-7 md:p-10">
              <NavyDecor />
              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <HeroArt className="hidden h-28 w-28 shrink-0 sm:block" />
                <div className="flex-1">
                  <p className="text-xl font-black text-cream">{en ? 'Get a proposal for your team' : '给你的团队要一份方案'}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-cream/80">
                    <span className="rounded-full border border-cream/20 px-3 py-1">{en ? 'Headcount + budget' : '人数 + 预算'}</span>
                    <Icon k="arrow" size={14} className="text-gold" />
                    <span className="rounded-full border border-cream/20 px-3 py-1">{en ? 'Comparison in 1–3 days' : '1–3个工作日出对比'}</span>
                  </div>
                  <p className="mt-3 text-xs text-cream/60">
                    {en ? 'Renewing soon? Get a free review of your current plan.' : '现有团险快到期？顺便做一次免费方案复核。'}
                  </p>
                </div>
                <Link href="/corporate/consult" className="btn-gold shrink-0">
                  {en ? 'Book a consultation' : '预约企业咨询'}
                </Link>
              </div>
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
