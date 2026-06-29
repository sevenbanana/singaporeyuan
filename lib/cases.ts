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
    pills: ['EP 持有者', '科技大厂', '单身无负担', '应急金优先'],
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
    solutionEyebrow: '03 / 方案 · 三层基础保障',
    solutionTitle: '用 ≤8% 的收入，把地基打牢',
    solutionLead: '不碰任何储蓄/投资型产品，只搭三层最基础、性价比最高的保障。',
    meta: [
      { label: '① 住院险 IP + 附加险', value: '约 S$2***', sub: '跟人走 · 保终身' },
      { label: '② 个人意外险', value: '约 S$2**', sub: '性价比极高' },
      { label: '③ 早期重疾险', value: '约 S$2***', sub: '锁约 S$10**** 保额' },
      { label: '合计年保费', value: '< 收入 8%', sub: '远在 15% 红线内' },
    ],
    table: {
      head: ['维度', '配置前', '配置后'],
      rows: [
        ['住院', '✕', '✅ 住院险 IP + 附加险'],
        ['意外', '✕', '✅ 个人意外险'],
        ['重疾', '✕', '✅ 早期重疾（锁低费率）'],
        ['人寿 / 重残 / 残护', '✕', '— 随人生阶段补全'],
      ],
    },
    dataChips: [
      { label: '配置前裸奔维度', value: '5 / 6' },
      { label: '配置后已兜住', value: '住院 · 意外 · 重疾' },
      { label: '保费占收入', value: '< 8%' },
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
      '这一阶段补上了关键的一块——人寿。用房贷递减寿险精准对冲那笔确定的、长期的房贷债务；重疾同步加保到位。重残可随寿险附加 TPD，残护仍待后续阶段补全。',
    profile: [
      { icon: '🏠', title: '资产现状', items: ['刚购入自住房', '房贷约 S$60****', '双职工现金流稳，储蓄被首付消耗'] },
      { icon: '😟', title: '她的困扰', items: ['「如果一个人没了收入，', '另一个人扛得动整笔房贷吗？」'] },
      { icon: '🛡️', title: '已有保障', items: ['住院险 ✓ · 意外险 ✓', '重疾 ◐（偏低）', '寿险 ✕'] },
      { icon: '🎯', title: '核心诉求', items: ['万一一方身故/重病，房贷不压垮另一方', '补齐重疾缺口'] },
    ],
    analysisTitle: '最大的风险敞口，是那笔房贷',
    analysis: [
      'MoneySense 经验法则：身故/全残保障约年收入 9 倍、重疾约年收入 4 倍。',
      '她家最大的风险敞口是房贷——这是一笔确定的、长期的债务，最适合用「递减寿险」精准对冲。整体保费仍控制在家庭收入 15% 以内。',
    ],
    quote: '她要的不是更多保险，而是让房子在任何情况下都「保得住」。',
    solutionEyebrow: '03 / 方案 · 对冲房贷 + 补重疾',
    solutionTitle: '用递减寿险，把房贷风险按在地上',
    solutionLead: '保额随房贷递减，刚好覆盖余额；重疾同步加保，覆盖患病时的收入替代。',
    meta: [
      { label: '房贷递减寿险（各一份）', value: '约 S$2***/人', sub: '理赔可直接清偿房贷' },
      { label: '重疾加保（各）', value: '+约 S$20****', sub: '收入替代 · 康复开支' },
      { label: '对冲债务', value: 'S$60 万', sub: '房贷全覆盖' },
    ],
    table: {
      head: ['维度', '买房前', '配置后'],
      rows: [
        ['重疾', '◐ 偏低', '✅ 加保到位'],
        ['人寿', '✕', '✅ 房贷递减寿险'],
        ['重残', '✕', '◐ 可附加 TPD'],
      ],
    },
    dataChips: [
      { label: '对冲债务', value: '房贷 S$60 万全覆盖' },
      { label: '新增维度', value: '人寿' },
      { label: '保费占家庭收入', value: '< 15%' },
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
    lead: '作为 AI 创业公司创始人，他的风险和普通高管不同——公司经营波动、个人与企业资产边界模糊。我们用「组合拳」让保障六边形最后一块补齐，同时把增值、兜底、传承一次安排清楚。',
    pills: ['AI 创业公司创始人', '家庭+企业双责任', '资产隔离', '高杠杆传承'],
    hexBefore: [3, 3, 3, 3, 3, 2],
    hexAfter: [3, 3, 3, 3, 3, 3],
    hexBeforeLabel: '即将圆满',
    hexAfterLabel: '六边形圆满闭合 ⭐',
    hexNote:
      '至此，从 25 岁的「一个角」到 45 岁，六边形完整闭合：长期护理（残护）补齐，人寿用 IUL 做高杠杆加保，再叠加企业层的资产隔离与传承安排。',
    profile: [
      { icon: '🏢', title: '资产现状', items: ['经营 AI 创业公司，有一定规模储蓄', '个人与公司资产边界模糊'] },
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
    solutionTitle: '稳健底仓 + 高杠杆兜底 + 资产隔离',
    solutionLead: '分红基金做稳健底仓，IUL 撬动高杠杆身故保额，再叠加企业主专属的资产隔离与传承安排。',
    meta: [
      { label: '① 分红基金 / 储蓄', value: '年投约 S$2***', sub: '稳健增值底仓' },
      { label: '② 指数型万用寿险 IUL', value: '保额约 US$1*****', sub: '高杠杆 + 现金值增值' },
      { label: '③ 资产隔离 / 传承', value: '企业主专属', sub: '个人与公司边界' },
    ],
    table: {
      head: ['工具', '角色', '说明'],
      rows: [
        ['分红基金', '稳健底仓', '增值平滑 · 放中长期不急用的钱'],
        ['IUL', '保障 + 弹性增值', '撬动约 US$1***** 保额 · 现金值有保底'],
        ['资产隔离', '企业主专属', '厘清边界 · 确定一笔留给家人'],
      ],
    },
    dataChips: [
      { label: '身故杠杆', value: '约 US$1***** 保额' },
      { label: '保障六边形', value: '圆满闭合' },
      { label: '收益性质', value: '分红与现金值非保证 · 以保单为准' },
    ],
  },
];

export const DISCLAIMERS: string[] = [
  '本页为客户真实情况的脱敏整理，已隐去所有可识别身份信息，金额以占位/示意方式处理，仅用于说明规划思路。',
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
