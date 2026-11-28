(function () {
  function wait(cb, n) { n = n || 0; if (window.Resenas && window.Resenas.jsonp && window.Resenas.dejar) return cb(); if (n < 40) setTimeout(function () { wait(cb, n + 1); }, 250); }
  wait(function () {
    var R = window.Resenas, esc = R.esc, stars = R.stars, cache = {}, tm = 0;
    var st = document.createElement('style');
    st.textContent =
      '#sfr-strip,.sfr-box{background:#fff;border:1px solid #c9d3e2;border-radius:12px;padding:14px;margin:24px auto;max-width:1000px;color:#14243a;font:14px system-ui}' +
      '#sfr-strip *,.sfr-box *{-webkit-text-fill-color:currentColor}' +
      '.sfr-h{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}' +
      '.sfr-sc{margin-left:8px;font-size:13px;color:#4a5a70}.sfr-s{color:#e0a100!important;-webkit-text-fill-color:#e0a100!important;letter-spacing:1px}' +
      '.sfr-w{background:#14243a;color:#fff;border:0;border-radius:8px;padding:8px 12px;font:600 13px system-ui;cursor:pointer;margin:4px 4px 0 0}' +
      '.sfr-w{-webkit-text-fill-color:#fff!important}' +
      '.sfr-wrap{position:relative}' +
      '.sfr-rail{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}' +
      '.sfr-cd{flex:0 0 250px;scroll-snap-align:start;border:1px solid #e1e7f0;border-radius:10px;padding:12px;background:#f8fafd}' +
      '.sfr-cd img{width:100%;height:150px;object-fit:cover;border-radius:8px;margin-bottom:8px}' +
      '.sfr-tx{margin:6px 0;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer}.sfr-tx.open{-webkit-line-clamp:unset;display:block}' +
      '.sfr-nm{margin:6px 0 0;font-size:13px;color:#4a5a70}' +
      '.sfr-ar{position:absolute;top:45%;z-index:2;width:34px;height:34px;border-radius:50%;border:1px solid #c9d3e2;background:#fff;color:#14243a;font-size:20px;cursor:pointer;box-shadow:0 2px 6px #0003}' +
      '.sfr-ar[data-d="-1"]{left:-6px}.sfr-ar[data-d="1"]{right:-6px}' +
      '@media(max-width:600px){.sfr-ar{display:none}.sfr-cd{flex-basis:78%}}' +
      '.sfr-ld{margin:6px 0;color:#4a5a70}';
    document.head.appendChild(st);

    function host() { return document.querySelector('section.pg') || document.querySelector('main') || document.body; }
    function idPrenda() {
      var parts = decodeURIComponent(location.hash || '').replace(/^#/, '').split(/[\/?=&]/);
      for (var i = parts.length - 1; i >= 0; i--) { var p = parts[i]; if (p && typeof byId === 'function' && byId(p)) return p; }
      return '';
    }
    function corto(n) { var a = String(n || '').trim().split(/\s+/); return a[0] ? a[0] + (a[1] ? ' ' + a[1].charAt(0).toUpperCase() + '.' : '') : ''; }
    function card(i) {
      var f = (i.fotos && i.fotos[0]) ? '<a href="https://drive.google.com/thumbnail?id=' + encodeURIComponent(i.fotos[0]) + '&sz=w1200" target="_blank" rel="noopener"><img loading="lazy" alt="Foto de la reseña de ' + esc(i.nombre) + '" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(i.fotos[0]) + '&sz=w400"></a>' : '';
      return '<article class="sfr-cd">' + f + '<div class="sfr-s">' + stars(i.estrellas) + '</div><p class="sfr-tx">' + esc(i.comentario) + '</p><p class="sfr-nm"><b>' + esc(i.nombre) + '</b>' + (i.talla ? ' · talla ' + esc(i.talla) : '') + '</p></article>';
    }
    function pintar(id, el, r) {
      var c = byId(id) || {}, items = (r && r.ok) ? r.items : [], cuerpo;
      var cab = '<div class="sfr-h"><div><b>Reseñas de ' + esc(c.n || 'esta prenda') + '</b>' + (r && r.total ? '<span class="sfr-sc"><span class="sfr-s">' + stars(Math.round(r.promedio)) + '</span> ' + r.promedio + ' · ' + r.total + (r.total === 1 ? ' reseña' : ' reseñas') + '</span>' : '') + '</div><button type="button" class="sfr-w">Dejar mi reseña</button></div>';
      if (!r || !r.ok) cuerpo = '<p class="sfr-ld">No se pudieron cargar las reseñas.</p>';
      else if (!items.length) cuerpo = '<p class="sfr-ld">Aún no hay reseñas de esta prenda. ¡Sé la primera persona en opinar!</p>';
      else cuerpo = '<div class="sfr-wrap"><button type="button" class="sfr-ar" data-d="-1" aria-label="Anterior">‹</button><div class="sfr-rail">' + items.map(card).join('') + '</div><button type="button" class="sfr-ar" data-d="1" aria-label="Siguiente">›</button></div>';
      el.innerHTML = cab + cuerpo;
    }
    function tira(id) {
      if (document.querySelector('#sfr-strip[data-id="' + id + '"]')) return;
      [].forEach.call(document.querySelectorAll('#sfr-strip'), function (x) { x.remove(); });
      var el = document.createElement('div'); el.id = 'sfr-strip'; el.setAttribute('data-id', id);
      el.innerHTML = '<p class="sfr-ld">Cargando reseñas…</p>';
      host().appendChild(el);
      var c = cache[id];
      if (c && Date.now() - c.t < 60000) { pintar(id, el, c.r); return; }
      R.jsonp('resenas=1&prenda=' + encodeURIComponent(id), function (r) {
        cache[id] = { t: Date.now(), r: r };
        var e2 = document.querySelector('#sfr-strip[data-id="' + id + '"]'); if (e2) pintar(id, e2, r);
      });
    }
    function gracias() {
      if (location.hash !== '#gracias' || document.getElementById('sfr-gr')) return;
      var o = null; try { o = JSON.parse(sessionStorage.getItem('sfc_ultimo_pedido') || 'null'); } catch (e) {}
      if (!o || !o.line_items || !o.line_items.length) return;
      var vistos = {}, btns = '';
      o.line_items.forEach(function (l) {
        if (vistos[l.id]) return; vistos[l.id] = 1;
        var c = byId(l.id); if (!c) return;
        btns += '<button type="button" class="sfr-w" data-pid="' + esc(l.id) + '" data-t="' + esc(l.talla || '') + '">★ ' + esc(c.n) + '</button>';
      });
      if (!btns) return;
      var el = document.createElement('div'); el.id = 'sfr-gr'; el.className = 'sfr-box';
      el.innerHTML = '<b>¿Cómo te fue con tu compra?</b><p>Deja tu reseña de cada prenda y recibe un cupón de 5% para tu próxima compra. Aparecerá en la ficha de la prenda con tu nombre.</p>' + btns;
      host().appendChild(el);
    }
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('.sfr-w,.sfr-ar,.sfr-tx'); if (!t) return;
      if (t.classList.contains('sfr-tx')) { t.classList.toggle('open'); return; }
      if (t.classList.contains('sfr-ar')) { var rail = t.parentNode.querySelector('.sfr-rail'); if (rail) rail.scrollBy({ left: 270 * (+t.getAttribute('data-d')), behavior: 'smooth' }); return; }
      var pid = t.getAttribute('data-pid'), tl = t.getAttribute('data-t') || '', nom = '';
      if (!pid) { var s = t.closest('#sfr-strip'); pid = s ? s.getAttribute('data-id') : ''; }
      try { var o = JSON.parse(sessionStorage.getItem('sfc_ultimo_pedido') || 'null'); if (o && o.cliente) nom = corto(o.cliente); } catch (x) {}
      if (!nom && window.CLI && CLI.n) nom = corto(CLI.n);
      R.dejar(pid, nom, tl);
    });
    function tick() {
      var id = idPrenda();
      if (id) tira(id); else { var x = document.getElementById('sfr-strip'); if (x) x.remove(); }
      gracias();
    }
    new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(tick, 350); }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () { setTimeout(tick, 500); });
    tick();
  });
})();
