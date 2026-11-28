(function () {
  var C = window.CONFIG || window.CFG || {}, EP = C.ENDPOINT;
  if (!EP) return;
  var LS = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} };
  var vid = LS('sf_vid_res') || ('sf-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10));
  LS('sf_vid_res', vid);
  var ses = vid + '-' + Date.now().toString(36);
  var disp = /Mobi|Android/i.test(navigator.userAgent) ? 'móvil' : 'escritorio';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function post(o) {
    o.visitante_id = vid; o.sesion = ses;
    try { fetch(EP, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(o) }); } catch (e) {}
  }
  function jsonp(q, cb) {
    var n = 'sfcb' + Date.now() + Math.floor(Math.random() * 1e4), s = document.createElement('script'), done = false;
    window[n] = function (r) { done = true; cb(r); s.remove(); delete window[n]; };
    s.onerror = function () { if (!done) cb(null); };
    s.src = EP + (EP.indexOf('?') < 0 ? '?' : '&') + q + '&callback=' + n;
    document.body.appendChild(s);
  }
  function imp(ev, prenda) { post({ tipo: 'impresion', evento: ev, pagina: location.hash || '#inicio', prenda_id: prenda || '', dispositivo: disp, referrer: document.referrer || '' }); }
  imp('pagina_vista');
  window.addEventListener('hashchange', function () { imp('pagina_vista'); });

  var st = document.createElement('style');
  st.textContent = '#sfr-b{position:fixed;left:14px;bottom:84px;z-index:9998;background:#1a2a4a;color:#fff;border:0;border-radius:24px;padding:10px 16px;font:600 13px system-ui;cursor:pointer;box-shadow:0 3px 10px #0004}' +
    '#sfr-m{position:fixed;inset:0;background:#000a;z-index:9999;display:none;align-items:center;justify-content:center;padding:10px}#sfr-m.on{display:flex}' +
    '#sfr-c{background:#fff;color:#222;width:min(560px,100%);max-height:92vh;overflow:auto;border-radius:14px;padding:16px;font:14px system-ui}' +
    '#sfr-c h3{margin:0 0 8px}#sfr-c label{display:block;margin:10px 0 4px;font-weight:600}#sfr-c input,#sfr-c select,#sfr-c textarea{width:100%;padding:8px;border:1px solid #bbb;border-radius:8px;font:inherit;box-sizing:border-box}' +
    '.sfr-t{display:flex;gap:6px;margin-bottom:10px}.sfr-t button{flex:1;padding:8px;border:1px solid #1a2a4a;background:#fff;color:#1a2a4a;border-radius:8px;cursor:pointer}.sfr-t button.on{background:#1a2a4a;color:#fff}' +
    '.sfr-st button{background:none;border:0;font-size:30px;cursor:pointer;color:#ccc;padding:0 2px}.sfr-st button.on{color:#e0a100}' +
    '.sfr-go{margin-top:12px;width:100%;padding:11px;border:0;border-radius:8px;background:#c9a24a;color:#111;font-weight:700;cursor:pointer}.sfr-go:disabled{opacity:.5}' +
    '.sfr-it{border-bottom:1px solid #eee;padding:10px 0}.sfr-ph img{width:64px;height:64px;object-fit:cover;border-radius:6px;margin:4px 4px 0 0}.sfr-ok{background:#e7f6ea;border-radius:8px;padding:10px;margin-top:10px;color:#222}';
  document.head.appendChild(st);
  var b = document.createElement('button'); b.id = 'sfr-b'; b.type = 'button'; b.textContent = '★ Reseñas'; document.body.appendChild(b);
  var m = document.createElement('div'); m.id = 'sfr-m'; m.innerHTML = '<div id="sfr-c" role="dialog" aria-label="Reseñas"></div>'; document.body.appendChild(m);
  var box = m.firstChild;
  m.addEventListener('click', function (e) { if (e.target === m) m.classList.remove('on'); });
  b.onclick = function () { m.classList.add('on'); imp('abrir_resenas'); tab('ver'); };
  function cat() { try { return CAT || []; } catch (e) { return []; } }
  function stars(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
  function tab(w) {
    box.innerHTML = '<div style="display:flex;justify-content:space-between"><h3>Reseñas de clientes</h3><button type="button" id="sfr-x" style="border:0;background:none;font-size:22px;cursor:pointer" aria-label="Cerrar">×</button></div>' +
      '<div class="sfr-t"><button type="button" data-w="ver" class="' + (w === 'ver' ? 'on' : '') + '">Ver reseñas</button><button type="button" data-w="dejar" class="' + (w === 'dejar' ? 'on' : '') + '">Dejar mi reseña</button></div><div id="sfr-body"></div>';
    box.querySelector('#sfr-x').onclick = function () { m.classList.remove('on'); };
    [].forEach.call(box.querySelectorAll('.sfr-t button'), function (x) { x.onclick = function () { tab(x.getAttribute('data-w')); }; });
    (w === 'ver' ? lista : form)(box.querySelector('#sfr-body'));
  }
  function lista(el) {
    el.textContent = 'Cargando…';
    jsonp('resenas=1', function (r) {
      if (!r || !r.ok) { el.textContent = 'No se pudieron cargar las reseñas.'; return; }
      if (!r.total) { el.innerHTML = '<p>Aún no hay reseñas aprobadas. ¡Sé el primero en dejar la tuya!</p>'; return; }
      el.innerHTML = '<p><b style="color:#e0a100">' + stars(Math.round(r.promedio)) + '</b> ' + r.promedio + '/5 · ' + r.total + ' reseñas' + (r.recomiendan_pct != null ? ' · ' + r.recomiendan_pct + '% recomienda la página' : '') + '</p>' +
        r.items.map(function (i) {
          return '<div class="sfr-it"><b style="color:#e0a100">' + stars(i.estrellas) + '</b> <b>' + esc(i.nombre) + '</b> · ' + esc(i.prenda) + (i.talla ? ' · talla ' + esc(i.talla) : '') + '<p style="margin:4px 0">' + esc(i.comentario) + '</p><div class="sfr-ph">' +
            i.fotos.map(function (f) { return '<img loading="lazy" alt="Foto de reseña" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(f) + '&sz=w300">'; }).join('') + '</div></div>';
        }).join('');
    });
  }
  function comprimir(file) {
    return new Promise(function (ok, no) {
      var im = new Image(), u = URL.createObjectURL(file);
      im.onload = function () {
        var k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        ok(c.toDataURL('image/jpeg', 0.7));
      };
      im.onerror = no; im.src = u;
    });
  }
  function form(el) {
    var n = 0, fotos = [];
    var ops = '<option value="">General (la tienda)</option>' + cat().map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.n) + '</option>'; }).join('');
    var tl = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map(function (t) { return '<option>' + t + '</option>'; }).join('');
    el.innerHTML = '<label>Prenda</label><select id="sfr-p">'
