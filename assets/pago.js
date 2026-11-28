/* SMART FIT CUSCO — Finalizar compra: entrega, métodos de pago y códigos de descuento.
   Se carga después de assets/app.js. No toca el resto de la tienda. */
(function () {
  'use strict';
  var ENVIO = 10, GRATIS = 129.9;
  var CODIGOS = {
    PAGO5: { p: 0.05, t: '5% de descuento por tu adelanto anterior' },
    RESENA5: { p: 0.05, t: '5% de descuento por tu reseña' }
  };
  var F = { nombre: '', tel: '', entrega: 'recojo', pago: 'yape', dir: '', codigo: '', cod: null, codmsg: '', busy: false };

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return 'S/ ' + Number(n || 0).toFixed(2); }
  function r2(n) { return Math.round(n * 100) / 100; }

  var st = document.createElement('style');
  st.textContent =
    '.ck-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:24px;align-items:start}' +
    '@media(max-width:820px){.ck-grid{grid-template-columns:1fr}}' +
    '.ck-box{border:1px solid #c9d3e2;border-radius:12px;padding:16px;margin-bottom:16px;background:#fff}' +
    '.ck-box,.ck-box *{color:#14243a!important;-webkit-text-fill-color:#14243a!important}' +
    '.ck-box h3{margin:0 0 10px;font-size:16px}' +
    '.ck-box .fl{display:block;margin:8px 0}' +
    '.ck-box input[type=text],.ck-box input:not([type]),.ck-box input[inputmode]{background:#fff!important}' +
    '.ck-op{display:flex;gap:10px;align-items:flex-start;border:1.5px solid #c9d3e2;border-radius:10px;padding:12px;margin:8px 0;cursor:pointer;background:#fff!important}' +
    '.ck-op.sel{border-color:#1f4e8c;background:#e8f0fb!important;box-shadow:0 0 0 1px #1f4e8c inset}' +
    '.ck-op input{width:auto;margin-top:3px;accent-color:#1f4e8c}' +
    '.ck-op b{display:block}' +
    '.ck-box .ck-op small{display:block;margin-top:2px;color:#4a5a70!important;-webkit-text-fill-color:#4a5a70!important;text-transform:none;letter-spacing:0}' +
    '.ck-side{position:sticky;top:110px}' +
    '.ck-row{display:flex;justify-content:space-between;gap:10px;margin:6px 0;font-size:14px}' +
    '.ck-row.t{font-size:18px;font-weight:700;border-top:1px solid #c9d3e2;padding-top:10px;margin-top:10px}' +
    '.ck-ln{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:6px 0;border-bottom:1px solid #e1e7f0}' +
    '.ck-cod{display:flex;gap:8px;margin-top:12px}.ck-cod input{flex:1;min-width:0}' +
    '.ck-box .btn:not(.o){background:#14243a!important;color:#fff!important;-webkit-text-fill-color:#fff!important}' +
    '.ck-box .btn.o{background:#fff!important;border:2px solid #14243a!important}' +
    '.ck-box .lab{color:#4a5a70!important;-webkit-text-fill-color:#4a5a70!important}';
  document.head.appendChild(st);

  function calc() {
    var sub = 0, desc = 0;
    var lines = CART.map(function (x, i) {
      var c = byId(x.id) || {}, rate = i === 1 ? 0.05 : (i >= 2 ? 0.10 : 0), base = Number(c.pr) || 0, sv = r2(base * rate);
      sub += base; desc += sv;
      return { x: x, c: c, price: r2(base - sv) };
    });
    var neto = r2(sub - desc), cd = F.cod ? r2(neto * F.cod.p) : 0, bienes = r2(neto - cd);
    var env = (F.entrega === 'envio' && bienes < GRATIS) ? ENVIO : 0, total = r2(bienes + env);
    return { lines: lines, sub: r2(sub), desc: r2(desc), cd: cd, env: env, total: total, adel: Math.round(total * 50) / 100 };
  }

  function op(name, val, sel, tit, desc) {
    return '<label class="ck-op' + (sel ? ' sel' : '') + '"><input type="radio" name="' + name + '" value="' + val + '"' + (sel ? ' checked' : '') + '><span><b>' + tit + '</b><small>' + desc + '</small></span></label>';
  }

  function cuerpo() {
    if (F.entrega === 'envio' && F.pago === 'tienda') F.pago = 'yape';
    var c = calc(), saldo = r2(c.total - c.adel);
    var p1 = '<div class="ck-box"><h3>1. Tus datos</h3>' +
      '<label class="fl">Nombre y apellido<input id="fin-nombre" autocomplete="name" value="' + esc(F.nombre) + '" placeholder="Ej. María Quispe"></label>' +
      '<label class="fl">Celular / WhatsApp<input id="fin-tel" inputmode="numeric" maxlength="9" autocomplete="tel" value="' + esc(F.tel) + '" placeholder="9XXXXXXXX"></label></div>';
    var p2 = '<div class="ck-box"><h3>2. ¿Cómo recibes tu pedido?</h3>' +
      op('fin-entrega', 'recojo', F.entrega === 'recojo', 'Recojo en tienda · Gratis', 'Recoges en la tienda de Cusco. Coordinamos el horario por WhatsApp.') +
      op('fin-entrega', 'envio', F.entrega === 'envio', 'Envío en Cusco · ' + money(ENVIO), 'Gratis desde S/ 129.90 en tu compra. Lo llevamos a tu dirección en la ciudad de Cusco.') +
      (F.entrega === 'envio' ? '<label class="fl">Dirección y referencia<input id="fin-dir" autocomplete="street-address" value="' + esc(F.dir) + '" placeholder="Calle, número y referencia"></label>' : '') + '</div>';
    var p3 = '<div class="ck-box"><h3>3. ¿Cómo pagas?</h3>' +
      op('fin-pago', 'yape', F.pago === 'yape', 'Yape · adelanto del 50%', 'Pagas ' + money(c.adel) + ' con el QR de Yape y el saldo al recibir tu pedido.') +
      op('fin-pago', 'whatsapp', F.pago === 'whatsapp', 'WhatsApp · coordinar el pago', 'Enviamos tu pedido por WhatsApp y la tienda te indica las formas de pago disponibles.') +
      (F.entrega === 'recojo' ? op('fin-pago', 'tienda', F.pago === 'tienda', 'Pagar al recoger en tienda', 'Reservas hoy y pagas cuando recojas tu pedido.') : '') + '</div>';
    var lns = c.lines.map(function (l) {
      return '<div class="ck-ln"><span>' + esc(l.c.n) + ' · ' + esc(l.x.col) + ' · talla ' + esc(l.x.sz) + '</span><b>' + money(l.price) + '</b></div>';
    }).join('');
    var btn = F.pago === 'yape' ? 'Continuar al pago con Yape' : (F.pago === 'tienda' ? 'Reservar mi pedido' : 'Enviar pedido por WhatsApp');
    var res = '<aside class="ck-side"><div class="ck-box"><h3>Resumen</h3>' + lns +
      '<div class="ck-row" style="margin-top:10px"><span>Subtotal</span><span>' + money(c.sub) + '</span></div>' +
      (c.desc ? '<div class="ck-row"><span>Descuento por compra múltiple</span><span>− ' + money(c.desc) + '</span></div>' : '') +
      (c.cd ? '<div class="ck-row"><span>Código ' + esc(F.cod.k) + '</span><span>− ' + money(c.cd) + '</span></div>' : '') +
      '<div class="ck-row"><span>Entrega</span><span>' + (F.entrega === 'envio' ? (c.env ? money(c.env) : 'Envío gratis') : 'Recojo gratis') + '</span></div>' +
      '<div class="ck-row t"><span>Total</span><span>' + money(c.total) + '</span></div>' +
      (F.pago === 'yape' ? '<div class="ck-row"><span>Pagas ahora (50%)</span><b>' + money(c.adel) + '</b></div><div class="ck-row"><span>Saldo al recibir</span><span>' + money(saldo) + '</span></div>' : '') +
      '<div class="ck-cod"><input id="fin-cod" placeholder="Código de descuento" value="' + esc(F.codigo) + '" autocomplete="off"><button type="button" class="btn o sm" id="fin-aplicar">Aplicar</button></div>' +
      (F.codmsg ? '<p class="lab" style="margin:6px 0 0">' + esc(F.codmsg) + '</p>' : '') +
      '<button type="button" class="btn" id="fin-confirmar" style="width:100%;margin-top:14px">' + btn + '</button>' +
      '<p class="lab" style="margin:8px 0 0">Cambio de talla sin costo · Atención por WhatsApp</p></div></aside>';
    return '<div class="ck-grid"><div>' + p1 + p2 + p3 + '</div>' + res + '</div>';
  }

  function pintar() { var r = document.getElementById('fin-root'); if (r) r.innerHTML = cuerpo(); }

  PG.finalizar = function () {
    CART = CART.filter(function (x) { return byId(x.id); });
    if (!F.nombre && window.CLI && CLI.n) F.nombre = CLI.n;
    if (!F.tel && window.CLI && CLI.t) F.tel = String(CLI.t).replace(/\D/g, '').slice(-9);
    var head = '<section class="w pg" style="max-width:1000px;padding-top:40px;padding-bottom:64px"><p class="crumb"><a href="#inicio">Inicio</a> / Finalizar compra</p><h1>Finalizar compra</h1>';
    if (!CART.length) return head + '<p style="color:var(--mut)">Tu bolsa está vacía.</p><div class="row" style="margin-top:18px"><a class="btn" href="#tienda">Ir a la tienda</a></div></section>';
    return head + '<div id="fin-root">' + cuerpo() + '</div></section>';
  };

  PG.gracias = function () {
    var o = null; try { o = JSON.parse(sessionStorage.getItem('sfc_ultimo_pedido') || 'null'); } catch (e) { o = null; }
    if (!o) return '<section class="w pg" style="max-width:650px;padding-top:48px;padding-bottom:64px"><h1>No hay un pedido reciente</h1><p style="color:var(--mut)">Cuando registres un pedido, aquí verás su confirmación.</p><div class="row" style="margin-top:18px"><a class="btn" href="#tienda">Ir a la tienda</a><a class="btn o" href="#seguimiento">Seguimiento</a></div></section>';
    var tienda = /Reserva/.test(o.canal || ''), nom = esc(o.cliente), num = (CFG.WHATSAPP || '51944182573');
    var entrega = o.entrega === 'envio' ? 'Envío en Cusco' + (o.direccion ? ' · ' + esc(o.direccion) : '') : 'Recojo en tienda';
    var pasos = tienda
      ? '<li>Tu reserva quedó registrada. Si se abrió WhatsApp, pulsa <b>Enviar</b> para confirmarla.</li><li>Pagas al recoger tu pedido en la tienda de Cusco; coordinamos el horario contigo.</li><li>Guarda tu código para consultar el estado en Seguimiento.</li>'
      : '<li>Se abrió WhatsApp con tu pedido. Pulsa <b>Enviar</b> para que la tienda lo reciba.</li><li>La tienda confirmará la disponibilidad y coordinará contigo la forma de pago.</li><li>Guarda tu código para consultar el estado en Seguimiento.</li>';
    return '<section class="w pg" style="max-width:650px;padding-top:48px;padding-bottom:64px"><p class="crumb">Inicio / Pedido registrado</p><p class="up">SMART FIT CUSCO</p><h1>' + (tienda ? '¡Listo, ' + nom + '! Tu reserva fue registrada' : '¡Gracias, ' + nom + '! Tu pedido fue registrado') + '</h1>' +
      '<div class="mod" style="margin:20px 0"><p class="up">Resumen</p><p><b>Código de seguimiento:</b> ' + esc(o.codigo_seguimiento) + '</p><p><b>Entrega:</b> ' + entrega + '</p><p><b>Pago:</b> ' + (tienda ? 'al recoger en tienda' : 'coordinado por WhatsApp') + '</p><p><b>Total:</b> ' + money(o.total) + '</p></div>' +
      '<div class="mod" style="margin-bottom:18px"><p class="up">Qué sigue</p><ol style="margin:8px 0 0;padding-left:20px;line-height:1.7">' + pasos + '</ol></div>' +
      '<div class="row"><a class="btn" href="#seguimiento">Ver seguimiento</a><a class="btn o" target="_blank" rel="noopener" href="https://wa.me/' + num + '?text=' + encodeURIComponent('Hola Smart Fit Cusco, consulto por mi pedido ' + o.codigo_seguimiento + '.') + '">Abrir WhatsApp otra vez</a><a class="btn o" href="#tienda">Seguir comprando</a></div></section>';
  };

  if (typeof TT !== 'undefined') { TT.finalizar = 'Finalizar compra | Smart Fit Cusco'; TT.gracias = 'Pedido registrado | Smart Fit Cusco'; }

   function aplicar() {
    var k = String(F.codigo || '').trim().toUpperCase();
    if (!k) { F.cod = null; F.codmsg = ''; pintar(); return; }
    F.codmsg = 'Validando código…'; pintar();
    var n = 'sfv' + Date.now(), s = document.createElement('script');
    window[n] = function (r) {
      delete window[n]; s.remove();
      if (r && r.ok) { F.cod = { k: k, p: r.descuento / 100, t: r.descuento + '% de descuento en tu compra' }; F.codmsg = 'Código aplicado: ' + F.cod.t + '.'; }
      else { F.cod = null; F.codmsg = (r && r.mensaje) || 'No pudimos validar el código. Inténtalo de nuevo.'; }
      pintar();
    };
    s.onerror = function () { delete window[n]; s.remove(); F.cod = null; F.codmsg = 'No pudimos validar el código. Inténtalo de nuevo.'; pintar(); };
    s.src = (window.CONFIG || CFG).ENDPOINT + '?validar_cupon=' + encodeURIComponent(k) + '&callback=' + n;
    document.body.appendChild(s);
  }
  function aplicarAntiguo() {
  function aplicar() {
    var k = String(F.codigo || '').trim().toUpperCase(), d = CODIGOS[k];
    F.codigo = k;
    if (!k) { F.cod = null; F.codmsg = ''; }
    else if (d) { F.cod = { k: k, p: d.p, t: d.t }; F.codmsg = 'Código aplicado: ' + d.t + '.'; }
    else { F.cod = null; F.codmsg = 'Ese código no es válido.'; }
    pintar();
  }

  function confirmar() {
    if (F.busy) return;
    var nom = F.nombre.trim(), tel = F.tel.replace(/\D/g, '');
    if (nom.length < 5 || nom.indexOf(' ') < 1) { toast('Escribe tu nombre y apellido'); return; }
    if (!/^9\d{8}$/.test(tel)) { toast('Escribe un celular de 9 dígitos que empiece con 9'); return; }
    if (F.entrega === 'envio' && F.dir.trim().length < 8) { toast('Escribe tu dirección de entrega en Cusco'); return; }
    if (!CART.length) return;
    if (CART.some(function (x) { var c = byId(x.id); return !c || !(Number(c.pr) > 0); })) { toast('Hay prendas sin precio confirmado.'); return; }
    F.busy = true;
    var c = calc(), cart = CART.slice();
    var canal = F.pago === 'yape' ? 'Yape (adelanto 50%)' : (F.pago === 'tienda' ? 'Reserva en tienda' : 'WhatsApp');
    var o = {
      pedido_id: 'P' + Date.now().toString(36).toUpperCase().slice(-6),
      codigo_seguimiento: crearCodigoSeguimiento(),
      canal: canal, cliente: nom, telefono: tel,
      items: cart.map(function (x) { return byId(x.id).n + ' (' + x.col + ', talla ' + x.sz + ')'; }).join(' | '),
      cantidad: cart.length, total: c.total, estado: 'Nuevo', entrega: F.entrega, codigo_descuento: F.cod ? F.cod.k : '',
      cantidad: cart.length, total: c.total, estado: 'Nuevo',
      line_items: cart.map(function (x) { return { id: x.id, talla: x.sz, color: x.col, cantidad: Number(x.qty) || 1 }; }),
      detalle: 'pedido ' + canal + ' · ' + (F.entrega === 'envio' ? 'envío Cusco: ' + F.dir.trim() : 'recojo en tienda') + (F.cod ? ' · código ' + F.cod.k : '')
    };
    CLI.n = nom; CLI.t = tel;
    push('pedido', o);
    if (window.DemoPedidos) DemoPedidos.guardar(o, cart);
    try { sessionStorage.setItem('sfc_ultimo_pedido', JSON.stringify(Object.assign({}, o, { entrega: F.entrega, direccion: F.dir.trim(), envio: c.env }))); } catch (e) {}
    track('finalizar_compra', canal);
    var destino = '#gracias';
    if (F.pago === 'yape') {
      try { sessionStorage.setItem('sfc_pago_pendiente', JSON.stringify({ codigo_seguimiento: o.codigo_seguimiento, pedido_id: o.pedido_id, cliente: nom, telefono: tel, total: c.total })); } catch (e) {}
      destino = '#pago';
    } else {
      var lineas = cart.map(function (x) { return '• ' + byId(x.id).n + ' (' + x.col + ', talla ' + x.sz + ')'; }).join('\n');
      var msg = 'Hola Smart Fit Cusco, soy ' + nom + '.\nQuiero ' + (F.pago === 'tienda' ? 'reservar este pedido y pagar al recoger' : 'hacer este pedido y coordinar el pago') + ':\n' + lineas +
        '\nEntrega: ' + (F.entrega === 'envio' ? 'envío en Cusco a ' + F.dir.trim() : 'recojo en tienda') +
        '\nTotal: ' + money(c.total) + '\nCódigo de seguimiento: ' + o.codigo_seguimiento +
        '\nSeguimiento: ' + location.origin + location.pathname + '#seguimiento';
      window.open('https://wa.me/' + (CFG.WHATSAPP || '51944182573') + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    }
    CART = []; cc();
    F.busy = false; F.cod = null; F.codigo = ''; F.codmsg = '';
    location.hash = destino;
  }

  document.addEventListener('input', function (e) {
    var t = e.target; if (!t || !t.id) return;
    if (t.id === 'fin-nombre') F.nombre = t.value;
    else if (t.id === 'fin-tel') { F.tel = t.value.replace(/\D/g, '').slice(0, 9); t.value = F.tel; }
    else if (t.id === 'fin-dir') F.dir = t.value;
    else if (t.id === 'fin-cod') F.codigo = t.value;
  });
  document.addEventListener('change', function (e) {
    var t = e.target; if (!t) return;
    if (t.name === 'fin-entrega') { F.entrega = t.value; pintar(); }
    else if (t.name === 'fin-pago') { F.pago = t.value; pintar(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.id === 'fin-cod') { e.preventDefault(); aplicar(); }
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#fin-aplicar,#fin-confirmar'); if (!b) return;
    if (b.id === 'fin-aplicar') aplicar(); else confirmar();
  });

  /* La bolsa deja de mostrar 3 botones sueltos: ahora lleva a "Finalizar compra". */
  function envolver() {
    var b = document.getElementById('cartb');
    if (!b || typeof b.onclick !== 'function' || b.__fin) return;
    var viejo = b.onclick; b.__fin = true;
    b.onclick = function () {
      viejo.call(b);
      if (!CART.length) return;
      var cart = document.getElementById('cart'); if (!cart) return;
      var d = document.getElementById('pcn');
      if (d && d.parentNode && d.parentNode.parentNode) d.parentNode.parentNode.removeChild(d.parentNode);
      ['rsv', 'wa', 'payn'].forEach(function (id) { var e = document.getElementById(id); if (e && e.parentNode) e.parentNode.removeChild(e); });
      var a = document.createElement('a');
      a.id = 'fin-ir'; a.className = 'btn'; a.href = '#finalizar';
      a.style.cssText = 'display:block;width:100%;text-align:center;margin-top:8px';
      a.textContent = 'Finalizar compra';
      a.onclick = function () { var dr = document.getElementById('drw'); if (dr) dr.classList.remove('on'); };
      cart.appendChild(a);
      var n = document.createElement('p'); n.className = 'lab'; n.style.margin = '8px 0 0';
      n.textContent = 'En el siguiente paso eliges la entrega y la forma de pago.';
      cart.appendChild(n);
    };
  }
  envolver();
  if (/^#(finalizar|gracias)$/.test(location.hash)) route();
})();
