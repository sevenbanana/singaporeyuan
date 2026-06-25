// 金色线条矢量图标库 —— 统一 stroke 风格,继承 currentColor
import type { SVGProps } from 'react';

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

// 教育与养老:学士帽
export const IconEducation = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 8l9-4 9 4-9 4-9-4z" />
    <path d="M7 10v4c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5v-4" />
    <path d="M21 8v5" />
  </svg>
);

// 资产配置:饼图/分配
export const IconAllocation = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5v8.5l6 6" />
    <path d="M12 12l7.5-3" />
  </svg>
);

// 重疾人寿:盾牌+心
export const IconShieldHeart = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M12 14.5c-1.6-1.2-3-2.3-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 1.5-1.4 2.6-3 3.8z" />
  </svg>
);

// 家庭保障:房子+人
export const IconFamily = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 11l8-6 8 6" />
    <path d="M6 10v9h12v-9" />
    <circle cx="12" cy="13" r="1.6" />
    <path d="M9.5 18c0-1.5 1.1-2.5 2.5-2.5s2.5 1 2.5 2.5" />
  </svg>
);

// 留学:地球
export const IconGlobe = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" />
  </svg>
);

// 遗嘱信托:文件
export const IconDocument = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 15h6M9 18h4" />
  </svg>
);

// 家办:大厦
export const IconBuilding = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 21V5l7-2v18M12 21V8l7 2v11" />
    <path d="M8 8h1M8 11h1M8 14h1M15 12h1M15 15h1" />
  </svg>
);

// 企业出海:船/航行
export const IconVoyage = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 17h16l-2 3H6l-2-3z" />
    <path d="M12 4v9M12 4l5 3-5 2M5 13h14" />
  </svg>
);

// 身份规划:护照/身份
export const IconIdentity = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="9" r="2.2" />
    <path d="M8.5 16c0-2 1.6-3 3.5-3s3.5 1 3.5 3" />
  </svg>
);

// 数据:家庭/客户
export const IconUsers = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <path d="M16 6.5a3 3 0 0 1 0 5.5M18 18.5c0-2-1-3.5-2.5-4.3" />
  </svg>
);

// 数据:保单
export const IconPolicy = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M8 9h8M8 12h8M8 15h5" />
  </svg>
);

// 数据:理赔/对勾
export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
);

// 数据:盾牌(保障额)
export const IconShield = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </svg>
);

// 数据:钱袋(赔付)
export const IconMoney = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 4h6l-1.5 3h-3L9 4z" />
    <path d="M7.5 7h9c1.5 2 3 4.5 3 7.5 0 3-2.5 5-7.5 5s-7.5-2-7.5-5c0-3 1.5-5.5 3-7.5z" />
    <path d="M12 11v5M10.5 12.5h3M10.5 14.5h3" />
  </svg>
);

// 案例:萌芽(初入职场)
export const IconSeedling = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 20v-7" />
    <path d="M12 13c0-2.5-2-4.5-4.5-4.5 0 2.5 2 4.5 4.5 4.5z" />
    <path d="M12 11c0-2.5 2-4.5 4.5-4.5 0 2.5-2 4.5-4.5 4.5z" />
  </svg>
);

// 案例:钥匙/房(新婚买房)
export const IconHome = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 11l8-6 8 6" />
    <path d="M6 10v9h12v-9" />
    <path d="M10 19v-5h4v5" />
  </svg>
);

// 案例:婴儿车(新生宝宝)
export const IconBaby = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 6h3l3 7h8" />
    <path d="M5 13a6 6 0 0 0 6-6V6" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
  </svg>
);

// 案例:稳健盾(储蓄)
export const IconStable = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// 案例:增长曲线(投资)
export const IconGrowth = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 19h16" />
    <path d="M5 15l4-4 3 3 6-7" />
    <path d="M18 7h-3M18 7v3" />
  </svg>
);

// 通用:对话(评价)
export const IconQuote = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M8 10c0-2 1.5-3 3-3M8 10v3c0 1-1 2-2 2M8 10H6c-1 0-2 1-2 2.5S5 15 6 15" />
  </svg>
);

export const caseIcons = [IconSeedling, IconHome, IconBaby, IconStable, IconGrowth];
export const coreIcons = [IconEducation, IconAllocation, IconShieldHeart, IconFamily];
export const strategicIcons = [IconGlobe, IconDocument, IconBuilding, IconVoyage, IconIdentity];
export const statIcons = [IconUsers, IconPolicy, IconCheck, IconShield, IconShieldHeart, IconMoney];
