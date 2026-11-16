// 交互：手机导航、询价表单。配置由页面内的 window.NOURRA 提供（来自 site.config.json 与文案文件）。
(function () {
  var cfg = window.NOURRA || { text: {} };
  var T = cfg.text;

  // 手机导航
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // 询价表单
  var form = document.getElementById('enquiry');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');
  var fill = function (s, v) { return s.replace('{email}', cfg.email).replace('{field}', v || ''); };

  function validate() {
    var first = null;
    form.querySelectorAll('[required]').forEach(function (el) {
      var err = document.getElementById('e-' + el.name);
      var label = form.querySelector('label[for="' + el.id + '"]').textContent;
      var msg = '';
      if (!el.value.trim()) msg = fill(T.invalid, label);
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) msg = T.invalidEmail;
      err.textContent = msg;
      err.hidden = !msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }

  function setStatus(text, kind) {
    status.textContent = text;
    status.dataset.kind = kind || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('');
    if (!validate()) return;
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });

    if (!cfg.endpoint) {
      // 未接入在线提交：打开访客的邮件客户端，不显示“提交成功”。
      var lines = [];
      form.querySelectorAll('label').forEach(function (l) {
        var el = document.getElementById(l.htmlFor);
        if (el) lines.push(l.textContent + '：' + el.value.trim());
      });
      window.location.href =
        'mailto:' + cfg.email +
        '?subject=' + encodeURIComponent(T.mailSubject + ' - ' + data.company) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      setStatus(fill(T.mailtoDone), 'info');
      return;
    }

    button.disabled = true;
    button.textContent = T.sending;
    fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus(T.sent, 'ok');
      })
      .catch(function () {
        setStatus(fill(T.failed), 'error');
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = T.submitButton;
      });
  });
})();
