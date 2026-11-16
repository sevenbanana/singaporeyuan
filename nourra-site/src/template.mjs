// 页面结构模板。文案在 content/*.json，颜色字体在 src/theme.css，一般不需要改这里。

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CABLES = ['signal', 'aqua', 'violet', 'cloud'];

function heroDiagram(d) {
  const xs = [55, 165, 275, 385];
  const tx = [187, 209, 231, 253];
  const cables = xs
    .map(
      (x, i) => `
      <path class="cable cable--${CABLES[i]}" style="--i:${i}" pathLength="1"
        d="M${x} 66 V128 C${x} 182 ${tx[i]} 160 ${tx[i]} 214" />
      <g class="gate" style="--i:${i}">
        <circle cx="${x}" cy="104" r="10" />
        <path d="M${x - 4.5} 104 l3.2 3.4 l6 -6.8" />
      </g>`
    )
    .join('');
  const ports = xs
    .map(
      (x, i) => `
      <text x="${x}" y="26" text-anchor="middle" class="d-label">${esc(d.ports[i])}</text>
      <rect x="${x - 15}" y="40" width="30" height="26" rx="3" class="port port--${CABLES[i]}" />`
    )
    .join('');
  const units = [0, 1, 2, 3, 4]
    .map(
      (n) => `
      <rect x="146" y="${364 + n * 22}" width="148" height="16" rx="2" class="unit" />
      <circle cx="158" cy="${372 + n * 22}" r="2.6" class="led" style="--n:${n}" />
      <path d="M176 ${372 + n * 22} h104" class="vent" />`
    )
    .join('');
  return `
  <svg class="hero-diagram" viewBox="0 0 440 510" role="img" aria-label="${esc(d.aria)}">
    ${ports}
    ${cables}
    <text x="8" y="198" class="d-note">${esc(d.check)}</text>
    <rect x="120" y="214" width="200" height="72" rx="4" class="hub" />
    <text x="220" y="246" text-anchor="middle" class="d-hub" translate="no">${esc(d.hub)}</text>
    <text x="220" y="270" text-anchor="middle" class="d-hubsub">${esc(d.hubSub)}</text>
    <path class="trunk" pathLength="1" d="M220 286 V352" />
    <rect x="134" y="352" width="172" height="124" rx="4" class="rack" />
    ${units}
    <text x="220" y="500" text-anchor="middle" class="d-label">${esc(d.rack)}</text>
  </svg>`;
}

function modeDiagram(m, i) {
  const box = (x, y, w, label, cls = '') =>
    `<rect x="${x}" y="${y}" width="${w}" height="34" rx="3" class="m-box ${cls}" />
     <text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" class="m-text"${cls.includes('us') ? ' translate="no"' : ''}>${esc(label)}</text>`;
  if (i === 0) {
    const sup = m.suppliers
      .map((s, n) => `${box(256, 6 + n * 43, 76, s)}<path d="M220 66 C240 66 238 ${23 + n * 43} 256 ${23 + n * 43}" class="m-line" />`)
      .join('');
    return `
    <svg class="mode-diagram" viewBox="0 0 340 132" role="img" aria-label="${esc(m.items[0].lead)}">
      ${box(8, 49, 56, m.you)}
      <path d="M64 66 H130" class="m-line" />
      <text x="97" y="58" text-anchor="middle" class="m-small">${esc(m.contractWord)}</text>
      ${box(130, 49, 90, 'NOURRA', 'm-box--us')}
      ${sup}
    </svg>`;
  }
  return `
    <svg class="mode-diagram" viewBox="0 0 340 132" role="img" aria-label="${esc(m.items[1].lead)}">
      ${box(8, 10, 56, m.you)}
      <path d="M64 27 H130" class="m-line" />
      <text x="97" y="19" text-anchor="middle" class="m-small">${esc(m.contractWord)}</text>
      ${box(130, 10, 90, 'NOURRA', 'm-box--us')}
      <path d="M220 27 H240" class="m-line" />
      ${box(240, 10, 92, m.scopeWord)}
      ${box(206, 88, 126, m.supplier)}
      <path d="M36 44 V105 H206" class="m-line m-line--dash" />
      <text x="120" y="98" text-anchor="middle" class="m-small">${esc(m.verifyWord)}</text>
    </svg>`;
}

export function renderPage({ t, cfg, base, altHref, selfUrl, altUrl, altLang }) {
  const c = t.contact;
  const email = cfg.contactEmail;
  const year = new Date().getFullYear();
  const isZh = t.lang.startsWith('zh');
  const legal = isZh ? cfg.legalName : cfg.legalNameEn;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: cfg.brand,
    url: cfg.siteUrl,
    description: t.meta.description,
    address: { '@type': 'PostalAddress', addressCountry: 'SG' },
  };
  const clientCfg = {
    endpoint: cfg.form.endpoint,
    email,
    text: {
      mailtoDone: c.mailtoDone, sending: c.sending, sent: c.sent, failed: c.failed,
      invalid: c.invalid, invalidEmail: c.invalidEmail, mailSubject: c.mailSubject,
      submitButton: c.submitButton, mailtoButton: c.mailtoButton,
    },
  };
  const field = (name, f, attrs) => `
        <div class="field">
          <label for="f-${name}">${esc(f.label)}</label>
          <input id="f-${name}" name="${name}" placeholder="${esc(f.placeholder)}" required ${attrs} aria-describedby="e-${name}">
          <p class="field-error" id="e-${name}" hidden></p>
        </div>`;

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
<meta property="og:site_name" content="${esc(cfg.brand)}">
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

<header class="site-header">
  <div class="wrap header-row">
    <a class="wordmark" href="#top" translate="no" aria-label="${esc(cfg.brand)}">NOURRA<span>.AI</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${esc(t.nav.menu)}</button>
    <nav id="site-nav" class="site-nav" aria-label="${esc(t.nav.menu)}">
      <ul>
        ${t.nav.items.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('\n        ')}
      </ul>
      <a class="lang" href="${altHref}" hreflang="${altLang}" lang="${altLang}" aria-label="${esc(t.nav.langAria)}">${esc(t.nav.langLabel)}</a>
      <a class="btn btn--small" href="#contact">${esc(t.nav.cta)}</a>
    </nav>
  </div>
</header>

<main id="main">
  <section class="hero" id="top">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <h1>${t.hero.h1.map((l) => `<span>${esc(l)}</span>`).join(' ')}</h1>
        <p class="lede">${esc(t.hero.lede)}</p>
        <div class="actions">
          <a class="btn" href="#contact">${esc(t.hero.primary)}</a>
          <a class="text-link" href="#modes">${esc(t.hero.secondary)}</a>
        </div>
        <p class="hero-note">${esc(t.hero.note)}</p>
      </div>
      <div class="hero-figure">${heroDiagram(t.hero.diagram)}</div>
    </div>
  </section>

  <section class="section" id="problems" aria-labelledby="h-problems">
    <div class="wrap">
      <h2 id="h-problems">${esc(t.problems.title)}</h2>
      <ul class="problems">
        ${t.problems.items
          .map(
            (p) => `<li>
          <h3>${esc(p.q)}</h3>
          <p>${esc(p.d)}</p>
          <p class="answer"><span>${esc(t.problems.ourLabel)}</span>${esc(p.a)}</p>
        </li>`
          )
          .join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="section section--panel" id="services" aria-labelledby="h-services">
    <div class="wrap">
      <h2 id="h-services">${esc(t.services.title)}</h2>
      <div class="services">
        ${t.services.items
          .map(
            (s, i) => `<article class="service service--${CABLES[i]}" id="service-${s.key}">
          <div class="service-head">
            <h3>${esc(s.name)}</h3>
            <p><b>${esc(t.services.labels.fit)}</b>${esc(s.fit)}</p>
          </div>
          <div>
            <h4>${esc(t.services.labels.do)}</h4>
            <ul>${s.do.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
          </div>
          <div>
            <h4>${esc(t.services.labels.get)}</h4>
            <p>${esc(s.get)}</p>
          </div>
        </article>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section" id="modes" aria-labelledby="h-modes">
    <div class="wrap">
      <div class="section-head">
        <h2 id="h-modes">${esc(t.modes.title)}</h2>
        <p>${esc(t.modes.intro)}</p>
      </div>
      <div class="modes">
        ${t.modes.items
          .map(
            (m, i) => `<article class="mode">
          <h3>${esc(m.name)}</h3>
          <p class="mode-lead">${esc(m.lead)}</p>
          ${modeDiagram(t.modes, i)}
          <dl>
            <div><dt>${esc(t.modes.rows.contract)}</dt><dd>${esc(m.contract)}</dd></div>
            <div><dt>${esc(t.modes.rows.duty)}</dt><dd>${esc(m.duty)}</dd></div>
            <div><dt>${esc(t.modes.rows.fit)}</dt><dd>${esc(m.fit)}</dd></div>
            <div><dt>${esc(t.modes.rows.fee)}</dt><dd>${esc(m.fee)}</dd></div>
          </dl>
        </article>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--panel" id="process" aria-labelledby="h-process">
    <div class="wrap">
      <h2 id="h-process">${esc(t.process.title)}</h2>
      <ol class="process">
        ${t.process.steps.map((s) => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="section" id="trust" aria-labelledby="h-trust">
    <div class="wrap">
      <div class="section-head">
        <h2 id="h-trust">${esc(t.trust.title)}</h2>
        <p>${esc(t.trust.intro)}</p>
      </div>
      <div class="ladder">
        <h3>${esc(t.trust.ladder.title)}</h3>
        <ol>
          ${t.trust.ladder.steps
            .map(
              (s, i) =>
                `<li class="${i > 1 ? 'is-quoted' : ''}"><strong>${esc(s)}</strong><span>${esc(i > 1 ? t.trust.ladder.quoted : t.trust.ladder.notQuoted)}</span></li>`
            )
            .join('\n          ')}
        </ol>
        <p>${esc(t.trust.ladder.note)}</p>
      </div>
      <div class="trust-grid">
        <ul class="rules">
          ${t.trust.rules.map((r) => `<li><h3>${esc(r.t)}</h3><p>${esc(r.d)}</p></li>`).join('\n          ')}
        </ul>
        <div class="wont">
          <h3>${esc(t.trust.wontTitle)}</h3>
          <ul>${t.trust.wont.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
        </div>
      </div>
      ${t.trust.team.enabled ? `<div class="team"><h3>${esc(t.trust.team.title)}</h3><p>${esc(t.trust.team.text)}</p></div>` : ''}
    </div>
  </section>

  <section class="section section--panel" id="faq" aria-labelledby="h-faq">
    <div class="wrap faq-grid">
      <h2 id="h-faq">${esc(t.faq.title)}</h2>
      <div class="faq">
        ${t.faq.items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section contact" id="contact" aria-labelledby="h-contact">
    <div class="wrap contact-grid">
      <div>
        <h2 id="h-contact">${esc(c.title)}</h2>
        <p>${esc(c.intro)}</p>
        <p class="contact-email">${esc(c.emailLabel)}<br>
          <a href="mailto:${email}" translate="no">${email}</a>${cfg.contactEmailConfirmed ? '' : ` <small>(${esc(c.pendingEmail)})</small>`}
        </p>
      </div>
      <form id="enquiry" novalidate data-mode="${cfg.form.endpoint ? 'post' : 'mailto'}">
        ${field('name', c.fields.name, 'type="text" autocomplete="name"')}
        ${field('company', c.fields.company, 'type="text" autocomplete="organization"')}
        ${field('email', c.fields.email, 'type="email" autocomplete="email" inputmode="email" spellcheck="false"')}
        <div class="field">
          <label for="f-type">${esc(c.fields.type.label)}</label>
          <select id="f-type" name="type">
            ${c.fields.type.options.map((o) => `<option>${esc(o)}</option>`).join('')}
          </select>
        </div>
        ${field('region', c.fields.region, 'type="text" autocomplete="off"')}
        <div class="field field--wide">
          <label for="f-message">${esc(c.fields.message.label)}</label>
          <textarea id="f-message" name="message" rows="5" placeholder="${esc(c.fields.message.placeholder)}" required aria-describedby="e-message"></textarea>
          <p class="field-error" id="e-message" hidden></p>
        </div>
        <div class="field--wide form-foot">
          <button class="btn" type="submit">${esc(cfg.form.endpoint ? c.submitButton : c.mailtoButton)}</button>
          ${cfg.form.endpoint ? '' : `<p class="form-hint">${esc(c.mailtoHint)}</p>`}
          <p class="form-status" role="status" aria-live="polite"></p>
          <p class="form-consent">${esc(c.consent)}</p>
        </div>
      </form>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <p class="wordmark" translate="no">NOURRA<span>.AI</span></p>
      <p>${esc(t.footer.tagline)}</p>
      <p>${esc(isZh ? cfg.location.zh : cfg.location.en)}</p>
    </div>
    <div>
      <p class="disclaimer">${esc(t.footer.disclaimer)}</p>
      <p class="legal">© ${year} ${esc(legal)} ${esc(t.footer.rights)}</p>
    </div>
  </div>
</footer>

<script>window.NOURRA=${JSON.stringify(clientCfg).replace(/</g, '\\u003c')};</script>
<script src="${base}assets/main.js" defer></script>
</body>
</html>
`;
}
