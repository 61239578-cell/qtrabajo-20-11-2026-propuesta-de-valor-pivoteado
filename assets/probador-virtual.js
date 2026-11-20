/* ============================================================
   SMART FIT CUSCO — PASO 6: PROBADOR VIRTUAL (MODO DEMO)
   Archivo NUEVO. Se carga después de app.js y no modifica app.js.
   Reutiliza: CAT, IMG, KN, COL, SIZES, CART, byId, stockOf, cartCount,
   cc, toast, track, flyToCart (todos existentes en app.js).

   Módulos (todos dentro de este archivo, separados):
     1. Config        2. DatosDemo (stock de ejemplo)   3. Fotos
     4. Catalogo      5. Tallas                          6. MotorDemo
     7. AdaptadorVTO  8. Resultados                      9. Carrito
    10. Interfaz     11. IntegracionLIA                 12. API pública

   PRIVACIDAD: este archivo NO usa fetch, XMLHttpRequest, sendBeacon,
   WebSocket, localStorage ni sessionStorage con la fotografía.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. CONFIG ---------- */
  var CFGP = window.SMARTFIT_PROBADOR_CONFIG = window.SMARTFIT_PROBADOR_CONFIG || {};
  CFGP.MODO_DEMO = true;                       /* forzado: no hay motor real conectado */
  if (typeof CFGP.STOCK_DEMO !== 'boolean') CFGP.STOCK_DEMO = false;
  CFGP.TAM_MAX_MB = Number(CFGP.TAM_MAX_MB) > 0 ? Number(CFGP.TAM_MAX_MB) : 5;
  CFGP.FORMATOS = CFGP.FORMATOS || ['image/jpeg', 'image/png', 'image/webp'];
  CFGP.CANTIDAD_MAX = Number(CFGP.CANTIDAD_MAX) > 0 ? Number(CFGP.CANTIDAD_MAX) : 5;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function $1(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function money(n) { return 'S/ ' + Number(n).toFixed(2); }

  /* ---------- 2. DATOS DEMO (stock de ejemplo) ---------- */
  var DatosDemo = {
    hash: function (s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; },
    /* Tabla repetible por id: M a 5XL casi siempre ofrecidas; XS/S solo en algunas.
       Cada 11.ª prenda queda agotada por completo para poder probar ese caso. */
    tabla: function (id) {
      var out = {}, self = this;
      if (self.hash(id + '|todo') % 11 === 0) { SIZES.forEach(function (z, i) { if (i >= 2) out[z.t] = 0; }); return out; }
      SIZES.forEach(function (z, i) {
        if (i < 2 && self.hash(id + '|peq|' + z.t) % 3 !== 0) return;          /* no ofrecida */
        var r = self.hash(id + '|' + z.t) % 10;
        out[z.t] = r < 2 ? 0 : 1 + (r % 6);                                      /* 0 = agotada */
      });
      var vivos = Object.keys(out).filter(function (t) { return out[t] > 0; }).length;
      if (vivos < 3) { ['L', 'XL', '2XL'].forEach(function (t) { if (!(out[t] > 0)) out[t] = 2; }); }
      return out;
    },
    aplicar: function (lista) {
      if (!CFGP.STOCK_DEMO || !lista) return;
      lista.forEach(function (c) {
        if (!c || !c.id) return;
        if (c.stock && Object.keys(c.stock).length && !c.stockDemo) return;     /* stock real: no se toca */
        if (c.stockDemo && c.stock && Object.keys(c.stock).length) return;       /* ya aplicado */
        c.stock = DatosDemo.tabla(c.id); c.stockDemo = true;
      });
    }
  };
  DatosDemo.aplicar(window.CAT);
  /* Si el catálogo se vuelve a cargar desde Google Sheets, reaplicar el stock de ejemplo
     solo a las prendas que sigan sin stock_json. */
  if (typeof window.mergeCatalog === 'function') {
    var mergeOrig = window.mergeCatalog;
    window.mergeCatalog = function (base, remote) { var r = mergeOrig(base, remote); DatosDemo.aplicar(r); return r; };
  }

  /* ---------- 3. FOTOS (solo en memoria del navegador) ---------- */
  var Fotos = {
    url: '', nombre: '',
    extOk: function (n) { return /\.(jpe?g|png|webp)$/i.test(n || ''); },
    validar: function (f) {
      if (!f) return 'No se seleccionó ningún archivo.';
      var okTipo = CFGP.FORMATOS.indexOf(f.type) > -1 || (!f.type && Fotos.extOk(f.name));
      if (!okTipo) return 'Formato no permitido. Usa JPG, JPEG, PNG o WEBP.';
      if (!f.size) return 'El archivo está vacío.';
      if (f.size > CFGP.TAM_MAX_MB * 1024 * 1024) return 'La imagen pesa más de ' + CFGP.TAM_MAX_MB + ' MB. Elige una más ligera.';
      return '';
    },
    /* callback(error, url). Comprueba también que el navegador pueda decodificar la imagen. */
    cargar: function (f, cb) {
      var err = Fotos.validar(f);
      if (err) { cb(err); return; }
      var u = URL.createObjectURL(f), im = new Image();
      im.onload = function () { Fotos.quitar(); Fotos.url = u; Fotos.nombre = f.name || 'foto'; cb('', u); };
      im.onerror = function () { URL.revokeObjectURL(u); cb('No se pudo leer la imagen. Puede estar dañada o no ser una fotografía válida.'); };
      im.src = u;
    },
    quitar: function () { if (Fotos.url) { URL.revokeObjectURL(Fotos.url); } Fotos.url = ''; Fotos.nombre = ''; }
  };

  /* ---------- 4. CATÁLOGO (lee el catálogo real; no lo duplica) ---------- */
  var Catalogo = {
    todos: function () { return (window.CAT || []).slice(); },
    porId: function (id) { return window.byId ? window.byId(id) : null; },
    foto: function (c, col) { var I = window.IMG || {}; return (col && I[c.id + '_' + col]) || I[c.id] || ''; },
    categorias: function (genero) {
      var vistos = {}, out = [];
      Catalogo.todos().forEach(function (c) { if ((!genero || c.gender === genero) && !vistos[c.k]) { vistos[c.k] = 1; out.push(c.k); } });
      return out;
    },
    colores: function (genero) {
      var vistos = {}, out = [];
      Catalogo.todos().forEach(function (c) { if (!genero || c.gender === genero) (c.c || []).forEach(function (x) { if (!vistos[x]) { vistos[x] = 1; out.push(x); } }); });
      return out.sort();
    },
    filtrar: function (f) {
      f = f || {};
      var q = norm(f.texto || '');
      return Catalogo.todos().filter(function (c) {
        if (f.genero && c.gender !== f.genero) return false;
        if (f.categoria && c.k !== f.categoria) return false;
        if (f.color && (c.c || []).indexOf(f.color) < 0) return false;
        if (f.soloDisponibles && !Tallas.disponibles(c).length) return false;
        if (q && norm(c.n + ' ' + c.e + ' ' + (window.KN && window.KN[c.k])).indexOf(q) < 0) return false;
        return true;
      });
    }
  };

  /* ---------- 5. TALLAS (usa SIZES y stockOf del sistema existente) ---------- */
  var Tallas = {
    stock: function (c, t) { var n = window.stockOf(c, t); return n === null || !isFinite(n) ? null : n; },
    /* [{t, n}] con stock > 0 */
    disponibles: function (c) {
      return window.SIZES.map(function (z) { return { t: z.t, n: Tallas.stock(c, z.t) }; }).filter(function (x) { return x.n > 0; });
    },
    /* unidades que todavía se pueden añadir (stock - lo que ya está en el carrito) */
    libres: function (c, t) { var n = Tallas.stock(c, t); return n === null ? 0 : Math.max(0, n - window.cartCount(c.id, t)); },
    estado: function (c, t) {
      var n = Tallas.stock(c, t);
      if (n === null) return { ok: false, txt: c.stock && Object.keys(c.stock).length ? 'No ofrecida' : 'Stock pendiente' };
      if (n <= 0) return { ok: false, txt: 'Agotada' };
      return { ok: true, txt: n + ' disp.' };
    },
    disponibilidadGeneral: function (c) {
      var d = Tallas.disponibles(c);
      if (d.length) return { ok: true, txt: 'Disponible en ' + d.length + ' talla' + (d.length > 1 ? 's' : '') };
      var hayDatos = c.stock && Object.keys(c.stock).length;
      return { ok: false, txt: hayDatos ? 'Agotado' : 'Stock pendiente de confirmar' };
    }
  };

  /* ---------- 7. ADAPTADOR DEL FUTURO MOTOR VTO ----------
     Contrato para conectar un motor real EN EL FUTURO (ver PASO_6_PROBADOR_VIRTUAL.md):
       motor = { id, nombre, probar: function(fotoBlob, producto, opciones){ return Promise<{imagenUrl, aviso}> } }
     Hoy NO hay ningún motor conectado y el modo DEMO no lo invoca jamás. */
  var AdaptadorVTO = {
    motor: null,
    registrar: function (m) { if (!m || typeof m.probar !== 'function') throw new Error('Motor VTO inválido'); AdaptadorVTO.motor = m; },
    disponible: function () { return !!AdaptadorVTO.motor && CFGP.MODO_DEMO === false; }   /* siempre false en esta versión */
  };

  /* ---------- 8. RESULTADOS (solo memoria, se pierde al cerrar la página) ---------- */
  var Resultados = {
    historial: [],
    agregar: function (id, col) {
      Resultados.historial = Resultados.historial.filter(function (x) { return x.id !== id; });
      Resultados.historial.unshift({ id: id, col: col });
      Resultados.historial = Resultados.historial.slice(0, 8);
    },
    limpiar: function () { Resultados.historial = []; }
  };

  /* ---------- 6. MOTOR DEMO ---------- */
  var MotorDemo = {
    etiqueta: 'Vista de demostración. La simulación no representa un resultado real generado mediante inteligencia artificial.',
    montaje: 'Montaje ilustrativo: la prenda del catálogo se coloca sobre tu foto solo como referencia visual; no se adapta a tu cuerpo.',
    /* Simula el tiempo de preparación para poder probar los indicadores de carga.
       NO procesa la imagen ni usa IA. */
    preparar: function (cb) { setTimeout(cb, 700); }
  };

  /* ---------- 9. CARRITO (usa el CART existente) ---------- */
  var Carrito = {
    anadir: function (id, col, talla, cant, desde) {
      var c = Catalogo.porId(id);
      if (!c) { window.toast('El producto ya no está en el catálogo cargado.'); return false; }
      if (!(Number(c.pr) > 0)) { window.toast('Esta prenda no tiene precio confirmado.'); return false; }
      if (!talla) { window.toast('Elige una talla disponible.'); return false; }
      cant = Math.max(1, Math.floor(Number(cant) || 1));
      var libres = Tallas.libres(c, talla);                     /* verificación con el sistema existente */
      if (libres <= 0) { window.toast('Esa talla no tiene stock disponible.'); return false; }
      if (cant > libres) { window.toast('Solo quedan ' + libres + ' unidad(es) disponibles en talla ' + talla + '.'); return false; }
      var colores = c.c || [];
      var color = colores.indexOf(col) > -1 ? col : (colores[0] || 'Negro');
      window.CART.push({ id: c.id, col: color, sz: talla, qty: cant });
      window.cc();
      if (window.flyToCart && desde) { try { window.flyToCart(desde); } catch (e) {} }
      try { window.track('probador6_anadir_carrito', c.n + ' · ' + talla + ' x' + cant); } catch (e) {}
      window.toast('Añadido al carrito: ' + c.n + ' · ' + talla + ' x' + cant);
      return true;
    }
  };

  /* ---------- 10. INTERFAZ ---------- */
  var ST = { abierto: false, genero: 'mujer', categoria: '', color: '', texto: '', soloDisp: true, id: '', col: '', talla: '', cant: 1, montaje: false, escala: 55, posY: 30, posX: 50, cargando: false };

  function panelHTML() {
    return '' +
    '<div class="pv6-wrap" role="document">' +
      '<div class="pv6-head"><div><span class="pv6-eyebrow">SMART FIT CUSCO · PASO 6</span><h2 id="pv6-title">Probador virtual</h2></div>' +
        '<div class="pv6-head-r"><span class="pv6-demo" title="Sin IA real ni envío de datos">MODO DEMO</span><button type="button" class="pv6-x" id="pv6-close" aria-label="Cerrar probador">×</button></div></div>' +
      '<div class="pv6-alert" role="note"><b>' + esc(MotorDemo.etiqueta) + '</b> Tu fotografía se queda solo en este navegador: no se sube, no se envía a ningún servidor y se borra al quitarla o al cerrar el probador.</div>' +
      '<div class="pv6-main">' +
        '<section class="pv6-stage" aria-label="Zona de prueba">' +
          '<div class="pv6-photobar">' +
            '<label class="pv6-btn" for="pv6-file" id="pv6-file-lbl">📷 <span id="pv6-file-txt">Seleccionar fotografía</span></label>' +
            '<input type="file" id="pv6-file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" class="pv6-file">' +
            '<button type="button" class="pv6-btn pv6-ghost" id="pv6-del" hidden>Eliminar foto</button>' +
          '</div>' +
          '<p class="pv6-hint" id="pv6-msg" role="status" aria-live="polite">Formatos: JPG, JPEG, PNG o WEBP · máximo ' + CFGP.TAM_MAX_MB + ' MB. Usa solo fotos tuyas o con consentimiento de la persona.</p>' +
          '<div class="pv6-panes">' +
            '<figure class="pv6-pane"><figcaption>Tu fotografía</figcaption><div class="pv6-box" id="pv6-photo"><span class="pv6-empty">Aún no has elegido una fotografía.</span></div></figure>' +
            '<figure class="pv6-pane"><figcaption>Prenda seleccionada</figcaption><div class="pv6-box" id="pv6-garment"><span class="pv6-empty">Elige una prenda de la lista.</span></div></figure>' +
            '<figure class="pv6-pane pv6-pane-wide"><figcaption>Vista de demostración <em>(simulación)</em></figcaption><div class="pv6-box pv6-box-demo" id="pv6-demo"><span class="pv6-empty">Elige foto y prenda para ver la demostración.</span></div></figure>' +
          '</div>' +
          '<div class="pv6-mont" id="pv6-mont" hidden>' +
            '<label class="pv6-check"><input type="checkbox" id="pv6-mont-on"> Mostrar montaje ilustrativo sobre mi foto</label>' +
            '<div class="pv6-sliders" id="pv6-sliders" hidden><label>Tamaño<input type="range" id="pv6-sc" min="25" max="90" value="55"></label><label>Posición vertical<input type="range" id="pv6-py" min="0" max="80" value="30"></label><label>Posición horizontal<input type="range" id="pv6-px" min="0" max="100" value="50"></label></div>' +
          '</div>' +
        '</section>' +
        '<section class="pv6-side" aria-label="Prenda y tallas">' +
          '<div id="pv6-info" class="pv6-info"><p class="pv6-hint">Selecciona una prenda para ver precio, tallas y añadirla al carrito.</p></div>' +
          '<div class="pv6-filters" role="group" aria-label="Filtros">' +
            '<label>Sección<select id="pv6-f-g"><option value="mujer">Mujer</option><option value="hombre">Hombre</option></select></label>' +
            '<label>Categoría<select id="pv6-f-k"></select></label>' +
            '<label>Color<select id="pv6-f-c"></select></label>' +
            '<label class="pv6-f-q">Buscar<input type="search" id="pv6-f-q" placeholder="Ej. casaca, blusa…" autocomplete="off"></label>' +
            '<label class="pv6-check pv6-f-d"><input type="checkbox" id="pv6-f-d" checked> Solo con tallas disponibles</label>' +
          '</div>' +
          '<div id="pv6-recent" class="pv6-recent" hidden></div>' +
          '<div class="pv6-count" id="pv6-count" aria-live="polite"></div>' +
          '<div class="pv6-grid" id="pv6-grid"></div>' +
        '</section>' +
      '</div>' +
    '</div>';
  }

  function build() {
    if ($1('#pv6-panel')) return;
    var p = document.createElement('section');
    p.id = 'pv6-panel'; p.className = 'pv6-panel'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-labelledby', 'pv6-title'); p.setAttribute('aria-hidden', 'true');
    p.innerHTML = panelHTML();
    document.body.appendChild(p);

    var host = $1('#lia');
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'pv6-launch'; b.className = 'pv6-launch'; b.textContent = '👗 Probador virtual'; b.setAttribute('aria-label', 'Abrir el probador virtual (modo demostración)');
    b.onclick = function () { abrir({}); };
    (host || document.body).appendChild(b);

    $1('#pv6-close').onclick = cerrar;
    $1('#pv6-file').onchange = function () { elegirFoto(this); };
    $1('#pv6-del').onclick = quitarFoto;
    $1('#pv6-f-g').onchange = function () { ST.genero = this.value; ST.categoria = ''; ST.color = ''; pintarFiltros(); pintarGrid(); };
    $1('#pv6-f-k').onchange = function () { ST.categoria = this.value; pintarGrid(); };
    $1('#pv6-f-c').onchange = function () { ST.color = this.value; pintarGrid(); };
    $1('#pv6-f-q').oninput = function () { ST.texto = this.value; pintarGrid(); };
    $1('#pv6-f-d').onchange = function () { ST.soloDisp = this.checked; pintarGrid(); };
    $1('#pv6-mont-on').onchange = function () { ST.montaje = this.checked; pintarDemo(); };
    ['sc', 'py', 'px'].forEach(function (k) { $1('#pv6-' + k).oninput = function () { ST[{ sc: 'escala', py: 'posY', px: 'posX' }[k]] = Number(this.value); ajustarMontaje(); }; });

    p.addEventListener('click', function (e) {
      var card = e.target.closest('[data-pv6-pick]'); if (card) { elegirProducto(card.getAttribute('data-pv6-pick')); return; }
      var rec = e.target.closest('[data-pv6-rec]'); if (rec) { elegirProducto(rec.getAttribute('data-pv6-rec'), rec.getAttribute('data-col')); return; }
      var sw = e.target.closest('[data-pv6-col]'); if (sw) { ST.col = sw.getAttribute('data-pv6-col'); pintarInfo(); pintarPrenda(); pintarDemo(); return; }
      var sz = e.target.closest('[data-pv6-sz]'); if (sz && !sz.disabled) { ST.talla = sz.getAttribute('data-pv6-sz'); ST.cant = 1; pintarInfo(); return; }
      var q = e.target.closest('[data-pv6-qty]'); if (q) { cambiarCant(Number(q.getAttribute('data-pv6-qty'))); return; }
      var add = e.target.closest('#pv6-add'); if (add) { anadir(add); return; }
      var ver = e.target.closest('#pv6-ver'); if (ver) { cerrar(); location.hash = '#producto/' + ST.id; return; }
      var tal = e.target.closest('#pv6-asist'); if (tal) { cerrar(); location.hash = '#asistente'; return; }
      var lia = e.target.closest('#pv6-lia'); if (lia) { volverALia(); return; }
      var car = e.target.closest('#pv6-cart'); if (car) { cerrar(); var cb = $1('#cartb'); if (cb) cb.click(); return; }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ST.abierto) cerrar(); });
    pintarFiltros(); pintarGrid();
  }

  function msg(t, error) { var m = $1('#pv6-msg'); if (!m) return; m.textContent = t; m.classList.toggle('pv6-err', !!error); }

  function elegirFoto(inp) {
    var f = inp.files && inp.files[0]; if (!f) return;
    msg('Comprobando la fotografía…');
    Fotos.cargar(f, function (err, url) {
      if (err) { inp.value = ''; msg(err, true); return; }
      msg('Fotografía cargada solo en tu navegador. Puedes cambiarla o eliminarla cuando quieras.');
      inp.value = ''; pintarFoto(); pintarDemo();
    });
  }
  function quitarFoto() { Fotos.quitar(); ST.montaje = false; var c = $1('#pv6-mont-on'); if (c) c.checked = false; msg('Fotografía eliminada de la memoria del navegador.'); pintarFoto(); pintarDemo(); }

  function pintarFoto() {
    var box = $1('#pv6-photo'), has = !!Fotos.url;
    box.innerHTML = has ? '<img src="' + Fotos.url + '" alt="Vista previa local de tu fotografía">' : '<span class="pv6-empty">Aún no has elegido una fotografía.</span>';
    $1('#pv6-file-txt').textContent = has ? 'Cambiar fotografía' : 'Seleccionar fotografía';
    $1('#pv6-del').hidden = !has;
  }

  function pintarFiltros() {
    var k = $1('#pv6-f-k'), c = $1('#pv6-f-c'), g = $1('#pv6-f-g');
    g.value = ST.genero;
    k.innerHTML = '<option value="">Todas</option>' + Catalogo.categorias(ST.genero).map(function (x) { return '<option value="' + esc(x) + '">' + esc((window.KN && window.KN[x]) || x) + '</option>'; }).join('');
    c.innerHTML = '<option value="">Todos</option>' + Catalogo.colores(ST.genero).map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + '</option>'; }).join('');
    k.value = ST.categoria; c.value = ST.color;
  }

  function tarjeta(c) {
    var d = Tallas.disponibilidadGeneral(c), t = Tallas.disponibles(c), foto = Catalogo.foto(c, '');
    return '<button type="button" class="pv6-card' + (c.id === ST.id ? ' on' : '') + '" data-pv6-pick="' + esc(c.id) + '" aria-pressed="' + (c.id === ST.id) + '">' +
      '<span class="pv6-card-img">' + (foto ? '<img src="' + esc(foto) + '" alt="' + esc(c.n) + '" loading="lazy" onerror="this.remove()">' : '<i>Sin imagen</i>') + '</span>' +
      '<span class="pv6-card-b"><b>' + esc(c.n) + '</b>' +
      '<small>' + esc((window.KN && window.KN[c.k]) || c.k) + (c.e ? ' · ' + esc(c.e) : '') + '</small>' +
      '<strong>' + (Number(c.pr) > 0 ? money(c.pr) : 'Precio por confirmar') + '</strong>' +
      '<small class="' + (d.ok ? 'pv6-ok' : 'pv6-no') + '">' + esc(d.txt) + '</small>' +
      (t.length ? '<small class="pv6-sizes">' + t.map(function (x) { return esc(x.t); }).join(' · ') + '</small>' : '') +
      '</span></button>';
  }

  function pintarGrid() {
    var lista = Catalogo.filtrar({ genero: ST.genero, categoria: ST.categoria, color: ST.color, texto: ST.texto, soloDisponibles: ST.soloDisp });
    $1('#pv6-count').textContent = lista.length + ' prenda' + (lista.length === 1 ? '' : 's') + (CFGP.STOCK_DEMO ? ' · stock de ejemplo (DEMO) en prendas sin stock_json' : '');
    $1('#pv6-grid').innerHTML = lista.length ? lista.map(tarjeta).join('') : '<p class="pv6-hint">No hay prendas con esos filtros. Prueba quitar el color o la opción “solo con tallas disponibles”.</p>';
    var r = $1('#pv6-recent');
    if (Resultados.historial.length) {
      r.hidden = false;
      r.innerHTML = '<span>Probadas:</span>' + Resultados.historial.map(function (h) { var c = Catalogo.porId(h.id); return c ? '<button type="button" data-pv6-rec="' + esc(c.id) + '" data-col="' + esc(h.col || '') + '">' + esc(c.n) + '</button>' : ''; }).join('');
    } else { r.hidden = true; r.innerHTML = ''; }
  }

  function elegirProducto(id, col) {
    var c = Catalogo.porId(id); if (!c) return;
    ST.id = c.id; ST.col = (col && (c.c || []).indexOf(col) > -1) ? col : ((c.c || [])[0] || '');
    var d = Tallas.disponibles(c); ST.talla = d.length ? d[0].t : ''; ST.cant = 1;
    if (c.gender && c.gender !== ST.genero) { ST.genero = c.gender; ST.categoria = ''; ST.color = ''; pintarFiltros(); }
    Resultados.agregar(c.id, ST.col);
    pintarGrid(); pintarInfo(); pintarPrenda(); pintarDemo();
    var info = $1('#pv6-info'); if (info && info.scrollIntoView && window.innerWidth < 900) info.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function pintarPrenda() {
    var box = $1('#pv6-garment'), c = Catalogo.porId(ST.id);
    if (!c) { box.innerHTML = '<span class="pv6-empty">Elige una prenda de la lista.</span>'; return; }
    var f = Catalogo.foto(c, ST.col);
    box.innerHTML = f ? '<img src="' + esc(f) + '" alt="' + esc(c.n) + (ST.col ? ' en color ' + esc(ST.col) : '') + '" onerror="this.remove()">' : '<span class="pv6-empty">Esta prenda no tiene imagen en el catálogo.</span>';
  }

  function pintarInfo() {
    var box = $1('#pv6-info'), c = Catalogo.porId(ST.id);
    if (!c) { box.innerHTML = '<p class="pv6-hint">Selecciona una prenda para ver precio, tallas y añadirla al carrito.</p>'; return; }
    var colores = c.c || [], disp = Tallas.disponibles(c);
    var libres = ST.talla ? Tallas.libres(c, ST.talla) : 0, maxQ = Math.min(CFGP.CANTIDAD_MAX, libres);
    if (ST.cant > maxQ) ST.cant = Math.max(1, maxQ);
    var puede = Number(c.pr) > 0 && ST.talla && libres > 0;
    box.innerHTML =
      '<div class="pv6-info-top"><div><span class="pv6-eyebrow">' + esc((window.KN && window.KN[c.k]) || c.k) + (c.e ? ' · ' + esc(c.e) : '') + '</span><h3>' + esc(c.n) + '</h3></div>' +
      '<div class="pv6-price">' + (Number(c.pr) > 0 ? '<b>' + money(c.pr) + '</b>' : '<b>Precio por confirmar</b>') + (Number(c.old) > Number(c.pr) ? ' <s>' + money(c.old) + '</s>' : '') + '</div></div>' +
      (c.stockDemo ? '<p class="pv6-badge-demo">Stock de EJEMPLO (DEMO): estas cantidades son inventadas para probar el flujo.</p>' : '') +
      (colores.length ? '<div class="pv6-row"><label>Color: <b>' + esc(ST.col) + '</b></label><div class="pv6-sw">' + colores.map(function (x) { return '<button type="button" class="pv6-swb' + (x === ST.col ? ' on' : '') + '" data-pv6-col="' + esc(x) + '" title="' + esc(x) + '" aria-label="Color ' + esc(x) + '" aria-pressed="' + (x === ST.col) + '" style="background:' + esc((window.COL && window.COL[x]) || '#999') + '"></button>'; }).join('') + '</div></div>' : '<p class="pv6-hint">Colores pendientes de confirmar.</p>') +
      '<div class="pv6-row"><label>Talla' + (ST.talla ? ': <b>' + esc(ST.talla) + '</b>' : '') + '</label><div class="pv6-szs">' + window.SIZES.map(function (z) {
        var e = Tallas.estado(c, z.t), sel = z.t === ST.talla;
        return '<button type="button" class="pv6-sz' + (sel ? ' on' : '') + (e.ok ? '' : ' off') + '" data-pv6-sz="' + esc(z.t) + '"' + (e.ok ? '' : ' disabled aria-disabled="true"') + ' aria-pressed="' + sel + '"><b>' + esc(z.t) + '</b><small>' + esc(e.txt) + '</small></button>';
      }).join('') + '</div>' + (disp.length ? '' : '<p class="pv6-no">Esta prenda no tiene tallas disponibles ahora.</p>') + '</div>' +
      '<div class="pv6-row pv6-qty"><label>Cantidad</label><div><button type="button" data-pv6-qty="-1" aria-label="Menos" ' + (ST.cant <= 1 ? 'disabled' : '') + '>−</button><output id="pv6-q" aria-live="polite">' + ST.cant + '</output><button type="button" data-pv6-qty="1" aria-label="Más" ' + (ST.cant >= maxQ ? 'disabled' : '') + '>+</button></div>' + (ST.talla ? '<small>' + libres + ' disponible(s) en talla ' + esc(ST.talla) + '</small>' : '') + '</div>' +
      '<div class="pv6-actions"><button type="button" class="pv6-cta" id="pv6-add" ' + (puede ? '' : 'disabled') + '>Añadir al carrito</button><button type="button" class="pv6-btn pv6-ghost" id="pv6-ver">Ver en la tienda</button><button type="button" class="pv6-btn pv6-ghost" id="pv6-cart">Abrir carrito</button></div>' +
      '<div class="pv6-actions pv6-actions2"><button type="button" class="pv6-link" id="pv6-asist">Calcular mi talla con el asistente</button><button type="button" class="pv6-link" id="pv6-lia">← Volver a LÍA, asesora de moda</button></div>' +
      '<p class="pv6-fine">La visualización virtual no garantiza el ajuste físico real de la prenda. Consulta las tablas de medidas y el asistente de tallas de la tienda.</p>';
  }

  function cambiarCant(d) {
    var c = Catalogo.porId(ST.id); if (!c || !ST.talla) return;
    var maxQ = Math.min(CFGP.CANTIDAD_MAX, Tallas.libres(c, ST.talla));
    ST.cant = Math.min(Math.max(1, ST.cant + d), Math.max(1, maxQ)); pintarInfo();
  }

  function anadir(btn) {
    var ok = Carrito.anadir(ST.id, ST.col, ST.talla, ST.cant, btn);
    if (ok) { ST.cant = 1; var c = Catalogo.porId(ST.id); if (c && Tallas.libres(c, ST.talla) <= 0) { var d = Tallas.disponibles(c); ST.talla = d.length ? d[0].t : ''; } pintarGrid(); }
    pintarInfo();
  }

  function pintarDemo() {
    var box = $1('#pv6-demo'), mont = $1('#pv6-mont'), c = Catalogo.porId(ST.id);
    if (!box) return;
    if (!Fotos.url || !c) {
      mont.hidden = true;
      box.innerHTML = '<span class="pv6-empty">' + (!Fotos.url && !c ? 'Elige una fotografía y una prenda para ver la demostración.' : (!Fotos.url ? 'Falta tu fotografía.' : 'Falta elegir una prenda.')) + '</span>';
      return;
    }
    mont.hidden = false; $1('#pv6-sliders').hidden = !ST.montaje;
    var token = (pintarDemo.t = (pintarDemo.t || 0) + 1);
    box.innerHTML = '<span class="pv6-loading" role="status"><i class="pv6-spin"></i> Preparando vista de demostración…</span>';
    MotorDemo.preparar(function () {
      if (token !== pintarDemo.t || !ST.abierto) return;
      var f = Catalogo.foto(c, ST.col);
      box.innerHTML = '<div class="pv6-demo-in"><img class="pv6-demo-photo" src="' + Fotos.url + '" alt="Tu fotografía (vista de demostración)">' +
        (ST.montaje && f ? '<img class="pv6-overlay" id="pv6-overlay" src="' + esc(f) + '" alt="Montaje ilustrativo de ' + esc(c.n) + '"><span class="pv6-ribbon">MONTAJE ILUSTRATIVO</span>' : '') +
        '<span class="pv6-stamp">SIMULACIÓN · SIN IA</span></div>' +
        '<p class="pv6-cap">' + esc(ST.montaje ? MotorDemo.montaje : MotorDemo.etiqueta) + '</p>';
      ajustarMontaje();
    });
  }
  function ajustarMontaje() {
    var o = $1('#pv6-overlay'); if (!o) return;
    o.style.width = ST.escala + '%'; o.style.top = ST.posY + '%'; o.style.left = ST.posX + '%';
  }

  function abrir(o) {
    o = o || {}; build(); DatosDemo.aplicar(window.CAT);
    var p = $1('#pv6-panel'); p.classList.add('on'); p.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('pv6-lock'); ST.abierto = true;
    if (o.genero) ST.genero = o.genero;
    if (o.categoria !== undefined) ST.categoria = o.categoria || '';
    if (o.color !== undefined) ST.color = o.color || '';
    if (o.texto !== undefined) ST.texto = o.texto || '';
    $1('#pv6-f-q').value = ST.texto;
    var prod = o.id ? Catalogo.porId(o.id) : null;
    if (prod) { ST.genero = prod.gender || ST.genero; }
    pintarFiltros(); pintarFoto();
    if (prod) elegirProducto(prod.id, o.col); else { pintarGrid(); pintarInfo(); pintarPrenda(); pintarDemo(); }
    try { window.track('probador6_abrir', prod ? prod.n : ''); } catch (e) {}
    setTimeout(function () { var x = $1('#pv6-close'); if (x) x.focus(); }, 30);
  }
  function cerrar() {
    var p = $1('#pv6-panel'); if (!p) return;
    p.classList.remove('on'); p.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('pv6-lock'); ST.abierto = false;
    Fotos.quitar(); ST.montaje = false; Resultados.limpiar();      /* se revoca la URL temporal y no queda rastro */
    var c = $1('#pv6-mont-on'); if (c) c.checked = false;
    pintarFoto(); pintarDemo(); pintarGrid(); msg('Formatos: JPG, JPEG, PNG o WEBP · máximo ' + CFGP.TAM_MAX_MB + ' MB. Usa solo fotos tuyas o con consentimiento de la persona.');
  }
  function volverALia() { cerrar(); if (window.LIA_MODA_DEMO && window.LIA_MODA_DEMO.open) window.LIA_MODA_DEMO.open(); else toast0('LÍA no está disponible en esta versión.'); }
  function toast0(t) { if (window.toast) window.toast(t); }

  /* ---------- 11. INTEGRACIÓN CON LÍA (sin crear otro chatbot) ---------- */
  var RX_PROBAR = /(probar|probarme|probarlo|probarla|pruebo|probador|ver como me queda|como me queda)/;
  function interpretar(q) {
    var n = norm(q), o = { genero: '', categoria: '', color: '' };
    if (/hombre|masculin|varon/.test(n)) o.genero = 'hombre'; else if (/mujer|femenin|dama/.test(n)) o.genero = 'mujer';
    if (/pantalon|jean/.test(n)) o.categoria = 'pantalon'; else if (/vestido/.test(n)) o.categoria = 'vestido'; else if (/casaca|chaqueta|blazer|abrigo/.test(n)) o.categoria = 'casaca'; else if (/camisa/.test(n)) o.categoria = 'camisa'; else if (/blusa|polo|top|sueter|polera/.test(n)) o.categoria = 'top'; else if (/short/.test(n)) o.categoria = 'short'; else if (/falda/.test(n)) o.categoria = 'falda';
    Object.keys(window.COL || {}).forEach(function (k) { if (n.indexOf(norm(k)) > -1) o.color = k; });
    return o;
  }
  function buscarParaLia(q) {
    var o = interpretar(q), gen = o.genero ? [o.genero] : ['mujer', 'hombre'];
    for (var i = 0; i < gen.length; i++) {
      var l = Catalogo.filtrar({ genero: gen[i], categoria: o.categoria, color: o.color, soloDisponibles: true });
      if (l.length) return { opts: { genero: gen[i], categoria: o.categoria, color: o.color }, producto: l[0] };
    }
    return { opts: o, producto: null };
  }
  function liaMsg(t, kind) { var log = $1('#lia5-log'); if (!log) return; var d = document.createElement('div'); d.className = 'lia5-msg ' + (kind || 'bot'); d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; }

  function integrarLia() {
    var form = $1('#lia5-form');
    if (form && !form.__pv6) {
      form.__pv6 = 1;
      document.addEventListener('submit', function (e) {
        if (e.target !== form) return;
        var inp = $1('#lia5-question'), q = inp ? String(inp.value || '').trim() : '';
        if (!q || !RX_PROBAR.test(norm(q))) return;                       /* otras preguntas: las atiende LÍA igual que antes */
        e.preventDefault(); e.stopImmediatePropagation();
        inp.value = ''; liaMsg(q, 'user');
        var r = buscarParaLia(q);
        if (!r.producto) { liaMsg('No encontré una prenda así con tallas disponibles, así que no puedo llevarte al probador con ella. No voy a inventar productos. Prueba con otra categoría o color.', 'bot'); return; }
        liaMsg('Te llevo al probador virtual con ' + r.producto.n + '. Recuerda: es una demostración, no una simulación real con IA.', 'bot');
        if (window.LIA_MODA_DEMO && window.LIA_MODA_DEMO.close) window.LIA_MODA_DEMO.close();
        abrir({ id: r.producto.id, genero: r.opts.genero, categoria: r.opts.categoria, color: (r.opts.color && (r.producto.c || []).indexOf(r.opts.color) > -1) ? r.opts.color : '' });
      }, true);
      var chips = $1('.lia5-prompts') || $1('#lia5-panel .lia5-controls');
      var sug = document.createElement('button'); sug.type = 'button'; sug.className = 'pv6-lia-chip'; sug.textContent = '👗 Quiero probar una chaqueta negra';
      sug.onclick = function () { var i = $1('#lia5-question'); if (i) { i.value = 'Quiero probar una chaqueta negra'; if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); } };
      var anchor = $1('#lia5-form'); if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sug, anchor);
      var head = $1('#lia5-panel .lia5-head small'); if (head && CFGP.STOCK_DEMO) head.textContent += ' · stock de ejemplo';
    }
    /* Botón "Probar en el probador" dentro de cada tarjeta de LÍA */
    var res = $1('#lia5-results');
    if (res && !res.__pv6) {
      res.__pv6 = 1;
      var pone = function () {
        $$('.lia5-product', res).forEach(function (card) {
          if ($1('[data-pv6-try]', card)) return;
          var add = $1('[data-lia5-add]', card); if (!add) return;
          var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-pv6-try', add.getAttribute('data-lia5-add')); b.textContent = 'Probar virtualmente';
          add.parentNode.appendChild(b);
        });
      };
      new MutationObserver(pone).observe(res, { childList: true, subtree: true }); pone();
      res.addEventListener('click', function (e) {
        var t = e.target.closest('[data-pv6-try]'); if (!t) return;
        if (window.LIA_MODA_DEMO && window.LIA_MODA_DEMO.close) window.LIA_MODA_DEMO.close();
        abrir({ id: t.getAttribute('data-pv6-try') });
      });
    }
  }

  /* Botón en la ficha de producto de la tienda */
  function integrarFicha() {
    var v = $1('#view'); if (!v) return;
    var ponerBtn = function () {
      var h = (location.hash || '').split('/');
      if (h[0] !== '#producto' || !h[1]) return;
      var fp = $1('#fp', v); if (!fp || $1('#pv6-fp', v)) return;
      var b = document.createElement('button'); b.type = 'button'; b.id = 'pv6-fp'; b.className = 'btn o'; b.textContent = 'Probador virtual (demo)';
      b.onclick = function () { abrir({ id: decodeURIComponent(h[1]) }); };
      fp.parentNode.insertBefore(b, fp.nextSibling);
    };
    new MutationObserver(ponerBtn).observe(v, { childList: true, subtree: false });
    window.addEventListener('hashchange', function () { setTimeout(ponerBtn, 60); });
    ponerBtn();
  }

  /* ---------- 12. API PÚBLICA ---------- */
  window.PROBADOR_VIRTUAL = {
    modoDemo: true,
    abrir: abrir, cerrar: cerrar,
    adaptadorVTO: AdaptadorVTO,
    /* utilidades expuestas para pruebas */
    _internos: { Fotos: Fotos, Catalogo: Catalogo, Tallas: Tallas, Carrito: Carrito, DatosDemo: DatosDemo, MotorDemo: MotorDemo, Resultados: Resultados, estado: ST }
  };

  function init() { build(); integrarLia(); integrarFicha(); try { if (window.route) window.route(); } catch (e) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
