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

  <section class="section section--rule" id="business" aria-labelledby="h-business">
    <div class="wrap split">
      <h2 class="label" id="h-business">${esc(t.business.title)}</h2>
      <ul class="rows">
        ${t.business.items
          .map((b) => `<li><h3>${esc(b.name)}${sub(b.en)}</h3><p>${esc(b.text)}</p></li>`)
          .join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="section section--dark" id="footprint" aria-labelledby="h-footprint">
    <div class="wrap split">
      <h2 class="label" id="h-footprint">${esc(t.footprint.title)}</h2>
      <div>
        <p class="statement">${esc(t.footprint.lead)}</p>
        <ul class="places">
          ${t.footprint.items
            .map((p) => `<li><h3>${esc(p.place)}${sub(p.en)}</h3><p>${esc(p.text)}</p></li>`)
            .join('\n          ')}
        </ul>
      </div>
    </div>
  </section>

  <section class="section" id="principles" aria-labelledby="h-principles">
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
</body>
</html>
`;
}
