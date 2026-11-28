/* SMART FIT CUSCO — Asistente de tallas v2.
   Se carga después de assets/app.js. Reemplaza solo el asistente (pasos 0 a 2), la talla por prenda
   (probador y ficha de producto) y no toca el resto de la tienda.
   Usa la tabla CFG.TABLAS_TALLAS (límites corporales por talla) y el catálogo CAT tal como están. */
(function () {
  'use strict';
  /* ---- Ajustes editables (cm) ---- */
  var T = {
    pref: { ajustado: -2, normal: 0, holgado: 5 }, // holgura extra según cómo quiere que le quede
    tipo: { casaca: 4, deportivo: 2 },              // prendas que van sobre otra ropa
    elastico: 2,                                    // la tela elástica da margen
    corteAmplio: 3,                                 // oversize, fluido, cargo... ya vienen holgados
    tolSec: 4                                       // tolerancia en zonas secundarias de la prenda
  };
  var PREF = { ajustado: 'Ajustado', normal: 'Normal', holgado: 'Holgado' };
  /* p = zonas que deben calzar; s = zonas secundarias (con tolerancia); len = depende de la estatura */
  var PERFIL = {
    vestido: { p: ['pecho', 'cintura', 'cadera'], s: [], len: 1 },
    top: { p: ['pecho', 'cintura'], s: ['cadera'] },
    camisa: { p: ['pecho', 'cintura'], s: ['cadera'] },
    casaca: { p: ['pecho'], s: ['cintura', 'cadera'] },
    deportivo: { p: ['pecho'], s: ['cintura', 'cadera'] },
    pantalon: { p: ['cintura', 'cadera'], s: [], len: 1 },
    short: { p: ['cintura', 'cadera'], s: [] },
    falda: { p: ['cintura', 'cadera'], s: [], len: 1 }
  };
  var CATS = Object.keys(PERFIL), ORD = { alta: 0, media: 1, baja: 2 };

  function zn(z, g) { return z === 'pecho' && g !== 'hombre' ? 'busto' : z; }
  function tn(i) { return SIZES[i].t; }
  function lim(g, i, z) { var r = tableForGender(g)[SIZES[i].t]; return r ? +r[z] : NaN; }
  function idxZ(g, z, v) { for (var i = 0; i < SIZES.length; i++) if (v <= lim(g, i, z)) return i; return -1; }
  function elast(c) { return /elast|stretch|spandex|licra|lycra/i.test(c.mat || (MAT[c.k] || [''])[0]); }
  function amplio(c) { return /oversize|fluid|amplio|cargo|campesina|envolvente|cardigan/.test(sinAcento(c.n + ' ' + (c.description || ''))); }

  /* ---- Núcleo: talla de UNA prenda para ESTAS medidas ---- */
  function analizar(c, m, pref) {
    var P = PERFIL[c.k]; if (!P) return { unica: true };
    var g = c.gender, last = SIZES.length - 1;
    var base = Math.max(T.pref[pref || 'normal'] + (T.tipo[c.k] || 0) - (elast(c) ? T.elastico : 0) - (amplio(c) ? T.corteAmplio : 0), -4);
    var det = P.p.map(function (z) { return [z, 0]; }).concat(P.s.map(function (z) { return [z, T.tolSec]; })).map(function (a) {
      var eff = m[a[0]] + base - a[1];
      return { z: a[0], eff: eff, sec: a[1] > 0, i: idxZ(g, a[0], eff) };
    });
    if (det.some(function (d) { return d.i < 0; })) return { sobre: true, det: det };
    var is = det.map(function (d) { return d.i; }), idx = Math.max.apply(null, is), spread = idx - Math.min.apply(null, is);
    var tight = Math.min.apply(null, det.map(function (d) { return lim(g, idx, d.z) - d.eff; }));
    var over = idx > 0 ? Math.max.apply(null, det.map(function (d) { return d.eff - lim(g, idx - 1, d.z); })) : 99;
    var conf = spread >= 3 ? 'baja' : (tight < 2 || spread === 2 ? 'media' : 'alta');
    if (demoTallas() && conf === 'alta') conf = 'media';
    return {
      idx: idx, det: det, spread: spread, tight: tight, conf: conf,
      gov: det.filter(function (d) { return d.i === idx; }).map(function (d) { return d.z; }),
      alt: (tight <= 2 && idx < last) ? { i: idx + 1, up: true } : (over <= 2 && idx > 0 ? { i: idx - 1, up: false } : null)
    };
  }

  /* ---- Talla final considerando stock (si la prenda lo tiene cargado) ---- */
  function elegir(c, r) {
    var i = r.sobre ? SIZES.length - 1 : r.idx, has = c.stock && Object.keys(c.stock).length;
    if (!has) return { i: i, estado: 'pend' };
    if (!agot(c, tn(i))) return { i: i, estado: 'ok' };
    var j = okSz(c, i);
    return agot(c, tn(j)) ? { i: i, estado: 'no' } : { i: j, estado: 'sub', orig: i };
  }
  function stockTxt(e) {
    return e.estado === 'ok' ? 'Disponible' : e.estado === 'pend' ? 'Stock por confirmar' : e.estado === 'no' ? 'Agotada en todas las tallas' :
      'Tu ' + tn(e.orig) + ' está agotada; la más cercana es ' + tn(e.i) + (e.i > e.orig ? ' (más holgada)' : ' (más ajustada)');
  }
  function largo(c, m) {
    var P = PERFIL[c.k]; if (!P || !P.len || !m.altura) return '';
    var g = c.gender, lo = g === 'hombre' ? 165 : 155, hi = g === 'hombre' ? 185 : 175, n = { vestido: 'el vestido', pantalon: 'el pantalón', falda: 'la falda' }[c.k];
    return m.altura < lo ? 'Con ' + m.altura + ' cm de estatura ' + n + ' puede quedarte largo: considera un dobladillo.' :
      m.altura > hi ? 'Con ' + m.altura + ' cm de estatura ' + n + ' puede quedarte corto de largo.' : '';
  }
  /* ---- Explicación en lenguaje claro ---- */
  function expl(c, r) {
    var g = c.gender, m = M(), L = [];
    if (r.unica) return ['Esta prenda es de talla única.'];
    if (r.sobre) return ['Tus medidas superan la talla 5XL en esta prenda (' + r.det.filter(function (d) { return d.i < 0; }).map(function (d) { return zn(d.z, g); }).join(', ') + '). Escríbenos por WhatsApp para ver opciones.'];
    var t = tn(r.idx), z = r.gov[0];
    L.push('Recomendamos <b>' + t + '</b>. La define tu ' + zn(z, g) + ' (' + m[z] + ' cm); la ' + t + ' llega hasta ' + lim(g, r.idx, z) + ' cm.');
    L.push(elast(c) ? 'Su tela elástica da algo de margen.' : 'Su tela no es elástica: manda la zona con la medida más grande.');
    if (amplio(c)) L.push('Su corte ya es amplio, por eso no hace falta subir de talla.');
    if (r.spread >= 2) L.push('Tus zonas caen en tallas distintas (' + r.det.map(function (d) { return zn(d.z, g) + ' ' + tn(d.i); }).join(' · ') + '): confirma que la zona mayor no quede apretada.');
    if (r.alt) L.push(r.alt.up ? 'Estás justa/o en esa talla: si quieres más comodidad, elige ' + tn(r.alt.i) + '.' : 'Casi entras en ' + tn(r.alt.i) + ': elígela si prefieres un ajuste más pegado.');
    var lg = largo(c, m); if (lg) L.push(lg);
    return L;
  }
  function ul(L) { return '<ul style="margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.5">' + L.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }

  /* ---- Ganchos globales que ya usa app.js ---- */
  window.sizeIdxFor = function (m, c) {
    var r = analizar(c, m, S.pref || 'normal');
    return r.unica ? okSz(c, 0) : (r.sobre ? SIZES.length - 1 : r.idx);
  };
  window.Tallas = {
    analizar: analizar, elegir: elegir,
    idx: function (c) { var r = analizar(c, M(), S.pref || 'normal'); return r.unica ? okSz(c, 0) : elegir(c, r).i; }
  };

  /* Ficha de producto: talla recomendada propia de cada prenda + explicación */
  var prodOrig = PG.producto;
  PG.producto = function () {
    var c = byId(PG.pid) || CAT[0], old = S.sx, r = null, html;
    if (old >= 0) { r = analizar(c, M(), S.pref || 'normal'); if (!r.unica && !r.sobre) S.sx = r.idx; }
    try { html = prodOrig(); } finally { S.sx = old; }
    if (r && !r.unica && old >= 0) {
      var note = '<div class="lab" style="margin:10px 0"><b>Por qué esta talla</b>' + ul(expl(c, r).slice(0, 3)) + '</div>';
      html = html.replace('<div class="row"><button class="btn" id="fa">', note + '<div class="row"><button class="btn" id="fa">');
    }
    return html;
  };

  /* ---- Resumen por tipo de prenda ---- */
  function resumen(m, g, pref) {
    return CATS.map(function (k) {
      var L = CAT.filter(function (c) { return c.gender === g && c.k === k; }); if (!L.length) return null;
      var R = L.map(function (c) { return analizar(c, m, pref); }), ok = R.filter(function (r) { return !r.sobre; });
      if (!ok.length) return { k: k, sobre: true };
      var ids = ok.map(function (r) { return r.idx; });
      return { k: k, a: Math.min.apply(null, ids), b: Math.max.apply(null, ids), r: ok[0], parcial: ok.length < R.length,
        conf: ok.map(function (r) { return r.conf; }).sort(function (x, y) { return ORD[y] - ORD[x]; })[0] };
    }).filter(Boolean);
  }
  function chips(attr, cur, obj) {
    return Object.keys(obj).map(function (k) { return '<button type="button" class="chip' + (cur === k ? ' on' : '') + '" data-' + attr + '="' + k + '">' + obj[k] + '</button>'; }).join('');
  }

  /* ---- Paso 0: medidas + preferencia de ajuste ---- */
  function p0(st) {
    head(); Lia.step(0);
    st.innerHTML = '<h3>Encuentra tu talla ideal</h3><p style="color:var(--mut)">Analizamos tus medidas contra cada tipo de prenda: un pantalón se mide distinto a una casaca.</p>' +
      '<div class="gender-pick"><span class="lab" style="margin:0">¿Qué prendas buscas?</span>' + chips('gender', S.gender, { mujer: '♀ Mujer', hombre: '♂ Hombre' }) + '</div>' +
      '<details open style="border:1px solid var(--line);padding:14px;margin:12px 0"><summary class="up" style="cursor:pointer">¿Cómo tomar tus medidas?</summary><div style="font-size:14px;margin-top:12px"><p><b>Pecho / busto:</b> parte más ancha del torso, cinta horizontal.</p><p><b>Cintura:</b> alrededor de la cintura, sin apretar.</p><p><b>Cadera:</b> parte más ancha de cadera y glúteos.</p><p><b>Estatura:</b> de pie, sin zapatos, contra una pared (la usamos para el largo de vestidos, pantalones y faldas).</p></div></details>' +
      '<div class="f">' + ['altura|Estatura', 'pecho|Pecho', 'cintura|Cintura', 'cadera|Cadera'].map(function (x) { var a = x.split('|'); return '<label>' + a[1] + ' (cm)<input type="number" inputmode="numeric" id="m_' + a[0] + '" value="' + S.m[a[0]] + '"></label>'; }).join('') + '</div>' +
      '<div class="gender-pick" style="margin-top:12px"><span class="lab" style="margin:0">¿Cómo te gusta que te quede?</span>' + chips('pref', S.pref, PREF) + '</div>' +
      '<label style="text-transform:none;letter-spacing:0;display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" id="rm" style="width:auto"' + (S.mem ? ' checked' : '') + '> Recordar mis medidas en este dispositivo</label>' +
      (S.mem ? '<p class="lab">Estamos usando tus medidas guardadas. <a href="#" id="fg3">Borrar mis datos guardados</a></p>' : '') +
      '<p class="err">' + S.err + '</p><div class="row"><button class="btn" id="nx">Analizar mis medidas</button></div>';
    st.querySelectorAll('[data-gender]').forEach(function (b) { b.onclick = function () { keep(); S.gender = b.dataset.gender; S.ref = S.gender; render(); }; });
    st.querySelectorAll('[data-pref]').forEach(function (b) { b.onclick = function () { keep(); S.pref = b.dataset.pref; render(); }; });
    if ($('#fg3')) $('#fg3').onclick = function (e) { e.preventDefault(); try { localStorage.removeItem('sfc_m'); } catch (x) {} S.m = { altura: '', pecho: '', cintura: '', cadera: '' }; S.mem = 0; render(); toast('Tus medidas guardadas fueron borradas'); };
    $('#nx').onclick = function () {
      keep();
      var m = M(), r = { altura: [120, 210], pecho: [70, 170], cintura: [55, 160], cadera: [75, 180] }, bad = '';
      for (var k in r) if (!(m[k] >= r[k][0] && m[k] <= r[k][1])) bad = k;
      if (bad) { S.err = 'Revisa "' + bad + '": ingresa un valor realista en centímetros (' + r[bad][0] + '–' + r[bad][1] + ').'; render(); return; }
      if (!validSizeTable(S.gender)) { S.err = 'La tabla de medidas ' + (S.gender === 'hombre' ? 'masculina' : 'femenina') + ' aún está pendiente de validación. No podemos recomendar una talla real hasta completarla.'; render(); return; }
      var rs = resumen(m, S.gender, S.pref);
      if (!rs.length || rs.every(function (x) { return x.sobre; })) { S.err = 'Tus medidas superan nuestra talla máxima (5XL). Escríbenos por WhatsApp y vemos opciones a medida para ti.'; render(); return; }
      S.err = ''; S.sx = sizeIdx(m, S.gender); if (S.sx < 0) S.sx = SIZES.length - 1;
      S.body = bodyType(m);
      try { if ($('#rm').checked) { localStorage.setItem('sfc_m', JSON.stringify(S.m)); S.mem = 1; } else { localStorage.removeItem('sfc_m'); S.mem = 0; } } catch (e) {}
      track('medidas_analizadas', 'talla base ' + tn(S.sx) + ' · ' + BODY[S.body] + ' · ajuste ' + S.pref);
      go(1);
    };
    function keep() { ['altura', 'pecho', 'cintura', 'cadera'].forEach(function (k) { var e = $('#m_' + k); if (e) S.m[k] = e.value; }); }
  }

  /* ---- Paso 1: análisis por tipo de prenda ---- */
  function p1(st) {
    head(); Lia.step(1);
    var m = M(), g = S.gender, rs = resumen(m, g, S.pref);
    var ls = ['Leyendo tus medidas…', 'Pecho ' + m.pecho + ' · Cintura ' + m.cintura + ' · Cadera ' + m.cadera + ' cm', 'Comparando con cada tipo de prenda…', '¡Análisis listo!'];
    st.innerHTML = '<div class="two holo-layout"><div class="fig scan holo-fig" id="fg"><i></i>' + holoAnalysis(m) + '</div><div><h3>Análisis por tipo de prenda</h3><p class="lab">Ajuste elegido: ' + PREF[S.pref] + '. Cada prenda se compara con las zonas que sí importan para ella.</p><ul class="log" id="lg"></ul><div id="res"></div></div></div>';
    ls.forEach(function (t, i) {
      setTimeout(function () {
        if (S.n != 1 || !$('#lg')) return;
        $('#lg').insertAdjacentHTML('beforeend', '<li>' + (i < 3 ? '… ' : '✓ ') + t + '</li>');
        if (i < 3) return;
        $('#fg').classList.remove('scan'); if ($('#fg i')) $('#fg i').remove();
        $('#res').innerHTML = resHTML(rs, m, g);
        $('#n2').onclick = function () { if (S.pend) { S.it = byId(S.pend); S.col = S.it.c[0]; S.sx = sizeIdxFor(m, S.it); S.sz = elegir(S.it, analizar(S.it, m, S.pref)).i; S.pend = null; go(3); } else go(2); };
        $('#b2').onclick = function () { go(0); };
      }, i * 550 + 250);
    });
  }
  function resHTML(rs, m, g) {
    var rows = rs.map(function (x) {
      var t = x.sobre ? 'Sin talla' : (x.a === x.b ? tn(x.a) : tn(x.a) + ' – ' + tn(x.b)) + (x.parcial ? '*' : '');
      return '<tr><td>' + KN[x.k] + '</td><td><b>' + t + '</b></td><td>' + (x.sobre ? 'Supera 5XL' : x.r.gov.map(function (z) { return zn(z, g); }).join(' / ')) + '</td><td>' + (x.sobre ? '–' : x.conf) + '</td></tr>';
    }).join('');
    var zi = ['pecho', 'cintura', 'cadera'].map(function (z) { return { z: z, i: idxZ(g, z, m[z]) }; }), N = [];
    var fuera = zi.filter(function (x) { return x.i < 0; });
    if (fuera.length) N.push('Tu ' + fuera.map(function (x) { return zn(x.z, g); }).join(' y ') + ' supera la talla 5XL: las prendas que dependen de esa zona no tienen talla; escríbenos por WhatsApp.');
    else {
      var mx = zi.slice().sort(function (a, b) { return b.i - a.i; })[0], mn = zi.slice().sort(function (a, b) { return a.i - b.i; })[0];
      if (mx.i - mn.i >= 2) N.push('Tu ' + zn(mx.z, g) + ' corresponde a una talla ' + tn(mx.i) + ' y tu ' + zn(mn.z, g) + ' a una ' + tn(mn.i) + '. Prefiere telas elásticas o cortes fluidos, y en prendas rígidas guíate por la zona mayor.');
    }
    if (rs.some(function (x) { return x.parcial; })) N.push('* En algunas prendas de esa categoría tus medidas superan la talla máxima.');
    return '<div class="res"><p class="lab" style="margin-bottom:4px">Tu talla según la prenda</p><p>Silueta: <span class="tag">' + BODY[S.body] + '</span></p><table><tr><th>Prenda</th><th>Talla</th><th>La define</th><th>Confianza</th></tr>' + rows + '</table>' + (N.length ? ul(N) : '') +
      '<p class="lab" style="margin-top:8px">Confianza baja o media: estás entre tallas o tus zonas caen en tallas distintas. En cada prenda verás la explicación.</p>' + demoNote() +
      '<div class="row"><button class="btn" id="n2">Ver prendas para mí</button><button class="btn o" id="b2">Cambiar medidas</button></div></div>';
  }

  /* ---- Paso 2: prendas con SU talla ---- */
  function p2(st) {
    head(); Lia.step(2);
    var m = M(), g = S.gender, cf = S.cf || '';
    var L = CAT.filter(function (c) { return c.gender === g && PERFIL[c.k] && vendible(c); }).map(function (c) { var r = analizar(c, m, S.pref); return { c: c, r: r, e: elegir(c, r) }; });
    var ks = CATS.filter(function (k) { return L.some(function (x) { return x.c.k === k; }); });
    if (cf && ks.indexOf(cf) < 0) cf = '';
    L = L.filter(function (x) { return !cf || x.c.k === cf; }).sort(function (a, b) {
      return (b.c.b.indexOf(S.body) > -1) - (a.c.b.indexOf(S.body) > -1) || (a.e.estado === 'no') - (b.e.estado === 'no') || a.c.pr - b.c.pr;
    });
    function cap(x) {
      if (x.r.sobre) return '<p class="lab" style="margin:6px 0 0"><b>Sin talla para tus medidas</b><br>Escríbenos por WhatsApp.</p>';
      return '<p class="lab" style="margin:6px 0 0">Tu talla: <b>' + tn(x.e.i) + '</b> · confianza ' + x.r.conf + '<br>' + stockTxt(x.e) + (x.r.alt ? '<br>' + (x.r.alt.up ? 'Justa: ' + tn(x.r.alt.i) + ' si la quieres más cómoda' : 'Puede ir ' + tn(x.r.alt.i) + ' si la quieres pegada') : '') + '</p>';
    }
    st.innerHTML = '<h3>Prendas para ' + (g === 'hombre' ? 'hombre' : 'mujer') + ' · silueta ' + BODY[S.body].toLowerCase() + '</h3>' +
      '<div class="gender-pick"><span class="lab" style="margin:0">Ajuste:</span>' + chips('pref', S.pref, PREF) + '</div>' +
      '<div style="margin:10px 0"><button type="button" class="chip' + (cf ? '' : ' on') + '" data-cf="">Todo</button>' + ks.map(function (k) { return '<button type="button" class="chip' + (cf === k ? ' on' : '') + '" data-cf="' + k + '">' + KN[k] + '</button>'; }).join('') + '</div>' +
      '<p class="lab">Cada prenda muestra la talla calculada para ella, no una talla única para todo.</p>' +
      (L.length ? '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">' + L.map(function (x) { return '<div>' + card(x.c) + cap(x) + '</div>'; }).join('') + '</div>' : '<p class="lab">No hay prendas en esta categoría.</p>') +
      '<div class="row"><button class="btn o" id="b2">Atrás</button></div>';
    st.querySelectorAll('[data-pref]').forEach(function (b) { b.onclick = function () { S.pref = b.dataset.pref; render(); }; });
    st.querySelectorAll('[data-cf]').forEach(function (b) { b.onclick = function () { S.cf = b.dataset.cf; render(); }; });
    st.querySelectorAll('[data-add]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var c = byId(b.dataset.add);
        if (!vendible(c)) { toast('Esta prenda aún no tiene precio y colores confirmados.'); return; }
        var r = analizar(c, M(), S.pref);
        if (r.sobre) { toast('Tus medidas superan la talla máxima de esta prenda. Escríbenos por WhatsApp.'); return; }
        var sz = tn(elegir(c, r).i);
        if (agot(c, sz) || cartCount(c.id, sz) >= stockOf(c, sz)) { toast('No hay stock confirmado de la talla ' + sz + '. Abre la prenda para ver otras tallas.'); return; }
        flyToCart(b); CART.push({ id: c.id, col: selCol(b, c), sz: sz, qty: 1 }); cc();
        toast('Añadido a la bolsa · talla ' + sz); track('anadir_bolsa', c.n); Lia.say('¡Buena elección! Va a quedarte muy bien.');
      };
    });
    st.querySelectorAll('[data-pr],[data-ficha]').forEach(function (b) {
      b.onclick = function (e) {
        if (e.target.closest('[data-fav]')) return;
        e.stopPropagation();
        S.it = byId(b.dataset.pr || b.dataset.ficha); S.col = S.it.c[0];
        S.sx = sizeIdxFor(M(), S.it); S.sz = elegir(S.it, analizar(S.it, M(), S.pref)).i; S.est = 0; go(3);
      };
    });
    $('#b2').onclick = function () { go(1); };
  }

  /* ---- Paso 3 (probador): se conserva el original y se añade la explicación ---- */
  function nota() {
    var it = S.it, row = document.querySelector('.tryon-layout .row');
    if (!it || !row) return;
    var r = analizar(it, M(), S.pref || 'normal'), e = r.unica || r.sobre ? null : elegir(it, r);
    row.insertAdjacentHTML('beforebegin', '<div class="mod" style="margin:12px 0;padding:12px"><p class="up">Por qué esta talla</p>' + ul(expl(it, r).concat(e && e.estado !== 'ok' ? [stockTxt(e)] : [])) + '</div>');
  }

  var renderOrig = window.render;
  window.render = function () {
    var st = $('#stage'); if (!st) return;
    S.pref = S.pref || 'normal';
    if (S.n === 0) p0(st); else if (S.n === 1) p1(st); else if (S.n === 2) p2(st);
    else { renderOrig(); if (S.n === 3) nota(); }
  };
  if (/^#asistente/.test(location.hash)) route();
})();
