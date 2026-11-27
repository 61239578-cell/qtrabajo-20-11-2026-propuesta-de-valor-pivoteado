(function () {
  'use strict';
  var UMBRAL_FRIO = 52, UMBRAL_CALIDO = 60;   // ajustables: ángulo de matiz del tono de piel
  var VER = '0.10.14';
  var BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@' + VER;
  var MODELO = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
    var landmarker = null, fotoUrl = '', generoSel = 'mujer';

  var PALETAS = {
    'cálido': [['Terracota', '#C0583A'], ['Mostaza', '#D4A017'], ['Verde oliva', '#6B7A2F'], ['Camel', '#C19A6B'], ['Coral', '#E9785D'], ['Crema', '#F2E6CF']],
    'frío': [['Azul marino', '#1F2A5A'], ['Esmeralda', '#0F7B5F'], ['Fucsia', '#C2185B'], ['Lavanda', '#9C8AD1'], ['Gris azulado', '#6C7A89'], ['Blanco', '#F7F9FC']],
    'neutro': [['Verde azulado', '#2E8B8B'], ['Rosa palo', '#D9A5A5'], ['Azul petróleo', '#2B5D73'], ['Vino', '#7B2D3B'], ['Gris', '#8A8D91'], ['Beige', '#D8C7B0']]
  };

  function rgb2lab(r, g, b) {
    function f(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    var R = f(r), G = f(g), B = f(b);
    var X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, Y = R * 0.2126 + G * 0.7152 + B * 0.0722, Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
    function t(v) { return v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116; }
    var fx = t(X), fy = t(Y), fz = t(Z);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }
  function cssLab(color) {
    var c = document.createElement('canvas'); c.width = c.height = 1;
    var x = c.getContext('2d'); x.fillStyle = '#999'; x.fillStyle = color; x.fillRect(0, 0, 1, 1);
    var d = x.getImageData(0, 0, 1, 1).data; return rgb2lab(d[0], d[1], d[2]);
  }
  function dist(a, b) { return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)); }
  function mediana(a) { a = a.slice().sort(function (x, y) { return x - y; }); return a[Math.floor(a.length / 2)]; }

  function muestrear(img, lm) {
    var w = Math.min(img.naturalWidth, 800), h = Math.round(w * img.naturalHeight / img.naturalWidth);
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, w, h);
    var R = [], G = [], B = [], mitad = Math.max(3, Math.round(w * 0.008));
    [50, 280, 205, 425, 151].forEach(function (i) {
      var x = Math.round(lm[i].x * w), y = Math.round(lm[i].y * h);
      var x0 = Math.max(0, x - mitad), y0 = Math.max(0, y - mitad);
      var d = cx.getImageData(x0, y0, Math.min(2 * mitad, w - x0), Math.min(2 * mitad, h - y0)).data;
      for (var k = 0; k < d.length; k += 4) { R.push(d[k]); G.push(d[k + 1]); B.push(d[k + 2]); }
    });
    return [mediana(R), mediana(G), mediana(B)];
  }
  function clasificar(lab) {
    var h = Math.atan2(lab[2], lab[1]) * 180 / Math.PI;
    var sub = h < UMBRAL_FRIO ? 'frío' : (h > UMBRAL_CALIDO ? 'cálido' : 'neutro');
    var prof = lab[0] >= 70 ? 'clara' : (lab[0] >= 55 ? 'media' : 'profunda');
    return { sub: sub, prof: prof, h: Math.round(h) };
  }
  function recomendar(sub) {
    var pal = PALETAS[sub].map(function (p) { return cssLab(p[1]); }), out = [];
    (window.CAT || []).forEach(function (c) {
      if (!(Number(c.pr) > 0)) return;
      var mejor = null;
      (c.c || []).forEach(function (n) {
        var v = window.COL && window.COL[n]; if (!v) return;
        var l = cssLab(v), d = Math.min.apply(null, pal.map(function (p) { return dist(l, p); }));
        if (!mejor || d < mejor.d) mejor = { d: d, color: n };
      });
      if (mejor) out.push({ c: c, d: mejor.d, color: mejor.color });
    });
    return out.sort(function (a, b) { return a.d - b.d; }).slice(0, 6);
  }
  function recomendarTodas(sub, genero) {
    var pal = PALETAS[sub].map(function (p) { return cssLab(p[1]); }), out = [];
    (window.CAT || []).forEach(function (c) {
      if (!(Number(c.pr) > 0)) return;
      if (genero && c.gender !== genero) return;
      var mejor = null;
      (c.c || []).forEach(function (n) {
        var v = window.COL && window.COL[n]; if (!v) return;
        var l = cssLab(v), d = Math.min.apply(null, pal.map(function (p) { return dist(l, p); }));
        if (!mejor || d < mejor.d) mejor = { d: d, color: n };
      });
      if (mejor) out.push({ c: c, d: mejor.d, color: mejor.color });
    });
    out.sort(function (a, b) { return a.d - b.d; });
    out.forEach(function (x) { x.nivel = x.d < 15 ? '⭐ Te favorece mucho' : (x.d < 40 ? '✓ Te favorece' : '○ Combínala con tus colores'); });
    return out;
  }
  async function cargarMP() {
    if (landmarker) return landmarker;
    var m = await import(BASE + '/vision_bundle.mjs');
    var fs = await m.FilesetResolver.forVisionTasks(BASE + '/wasm');
    landmarker = await m.FaceLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: MODELO }, runningMode: 'IMAGE', numFaces: 1 });
    return landmarker;
  }

  var css = '#col-p{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;padding:12px}' +
    '#col-p.on{display:flex}#col-w{background:#fff;color:#111;border-radius:14px;max-width:560px;width:100%;max-height:92vh;overflow:auto;padding:18px;font:14px sans-serif}' +
    '#col-w h2{margin:0 0 8px}#col-w img.prev{max-width:100%;max-height:240px;border-radius:10px;display:block;margin:10px 0}' +
    '.col-b{background:#07162e;color:#fff;border:0;border-radius:8px;padding:10px 14px;cursor:pointer;font-weight:600;display:inline-block}' +
    '.col-sw{display:inline-block;width:46px;margin:4px;text-align:center;font-size:11px}.col-sw i{display:block;height:36px;border-radius:8px;border:1px solid #ccc}' +
    '.col-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:8px}' +
    '.col-c{border:1px solid #e1e3e8;border-radius:10px;padding:8px;text-decoration:none;color:#111;font-size:13px}.col-c img{width:100%;height:130px;object-fit:cover;border-radius:8px}' +
    '.col-fine{font-size:12px;color:#555}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var p = document.createElement('div'); p.id = 'col-p';
   p.innerHTML = '<div id="col-w" role="dialog" aria-modal="true"><div style="display:flex;justify-content:space-between"><h2>🎨 Colorimetría</h2><button class="col-b" id="col-x" type="button">Cerrar</button></div>' +
    '<p class="col-fine">Sube una foto de tu rostro con <b>luz natural</b>, sin filtros ni maquillaje fuerte. La foto se analiza solo en tu navegador: no se sube ni se guarda. El resultado es <b>aproximado</b> (la luz cambia el color).</p>' +
    '<p class="col-fine"><b>¿Para qué sección buscas ropa?</b> (esto lo eliges tú, no se detecta de la foto)</p>' +
    '<div style="margin-bottom:10px"><button type="button" class="col-b" id="col-g-mujer">♀ Mujer</button> <button type="button" class="col-b" id="col-g-hombre" style="background:#ccc;color:#111">♂ Hombre</button></div>' +
    '<label class="col-b" for="col-f">📷 Elegir o tomar foto</label><input id="col-f" type="file" accept="image/jpeg,image/png,image/webp" capture="user" style="display:none">' +
    '<p id="col-s" role="status"></p><div id="col-i"></div><div id="col-r"></div></div>';
  document.body.appendChild(p);

  function $(id) { return document.getElementById(id); }
  function estado(t) { $('col-s').textContent = t; }
  function abrir() { p.classList.add('on'); }
  function cerrar() {
    p.classList.remove('on');
    if (fotoUrl) { URL.revokeObjectURL(fotoUrl); fotoUrl = ''; }
    $('col-i').innerHTML = ''; $('col-r').innerHTML = ''; estado('');
    if (location.hash === '#colorimetria') location.hash = '#inicio';
  }
    $('col-x').onclick = cerrar;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  function marcarGenero(g) {
    generoSel = g;
    $('col-g-mujer').style.background = g === 'mujer' ? '#07162e' : '#ccc';
    $('col-g-mujer').style.color = g === 'mujer' ? '#fff' : '#111';
    $('col-g-hombre').style.background = g === 'hombre' ? '#07162e' : '#ccc';
    $('col-g-hombre').style.color = g === 'hombre' ? '#fff' : '#111';
  }
  marcarGenero('mujer');
  $('col-g-mujer').onclick = function () { marcarGenero('mujer'); };
  $('col-g-hombre').onclick = function () { marcarGenero('hombre'); };

  function mostrar(res, rgb) {
    var r = $('col-r'); r.innerHTML = '';
    var h = document.createElement('h3'); h.textContent = 'Subtono ' + res.sub + ' · piel ' + res.prof; r.appendChild(h);
    var m = document.createElement('div'); m.style.cssText = 'display:inline-block;width:28px;height:28px;border-radius:50%;vertical-align:middle;border:1px solid #ccc;background:rgb(' + rgb.join(',') + ')';
    r.appendChild(m); r.appendChild(document.createTextNode(' Tono de piel detectado'));
    var t = document.createElement('p'); t.textContent = 'Colores que te favorecen:'; r.appendChild(t);
    PALETAS[res.sub].forEach(function (c) {
      var s = document.createElement('span'); s.className = 'col-sw';
      var i = document.createElement('i'); i.style.background = c[1]; s.appendChild(i); s.appendChild(document.createTextNode(c[0])); r.appendChild(s);
    });
    var t2 = document.createElement('p'); t2.textContent = 'Todas las prendas de ' + generoSel + ', de la que más a la que menos te favorece:'; r.appendChild(t2);
    var g = document.createElement('div'); g.className = 'col-g';
        recomendarTodas(res.sub, generoSel).forEach(function (x) {
      var a = document.createElement('a'); a.className = 'col-c'; a.href = '#producto/' + encodeURIComponent(x.c.id);
      a.onclick = function () { cerrar(); };
      var f = (window.IMG || {})[x.c.id + '_' + x.color] || (window.IMG || {})[x.c.id];
      if (f) { var im = document.createElement('img'); im.src = f; im.alt = x.c.n; a.appendChild(im); }
      var n = document.createElement('b'); n.textContent = x.c.n; a.appendChild(n);
      var d = document.createElement('div'); d.textContent = x.nivel + ' · Color: ' + x.color + ' · S/ ' + Number(x.c.pr).toFixed(2); a.appendChild(d);
      g.appendChild(a);
    });
    r.appendChild(g);
  }

  $('col-f').onchange = async function () {
    var f = this.files && this.files[0]; this.value = '';
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type) || f.size > 5 * 1024 * 1024) { estado('Usa una foto JPG, PNG o WEBP de máximo 5 MB.'); return; }
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    fotoUrl = URL.createObjectURL(f); $('col-r').innerHTML = '';
    var img = new Image();
    img.onload = async function () {
      $('col-i').innerHTML = ''; img.className = 'prev'; img.alt = 'Tu foto'; $('col-i').appendChild(img);
      estado('Analizando (la primera vez descarga el modelo, puede tardar unos segundos)…');
      try {
        var lmk = await cargarMP();
        var det = lmk.detect(img);
        if (!det.faceLandmarks || !det.faceLandmarks.length) { estado('No encontré un rostro. Prueba con una foto frontal y bien iluminada.'); return; }
        var rgb = muestrear(img, det.faceLandmarks[0]);
        mostrar(clasificar(rgb2lab(rgb[0], rgb[1], rgb[2])), rgb);
        estado('Listo. Recuerda que es una estimación aproximada.');
      } catch (e) { console.log('Colorimetría:', e); estado('No pude analizar la foto en este momento. Intenta de nuevo.'); }
    };
    img.onerror = function () { estado('No se pudo leer la imagen.'); };
    img.src = fotoUrl;
  };

  function enlace() {
    var nv = $('nv'); if (!nv || $('col-nav')) return;
    var a = document.createElement('a'); a.id = 'col-nav'; a.href = '#colorimetria'; a.textContent = 'Colorimetría';
    a.onclick = function (e) { e.preventDefault(); abrir(); };
    nv.appendChild(a);
  }
  enlace();
  window.addEventListener('hashchange', function () { if (location.hash === '#colorimetria') abrir(); });
  if (location.hash === '#colorimetria') abrir();
})();
