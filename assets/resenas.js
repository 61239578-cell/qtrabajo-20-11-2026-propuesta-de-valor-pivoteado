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
    el.innerHTML = '<label>Prenda</label><select id="sfr-p">' + ops + '</select><label>Talla que compraste</label><select id="sfr-t"><option value="">—</option>' + tl + '</select>' +
      '<label>Tu calificación</label><div class="sfr-st" id="sfr-s">' + [1, 2, 3, 4, 5].map(function (i) { return '<button type="button" data-n="' + i + '" aria-label="' + i + ' estrellas">★</button>'; }).join('') + '</div>' +
      '<label>Tu reseña (mín. 10 caracteres)</label><textarea id="sfr-c2" rows="4" maxlength="600"></textarea>' +
      '<label>Tu nombre (opcional)</label><input id="sfr-n" maxlength="60">' +
      '<label>¿Recomiendas esta página?</label><select id="sfr-r"><option value="">—</option><option value="si">Sí, la recomiendo</option><option value="no">No</option></select>' +
      '<label>Fotos (hasta 3, opcional)</label><input type="file" id="sfr-f" accept="image/*" multiple><div class="sfr-ph" id="sfr-pv"></div>' +
      '<p style="font-size:12px;color:#666">Tu reseña y fotos se publican después de ser revisadas. No subas fotos de menores. Al enviar, ganas un 5% de descuento en tu próxima compra.</p>' +
      '<button type="button" class="sfr-go" id="sfr-go">Enviar reseña</button><div id="sfr-msg" role="status"></div>';
    [].forEach.call(el.querySelectorAll('#sfr-s button'), function (x) {
      x.onclick = function () { n = +x.getAttribute('data-n'); [].forEach.call(el.querySelectorAll('#sfr-s button'), function (y) { y.classList.toggle('on', +y.getAttribute('data-n') <= n); }); };
    });
    el.querySelector('#sfr-f').onchange = function (e) {
      var fs = [].slice.call(e.target.files, 0, 3); fotos = []; el.querySelector('#sfr-pv').innerHTML = '';
      fs.forEach(function (f) { comprimir(f).then(function (d) { fotos.push(d); el.querySelector('#sfr-pv').insertAdjacentHTML('beforeend', '<img alt="Vista previa" src="' + d + '">'); }); });
    };
    el.querySelector('#sfr-go').onclick = function () {
      var msg = el.querySelector('#sfr-msg'), com = el.querySelector('#sfr-c2').value.trim();
      if (!n) { msg.textContent = 'Marca tus estrellas.'; return; }
      if (com.length < 10) { msg.textContent = 'Escribe al menos 10 caracteres.'; return; }
      var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8), go = el.querySelector('#sfr-go');
      go.disabled = true; msg.textContent = 'Enviando…';
      post({ tipo: 'resena', resena_id: id, prenda_id: el.querySelector('#sfr-p').value, talla: el.querySelector('#sfr-t').value, estrellas: n, comentario: com, nombre: el.querySelector('#sfr-n').value, recomienda: el.querySelector('#sfr-r').value, fotos: fotos });
      var intentos = 0;
      (function pedir() {
        intentos++;
        jsonp('mi_cupon=' + id, function (r) {
          if (r && r.ok) {
            msg.innerHTML = '<div class="sfr-ok">¡Gracias! Tu reseña será publicada tras revisión.' + (r.cupon ? '<br>Tu cupón de <b>' + r.descuento + '%</b> para tu próxima compra: <b>' + esc(r.cupon) + '</b> (guárdalo, vence en 60 días).' : '<br>Ya habías recibido tu cupón por reseña.') + '</div>';
            imp('resena_enviada'); return;
          }
          if (intentos < 4) setTimeout(pedir, 2500); else { msg.textContent = 'Se envió, pero no pudimos confirmarlo. Revisa en unos minutos.'; go.disabled = false; }
        });
      })();
    };
  }

  /* ---- Cupón por pagar el adelanto del 50% (se muestra en #gracias) ---- */
  function cuponPago() {
    if (location.hash !== '#gracias') return;
    var o = null; try { o = JSON.parse(sessionStorage.getItem('sfc_ultimo_pedido') || 'null'); } catch (e) {}
    if (!o || String(o.canal || '').indexOf('Yape') !== 0 || !o.codigo_seguimiento) return;
    var n = 0;
    (function pedir() {
      n++;
      jsonp('cupon_pago=' + encodeURIComponent(o.codigo_seguimiento) + '&telefono4=' + String(o.telefono || '').slice(-4), function (r) {
        if (r && r.ok && r.cupon) {
          var sec = document.querySelector('section.pg');
          if (sec && !document.getElementById('sfr-cp')) sec.insertAdjacentHTML('beforeend', '<div id="sfr-cp" class="sfr-ok" style="margin-top:16px">Por pagar tu adelanto del 50% tienes un cupón de <b>5%</b> para tu próxima compra: <b>' + esc(r.cupon) + '</b> (vence en 60 días).</div>');
        } else if (n < 4) setTimeout(pedir, 3000);
      });
    })();
  }
  window.addEventListener('hashchange', function () { setTimeout(cuponPago, 800); });
  setTimeout(cuponPago, 800);

  window.Resenas = { jsonp: jsonp, esc: esc, stars: stars,
    dejar: function (pid, nombre, talla) {
      m.classList.add('on'); tab('dejar');
      var p = box.querySelector('#sfr-p'); if (p && pid) p.value = pid;
      var t = box.querySelector('#sfr-t'); if (t && talla) t.value = talla;
      var n = box.querySelector('#sfr-n'); if (n && nombre) n.value = nombre;
    },
  window.Resenas = { abrir: function () { b.click(); }, vid: vid };
})();
