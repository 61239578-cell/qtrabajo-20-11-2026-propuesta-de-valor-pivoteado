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
