// 交互：选中切换（产业链、机房部件、交付步骤、布局）、密度滑块、进入视口时播放图示动画。
(function () {
  document.documentElement.classList.add('js');

  // 选中切换：[data-tabs] 内，带 data-tab 的按钮选中后，同 key 的 [data-panel] 显示、[data-hl] 高亮。
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    function select(key) {
      root.querySelectorAll('[data-tab]').forEach(function (b) {
        var on = b.dataset.tab === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      root.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== key; });
      root.querySelectorAll('[data-hl]').forEach(function (h) { h.classList.toggle('is-active', h.dataset.hl === key); });
      var prog = root.querySelector('[data-progress]');
      if (prog) {
        var keys = Array.prototype.map.call(root.querySelectorAll('.steps [data-tab]'), function (b) { return b.dataset.tab; });
        prog.style.setProperty('--p', keys.length > 1 ? keys.indexOf(key) / (keys.length - 1) : 0);
      }
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tab],[data-hl]');
      if (t && root.contains(t)) select(t.dataset.tab || t.dataset.hl);
    });
    if (root.hasAttribute('data-hover')) {
      root.addEventListener('pointerover', function (e) {
        var t = e.target.closest('[data-tab]');
        if (t && e.pointerType === 'mouse') select(t.dataset.tab);
      });
    }
    select(root.dataset.tabs);
  });

  // 密度滑块
  var dens = document.querySelector('[data-density]');
  if (dens) {
    var input = dens.querySelector('input');
    var bands = JSON.parse(dens.dataset.density);
    var grid = dens.querySelector('.rack-grid');
    var out = function (k) { return dens.querySelector('[data-out="' + k + '"]'); };
    var update = function () {
      var kw = Number(input.value);
      var n = Math.floor(1000 / kw);
      var band = bands.filter(function (b) { return kw <= b.max; })[0];
      var idx = bands.indexOf(band);
      out('kw').textContent = kw;
      out('racks').textContent = n;
      out('kind').textContent = band.kind;
      out('cooling').textContent = band.cooling;
      dens.dataset.band = idx;
      if (grid.childElementCount !== n) {
        var html = '';
        for (var i = 0; i < n; i++) html += '<i></i>';
        grid.innerHTML = html;
      }
    };
    input.addEventListener('input', update);
    update();
  }

  // 进入视口时播放图示动画
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }
})();
