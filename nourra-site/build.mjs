// 生成静态站点：node build.mjs
// 无任何依赖。读取 site.config.json、content/*.json、src/*，输出到 dist/。
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from './src/template.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const out = (p, body) => {
  mkdirSync(dirname(join(root, 'dist', p)), { recursive: true });
  writeFileSync(join(root, 'dist', p), body);
};

const cfg = json('site.config.json');
const zh = json('content/zh.json');
const en = json('content/en.json');
const site = cfg.siteUrl.replace(/\/$/, '');

rmSync(join(root, 'dist'), { recursive: true, force: true });

out('index.html', renderPage({
  t: zh, cfg, base: '', altHref: 'en/', selfUrl: `${site}/`, altUrl: `${site}/en/`, altLang: en.lang,
}));
out('en/index.html', renderPage({
  t: en, cfg, base: '../', altHref: '../', selfUrl: `${site}/en/`, altUrl: `${site}/`, altLang: zh.lang,
}));

out('assets/site.css', read('src/theme.css') + '\n' + read('src/styles.css'));
out('assets/main.js', read('src/main.js'));
for (const f of readdirSync(join(root, 'assets'))) {
  copyFileSync(join(root, 'assets', f), join(root, 'dist', 'assets', f));
}

out('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site}/</loc></url>
  <url><loc>${site}/en/</loc></url>
</urlset>
`);

console.log('已生成 dist/ ：index.html、en/index.html、assets/、robots.txt、sitemap.xml');
