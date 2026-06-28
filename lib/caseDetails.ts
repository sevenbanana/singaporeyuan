// 案例展示顺序 + 富文本案例的封面元数据
// 首页/案例库按 caseOrder 展示 6 张卡片;richSlugs 拥有完整定制详情页,其余为标准版式。

export const caseOrder = [
  'ep-group',
  'passive-income',
  'exec-retirement',
  'biz-employee',
  'newlywed-mortgage',
  'family-kids',
] as const;

export const richSlugs = ['passive-income', 'exec-retirement'] as const;

export function isRich(slug: string) {
  return (richSlugs as readonly string[]).includes(slug);
}

// 富文本案例封面文案(目前为中文版,中英文站均展示)
type CoverMeta = { eyebrow: string; kicker: string; lead: string; pills: string[] };

export const richCover: Record<string, CoverMeta> = {
  'passive-income': {
    eyebrow: 'CASE · 被动收入与资产再平衡',
    kicker: '客户案例 · 仅供方案说明',
    lead: '一个资产偏重不动产的家庭——三套投资房、CPF 顶格、闲钱买了保本年金,却被股市牵走了大量时间和精力,收益还不理想。我们重新平衡了风险结构,用一笔闲钱换回稳定的现金流,也补上了缺失的寿险。',
    pills: ['🏠 3 套投资房 · 无房贷', '闲钱 50 万新币', 'CPF 顶格', '想把精力留给家人'],
  },
  'exec-retirement': {
    eyebrow: 'CASE · 退休现金流规划',
    kicker: '客户案例 · 仅供方案说明',
    lead: '一位 40 岁大厂高管,手握一笔暂时用不上的美元资金。我们没有去追短期高波动,而是设计了一份「只交一次、未来按年领取、保至 100 岁」的长期安排——并准备了两套不同的领取节奏供他选择。',
    pills: ['👔 40 岁 · 大厂高管', '💼 一次性投入 US$500,000', '🔁 只交一次(趸交)', '🛡️ 保至 100 岁'],
  },
};
