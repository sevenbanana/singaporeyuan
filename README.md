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

## 合规提醒

⚠️ 上线正式对外宣传前,建议把全站文案(尤其规划案例、咨询页 PDPA、客户评价)
交 AIA / 启航财富合规部门审阅。可先用 .vercel.app 临时网址给合规看。
