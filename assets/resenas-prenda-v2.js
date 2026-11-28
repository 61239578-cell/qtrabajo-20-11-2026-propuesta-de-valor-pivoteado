(function () {
  var cache = null, pend = null;
  function todas(cb) {
    if (cache) return cb(cache);
    if (pend) { pend.push(cb); return; }
    pend = [cb];
    window.Resenas.jsonp('resenas=1', function (r) {
      cache = (r && r.ok) ? r : { items: [] };
      var p = pend; pend = null; p.forEach(function (f) { f(cache); });
    });
  }
  function nombre(id) { try { var c = byId(id); return c ? c.n : ''; } catch (e) { return ''; } }
  function boton(el, pid, txt) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'btn o'; b.style.marginTop = '10px'; b.textContent = txt;
    b.onclick = function () { window.Resenas.dejar(pid, '', ''); };
    el.appendChild(b);
  }
  function llenar(el) {
    if (el.__sfr || !window.Resenas) return;
    el.__sfr = 1;
    var pid = el.getAttribute('data-pid'), n = nombre(pid), R = window.Resenas;
    todas(function (r) {
      var its = (r.items || []).filter(function (i) {
        return String(i.prenda_id || '') === pid || (n && String(i.prenda || '') === n);
      });
      if (!its.length) { boton(el, pid, 'Sé la primera en dejar una reseña de esta prenda'); return; }
      var prom = its.reduce(function (a, i) { return a + Number(i.estrellas || 0); }, 0) / its.length;
      el.innerHTML = '<h3>Reseñas de clientas <span class="st5">' + R.stars(Math.round(prom)) + '</span></h3>' +
        '<p class="lab">' + prom.toFixed(1) + '/5 · ' + its.length + (its.length === 1 ? ' reseña' : ' reseñas') + '</p>' +
        '<div style="display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px">' +
        its.map(function (i) {
          return '<div class="rv" style="min-width:230px;max-width:260px;scroll-snap-align:start;flex:0 0 auto"><b>' + R.esc(i.nombre || 'Clienta') + '</b> <span class="st5">' + R.stars(Number(i.estrellas || 0)) + '</span>' +
            (i.talla ? '<br><span class="lab">Talla ' + R.esc(i.talla) + '</span>' : '') +
            '<br>' + R.esc(i.comentario) +
            ((i.fotos || []).length ? '<div>' + i.fotos.map(function (f) { return '<img loading="lazy" alt="Foto de reseña" style="width:64px;height:64px;object-fit:cover;border-radius:6px;margin:6px 4px 0 0" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(f) + '&sz=w300">'; }).join('') + '</div>' : '') +
            '</div>';
        }).join('') + '</div>';
      boton(el, pid, 'Dejar mi reseña');
    });
  }
  function scan() { [].forEach.call(document.querySelectorAll('#sfr-prenda'), llenar); }
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
})();
