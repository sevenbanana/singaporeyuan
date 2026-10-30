// 客户保单总结页（public/proposals/policy-summary-*.html）的资料加解密工具。
//
// 仓库是公开的：客户姓名、保单号、保费不能明文进 git。页面只放样式和渲染代码，
// 客户资料用访问密码加密后写进页面里的 <script id="enc">，浏览器输对密码才解得开
// （PBKDF2-SHA256 派生密钥 + AES-GCM，和页面里的解密代码一一对应）。
//
//   加密：PW='访问密码' node scripts/policy-summary-crypt.mjs encrypt <页面.html> <资料.json>
//   解密：PW='访问密码' node scripts/policy-summary-crypt.mjs decrypt <页面.html> > 资料.json
//
// 改资料：先解密成 json → 改 json → 再加密回页面。json 不要提交进仓库。

import { readFileSync, writeFileSync } from 'node:fs';

const ITER = 600000;
const RE = /(<script id="enc" type="application\/json">)([\s\S]*?)(<\/script>)/;
const { subtle } = globalThis.crypto;
const b64 = (u8) => Buffer.from(u8).toString('base64');
const unb64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));

async function deriveKey(pw, salt, it) {
  const base = await subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: it, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
  );
}

async function encrypt(htmlPath, jsonPath, pw) {
  const html = readFileSync(htmlPath, 'utf8');
  if (!RE.test(html)) throw new Error(`${htmlPath} 里找不到 <script id="enc" type="application/json">`);
  const data = JSON.stringify(JSON.parse(readFileSync(jsonPath, 'utf8')));
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pw, salt, ITER);
  const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(data)));
  const blob = JSON.stringify({ v: 1, it: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) });
  writeFileSync(htmlPath, html.replace(RE, (_, a, __, c) => a + blob + c));
  console.error(`已加密写入 ${htmlPath}（${data.length} 字符资料）`);
}

async function decrypt(htmlPath, pw) {
  const m = readFileSync(htmlPath, 'utf8').match(RE);
  if (!m) throw new Error(`${htmlPath} 里找不到 <script id="enc" type="application/json">`);
  const e = JSON.parse(m[2]);
  const key = await deriveKey(pw, unb64(e.salt), e.it);
  const pt = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(e.iv) }, key, unb64(e.ct))
    .catch(() => { throw new Error('密码不对，解不开'); });
  console.log(JSON.stringify(JSON.parse(new TextDecoder().decode(pt)), null, 2));
}

const [cmd, htmlPath, jsonPath] = process.argv.slice(2);
const pw = process.env.PW;
if (!pw || !htmlPath || (cmd === 'encrypt' && !jsonPath) || !['encrypt', 'decrypt'].includes(cmd)) {
  console.error("用法：PW='访问密码' node scripts/policy-summary-crypt.mjs encrypt <页面.html> <资料.json>\n" +
    "      PW='访问密码' node scripts/policy-summary-crypt.mjs decrypt <页面.html> > 资料.json");
  process.exit(1);
}
(cmd === 'encrypt' ? encrypt(htmlPath, jsonPath, pw) : decrypt(htmlPath, pw))
  .catch((err) => { console.error(err.message); process.exit(1); });
