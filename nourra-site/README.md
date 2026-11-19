# NOURRA.AI 官网

单页双语静态站：中文在 `/`，英文在 `/en/`。没有任何第三方依赖，只需要 Node 18 以上。

> 这个文件夹与仓库里的「新加坡小圆姐」网站互不相关，只是暂存在同一个仓库。
> 正式上线前建议把 `nourra-site/` 整个搬到 NOURRA 自己的仓库。

## 运行

```bash
cd nourra-site
node build.mjs                      # 生成 dist/
python3 -m http.server 4173 -d dist # 本地预览：http://localhost:4173
```

`dist/` 就是可以直接上线的全部文件，上传到任何静态托管（Vercel、Netlify、Cloudflare Pages、对象存储）即可。
用 Vercel / Netlify 时：根目录填 `nourra-site`，构建命令 `node build.mjs`，输出目录 `dist`。

## 改哪里

| 想改什么 | 文件 |
| --- | --- |
| 中文文案 | `content/zh.json` |
| 英文文案 | `content/en.json` |
| 域名、公司名、邮箱、字体链接 | `site.config.json` |
| 颜色、字体、字号、间距 | `src/theme.css` |
| 版式与组件样式 | `src/styles.css` |
| 页面结构、首屏图形、机房示意图 | `src/template.mjs` |
| 交互脚本 | `src/main.js` |
| Logo、图标、分享图 | `assets/logo-mark.svg`（浅底）、`assets/logo-mark-dark.svg`（深底）、`assets/favicon.svg`、`assets/og.png`；页头页脚内嵌的同一图形在 `src/template.mjs` 顶部的 `MARK` |

改完任何一个文件后重新运行 `node build.mjs`。两种语言的 JSON 结构必须保持一致。

## 设计说明

- 定位是公司门面，不是获客页：没有表单和询价按钮，联系方式只有一个邮箱。
- 深海军蓝 `#0A1A33`、蓝 `#2B6CFF`、亮蓝 `#4CC9FF` 取自 Logo。
- 标题用衬线字体（西文 Newsreader，中文思源宋体），正文用 IBM Plex Sans 和思源黑体，均从 Google Fonts 加载；
  加载失败时回退到系统字体。如果访客主要在中国大陆，建议改为自托管字体。
- 系统开启“减少动态效果”时，所有动画停用。

## 页面板块（文案都在 `content/*.json` 的同名字段里）

| 板块 | 字段 | 交互 |
| --- | --- | --- |
| 首屏 | `hero` | 机柜立面图形加载时播放一次 |
| 公司 | `about` | 无 |
| 产业链 | `chain` | 九层，点开看说明和诺元的位置；`role` 取 `core` / `assist` / `none` |
| 机房内部 | `inside` | 电力与液冷示意图，点击部件看说明 |
| 密度 | `density` | 滑块，按 1 兆瓦计算机柜数；`bands` 里改区间 |
| 业务 | `business` | 无 |
| 布局 | `footprint` | 点阵世界地图；每个地点填 `lat` / `lon`，`g` 取 `hq` / `site` / `net` |
| 交付 | `delivery` | 六步，点击切换 |
| 原则、联系 | `principles`、`contact` | 无 |

地图底图 `assets/world-dots.svg` 是用公开的 Natural Earth 陆地数据一次性生成的，平时不需要重新生成。

## 已实现

- 中英文两个页面，互相切换，带 `hreflang`、canonical、Open Graph、结构化数据、`robots.txt`、`sitemap.xml`
- 电脑与手机版式（手机上隐藏段落导航，只留语言切换）
- 所有交互都是真正的按钮，键盘可操作；不开脚本时内容仍可阅读第一项

## 未做

- 访问统计、隐私政策页（页面不收集任何信息，暂不需要）

## 上线前待办

1. 确认域名，改 `site.config.json` 的 `siteUrl`。
2. 确认并替换联系邮箱（现为占位的 `hello@nourra.ai`），把 `contactEmailConfirmed` 改为 `true`。
3. 填入公司注册名称与注册号（页脚）。
6. 请法务过一遍“原则”一段里的合规表述和页脚免责声明。这些是公开承诺，必须与实际业务一致。
7. 请英文母语者通读英文版。

## 待补材料

- **自建机房的可公开信息**：地点、建设阶段、电力容量、上电时间、现场照片（现在页面只写“正在自建”，没有任何具体数字）
- **自有工程与运维团队的可公开信息**：人数、资质证书、过往项目照片

- Logo 取自「诺元控股 Nourra Holdings Logo」设计稿；网站字样目前写 NOURRA.AI，与 Logo 稿上的“诺元控股 / NOURRA HOLDINGS”是否统一待定
- 公司注册主体与注册地址
- 对外联系方式：邮箱、电话或微信、办公地址
- 可公开的团队背景（`content/*.json` 里 `trust.team`，现为关闭状态）
- 可署名的客户案例或合作伙伴授权（拿到书面同意后再放）
- 云厂商代理资质或授权证明（拿到后才能在页面上写具体品牌名）
- 可公开的机房资源信息：地点、电力容量、实景照片
- 工程团队的资质证书与过往项目照片
