// 把 public/nourra/ 打包成一个 Cloudflare Worker 并发布（nourra.ai 用它对外服务）。
// 网站只有六个文本文件（约 300KB），直接内嵌在 Worker 里，不需要单独上传静态资源。
//
// 用法：
//   CLOUDFLARE_API_TOKEN=<token> node scripts/nourra/deploy-cloudflare.mjs          生成并发布
//   node scripts/nourra/deploy-cloudflare.mjs --dry-run                              只生成 Worker 代码，不发布
// 需要的 token 权限：Account · Workers Scripts · Edit
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/nourra');
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || 'c10ddd7c6c673733a8bfbc054d5c4eff';
const SCRIPT = process.env.NOURRA_WORKER_NAME || 'nourra-site';
const DRY = process.argv.includes('--dry-run');

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const files = {};
for (const f of walk(ROOT)) {
  const rel = '/' + path.relative(ROOT, f).split(path.sep).join('/');
  const type = TYPES[path.extname(f)];
  if (!type) throw new Error(`不认识的文件类型：${rel}`);
  files[rel] = { t: type, b: fs.readFileSync(f, 'utf8') };
}

const worker = `// 由 scripts/nourra/deploy-cloudflare.mjs 生成，请勿手改
const FILES = ${JSON.stringify(files)};
const CANONICAL = 'nourra.ai';
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname === 'www.' + CANONICAL) { url.hostname = CANONICAL; return Response.redirect(url.toString(), 301); }
    let p = decodeURIComponent(url.pathname);
    if (p === '/en' || p === '/index.html' || p === '/en/index.html') return Response.redirect(url.origin + (p.startsWith('/en') ? '/en/' : '/'), 301);
    if (p.endsWith('/')) p += 'index.html';
    const f = FILES[p];
    if (!f) {
      return new Response('<!doctype html><meta charset="utf-8"><title>Not found</title><p style="font:16px system-ui;padding:40px">Page not found. <a href="/">Nourra Holdings</a></p>', { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    const html = f.t.startsWith('text/html');
    return new Response(request.method === 'HEAD' ? null : f.b, {
      headers: {
        'content-type': f.t,
        'cache-control': html ? 'public, max-age=0, must-revalidate' : 'public, max-age=3600',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
      },
    });
  },
};
`;

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.worker-build');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'worker.js'), worker);
console.log(`Worker 代码：${Object.keys(files).length} 个文件，${(worker.length / 1024).toFixed(0)} KB → ${path.join(out, 'worker.js')}`);
if (DRY) process.exit(0);

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) { console.error('缺少 CLOUDFLARE_API_TOKEN'); process.exit(1); }
const form = new FormData();
form.append('metadata', new Blob([JSON.stringify({ main_module: 'worker.js', compatibility_date: '2025-01-01' })], { type: 'application/json' }));
form.append('worker.js', new Blob([worker], { type: 'application/javascript+module' }), 'worker.js');
const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/scripts/${SCRIPT}`, {
  method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: form,
});
const body = await res.json().catch(() => ({}));
if (!body.success) { console.error('发布失败：', JSON.stringify(body.errors || body)); process.exit(1); }
console.log(`已发布 Worker「${SCRIPT}」`);
