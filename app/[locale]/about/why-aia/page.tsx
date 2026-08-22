import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PageHero, { ContentLayer } from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { Link } from '@/lib/routing';
import SectionArt from './SectionArt';
import BarChart from './Charts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === 'en';
  return {
    title: en ? 'How I judge an insurer' : '我怎么判断一家保险公司',
    description: en
      ? 'The six things I look at before trusting an insurer with a family, and what the public data says about AIA. Compiled by Yuan Yuan from public sources.'
      : '把一个家庭托付给一家保险公司之前，我会看六件事。这里也放了公开数据里的 AIA。由袁媛整理自公开资料，非 AIA 官方物料。',
  };
}

export default async function WhyAiaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === 'en';

  /* ── 六条判断标准(方法论前置)── */
  const criteria = [
    {
      k: 'capital',
      no: '01',
      name: en ? 'Capital' : '资本',
      line: en ? 'Enough financial base for a decades-long promise' : '有没有足够的财务基础，兜住几十年的承诺',
    },
    {
      k: 'claims',
      no: '02',
      name: en ? 'Claims' : '理赔',
      line: en ? 'Fast enough when it is actually needed' : '真正要用的时候，处理得快不快',
    },
    {
      k: 'doctor',
      no: '03',
      name: en ? 'Doctors' : '医疗端',
      line: en ? 'What doctors experience working with them' : '医生和它打交道的实际体验',
    },
    {
      k: 'client',
      no: '04',
      name: en ? 'Service' : '客户',
      line: en ? 'Service that holds up, and is recognised outside' : '服务撑不撑得住，有没有外部认可',
    },
    {
      k: 'profit',
      no: '05',
      name: en ? 'Business' : '经营',
      line: en ? 'Stable enough to keep investing for years' : '经营够不够稳，能不能一直投入',
    },
    {
      k: 'digital',
      no: '06',
      name: en ? 'Technology' : '科技',
      line: en ? 'Less waiting, less re-submitting, less chasing' : '少等待、少重复提交、少来回追',
    },
  ];

  const src = {
    aia: 'https://www.aia.com/content/dam/group-wise/en/docs/investor-relations/2026/AIA%20Group%202025%20Annual%20Results%20Ann%20%28Eng%29.pdf',
    mohIp: 'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/integrated-shield-plans/comparision-of-integrated-shield-plans',
    mohAbout: 'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/integrated-shield-plans/about-integrated-shield-plans/',
    sma: 'https://www.sma.org.sg/news/2023/June/SMA-Integrated-Shield-Plan-Providers-Ranking-Survey-2022',
    forrester: 'https://www.forrester.com/press-newsroom/forrester-apac-winner-customer-obsessed-enterprise-award-2025/',
    zaobao26: 'https://www.zaobao.com.sg/finance/singapore/story20260820-9546049',
    zaobao23: 'https://www.zaobao.com.sg/finance/singapore/story20230921-1435627',
    sbr: 'https://sbr.com.sg/co-written-partner/event-news/aia-singapore-secures-double-victory-singapore-business-review-technology-excellence-awards-2026',
  };

  const sectionCls = 'container-wide max-w-3xl border-t border-navy/10 pt-14 md:pt-16';
  const soWhatCls =
    'mt-5 rounded-2xl border-l-[3px] border-gold bg-gold/[0.07] px-5 py-4 text-[15px] leading-[1.9] text-navy';
  const scopeCls = 'mt-4 text-xs leading-[1.9] text-mist';
  const statGrid = 'mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4';

  const SourceLink = ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep no-underline hover:underline"
    >
      {label}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );

  const Head = ({ k, no, tag, title }: { k: string; no: string; tag: string; title: string }) => (
    <div className="flex items-start gap-4">
      <SectionArt k={k} className="mt-1 h-11 w-11 shrink-0" />
      <div>
        <p className="eyebrow">
          {no} · {tag}
        </p>
        <h2 className="mt-2 text-2xl font-black leading-snug text-navy md:text-[1.75rem]">{title}</h2>
      </div>
    </div>
  );

  return (
    <>
      <PageHero
        eyebrow={en ? 'About · my own judgement' : '关于我 · 我的判断'}
        title={
          en
            ? 'The six things I look at before trusting an insurer'
            : '我用这六件事，判断一家保险公司值不值得托付'
        }
        subtitle={
          en
            ? 'A policy can sit with a family for thirty years. So I do not start from products. I start from whether the company can still keep its promise decades later. Below is the checklist I use, and what the public data currently says about AIA.'
            : '一张保单可能陪一个家庭三十年。所以我不从产品看起，而是先看这家公司几十年后还兑不兑得了承诺。下面是我自己用的那张清单，以及公开数据里现在的 AIA。'
        }
        accent={<SectionArt k="capital" className="h-full w-full" />}
      />

      <ContentLayer>
        {/* ── 方法论前置 ── */}
        <section className="container-wide max-w-3xl pt-14 md:pt-20">
          <Reveal>
            <div className="card p-7 md:p-9">
              <span className="eyebrow">{en ? 'The checklist' : '我的清单'}</span>
              <h2 className="mt-3 text-xl font-black leading-snug text-navy md:text-2xl">
                {en
                  ? 'Six angles, none of them about products'
                  : '六个角度，没有一个是关于产品的'}
              </h2>
              <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {criteria.map((c) => (
                  <div key={c.k} className="flex items-start gap-3.5">
                    <SectionArt k={c.k} className="mt-0.5 h-9 w-9 shrink-0" />
                    <div>
                      <p className="text-[15px] font-bold text-navy">
                        <span className="mr-2 text-xs font-black tracking-widest text-gold-deep">
                          {c.no}
                        </span>
                        {c.name}
                      </p>
                      <p className="mt-1 text-sm leading-[1.8] text-mist">{c.line}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-gold/20 pt-5 text-sm leading-[1.9] text-navy/75">
                {en
                  ? 'The numbers below are all from public filings and regulators, each with a link back to the original. Where a figure is self-reported or a few years old, I say so on the spot.'
                  : '下面每个数字都来自公开披露或监管方，各自附了原文链接。凡是公司自报口径、或者调查年份较早的，我都在原处说明，不装成最新。'}
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── 01 资本 ── */}
        <section className={`${sectionCls} mt-14 md:mt-16`}>
          <Reveal>
            <Head
              k="capital"
              no="01"
              tag={en ? 'Capital' : '偿付能力'}
              title={en ? 'Enough capital behind a decades-long promise' : '先看有没有足够的资本，承担长期承诺'}
            />
            <div className={statGrid}>
              <div>
                <p className="text-3xl font-black text-gold-deep">221%</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">
                  {en ? 'Group shareholder capital ratio (target 200%+)' : '集团股东资本比率（目标 200%+）'}
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-navy">233%</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">
                  {en ? 'Group LCSM coverage ratio' : '集团 LCSM 偿付能力覆盖率'}
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-navy">US$10.97b</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">
                  {en ? 'Free surplus, end-2025' : '2025 年底自由盈余'}
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-navy">D-SII</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">
                  {en ? 'Domestic systemically important insurer' : '本地系统性重要保险公司'}
                </p>
              </div>
            </div>
            <p className={soWhatCls}>
              <b>{en ? 'So what: ' : '所以呢：'}</b>
              {en
                ? 'Capital is the buffer that pays claims in a bad year. A ratio comfortably above the target means the promise is not running on a thin margin.'
                : '资本就是缓冲垫。行情很差的那一年，还赔不赔得出来，靠的就是它。比率稳稳高于目标，意味着这份承诺不是踩着线在走。'}
            </p>
            <p className={scopeCls}>
              {en
                ? 'Group capital ratios are measured differently from the Singapore entity’s regulatory basis. D-SII status is designated by MAS and brings stricter capital and recovery-planning requirements. It is not a government guarantee.'
                : '集团资本比率与新加坡实体的监管口径不同。D-SII 由新加坡金管局认定，意味着须接受更严格的资本与恢复规划要求，并不代表政府担保。'}
            </p>
            <SourceLink href={src.aia} label={en ? 'AIA Group 2025 Annual Results' : 'AIA 集团 2025 年报原文'} />
          </Reveal>
        </section>

        {/* ── 02 理赔 ── */}
        <section className={`${sectionCls} mt-14 md:mt-16`}>
          <Reveal>
            <Head
              k="claims"
              no="02"
              tag={en ? 'Claims speed · MOH 2026 Q2' : '理赔速度 · 卫生部 2026 Q2'}
              title={en ? 'Among the fastest tier in the industry' : '处于行业最快的一档'}
            />
            <p className="mt-5 text-[15px] leading-[1.95] text-navy/80">
              {en
                ? 'This is MOH’s published processing time, not a satisfaction score. It covers Integrated Shield main-plan claims that were paid; riders are excluded.'
                : '这是卫生部公开的实际处理时长，不是客户印象分。统计只涵盖有正向赔付的住院险（IP）主险理赔，不包括附加险。'}
            </p>
            <BarChart
              max={7}
              axis={['0', '2', '4', '6', '7 ' + (en ? 'days' : '天')]}
              rows={[
                {
                  label: en ? 'AIA · 75% of claims done within' : 'AIA · 75% 的理赔完成于',
                  value: 1,
                  read: en ? '1 day' : '1 天',
                },
                {
                  label: en ? 'Industry median' : '行业中位',
                  value: 1,
                  read: en ? '1 day' : '1 天',
                  tone: 'mist',
                  note: en
                    ? 'Four of the seven IP insurers are also at 1 day.'
                    : '七家住院险公司里，有四家同样做到 1 天。',
                },
                {
                  label: en ? 'Slowest in the table' : '表中最慢的一家',
                  value: 7,
                  read: en ? '7 days' : '7 天',
                  tone: 'mist',
                },
              ]}
              caption={
                en
                  ? 'Same for pre-authorisation: 50% same day, 75% within one working day. AIA also accepts submissions through app, web and phone, the widest set of channels in MOH’s table.'
                  : '预授权同样：50% 当天完成、75% 一个工作日内完成。AIA 同时支持 App、网站和电话申请，是卫生部表格中申请渠道最完整的一家。'
              }
            />
            <p className={soWhatCls}>
              <b>{en ? 'So what: ' : '所以呢：'}</b>
              {en
                ? 'It means you usually know whether the bill is covered within a day of submitting. Not next month, and not after three rounds of chasing.'
                : '意思是：出院后提交，通常一天之内就知道赔不赔，而不是等到下个月，也不用来回追三轮。'}
            </p>
            <SourceLink href={src.mohIp} label={en ? 'MOH · Comparison of Integrated Shield Plans' : '卫生部 · 住院险计划对照表'} />
          </Reveal>
        </section>

        {/* ── 03 医疗端 ── */}
        <section className={`${sectionCls} mt-14 md:mt-16`}>
          <Reveal>
            <Head
              k="doctor"
              no="03"
              tag={en ? 'Doctors · SMA survey 2022' : '医生口碑 · 医药协会 2022 年调查'}
              title={
                en
                  ? 'Highest rated in the last comparable survey (2022)'
                  : '最后一次同口径调查里评分最高（2022 年）'
              }
            />
            <p className="mt-5 text-[15px] leading-[1.95] text-navy/80">
              {en
                ? 'The Singapore Medical Association asked doctors about working with each insurer: pre-authorisation, payment, panel terms and fee benchmarks. The survey covers 2022 experience and was published in 2023; SMA has not released a comparable ranking since, so I keep the year on the label instead of dressing it up as current.'
                : '新加坡医药协会调查的是医生与各家保险公司合作的体验：预授权、赔付、医生团与收费标准。这份调查反映的是 2022 年度体验、2023 年发布；此后医药协会没有再发布同口径排名，所以我保留年份，不把旧调查包装成最新排名。'}
            </p>
            <BarChart
              max={5}
              axis={['0', '1', '2', '3', '4', '5']}
              rows={[
                {
                  label: en ? 'AIA · overall rating' : 'AIA · 整体评分',
                  value: 3.86,
                  read: '3.86 / 5',
                },
                {
                  label: en ? 'The other six insurers' : '其余六家的区间',
                  from: 1.74,
                  to: 3.27,
                  read: '1.74 – 3.27',
                  tone: 'mist',
                  note: en
                    ? 'AIA ranked first on eight of the nine indicators, including willingness to recommend.'
                    : '九项指标中 AIA 有八项排名第一，其中包括推荐给亲友的意愿这一项。',
                },
              ]}
            />
            <div className="mt-6 rounded-2xl border border-navy/10 bg-sand-50 p-5">
              <p className="text-sm leading-[1.9] text-navy/80">
                {en ? (
                  <>
                    Panel size has kept growing since: <b className="text-navy">594 → 684</b> private
                    specialists between 2024 and 2025 (105 joined, 15 left).
                  </>
                ) : (
                  <>
                    医生团人数此后仍在增长：2024 年 <b className="text-navy">594 名</b> → 2025 年{' '}
                    <b className="text-navy">684 名</b> 私人专科医生（105 名加入，15 名离开）。
                  </>
                )}
              </p>
            </div>
            <p className={soWhatCls}>
              <b>{en ? 'So what: ' : '所以呢：'}</b>
              {en
                ? 'You never deal with the insurer alone. Your doctor’s clinic does too. When that side runs smoothly, pre-authorisation and cashless admission are far less painful for you.'
                : '你不是一个人在和保险公司打交道，你的主治医生那边也在打。医疗端顺畅，你的事前授权和免垫付住院才会顺。'}
            </p>
            <SourceLink href={src.sma} label={en ? 'SMA · IP Providers Ranking Survey 2022' : '医药协会 · 2022 年住院险公司排名调查'} />
          </Reveal>
        </section>

        {/* ── 04 客户 ── */}
        <section className={`${sectionCls} mt-14 md:mt-16`}>
          <Reveal>
            <Head
              k="client"
              no="04"
              tag={en ? 'Service · Forrester 2025' : '客户口碑 · Forrester 2025'}
              title={en ? 'Recognised by an independent APAC award' : '服务体验获得亚太区独立机构认可'}
            />
            <p className="mt-5 text-[15px] leading-[1.95] text-navy/80">
              {en
                ? 'Forrester named AIA a winner of its 2025 APAC Customer-Obsessed Enterprise Award, citing customer-experience transformation across 18 markets.'
                : 'Forrester 将 AIA 评为 2025 年亚太区以客户为中心企业奖得主，认可其横跨 18 个市场的客户体验转型。'}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { v: '98%', l: en ? 'Contact-centre satisfaction' : '联络中心客户满意度' },
                { v: en ? '7 markets' : '7 个市场', l: en ? 'Ranked first on NPS' : 'NPS 净推荐值排名第一' },
                { v: '88%', l: en ? 'Processes completed within a day' : '流程一天内完成' },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-navy/10 bg-sand-50 p-5">
                  <p className="text-2xl font-black text-navy">{s.v}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-mist">{s.l}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-gold-deep">
                    {en ? 'Group self-reported' : '集团自报口径'}
                  </p>
                </div>
              ))}
            </div>
            <p className={scopeCls}>
              {en
                ? 'These three figures were submitted by AIA to Forrester at group level as at December 2024, and do not come from the Singapore market alone. The award itself is judged by Forrester.'
                : '以上三个数字是 AIA 向 Forrester 提交的集团级成果，截至 2024 年 12 月，并非全部仅来自新加坡市场；奖项由 Forrester 评选。'}
            </p>
            <SourceLink href={src.forrester} label={en ? 'Forrester · Award announcement' : 'Forrester · 奖项说明'} />
          </Reveal>
        </section>

        {/* ── 05 经营 ── */}
        <section className={`${sectionCls} mt-14 md:mt-16`}>
          <Reveal>
            <Head
              k="profit"
              no="05"
              tag={en ? 'Business · 2025 & H1 2026' : '经营能力 · 2025 与 2026 上半年'}
              title={en ? 'Singapore keeps growing; group profit at a new high' : '新加坡业务持续增长，集团盈利创下新高'}
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-navy/10 bg-sand-50 p-6">
                <p className="eyebrow">{en ? 'AIA Singapore' : 'AIA 新加坡'}</p>
                <p className="mt-3 text-3xl font-black text-gold-deep">US$530m</p>
                <p className="mt-1 text-xs text-mist">
                  {en ? 'New business value, 2025 · +14% YoY' : '2025 年新业务价值 · 同比 +14%'}
                </p>
                <p className="mt-4 text-sm leading-[1.9] text-navy/75">
                  {en
                    ? 'H1 2026: about S$375m of new business value, +10%; total weighted premium income +17%.'
                    : '2026 上半年：新业务价值约 S$3.75 亿、+10%；总加权保费收入 +17%。'}
                </p>
              </div>
              <div className="rounded-2xl border border-navy/10 bg-sand-50 p-6">
                <p className="eyebrow">{en ? 'AIA Group' : 'AIA 集团'}</p>
                <p className="mt-3 text-3xl font-black text-navy">US$7.136b</p>
                <p className="mt-1 text-xs text-mist">
                  {en ? 'Operating profit after tax, 2025 · +12% per share' : '2025 年税后营业利润 · 每股同比 +12%'}
                </p>
                <p className="mt-4 text-sm leading-[1.9] text-navy/75">
                  {en
                    ? 'Operating return on equity 15.5%, up 0.7 percentage points.'
                    : '营业股本回报率 15.5%，同比提升 0.7 个百分点。'}
                </p>
              </div>
            </div>
            <p className={soWhatCls}>
              <b>{en ? 'So what: ' : '所以呢：'}</b>
              {en
                ? 'Profit is what pays for the next ten years of service, systems and people. It says nothing about the return on your own policy. Those are two different things.'
                : '盈利买的是未来十年还投不投得起服务、系统和人。它和你保单本身的回报是两回事，别混为一谈。'}
            </p>
            <div className="flex flex-wrap gap-x-6">
              <SourceLink href={src.aia} label={en ? 'AIA Group 2025 results' : 'AIA 集团 2025 年报'} />
              <SourceLink href={src.zaobao26} label={en ? 'Lianhe Zaobao · H1 2026' : '联合早报 · 2026 上半年业绩'} />
            </div>
          </Reveal>
        </section>

        {/* ── 06 数码化 ── */}
        <section className={`${sectionCls} mt-14 md:mt-16`}>
          <Reveal>
            <Head
              k="digital"
              no="06"
              tag={en ? 'Technology · 2025' : '数码化 · 2025'}
              title={en ? 'Fewer steps that depend on a human passing paper along' : '申请、核保、理赔，越来越少依赖人工流转'}
            />
            <div className={statGrid}>
              {[
                { v: '83%', l: en ? 'Underwriting decisions automated' : '核保决定自动化' },
                { v: '75%', l: en ? 'Claims auto-adjudicated' : '理赔自动审核' },
                { v: '95%', l: en ? 'Transactions submitted digitally' : '交易以数码方式提交' },
                { v: '93%', l: en ? 'Service requests done within a day' : '服务请求一天内完成' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl font-black text-navy">{s.v}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mist">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-navy/10 bg-sand-50 p-5">
              <p className="text-sm font-bold text-navy">AIA+ Singapore</p>
              <p className="mt-2 text-sm leading-[1.9] text-navy/75">
                {en
                  ? '1.3m+ registered users, 350k+ monthly actives, 4.7 / 5 app-store rating (as at December 2025). One app for both personal and company policies.'
                  : '130 万+ 注册用户、35 万+ 月活跃用户、应用商店评分 4.7 / 5（截至 2025 年 12 月）。个人保单和公司团险在同一个 App 里管理。'}
              </p>
              <p className="mt-3 text-xs leading-[1.9] text-mist">
                {en
                  ? 'Ratings differ between the App Store and Google Play and change over time; treat the number as at the date shown and check the store for the current figure.'
                  : 'App Store 与 Google Play 的评分不同，且会随时间变化；此处为上述时点的数字，实时评分以应用商店当期显示为准。'}
              </p>
            </div>
            <SourceLink href={src.sbr} label={en ? 'Singapore Business Review · AIA+' : 'Singapore Business Review · AIA+ 数据'} />
          </Reveal>
        </section>

        {/* ── 我自己的记录 ── */}
        <section className={`${sectionCls} mt-14 md:mt-16`}>
          <Reveal>
            <Head
              k="mine"
              no="07"
              tag={en ? 'And my own record' : '还有我自己的记录'}
              title={en ? 'Company data is only half of it' : '公司的数据只是一半'}
            />
            <p className="mt-5 text-[15px] leading-[1.95] text-navy/80">
              {en
                ? 'The other half is whether someone walks the claim with you. This is my own record, not the company’s.'
                : '另一半是：真出事那天，有没有人陪你把理赔走完。下面是我自己的记录，不是公司的。'}
            </p>
            <div className={statGrid}>
              {[
                { v: '73', l: en ? 'Families served' : '服务家庭' },
                { v: '254', l: en ? 'Claims approved' : '理赔获批' },
                { v: 'S$215.4K', l: en ? 'Claims paid out' : '已赔付金额' },
                { v: 'S$22.1M', l: en ? 'Life coverage arranged' : '人寿保障总额' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl font-black text-gold-deep">{s.v}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mist">{s.l}</p>
                </div>
              ))}
            </div>
            <p className={scopeCls}>
              {en
                ? 'Figures as at June 2026, from my own AIA adviser records.'
                : '数据截至 2026 年 6 月，来自我自己的 AIA 顾问后台记录。'}
            </p>
          </Reveal>
        </section>

        {/* ── 诚实的一段 ── */}
        <section className="container-wide max-w-3xl pt-14 md:pt-16">
          <Reveal>
            <div className="rounded-3xl border border-gold/40 bg-gold/[0.06] p-7 md:p-9">
              <span className="eyebrow">{en ? 'The honest part' : '也说句实话'}</span>
              <h2 className="mt-3 text-xl font-black leading-snug text-navy md:text-2xl">
                {en ? 'AIA is not the right answer for everyone' : 'AIA 不是每个人的最优解'}
              </h2>
              <ul className="mt-5 space-y-3.5 text-[15px] leading-[1.9] text-navy/80">
                <li className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {en
                    ? 'On price alone, another insurer is sometimes cheaper for the same ward class. If budget is the binding constraint, that matters more than any ranking.'
                    : '单看价格，同样的病房等级，有时候别家更便宜。如果预算是硬约束，这件事比任何排名都重要。'}
                </li>
                <li className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {en
                    ? 'With certain pre-existing conditions, underwriting outcomes differ a lot between insurers. Whoever will actually cover you wins.'
                    : '有某些既往病史时，各家的核保结果差别很大。谁愿意保你，谁就是那个答案。'}
                </li>
                <li className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {en
                    ? 'If your specialist is not on the panel, the calculation changes. The network matters more than the brand.'
                    : '如果你固定看的专科医生不在医生团名单里，这笔账要重算。网络比品牌重要。'}
                </li>
              </ul>
              <p className="mt-6 border-t border-gold/25 pt-5 text-[15px] leading-[1.9] text-navy/80">
                {en
                  ? 'So this page is not telling you to buy AIA. It is showing you how I check a company, so you can check mine the same way, and anyone else’s too.'
                  : '所以这页不是要你买 AIA。它讲的是我怎么查一家公司，你可以用同一套标准来查我，也去查别人。'}
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── 自助路径 + CTA ── */}
        <section className="container-wide max-w-3xl pt-14 md:pt-16">
          <Reveal>
            <h2 className="text-xl font-black leading-snug text-navy md:text-2xl">
              {en ? 'Rather look around on your own first?' : '想先自己看看？'}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  href: '/guides/healthcare.html',
                  t: en ? 'Healthcare guide' : '新加坡就医指南',
                  d: en ? 'Where to go, what it costs' : '该去哪看、要花多少钱',
                },
                {
                  href: '/proposals/quote.html',
                  t: en ? 'Hospital cover calculator' : '住院险测算',
                  d: en ? 'Price your family in a few clicks' : '给全家算一次保费',
                },
                {
                  href: '/guides/wealth-across-cycles.html',
                  t: en ? 'Wealth beyond cycles' : '让家庭财富穿越周期',
                  d: en ? 'A scrollable story on investing' : '一页滚动读完的投资逻辑',
                },
              ].map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className="card card-hover group flex flex-col p-5 no-underline"
                >
                  <p className="text-[15px] font-bold leading-snug text-navy">{c.t}</p>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-mist">{c.d}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep">
                    {en ? 'Open' : '打开'}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start gap-4 rounded-3xl bg-navy p-7 text-cream sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div>
                <p className="text-lg font-black">
                  {en ? 'Or just tell me your situation' : '或者，直接说说你的情况'}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-cream/75">
                  {en
                    ? 'First conversation is free, and I start by reviewing what you already have.'
                    : '第一次沟通免费，我会先帮你梳理已经有的保障。'}
                </p>
              </div>
              <Link
                href="/consult"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-navy no-underline transition-transform duration-300 hover:-translate-y-0.5"
              >
                {en ? 'Book a chat' : '预约沟通'}
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── 来源 + 署名 ── */}
        <section className="container-wide max-w-3xl py-14 md:py-20">
          <Reveal>
            <div className="border-t border-navy/10 pt-10">
              <span className="eyebrow">{en ? 'Sources' : '资料来源'}</span>
              <p className="mt-2 text-sm text-mist">
                {en ? 'Every figure can be traced back to the original.' : '每个数字都可以回到原文核实。'}
              </p>
              <ul className="mt-5 grid gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
                {[
                  [src.aia, en ? 'AIA Group 2025 Annual Results' : 'AIA 集团 2025 年报'],
                  [src.mohIp, en ? 'MOH · IP plan comparison' : '卫生部 · 住院险计划对照'],
                  [src.mohAbout, en ? 'MOH · About Integrated Shield Plans' : '卫生部 · 住院险说明'],
                  [src.sma, en ? 'SMA · IP ranking survey 2022' : '医药协会 · 2022 年调查'],
                  [src.forrester, en ? 'Forrester · APAC award 2025' : 'Forrester · 2025 亚太奖项'],
                  [src.zaobao26, en ? 'Lianhe Zaobao · H1 2026 results' : '联合早报 · 2026 上半年业绩'],
                  [src.zaobao23, en ? 'Lianhe Zaobao · D-SII designation' : '联合早报 · D-SII 认定'],
                  [src.sbr, en ? 'Singapore Business Review · AIA+' : 'Singapore Business Review · AIA+'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy/75 no-underline hover:text-gold-deep"
                    >
                      {label} ↗
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-navy/10 bg-sand-50 p-6 text-xs leading-[1.95] text-mist">
                <p className="text-sm font-bold text-navy">
                  {en ? 'Yuan Yuan · AIA Singapore representative' : '袁媛 Yuan Yuan · AIA Singapore 代表'}
                </p>
                <p className="mt-1 text-sm text-navy/70">RNF No. YY-300823216</p>
                <p className="mt-4">
                  {en
                    ? 'This page was compiled by me from publicly available sources and reflects my own view as an adviser. It is not an official AIA publication, and it is not an offer, recommendation or advice on any product.'
                    : '本页由本人整理自公开资料，仅代表我个人作为顾问的观点，非 AIA 官方发布物料，也不构成任何产品的要约、推荐或建议。'}
                </p>
                <p className="mt-3">
                  {en
                    ? 'Figures are as at the dates stated (data compiled to August 2026). Cover, claims and service are subject to the policy contract and the insurer’s prevailing arrangements. Every family’s budget, health and existing cover differ, so please make decisions after a full needs analysis.'
                    : '各项数字以文中标注的时点为准（资料整理至 2026 年 8 月）。保障、理赔与服务以正式保单条款及保险公司最新安排为准。每个家庭的预算、健康状况与既有保障都不同，请在完整需求分析之后再做决定。'}
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </ContentLayer>
    </>
  );
}
