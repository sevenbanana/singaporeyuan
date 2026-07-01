// 案例库数据源（中文）。详情页与列表页、首页旅程地图均从此读取。
// 口吻：脱敏整理 · 金额以 * 占位 · 遵循 MAS MoneySense「先保障、后增值、量入为出」。
// 收益非保证部分均注明「以正式保单文件为准」。

// 保障六边形的 6 个维度，按围绕六边形的顺序排列：
// 住院 / 意外 / 重疾 相邻（基础地基），人寿 / 重残 / 残护 随人生阶段补全。
import { CASES_EN, HEX_AXES_EN, DISCLAIMERS_EN } from './casesEn';

export const HEX_AXES = ['住院', '意外', '重疾', '人寿', '重残', '残护'] as const;
export type HexAxis = (typeof HEX_AXES)[number];

// 每个维度取值 0–3：0 = 无 · 1 = 起步/可选 · 2 = 基础 · 3 = 充足
export type HexLevels = [number, number, number, number, number, number];

export type ProfileCard = { icon: string; title: string; items: string[] };
export type Stat = { label: string; value: string; sub?: string };
export type SolutionTable = { head: string[]; rows: string[][] };
export type PlanBenefit = { b: string; s: string };
export type PlanBlock = { no: string; name: string; tagline: string; price: string; sumLabel: string; sum: string; benefits: PlanBenefit[] };

export type CaseDetail = {
  slug: string;
  // —— 旅程地图 / 人物 ——
  age: number;
  gender: 'male' | 'female';
  mapLabel: string; // 地图上的标签，如「25 岁 · 初来新加坡」
  stageIcon: string; // 背景里程碑图标 key
  theme: string; // 一句话主题
  icon: string; // 列表/卡片图标 key
  // —— 封面 ——
  eyebrow: string;
  tag: string;
  title: string; // 钩子标题
  titleHi?: string; // 标题中高亮的部分（在 title 内出现）
  lead: string;
  pills: string[];
  // —— 保障六边形 ——
  hexBefore: HexLevels;
  hexAfter: HexLevels;
  hexBeforeLabel: string;
  hexAfterLabel: string;
  hexNote: string;
  // —— 01 客户画像 ——
  profile: ProfileCard[];
  // —— 02 需求分析 ——
  analysisTitle: string;
  analysis: string[];
  quote?: string;
  // —— 03 方案 ——
  solutionEyebrow: string;
  solutionTitle: string;
  solutionLead: string;
  meta: Stat[];
  table?: SolutionTable;
  plans?: PlanBlock[]; // 详细保障清单(可选,如 first-job)
  // —— 数据卡 ——
  dataChips: Stat[];
};

export const CASES: CaseDetail[] = [
  // ───────────────────────── 1. 25 初入职场 ─────────────────────────
  {
    slug: 'first-job',
    age: 25,
    gender: 'male',
    mapLabel: '25 岁 · 初来新加坡',
    stageIcon: 'family',
    theme: '打好保障地基',
    icon: 'seedling',
    eyebrow: '客户案例 · 仅供方案说明',
    tag: 'CASE · 初入职场 · 打好保障地基',
    title: '刚工作不久、预算有限，第一份保障该怎么搭？',
    titleHi: '第一份保障该怎么搭？',
    lead: '收入不错但储蓄还薄，最怕「一场病或一次意外打乱节奏」。他不需要复杂的产品，只需要用不超过收入 15% 的预算，先把最基础的底兜住——这恰恰是 MoneySense 对这个年龄段的建议。',
    pills: ['EP 持有者', '科技大厂', '年收入约 S$60,000', '单身无负担', '应急金优先'],
    hexBefore: [0, 0, 0, 0, 0, 0],
    hexAfter: [3, 3, 2, 0, 0, 0],
    hexBeforeLabel: '配置前 · 几乎裸奔',
    hexAfterLabel: '配置后 · 亮起三个角',
    hexNote:
      '25 岁单身、无被赡养人、无负债，人寿 / 重残 / 残护这三块先不配——不是不重要，而是「时机未到、需求未起」。它们会随人生阶段一块块补上：买房时补人寿，成家生子时人寿/重残加保，年长后再补长期护理。这就是六边形从一个角开始、慢慢补全的逻辑。',
    profile: [
      { icon: '💼', title: '资产现状', items: ['工作 1 年余，储蓄不多', '正在建立 3–6 个月开支的应急金', '无房无车无贷'] },
      { icon: '😟', title: '他的困扰', items: ['公司团体医疗离职即失效', '对保险一窍不通、怕被推销', '不想保费占用太多现金流'] },
      { icon: '🛡️', title: '已有保障', items: ['公司团体医疗（基础）✓', '个人保单 全无 ✕'] },
      { icon: '🎯', title: '核心诉求', items: ['用有限预算兜住健康/意外底线', '地基要跟人走、保终身', '保费别压现金流'] },
    ],
    analysisTitle: '这个阶段，最划算的「投资」是健康',
    analysis: [
      'MoneySense 对 19–29 岁的建议很清晰：先建立应急基金，再用不超过收入 15% 的预算配置保障。',
      '这一阶段最划算的「投资」，就是趁年轻、用低费率锁定健康保障——而不是急着买储蓄或投资型产品。',
    ],
    quote: '他缺的不是收益，而是「别让一场意外把刚起步的节奏打乱」的底。',
    solutionEyebrow: '03 / 方案 · 保障三件套（真实方案脱敏）',
    solutionTitle: '意外 + 住院 + 重疾，一次配齐',
    solutionLead: '不碰储蓄/投资型产品，用三份最基础、性价比最高的保障搭起第一张安全网：意外险、私立住院险、多次理赔重疾险。以下保额与保费为某真实客户方案的脱敏示意。',
    meta: [
      { label: '① 意外险', value: 'S$210 / 年', sub: '意外身故 S$50 万 + 医疗' },
      { label: '② 私立住院险', value: 'S$1,510 / 年', sub: '每年最高 S$200 万 · 含抗癌加保' },
      { label: '③ 多次理赔重疾险', value: 'S$1,478 / 年', sub: '确诊赔 S$20 万 · 保至 65 岁' },
      { label: '三份合计', value: 'S$3,198 / 年', sub: '约 S$266/月 · 已含 9% GST' },
    ],
    table: {
      head: ['保障', '保额（示意）', '年保费'],
      rows: [
        ['意外险', '意外身故 S$50 万 + 骨折 / 医疗', 'S$210'],
        ['私立住院险', '每年最高 S$200 万 · 理赔后保费不涨', 'S$1,510'],
        ['多次理赔重疾险', '确诊 S$20 万 · 可多次理赔 · 至 65 岁', 'S$1,478'],
        ['三份合计', '约 S$266 / 月（含 9% GST）', 'S$3,198 / 年'],
      ],
    },
    plans: [
      {
        no: 'PLAN 01 · 意外险',
        name: '意外受伤，全方位兜底',
        tagline: '磕碰摔伤、骨折住院，连手机和健身卡都能赔',
        price: 'S$210 / 年',
        sumLabel: '意外身故保额',
        sum: 'S$50 万',
        benefits: [
          { b: '意外身故赔 S$50 万', s: '不论在世界哪个角落，意外发生都有保障' },
          { b: '骨折脱臼 + 看病费用', s: '受伤就医的医药费、骨折脱臼都能报销' },
          { b: '手机电脑摔坏也赔', s: '意外住院期间，电子设备损毁可获补偿' },
          { b: '健身卡 · 活动门票不浪费', s: '受伤没去成的健身会籍、演出门票可补偿' },
        ],
      },
      {
        no: 'PLAN 02 · 私立住院险',
        name: '生病住院，住得起私立医院',
        tagline: '私立病房自己挑，大额账单不怕，理赔后保费不涨',
        price: 'S$1,510 / 年',
        sumLabel: '住院年度保额',
        sum: 'S$200 万',
        benefits: [
          { b: '住进私立医院', s: '升级到私立医院任何标准病房，看病更舒心' },
          { b: '每年最高赔 S$200 万', s: '大病大额账单也兜得住，终身无总限额' },
          { b: '自己只付一小部分', s: '扣除自付额后只需付 5%，每年封顶 S$6,000' },
          { b: '理赔后保费不变', s: '就算今年理赔了，明年保费也不会因此上涨' },
          { b: '加保抗癌保障', s: '针对癌症门诊药物提供额外保障，治疗选择更从容' },
        ],
      },
      {
        no: 'PLAN 03 · 多次理赔重疾险',
        name: '重病来袭，赔了又赔',
        tagline: '一笔现金顶住收入中断，康复期安心养病，还能再赔',
        price: 'S$1,478 / 年',
        sumLabel: '重疾确诊保额',
        sum: 'S$20 万',
        benefits: [
          { b: '确诊就赔 S$20 万现金', s: '钱怎么花你决定——补收入、付房贷、好好养病' },
          { b: '能赔很多次', s: '严重期危疾可无限次索赔，每年自动还原保额' },
          { b: '旧病复发也保', s: '癌症、中风、心脏病再次发作，仍能再次理赔' },
          { b: '生病后免缴保费', s: '确诊早期危疾后，后续保费由保险公司替你交' },
          { b: '覆盖 150 种早 / 中 / 严重期危疾', s: '从早期发现到严重阶段都保，保障到 65 岁' },
        ],
      },
    ],
    dataChips: [
      { label: '保费占收入', value: '约 5% · 年收入 S$60,000' },
      { label: '三类风险', value: '意外 · 住院 · 重疾 一次配齐' },
      { label: '每日成本', value: '约 S$266/月 · 不到 S$9/天' },
    ],
  },

  // ───────────────────────── 2. 30 买房 ─────────────────────────
  {
    slug: 'new-home',
    age: 30,
    gender: 'female',
    mapLabel: '30 岁 · 买房置业',
    stageIcon: 'home',
    theme: '守住房子和彼此',
    icon: 'home',
    eyebrow: '客户案例 · 仅供方案说明',
    tag: 'CASE · 买房置业 · 守住房子和彼此',
    title: '刚背上房贷，万一我倒下，房子还保得住吗？',
    titleHi: '房子还保得住吗？',
    lead: '保障地基在 25 岁那阶段已经打好，但「买房」让责任升级——缺口集中在「家庭责任」这一层。她要的不是更多保险，而是精准对冲房贷风险。',
    pills: ['PR + 公民家庭', '双职工', '房贷 S$60 万', '稳健偏保守'],
    hexBefore: [3, 3, 2, 0, 0, 0],
    hexAfter: [3, 3, 3, 3, 1, 0],
    hexBeforeLabel: '买房前 · 三个角',
    hexAfterLabel: '配置后 · 补上人寿',
    hexNote:
      '这一阶段补上了关键的一块——人寿。用一份 30 年定期寿险（保费锁定）覆盖房贷年限，夫妻互为受益人；重疾同步加保到位。重残可随寿险附加 TPD，残护仍待后续阶段补全。',
    profile: [
      { icon: '🏠', title: '资产现状', items: ['刚购入自住房', '房贷约 S$60****', '双职工现金流稳，储蓄被首付消耗'] },
      { icon: '😟', title: '她的困扰', items: ['「如果一个人没了收入，另一个人扛得动整笔房贷吗？」'] },
      { icon: '🛡️', title: '已有保障', items: ['住院险 ✓ · 意外险 ✓', '重疾 ◐（偏低）', '寿险 ✕'] },
      { icon: '🎯', title: '核心诉求', items: ['万一一方身故/重病，房贷不压垮另一方', '补齐重疾缺口'] },
    ],
    analysisTitle: '最大的风险敞口，是那笔房贷',
    analysis: [
      'MoneySense 经验法则：身故/全残保障约年收入 9 倍、重疾约年收入 4 倍。',
      '她家最大的风险敞口是房贷——这是一笔确定的、长期的债务，最适合用一份 30 年定期寿险（保费锁定）精准覆盖。整体保费仍控制在家庭收入 15% 以内。',
    ],
    quote: '她要的不是更多保险，而是让房子在任何情况下都「保得住」。',
    solutionEyebrow: '03 / 方案 · 夫妻互保定期寿险（真实方案脱敏）',
    solutionTitle: '各持一份 30 年定期寿险，互为受益人',
    solutionLead: '夫妻各投保一份 30 年定期寿险、互相指定对方为受益人：保障期覆盖房贷年限，保费从第一年起锁定 30 年不涨，身故 / 全残 / 重疾 / 早期重疾一次防住。以下为某真实客户方案的脱敏示意。',
    meta: [
      { label: '先生的保单', value: 'S$2,857 / 年', sub: '身故+全残 S$100 万 · 重疾 S$100 万' },
      { label: '太太的保单', value: 'S$2,302 / 年', sub: '身故+全残 S$100 万 · 重疾 S$50 万' },
      { label: '家庭合计年保费', value: 'S$5,159 / 年', sub: '约 S$430/月 · 30 年锁定' },
      { label: '保障期', value: '30 年', sub: '覆盖房贷年限' },
    ],
    table: {
      head: ['保障（示意）', '先生', '太太'],
      rows: [
        ['身故 / 末期疾病', 'S$100 万', 'S$100 万'],
        ['全残 TPD', 'S$100 万', 'S$100 万'],
        ['重疾', 'S$100 万', 'S$50 万'],
        ['早期重疾', 'S$20 万', 'S$20 万'],
        ['年保费', 'S$2,857', 'S$2,302'],
      ],
    },
    dataChips: [
      { label: '受益人', value: '夫妻互为受益人' },
      { label: '保费', value: '30 年锁定不变 · 约 S$430/月' },
      { label: '产品性质', value: '定期寿险 · 无现金价值' },
    ],
  },

  // ───────────────────────── 3. 32 新手父母 ─────────────────────────
  {
    slug: 'new-parents',
    age: 32,
    gender: 'female',
    mapLabel: '32 岁 · 子女教育',
    stageIcon: 'education',
    theme: '为孩子搭保障与未来',
    icon: 'baby',
    eyebrow: '客户案例 · 仅供方案说明',
    tag: 'CASE · 新手父母 · 保障与教育金',
    title: '宝宝刚出生，保障和教育金该从哪一步开始？',
    titleHi: '该从哪一步开始？',
    lead: '很多新手父母第一反应是「先给孩子买」，但 MoneySense 的次序是——父母才是孩子最大的「保单」。我们先把父母这一层补到位，再给孩子搭地基、为未来攒教育金。',
    pills: ['新生宝宝', '双职工家庭', '先保父母', '教育金启动'],
    hexBefore: [3, 3, 3, 3, 1, 0],
    hexAfter: [3, 3, 3, 3, 3, 0],
    hexBeforeLabel: '生娃前',
    hexAfterLabel: '配置后 · 重残补全',
    hexNote:
      '孩子出生让家庭责任再次变重，父母的人寿、重残随之加保到位（重残补全）。孩子拥有了自己的「小六边形」：儿童住院 + 儿童意外 +（可选）少儿重疾。教育金作为「未来现金流」同步启动。',
    profile: [
      { icon: '👶', title: '家庭现状', items: ['宝宝刚出生', '家庭开支结构变化', '对未来教育支出开始焦虑'] },
      { icon: '😟', title: '她的困扰', items: ['想给孩子最好的，但不知先后次序', '担心教育金到用钱时不够'] },
      { icon: '🛡️', title: '已有保障', items: ['父母：住院/意外/重疾 已配置 ✓', '孩子：暂无任何保单 ✕'] },
      { icon: '🎯', title: '核心诉求', items: ['给宝宝配基础健康保障', '为孩子 18 岁前后教育金做长期准备'] },
    ],
    analysisTitle: '先父母、后孩子，次序别搞反',
    analysis: [
      '新生儿保障讲究「趁早」：越早配置，核保越简单、费率越低。',
      '但次序很重要——先父母、后孩子。父母收入是整个家庭的现金流引擎，父母才是孩子最大的「保单」。',
    ],
    quote: '孩子的保障重要，但请先确保父母自己够稳。',
    solutionEyebrow: '03 / 方案 · 两步走',
    solutionTitle: '先给宝宝搭地基，再为未来攒教育金',
    solutionLead: '第一步把宝宝的基础健康兜住，第二步为孩子 18 岁前后的教育金做长期储蓄。',
    meta: [
      { label: '① 儿童住院险', value: '约 S$2**', sub: '基础健康地基' },
      { label: '② 儿童意外险', value: '约 S$2**', sub: '活泼好动期必备' },
      { label: '③（可选）少儿重疾', value: '锁 S$10****', sub: '终身低费率' },
      { label: '④ 教育金储蓄', value: '年投约 S$2***', sub: '用钱节点有现金流' },
    ],
    table: {
      head: ['对象', '维度', '配置后'],
      rows: [
        ['父母', '人寿 / 重残', '✅ 责任变重 · 加保到位'],
        ['孩子', '住院 / 意外', '✅ 基础健康地基'],
        ['孩子', '重疾（可选）', '◐ 趁早锁费率'],
        ['未来', '教育金', '✅ 长期储蓄启动'],
      ],
    },
    dataChips: [
      { label: '关键提醒', value: '父母才是孩子最大的保单' },
      { label: '孩子新增', value: '住院 · 意外 ·（重疾可选）' },
      { label: '教育金起点', value: '孩子出生即开始' },
    ],
  },

  // ───────────────────────── 4. 35 财富增长 ─────────────────────────
  {
    slug: 'wealth-growth',
    age: 35,
    gender: 'female',
    mapLabel: '35 岁 · 财富增长',
    stageIcon: 'wealth',
    theme: '避税、增值、提前退休',
    icon: 'growth',
    eyebrow: '客户案例 · 仅供方案说明',
    tag: 'CASE · 财富增长 · 避税与提前退休',
    title: '35 岁就想清楚 50 岁的事——怎么又避税、又增值、又能提前退休？',
    titleHi: '又避税、又增值、又能提前退休？',
    lead: '保障六边形早已补齐，她要的是把高收入里「交税前」的部分用好——先用 SRS 顶格降税，再用一笔「先增值、后分红」的资金，为 50 岁的提前退休铺一条稳健的现金流。',
    pills: ['EP 持有者', '家族企业继承人', '目标 50 岁退休', 'SRS 顶格避税'],
    hexBefore: [3, 3, 3, 3, 3, 0],
    hexAfter: [3, 3, 3, 3, 3, 1],
    hexBeforeLabel: '保障层已满',
    hexAfterLabel: '转入增值 + 退休层',
    hexNote:
      '六边形的保障层已经补满，本阶段不再加保障，重心转入「增值 + 退休」。资产从「全是保障」走向「保障打底 + 税务优化 + 退休现金流」。',
    profile: [
      { icon: '💰', title: '资产现状', items: ['收入高、保障完整', '有持续可投入的闲钱', '尚未系统做税务优化'] },
      { icon: '😟', title: '她的困扰', items: ['税负偏高', '想 50 岁退休但没有清晰的现金流路径', '不想盯盘'] },
      { icon: '🛡️', title: '已有保障', items: ['住院/意外/重疾 ✓', '人寿/重残 ✓', '保障层已满'] },
      { icon: '🎯', title: '核心诉求', items: ['合法避税', '闲钱稳健增值', '为 50 岁退休备一条补充现金流'] },
    ],
    analysisTitle: 'SRS：高收入 EP 少数能直接降税的工具',
    analysis: [
      '作为高收入 EP 持有者，SRS（补充退休计划 Supplementary Retirement Scheme）是少数能直接降税的工具：外籍人士每年可顶格存入 S$35,700，当年应税收入据此扣减。',
      '但 SRS 账户里的钱若只躺着不增值意义有限——要搭配「先增值、后分红」的策略，让这笔钱在 35→50 岁的 15 年里滚大，再在退休后转成分红现金流。',
    ],
    quote: '提前退休的底气，来自「确定的现金流」，而不是「赌收益」。',
    solutionEyebrow: '03 / 方案 · 避税 + 增值 + 退休三件套',
    solutionTitle: '35 岁布局 → 15 年增值 → 50 岁起领',
    solutionLead: '用 SRS 当年降税，用「先增值后分红」的基金做长期滚存，用稳健储蓄补充退休现金流。',
    meta: [
      { label: '① SRS 顶格', value: 'S$35,700/年', sub: '直接抵扣应税收入' },
      { label: '② 先增值后分红基金', value: '年投约 S$****', sub: '前期增值 · 后转分红' },
      { label: '③ 稳健储蓄方案', value: '50 岁起领', sub: '补充退休现金流' },
    ],
    table: {
      head: ['阶段', '动作', '目标'],
      rows: [
        ['35 岁', 'SRS 顶格 + 基金布局', '当年降税 · 开始滚存'],
        ['35→50 岁', '先增值', '15 年让本金滚大'],
        ['50 岁起', '转分红 / 领取', '提前退休的补充现金流'],
      ],
    },
    dataChips: [
      { label: '每年避税额度', value: 'SRS S$35,700' },
      { label: '时间轴', value: '35 → 50 岁（15 年）' },
      { label: '退休策略', value: '先增值、后分红' },
    ],
  },

  // ───────────────────────── 5. 40 稳健美元退休 ─────────────────────────
  {
    slug: 'usd-retirement',
    age: 40,
    gender: 'male',
    mapLabel: '40 岁 · 退休规划',
    stageIcon: 'retire',
    theme: '稳健美元退休现金流',
    icon: 'stable',
    eyebrow: '客户案例 · 仅供方案说明',
    tag: 'CASE · 退休规划 · 美元储蓄方案',
    title: '收入不错，退休现金流和美元储蓄该怎么设计？',
    titleHi: '退休现金流和美元储蓄该怎么设计？',
    lead: '他不是要「博收益」，而是给一笔闲置美元找一个稳健、灵活、能传承的去处——既要确定性，又要在职业节奏变化时能提前启动。',
    pills: ['大厂高管', 'US$50 万闲置美元', '低风险', '可进可退'],
    hexBefore: [3, 3, 3, 3, 3, 1],
    hexAfter: [3, 3, 3, 3, 3, 2],
    hexBeforeLabel: '保障完整',
    hexAfterLabel: '补退休现金流 + 长护雏形',
    hexNote:
      '保障层完整，本阶段补的是「退休现金流」与「长期护理」的雏形。资产开始从「保障 + 增值」向「现金流 + 传承」过渡。',
    profile: [
      { icon: '💵', title: '资产现状', items: ['事业稳定、收入高峰', '一笔短期用不上的美元 US$50****'] },
      { icon: '😟', title: '他的考量', items: ['不追短期高波动', '担心职业节奏变化时缺乏可启动的安排'] },
      { icon: '🛡️', title: '已有保障', items: ['团体医疗、基础住院 ✓', '一定寿险/重疾、基础意外 ✓'] },
      { icon: '🎯', title: '核心诉求', items: ['长期稳定现金流', '稳健 + 灵活', '兼顾家庭资产传承'] },
    ],
    analysisTitle: '给一笔闲置美元，找一个可进可退的去处',
    analysis: [
      '需求清晰：不是博收益，而是闲置美元的稳健去处——可进可退、能传承。',
      '最贴合他的点是「可进可退」：急用能提前启动，不急用让资金继续增值。',
    ],
    quote: '他要的是确定性，和一份「随时能用、用不完能传」的从容。',
    solutionEyebrow: '03 / 方案 · 美元储蓄计划（趸交）',
    solutionTitle: '一次投入，按自己的节奏领',
    solutionLead: '一次性趸交，可选第 5 年或第 15 年起领年度现金流，保至 100 岁，用不完部分可传承。',
    meta: [
      { label: '一次性投入', value: 'US$50****', sub: '只交一次' },
      { label: '早领（第 5 年起）', value: '每年约 US$2****', sub: '可提前启动' },
      { label: '晚领（第 15 年起）', value: '每年约 US$4****', sub: '滚存更久' },
      { label: '保障期', value: '至 100 岁', sub: '未领部分续滚 · 可传承' },
    ],
    table: {
      head: ['领取方式', '起领时间', '每年现金流（占位）'],
      rows: [
        ['早领', '第 5 年起', '约 US$2****'],
        ['晚领', '第 15 年起', '约 US$4****'],
      ],
    },
    dataChips: [
      { label: '投入方式', value: '趸交一次' },
      { label: '领取弹性', value: '第 5 / 15 年可选' },
      { label: '保障期', value: '至 100 岁 + 传承' },
    ],
  },

  // ───────────────────────── 6. 45 企业主 ─────────────────────────
  {
    slug: 'business-owner',
    age: 45,
    gender: 'male',
    mapLabel: '45 岁 · 企业发展',
    stageIcon: 'business',
    theme: '进可攻退可守 · 六边形圆满',
    icon: 'building',
    eyebrow: '客户案例 · 仅供方案说明',
    tag: 'CASE · 企业主 · 增值 / 兜底 / 传承',
    title: '公司和家庭的钱混在一起，怎么既增值、又兜底、还能传承？',
    titleHi: '既增值、又兜底、还能传承？',
    lead: '作为 科技公司创始人，他的风险和普通高管不同——公司经营波动、个人与企业资产边界模糊。我们用「组合拳」让保障六边形最后一块补齐，同时把增值、兜底、传承一次安排清楚。',
    pills: ['科技公司创始人', '家庭+企业双责任', '资产隔离', '高杠杆传承'],
    hexBefore: [3, 3, 3, 3, 3, 2],
    hexAfter: [3, 3, 3, 3, 3, 3],
    hexBeforeLabel: '即将圆满',
    hexAfterLabel: '六边形圆满闭合 ⭐',
    hexNote:
      '至此，从 25 岁的「一个角」到 45 岁，六边形完整闭合：长期护理（残护）补齐，人寿用 IUL 做高杠杆加保，再叠加企业层的资产隔离与传承安排。',
    profile: [
      { icon: '🏢', title: '资产现状', items: ['经营 科技公司，有一定规模储蓄', '个人与公司资产边界模糊'] },
      { icon: '😟', title: '他的考量', items: ['经营有波动，怕「公司出事牵连家庭」', '想给家人留确定的一笔'] },
      { icon: '🛡️', title: '已有保障', items: ['健康保障完整（住院/重疾/意外）✓', '已有一定寿险，但相对双责任仍有缺口'] },
      { icon: '🎯', title: '核心诉求', items: ['一部分资金长期增值跑赢通胀', '一部分高杠杆身故兜底', '资产隔离 + 传承'] },
    ],
    analysisTitle: '为什么是「组合」，而非单一产品',
    analysis: [
      '分红基金负责「稳」，IUL 负责「保障 + 弹性增值」，正好对应他「进可攻、退可守」的诉求。',
      '企业主特有：用保单结构实现个人与企业资产的隔离与传承——让公司的波动，伤不到家庭那条底线。',
    ],
    quote: '让公司的波动，伤不到家庭那条底线。',
    solutionEyebrow: '03 / 方案 · 组合拳',
    solutionTitle: '分红 / 增值基金 + 指数万能险，两手都要硬',
    solutionLead: '一套组合拳：用分红 / 增值基金搭退休现金流（两种领法可选），用指数万能险 IUL 撬动高杠杆身故保障与传承。',
    meta: [
      { label: '① 分红 / 增值基金', value: '$10 万/年 × 5', sub: '退休现金流 · 两种领法（见下）' },
      { label: '② 指数型万用寿险 IUL', value: 'US$300 万 保额', sub: '趸交 US$37 万 · 约 8 倍 · 传承' },
    ],
    table: {
      head: ['工具', '角色', '说明'],
      rows: [
        ['分红基金', '稳健底仓', '增值平滑 · 放中长期不急用的钱'],
        ['IUL', '保障 + 弹性增值', '撬动约 US$1***** 保额 · 现金值有保底'],
        ['资产隔离', '企业主专属', '厘清边界 · 确定一笔留给家人'],
      ],
    },
    plans: [
      {
        no: '核心工具 · 指数型万用寿险 IUL',
        name: '高杠杆身故保障 + 挂钩指数的现金值增值',
        tagline: '一笔趸交，撬动数倍身故保额；现金值随指数增值，跌市有保底、涨市有上限',
        price: '趸交 US$370,962',
        sumLabel: '身故保障',
        sum: 'US$300 万',
        benefits: [
          { b: '身故保额约 US$300 万', s: '一次趸交约 US$37 万，撬动约 8 倍身故保障留给家人' },
          { b: '现金值挂钩 S&P 500 指数', s: '净保费 100% 配置到指数账户，分享美股长期上行' },
          { b: '跌市保底 0% · 涨市封顶 9%', s: '指数下跌年份现金值不亏（保底 0%），上行以 9% 封顶' },
          { b: '固定账户保证打底', s: '前 3 年保证 4.30%，之后 2.00%（保证利率）' },
          { b: '第 11 年起特别红利 0.35%', s: '从第 11 个保单年度派发至 100 岁（非保证）' },
          { b: '示意长期回报约 4%（非保证）', s: '85 岁退保示意年化约 4.04%，实际取决于指数表现与费用' },
        ],
      },
    ],
    dataChips: [
      { label: '身故杠杆', value: 'US$300 万 · 约 8 倍' },
      { label: '保障六边形', value: '圆满闭合' },
      { label: '收益性质', value: '分红与现金值非保证 · 以保单为准' },
    ],
  },
];

export const DISCLAIMERS: string[] = [
  '本页为真实客户方案的脱敏整理，已隐去所有可识别身份信息与具体产品名称；保额与保费为示意/参考，仅用于说明规划思路。',
  '以上数据为方案演示整理，不代表保证收益；分红、现金值增值等部分收益为非保证，取决于保险公司实际表现。',
  '实际投入、领取与保障金额，以保险公司正式保单文件为准。',
  '适合案例中客户的方案未必适合您。任何配置都应在完整的需求分析后，结合您的个人情况确定。',
  '本案例遵循 MAS MoneySense 基础财务规划原则——先保障、后增值，量入为出。',
];

export function getCases(locale?: string): CaseDetail[] {
  return locale === 'en' ? CASES_EN : CASES;
}

export function getCase(slug: string, locale?: string): CaseDetail | undefined {
  return getCases(locale).find((c) => c.slug === slug);
}

export function getHexAxes(locale?: string): readonly string[] {
  return locale === 'en' ? HEX_AXES_EN : HEX_AXES;
}

export function getDisclaimers(locale?: string): string[] {
  return locale === 'en' ? DISCLAIMERS_EN : DISCLAIMERS;
}
