# 新加坡小圆姐 · 个人品牌网站 singaporeyuan.com

袁媛 Yuan Yuan · AIA 财富管理顾问的双语(中/英)品牌网站。
技术栈:Next.js 14 (App Router) + Tailwind CSS + next-intl + Formspree。

---

## 你需要替换的占位内容

1. **你的照片** → 把照片命名为 `portrait.jpg`,放进 `public/` 文件夹。
   然后打开 `app/[locale]/page.tsx`,找到"照片占位"那一段,按注释替换成 `<Image>`。
2. **微信二维码** → 命名 `wechat-qr.png` 放进 `public/`,在 `app/[locale]/consult/page.tsx` 替换"微信二维码占位"那块。
3. **LinkedIn 推荐语** → 在 `messages/zh.json` 和 `messages/en.json` 里,补充 `testimonials` 之外的同事推荐(目前 Tab 2 是占位)。

---

## 本地预览(如果你有电脑)

```bash
npm install
npm run dev
```

打开 http://localhost:3000 — 会自动跳转到 /zh 或 /en(看你浏览器语言)。

---

## 部署到 Vercel(纯网页操作,iPad 也行)

1. 把整个项目推到你的 GitHub 仓库(用户名 sevenbanana)。
2. 登录 vercel.com → New Project → 导入这个仓库。
3. Framework 会自动识别为 Next.js,直接点 Deploy。
4. 部署完成后会给你一个 `xxx.vercel.app` 网址,先确认线上效果。

## 绑定域名 singaporeyuan.com

1. Vercel 项目 → Settings → Domains → 输入 `singaporeyuan.com` 和 `www.singaporeyuan.com`。
2. Vercel 会给你 DNS 记录(A 记录或 CNAME)。
3. 登录你买域名的注册商后台,把这些 DNS 记录填进去(或把 nameserver 改成 Vercel 提供的)。
4. 等几分钟到几小时生效,HTTPS 会自动配置。

---

## 表单说明

咨询表单已接入你的 Formspree(form ID: `xnjkpqrz`)。
访客提交后,你会在 Formspree 后台和邮箱收到通知。
PDPA 同意框为必填,不勾选无法提交。

---

## Bufan 的英语工具:跨设备进度同步

页面在 `/gaobufan/english`(单文件 `public/gaobufan/english.html`)。
进度默认只存在这台设备的浏览器里,所以有两条同步通道:

### 1. 进度档 `public/gaobufan/progress.json`(开箱即用,不用配任何东西)

一份「家长发布的进度」。每台设备打开页面时读一次,`rev` 比这台设备记录的大就落地一次。
用来做「把所有设备统一拨到某一章某一节」这种矫正。改法:

```jsonc
{
  "rev": 2,                                            // 每改一次就 +1,否则设备不会再落地
  "profile": "bufan",
  "completedScenes": ["u1sA", "u1sB", "u2sA", "u2sB"],  // 标记成学过并熟练的场景
  "resumeScene": "u3sA",                                // 接下来从这一节开始
  "note": "提示条上显示的一句话"
}
```

场景 id 在页面的「章节地图」里能对上(u1sA = 第一章第一节,以此类推)。
只写场景 id、不要写死词序号 —— 教材重排过一次,序号会对不上。
落地时只补强不打回:这台设备已经练得更熟的词不会被拉低,卡片一个都不会删。

### 2. 云端存档(要配 KV,配了才有真正的双向同步)

配好之后,iPad 上学一节、电脑上再学一节,两边会自动合并
(每个词取学得更熟的那一边,天数/经验/掌握度取大的,不做二选一)。

1. Vercel 项目 → Storage → 建一个 KV(Upstash Redis)并连到这个项目,
   它会自动注入 `KV_REST_API_URL` / `KV_REST_API_TOKEN`。
2. 建议再加环境变量 `GAOBUFAN_SYNC_PIN`,填页面开场那四位数字(默认 1102)。
   不填的话,知道接口地址的人都能读写这份存档。
   注意:改了它,就要把每台设备的开场密码也改成同一个,否则那台设备会同步不上
   (设置页里会写明原因)。

接口在 `app/api/gaobufan/progress/route.ts`,没配 KV 时明确回 `configured:false`,
页面会安静地只走通道 1,不报错也不丢进度。云端另外保留最近 10 次存档,
万一哪台设备推上来一份坏的,可以从 `gaobufan:save:bufan:history` 里捞回来。

---

## 合规提醒

⚠️ 上线正式对外宣传前,建议把全站文案(尤其规划案例、咨询页 PDPA、客户评价)
交 AIA / 启航财富合规部门审阅。可先用 .vercel.app 临时网址给合规看。
