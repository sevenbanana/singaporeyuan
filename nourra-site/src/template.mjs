// 页面结构模板。文案在 content/*.json，颜色字体在 src/theme.css，一般不需要改这里。

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Logo：取自「诺元控股 Nourra Holdings Logo」设计稿。颜色由 styles.css 的 .mark-bar / .mark-step 控制。
const MARK =
  '<svg class="mark" viewBox="14 14 92 92" width="38" height="38" aria-hidden="true">' +
  '<rect class="mark-bar" x="18" y="18" width="18" height="84" rx="3"/><rect class="mark-bar" x="84" y="18" width="18" height="84" rx="3"/>' +
  '<rect class="mark-step" x="37" y="82" width="16" height="16" rx="2" fill-opacity=".3"/><rect class="mark-step" x="47" y="62" width="16" height="16" rx="2" fill-opacity=".55"/>' +
  '<rect class="mark-step" x="57" y="42" width="16" height="16" rx="2" fill-opacity=".8"/><rect class="mark-step" x="67" y="22" width="16" height="16" rx="2"/></svg>';

// 首屏图形：把 Logo 的“两根立柱 + 上升方块”放大成一排机柜立面。
function heroArt(aria) {
  const W = 1440, H = 300, pitch = 48, barW = 5, top = 40, barH = 220, sq = 13;
  const levels = [0.28, 0.5, 0.75, 1];
  let bars = '', steps = '';
  const n = Math.ceil(W / pitch);
  for (let i = 0; i <= n; i++) {
    const x = i * pitch;
    bars += `<rect x="${x}" y="${top}" width="${barW}" height="${barH}" rx="1.5"/>`;
    const lv = i % 4;
    const y = top + barH - 24 - lv * 56;
    const fade = Math.min(1, Math.max(0, (i - 4) / (n - 8)));
    const o = (levels[lv] * (0.12 + 0.88 * fade)).toFixed(3);
    steps += `<rect x="${x + (pitch + barW - sq) / 2}" y="${y}" width="${sq}" height="${sq}" rx="2" fill-opacity="${o}" style="--i:${i}"/>`;
  }
  return `<svg class="hero-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" role="img" aria-label="${esc(aria)}">
    <g class="art-bars">${bars}</g><g class="art-steps">${steps}</g></svg>`;
}


// 机房内部示意图：上排是电力链路，下排是液冷回路。
const SHORT = {
  zh: { grid: '市电', tx: '变压器', ups: 'UPS', pdu: '配电', rack: '机柜', cdu: 'CDU', cooler: '室外散热' },
  en: { grid: 'Grid', tx: 'Transformer', ups: 'UPS', pdu: 'Distribution', rack: 'Racks', cdu: 'CDU', cooler: 'Heat rejection' },
};
function facilityArt(inside, isZh) {
  const L = SHORT[isZh ? 'zh' : 'en'];
  const box = (k, x, y) => `<g class="part" data-hl="${k}"><rect x="${x}" y="${y}" width="130" height="70" rx="4"/><text x="${x + 65}" y="${y + 41}" text-anchor="middle">${esc(L[k])}</text></g>`;
  const racks = [768, 824, 880, 936]
    .map((x) => `<rect x="${x}" y="50" width="44" height="290" rx="3"/>` +
      Array.from({ length: 11 }, (_, i) => `<path class="u" d="M${x + 7} ${72 + i * 24}h30"/>`).join(''))
    .join('');
  return `<svg class="facility-art" viewBox="0 0 1000 380" role="img" aria-label="${esc(inside.lead)}">
    <path class="flow flow--power" d="M150 85H200M330 85H380M510 85H560M690 85H760"/>
    <path class="flow flow--supply" d="M330 280H560M690 280H760"/>
    <path class="flow flow--return" d="M760 310H690M560 310H330"/>
    ${box('grid', 20, 50)}${box('tx', 200, 50)}${box('ups', 380, 50)}${box('pdu', 560, 50)}
    ${box('cooler', 200, 260)}${box('cdu', 560, 260)}
    <g class="part part--rack" data-hl="rack">${racks}<text x="874" y="368" text-anchor="middle">${esc(L.rack)}</text></g>
  </svg>`;
}

const stack = (id, sec, body, cls = '') => `
  <section class="section ${cls}" id="${id}" aria-labelledby="h-${id}" data-reveal>
    <div class="wrap">
      <div class="split">
        <h2 class="label" id="h-${id}">${esc(sec.title)}</h2>
        <div><p class="statement">${esc(sec.lead)}</p>${sec.hint ? `<p class="hint">${esc(sec.hint)}</p>` : ''}</div>
      </div>
      ${body}
    </div>
  </section>`;

const stepper = (id, sec, cls = '') => stack(id, sec, `
      <div class="delivery" data-tabs="s0">
        <ol class="steps" style="--n:${sec.steps.length}" data-progress>
          ${sec.steps.map((x, i) => `<li><button type="button" data-tab="s${i}"><i>${i + 1}</i><span>${esc(x.t)}</span></button></li>`).join('\n          ')}
        </ol>
        <div class="delivery-panels" aria-live="polite">
          ${sec.steps.map((x, i) => `<div data-panel="s${i}" hidden><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><p class="role role--core"><b>${esc(sec.dutyLabel)}</b>${esc(x.r)}</p></div>`).join('\n          ')}
        </div>
      </div>`, cls);

export function renderPage({ t, cfg, base, altHref, selfUrl, altUrl, altLang }) {
  const email = cfg.contactEmail;
  const year = new Date().getFullYear();
  const isZh = t.lang.startsWith('zh');
  const legal = isZh ? cfg.legalName : cfg.legalNameEn;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nourra Holdings',
    alternateName: '诺元控股',
    url: cfg.siteUrl,
    description: t.meta.description,
    address: { '@type': 'PostalAddress', addressCountry: 'SG' },
  };
  const lockup = `${MARK}<span class="lockup-text"><b>${esc(t.brand.name)}</b><small>${esc(t.brand.sub)}</small></span>`;
  const sub = (s) => (s ? `<span class="en" lang="en">${esc(s)}</span>` : '');

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
<link rel="canonical" href="${selfUrl}">
<link rel="alternate" hreflang="${t.lang}" href="${selfUrl}">
<link rel="alternate" hreflang="${altLang}" href="${altUrl}">
<link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}/">
<meta name="theme-color" content="${cfg.themeColor}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nourra Holdings">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:url" content="${selfUrl}">
<meta property="og:image" content="${cfg.siteUrl}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${cfg.fontsHref}">
<link rel="stylesheet" href="${base}assets/site.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.nav.skip)}</a>

<div class="hero" id="top">
  <header class="site-header">
    <div class="wrap header-row">
      <a class="lockup" href="#top" translate="no" aria-label="${esc(t.brand.name)} ${esc(t.brand.sub)}">${lockup}</a>
      <nav class="site-nav" aria-label="${esc(t.nav.label)}">
        <ul>
          ${t.nav.items.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('\n          ')}
        </ul>
        <a class="lang" href="${altHref}" hreflang="${altLang}" lang="${altLang}" aria-label="${esc(t.nav.langAria)}">${esc(t.nav.langLabel)}</a>
      </nav>
    </div>
  </header>
  <div class="wrap hero-copy">
    <p class="kicker">${esc(t.hero.kicker)}</p>
    <h1>${t.hero.h1.map((l) => `<span>${esc(l)}</span>`).join(' ')}</h1>
  </div>
  ${heroArt(t.hero.aria)}
</div>

<main id="main">
  <section class="section" id="about" aria-labelledby="h-about">
    <div class="wrap split">
      <h2 class="label" id="h-about">${esc(t.about.title)}</h2>
      <p class="statement">${esc(t.about.text)}</p>
    </div>
  </section>
${stack('chain', t.chain, `
      <div class="chain" data-tabs="deploy">
        <div class="chain-list">
          ${t.chain.layers.map((l) => `<button type="button" class="layer layer--${l.role}" data-tab="${l.k}"><span class="layer-name">${esc(l.name)}</span><span class="layer-tag">${esc(t.chain.legend[l.role])}</span></button>`).join('\n          ')}
        </div>
        <div class="chain-panels" aria-live="polite">
          ${t.chain.layers.map((l) => `<div class="chain-panel" data-panel="${l.k}" hidden><h3>${esc(l.name)}</h3><p>${esc(l.d)}</p><p class="role role--${l.role}"><b>${esc(t.chain.roleLabel)}</b>${esc(l.r)}</p></div>`).join('\n          ')}
        </div>
      </div>`, 'section--rule')}
${stack('inside', t.inside, `
      <div class="facility" data-tabs="rack">
        <div class="facility-fig">${facilityArt(t.inside, isZh)}
          <ul class="legend"><li class="lg lg--power">${esc(t.inside.legend.power)}</li><li class="lg lg--supply">${esc(t.inside.legend.supply)}</li><li class="lg lg--return">${esc(t.inside.legend.ret)}</li></ul>
        </div>
        <div class="facility-side">
          <div class="chips">${t.inside.parts.map((p) => `<button type="button" class="chip" data-tab="${p.k}">${esc(p.name)}</button>`).join('')}</div>
          <div aria-live="polite">${t.inside.parts.map((p) => `<div data-panel="${p.k}" hidden><h3>${esc(p.name)}</h3><p>${esc(p.d)}</p></div>`).join('')}</div>
        </div>
      </div>`, 'section--dark')}
${stack('density', t.density, `
      <div class="density" data-density="${esc(JSON.stringify(t.density.bands))}">
        <div class="density-ctrl">
          <label for="kw">${esc(t.density.slider)}<output for="kw"><b data-out="kw">40</b> ${esc(t.density.unit)}</output></label>
          <input id="kw" type="range" min="5" max="130" step="1" value="40">
          <dl>
            <div><dt>${esc(t.density.racks)}</dt><dd class="big" data-out="racks">25</dd></div>
            <div><dt>${esc(t.density.kind)}</dt><dd data-out="kind">${esc(t.density.bands[1].kind)}</dd></div>
            <div><dt>${esc(t.density.cooling)}</dt><dd data-out="cooling">${esc(t.density.bands[1].cooling)}</dd></div>
          </dl>
          <p class="note">${esc(t.density.note)}</p>
        </div>
        <div class="rack-grid" aria-hidden="true">${'<i></i>'.repeat(25)}</div>
      </div>`)}

${stepper('supply', t.supply, 'section--rule')}

  <section class="section section--rule" id="business" aria-labelledby="h-business">
    <div class="wrap split">
      <h2 class="label" id="h-business">${esc(t.business.title)}</h2>
      <ul class="rows">
        ${t.business.items
          .map((b) => `<li><h3>${esc(b.name)}${sub(b.en)}</h3><div><p>${esc(b.text)}</p><ul class="scope">${b.scope.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></li>`)
          .join('\n        ')}
      </ul>
    </div>
  </section>
${stack('footprint', t.footprint, `
      <div class="world" data-tabs="sg" data-hover>
        <div class="map">
          <img src="${base}assets/world-dots.svg" alt="" width="1080" height="384" loading="lazy">
          ${t.footprint.items.map((p) => `<button type="button" class="pin pin--${p.g}" data-tab="${p.k}" style="left:${(((p.lon + 180) / 360) * 100).toFixed(2)}%;top:${(((72 - p.lat) / 128) * 100).toFixed(2)}%" aria-label="${esc(p.place)}"><span>${esc(p.place)}</span></button>`).join('\n          ')}
        </div>
        <div class="world-list">
          ${['hq', 'site', 'net'].map((g) => `<div><h3 class="group">${esc(t.footprint.groups[g])}</h3><ul>${t.footprint.items.filter((p) => p.g === g).map((p) => `<li><button type="button" class="place" data-tab="${p.k}"><b>${esc(p.place)}${sub(p.en)}</b><span>${esc(p.text)}</span></button></li>`).join('')}</ul></div>`).join('\n          ')}
        </div>
      </div>`, 'section--dark')}
${stepper('delivery', t.delivery)}

  <section class="section section--rule" id="principles" aria-labelledby="h-principles">
    <div class="wrap split">
      <h2 class="label" id="h-principles">${esc(t.principles.title)}</h2>
      <ul class="rows">
        ${t.principles.items.map((r) => `<li><h3>${esc(r.t)}</h3><p>${esc(r.d)}</p></li>`).join('\n        ')}
      </ul>
    </div>
  </section>
</main>

<footer class="site-footer" id="contact" aria-labelledby="h-contact">
  <div class="wrap split">
    <h2 class="label" id="h-contact">${esc(t.contact.title)}</h2>
    <div>
      <p class="statement">${esc(t.contact.text)}</p>
      <p class="email"><a href="mailto:${email}" translate="no">${email}</a>${cfg.contactEmailConfirmed ? '' : ` <small>(${esc(t.contact.pendingEmail)})</small>`}</p>
    </div>
  </div>
  <div class="wrap footer-base">
    <div class="lockup" translate="no">${lockup}</div>
    <p>${esc(isZh ? cfg.location.zh : cfg.location.en)}</p>
    <p class="legal">© ${year} ${esc(legal)} ${esc(t.footer.rights)} ${esc(t.footer.disclaimer)}</p>
  </div>
</footer>
<script src="${base}assets/main.js" defer></script>
</body>
</html>
`;
}
