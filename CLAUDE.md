# 新加坡小圆姐网站 · 协作约定

## 指南 / 专题页的呈现方式

- `public/guides/` 下新做的指南、政策解读、专题页,一律用**互动滚动式**呈现,
  参照 `public/guides/wealth-across-cycles.html`(线上 `/guides/wealth-across-cycles.html`):
  深色海军蓝场景、背景色随章节变化、手绘插画视差、章节开篇大编号、滚动时淡入 / 图表绘制 / 数字滚动、
  右侧章节导航点、可点可拖的互动模块(按钮切换、滑块测算、点开卡片),结尾是联系卡和免责声明。
  `public/guides/outbound-investment.html` 是按这套做法写的政策速读示例。
- 不再做 `tax-savings.html`、`healthcare.html` 那种米白底长文卡片版式。
- 头像、微信二维码直接引用 `/avatar-round.png`、`/wechat-qr.png`,不要内嵌 base64。
- 静态 `.html` 不经过站点密码中间件(见 `middleware.ts` 的 matcher),默认公开;
  需要密码的页面要单独处理。
- 新指南在资源中心 `app/[locale]/resources/page.tsx` 加卡片(中英文案),
  封面插画加在 `ResourceArt.tsx`。
