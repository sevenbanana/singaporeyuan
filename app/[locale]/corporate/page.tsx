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
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconTeam = (
  <svg {...ic}>
    <circle cx="9" cy="8.5" r="3.1" />
    <path d="M3.5 20c.4-3.4 2.8-5.2 5.5-5.2s5.1 1.8 5.5 5.2" />
    <path d="M15.3 5.7a3.1 3.1 0 0 1 0 5.6M17.4 15c2 .7 3.3 2.3 3.6 5" />
  </svg>
);
const IconShield = (
  <svg {...ic}>
    <path d="m12 3 8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.5" />
  </svg>
);
const IconGlobe = (
  <svg {...ic}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.4 2.3 3.7 5.2 3.7 8.5s-1.3 6.2-3.7 8.5c-2.4-2.3-3.7-5.2-3.7-8.5s1.3-6.2 3.7-8.5z" />
  </svg>
);
const IconPhone = (
  <svg {...ic}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M10.5 5h3M11 18.5h2" />
  </svg>
);
const IconHeart = (
  <svg {...ic}>
    <path d="M12 20.3C7.2 16.5 3.5 13.2 3.5 9.2 3.5 6.4 5.6 4.5 8 4.5c1.6 0 3 .8 4 2.1 1-1.3 2.4-2.1 4-2.1 2.4 0 4.5 1.9 4.5 4.7 0 4-3.7 7.3-8.5 11.1z" />
  </svg>
);

export default async function CorporatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === 'en';

  // 为什么值得做
  const whys: { icon: ReactNode; t: string; d: string }[] = [
    {
      icon: IconTeam,
      t: en ? 'Attract & retain talent' : '引才留才的硬通货',
      d: en
        ? 'Today’s employees look beyond salary. A solid benefits programme is one of the most cost-effective retention tools.'
        : '今天的员工看的不只是工资。一份像样的医疗福利，是性价比最高的留人工具之一，招聘时也拿得出手。',
    },
    {
      icon: IconShield,
      t: en ? 'Duty of care, handled' : '雇主责任，兜住底',
      d: en
        ? 'From hospitalisation to outpatient care, the company is covered when employees need help the most.'
        : '员工住院、看诊、意外，公司有一套体面的应对。真出事的时候，团险就是雇主责任的底。',
    },
    {
      icon: IconPhone,
      t: en ? 'Digital claims, zero paperwork' : '数字化理赔，HR省心',
      d: en
        ? 'Employees submit claims on the AIA eBenefits app; HR manages members, bills and reports online. No paper forms.'
        : '员工用 AIA eBenefits 手机应用拍照提交理赔、随时查进度；HR 在后台管理名单、账单和报表，不用碰纸质表格。',
    },
  ];

  // 两大主力方案
  const plans = [
    {
      tag: en ? 'For SMEs · All staff' : '中小企业 · 全员医疗',
      name: 'AIA Flexi Vital Care Plus',
      zhName: en ? 'Flexible SME employee insurance' : '模块化中小企业团险',
      color: 'navy' as const,
      points: en
        ? [
            'Start with as few as 5 lives — built for SMEs',
            'Core plans (hospitalisation GHS / term life GTL) + optional outpatient GP & specialist, dental, critical illness and accident riders',
            'Portfolio pricing: individual claims do not directly push up your renewal premium',
            'Cashless panel GP & specialist clinics, plus teleconsultation with medication delivered',
            'Cashless hospital admission with pre-authorisation',
            'Employees & dependants can voluntarily top up their own coverage',
          ]
        : [
            '5人起投，为中小企业设计',
            '核心保障（住院GHS / 定期寿险GTL）自由组合，按需加装门诊全科+专科、牙科、重疾、意外附加险',
            '组合定价：个别员工的理赔不会直接推高公司续保保费',
            '合作诊所网络无现金看诊，含远程问诊、药品送上门',
            '住院预授权，出院不用垫付大额账单',
            '员工和家属可自愿加保升级，公司不用额外掏钱',
          ],
    },
    {
      tag: en ? 'For executives · Global teams' : '高管与外籍人才 · 高端医疗',
      name: 'AIA Premier International Medical',
      zhName: en ? 'High-end international medical (PIM)' : '友邦卓越国际医疗保险（PIM）',
      color: 'gold' as const,
      points: en
        ? [
            'Start from just 3 lives (or 2 employees + 1 dependant)',
            'Five plan tiers with annual limits from S$500k to S$3.5m',
            'Choose coverage area: Asia / Worldwide ex-USA / Worldwide',
            'Cashless hospitalisation globally via guarantee letters; panel outpatient networks across 7 markets',
            'Optional outpatient, dental, maternity, optical and wellness benefits',
            'Groups of 11+ may opt for “no questions asked” underwriting on pre-existing conditions',
            '24/7 dedicated service centre, personal case management and mental health support',
          ]
        : [
            '3人即可起投（2名员工+1名家属也行）',
            '年度限额五档：50万–350万新元/美元',
            '承保区域三选一：亚洲 / 全球（美国除外）/ 全球',
            '全球住院保函直赔；新加坡等7个市场的门诊网络无现金看诊',
            '可选门诊、牙科、孕产、眼科、健康体检福利',
            '11人及以上团体可选"既往症不咎"核保，带病也能保',
            '7×24专属服务中心 + 个案管理 + 心理健康支持',
          ],
    },
  ];

  // 对比表
  const cmp: { k: string; a: string; b: string }[] = en
    ? [
        { k: 'Best for', a: 'SMEs covering all staff', b: 'Executives, expats, global teams' },
        { k: 'Minimum lives', a: '5', b: '3 (or 2 employees + 1 dependant)' },
        { k: 'Annual limit', a: 'Tiered by module & plan', b: 'S$500k – S$3.5m, five tiers' },
        { k: 'Coverage area', a: 'Worldwide, 24/7', b: 'Asia / WW ex-USA / Worldwide' },
        { k: 'Cashless network', a: 'Panel GP & SP clinics + tele-consult + inpatient pre-auth', b: 'Global inpatient guarantee letters + regional outpatient panels' },
        { k: 'Pricing', a: 'Portfolio pricing, GST included', b: 'Age-banded, quoted per census' },
      ]
    : [
        { k: '适合团队', a: '中小企业全员保障', b: '高管、外籍员工、跨国团队' },
        { k: '起投人数', a: '5人', b: '3人（2员工+1家属也可）' },
        { k: '年度限额', a: '按模块和档位选择', b: '50万–350万新元/美元，五档' },
        { k: '保障范围', a: '全球7×24', b: '亚洲 / 全球除美 / 全球 三选一' },
        { k: '无现金网络', a: '合作诊所+远程问诊+住院预授权', b: '全球住院保函直赔+七地门诊网络' },
        { k: '定价方式', a: '组合定价，理赔不直接推高续保', b: '按年龄段与名单精准报价' },
      ];

  // WorkWell 活动菜单
  const acts: { t: string; items: string[] }[] = en
    ? [
        { t: 'Health checks', items: ['Basic health screening (onsite available)', 'Cancer screening', 'Spinal assessment', 'Eye screening', 'Body composition analysis', 'TCM wellness consult'] },
        { t: 'Health talks', items: ['Cancer prevention (oncologist-led)', 'Breast / prostate health', 'Heart health & diabetes', 'Mental wellness & stress relief'] },
        { t: 'Fitness classes', items: ['Yoga', 'Pilates', 'Spinning', 'HIIT', 'Muay Thai', 'Bounce'] },
        { t: 'Team crafts', items: ['Pottery', 'Perfume making', 'Leather crafting', 'Terrarium', 'Watch assembly', 'Flower arrangement', 'Crochet'] },
        { t: 'Tasting sessions', items: ['Coffee / tea tasting', 'Barista experience', 'Ice-cream making', 'Mooncake baking', 'Wine appreciation'] },
        { t: 'Financial wellness', items: ['LPA & wills talk (onsite certification)', 'CPF & retirement', 'How company insurance works with personal cover', 'Ask-me-anything on insurance', 'Legacy planning'] },
        { t: 'Big days', items: ['Family carnival', 'Charity run', 'Wellness bazaar'] },
      ]
    : [
        { t: '健康检测', items: ['基础体检（可安排上门）', '癌症筛查', '脊椎评估', '眼科检查', '体脂成分分析', '中医体质咨询'] },
        { t: '健康讲座', items: ['癌症防治（肿瘤科医生主讲）', '乳腺 / 前列腺健康', '心脏与三高、糖尿病', '心理健康与减压'] },
        { t: '运动课程', items: ['瑜伽', '普拉提', '动感单车', 'HIIT', '泰拳', '蹦床'] },
        { t: '手作团建', items: ['陶艺', '香水调制', '皮具制作', '微景观', '手表组装', '花艺', '钩织'] },
        { t: '品鉴体验', items: ['咖啡 / 茶品鉴', '咖啡师体验', '冰淇淋制作', '月饼烘焙', '品酒会'] },
        { t: '财务健康讲座', items: ['LPA与遗嘱（可现场办理认证）', 'CPF与退休规划', '公司保险与个人保险怎么配合', '保险你问我答', '传承规划'] },
        { t: '大型活动', items: ['家庭嘉年华', '慈善跑', '健康集市'] },
      ];

  // 服务流程
  const steps = en
    ? [
        { t: 'Tell me about your team', d: 'Headcount, budget, existing benefits — a 20-minute chat is enough to scope it.' },
        { t: 'Proposal in 1–3 working days', d: 'Tailored plan design with clear premium indications, side by side with your current cover.' },
        { t: 'Onboard & go live', d: 'Enrolment handled for you; employees get the eBenefits app and e-cards.' },
        { t: 'Year-round support', d: 'Claims follow-up, renewals, plus a WorkWell activity calendar for your team.' },
      ]
    : [
        { t: '聊聊你的团队', d: '人数、预算、现有福利——20分钟的沟通就够我摸清需求。' },
        { t: '1–3个工作日出方案', d: '定制保障设计+清晰的保费测算，可与现有方案并排对比。' },
        { t: '投保生效', d: '投保手续我来跑；员工开通 eBenefits 应用，电子卡直接进手机。' },
        { t: '全年陪跑', d: '理赔跟进、续保优化，再帮团队排一份 WorkWell 员工活动日历。' },
      ];

  return (
    <>
      <PageHero
        eyebrow={en ? 'Corporate' : '企业团险'}
        title={en ? 'Group insurance & employee benefits' : '企业团险与员工福利'}
        subtitle={
          en
            ? 'From 3-person startups to regional teams: medical coverage employees actually feel, digital claims HR actually likes, and wellness activities your team will talk about.'
            : '从3人小团队到跨国企业:给员工看得见的医疗保障、让HR省心的数字化理赔,再加一整年说得出口的员工福利活动。'
        }
        accent={IconHeart}
      />
      <ContentLayer>
        <div className="container-wide py-16 md:py-20">
          {/* 为什么值得做 */}
          <div className="grid gap-6 md:grid-cols-3">
            {whys.map((w, i) => (
              <Reveal key={w.t} delay={i * 90}>
                <div className="card h-full p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold-deep">
                    {w.icon}
                  </span>
                  <h2 className="mt-5 text-lg font-black text-navy">{w.t}</h2>
                  <p className="mt-2.5 text-sm leading-[1.9] text-mist">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 两大主力方案 */}
          <Reveal delay={120}>
            <div className="mt-16">
              <p className="eyebrow">{en ? 'Two flagship solutions' : '两大主力方案'}</p>
              <h2 className="mt-2 text-xl font-black leading-snug text-navy md:text-2xl">
                {en ? 'All-staff coverage, or high-end international medical' : '全员医疗打底，高端国际医疗拔高'}
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {plans.map((p) => (
                  <div
                    key={p.name}
                    className={`card h-full p-7 md:p-8 ${
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
                    <h3 className="mt-4 text-xl font-black text-navy">{p.name}</h3>
                    <p className="mt-1 text-sm text-gold-deep">{p.zhName}</p>
                    <ul className="mt-5 space-y-2.5">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex gap-2.5 text-sm leading-relaxed text-navy/80">
                          <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          <span>{pt}</span>
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
            <div className="mt-12 overflow-x-auto rounded-2xl border border-gold/20 bg-white">
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
                  ? 'Corporate clients get access to the WorkWell with AIA programme — many activities are complimentary, planned with you as an annual calendar covering physical, mental, financial and social wellbeing.'
                  : '成为团险客户后,即可使用 WorkWell with AIA 计划——围绕身体、心理、财务、社交四个健康维度,大部分活动免费,由我帮你排成一整年的员工活动日历。'}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {acts.map((g) => (
                  <div key={g.t} className="card h-full p-5">
                    <h3 className="text-[15px] font-bold text-navy">{g.t}</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {g.items.map((it) => (
                        <span
                          key={it}
                          className="rounded-full bg-gold/10 px-3 py-1 text-xs leading-relaxed text-navy/80"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-mist">
                {en
                  ? 'Activity availability depends on team size and plan; some partner services are chargeable at preferential rates (e.g. LPA certification, will writing).'
                  : '活动安排视团队规模与方案而定;部分合作伙伴服务以优惠价提供(如LPA认证、遗嘱服务),另有公民癌症筛查名额、儿童上门疫苗等伙伴福利。'}
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
                    <p className="mt-2 text-[13px] leading-[1.8] text-mist">{s.d}</p>
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
                    ? 'Send me your headcount and budget — a tailored comparison lands in your inbox within 1–3 working days.'
                    : '告诉我团队人数和预算,1–3个工作日内给你一份可以并排对比的定制方案。现有团险到期前来聊,还能顺便做一次免费体检式的方案复核。'}
                </p>
              </div>
              <Link
                href="/consult"
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
