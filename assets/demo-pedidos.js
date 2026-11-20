/* SMART FIT CUSCO — Módulo DEMO: pedidos, seguimiento y stock (todo local, funciona como si fuera real) */
(function(){
var K='sfc_orders',KS='sfc_sold',KA='sfc_trk_auto';
function rd(k,d){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}}
function wr(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){return 'S/ '+Number(n||0).toFixed(2)}
function fdt(t){return new Date(t).toLocaleString('es-PE',{timeZone:'America/Lima',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function M(n){return n*60000}
function orders(){return rd(K,[])}
function save(a){wr(K,a)}
function find(code){code=String(code||'').toUpperCase();return orders().filter(function(o){return o.codigo===code})[0]}
function upd(o){var a=orders();for(var i=0;i<a.length;i++)if(a[i].codigo===o.codigo)a[i]=o;save(a)}
function q(s){return document.querySelector(s)}
function toastx(t){if(typeof toast==='function')toast(t)}

/* ---- línea de tiempo simulada: avanza sola tras el pago ---- */
function timeline(o){
 var now=Date.now(),p=o.pago,h=[{estado:'Pedido recibido',t:o.creado,obs:'Tu pedido quedó registrado en Smart Fit Cusco.'},{estado:'Pago pendiente',t:o.creado+1000,obs:'Esperando el adelanto del 50% por Yape (simulación).'}];
 if(p){h.push({estado:'Pedido confirmado',t:p,obs:'Adelanto del 50% recibido (simulación Yape).'},{estado:'En preparación',t:p+M(1),obs:'Estamos preparando tus prendas.'},{estado:'Listo para entregar',t:p+M(3),obs:'Tu pedido está listo para recoger en la tienda de Cusco.'},{estado:'Entregado',t:p+M(6),obs:'Pedido entregado. ¡Gracias por tu compra!'})}
 h=h.filter(function(x){return x.t<=now});
 var adm=(o.adm||[]).slice().sort(function(a,b){return a.t-b.t});
 if(adm.length){h=h.filter(function(x){return x.t<=adm[0].t}).concat(adm)}
 return h}
function estado(o){var h=timeline(o);return h[h.length-1].estado}
function consulta(url){
 var c=(/[?&]codigo=([^&]+)/.exec(url)||[])[1],t=(/[?&]telefono4=([^&]+)/.exec(url)||[])[1];
 var o=find(decodeURIComponent(c||''));
 if(!o)return{ok:false,mensaje:'No encontramos ese pedido. Revisa el código o elige uno de tus pedidos guardados.'};
 if(String(o.telefono).replace(/\D/g,'').slice(-4)!==decodeURIComponent(t||''))return{ok:false,mensaje:'Los últimos cuatro dígitos no coinciden con el teléfono registrado.'};
 var h=timeline(o),pagado=!!o.pago,ad=Math.round(o.total*50)/100,eta=new Date(o.creado+2*864e5);
 return{ok:true,pedido:{codigo_seguimiento:o.codigo,estado:h[h.length-1].estado,fecha_pedido:fdt(o.creado),fecha_entrega_estimada:eta.toLocaleDateString('es-PE',{timeZone:'America/Lima'}),fecha_entrega_real:h[h.length-1].estado==='Entregado'?fdt(h[h.length-1].t):'',total_pedido:o.total,adelanto_requerido:ad,adelanto_simulado:pagado?ad:0,saldo_pendiente:pagado?Math.round((o.total-ad)*100)/100:o.total,estado_pago:pagado?'Adelanto pagado con Yape (50%)':'Pendiente de adelanto',fecha_simulacion:pagado?fdt(o.pago):''},
  historial:h.slice().reverse().map(function(x){return{estado_nuevo:x.estado,fecha_hora:fdt(x.t),observaciones:x.obs}})}}

/* ---- pedidos ---- */
function guardar(o,cart){
 var items=cart.map(function(x){var c=byId(x.id)||{};return{id:x.id,n:c.n||x.id,col:x.col,sz:x.sz,qty:Number(x.qty)||1,pr:Number(c.pr)||0}});
 var a=orders();a.unshift({codigo:o.codigo_seguimiento,pedido_id:o.pedido_id,cliente:o.cliente,telefono:o.telefono,total:Number(o.total)||0,items:items,creado:Date.now(),pago:null,canal:o.canal,adm:[]});save(a);badge()}
function ejemplo(){
 var its=CAT.filter(function(c){return vendible(c)}).slice(0,2).map(function(c){return{id:c.id,n:c.n,col:c.c[0],sz:'L',qty:1,pr:Number(c.pr)}});
 var tot=its.reduce(function(s,i){return s+i.pr},0),o={codigo:crearCodigoSeguimiento(),pedido_id:'P'+Date.now().toString(36).toUpperCase().slice(-6),cliente:'Cliente de ejemplo',telefono:'987651234',total:tot,items:its,creado:Date.now()-M(2),pago:Date.now()-M(1),canal:'Ejemplo',adm:[]};
 var a=orders();a.unshift(o);save(a);badge();return o}
function vender(o){var s=rd(KS,{});o.items.forEach(function(i){var k=i.id+'|'+i.sz;s[k]=(s[k]||0)+i.qty});wr(KS,s);stock(CAT)}
function pagar(pend,msg,btn){
 var o=find(pend.codigo_seguimiento);
 if(!o){o={codigo:pend.codigo_seguimiento,pedido_id:pend.pedido_id||'',cliente:pend.cliente||'',telefono:pend.telefono||pend.telefono4||'',total:Number(pend.total)||0,items:[],creado:Date.now(),pago:null,adm:[]};var a=orders();a.unshift(o);save(a)}
 if(o.pago){msg.textContent='Este pedido ya tiene su adelanto registrado.';return true}
 btn.disabled=true;msg.textContent='Validando el pago con Yape (simulación)…';
 setTimeout(function(){o.pago=Date.now();upd(o);vender(o);badge();try{sessionStorage.removeItem('sfc_pago_pendiente')}catch(e){}
  var ad=Math.round(o.total*50)/100;btn.textContent='Adelanto registrado ✓';
  msg.innerHTML='<b>¡Adelanto simulado correctamente!</b><br>Pagaste '+money(ad)+' (50%). Saldo pendiente: '+money(o.total-ad)+'. Esta operación no es un pago real.<div class="row" style="margin-top:12px"><button class="btn sm" data-ver="'+esc(o.codigo)+'">Ver seguimiento</button><a class="btn o sm" href="#pedidos">Mis pedidos</a></div>'},1200);
 return true}
function admin(code,st,obs,msgEl){
 var o=find(code);if(!o)return false;
 o.adm=o.adm||[];o.adm.push({estado:st,t:Date.now(),obs:obs||'Actualización registrada por la tienda (demo).'});upd(o);
 msgEl.textContent='Estado actualizado (demo, no requiere clave). Consulta el pedido para verlo.';return true}

/* ---- stock demo: mínimo 1 en todas las tallas, sin reducir el que ya existe ---- */
function stock(list){
 var s=rd(KS,{});(list||[]).forEach(function(c){
  if(!c._b){c._b={};SIZES.forEach(function(z){var n=c.stock&&c.stock[z.t]!=null?Number(c.stock[z.t]):0;c._b[z.t]=(isFinite(n)&&n>=1)?n:1})}
  c.stock={};SIZES.forEach(function(z){c.stock[z.t]=Math.max(0,c._b[z.t]-(s[c.id+'|'+z.t]||0))})});return list}

/* ---- vistas ---- */
function lista(modo){
 var a=orders().filter(function(o){return modo!=='pagados'||o.pago});
 if(!a.length)return '<div class="od empty"><p><b>'+(modo==='pagados'?'Todavía no tienes adelantos pagados.':'Aún no tienes pedidos.')+'</b></p><p>Cuando reserves una prenda y pagues el adelanto del 50% con Yape, tu pedido y su seguimiento aparecerán aquí.</p><div class="row"><a class="btn sm" href="#tienda">Ir a la tienda</a><button class="btn o sm" data-ejemplo="1">Crear pedido de ejemplo</button></div></div>';
 return a.map(function(o){var pg=!!o.pago,ad=Math.round(o.total*50)/100;
  return '<article class="od"><div class="odh"><span class="chip2 '+(pg?'ok':'warn')+'">'+(pg?'Adelanto pagado · Yape 50%':'Adelanto pendiente')+'</span><span class="chip2 info">'+esc(estado(o))+'</span></div>'+
  '<p class="odc">Pedido '+esc(o.pedido_id)+' · '+fdt(o.creado)+'</p><ul class="odl">'+(o.items.length?o.items.map(function(i){return '<li><b>'+esc(i.n)+'</b><span>'+esc(i.col)+' · Talla '+esc(i.sz)+' · x'+i.qty+' · '+money(i.pr*i.qty)+'</span><small>Código: <b>'+esc(o.codigo)+'</b> · Celular: <b>'+esc(o.telefono)+'</b></small></li>'}).join(''):'<li><small>Código: <b>'+esc(o.codigo)+'</b> · Celular: <b>'+esc(o.telefono)+'</b></small></li>')+'</ul>'+
  '<div class="odt"><span>Total <b>'+money(o.total)+'</b></span><span>'+(pg?'Adelanto pagado':'Adelanto a pagar')+' <b>'+money(ad)+'</b></span><span>Saldo <b>'+money(o.total-ad)+'</b></span></div>'+
  '<div class="row"><button class="btn sm" data-ver="'+esc(o.codigo)+'">Ver seguimiento</button>'+(pg?'':'<button class="btn o sm" data-pagar="'+esc(o.codigo)+'">Pagar adelanto</button>')+'<button class="btn o sm" data-copy="'+esc(o.codigo)+'">Copiar código</button></div></article>'}).join('')}
function badge(){var n=orders().length,e=q('#ordc'),d=q('#dtc');if(e){e.textContent=n;e.hidden=!n}if(d){d.textContent=n;d.hidden=!n}}
function tab(t){
 var bs=document.querySelectorAll('.dtabs button');bs.forEach(function(b){b.classList.toggle('on',b.dataset.dt===t)});
 var c=q('#cart');if(!c)return;
 if(t==='o'){c.innerHTML='<h4 class="dh">Mis pedidos</h4>'+lista('todos');q('#drw').classList.add('on')}
 else if(orders().some(function(o){return o.pago})){c.insertAdjacentHTML('beforeend','<h4 class="dh">Pagados con Yape (adelanto 50%)</h4>'+lista('pagados'))}}
function ir(code,hash){
 var d=q('#drw');if(d)d.classList.remove('on');
 if(hash==='#seguimiento'){var o=find(code);wr(KA,{c:code,t:o?String(o.telefono).replace(/\D/g,'').slice(-4):''})}
 if(location.hash===hash)route();else location.hash=hash}
function after(p){
 document.body.setAttribute('data-pg',p);
 if(p==='seguimiento'&&q('#trk-code')){
  var a=orders(),box=q('#trk-code').closest('.mod');
  box.insertAdjacentHTML('beforebegin','<div class="mod" id="trk-recent"><p class="up">Tus pedidos guardados</p>'+(a.length?'<div class="rc">'+a.map(function(o){return '<button type="button" class="chip" data-ver="'+esc(o.codigo)+'">'+esc(o.codigo.slice(-6))+' · '+esc(estado(o))+'</button>'}).join('')+'</div>':'<p class="lab">Aún no tienes pedidos. Puedes probar con uno de ejemplo.</p>')+'<button type="button" class="btn o sm" data-ejemplo="1">Usar datos de ejemplo</button></div>');
  var au=rd(KA,null);if(au&&au.c){q('#trk-code').value=au.c;q('#trk-phone').value=au.t;try{localStorage.removeItem(KA)}catch(e){}q('#trk-search').click()}}}

document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('[data-ver],[data-pagar],[data-copy],[data-ejemplo],[data-reset],[data-dt]');if(!b)return;
 if(b.dataset.ver)ir(b.dataset.ver,'#seguimiento');
 else if(b.dataset.pagar){var o=find(b.dataset.pagar);if(o){try{sessionStorage.setItem('sfc_pago_pendiente',JSON.stringify({codigo_seguimiento:o.codigo,pedido_id:o.pedido_id,cliente:o.cliente,telefono:o.telefono,total:o.total}))}catch(x){}ir(o.codigo,'#pago')}}
 else if(b.dataset.copy){var v=b.dataset.copy;try{navigator.clipboard.writeText(v).then(function(){toastx('Código copiado: '+v)},function(){toastx('Código: '+v)})}catch(x){toastx('Código: '+v)}}
 else if(b.dataset.ejemplo){var o2=ejemplo();ir(o2.codigo,'#seguimiento')}
 else if(b.dataset.reset!=null){if(confirm('¿Borrar los pedidos de prueba y restablecer el stock de demostración?')){try{localStorage.removeItem(K);localStorage.removeItem(KS)}catch(x){}stock(CAT);badge();route();toastx('Demo restablecida')}}
 else if(b.dataset.dt){if(b.dataset.dt==='o')tab('o');else q('#cartb').onclick()}});
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var p=q('#lia5-panel.on');if(p){var c=q('#lia5-close');if(c)c.click()}});
setInterval(function(){var e=q('#ord-list');if(e)e.innerHTML=lista('todos')},20000);

function init(PG){
 PG.pedidos=function(){return '<section class="w pg" style="max-width:850px;padding-top:48px;padding-bottom:64px"><p class="crumb">Inicio / Mis pedidos</p><p class="up">SMART FIT CUSCO · MODO DEMO</p><h1>Mis pedidos</h1><p style="color:var(--mut)">Aquí ves todos tus pedidos, el adelanto pagado con Yape (50%) y su seguimiento. Los datos se guardan en este navegador.</p><div id="ord-list">'+lista('todos')+'</div><p class="lab" style="margin-top:18px">Demo: el estado avanza solo unos minutos después del pago. <button type="button" class="linkb" data-reset="1">Restablecer demo</button></p></section>'};
 if(typeof TT!=='undefined')TT.pedidos='Mis pedidos | Smart Fit Cusco';
 stock(CAT);badge()}
window.DemoPedidos={init:init,after:after,stock:stock,guardar:guardar,pagar:pagar,admin:admin,consulta:consulta,tab:tab,badge:badge};
badge();
})();
