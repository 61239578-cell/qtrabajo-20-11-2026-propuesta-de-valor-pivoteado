(function () {
  if (window.__asistenteIA) return;
  window.__asistenteIA = true;

  var WORKER_URL = 'https://mi-tienda-ia.61239578.workers.dev/';
  var MAX = 500;

  var css = '' +
    '#aia-btn{position:fixed;left:16px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:9998;background:#07162e;color:#fff;border:0;border-radius:24px;padding:12px 16px;font:600 14px sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}' +
    '#aia-panel{position:fixed;left:16px;bottom:calc(136px + env(safe-area-inset-bottom,0px));z-index:9999;width:min(360px,calc(100vw - 32px));height:min(420px,60vh);background:#fff;color:#111;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;font:14px sans-serif}' +
    '#aia-panel.open{display:flex}' +
    '#aia-head{background:#07162e;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:600}' +
    '#aia-close{background:none;border:0;color:#fff;font-size:18px;cursor:pointer}' +
    '#aia-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f4f5f7}' +
    '.aia-m{max-width:85%;padding:8px 12px;border-radius:12px;line-height:1.4;white-space:pre-wrap;word-wrap:break-word}' +
    '.aia-bot{background:#fff;align-self:flex-start;border:1px solid #e1e3e8}' +
    '.aia-user{background:#07162e;color:#fff;align-self:flex-end}' +
    '#aia-form{display:flex;gap:6px;padding:10px;border-top:1px solid #e1e3e8;background:#fff}' +
    '#aia-input{flex:1;border:1px solid #c9ccd3;border-radius:8px;padding:9px;font:14px sans-serif}' +
    '#aia-send{background:#07162e;color:#fff;border:0;border-radius:8px;padding:0 14px;cursor:pointer;font-weight:600}' +
    '#aia-send:disabled{opacity:.5;cursor:default}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'aia-btn';
  btn.type = 'button';
  btn.textContent = '💬 Asistente IA';

  var panel = document.createElement('div');
  panel.id = 'aia-panel';

  var head = document.createElement('div');
  head.id = 'aia-head';
  var title = document.createElement('span');
  title.textContent = 'Asistente Smart Fit';
  var close = document.createElement('button');
  close.id = 'aia-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Cerrar');
  close.textContent = '✕';
  head.appendChild(title);
  head.appendChild(close);

  var msgs = document.createElement('div');
  msgs.id = 'aia-msgs';

  var form = document.createElement('div');
  form.id = 'aia-form';
  var input = document.createElement('input');
  input.id = 'aia-input';
  input.type = 'text';
  input.maxLength = MAX;
  input.placeholder = 'Escribe tu pregunta...';
  var send = document.createElement('button');
  send.id = 'aia-send';
  send.type = 'button';
  send.textContent = 'Enviar';
  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(head);
  panel.appendChild(msgs);
  panel.appendChild(form);
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'aia-m ' + (who === 'user' ? 'aia-user' : 'aia-bot');
    d.textContent = text; // textContent evita XSS
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  addMsg('¡Hola! Soy el asistente de Smart Fit Cusco. Pregúntame por tallas, prendas, envíos o pagos. (No compartas datos personales.)', 'bot');

  var busy = false;
  async function enviar() {
    var texto = input.value.trim();
    if (!texto || busy) return;
    busy = true;
    send.disabled = true;
    input.value = '';
    addMsg(texto, 'user');
    var espera = addMsg('Escribiendo...', 'bot');
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 20000);
    try {
      var r = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto.slice(0, MAX) }),
        signal: ctrl.signal
      });
      var data = await r.json();
      espera.textContent = data.respuesta || 'No pude responder ahora. Escríbenos por WhatsApp.';
    } catch (e) {
      espera.textContent = 'No pude conectarme en este momento. Por favor escríbenos por WhatsApp.';
    } finally {
      clearTimeout(t);
      busy = false;
      send.disabled = false;
      msgs.scrollTop = msgs.scrollHeight;
    }
  }

  btn.addEventListener('click', function () {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });
  close.addEventListener('click', function () { panel.classList.remove('open'); });
  send.addEventListener('click', enviar);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') enviar(); });
})();
