(function () {
  'use strict';
  var SPACE = 'yisol/IDM-VTON', cli = null;
  async function conectar() {
    if (cli) return cli;
    var m = await import('https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js');
    cli = await m.Client.connect(SPACE);
    return cli;
  }
  async function blobDe(u) { var r = await fetch(u); if (!r.ok) throw new Error('No se pudo leer la imagen de la prenda'); return r.blob(); }
  window.HFVton = {
    api: async function () { var c = await conectar(); console.log(await c.view_api()); },
    simular: async function (foto, prendaUrl, desc, estado) {
      var c = await conectar(); if (estado) estado('Enviando a la IA (puede tardar 30–90 s)…');
      var g = await blobDe(prendaUrl);
      var r = await c.predict('/tryon', {
        dict: { background: foto, layers: [], composite: null },
        garm_img: g, garment_des: desc || 'prenda',
        is_checked: true, is_checked_crop: false, denoise_steps: 30, seed: 42
      });
      var d = r && r.data && r.data[0];
      return d && (d.url || d.path || d);
    }
  };
})();
/* Mejoras del probador IA: aviso, descargar, reintentar */
(function () {
  if (!window.HFVton || !HFVton.simular) return;
  var orig = HFVton.simular;
  HFVton.simular = function (foto, url, desc, estado) {
    var larga = /larga|largo|abrigo|vestido|falda|pantal|jean|short|enterizo|mono/i.test(String(desc || ''));
    try {
      if (estado) estado(larga
        ? 'Aviso: la IA suele fallar con prendas largas. Generando igual… puede tardar 1–2 min.'
        : 'Generando… puede tardar 1–2 min si hay cola.');
    } catch (e) {}
    return orig.apply(this, arguments);
  };
  new MutationObserver(function () {
    var out = document.getElementById('pv6-ia-out');
    if (!out) return;
    var img = out.querySelector('img');
    if (!img || out.querySelector('.pv6-acc')) return;
    var d = document.createElement('p');
    d.className = 'pv6-acc';
    d.style.cssText = 'display:flex;gap:8px;margin-top:8px';
    d.innerHTML = '<button type="button" class="btn" data-a="d">Descargar</button><button type="button" class="btn" data-a="r">Reintentar</button>';
    d.onclick = function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a === 'r') { var g = document.getElementById('pv6-ia-go'); if (g) g.click(); }
      if (a === 'd') {
        fetch(img.src).then(function (r) { return r.blob(); }).then(function (b) {
          var l = document.createElement('a');
          l.href = URL.createObjectURL(b);
          l.download = 'smartfit-simulacion.png';
          l.click();
        }).catch(function () { window.open(img.src, '_blank'); });
      }
    };
    out.appendChild(d);
  }).observe(document.body, { childList: true, subtree: true });
})();
