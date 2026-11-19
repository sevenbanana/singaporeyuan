/* 诺元控股 · 页面交互 v2
   - 选中切换组 [data-tabs]：产业链、机房部件、供应链步骤、全球布局
   - 顶栏：滚动后变为磨砂、向下滚动时收起、阅读进度、当前章节高亮、移动端菜单
   - 首屏点阵地面（Canvas）、地图连接弧线与流动光点（Canvas）
   - 密度测算、供应链自动轮播、交付时间轴进度、卡片光斑、复制邮箱
   - GSAP + ScrollTrigger 负责滚动编排；加载失败或系统要求减少动态效果时，页面保持完整静态。 */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js');
  if (!root.lang) root.lang = 'zh-Hans';
  var isEN = /^en/i.test(root.lang);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var css = function (name) { return getComputedStyle(root).getPropertyValue(name).trim(); };
  var onVisible = function (el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (entries) { entries.forEach(function (en) { cb(en.isIntersecting, en); }); }, opts || { threshold: 0 }).observe(el);
  };

  /* ---------- 选中切换 ---------- */
  function initTabs() {
    $$('[data-tabs]').forEach(function (group) {
      function select(key, opts) {
        if (!key) return;
        opts = opts || {};
        group.dataset.active = key;
        $$('[data-tab]', group).forEach(function (b) {
          var on = b.dataset.tab === key;
          b.classList.toggle('is-active', on);
          if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(on));
        });
        $$('[data-panel]', group).forEach(function (p) { p.hidden = p.dataset.panel !== key; });
        $$('[data-hl]', group).forEach(function (h) { h.classList.toggle('is-active', h.dataset.hl === key); });
        var prog = $('[data-progress]', group);
        if (prog) {
          var keys = $$('[data-tab]', prog).map(function (b) { return b.dataset.tab; });
          prog.style.setProperty('--p', keys.length > 1 ? keys.indexOf(key) / (keys.length - 1) : 0);
        }
        group.dispatchEvent(new CustomEvent('tabchange', { detail: { key: key, user: !!opts.user, hover: !!opts.hover } }));
      }
      group._select = select;
      group.addEventListener('click', function (e) {
        var t = e.target.closest('[data-tab],[data-hl]');
        if (t && group.contains(t)) select(t.dataset.tab || t.dataset.hl, { user: true });
      });
      if (group.hasAttribute('data-hover')) {
        group.addEventListener('pointerover', function (e) {
          var t = e.target.closest('[data-tab]');
          if (t && e.pointerType === 'mouse' && group.dataset.active !== t.dataset.tab) select(t.dataset.tab, { user: true, hover: true });
        });
      }
      // 方向键在同组按钮间移动
      group.addEventListener('keydown', function (e) {
        var list = e.target.closest('[data-keys]');
        if (!list) return;
        var items = $$('[data-tab]', list);
        var i = items.indexOf(e.target.closest('[data-tab]'));
        if (i < 0) return;
        var map = list.dataset.keys === 'v' ? { ArrowDown: 1, ArrowUp: -1 } : { ArrowRight: 1, ArrowLeft: -1 };
        var j;
        if (e.key in map) j = (i + map[e.key] + items.length) % items.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = items.length - 1;
        else return;
        e.preventDefault();
        items[j].focus();
        select(items[j].dataset.tab, { user: true });
      });
      select(group.dataset.tabs);
    });
  }

  /* ---------- 顶栏、进度、章节高亮、菜单 ---------- */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var bar = $('.scroll-progress i', header);
    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      if (!root.classList.contains('menu-open')) {
        if (y > 520 && y > lastY + 4) header.classList.add('is-hidden');
        else if (y < lastY - 4 || y < 520) header.classList.remove('is-hidden');
      }
      lastY = y;
      var max = root.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0).toFixed(4) + ')';
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

    var links = $$('.site-nav a[href^="#"]');
    var bySection = new Map();
    links.forEach(function (a) { var s = doc.getElementById(a.getAttribute('href').slice(1)); if (s) bySection.set(s, a); });
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) { l.classList.remove('is-current'); });
          var a = bySection.get(en.target);
          if (a) a.classList.add('is-current');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      bySection.forEach(function (a, s) { spy.observe(s); });
    }

    var btn = $('.menu-btn', header), menu = $('#menu');
    if (!btn || !menu) return;
    function setMenu(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? btn.dataset.labelClose : btn.dataset.labelOpen);
      menu.hidden = !open;
      root.classList.toggle('menu-open', open);
      if (open) { header.classList.remove('is-hidden'); header.classList.add('is-scrolled'); }
      else onScroll();
    }
    btn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- 数字滚动 ---------- */
  function countUp(el, delay) {
    var to = Number(el.dataset.count);
    if (reduce || !isFinite(to)) { el.textContent = to; return; }
    var dur = 1300 + to * 30, start = performance.now() + (delay || 0);
    el.textContent = '0';
    (function step(now) {
      var t = clamp((now - start) / dur, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  function initCounters() {
    $$('.hero [data-count]').forEach(function (el, i) { countUp(el, 950 + i * 90); });
    $$('.world-stats').forEach(function (box) {
      var done = false;
      onVisible(box, function (vis) {
        if (!vis || done) return;
        done = true;
        $$('[data-count]', box).forEach(function (el, i) { countUp(el, i * 120); });
      }, { threshold: 0.6 });
    });
  }

  /* ---------- 首屏：点阵地面 + 沿行向远处流动的数据光点 ---------- */
  function initHeroField() {
    var canvas = $('.hero-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var hero = canvas.closest('.hero');
    var W = 0, H = 0, cols = 0, rows = 0, raf = 0, visible = true, last = 0;
    var Z0 = 1.3, Z1 = 15, SPAN = 20;
    var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    var pulses = [], nextSpawn = 0;
    var BASE = '#86A9DD', HOT = '#4CC9FF';

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      var dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = W < 700 ? 34 : W < 1200 ? 54 : 66;
      rows = W < 700 ? 24 : 32;
      if (!raf) draw(performance.now());
    }
    function waveY(x, z, t) {
      return 0.24 * Math.sin(x * 0.42 + t * 0.5) * Math.cos(z * 0.36 - t * 0.32) + 0.1 * Math.sin((x - z) * 0.75 + t * 0.85);
    }
    function draw(now) {
      var t = reduce ? 0 : now / 1000;
      ctx.clearRect(0, 0, W, H);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      var mobile = W < 700;
      var horizon = H * (mobile ? 0.5 : 0.44) + pointer.y * 14;
      var f = H * (mobile ? 0.85 : 1.0);
      var camY = 1.3, camX = pointer.x * 1.4, cx = W * (mobile ? 0.5 : 0.56);

      if (!reduce && now > nextSpawn && pulses.length < 6) {
        pulses.push({ c: Math.floor(Math.random() * cols), z: Z0, v: 3 + Math.random() * 3 });
        nextSpawn = now + 500 + Math.random() * 900;
      }
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      for (var p = pulses.length - 1; p >= 0; p--) { pulses[p].z += pulses[p].v * dt; if (pulses[p].z > Z1) pulses.splice(p, 1); }

      var hot = [];
      ctx.fillStyle = BASE;
      for (var r = rows - 1; r >= 0; r--) {
        var zn = r / (rows - 1);
        var z = Z0 + (Z1 - Z0) * Math.pow(zn, 1.25);
        var depthA = clamp((Z1 - z) / (Z1 * 0.55), 0, 1) * clamp((z - Z0) / 0.8 + 0.35, 0, 1);
        for (var c = 0; c < cols; c++) {
          var x = (c / (cols - 1) - 0.5) * SPAN;
          var y = waveY(x, z, t);
          var sx = cx + (x - camX) * f / z;
          if (sx < -12 || sx > W + 12) continue;
          var sy = horizon + (camY - y) * f / z;
          if (sy > H + 12 || sy < horizon - 4) continue;
          var edge = clamp(Math.min(sx, W - sx) / (W * 0.18), 0, 1);
          var a = depthA * edge * (0.38 + y * 0.9);
          var s = Math.max(1, 2.6 * (H / 900) * (6 / z));
          var boost = 0;
          for (var q = 0; q < pulses.length; q++) {
            if (pulses[q].c !== c) continue;
            var d = pulses[q].z - z;
            if (d >= 0 && d < 3.4) boost = Math.max(boost, 1 - d / 3.4);
            else if (d < 0 && d > -0.5) boost = Math.max(boost, 1 + d / 0.5);
          }
          if (boost > 0.02) { hot.push(sx, sy, s * (1 + boost * 0.9), clamp(depthA * edge * (0.35 + boost), 0, 1)); continue; }
          if (a < 0.02) continue;
          ctx.globalAlpha = clamp(a, 0, 0.75);
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
        }
      }
      ctx.fillStyle = HOT;
      for (var h = 0; h < hot.length; h += 4) {
        ctx.globalAlpha = hot[h + 3];
        ctx.fillRect(hot[h] - hot[h + 2] / 2, hot[h + 1] - hot[h + 2] / 2, hot[h + 2], hot[h + 2]);
      }
      ctx.globalAlpha = 1;
    }
    function loop(now) {
      raf = 0;
      draw(now);
      if (visible && !doc.hidden) raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && !reduce && visible && !doc.hidden) { last = 0; raf = requestAnimationFrame(loop); } }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize);
    resize();
    if (reduce) return;
    onVisible(hero, function (vis) { visible = vis; vis ? start() : stop(); });
    doc.addEventListener('visibilitychange', function () { doc.hidden ? stop() : start(); });
    if (fine) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        pointer.tx = (e.clientX - r.left) / r.width - 0.5;
        pointer.ty = (e.clientY - r.top) / r.height - 0.5;
      });
      hero.addEventListener('pointerleave', function () { pointer.tx = 0; pointer.ty = 0; });
    }
    start();
  }

  /* ---------- 产业链：角色筛选；窄屏时说明卡跟在选中层下方 ---------- */
  function initChain() {
    var chain = $('.chain[data-tabs]');
    if (!chain) return;
    var filter = $('.chain-filter', chain);
    if (filter) {
      filter.addEventListener('click', function (e) {
        var b = e.target.closest('[data-filter]');
        if (!b) return;
        var f = b.dataset.filter;
        $$('[data-filter]', filter).forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
        chain.dataset.filter = f;
        if (f !== 'all') {
          var active = $('.layer.is-active', chain);
          if (active && active.dataset.role !== f) {
            var first = $('.layer[data-role="' + f + '"]', chain);
            if (first) chain._select(first.dataset.tab, { user: true });
          }
        }
      });
    }
    var panels = $('.chain-panels', chain), list = $('.chain-list', chain);
    var mq = window.matchMedia('(max-width: 960px)');
    function place(e) {
      if (mq.matches) {
        var act = $('.layer.is-active', list);
        if (!act || act.nextElementSibling === panels) return;
        var before = act.getBoundingClientRect().top;
        act.after(panels);
        if (e && e.detail && e.detail.user) {
          var delta = act.getBoundingClientRect().top - before;
          if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' });
        }
      } else if (panels.parentNode !== chain) {
        chain.appendChild(panels);
      }
    }
    chain.addEventListener('tabchange', place);
    mq.addEventListener('change', function () { place(); });
    place();
  }

  /* ---------- 机房内部：路径切换 ---------- */
  function initFacility() {
    var fac = $('.facility[data-tabs]');
    if (!fac) return;
    var seg = $('[data-pathtoggle]', fac);
    function setFocus(p) {
      fac.dataset.focus = p;
      $$('[data-path-btn]', seg).forEach(function (b) { var on = b.dataset.pathBtn === p; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    }
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-path-btn]');
      if (!b) return;
      setFocus(b.dataset.pathBtn);
      var act = $('.chip.is-active', fac);
      if (b.dataset.pathBtn !== 'all' && act && act.dataset.path !== 'both' && act.dataset.path !== b.dataset.pathBtn) {
        var first = $('.chip[data-path="' + b.dataset.pathBtn + '"]', fac);
        if (first) fac._select(first.dataset.tab, { user: true });
      }
    });
    fac.addEventListener('tabchange', function (e) {
      var part = $('[data-hl="' + e.detail.key + '"]', fac);
      var p = part && part.dataset.path;
      var f = fac.dataset.focus;
      if (f && f !== 'all' && p && p !== 'both' && p !== f) setFocus('all');
    });
  }

  /* ---------- 密度测算 ---------- */
  function initDensity() {
    var d = $('[data-density]');
    if (!d) return;
    var input = $('input[type=range]', d);
    var bands = JSON.parse(d.dataset.density);
    var grid = $('.rack-grid', d);
    var MAX = Math.floor(1000 / Number(input.min));
    var html = '';
    for (var i = 0; i < MAX; i++) html += '<i></i>';
    grid.innerHTML = html;
    var cells = $$('i', grid);
    var out = function (k) { return $$('[data-out="' + k + '"]', d); };
    var shown = 0, display = null, target = 0, numRaf = 0;
    function paintNumber() {
      numRaf = 0;
      if (display === null || reduce) display = target;
      else display += (target - display) * 0.28;
      if (Math.abs(target - display) < 0.5) display = target;
      var v = String(Math.round(display));
      out('racks').forEach(function (o) { o.textContent = v; });
      out('racks2').forEach(function (o) { o.textContent = v; });
      if (display !== target) numRaf = requestAnimationFrame(paintNumber);
    }
    function update() {
      var kw = Number(input.value);
      var n = Math.floor(1000 / kw);
      var band = bands.filter(function (b) { return kw <= b.max; })[0];
      var idx = bands.indexOf(band);
      out('kw').forEach(function (o) { o.textContent = kw; });
      out('kind').forEach(function (o) { o.textContent = band.kind; });
      out('cooling').forEach(function (o) { o.textContent = band.cooling; });
      d.dataset.band = idx;
      target = n;
      if (!numRaf) numRaf = requestAnimationFrame(paintNumber);
      cells.forEach(function (c, i) {
        var on = i < n;
        if (c._on === on) return;
        c._on = on;
        c.style.transitionDelay = reduce ? '0ms' : (on ? Math.min(Math.abs(i - shown), 60) * 4 : 0) + 'ms';
        c.classList.toggle('on', on);
      });
      shown = n;
      $$('[data-kw]', d).forEach(function (b) { b.classList.toggle('is-active', Number(b.dataset.kw) === kw); });
    }
    function animateTo(to) {
      var from = Number(input.value);
      if (reduce || from === to) { input.value = to; update(); return; }
      var t0 = performance.now(), dur = 700;
      (function step(now) {
        var t = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - t, 3);
        input.value = Math.round(from + (to - from) * e);
        update();
        if (t < 1) requestAnimationFrame(step);
      })(t0);
    }
    input.addEventListener('input', update);
    $$('[data-kw]', d).forEach(function (b) { b.addEventListener('click', function () { animateTo(Number(b.dataset.kw)); }); });
    update();
  }

  /* ---------- 供应链：五步自动轮播，悬停暂停，用户点选后停止 ---------- */
  function initAutoplay() {
    $$('[data-autoplay]').forEach(function (group) {
      if (reduce || !group._select) return;
      var keys = $$('[data-progress] [data-tab]', group).map(function (b) { return b.dataset.tab; });
      var DUR = 5600, elapsed = 0, last = 0, visible = false, hold = false, stopped = false, raf = 0;
      group.classList.add('is-playing');
      function tick(now) {
        raf = 0;
        if (stopped) return;
        var dt = last ? now - last : 0;
        last = now;
        if (!hold) {
          elapsed += dt;
          if (elapsed >= DUR) {
            elapsed = 0;
            var i = keys.indexOf(group.dataset.active);
            group._select(keys[(i + 1) % keys.length]);
          }
          group.style.setProperty('--t', (elapsed / DUR).toFixed(4));
        }
        if (visible) raf = requestAnimationFrame(tick);
      }
      function run() { if (!raf && visible && !stopped) { last = 0; raf = requestAnimationFrame(tick); } }
      function stop() { stopped = true; group.classList.remove('is-playing'); group.style.removeProperty('--t'); }
      group.addEventListener('tabchange', function (e) { if (e.detail.user) stop(); });
      group.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hold = true; });
      group.addEventListener('pointerleave', function () { hold = false; last = 0; });
      group.addEventListener('focusin', function () { hold = true; });
      group.addEventListener('focusout', function () { hold = false; last = 0; });
      onVisible(group, function (vis) { visible = vis; run(); }, { threshold: 0.35 });
    });
  }

  /* ---------- 全球布局：真实经纬度落点、弧线、光点、悬停信息 ---------- */
  function initMap() {
    var map = $('[data-map]');
    if (!map) return;
    var world = map.closest('[data-tabs]');
    var pins = $$('.pin[data-lat]', map);
    // 底图为等距圆柱投影：经度 −180°…180°，纬度 72°N…56°S
    pins.forEach(function (p) {
      p._uv = [(Number(p.dataset.lon) + 180) / 360, (72 - Number(p.dataset.lat)) / 128];
      p.style.left = (p._uv[0] * 100).toFixed(3) + '%';
      p.style.top = (p._uv[1] * 100).toFixed(3) + '%';
    });
    var hub = pins.filter(function (p) { return p.dataset.tab === 'sg'; })[0];
    if (!hub) return;
    var sea = pins.filter(function (p) { return /^(sg|my|id)$/.test(p.dataset.tab); });
    var ring = $('.sea-ring', map);
    if (ring) {
      var u = 0, v = 0;
      sea.forEach(function (p) { u += p._uv[0]; v += p._uv[1]; });
      ring.style.left = (u / sea.length * 100).toFixed(3) + '%';
      ring.style.top = (v / sea.length * 100).toFixed(3) + '%';
    }
    var targets = pins.filter(function (p) { return p !== hub; });
    var canvas = $('.map-canvas', map), ctx = canvas.getContext('2d');
    var W = 0, H = 0, arcs = [], SEG = 72, CYCLE = 7.2, raf = 0, visible = false, introAt = 0;
    var SKY = css('--sky') || '#4CC9FF';

    function build() {
      var r = map.getBoundingClientRect();
      W = r.width; H = r.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var h = [hub._uv[0] * W, hub._uv[1] * H];
      var maxLen = 1;
      arcs = targets.map(function (p, i) {
        var t = [p._uv[0] * W, p._uv[1] * H];
        var dx = t[0] - h[0], dy = t[1] - h[1], len = Math.hypot(dx, dy) || 1;
        var nx = -dy / len, ny = dx / len;
        if (ny > 0) { nx = -nx; ny = -ny; }
        var k = len < 60 ? 0.6 : len > W * 0.45 ? 0.42 : 0.3;
        var c = [(h[0] + t[0]) / 2 + nx * len * k, (h[1] + t[1]) / 2 + ny * len * k];
        var pts = [];
        for (var s = 0; s <= SEG; s++) {
          var q = s / SEG, a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, e = q * q;
          pts.push([a * h[0] + b * c[0] + e * t[0], a * h[1] + b * c[1] + e * t[1]]);
        }
        maxLen = Math.max(maxLen, len);
        var g = ctx.createLinearGradient(h[0], h[1], t[0], t[1]);
        g.addColorStop(0, 'rgba(76,201,255,.75)');
        g.addColorStop(1, 'rgba(76,201,255,.2)');
        return { key: p.dataset.tab, pts: pts, len: len, end: t, grad: g, i: i };
      });
      arcs.forEach(function (a, i) {
        a.dur = 1.1 + 1.9 * (a.len / maxLen);
        a.offset = (arcs.length - i) * (CYCLE / arcs.length);
      });
      if (!raf) frame(performance.now());
    }
    function at(pts, f) {
      var i = Math.min(Math.floor(f), pts.length - 2), r = f - i;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
    }
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      var T = now / 1000;
      var active = world.dataset.active;
      var since = introAt ? (now - introAt) / 1000 : -1;
      arcs.forEach(function (a, i) {
        var rev = reduce ? 1 : since < 0 ? 0 : clamp((since - i * 0.2) / 1.1, 0, 1);
        if (rev <= 0) return;
        rev = 1 - Math.pow(1 - rev, 3);
        var n = Math.max(1, Math.round(SEG * rev));
        var on = a.key === active;
        ctx.beginPath();
        ctx.moveTo(a.pts[0][0], a.pts[0][1]);
        for (var s = 1; s <= n; s++) ctx.lineTo(a.pts[s][0], a.pts[s][1]);
        ctx.strokeStyle = on ? 'rgba(160,226,255,.95)' : a.grad;
        ctx.lineWidth = on ? 1.7 : 1.1;
        ctx.stroke();
        if (rev < 1 || reduce) return;
        var local = (T + a.offset) % CYCLE;
        var u = local / a.dur;
        if (u <= 1) {
          var head = ease(u) * SEG, tail = Math.max(0, head - SEG * 0.24);
          ctx.lineCap = 'round';
          for (var k = Math.floor(tail); k < Math.floor(head); k++) {
            var al = (k - tail) / Math.max(1, head - tail);
            ctx.globalAlpha = al * al * (on ? 1 : 0.85);
            ctx.beginPath();
            ctx.moveTo(a.pts[k][0], a.pts[k][1]);
            ctx.lineTo(a.pts[k + 1][0], a.pts[k + 1][1]);
            ctx.strokeStyle = SKY;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          var p = at(a.pts, head);
          var g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 8);
          g.addColorStop(0, 'rgba(235,250,255,1)');
          g.addColorStop(0.3, 'rgba(76,201,255,.65)');
          g.addColorStop(1, 'rgba(76,201,255,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, Math.PI * 2); ctx.fill();
        } else {
          var rk = (local - a.dur) / 0.9;
          if (rk < 1) {
            ctx.beginPath();
            ctx.arc(a.end[0], a.end[1], 4 + rk * 16, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(76,201,255,' + ((1 - rk) * 0.7).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
    }
    function loop(now) { raf = 0; frame(now); if (visible && !doc.hidden) raf = requestAnimationFrame(loop); }
    function run() { if (!raf && visible && !doc.hidden && !reduce) raf = requestAnimationFrame(loop); }

    if (window.ResizeObserver) new ResizeObserver(build).observe(map); else window.addEventListener('resize', build);
    var img = $('img', map);
    if (img && !img.complete) img.addEventListener('load', build);
    build();
    onVisible(map, function (vis) {
      visible = vis;
      if (vis && !introAt) introAt = performance.now();
      if (reduce) frame(performance.now()); else run();
    }, { threshold: 0.25 });
    doc.addEventListener('visibilitychange', run);

    // 悬停信息卡
    var tip = $('.map-tip', map);
    function showTip(key) {
      var src = $('.place[data-tab="' + key + '"]', world);
      var pin = $('.pin[data-tab="' + key + '"]', map);
      if (!src || !pin || !tip) return;
      var grp = src.closest('[data-group]');
      $('.tip-group', tip).textContent = grp ? grp.dataset.group : '';
      $('.tip-name', tip).textContent = $('b', src).firstChild.textContent;
      $('.tip-desc', tip).textContent = $('.place-desc', src).textContent;
      var mw = map.clientWidth, mh = map.clientHeight;
      var px = pin._uv[0] * mw, py = pin._uv[1] * mh;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var x = px + 22;
      if (x + tw > mw - 8) x = px - 22 - tw;
      var y = clamp(py - th / 2, 8, Math.max(8, mh - th - 8));
      if (key === 'my' || key === 'id' || key === 'sg') { x = px - 22 - tw; }
      tip.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      tip.classList.add('is-on');
    }
    world.addEventListener('tabchange', function (e) { if (e.detail.user) showTip(e.detail.key); });
    world.addEventListener('pointerleave', function () { if (tip) tip.classList.remove('is-on'); });
  }

  /* ---------- 交付时间轴：进度线随滚动推进 ---------- */
  function initTimeline() {
    var tl = $('.timeline');
    if (!tl) return;
    var items = $$('.tl-item', tl);
    var now = $('[data-gate-now]'), name = $('[data-gate-name]'), bar = $('.gate-bar');
    function setMeter(i) {
      if (now) now.textContent = String(i + 1).padStart(2, '0');
      if (name) name.textContent = items[i].dataset.name;
    }
    if (reduce) {
      items.forEach(function (it) { it.classList.add('is-passed'); });
      tl.style.setProperty('--tp', 1);
      if (bar) bar.style.setProperty('--gp', 1);
      setMeter(items.length - 1);
      return;
    }
    tl.style.setProperty('--tp', 0);
    var ticking = false;
    function update() {
      ticking = false;
      var line = window.innerHeight * 0.58;
      var r = tl.getBoundingClientRect();
      tl.style.setProperty('--tp', clamp((line - r.top - 32) / Math.max(1, r.height - 64), 0, 1).toFixed(4));
      var cur = -1;
      items.forEach(function (it, i) {
        var nr = it.firstElementChild.getBoundingClientRect();
        var passed = nr.top + nr.height / 2 <= line;
        it.classList.toggle('is-passed', passed);
        if (passed) cur = i;
      });
      items.forEach(function (it, i) { it.classList.toggle('is-current', i === cur); });
      setMeter(Math.max(0, cur));
      if (bar) bar.style.setProperty('--gp', ((cur + 1) / items.length).toFixed(3));
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 卡片光斑、主按钮磁吸、复制邮箱 ---------- */
  function initPointerFx() {
    if (!fine) return;
    $$('[data-spot]').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    if (reduce) return;
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        b.style.transform = 'translate(' + (x * 10).toFixed(1) + 'px,' + (y * 8).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }
  function initCopy() {
    $$('[data-copy]').forEach(function (b) {
      var label = $('.copy-label', b), original = label ? label.textContent : '';
      function selectText() {
        var t = $(b.dataset.target);
        if (!t) return;
        var range = doc.createRange(); range.selectNodeContents(t);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      }
      b.addEventListener('click', function () {
        var done = function () {
          if (label) label.textContent = b.dataset.done;
          b.classList.add('is-done');
          setTimeout(function () { if (label) label.textContent = original; b.classList.remove('is-done'); }, 1800);
        };
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.dataset.copy).then(done, selectText);
          else selectText();
        } catch (err) { selectText(); }
      });
    });
  }

  /* ---------- 滚动编排（GSAP + ScrollTrigger） ---------- */
  function splitText(el) {
    var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [], out = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var frag = doc.createDocumentFragment();
      var parts = isEN ? n.textContent.split(/(\s+)/) : Array.from(n.textContent);
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(p)); return; }
        var s = doc.createElement('span');
        s.className = 'ch';
        s.textContent = p;
        frag.appendChild(s);
        out.push(s);
      });
      n.parentNode.replaceChild(frag, n);
    });
    return out;
  }
  function initMotion() {
    var g = window.gsap, ST = window.ScrollTrigger;
    if (!g || !ST || reduce) return;
    g.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    root.classList.add('has-motion');
    var E = 'expo.out';

    // 进场：动画期间关闭元素自身的 CSS 过渡，结束后清除内联样式，交还给 CSS 状态
    function reveal(targets, vars, trigger, start) {
      var els = typeof targets === 'string' ? $$(targets) : [].concat(targets).filter(Boolean);
      if (!els.length) return;
      els.forEach(function (e) { e.style.transition = 'none'; });
      var v = Object.assign({
        scrollTrigger: { trigger: trigger || els[0], start: start || 'top 86%', once: true },
        onComplete: function () {
          g.set(els, { clearProps: 'transform,opacity,visibility' });
          els.forEach(function (e) { e.style.transition = ''; });
        }
      }, vars);
      g.from(els, v);
    }

    // 首屏视差：文字上移淡出，背景下沉
    g.to('.hero-inner', { yPercent: -14, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('.hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // 各段标题：标签先滑入，主句从下方升起
    $$('.sec-head, .about-head').forEach(function (h) {
      var eb = $('.eyebrow', h);
      var rest = $$('.sec-title, .sec-lede', h);
      var tl = g.timeline({ scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
      tl.from(eb, { autoAlpha: 0, x: -18, duration: 0.7, ease: 'power3.out' });
      if (rest.length) tl.from(rest, { autoAlpha: 0, y: 34, duration: 1.1, ease: E, stagger: 0.12 }, '-=0.45');
    });

    // 公司介绍：随滚动逐字点亮
    var fill = $('[data-fill]');
    if (fill) {
      var chars = splitText(fill);
      var ink = css('--text'), blue = css('--blue-ink');
      g.set(chars, { color: css('--fill-from') });
      g.to(chars, {
        color: function (i, el) { return el.closest('em') ? blue : ink; },
        duration: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: fill, start: 'top 80%', end: 'bottom 40%', scrub: 0.6 }
      });
    }

    // 全过程四步：连线延伸，图标逐笔描出
    var lc = $('.lifecycle');
    if (lc) {
      var lcTl = g.timeline({ scrollTrigger: { trigger: lc, start: 'top 85%', once: true } });
      lcTl.fromTo(lc, { '--lc': 0 }, { '--lc': 1, duration: 1.8, ease: 'power2.inOut' })
        .from($$('li', lc), { autoAlpha: 0, y: 26, duration: 1, ease: E, stagger: 0.16, clearProps: 'transform,opacity,visibility' }, 0.05)
        .fromTo($$('.lc-node [pathLength]', lc), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.03, clearProps: 'strokeDasharray,strokeDashoffset' }, 0.2);
    }

    // 产业链：十层自下而上搭起来
    reveal('.chain-list .layer', { autoAlpha: 0, y: 18, duration: 0.7, ease: 'power3.out', stagger: { each: 0.055, from: 'end' } }, '.chain-list');
    reveal('.chain-filter button', { autoAlpha: 0, y: 10, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, '.chain-filter');
    if (!window.matchMedia('(max-width: 960px)').matches) reveal('.chain-panels', { autoAlpha: 0, x: 36, duration: 1.1, ease: E }, '.chain', 'top 80%');

    // 深色段落：从内缩圆角面板展开到全宽
    $$('.band').forEach(function (b) {
      g.fromTo($('.band-bg', b), { scaleX: 0.94, borderRadius: 28 }, { scaleX: 1, borderRadius: 0, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'top 15%', scrub: true } });
    });

    // 机房示意：管线先画出，部件按顺序亮起，最后开始流动
    var art = $('.facility-art');
    if (art) {
      var parts = $$('.part', art);
      parts.forEach(function (p) { p.style.transition = 'none'; });
      var fTl = g.timeline({ scrollTrigger: { trigger: art, start: 'top 82%', once: true }, onComplete: function () { parts.forEach(function (p) { p.style.transition = ''; }); } });
      fTl.fromTo($$('.flow-base', art), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.2, clearProps: 'strokeDasharray,strokeDashoffset' })
        .from(parts, { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power3.out', stagger: 0.07, clearProps: 'transform,opacity,visibility' }, 0)
        .from($$('.flow', art), { autoAlpha: 0, duration: 0.8, clearProps: 'opacity,visibility' }, 1.3);
      reveal('.facility .chip', { autoAlpha: 0, y: 12, duration: 0.6, ease: 'power3.out', stagger: 0.04 }, '.facility-side');
    }

    // 密度：机柜依次落位
    var grid = $('.rack-grid');
    if (grid) {
      ST.create({
        trigger: grid, start: 'top 85%', once: true,
        onEnter: function () {
          var on = $$('i.on', grid);
          on.forEach(function (e) { e.style.transition = 'none'; });
          g.from(on, { scale: 0, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.018, clearProps: 'transform,opacity,visibility', onComplete: function () { on.forEach(function (e) { e.style.transition = ''; }); } });
        }
      });
      reveal('.density-out > div', { autoAlpha: 0, x: -20, duration: 0.8, ease: E, stagger: 0.08 }, '.density-out');
    }

    // 供应链：三类设备汇合成一个整体，五步依次升起
    var bundle = $('.bundle');
    if (bundle) {
      var bTl = g.timeline({ scrollTrigger: { trigger: bundle, start: 'top 85%', once: true } });
      bTl.from($$('.bundle-in li', bundle), { autoAlpha: 0, x: -24, duration: 0.8, ease: E, stagger: 0.1, clearProps: 'transform,opacity,visibility' })
        .fromTo($$('.bundle-lines path', bundle), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, 0.3)
        .from($('.bundle-out', bundle), { autoAlpha: 0, scale: 0.92, duration: 0.9, ease: E, clearProps: 'transform,opacity,visibility' }, 0.75);
    }
    reveal('.pipe-steps li', { autoAlpha: 0, y: 30, duration: 0.9, ease: E, stagger: 0.1 }, '.pipe-steps');
    reveal('.pipe-panels', { autoAlpha: 0, y: 24, duration: 1, ease: E }, '.pipe-panels', 'top 90%');

    // 业务卡片：错落升起
    reveal('.biz-card', { autoAlpha: 0, y: 48, scale: 0.97, duration: 1.1, ease: E, stagger: 0.08 }, '.biz-grid', 'top 82%');

    // 全球布局：地图浮现，下方列表依次进场
    reveal('.map', { autoAlpha: 0, y: 30, duration: 1.4, ease: E }, '.map', 'top 88%');
    reveal('.world-list > *', { autoAlpha: 0, y: 30, duration: 1, ease: E, stagger: 0.1 }, '.world-list');

    // 交付：每一关卡片从右侧滑入
    $$('.tl-item').forEach(function (it) { reveal($('.tl-card', it), { autoAlpha: 0, x: 40, duration: 1, ease: E }, it, 'top 88%'); });

    // 原则：图标逐笔描出
    var pr = $('.principles');
    if (pr) {
      reveal('.principle', { autoAlpha: 0, y: 40, duration: 1.1, ease: E, stagger: 0.12 }, pr, 'top 85%');
      g.fromTo($$('.pr-ico [pathLength]', pr), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.05, delay: 0.3, clearProps: 'strokeDasharray,strokeDashoffset', scrollTrigger: { trigger: pr, start: 'top 85%', once: true } });
    }

    // 联系：标题升起，页脚图形缓慢视差
    reveal('.contact > *', { autoAlpha: 0, y: 36, duration: 1.1, ease: E, stagger: 0.1 }, '.contact', 'top 85%');
    g.fromTo('.footer-art', { yPercent: 18 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { ST.refresh(); });
    window.addEventListener('load', function () { ST.refresh(); });
  }

  function boot() {
    initTabs();
    initHeader();
    initCounters();
    initHeroField();
    initChain();
    initFacility();
    initDensity();
    initAutoplay();
    initMap();
    initTimeline();
    initPointerFx();
    initCopy();
    initMotion();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})();
