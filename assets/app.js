var $=function(s){return document.querySelector(s)};
var CFG=window.CONFIG||{},IMG=CFG.IMAGENES||{};
/* pic: foto con respaldo SVG. o.eager = carga prioritaria; o.cls = clase extra */
function pic(k,fb,o){o=o||{};return fb+(IMG[k]?'<img class="ph'+(o.cls?' '+o.cls:'')+'" src="'+IMG[k]+'" alt="'+altOf(k)+'" '+(o.eager?'loading="eager" fetchpriority="high"':'loading="lazy"')+' decoding="async" onerror="this.remove()">':'')}
/* segunda foto de la tarjeta (v1_2) para el crossfade al pasar el mouse */
function pic2(c){return IMG[c.id+'_2']?'<img class="ph ph2" src="'+IMG[c.id+'_2']+'" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.remove()">':''}
/* fotos de una prenda: la del color elegido (v1_Terracota) primero, luego v1, v1_2, v1_3... */
function gKeys(c,col){var a=[];if(col&&IMG[c.id+'_'+col])a.push(c.id+'_'+col);if(IMG[c.id])a.push(c.id);for(var i=2;i<10;i++)if(IMG[c.id+'_'+i])a.push(c.id+'_'+i);return a}
/* tallas agotadas (columna "agotadas" del catálogo) */
function parseStock(raw){if(!raw)return{};try{var v=typeof raw==='string'?JSON.parse(raw):raw;if(!v||typeof v!=='object'||Array.isArray(v))return{};var out={};SIZES.forEach(function(z){if(Object.prototype.hasOwnProperty.call(v,z.t)&&Number.isInteger(Number(v[z.t]))&&Number(v[z.t])>=0)out[z.t]=Number(v[z.t])});return out}catch(e){return{}}}
function stockOf(c,t){return c&&c.stock&&Object.prototype.hasOwnProperty.call(c.stock,t)?Number(c.stock[t]):null}
function sizeLabel(c,t){var n=stockOf(c,t);if(n===null)return c&&c.stock&&Object.keys(c.stock).length?' · No ofrecida':' · Stock pendiente';return n===0?' · Agotada':' · '+n+' disp.'}
function agot(c,t){var n=stockOf(c,t);return n===null||!isFinite(n)||n<=0}
function okSz(c,i){if(!agot(c,SIZES[i].t))return i;for(var d=1;d<SIZES.length;d++){if(i+d<SIZES.length&&!agot(c,SIZES[i+d].t))return i+d;if(i-d>=0&&!agot(c,SIZES[i-d].t))return i-d}return i}
/* color elegido en una tarjeta con los puntos de color */
function selCol(b,c){var p=b.closest('.pc');return(p&&p.dataset.sel&&c.c.indexOf(p.dataset.sel)>-1)?p.dataset.sel:c.c[0]}
var OPOS={tienda:'center 32%',nosotros:'center 28%'};
function banner(k,hh){return IMG[k]?'<div class="nimg" style="height:'+hh+'px"><img class="ph" src="'+IMG[k]+'" alt="'+altOf(k)+'" loading="lazy" decoding="async" style="object-position:'+(OPOS[k]||'center 25%')+'" onerror="this.remove()"></div>':''}
var SIZES=['XS','S','M','L','XL','2XL','3XL','4XL','5XL'].map(function(t){return{t:t}});
var COL={Negro:'#1f1c1a',Crema:'#f1e8d8',Azul:'#1f4e8c',Terracota:'#b3392b',Verde:'#2f6b4f',Mostaza:'#d9a11e',Blanco:'#ffffff',Gris:'#8a8f98'};
var TINT=['#EAF3FA','#F2F7FC','#E7F0F8','#F7FAFD'];
var BODY={reloj:'Reloj de arena',pera:'Pera',manzana:'Manzana',rect:'Rectángulo',inv:'Triángulo invertido'};
var KN={vestido:'Vestidos',top:'Polos y tops',camisa:'Camisas',casaca:'Casacas',pantalon:'Pantalones',short:'Shorts',deportivo:'Ropa deportiva',accesorio:'Accesorios',falda:'Faldas'};
var CAT=[
['v1','vestido','Vestido envolvente','Elegante',99,119,'-17%',['reloj','pera','manzana'],['Terracota','Verde','Negro','Azul']],
['v2','vestido','Vestido línea A','Casual',89,119,'-25%',['manzana','inv','rect'],['Azul','Mostaza','Negro','Verde']],
['v3','vestido','Vestido midi fluido','Elegante',99,119,'-17%',['pera','reloj','rect'],['Verde','Terracota','Negro','Crema']],
['b1','top','Blusa fluida','Moderno',59,69,'-14%',['pera','rect','reloj'],['Crema','Terracota','Verde','Azul']],
['b2','top','Polo básico','Casual',39,49,'-20%',['reloj','pera','manzana','rect','inv'],['Negro','Crema','Azul','Mostaza']],
['b3','top','Camisa oversize','Clásico',74,109,'-32%',['manzana','inv','rect'],['Crema','Azul','Negro','Verde']],
['c1','casaca','Casaca larga','Urbano',94,119,'-21%',['manzana','reloj','rect'],['Negro','Azul','Terracota','Verde']],
['c2','casaca','Casaca estructurada','Clásico',89,109,'-18%',['pera','rect'],['Negro','Crema','Mostaza','Azul']],
['c3','casaca','Blazer largo','Elegante',99,119,'-17%',['pera','reloj','manzana'],['Negro','Azul','Crema','Terracota']],
['p1','pantalon','Pantalón tiro alto','Moderno',99,119,'-17%',['reloj','manzana','rect'],['Negro','Azul','Mostaza','Verde']],
['p2','pantalon','Pantalón recto','Clásico',84,99,'-15%',['inv','pera','reloj','rect'],['Negro','Crema','Azul','Terracota']],
['p3','pantalon','Pantalón fluido','Casual',84,104,'-19%',['pera','manzana','rect'],['Crema','Verde','Negro','Mostaza']],
['b4','top','Top cruzado','Moderno',64,74,'-14%',['reloj','pera','manzana'],['Verde','Negro','Terracota','Crema']],
['b5','top','Blusa manga larga','Casual',64,74,'-14%',['pera','rect','inv'],['Mostaza','Crema','Negro','Verde']],
['b6','top','Suéter tejido','Clásico',84,119,'-29%',['reloj','rect','manzana'],['Terracota','Verde','Crema','Negro']],
['c4','casaca','Cárdigan largo','Casual',84,99,'-15%',['manzana','pera','rect'],['Crema','Negro','Azul','Terracota']],
['c5','casaca','Bomber urbana','Urbano',94,114,'-18%',['inv','rect','reloj'],['Verde','Negro','Azul','Mostaza']],
['p4','pantalon','Pantalón cargo','Urbano',89,109,'-18%',['pera','manzana','rect'],['Crema','Verde','Negro','Azul']],
['p5','pantalon','Pantalón sastre','Elegante',99,119,'-17%',['reloj','pera','rect'],['Negro','Azul','Crema','Mostaza']],
['m1','top','Polo clásico','Casual',39,59,'-34%',['rect','inv'],['Negro','Azul','Gris'],'hombre'],
['m2','camisa','Camisa Oxford','Clásico',74,99,'-25%',['rect','inv'],['Blanco','Azul','Crema'],'hombre'],
['m3','pantalon','Pantalón chino','Casual',84,104,'-19%',['rect','inv'],['Crema','Negro','Azul'],'hombre'],
['m4','casaca','Casaca impermeable','Urbano',99,119,'-17%',['rect','inv'],['Negro','Azul','Verde'],'hombre'],
['m5','top','Polo deportivo','Deportivo',49,64,'-23%',['rect','inv'],['Negro','Azul','Gris'],'hombre'],
['m6','pantalon','Jogger deportivo','Deportivo',74,94,'-21%',['rect','inv'],['Negro','Gris'],'hombre'],
['m7','top','Polo premium','Casual',49,59,'-17%',['rect','inv'],['Verde','Negro','Azul'],'hombre'],
['m8','casaca','Casaca softshell','Urbano',94,119,'-21%',['rect','inv'],['Negro','Verde','Azul'],'hombre'],
['m9','top','Suéter tejido','Clásico',74,94,'-21%',['rect','inv'],['Azul','Crema','Negro'],'hombre'],
['m10','short','Short deportivo','Deportivo',49,64,'-23%',['rect','inv'],['Negro','Azul','Gris'],'hombre'],
['m11','deportivo','Polerón con capucha','Deportivo',59,74,'-20%',['rect','inv'],['Gris','Negro','Azul'],'hombre'],
['m12','accesorio','Mochila urbana','Urbano',69,84,'-18%',['rect','inv'],['Negro','Azul','Gris'],'hombre'],
['v4','vestido','Vestido negro clásico','Elegante',94,119,'-21%',['reloj','pera','rect'],['Negro'],'mujer'],
['p6','falda','Falda midi negra','Urbano',79,94,'-16%',['reloj','pera','rect'],['Negro'],'mujer'],
['m13','top','Polo blanco esencial','Casual',39,49,'-20%',['rect','inv'],['Blanco'],'hombre'],
['m14','camisa','Camisa a cuadros','Casual',79,99,'-20%',['rect','inv'],['Azul','Negro'],'hombre'],
['m15','pantalon','Pantalón casual negro','Clásico',79,99,'-20%',['rect','inv'],['Negro'],'hombre'],
['m16','casaca','Casaca beige urbana','Urbano',99,119,'-17%',['rect','inv'],['Crema'],'hombre'],
['m17','accesorio','Gorra urbana negra','Urbano',29,39,'-26%',['rect','inv'],['Negro'],'hombre'],
['m19','top','Polo deportivo ligero','Deportivo',44,59,'-25%',['rect','inv'],['Negro','Azul'],'hombre'],
['nf13','top','Blusa blanca campesina hombros descubiertos','Casual fresco',65,85,'-25%',['reloj','pera','rect'],['Blanco'],'mujer'],
['nf14','top','Top negro sin mangas cuello alto','Minimalista',55,69,'-20%',['reloj','pera','manzana','rect','inv'],['Negro'],'mujer'],
['nf15','top','Top tejido a rayas','Contemporáneo',59,62,'-5%',['reloj','pera','rect'],['Negro','Blanco'],'mujer'],
].map(function(a,i){return{id:a[0],k:a[1],n:a[2],e:a[3],pr:a[4],old:a[5],bd:a[6],b:a[7],c:a[8],gender:a[9]||'mujer',tint:TINT[i%4],stock:{},ag:[],description:a[10]||'',mat:a[11]||'',cu:a[12]||'',nuevo:(['m13','m14','m15','m16','m17','m19','v4','p6'].indexOf(a[0])>-1 || /^n[fh]\d{2}$/.test(a[0]))}});
IMG.nf13='assets/img/nf13.jpg';IMG.nf14='assets/img/nf14.jpg';IMG.nf15='assets/img/nf15.jpg';
try{var sm=JSON.parse(localStorage.getItem('sfc_m')||'null')}catch(e){var sm=null}
var S={n:0,m:{altura:'',pecho:'',cintura:'',cadera:''},err:'',sx:-1,body:'',gender:'mujer',ref:'mujer',it:null,col:'',sz:-1,est:0,r:{},pend:null,out:'',mem:0,started:Date.now()};if(sm){S.m=sm;S.mem=1}
var CART=[],FAV=[];try{CART=JSON.parse(localStorage.getItem('sfc_cart')||'[]')}catch(e){CART=[]}try{FAV=JSON.parse(localStorage.getItem('sfc_fav')||'[]')}catch(e){FAV=[]}
var MAT={vestido:['Crepé elástico','Lavar en frío, no usar secadora'],top:['Algodón con elastano','Lavar a máquina en frío'],camisa:['Algodón','Lavar a máquina en frío'],casaca:['Mezcla de poliéster','Lavado en seco o a mano'],pantalon:['Algodón stretch','Lavar a máquina, planchar a temperatura media'],falda:['Tela fluida','Lavar en frío'],short:['Poliéster de secado rápido','Lavar a máquina en frío'],deportivo:['Algodón y poliéster','Lavar a máquina en frío'],accesorio:['Poliéster','Limpiar con paño húmedo']};
var REV=[['María P.',5,'Me quedó perfecta la talla que me sugirió el asistente.'],['Rosa Q.',4,'Muy cómoda y el color es igual al de la foto.'],['Carmen H.',5,'Por fin encontré ropa que me favorece.']];
var OUTMSG={sobre:'Tus medidas superan nuestra talla 5XL. Te mostramos la 5XL como referencia: escríbenos para ver opciones a medida.',bajo:'Tus medidas están por debajo de nuestra talla XS. Consulta con la tienda para confirmar opciones.'};
var TT={inicio:'Smart Fit Cusco — Moda inclusiva con asistente de tallas',tienda:'Tienda | Smart Fit Cusco',asistente:'Asistente de tallas | Smart Fit Cusco',nosotros:'Nosotros | Smart Fit Cusco',opinion:'Tu opinión | Smart Fit Cusco',contacto:'Contacto | Smart Fit Cusco',seguimiento:'Seguimiento de pedido | Smart Fit Cusco',pago:'Pagar mi pedido (demo) | Smart Fit Cusco'};
function ttl(p){return p=='producto'?(byId(PG.pid)||CAT[0]).n+' | Smart Fit Cusco':TT[p]||TT.inicio}
function altOf(k){var q=k.split('_'),c=byId(q[0]);if(c)return c.n+' — '+(/^\d+$/.test(q[1]||'')?'foto '+q[1]+' · ':'')+'Smart Fit Cusco';if(k.indexOf('cat_')==0)return'Colección de '+(KN[k.slice(4)]||'ropa').toLowerCase()+' — Smart Fit Cusco';var A={hero:'Mujer y hombre sonriendo con ropa de la colección de Smart Fit Cusco',tienda:'Clientes probándose ropa en la tienda de Cusco',nosotros:'Pareja con ropa de otoño de Smart Fit Cusco'};return A[k]||'Smart Fit Cusco'}
function tableForGender(g){var all=CFG.TABLAS_TALLAS||{};return all[g]||{}}
function validSizeTable(g){var t=tableForGender(g);return SIZES.every(function(z){var r=t[z.t];return r&&['pecho','cintura','cadera'].every(function(k){return Number(r[k])>0&&isFinite(Number(r[k]))})})}
function outRange(m){var t=tableForGender(S.gender),last=t['5XL'];if(!last)return'';if(m.pecho>+last.pecho||m.cintura>+last.cintura||m.cadera>+last.cadera)return'sobre';var first=t.XS;if(first&&m.pecho<+first.pecho&&m.cintura<+first.cintura&&m.cadera<+first.cadera)return'bajo';return''}
function bars(t,o){var k=Object.keys(o).sort(function(a,b){return o[b]-o[a]}).slice(0,6),mx=k.length?o[k[0]]:1;return'<div><h4 class="up" style="margin:0 0 10px">'+t+'</h4>'+(k.length?k.map(function(x){return'<div style="margin:6px 0;font-size:13px">'+x+' · '+o[x]+'<div style="background:var(--line);height:6px"><i style="display:block;height:6px;background:var(--acc);width:'+Math.round(o[x]/mx*100)+'%"></i></div></div>'}).join(''):'<p class="lab">Sin datos aún</p>')+'</div>'}
var Q=[['uso','Probar el asistente me pareció…',['Muy difícil','Difícil','Fácil','Muy fácil']],['util','¿Este asistente te ayudaría a encontrar ropa que te quede bien?',['No','Tal vez','Sí','Sí, mucho']],['conf','¿Qué tanta confianza te da la talla recomendada?',['Poca','Media','Alta','Total']],['usar','¿Lo usarías en una tienda de Cusco?',['No','Quizás','Sí']],['pago','¿Pagarías por un servicio así?',['No','Solo si es gratis','Un costo pequeño','Sí']]];
var STEPS=['Tus medidas','Análisis','Elige tu prenda','Probador virtual','Tu asistente'];
function M(){return{altura:+S.m.altura,pecho:+S.m.pecho,cintura:+S.m.cintura,cadera:+S.m.cadera}}
function demoTallas(){return !!(CFG.MODO_DEMO&&!CFG.TABLAS_VALIDADAS)}
function demoNote(){return demoTallas()?'<div class="demo-note" role="note"><span class="demo-pill">Demo</span><p><b>Talla referencial.</b> Calculada con una tabla de medidas de demostración. Antes de una compra real, la tienda confirma tu talla con las medidas verificadas del proveedor.</p></div>':''}
function vendible(c){return !!c&&Number(c.pr)>0&&!!(c.c&&c.c.length)}
function chartFor(c){
 var t=tableForGender((c&&c.gender)||S.gender);
 return SIZES.map(function(z){var r=t[z.t]||{};return{t:z.t,p:Number(r.pecho)||null,c:Number(r.cintura)||null,h:Number(r.cadera)||null}});
}
function sizeIdxFor(m,c){return sizeIdx(m,(c&&c.gender)||S.gender)}
function sizeIdx(m,g){var t=tableForGender(g||S.gender);if(!validSizeTable(g||S.gender))return-1;
 for(var i=0;i<SIZES.length;i++){var z=t[SIZES[i].t];if(m.pecho<=+z.pecho&&m.cintura<=+z.cintura&&m.cadera<=+z.cadera)return i}
 return-1;
}
function bodyType(m){var d=m.pecho-m.cadera;if(m.cintura>=Math.max(m.pecho,m.cadera)*.97)return'manzana';if(Math.abs(d)<=5)return m.cintura<=Math.min(m.pecho,m.cadera)*.82?'reloj':'rect';return d>0?'inv':'pera'}
function fit(v,lim){var d=lim-v;return d<-1?['Ajustada','no']:d<=8?['Perfecta','ok']:['Holgada','ok']}
function near(m,i){var t=tableForGender(S.gender),g=t[SIZES[i]&&SIZES[i].t];return i>=0&&i<SIZES.length-1&&g&&(Number(g.pecho)-m.pecho<=3||Number(g.cintura)-m.cintura<=3||Number(g.cadera)-m.cadera<=3)}
function toast(t){var e=$('#toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(function(){e.style.display='none'},2200)}
function fig(k,col,m,si,scan,gender){
 gender=gender||S.gender||'mujer';
 var g=SIZES[Math.max(si,0)],row=tableForGender(gender)[g.t]||{},f=COL[col]||'#999',sk='#d6bfa8',bp=m.pecho*.5,bc=m.cintura*.5,bh=m.cadera*.5,gp=((Number(row.pecho)||m.pecho)+6)*.5,gc=((Number(row.cintura)||m.cintura)+6)*.5,gh=((Number(row.cadera)||m.cadera)+6)*.5;
 var shoulder=gender==='hombre'?Math.max(bp/2+10,25):bp/2,waist=gender==='hombre'?Math.max(bc/2,18):bc/2,hip=gender==='hombre'?Math.max(bh/2-5,22):bh/2;
 var s=`<svg viewBox="0 0 200 340" role="img" aria-label="Silueta ${gender==='hombre'?'masculina':'femenina'}"><defs><linearGradient id="skinTone" x1="0" x2="1"><stop offset="0" stop-color="#b9957d"/><stop offset=".5" stop-color="${sk}"/><stop offset="1" stop-color="#b9957d"/></linearGradient></defs><circle cx="100" cy="36" r="17" fill="url(#skinTone)"/><path d="M${100-shoulder} 72 Q100 62 ${100+shoulder} 72 L${100+waist} 150 Q100 ${gender==='hombre'?'165':'158'} ${100+hip} 196 L${100-hip} 196 Q100 ${gender==='hombre'?'165':'158'} ${100-waist} 150Z" fill="url(#skinTone)"/><path d="M${100-hip+3} 192 L${100-hip/2} 330 L96 330 L100 214 L104 330 L${100+hip/2} 330 L${100+hip-3} 192Z" fill="url(#skinTone)" stroke="#a88772" stroke-width=".6"/>`,p;
 if(k=='top')p=[[88,68],[112,68],[100+gp/2+2,78],[100+gp/2+24,128],[100+gp/2+10,134],[100+gp/2,108],[100+gh/2,176],[100-gh/2,176],[100-gp/2,108],[100-gp/2-10,134],[100-gp/2-24,128],[100-gp/2-2,78]];
 else if(k=='casaca')p=[[88,68],[112,68],[100+gp/2+3,80],[100+gp/2+20,180],[100+gp/2+7,184],[100+gp/2,120],[100+gh/2+2,230],[100-gh/2-2,230],[100-gp/2,120],[100-gp/2-7,184],[100-gp/2-20,180],[100-gp/2-3,80]];
 else if(k=='pantalon')p=[[100-gc/2,148],[100+gc/2,148],[100+gh/2,198],[100+gh/2*.75,330],[106,330],[100,214],[94,330],[100-gh/2*.75,330],[100-gh/2,198]];
 else p=[[90,70],[110,70],[100+gp/2,104],[100+gc/2,150],[100+gh/2+16,285],[100-gh/2-16,285],[100-gc/2,150],[100-gp/2,104]];
 s+='<polygon points="'+p.map(function(a){return a.join(',')}).join(' ')+'" fill="'+f+'" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>';
 if(k=='casaca')s+='<line x1="100" y1="68" x2="100" y2="230" stroke="rgba(255,255,255,.3)" stroke-width="2"/>';
 if(scan)s+='<g stroke="#1F5F99" stroke-dasharray="3 3"><line x1="'+(100-bp/2-10)+'" y1="100" x2="'+(100+bp/2+10)+'" y2="100"/><line x1="'+(100-bc/2-10)+'" y1="150" x2="'+(100+bc/2+10)+'" y2="150"/><line x1="'+(100-bh/2-10)+'" y1="196" x2="'+(100+bh/2+10)+'" y2="196"/></g><g font-size="9" fill="#1F5F99"><text x="4" y="98">Pecho</text><text x="4" y="148">Cintura</text><text x="4" y="194">Cadera</text></g>';
 return s+'</svg>'}
function mini(k,col){return fig(k,col,{pecho:112,cintura:96,cadera:118},2,false)}
function byId(id){return CAT.filter(function(c){return c.id==id})[0]}

/* bocetos de referencia (mujer / hombre) para la guía de medidas */
function refbox(){if(!IMG.ref_mujer&&!IMG.ref_hombre)return null;var k=(S.gender==='hombre'&&IMG.ref_hombre)||!IMG.ref_mujer?'ref_hombre':'ref_mujer';return'<div class="refb holo-ref"><div class="holo-person"><img id="refimg" src="'+IMG[k]+'" alt="Prototipo corporal original '+(S.gender==='hombre'?'masculino':'femenino')+' para guiar las medidas" loading="eager" decoding="async"><svg class="holo-overlay" viewBox="0 0 100 100" aria-hidden="true"><g class="holo-lines"><path d="M17 31 H83 M22 45 H78 M20 59 H80 M30 77 H70"/><circle cx="50" cy="31" r="2"/><circle cx="50" cy="45" r="2"/><circle cx="50" cy="59" r="2"/><circle cx="50" cy="77" r="2"/></g></svg><i class="holo-sweep"></i></div><p class="lab" style="margin:8px 0 0">Prototipo original · '+(S.gender==='hombre'?'Hombre':'Mujer')+'</p><p class="holo-caption">Puntos luminosos: pecho, cintura, cadera y largo de pierna</p></div>'}
function holoAnalysis(m){var k=S.gender==='hombre'?'scan_hombre':'scan_mujer',labels=S.gender==='hombre'?['Pecho','Cintura','Cadera']:['Busto / pecho','Cintura','Cadera'];return'<div class="holo-ref holo-analysis"><div class="holo-person"><img src="'+(IMG[k]||'')+'" alt="Prototipo '+(S.gender==='hombre'?'masculino':'femenino')+' en posición de escaneo con brazos extendidos" loading="eager" decoding="async"><div class="holo-grid" aria-hidden="true"></div><svg class="holo-overlay" viewBox="0 0 100 100" aria-hidden="true"><g class="holo-lines"><path d="M8 29 H92 M17 43 H83 M21 56 H79 M28 70 H72 M35 82 H65"/><path d="M8 29 Q50 24 92 29 M17 43 Q50 39 83 43 M21 56 Q50 52 79 56"/><circle cx="50" cy="29" r="2"/><circle cx="50" cy="43" r="2"/><circle cx="50" cy="56" r="2"/><circle cx="50" cy="70" r="1.5"/></g></svg><i class="holo-sweep"></i><span class="holo-tag tag-chest">'+labels[0]+' · '+m.pecho+' cm</span><span class="holo-tag tag-waist">'+labels[1]+' · '+m.cintura+' cm</span><span class="holo-tag tag-hip">'+labels[2]+' · '+m.cadera+' cm</span><span class="holo-scan-status"><i></i> ESCANEO VISUAL</span></div><div class="holo-legend"><span><i></i> Pecho / busto</span><span><i></i> Cintura</span><span><i></i> Cadera</span><span><i></i> Pierna: medir aparte</span></div><p class="holo-note">La figura guía la posición de la cinta. Las medidas se ingresan manualmente; el efecto visual no escanea ni calcula medidas por sí solo.</p></div>'}

/* ---------- Cinta de beneficios (marquee) y Looks de temporada ---------- */
/* Banner de ofertas llamativo (datos reales del catálogo: usa precio anterior vs precio actual) */
function ofertaFlash(){
 var top=CAT.filter(function(c){return c.old&&c.pr&&c.old>c.pr}).sort(function(a,b){return (b.old-b.pr)/b.old-(a.old-a.pr)/a.old}).slice(0,4);
 if(!top.length)return'';
 var maxPct=Math.max.apply(null,top.map(function(c){return Math.round((c.old-c.pr)/c.old*100)}));
 return '<section class="of-wrap" aria-label="Ofertas por tiempo limitado"><div class="w"><div class="of-head"><span class="of-badge">🔥 OFERTA FLASH</span><h2>Hasta -'+maxPct+'% hoy en Smart Fit Cusco</h2><p>Precios especiales por tiempo limitado · termina en <b id="of-count">--:--:--</b></p></div><div class="of-items">'+top.map(function(c){return '<a class="of-item" href="#producto/'+c.id+'" aria-label="'+c.n+', antes S/ '+c.old+'.00, ahora S/ '+c.pr+'.00"><span class="of-pct">-'+Math.round((c.old-c.pr)/c.old*100)+'%</span><span class="of-pic">'+(IMG[c.id]?pic(c.id,''):mini(c.k,(c.c&&c.c[0])||'Negro'))+'</span><b class="of-name">'+c.n+'</b><span class="of-prices"><strong class="of-now">S/ '+c.pr+'.00</strong><s class="of-was">S/ '+c.old+'.00</s></span><span class="of-save">Ahorras S/ '+(c.old-c.pr)+'.00</span></a>'}).join('')+'</div><a class="btn of-cta" href="#tienda">Ver todas las ofertas →</a></div></section>'
}
var OF_TIMER=null;
function startOfertaCountdown(){
 var el=document.getElementById('of-count');if(!el){if(OF_TIMER){clearInterval(OF_TIMER);OF_TIMER=null}return}
 if(OF_TIMER)clearInterval(OF_TIMER);
 function tick(){
  var now=new Date(),end=new Date(now);end.setHours(23,59,59,999);var diff=end-now;if(diff<0)diff=0;
  var hh=Math.floor(diff/3600000),mm=Math.floor(diff%3600000/60000),ss=Math.floor(diff%60000/1000);
  var pad=function(n){return(n<10?'0':'')+n};
  var node=document.getElementById('of-count');if(!node){clearInterval(OF_TIMER);OF_TIMER=null;return}
  node.textContent=pad(hh)+':'+pad(mm)+':'+pad(ss)
 }
 tick();OF_TIMER=setInterval(tick,1000)
}
function FX_MARQ(){var t=['Precios rebajados en toda la colección','5% adicional en tu segunda prenda','10% adicional desde la tercera prenda','Envíos gratis desde S/ 129.90','Cambio de talla sin costo','Moda inclusiva de XS a 5XL'],h=t.map(function(x){return'<span>'+x+'</span>'}).join('');return'<div class="fx-marq" role="region" aria-label="Beneficios de Smart Fit Cusco"><div class="fx-mt"><div>'+h+'</div><div aria-hidden="true">'+h+'</div></div></div>'}
function lookbook(){var L=(CFG.LOOKBOOK||[]).filter(function(x){return IMG[x.k]});if(!L.length)return'';var ks=L.map(function(y){return y.k}).join('|');return'<section class="sec"><div class="w"><div class="hd"><h2>Looks de temporada</h2><a href="#tienda" class="up">Ver tienda</a></div><div class="lk" role="list">'+L.map(function(x,i){return'<button type="button" class="lkb" role="listitem" data-lbk="'+ks+'" data-lbi="'+i+'" aria-label="Ampliar foto: '+x.t+'"><span class="lki"><img class="ph" src="'+IMG[x.k]+'" alt="'+x.alt+'" loading="lazy" decoding="async" onerror="this.remove()"></span><em>'+x.t+'</em></button>'}).join('')+'</div></div></section>'}

/* ---------- Páginas ---------- */
function priceLabel(c){return Number(c.pr)>0?'S/ '+Number(c.pr).toFixed(2):'Precio por confirmar'}
function card(c){var r=S.body&&c.b.indexOf(S.body)>-1;return'<div class="pc" data-id="'+c.id+'"><div class="im" style="background:'+c.tint+'" data-ficha="'+c.id+'" tabindex="0" role="link" aria-label="Ver '+c.n+'">'+(c.bd?'<span class="bd">'+c.bd+'</span>':'')+(c.nuevo?'<span class="bd bnew">Nuevo</span>':'')+(r?'<span class="bd b2">Para tu silueta</span>':'')+'<button class="hrt'+(FAV.indexOf(c.id)>-1?' on':'')+'" data-fav="'+c.id+'" aria-label="Guardar en favoritos">♥</button>'+pic(c.id,mini(c.k,c.c[0]))+pic2(c)+'<span class="fx-tn"></span><div class="qa"><button class="btn sm" data-add="'+c.id+'" aria-label="Añadir '+c.n+' a la bolsa">Añadir</button><button class="btn o sm" style="background:var(--bg)" data-pr="'+c.id+'" aria-label="Probar '+c.n+'">Probar</button></div></div><h3>'+c.n+'</h3><p class="price"><strong>'+priceLabel(c)+'</strong>'+(c.old?'<s>S/ '+c.old+'.00</s><small class="sale-note">Ahorras S/ '+(c.old-c.pr)+'.00</small>':'')+'</p><div class="dots">'+c.c.map(function(x){return'<button type="button" class="dot" data-dc="'+x+'" aria-label="Color '+x+'" style="background:'+(COL[x]||'#999')+'"></button>'}).join('')+(c.c.length?'':'<span class="cn">Colores por confirmar</span>')+'</div></div>'}
var PG={
pago:function(){
 var pend=null;try{pend=JSON.parse(sessionStorage.getItem('sfc_pago_pendiente')||'null')}catch(e){pend=null}
 var qr=(CFG.PAGO_QR||{}),qrImg=qr.IMAGEN||'',titular=qr.TITULAR||'',appName=qr.APP||'Yape',nota=qr.NOTA||'';
 if(!pend){return '<section class="w pg" style="max-width:650px;padding-top:48px;padding-bottom:64px"><p class="crumb">Inicio / Pagar pedido</p><p class="up">SMART FIT CUSCO</p><h1>No hay ningún pago pendiente</h1><p style="color:var(--mut)">Genera un pedido desde tu bolsa o consulta uno existente en Seguimiento para ver aquí el código QR de pago (simulado).</p><div class="row" style="margin-top:18px"><a class="btn" href="#tienda">Ir a la tienda</a><a class="btn o" href="#seguimiento">Ir a Seguimiento</a></div></section>'}
 var total=Math.round(Number(pend.total||0)*100)/100,advance=Math.round(total*50)/100,balance=Math.round((total-advance)*100)/100;
 return '<section class="w pg" style="max-width:650px;padding-top:48px;padding-bottom:64px"><p class="crumb">Inicio / Pagar pedido</p><p class="up">SMART FIT CUSCO · MODO DEMO</p><h1>Paga el adelanto de tu pedido</h1>'+
 '<div class="mod" style="margin:20px 0"><p class="up">Pedido</p><p><b>Código de seguimiento:</b> '+pend.codigo_seguimiento+'</p>'+(pend.cliente?'<p><b>Cliente:</b> '+pend.cliente+'</p>':'')+'<p><b>Total del pedido:</b> S/ '+total.toFixed(2)+'</p><p><b>Adelanto a pagar (50%):</b> S/ '+advance.toFixed(2)+'</p><p><b>Saldo pendiente:</b> S/ '+balance.toFixed(2)+'</p></div>'+
 '<div class="mod pago-qr-box" style="margin:0 0 20px;text-align:center">'+
   '<p class="up">Escanea para pagar con '+appName+' (simulación)</p>'+
   (qrImg?'<img src="'+qrImg+'" alt="Código QR de '+appName+' para pagar a '+titular+'" class="pago-qr-img">':'<p class="err">Falta configurar la imagen del QR en assets/config.js (PAGO_QR.IMAGEN).</p>')+
   (titular?'<p class="pago-qr-titular">'+titular+'</p>':'')+
   '<p class="lab" style="margin-top:12px">'+nota+'</p>'+
 '</div>'+
 '<div class="mod" id="pago-accion" style="margin-bottom:18px"><p class="up">Paso final</p><p style="color:var(--mut)">Cuando "pagues" con el QR de arriba, pulsa el botón para simular el registro del adelanto en el sistema. Esto no transfiere dinero real.</p><button class="btn" id="pago-confirmar" style="width:100%;margin-top:6px">Ya pagué: simular confirmación</button><p id="pago-msg" aria-live="polite" style="margin-top:10px"></p></div>'+
 '<div class="row"><a class="btn o" href="#seguimiento">Ver seguimiento del pedido</a><a class="btn o" href="#tienda">Seguir comprando</a></div>'+
 '</section>'
},
seguimiento:function(){return '<section class="w pg" style="max-width:850px;padding-top:48px;padding-bottom:64px"><p class="crumb">Inicio / Seguimiento</p><p class="up">SMART FIT CUSCO</p><h1>Seguimiento de mi pedido</h1><p style="color:var(--mut)">Consulta el estado de tu compra con tu código y los últimos cuatro dígitos del teléfono registrado.</p><div class="mod" style="margin:22px 0"><label>Código de seguimiento<input id="trk-code" placeholder="SFC-2026-XXXXXXXXXX" autocomplete="off"></label><label>Últimos cuatro dígitos de tu teléfono<input id="trk-phone" inputmode="numeric" maxlength="4" placeholder="1234" autocomplete="off"></label><button class="btn" id="trk-search">Consultar pedido</button><p id="trk-msg" class="err" aria-live="polite"></p></div><div id="trk-result" aria-live="polite"></div><details style="margin-top:28px"><summary class="up" style="cursor:pointer">Acceso administrativo</summary><div class="mod" style="margin-top:12px"><p class="lab">Solo personal autorizado. La clave se valida en Apps Script y no se guarda en esta página.</p><label>Código del pedido<input id="adm-code" placeholder="SFC-2026-XXXXXXXXXX"></label><label>Clave administrativa<input id="adm-token" type="password" autocomplete="off"></label><label>Nuevo estado<select id="adm-state">'+['Pedido recibido','Pendiente de confirmar','Pago pendiente','Pedido confirmado','En preparación','Listo para entregar','Entregado','Cancelado'].map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></label><label>Fecha estimada de entrega (opcional)<input id="adm-eta" type="date"></label><label>Observación para el historial<textarea id="adm-note" rows="2" maxlength="500"></textarea></label><label style="display:flex;gap:8px;align-items:center;text-transform:none"><input id="adm-correction" type="checkbox" style="width:auto"> Corrección autorizada de un estado final</label><button class="btn" id="adm-save">Guardar actualización</button><p id="adm-msg" class="err" aria-live="polite"></p></div></details></section>'},
inicio:function(){return'<section class="hero"><div class="w"><div><p class="up">Moda inclusiva · Tallas XS a 5XL</p><h1>Estilo real. Tallas reales. Sin límites.</h1><p style="font-size:17px;max-width:460px">Ropa para cuerpos reales y medidas grandes: polos, camisas, pantalones, vestidos y ropa deportiva cómoda, con cortes pensados para que te sientas bien y encuentres tu talla.</p><div class="row"><a class="btn" href="#tienda">Ver colección</a><a class="btn o" href="#asistente">Encuentra tu talla</a></div></div><div class="art" style="position:relative"><div>'+mini('vestido','Terracota')+'</div><div>'+mini('casaca','Azul')+'</div><div>'+mini('pantalon','Verde')+'</div>'+(IMG.hero?'<div class="hz"><img class="ph hero-img" src="'+IMG.hero+'" alt="'+altOf('hero')+'" loading="eager" fetchpriority="high" decoding="async" onerror="this.parentNode.remove()"></div>':'')+'</div></div></section>'+FX_MARQ()+ofertaFlash()+
'<section class="sec"><div class="w"><div class="hd"><h2>Compra por categoría</h2><a href="#tienda" class="up">Ver todo</a></div><div class="tiles">'+Object.keys(KN).map(function(k,i){return'<a class="tile" href="#tienda/'+k+'"><div class="im" style="background:'+TINT[i%TINT.length]+'">'+pic('cat_'+k,mini(k,((CAT.filter(function(c){return c.k==k})[0]||CAT[0]).c[1]||'Negro')))+'<span class="fx-tov"><b>'+KN[k]+'</b><em>Ver colección →</em></span></div></a>'}).join('')+'</div></div></section>'+
'<section class="ban"><div class="w"><div><p class="up">Asistente de tallas</p><h2>Deja de adivinar tu talla.</h2><p>Ingresa tus medidas, mira cómo te queda cada prenda y recíbela verificada en el probador. Gratis y sin registro.</p><a class="btn" href="#asistente">Probar el asistente</a></div><div class="steps"><div><b>01</b>Mide</div><div><b>02</b>Analiza</div><div><b>03</b>Prueba</div></div></div></section>'+
'<section class="sec"><div class="w"><div class="hd"><div><p class="eyebrow">Recién llegados</p><h2>Nuevos favoritos, en tallas grandes</h2><p class="lab" style="margin:6px 0 0">Novedades para sumar a tu estilo, con precios y descuentos visibles.</p></div><a href="#tienda" class="up">Ver todo</a></div><div class="grid">'+CAT.filter(function(c){return c.nuevo}).map(card).join('')+'</div></div></section>'+
lookbook()+'<section class="sec" id="validacion-premium"><div class="w"><div class="offer-strip" style="padding:26px;background:var(--soft);border:1px solid var(--line);border-left:4px solid var(--acc);border-radius:14px"><p class="eyebrow">Beneficio exclusivo · Test Card 2</p><h2 style="margin:6px 0">Congela tu precio premium y recibe envío gratis</h2><p>Estamos validando una prenda premium de calidad superior, con telas abrigadoras, costuras reforzadas flatlock y entalle anatómico.</p><div class="ben" style="margin:16px 0"><div><b>Precio regular</b><p><s>S/ 120.00</s></p></div><div><b>10% de descuento</b><p>Ahorras S/ 12.00</p></div><div><b>Tu precio reservado</b><p><strong>S/ 108.00</strong></p></div><div><b>Envío gratis</b><p>Incluido en esta pre-reserva</p></div></div><ul class="lab" style="margin:0 0 14px;padding-left:18px"><li>Congela el precio promocional de S/ 108.00.</li><li>Recibe 10% de descuento y envío gratis.</li><li>No realizas ningún pago en esta página.</li><li>El equipo coordinará contigo por WhatsApp.</li></ul><p class="lab">La pre-reserva expresa interés; no es una compra ni un pago confirmado. La disponibilidad final se confirmará por WhatsApp.</p><button type="button" class="btn" id="premium-open">Congelar mi precio · S/ 108.00</button><div id="premium-box" hidden style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line)"><h3>Completa tu pre-reserva</h3><p class="lab">Déjanos tus datos y tu talla para conservar el beneficio. Usaremos esta información únicamente para gestionar esta pre-reserva y contactarte por WhatsApp.</p><form id="premium-form" style="display:grid;gap:10px;max-width:560px"><label>Nombre completo<input name="nombre" required minlength="2" autocomplete="name" placeholder="Tu nombre y apellido"></label><label>WhatsApp<input name="telefono" required type="tel" inputmode="tel" minlength="7" autocomplete="tel" placeholder="Tu número de contacto"></label><label>Talla de interés<select name="talla" required><option value="">Selecciona tu talla</option><option>L</option><option>XL</option><option>2XL</option><option>3XL</option><option>4XL</option><option>5XL</option></select></label><button class="btn" type="submit">Enviar pre-reserva y coordinar por WhatsApp</button></form><p id="premium-result" class="lab" aria-live="polite"></p></div></div></div></section><section class="sec alt"><div class="w"><div class="ben"><div><b>10% de descuento</b><p>Beneficio de esta pre-reserva</p></div><div><b>Envío gratis</b><p>Incluido en el precio reservado</p></div><div><b>Sin pago en línea</b><p>Coordinación por WhatsApp</p></div><div><b>Precio congelado</b><p>S/ 108.00 para esta prueba</p></div></div></div></section>'},
tienda:function(){var f=PG.f||'todo',so=PG.so||'rel',q=(PG.q||'').toLowerCase(),cl=PG.cl||'',es=PG.st||'',gn=PG.gender||'todos',
 l=CAT.filter(function(c){return(gn=='todos'||c.gender==gn)&&(f=='todo'||(f=='fav'?FAV.indexOf(c.id)>-1:c.k==f))&&(!q||(c.n+' '+KN[c.k]+' '+c.e).toLowerCase().indexOf(q)>-1)&&(!cl||c.c.indexOf(cl)>-1)&&(!es||c.e==es)});
 if(so=='asc')l.sort(function(a,b){return a.pr-b.pr});if(so=='desc')l.sort(function(a,b){return b.pr-a.pr});if(so=='sil'&&S.body)l.sort(function(a,b){return(b.b.indexOf(S.body)>-1)-(a.b.indexOf(S.body)>-1)});
 var ests=[];CAT.forEach(function(c){if(ests.indexOf(c.e)<0)ests.push(c.e)});
 return'<div class="w pg"><p class="crumb">Inicio / Tienda</p><h1>'+(f=='todo'?'Toda la colección':f=='fav'?'Mis favoritos':KN[f])+'</h1>'+banner('tienda',200)+'<div class="offer-strip" style="padding:16px 18px;margin:18px 0;background:var(--soft);border-left:3px solid var(--acc)"><b>Ofertas de temporada para renovar tu clóset</b><p style="margin:6px 0 0">Encuentra prendas seleccionadas con precio rebajado. Además, recibe 5% extra en tu segunda prenda y 10% extra desde la tercera. Descuentos aplicados en el carrito.</p></div><div class="gender-pick" style="margin:14px 0"><span class="lab" style="margin:0 8px 0 0">Ver prendas de:</span><button class="chip '+(gn=='todos'?'on':'')+'" data-gender-shop="todos">Todos</button><button class="chip '+(gn=='hombre'?'on':'')+'" data-gender-shop="hombre">♂ Hombre</button><button class="chip '+(gn=='mujer'?'on':'')+'" data-gender-shop="mujer">♀ Mujer</button></div><div class="fl"><div><button class="chip'+(f=='todo'?' on':'')+'" data-f="todo">Todo</button>'+Object.keys(KN).map(function(k){return'<button class="chip'+(f==k?' on':'')+'" data-f="'+k+'">'+KN[k]+'</button>'}).join('')+'<button class="chip'+(f=='fav'?' on':'')+'" data-f="fav">♥ Favoritos ('+FAV.length+')</button></div><label style="display:flex;gap:8px;align-items:center">Ordenar<select id="so"><option value="rel">Más relevantes</option><option value="asc">Precio: menor a mayor</option><option value="desc">Precio: mayor a menor</option>'+(S.body?'<option value="sil">Para mi silueta</option>':'')+'</select></label></div>'+
 '<div class="fb2"><input id="sq" type="search" placeholder="Buscar prendas…" aria-label="Buscar prendas" value="'+(PG.q||'').replace(/"/g,'&quot;')+'"><select id="sc2" aria-label="Color"><option value="">Todos los colores</option>'+Object.keys(COL).map(function(k){return'<option>'+k+'</option>'}).join('')+'</select><select id="se" aria-label="Estilo"><option value="">Todos los estilos</option>'+ests.map(function(k){return'<option>'+k+'</option>'}).join('')+'</select></div>'+
 (S.body?'':'<p class="lab">Usa el <a href="#asistente">asistente de tallas</a> para ver qué prendas favorecen tu silueta.</p>')+(l.length?'<div class="grid">'+l.map(card).join('')+'</div>':'<p>No encontramos prendas con esos filtros. <button class="chip" id="qf">Quitar filtros</button></p>')+'</div>'},
producto:function(){var c=byId(PG.pid)||CAT[0];PG.pid=c.id;if(!PG.pc||c.c.indexOf(PG.pc)<0)PG.pc=c.c[0]||'';if(PG.pidx!=c.id){PG.pidx=c.id;PG.ps=okSz(c,S.sx>=0?S.sx:1);PG.gi=0}
 var mt=c.mat||(MAT[c.k]||MAT.top)[0],cu=c.cu||(MAT[c.k]||MAT.top)[1],rec=S.body&&c.b.indexOf(S.body)>-1,ref=S.body||c.b[0],
 cb=CAT.filter(function(x){return x.k!=c.k}).sort(function(a,b){return(b.b.indexOf(ref)>-1)-(a.b.indexOf(ref)>-1)}).slice(0,4);
 var gk=gKeys(c,PG.pc),gi=Math.min(PG.gi||0,Math.max(gk.length-1,0));return'<div class="w pg product-page"><p class="crumb"><a href="#inicio">Inicio</a> / <a href="#tienda">Tienda</a> / '+c.n+'</p><div class="fic"><div class="gal"><div class="fim" style="background:'+c.tint+'"'+(gk.length?' data-lb="'+gk.join('|')+'" data-lbi="'+gi+'" data-lbp="'+c.id+'" tabindex="0" role="button" aria-label="Ampliar foto de '+c.n+'"':'')+'>'+(c.bd?'<span class="bd">'+c.bd+'</span>':'')+'<button class="hrt'+(FAV.indexOf(c.id)>-1?' on':'')+'" data-fav="'+c.id+'" aria-label="Guardar en favoritos">♥</button>'+(gk.length?pic(gk[gi],mini(c.k,PG.pc),{cls:'main'}):mini(c.k,PG.pc))+'</div>'+(gk.length>1?'<div class="thumbs">'+gk.map(function(k,i){return'<button type="button" class="th'+(i==gi?' on':'')+'" data-gi="'+i+'" aria-label="Ver foto '+(i+1)+' de '+c.n+'"><img src="'+IMG[k]+'" alt="" loading="lazy" decoding="async"></button>'}).join('')+'</div>':'')+'</div><div><p class="lab">'+KN[c.k]+' · '+c.e+'</p><h1>'+c.n+'</h1><p style="font-size:20px">'+priceLabel(c)+(c.old?'<s style="color:var(--mut);margin-left:8px">S/ '+c.old+'.00</s>':'')+'</p>'+(rec?'<p><span class="tag">Favorece tu silueta '+BODY[S.body].toLowerCase()+'</span></p>':'')+(c.c.length?'<label>Color: '+PG.pc+'</label><div>'+c.c.map(function(x){return'<span class="sw'+(x==PG.pc?' on':'')+'" data-pc="'+x+'" title="'+x+'" style="background:'+(COL[x]||'#999')+'"></span>'}).join('')+'</div>':'<p class="lab">Colores: pendientes de confirmar</p>')+(c.description?'<p>'+c.description+'</p>':'')+'<label style="margin-top:10px">Talla'+(S.sx>=0?' (recomendada: '+SIZES[S.sx].t+')':'')+'</label><div>'+SIZES.map(function(z,i){return'<span class="sz'+(i==PG.ps?' on':'')+(i==S.sx?' rec':'')+(agot(c,z.t)?' ag':'')+'" data-ps="'+i+'"'+(agot(c,z.t)?' aria-disabled="true" title="Sin stock configurado o agotada"':'')+'>'+z.t+sizeLabel(c,z.t)+'</span>'}).join('')+'</div>'+(S.sx<0?'<p class="lab"><a href="#asistente">Calcula tu talla exacta con el asistente</a></p>':'')+'<div class="row"><button class="btn" id="fa">Añadir a la bolsa</button><button class="btn o" id="fp">Probar con mi talla</button></div><p class="lab" style="margin-top:16px">Cambio de talla sin costo · Recojo en tienda en Cusco</p><h3 style="margin-top:22px">Detalles</h3><table><tr><td>Tela</td><td>'+mt+'</td></tr><tr><td>Cuidados</td><td>'+cu+'</td></tr></table><h3 style="margin-top:22px">Tabla corporal de referencia (cm)</h3>'+(demoTallas()?demoNote():'<p class="lab">Medidas corporales en centímetros: límite superior de cada talla.</p>')+'<table><tr><th>Talla</th><th>Pecho</th><th>Cintura</th><th>Cadera</th></tr>'+chartFor(c).map(function(z,i){return'<tr'+(i==S.sx?' class="hl"':'')+'><td>'+z.t+'</td><td>hasta '+z.p+'</td><td>hasta '+z.c+'</td><td>hasta '+z.h+'</td></tr>'}).join('')+'</table></div></div><div class="gde" style="margin-top:50px"><div><h3>Reseñas de clientas <span class="st5">★★★★★</span></h3><p class="lab">Reseñas de ejemplo del prototipo</p>'+REV.map(function(r){return'<div class="rv"><b>'+r[0]+'</b> <span class="st5">'+'★'.repeat(r[1])+'</span><br>'+r[2]+'</div>'}).join('')+'</div><div><h3>Combina con</h3><div class="grid" style="grid-template-columns:repeat(2,1fr)">'+cb.slice(0,2).map(card).join('')+'</div></div></div></div>'},
asistente:function(){return'<div class="w pg"><p class="crumb">Inicio / Asistente de tallas</p><h1>Asistente de tallas</h1><p style="color:var(--mut);max-width:620px">Calcula tu talla exacta, elige tu prenda y pruébala virtualmente. Un asistente de la tienda la verifica y la deja lista en tu probador.</p><div class="asis"><div class="pbar"><i id="bar"></i></div><p class="lab" id="lab"></p><div id="stage"></div></div></div>'},
nosotros:function(){return'<div class="w pg"><p class="crumb">Inicio / Nosotros</p><h1>Moda inclusiva, hecha para encajar.</h1>'+banner('nosotros',320)+'<p style="max-width:720px;font-size:17px">Smart Fit Cusco es el ecosistema digital de moda inclusiva para personas de talla grande en la ciudad de Cusco. Resolvemos la dificultad de encontrar prendas que realmente calcen con tres componentes: una calculadora que estima tu talla a partir de medidas en centímetros, un probador virtual que muestra cómo luce la prenda antes de comprarla y un sistema de etiquetado por tipo de cuerpo que filtra el catálogo según tu silueta real, todo con asesoría de entalle personalizada.</p>'+
'<div class="col3" style="margin:34px 0"><div><h3>El problema</h3><p>La principal frustración no es solo la falta de diseño, sino la pérdida de tiempo probándose prendas que no le quedan.</p></div><div><h3>Nuestra hipótesis</h3><p>Al ofrecer verificación de medidas y entrega del talle correcto en el punto de venta, eliminamos el abandono de compra y reducimos la fricción.</p></div><div><h3>Nuestro asistente</h3><p>Un asistente inteligente que te ahorra tiempo y te orienta para elegir una talla adecuada de forma autónoma y sin presión.</p></div></div>'+
'<h2>Nuestro encaje</h2><table><tr><th>Necesidad del cliente</th><th>Asistente de tallas</th><th>Resultado</th></tr><tr><td><b>Trabajo:</b> vestirse con estilo y comodidad</td><td>Permite elegir prendas según medidas y estilo personal.</td><td>Encuentra ropa que le gusta y le queda bien.</td></tr><tr><td><b>Dolor:</b> pocas tallas y prendas que no se adaptan al cuerpo</td><td>Identifica la talla más adecuada según sus medidas.</td><td>Se acaba la búsqueda de tallas que no calzan.</td></tr><tr><td><b>Ganancia:</b> encontrar ropa fácilmente y sentirse cómoda</td><td>Recomienda prendas personalizadas y las entrega para probarlas.</td><td>Facilita y mejora la experiencia de compra.</td></tr></table><div class="row"><a class="btn" href="#asistente">Probar el asistente</a></div></div>'},
contacto:function(){return'<div class="w pg"><p class="crumb">Inicio / Contacto</p><h1>Contacto y recojo en tienda</h1><div class="two"><div><p>Estamos para ayudarte con tallas, cambios y pedidos.</p><p><b>Recojo en tienda:</b> Cusco, Perú · coordina el punto de recojo por WhatsApp<br><b>Horario:</b> lunes a sábado, 10:00 a 20:00<br><b>WhatsApp:</b> +'+(CFG.WHATSAPP||'51938703934')+'</p><div class="row"><a class="btn" target="_blank" rel="noopener" href="https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent('Hola Smart Fit Cusco, necesito ayuda con mi talla')+'">Escribir por WhatsApp</a><a class="btn o" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Cusco+Peru">Ver en el mapa</a></div></div><div><label>Nombre<input id="cn"></label><br><label>Correo<input id="ce" type="email"></label><br><label>Mensaje<textarea id="cm2" rows="4"></textarea></label><div class="row"><button class="btn" id="cs">Enviar mensaje</button></div></div></div></div>'},
opinion:function(){return'<div class="w pg" style="max-width:820px"><p class="crumb">Inicio / Tu opinión</p><div id="sv"></div></div><div class="w pg" id="pn" hidden style="padding-top:0"><h2>Panel del proyecto: resultados</h2><div class="stats" id="stats"></div><div class="col3" id="gr" style="margin-top:22px"></div><div class="row"><button class="btn" id="dl">Descargar Excel (CSV)</button><button class="btn o" id="rf">Actualizar</button></div><p class="lab" id="src"></p></div>'}
};
/* ---------- Router ---------- */
function route(){var h=(location.hash||'#inicio').slice(1).split('/'),p=PG[h[0]]?h[0]:'inicio';if(h[0]=='tienda')PG.f=(KN[h[1]]||h[1]=='fav'?h[1]:'todo');if(h[0]=='producto')PG.pid=h[1];
 $('#view').innerHTML=PG[p]();document.querySelectorAll('nav.m a').forEach(function(a){a.classList.toggle('on',a.dataset.p==(p=='producto'?'tienda':p))});$('#nv').classList.remove('on');window.scrollTo(0,0);document.title=ttl(p);bind(p);if(window.DemoPedidos)DemoPedidos.after(p);Lia.ctx(p)}
function bind(p){startOfertaCountdown();document.querySelectorAll('[data-add]').forEach(function(b){b.onclick=function(e){e.stopPropagation();flyToCart(b);var c=byId(b.dataset.add);if(!vendible(c)){toast('Esta prenda aún no tiene precio y colores confirmados.');return}var si=S.sx>=0?S.sx:okSz(c,0),sz=SIZES[si].t;if(agot(c,sz)||cartCount(c.id,sz)>=stockOf(c,sz)){toast(S.sx>=0?'Esta prenda no tiene disponible tu talla recomendada. Abre su ficha para revisar otras tallas.':'No hay stock configurado para esta prenda. Abre su ficha para revisar tallas.');return}CART.push({id:c.id,col:selCol(b,c),sz:sz,qty:1});cc();toast('Añadido a la bolsa: '+c.n+' · talla '+sz);track('anadir_bolsa',c.n);Lia.say('¡Añadida! ¿Quieres probártela en el probador virtual?')}});
 document.querySelectorAll('[data-pr]').forEach(function(b){b.onclick=function(e){e.stopPropagation();probar(b.dataset.pr)}});
 document.querySelectorAll('[data-ficha]').forEach(function(b){b.onclick=function(e){if(e.target.closest('[data-fav]'))return;location.hash='#producto/'+b.dataset.ficha};b.onkeydown=function(e){if(e.key=='Enter')location.hash='#producto/'+b.dataset.ficha}});
 if(p=='tienda'){document.querySelectorAll('[data-gender-shop]').forEach(function(b){b.onclick=function(){PG.gender=b.dataset.genderShop;redo()}});document.querySelectorAll('[data-f]').forEach(function(b){b.onclick=function(){var f=b.dataset.f;if(location.hash==(f=='todo'?'#tienda':'#tienda/'+f)){PG.f=f;redo()}else location.hash=(f=='todo'?'#tienda':'#tienda/'+f)}});$('#so').value=PG.so||'rel';$('#so').onchange=function(){PG.so=this.value;redo()};$('#sc2').value=PG.cl||'';$('#se').value=PG.st||'';$('#sc2').onchange=function(){PG.cl=this.value;redo()};$('#se').onchange=function(){PG.st=this.value;redo()};$('#sq').oninput=function(){var v=this.value;PG.q=v;redo();var e=$('#sq');e.focus();e.setSelectionRange(v.length,v.length)};if($('#qf'))$('#qf').onclick=function(){PG.q=PG.cl=PG.st='';redo()}}
 if(p=='producto'){var pc=byId(PG.pid)||CAT[0];track('ficha_vista',pc.n);var rr=function(){$('#view').innerHTML=PG.producto();bind('producto')};document.querySelectorAll('[data-pc]').forEach(function(b){b.onclick=function(){PG.pc=b.dataset.pc;PG.gi=0;rr()}});document.querySelectorAll('[data-gi]').forEach(function(b){b.onclick=function(){PG.gi=+b.dataset.gi;rr()}});document.querySelectorAll('[data-ps]').forEach(function(b){b.onclick=function(){if(agot(pc,SIZES[+b.dataset.ps].t)){toast('Esa talla está agotada por ahora');return}PG.ps=+b.dataset.ps;rr()}});$('#fa').onclick=function(){if(!vendible(pc)){toast('Esta prenda aún no tiene precio y colores confirmados.');return}var chosen=SIZES[PG.ps].t;if(agot(pc,chosen)){toast('Esta talla no tiene stock disponible.');return}if(cartCount(pc.id,chosen)>=stockOf(pc,chosen)){toast('No hay más unidades disponibles de esa talla.');return}flyToCart($('#fa'));CART.push({id:pc.id,col:PG.pc,sz:chosen,qty:1});cc();toast('Añadido a la bolsa: '+pc.n);track('anadir_bolsa',pc.n);Lia.say('¡Añadida! ¿Quieres probártela en el probador virtual?')};$('#fp').onclick=function(){probar(pc.id);S.col=PG.pc}}
 if(p==='pago'){
  var btn=$('#pago-confirmar');if(btn)btn.onclick=function(){
   var pend=null;try{pend=JSON.parse(sessionStorage.getItem('sfc_pago_pendiente')||'null')}catch(e){pend=null}
   if(!pend){$('#pago-msg').textContent='No se encontró el pedido en esta sesión. Vuelve a generarlo desde la bolsa.';return}
   btn.disabled=true;var msg=$('#pago-msg');if(window.DemoPedidos&&DemoPedidos.pagar(pend,msg,btn))return;msg.textContent='Registrando la simulación en el sistema…';
   if(!CFG.ENDPOINT){msg.textContent='No hay conexión configurada con Apps Script. No se registró la simulación.';btn.disabled=false;return}
   fetch(CFG.ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({tipo:'simular_adelanto_demo',codigo_seguimiento:pend.codigo_seguimiento})}).then(function(){
    msg.textContent='Solicitud enviada. Verificando el registro en el pedido…';
    setTimeout(function(){
     var cb='sfcPagoVerify'+Date.now(),sc=document.createElement('script'),phone=String(pend.telefono4||pend.telefono||'').replace(/\D/g,'').slice(-4);
     var timeout=setTimeout(function(){delete window[cb];sc.remove();msg.textContent='No fue posible verificar la respuesta del servidor. Consulta el pedido en Seguimiento antes de volver a intentarlo.';btn.disabled=false},12000);
     window[cb]=function(data){clearTimeout(timeout);delete window[cb];sc.remove();if(data&&data.ok&&data.pedido&&data.pedido.estado_pago!=='Pendiente de adelanto'){msg.innerHTML='<b>¡Adelanto simulado correctamente!</b><br>Tu pedido registró un adelanto de prueba del 50%. Recuerda que esta operación no representa un pago real.<br><b>Saldo pendiente:</b> S/ '+Number(data.pedido.saldo_pendiente||0).toFixed(2)+'<br><a href="#seguimiento">Ver seguimiento completo →</a>';btn.textContent='Simulación registrada';btn.disabled=true;try{sessionStorage.removeItem('sfc_pago_pendiente')}catch(e){}}else{msg.textContent=(data&&data.mensaje)||'El servidor no confirmó la simulación. Revisa el seguimiento del pedido.';btn.disabled=false}};
     sc.onerror=function(){clearTimeout(timeout);delete window[cb];msg.textContent='No se pudo verificar la simulación. Consulta el seguimiento del pedido.';btn.disabled=false};
     sc.src=CFG.ENDPOINT+'?seguimiento=1&codigo='+encodeURIComponent(pend.codigo_seguimiento)+'&telefono4='+encodeURIComponent(phone)+'&callback='+cb;document.body.appendChild(sc);
    },1400);
   }).catch(function(){msg.textContent='No se pudo enviar la solicitud. No se ha confirmado ningún adelanto.';btn.disabled=false});
  }
 }
 if(p==='seguimiento'){
  function jsonp(url,done){if(window.DemoPedidos&&/seguimiento=1/.test(url)){var r=DemoPedidos.consulta(url);setTimeout(function(){done(r)},450);return}var cb='sfcTrackCb'+Date.now()+Math.floor(Math.random()*1000),script=document.createElement('script'),timer=setTimeout(function(){cleanup();done({ok:false,mensaje:'No se pudo conectar con el servicio de seguimiento.'})},12000);function cleanup(){clearTimeout(timer);try{delete window[cb]}catch(e){window[cb]=undefined}if(script.parentNode)script.parentNode.removeChild(script)}window[cb]=function(data){cleanup();done(data)};script.onerror=function(){cleanup();done({ok:false,mensaje:'No se pudo consultar el pedido. Inténtalo nuevamente.'})};script.src=url+(url.indexOf('?')>-1?'&':'?')+'callback='+cb;document.body.appendChild(script)}
  function escTrack(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]})}function showTracking(data){var out=$('#trk-result');if(!data||!data.ok){out.innerHTML='';$('#trk-msg').textContent=(data&&data.mensaje)||'No encontramos el pedido. Revisa los datos.';return}$('#trk-msg').textContent='';var p=data.pedido,states=['Pedido recibido','Pendiente de confirmar','Pago pendiente','Pedido confirmado','En preparación','Listo para entregar','Entregado'],idx=states.indexOf(p.estado),final=p.estado==='Cancelado';out.innerHTML='<div class="mod"><p class="up">'+(final?'Pedido cancelado':'Estado actual')+'</p><h2>'+p.estado+'</h2><p><b>Código:</b> '+p.codigo_seguimiento+'</p><p><b>Fecha de registro:</b> '+p.fecha_pedido+'</p><p><b>Entrega estimada:</b> '+(p.fecha_entrega_estimada||'Pendiente de confirmar')+'</p>'+(p.fecha_entrega_real?'<p><b>Entrega real:</b> '+p.fecha_entrega_real+'</p>':'')+'<div style="display:flex;gap:5px;margin:20px 0">'+states.map(function(st,i){return '<div title="'+st+'" style="height:8px;flex:1;border-radius:8px;background:'+(i<=idx&&!final?'var(--acc)':'var(--line)')+'"></div>'}).join('')+'</div>'+cuscoMapa(idx,final,states.length)+'<h3>Historial de actualizaciones</h3><ol>'+data.historial.map(function(h){return '<li style="margin:10px 0"><b>'+escTrack(h.estado_nuevo)+'</b><br><small>'+escTrack(h.fecha_hora)+'</small>'+(h.observaciones?'<p>'+escTrack(h.observaciones)+'</p>':'')+'</li>'}).join('')+'</ol>'+'<div class="mod" style="margin:18px 0;border:1px solid var(--line)"><p class="up">MODO DEMO — SIMULACIÓN DE PAGOS</p><h3>Estado del adelanto</h3><p><b>Total:</b> S/ '+Number(p.total_pedido||0).toFixed(2)+'</p><p><b>Adelanto requerido (50%):</b> S/ '+Number(p.adelanto_requerido||0).toFixed(2)+'</p><p><b>Adelanto simulado:</b> S/ '+Number(p.adelanto_simulado||0).toFixed(2)+'</p><p><b>Saldo pendiente:</b> S/ '+Number(p.saldo_pendiente||0).toFixed(2)+'</p><p><b>Estado del pago:</b> '+escTrack(p.estado_pago||'Pendiente de adelanto')+'</p>'+(p.fecha_simulacion?'<small>Fecha de simulación: '+escTrack(p.fecha_simulacion)+'</small>':'')+'<p class="lab">DEMO — NO SE REALIZAN COBROS REALES. Esta información no acredita recepción de dinero.</p>'+((p.estado_pago||'Pendiente de adelanto')==='Pendiente de adelanto'&&!final?'<button class="btn" id="trk-pay-now" style="width:100%;margin-top:4px">Pagar mi adelanto ahora</button>':'')+'</div>'+(p.observaciones_publicas?'<p>'+escTrack(p.observaciones_publicas)+'</p>':'')+'<a class="btn" target="_blank" rel="noopener" href="https://wa.me/'+encodeURIComponent(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent('Hola Smart Fit Cusco. Necesito ayuda con mi pedido '+p.codigo_seguimiento+'.')+'">Consultar por WhatsApp</a></div>';var payBtn=$('#trk-pay-now');if(payBtn)payBtn.onclick=function(){var phone4=($('#trk-phone')||{}).value||'';try{sessionStorage.setItem('sfc_pago_pendiente',JSON.stringify({codigo_seguimiento:p.codigo_seguimiento,telefono4:phone4,total:p.total_pedido}))}catch(e){}location.hash='#pago'}}
  $('#trk-search').onclick=function(){var code=$('#trk-code').value.trim().toUpperCase(),phone=$('#trk-phone').value.replace(/\D/g,'');if(!/^SFC-\d{4}-[A-Z2-9]{10}$/.test(code)||phone.length!==4){$('#trk-msg').textContent='Introduce un código válido y los últimos cuatro dígitos del teléfono.';return}$('#trk-msg').textContent='Consultando…';jsonp((CFG.ENDPOINT||'')+'?seguimiento=1&codigo='+encodeURIComponent(code)+'&telefono4='+encodeURIComponent(phone),showTracking)};
  $('#adm-save').onclick=function(){var code=$('#adm-code').value.trim().toUpperCase(),token=$('#adm-token').value,state=$('#adm-state').value;if(window.DemoPedidos&&DemoPedidos.admin(code,state,$('#adm-note').value,$('#adm-msg')))return;if(!CFG.ENDPOINT){$('#adm-msg').textContent='Falta configurar la URL de Apps Script.';return}if(!token||token.length<20||!/^SFC-\d{4}-[A-Z2-9]{10}$/.test(code)){ $('#adm-msg').textContent='Revisa el código y la clave administrativa.';return}var payload={tipo:'admin_tracking',codigo_seguimiento:code,token:token,estado:state,fecha_entrega_estimada:$('#adm-eta').value,observaciones:$('#adm-note').value,correccion:$('#adm-correction').checked};fetch(CFG.ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}).then(function(){$('#adm-msg').textContent='Solicitud enviada. Vuelve a consultar el pedido para comprobar el cambio; si no aparece, revisa la clave y el registro en Apps Script.';$('#trk-code').value=code}).catch(function(){$('#adm-msg').textContent='No se pudo enviar la actualización.'})};
 }
 if(p=='asistente')render();
 if(p=='opinion'){survey();panel()}
 if(p=='contacto')$('#cs').onclick=function(){var n=$('#cn').value.trim(),em=$('#ce').value.trim(),m=$('#cm2').value.trim();if(n.length<2||!m){toast('Completa tu nombre y el mensaje');return}if(em&&!/^\S+@\S+\.\S+$/.test(em)){toast('Revisa el formato de tu correo');return}var msg='Hola Smart Fit Cusco, soy '+n+'.'+(em?' Mi correo: '+em+'.':'')+' Mensaje: '+m;if(CFG.ENDPOINT){push('contacto',{cliente:n,correo:em,detalle:n+' · '+em,comentario:m});toast('Mensaje guardado localmente; confirma el envío por WhatsApp si no hay respuesta del negocio.')}var win=window.open('https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent(msg),'_blank');if(win){try{win.opener=null}catch(e){}toast('Se abrió WhatsApp. Pulsa Enviar para que recibamos tu mensaje.')}else{toast('No se abrió WhatsApp. Copia tu mensaje o permite ventanas emergentes.')}}}
function redo(){$('#view').innerHTML=PG.tienda();bind('tienda')}
function probar(id){var c=byId(id);Lia.say('¡Buena elección: '+c.n+'! Vamos a ver cómo te queda.');S.it=c;S.col=c.c[0];S.est=0;if(S.sx>=0){S.sx=sizeIdxFor(M(),c);S.sz=S.sx;S.n=3}else{S.pend=id;S.n=0}location.hash='#asistente';if(location.hash=='#asistente'&&$('#stage'))render()}
function cartCount(id,size){return CART.reduce(function(n,x){return n+(x.id===id&&x.sz===size?(Number(x.qty)||1):0)},0)}
function cc(){try{localStorage.setItem('sfc_cart',JSON.stringify(CART))}catch(e){}$('#cc').textContent=CART.length;var f=$('#fcc');if(f)f.textContent=CART.length;var b=$('#floatcart');if(b){b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}}
function flyToCart(from){var target=$('#floatcart');if(!from||!target||!from.getBoundingClientRect)return;var a=from.getBoundingClientRect(),b=target.getBoundingClientRect(),dot=document.createElement('span');dot.className='cart-fly';dot.style.left=(a.left+a.width/2)+'px';dot.style.top=(a.top+a.height/2)+'px';document.body.appendChild(dot);requestAnimationFrame(function(){dot.style.left=(b.left+b.width/2)+'px';dot.style.top=(b.top+b.height/2)+'px';dot.style.transform='scale(.15)';dot.style.opacity='.1'});setTimeout(function(){dot.remove()},750)}
$('#floatcart').onclick=function(){$('#cartb').click()};
$('#cartb').onclick=function(){
 CART=CART.filter(function(x){return byId(x.id)});cc();
 var subtotal=0,discount=0;
 var lines=CART.map(function(x,i){
  var c=byId(x.id),rate=i===1?.05:(i>=2?.10:0),base=Number(c.pr)||0,save=Math.round(base*rate*100)/100,price=base-save;
  subtotal+=base;discount+=save;
  return '<div class="li">'+(IMG[x.id]?'<img class="lim" src="'+(IMG[x.id+'_'+x.col]||IMG[x.id])+'" alt="'+c.n+'" loading="lazy" onerror="this.style.visibility=\'hidden\'">':'<svg viewBox="0 0 200 340">'+mini(c.k,x.col).replace(/<\/?svg[^>]*>/g,'')+'</svg>')+'<div><b>'+c.n+'</b><br>'+x.col+' · Talla '+x.sz+'<br>'+(base>0?(save?'<s>S/ '+base.toFixed(2)+ '</s> <b>S/ '+price.toFixed(2)+'</b><br><small style="color:var(--acc)">Oferta adicional: -'+Math.round(rate*100)+'%</small>':'S/ '+base.toFixed(2)):'Precio por confirmar')+'</div><div style="display:flex;flex-direction:column;gap:6px;flex:none"><button class="chip" data-rm="'+i+'">Quitar</button><button class="chip" data-cs="'+i+'">Cambiar talla</button></div></div>';
 }).join('');
 var t=Math.round((subtotal-discount)*100)/100, pricePending=CART.some(function(x){var c=byId(x.id);return !c||!(Number(c.pr)>0)}); var subtotalTexto=pricePending?'Por confirmar':subtotal.toFixed(2), totalTexto=pricePending?'Por confirmar':t.toFixed(2);
 $('#cart').innerHTML=CART.length?lines+'<div class="promo-cart" style="padding:12px;background:var(--soft);margin:12px 0"><b>Beneficios aplicados</b><p style="margin:6px 0 0;font-size:13px">2.ª prenda: 5% adicional · 3.ª prenda y siguientes: 10% adicional.</p></div><p style="margin:16px 0 4px">Subtotal de ofertas: '+(pricePending?'Por confirmar':'S/ '+subtotalTexto)+'</p>'+(discount?'<p style="margin:4px 0;color:var(--acc)">Descuento por compra múltiple: − S/ '+discount.toFixed(2)+'</p>':'')+(pricePending?'<p class="cart-total"><span>Total estimado</span><b>Por confirmar</b></p>':'<p class="cart-total"><span>Total estimado</span><b>S/ '+totalTexto+'</b></p>')+'<div class="ship-progress"><div class="ship-copy"><b>'+(pricePending?'Envío pendiente':(t>=129.9?'¡Tu envío es gratis!':'Te faltan S/ '+Math.max(0,129.9-t).toFixed(2)+' para el envío gratis'))+'</b><span>Envío gratis desde S/ 129.90</span></div><div class="ship-track"><i style="width:'+Math.min(100,(pricePending?0:Math.round(t/129.9*100)))+'%"></i></div></div><div style="display:grid;gap:8px;margin:0 0 12px"><p class="lab" style="margin:0"><b>Tus datos para el pedido</b></p><input id="pcn" placeholder="Tu nombre" autocomplete="name" value="'+(CLI.n||'').replace(/"/g,'')+'"><input id="pct" placeholder="Celular / WhatsApp" inputmode="tel" autocomplete="tel" value="'+(CLI.t||'').replace(/"/g,'')+'"></div><button class="btn" id="rsv" style="width:100%">Reservar para probar en tienda</button><a class="btn o" id="wa" target="_blank" rel="noopener" style="width:100%;text-align:center;margin-top:8px" href="https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent('Hola Smart Fit Cusco, quiero pedir: '+CART.map(function(x){return byId(x.id).n+' ('+x.col+', talla '+x.sz+')'}).join(', ')+'. Total: S/ '+totalTexto)+'">Comprar por WhatsApp</a><button class="btn" id="payn" style="width:100%;margin-top:8px"'+((CFG.PAGO&&CFG.PAGO.ACTIVO)?'':' disabled title="Disponible pronto"')+'>'+((CFG.PAGO&&CFG.PAGO.ACTIVO)?'Pagar ahora':'Pago en línea · próximamente')+'</button>':'<p>Tu bolsa está vacía.</p>';
 if(window.DemoPedidos)DemoPedidos.tab('c');$('#drw').classList.add('on');
 document.querySelectorAll('[data-rm]').forEach(function(b){b.onclick=function(){CART.splice(+b.dataset.rm,1);cc();$('#cartb').onclick()}});
 if($('#wa'))$('#wa').onclick=function(e){var o=pedido('WhatsApp',t);if(!o){e.preventDefault();return}setTimeout(function(){CART=[];cc();$('#drw').classList.remove('on')},300);this.href='https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent('Hola Smart Fit Cusco, soy '+o.cliente+'. Pedido '+o.pedido_id+'. Código de seguimiento: '+o.codigo_seguimiento+'. Consulta el estado en '+location.origin+location.pathname+'#seguimiento. Detalle: '+o.items+'. Total con descuentos: S/ '+o.total.toFixed(2))};
 if($('#payn'))$('#payn').onclick=function(){if(window.FX&&FX.pagar)FX.pagar(CART,t);else toast('Pago en línea disponible pronto')};
 document.querySelectorAll('[data-cs]').forEach(function(b){b.onclick=function(){if(window.FX)FX.cambio(CART[+b.dataset.cs])}});
 if($('#rsv'))$('#rsv').onclick=function(){var o=pedido('Reserva en tienda',t);if(!o)return;var msg='Hola Smart Fit Cusco, quiero solicitar una reserva para probar en tienda. Pedido '+o.pedido_id+'\nCódigo de seguimiento: '+o.codigo_seguimiento+'\nConsulta: '+location.origin+location.pathname+'#seguimiento\nNombre: '+o.cliente+'\nCelular: '+o.telefono+'\nPrendas: '+o.items+'\nTotal estimado: S/ '+o.total.toFixed(2)+'\nPor favor, confirmen disponibilidad y horario.';var url='https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent(msg);var win=window.open(url,'_blank');if(win){try{win.opener=null}catch(e){}CART=[];cc();$('#drw').classList.remove('on');toast('Se abrió WhatsApp. Revisa el pedido y pulsa Enviar para confirmarlo.')}else{CART=[];cc();$('#drw').classList.remove('on');toast('Tu pedido quedó registrado con el código '+o.codigo_seguimiento+'. El navegador bloqueó WhatsApp: escríbenos al +51 '+(CFG.WHATSAPP||'51938703934').replace(/^51/,'')+' indicando ese código.')}}
};
$('#cl').onclick=function(){$('#drw').classList.remove('on')};$('#drw').onclick=function(e){if(e.target.id=='drw')$('#drw').classList.remove('on')};
$('#bg').onclick=function(){$('#nv').classList.toggle('on')};$('#sub').onclick=function(){var v=$('#em').value.trim();if(!/^\S+@\S+\.\S+$/.test(v)){toast('Ingresa un correo válido');return}if(!CFG.ENDPOINT){toast('La suscripción por correo aún no está conectada. Contáctanos por WhatsApp.');return}push('suscripcion',{correo:v,detalle:v});toast('Solicitud registrada en el navegador; el registro remoto requiere verificar el servicio.');};
window.addEventListener('hashchange',route);

/* ---------- Asistente ---------- */
function head(){$('#bar').style.width=(S.n+1)/STEPS.length*100+'%';$('#lab').textContent='Paso '+(S.n+1)+' de '+STEPS.length+' · '+STEPS[S.n]}
function go(n){S.n=n;render();window.scrollTo(0,0)}
function render(){var st=$('#stage');if(!st)return;head();Lia.step(S.n);
 if(S.n==0){st.innerHTML='<h3>Encuentra tu talla ideal</h3><p style="color:var(--mut)">Personaliza el análisis para que Lía te recomiende prendas y una silueta adecuadas.</p><div class="gender-pick"><span class="lab" style="margin:0">¿Qué prendas buscas?</span><button type="button" class="chip '+(S.gender==='mujer'?'on':'')+'" data-gender="mujer">♀ Mujer</button><button type="button" class="chip '+(S.gender==='hombre'?'on':'')+'" data-gender="hombre">♂ Hombre</button></div><details open style="border:1px solid var(--line);padding:14px;margin:12px 0"><summary class="up" style="cursor:pointer">¿Cómo tomar tus medidas?</summary><div class="measure-help" style="font-size:14px;margin-top:12px"><p><b>1. Pecho / busto:</b> rodea la parte más ancha del torso, manteniendo la cinta horizontal.</p><p><b>2. Cintura:</b> mide alrededor de la cintura sin apretar.</p><p><b>3. Cadera:</b> mide la parte más ancha de cadera y glúteos.</p><p><b>4. Estatura:</b> de pie, sin zapatos y contra una pared.</p><p class="lab">El holograma aparecerá en el paso 2. Aquí solo preparamos las medidas.</p></div></details><div class="f">'+['altura|Estatura','pecho|Pecho','cintura|Cintura','cadera|Cadera'].map(function(x){var a=x.split('|');return'<label>'+a[1]+' (cm)<input type="number" inputmode="numeric" id="m_'+a[0]+'" value="'+S.m[a[0]]+'"></label>'}).join('')+'</div><label style="text-transform:none;letter-spacing:0;display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" id="rm" style="width:auto"'+(S.mem?' checked':'')+'> Recordar mis medidas en este dispositivo</label>'+(S.mem?'<p class="lab">Estamos usando tus medidas guardadas. <a href="#" id="fg3">Borrar mis datos guardados</a></p>':'')+'<p class="err">'+S.err+'</p><div class="row"><button class="btn" id="nx">Analizar mis medidas</button></div>';
  if($('#fg3'))$('#fg3').onclick=function(e){e.preventDefault();try{localStorage.removeItem('sfc_m')}catch(x){}S.m={altura:'',pecho:'',cintura:'',cadera:''};S.mem=0;render();toast('Tus medidas guardadas fueron borradas')};
  document.querySelectorAll('[data-gender]').forEach(function(b){b.onclick=function(){S.gender=b.dataset.gender;S.ref=S.gender;render()}});
  $('#nx').onclick=function(){['altura','pecho','cintura','cadera'].forEach(function(k){S.m[k]=$('#m_'+k).value});var m=M(),r={altura:[120,210],pecho:[70,170],cintura:[55,160],cadera:[75,180]},bad='';for(var k in r){if(!(m[k]>=r[k][0]&&m[k]<=r[k][1]))bad=k}
   if(bad){S.err='Revisa "'+bad+'": ingresa un valor realista en centímetros ('+r[bad][0]+'–'+r[bad][1]+').';render();return}if(!validSizeTable(S.gender)){S.err='La tabla de medidas '+(S.gender==='hombre'?'masculina':'femenina')+' aún está pendiente de validación. No podemos recomendar una talla real hasta completar sus medidas verificadas.';render();return}S.err='';S.sx=sizeIdx(m,S.gender);if(S.sx<0){S.err='Tus medidas superan nuestra talla máxima (5XL). Escríbenos por WhatsApp y vemos opciones a medida para ti.';render();return}S.body=bodyType(m);S.out=outRange(m);try{if($('#rm').checked){localStorage.setItem('sfc_m',JSON.stringify(S.m));S.mem=1}else{localStorage.removeItem('sfc_m');S.mem=0}}catch(e){}track('medidas_analizadas','talla '+SIZES[S.sx].t+' · '+BODY[S.body]);go(1)}}
 else if(S.n==1){var m=M(),g=SIZES[S.sx],limits=tableForGender(S.gender)[g.t],ls=['Leyendo medidas ingresadas…','Comparando con la tabla de tallas…','Pecho '+m.pecho+' cm · Cintura '+m.cintura+' cm · Cadera '+m.cadera+' cm','Ajustando la guía visual para '+(S.gender==='hombre'?'hombre':'mujer')+'…','¡Análisis listo!'];
  st.innerHTML='<div class="two holo-layout"><div class="fig scan holo-fig" id="fg"><i></i>'+holoAnalysis(m)+'</div><div><h3>Análisis holográfico</h3><p class="lab">El escaneo visual es una guía: las medidas provienen de los centímetros que ingresaste.</p><ul class="log" id="lg"></ul><div id="res"></div></div></div>';
  ls.forEach(function(t,i){setTimeout(function(){if(S.n!=1||!$('#lg'))return;$('#lg').insertAdjacentHTML('beforeend','<li>'+(i<4?'… ':'✓ ')+t+'</li>');if(i==4){$('#fg').classList.remove('scan');$('#fg i').remove();$('#res').innerHTML='<div class="res"><p class="lab" style="margin-bottom:4px">Tu talla ideal</p><p class="big">'+g.t+'</p><p>Silueta: <span class="tag">'+BODY[S.body]+'</span></p>'+(S.out?'<p class="no">'+OUTMSG[S.out]+'</p>':'')+(near(m,S.sx)?'<p class="lab">Estás cerca del límite: en prendas holgadas también podría quedarte la '+SIZES[Math.min(S.sx+1,SIZES.length-1)].t+'.</p>':'')+'<table><tr><th></th><th>Tú</th><th>Talla '+g.t+'</th></tr><tr><td>Pecho</td><td>'+m.pecho+'</td><td>hasta '+limits.pecho+'</td></tr><tr><td>Cintura</td><td>'+m.cintura+'</td><td>hasta '+limits.cintura+'</td></tr><tr><td>Cadera</td><td>'+m.cadera+'</td><td>hasta '+limits.cadera+'</td></tr></table>'+demoNote()+'<div class="row"><button class="btn" id="n2">Ver prendas para mí</button><button class="btn o" id="b2">Cambiar medidas</button></div></div>';$('#n2').onclick=function(){if(S.pend){S.it=byId(S.pend);S.col=S.it.c[0];S.sx=sizeIdxFor(M(),S.it);S.sz=S.sx;S.pend=null;go(3)}else go(2)};$('#b2').onclick=function(){go(0)}}},i*750+300)})}
 else if(S.n==2){var list=CAT.filter(function(c){return c.gender===(S.gender==='hombre'?'hombre':'mujer')&&vendible(c)&&stockOf(c,SIZES[S.sx].t)>0}).sort(function(a,b){return(b.b.indexOf(S.body)>-1)-(a.b.indexOf(S.body)>-1)});
  st.innerHTML='<h3>Prendas para '+(S.gender==='hombre'?'hombre':'mujer')+' · silueta '+BODY[S.body].toLowerCase()+'</h3><p class="lab">'+(S.gender==='hombre'?'Opciones de estilo masculino: polos, camisas, casacas y pantalones.':'Opciones de estilo femenino recomendadas para tu silueta.')+'</p>'+(list.length?'<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">'+list.map(card).join('')+'</div>':'<p class="lab">Por ahora no hay productos con stock confirmado en tu talla recomendada. Puedes revisar la tienda o consultar por WhatsApp.</p>')+'<div class="row"><button class="btn o" id="b2">Atrás</button></div>';
  document.querySelectorAll('[data-add]').forEach(function(b){b.onclick=function(e){e.stopPropagation();flyToCart(b);var c=byId(b.dataset.add);if(!vendible(c)){toast('Esta prenda aún no tiene precio y colores confirmados.');return}var rs=sizeIdxFor(M(),c);if(rs<0||agot(c,SIZES[rs].t)){toast('No hay una talla recomendada disponible para esta prenda. Revisa el stock o consulta con la tienda.');return}if(cartCount(c.id,SIZES[rs].t)>=stockOf(c,SIZES[rs].t)){toast('No hay más unidades disponibles de esa talla.');return}CART.push({id:c.id,col:c.c[0],sz:SIZES[rs].t});cc();toast('Añadido a la bolsa');track('anadir_bolsa',c.n);Lia.say('¡Buena elección! Va a quedarte muy bien.')}});
  document.querySelectorAll('[data-pr],[data-ficha]').forEach(function(b){b.onclick=function(e){if(e.target.closest('[data-fav]'))return;e.stopPropagation();S.it=byId(b.dataset.pr||b.dataset.ficha);S.col=S.it.c[0];S.sx=sizeIdxFor(M(),S.it);S.sz=S.sx;S.est=0;go(3)}});$('#b2').onclick=function(){go(1)}}
 else if(S.n==3){var it=S.it,m=M(),chart=chartFor(it),itemRec=sizeIdxFor(m,it);S.sx=itemRec;if(agot(it,SIZES[S.sz].t))S.sz=okSz(it,S.sz);var g=chart[S.sz],ft=[['Pecho',m.pecho,g.p],['Cintura',m.cintura,g.c],['Cadera',m.cadera,g.h]].filter(function(a){return ['pantalon','short','falda'].indexOf(it.k)<0||a[0]!=='Pecho'});var tk=it.id+S.col+S.sz;if(S.tk!=tk){S.tk=tk;track('prenda_probada',it.n+' · '+S.col+' · '+g.t)}
  st.innerHTML='<div class="two tryon-layout"><div class="fig tryon-preview" id="figp" data-prob="1" data-k="'+it.k+'" data-col="'+S.col+'" data-sz="'+S.sz+'">'+(IMG[it.id+'_'+S.col]?'<img class="tryon-product" src="'+IMG[it.id+'_'+S.col]+'" alt="'+it.n+' en color '+S.col+'" loading="lazy" onerror="this.remove()">':IMG[it.id]?'<img class="tryon-product" src="'+IMG[it.id]+'" alt="'+it.n+'" loading="lazy" onerror="this.remove()">':'<div class="tryon-placeholder" aria-label="Vista previa de la prenda"><span aria-hidden="true">✦</span><strong>'+it.n+'</strong><small>Vista previa de la prenda</small></div>')+'<p class="tryon-caption">Prenda seleccionada · Vista de referencia</p></div><div><h2>'+it.n+'</h2><p class="lab">'+it.e+' · S/ '+it.pr+'.00 · Silueta '+BODY[S.body]+'</p><label>Color: '+S.col+'</label><div>'+it.c.map(function(c){return'<span class="sw'+(c==S.col?' on':'')+'" data-c="'+c+'" title="'+c+'" style="background:'+COL[c]+'"></span>'}).join('')+'</div><label style="margin-top:10px">Talla recomendada para esta prenda: '+SIZES[S.sx].t+'</label><div>'+SIZES.map(function(z,i){return'<span class="sz'+(i==S.sz?' on':'')+(i==S.sx?' rec':'')+(agot(it,z.t)?' ag':'')+'" data-z="'+i+'"'+(agot(it,z.t)?' aria-disabled="true" title="Talla agotada"':'')+'>'+z.t+'</span>'}).join('')+'</div><p class="lab" style="margin:8px 0 0">Guía orientativa por tipo de prenda; confirmar con la tabla del fabricante.</p><table style="margin-top:10px">'+ft.map(function(a){var r=fit(a[1],a[2]);return'<tr><td>'+a[0]+'</td><td>'+a[1]+' cm</td><td class="'+r[1]+'">'+(r[1]=='ok'?'✓ ':'✗ ')+r[0]+'</td></tr>'}).join('')+'</table><div class="row"><button class="btn" id="n2">Pedir al asistente</button><button class="btn o" id="b2">Otra prenda</button></div></div></div>';
  document.querySelectorAll('.sw').forEach(function(e){e.onclick=function(){S.col=e.dataset.c;render()}});document.querySelectorAll('.sz').forEach(function(e){e.onclick=function(){if(agot(S.it,SIZES[+e.dataset.z].t)){toast('Esa talla está agotada por ahora');return}S.sz=+e.dataset.z;Lia.say('Talla '+SIZES[S.sz].t+': '+(S.sz==S.sx?'es la que te recomiendo.':S.sz<S.sx?'puede quedarte ajustada.':'te quedará más holgada.'));render()}});$('#n2').onclick=function(){S.est=0;go(4)};$('#b2').onclick=function(){go(2)}}
 else{var E=['Pedido recibido','Asistente buscando '+S.it.n+' en talla '+SIZES[S.sz].t,'Verificando talla y color ('+S.col+')','Lista en tu probador'];
  st.innerHTML='<h3>Tu asistente está preparando tu prenda</h3><div class="tl" id="tl"></div><div id="done"></div>';
  (function t(){if(S.n!=4||!$('#tl'))return;$('#tl').innerHTML=E.map(function(x,i){return'<div class="'+(i<=S.est?'d':'')+'">'+x+'</div>'}).join('');if(S.est<E.length-1){S.est++;setTimeout(t,1100)}else{$('#done').innerHTML='<p>Tu prenda está lista. Pruébatela y cuéntanos qué te pareció.</p><div class="row"><a class="btn" href="#opinion">Dar mi opinión</a><button class="btn o" id="b2">Cambiar talla</button><button class="btn o" id="cs4">Solicitar cambio de talla</button></div>';$('#b2').onclick=function(){go(3)};$('#cs4').onclick=function(){if(window.FX)FX.cambio({id:S.it.id,col:S.col,sz:SIZES[S.sz].t})};track('talla_lista',S.it.n);setTimeout(function(){if(S.n==4)feedback('talla')},1500)}})()}}

/* ---------- Encuesta + Excel ---------- */
var COLS=['fecha','sesion','tipo','detalle','prenda','talla','color','silueta','altura','pecho','cintura','cadera','estrellas','gusto','uso','util','conf','usar','pago','nps','comentario','segundos','pedido_id','canal','cliente','telefono','correo','items','cantidad','total','estado'],LK='sfc_resp',dbh=null,ALL=[],SENT=false;
function stableAnonId(key,store){try{var st=window[store],v=st.getItem(key);if(!v){v='sf-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,14);st.setItem(key,v)}return v}catch(e){return 'sf-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,14)}}
var SID=stableAnonId('sfc_session_id','sessionStorage'),VID=stableAnonId('sfc_visitor_id','localStorage');
function loc(){try{return JSON.parse(localStorage.getItem(LK)||'[]')}catch(e){return[]}}
function csv(a){var q=function(v){return'"'+String(v===undefined?'':v).replace(/"/g,'""')+'"'};return'\ufeff'+COLS.join(',')+'\n'+a.map(function(r){return COLS.map(function(k){return q(r[k])}).join(',')}).join('\n')}
function survey(){var el=$('#sv');if(SENT){el.innerHTML='<h1>¡Gracias por tu opinión!</h1><p style="font-size:17px">Tus respuestas ya están guardadas en la base del proyecto.</p><div class="row"><a class="btn" href="#tienda">Seguir viendo la tienda</a></div>';return}
 el.innerHTML='<h1>Tu opinión nos ayuda a mejorar</h1><p style="color:var(--mut)">5 preguntas, menos de 2 minutos. Es anónimo.</p>'+(S.it?'':'<p class="lab">Tip: prueba antes el <a href="#asistente">asistente de tallas</a> para opinar con más contexto.</p>')+'<div class="q"><p>¿Qué calificación le das al asistente?</p><div class="rate" id="rt">'+[1,2,3,4,5].map(function(i){return'<button data-v="'+i+'">★</button>'}).join('')+'</div></div>'+Q.map(function(q){return'<div class="q"><p>'+q[1]+'</p><div class="opt" data-k="'+q[0]+'">'+q[2].map(function(o){return'<button>'+o+'</button>'}).join('')+'</div></div>'}).join('')+'<div class="q"><p>Del 0 al 10, ¿qué tan probable es que lo recomiendes?</p><div class="sc" id="nps">'+[0,1,2,3,4,5,6,7,8,9,10].map(function(i){return'<button data-v="'+i+'">'+i+'</button>'}).join('')+'</div></div><div class="q"><p>¿Qué mejorarías? (opcional)</p><textarea id="cm" rows="3"></textarea></div><p class="err" id="er"></p><button class="btn" id="env">Enviar encuesta</button>';
 document.querySelectorAll('#rt button').forEach(function(b){b.onclick=function(){S.r.estrellas=+b.dataset.v;document.querySelectorAll('#rt button').forEach(function(x){x.classList.toggle('on',+x.dataset.v<=S.r.estrellas)})}});
 document.querySelectorAll('.opt').forEach(function(d){d.querySelectorAll('button').forEach(function(b){b.onclick=function(){S.r[d.dataset.k]=b.textContent;d.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x==b)})}})});
 document.querySelectorAll('#nps button').forEach(function(b){b.onclick=function(){S.r.nps=+b.dataset.v;document.querySelectorAll('#nps button').forEach(function(x){x.classList.toggle('on',x==b)})}});
 $('#env').onclick=function(){if(!S.r.estrellas||S.r.nps===undefined||Q.some(function(q){return!S.r[q[0]]})){$('#er').textContent='Responde todas las preguntas obligatorias para continuar.';return}S.r.comentario=$('#cm').value;$('#env').disabled=true;push('encuesta',S.r).then(function(){SENT=true;S.r={};survey()})}}
async function panel(){var u=null;try{u=await claude.use('user')}catch(e){}var ad=(u&&u.canEdit&&u.canEdit())||/admin/.test(location.search);if(!ad||!$('#pn'))return;$('#pn').hidden=false;
 async function load(){ALL=[];$('#src').textContent='';if(dbh){try{var s=await dbh.collection('respuestas').get();ALL=s.docs.map(function(d){return d.data?d.data():d});$('#src').textContent='Fuente: base compartida del proyecto.'}catch(e){}}
  if(!ALL.length){ALL=loc();$('#src').textContent='Fuente: este navegador (la base compartida está vacía o no disponible).'}
  var R=ALL.filter(function(r){return r.estrellas}),n=R.length,ev=ALL.filter(function(r){return r.tipo=='evento'}).length,av=function(k){var z=R.filter(function(r){return r[k]!==undefined&&r[k]!==''});return z.length?(z.reduce(function(t,r){return t+(+r[k]||0)},0)/z.length).toFixed(1):'–'},si=n?Math.round(R.filter(function(r){return/^Sí/.test(r.util)}).length/Math.max(1,R.filter(function(r){return r.util}).length)*100)+'%':'–';
  if($('#stats'))$('#stats').innerHTML='<div><b>'+n+'</b>Opiniones</div><div><b>'+av('estrellas')+'</b>Estrellas (de 5)</div><div><b>'+av('nps')+'</b>Recomendación (0–10)</div><div><b>'+si+'</b>Dice que le sirve</div><div><b>'+ev+'</b>Eventos registrados</div>';var tc={},pc={};ALL.filter(function(r){return r.tipo=='evento'}).forEach(function(r){var m=/^medidas_analizadas: talla (\S+)/.exec(r.detalle||''),q=/^prenda_probada: (.*?) · /.exec(r.detalle||'');if(m)tc[m[1]]=(tc[m[1]]||0)+1;if(q)pc[q[1]]=(pc[q[1]]||0)+1});if($('#gr'))$('#gr').innerHTML=bars('Tallas calculadas',tc)+bars('Prendas más probadas',pc)}
 $('#rf').onclick=load;$('#dl').onclick=async function(){var data=csv(ALL.length?ALL:[{}]);try{var d=await claude.use('downloads');if(d){await d.save({filename:'smart-fit-cusco-respuestas.csv',data:data});return}}catch(e){}var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'text/csv'}));a.download='smart-fit-cusco-respuestas.csv';a.click()};load()}
(async function(){try{dbh=await claude.use('db')}catch(e){}})();
/* ---------- Registro (Excel) ---------- */
function base(){var m=M();return{fecha:new Date().toISOString(),sesion:SID,visitante_id:VID,prenda:S.it?S.it.n:'',talla:S.sz>=0?SIZES[S.sz].t:(S.sx>=0?SIZES[S.sx].t:''),color:S.col,silueta:S.body?BODY[S.body]:'',altura:m.altura||'',pecho:m.pecho||'',cintura:m.cintura||'',cadera:m.cadera||'',segundos:Math.round((Date.now()-S.started)/1000)}}
function push(tipo,x){var d=base();d.tipo=tipo;for(var k in x)d[k]=x[k];try{var a=loc(),copia=Object.assign({},d);if(tipo==='experimento'&&d.evento==='reserva_completada'){copia.nombre='';copia.cliente='';copia.telefono=''}a.push(copia);localStorage.setItem(LK,JSON.stringify(a))}catch(e){}
 if(CFG.ENDPOINT){try{fetch(CFG.ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(d)}).catch(function(){})}catch(e){}}
 var shared=Object.assign({},d);delete shared._registroLocal;if(tipo==='experimento'&&d.evento==='reserva_completada'){shared.nombre='';shared.cliente='';shared.telefono=''}return(dbh?dbh.collection('respuestas').add(shared):Promise.resolve()).catch(function(){})}
var CLI={n:'',t:''};
function crearCodigoSeguimiento(){var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',bytes=new Uint8Array(10);try{crypto.getRandomValues(bytes)}catch(e){for(var i=0;i<10;i++)bytes[i]=Math.floor(Math.random()*256)}var token='';for(var j=0;j<10;j++)token+=chars.charAt(bytes[j]%chars.length);return 'SFC-'+new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric'}).format(new Date())+'-'+token}

/* Simulación visual de reparto dentro de la ciudad del Cusco (no usa geolocalización real). */
function cuscoMapa(idx,final,total){
 total=total||7;
 var paradas=[
  {t:'Tienda Smart Fit Cusco',d:'San Blas · recepción del pedido'},
  {t:'Taller de preparación',d:'Centro Histórico, Cusco'},
  {t:'Reparto en camino',d:'En ruta por tu distrito'},
  {t:'Tu dirección',d:'Punto de entrega final'}
 ];
 var frac=final?0:Math.max(0,Math.min(1,idx/(total-1)));
 var pct=Math.round(frac*100);
 return '<div class="mod cusco-map"><p class="up">Simulación de ruta en Cusco</p><p class="lab" style="margin-top:-4px">Avance referencial del reparto dentro de la ciudad; no es una ubicación GPS real.</p>'+
  '<div class="cm-track" role="img" aria-label="Avance del reparto: '+pct+'% del recorrido simulado">'+
   '<i class="cm-fill" style="width:'+pct+'%"></i>'+
   paradas.map(function(w,i){return '<span class="cm-wp'+(i/(paradas.length-1)<=frac?' on':'')+'" style="left:'+Math.round(i/(paradas.length-1)*100)+'%" title="'+w.t+'"></span>'}).join('')+
   (final?'<span class="cm-moto cm-cancel" style="left:'+pct+'%">⛔</span>':'<span class="cm-moto" style="left:'+pct+'%">🛵</span>')+
  '</div>'+
  '<div class="cm-labels">'+paradas.map(function(w,i){return '<div class="'+(i/(paradas.length-1)<=frac?'on':'')+'"><b>'+w.t+'</b><small>'+w.d+'</small></div>'}).join('')+'</div>'+
 '</div>'
}
function mostrarSimulacionAdelantoDemo(o){
 // Ya no se muestra como ventana emergente: redirige a la sección "Pagar pedido" (#pago)
 // con el código QR de pago (simulado) y el resumen del adelanto. Ver PG.pago en este archivo.
 try{sessionStorage.setItem('sfc_pago_pendiente',JSON.stringify({codigo_seguimiento:o.codigo_seguimiento,pedido_id:o.pedido_id,cliente:o.cliente,telefono:o.telefono,total:o.total}))}catch(e){}
 location.hash='#pago';
}

var ORD_LOCK=0;
function pedido(canal,total){if(Date.now()-ORD_LOCK<4000){toast('Tu pedido ya se está registrando…');return null}if(CART.some(function(x){var c=byId(x.id);return !c||!(Number(c.pr)>0)})){toast('Hay productos con precio pendiente. Configura sus precios antes de registrar el pedido.');return null}var n=($('#pcn')||{}).value||'',t=($('#pct')||{}).value||'';CLI.n=n.trim();CLI.t=t.trim();if(CLI.n.length<2||CLI.t.replace(/\D/g,'').length<7){toast('Escribe tu nombre y un celular válido para el pedido');return null}
 var o={pedido_id:'P'+Date.now().toString(36).toUpperCase().slice(-6),codigo_seguimiento:crearCodigoSeguimiento(),canal:canal,cliente:CLI.n,telefono:CLI.t,items:CART.map(function(x){return byId(x.id).n+' ('+x.col+', talla '+x.sz+')'}).join(' | '),cantidad:CART.length,total:total,estado:'Nuevo',line_items:CART.map(function(x){return{id:x.id,talla:x.sz,color:x.col,cantidad:Number(x.qty)||1}}),detalle:'pedido '+canal};
 ORD_LOCK=Date.now();push('pedido',o);if(window.DemoPedidos)DemoPedidos.guardar(o,CART);toast('Código de seguimiento: '+o.codigo_seguimiento);setTimeout(function(){mostrarSimulacionAdelantoDemo(o)},250);return o}
function track(a,d){push('evento',{detalle:a+(d?': '+d:'')})}
/* Experimento KPI: se envía como tipo 'experimento' (hoja Experimento KPI del Apps Script) */
function kpi(ev,x){x=x||{};x.evento=ev;x.producto='Premium';x.precio=120;x.pagina=location.href;x.origen='web';return push('experimento',x)}
function feedback(tipo){if($('#fb'))return;var G=['El calce','El color','El estilo','El precio','La atención del asistente'],est=0,gs=[],ov=document.createElement('div');ov.id='fb';ov.className='ov';
 ov.innerHTML='<div class="mod"><h3>'+(tipo=='talla'?'¿Qué tal tu talla?':'¿Cómo fue tu compra?')+'</h3><p class="lab">'+(S.it?S.it.n+(S.sz>=0?' · talla '+SIZES[S.sz].t:''):'Tu experiencia')+'</p><div class="rate" id="fr">'+[1,2,3,4,5].map(function(i){return'<button data-v="'+i+'">★</button>'}).join('')+'</div><p style="margin:12px 0 6px"><b>¿Qué fue lo que más te gustó?</b></p><div class="opt" id="fg2">'+G.map(function(g){return'<button>'+g+'</button>'}).join('')+'</div><textarea id="fc" rows="2" placeholder="Cuéntanos más (opcional)"></textarea><p class="err" id="fe"></p><div class="row" style="margin-top:6px"><button class="btn" id="fs">Enviar</button><button class="btn o" id="fn">Ahora no</button></div></div>';
 document.body.appendChild(ov);
 ov.querySelectorAll('#fr button').forEach(function(b){b.onclick=function(){est=+b.dataset.v;ov.querySelectorAll('#fr button').forEach(function(x){x.classList.toggle('on',+x.dataset.v<=est)})}});
 ov.querySelectorAll('#fg2 button').forEach(function(b){b.onclick=function(){var i=gs.indexOf(b.textContent);if(i>-1)gs.splice(i,1);else gs.push(b.textContent);b.classList.toggle('on')}});
 $('#fn').onclick=function(){ov.remove()};
 $('#fs').onclick=function(){if(!est){$('#fe').textContent='Elige una calificación de 1 a 5.';return}push('feedback_'+tipo,{estrellas:est,gusto:gs.join('; '),comentario:$('#fc').value,detalle:tipo=='talla'?'después del tallaje':'después de la compra'});ov.remove();toast('¡Gracias por tu opinión!');Lia.say('¡Gracias! Tu opinión me ayuda a mejorar.')}}

/* ---------- Lía, la asistente ---------- */
var Lia=(function(){var el=$('#lia'),cx='inicio',mute=false,hid,lastSay=0,menu=false,lastY=0,lastSc=0;
 var P={inicio:['¡Hola! Soy Lía, tu asistente de tallas.','¿Quieres saber tu talla exacta en 3 minutos?','Mira las novedades o cuéntame qué buscas.','¿Necesitas ayuda?','Toca mi imagen si quieres que te guíe.'],
 tienda:['¿Te ayudo a encontrar lo que más te favorece?','Pulsa "Probar" en una prenda y te muestro cómo te queda.','Si me das tus medidas, ordeno el catálogo para ti.','¿Necesitas ayuda?'],
 nosotros:['Nacimos para que vestirte bien sea fácil.','¿Quieres ver cómo funciona? Pruébame.','Cada cuerpo es distinto, y tu ropa también debe serlo.'],
 contacto:['¿Prefieres escribirnos? Estamos para ayudarte.','También puedo ayudarte con tu talla ahora mismo.'],
 opinion:['Tu opinión me ayuda a mejorar.','Solo toma un par de minutos y es anónima.','¿Qué fue lo que más te gustó?'],
 a0:['Mídete con una cinta métrica, sin apretar.','¿Sin cinta a la mano? Usa las medidas de ejemplo.','¿Necesitas ayuda con alguna medida?'],
 a1:['Estoy comparando tus medidas con la tabla de tallas…','Un momento, ya casi termino.'],
 a2:['Las prendas "Para tu silueta" te favorecen más.','Elige la que más te guste, luego ajustamos la talla.','¿Necesitas ayuda para decidir?'],
 a3:['Prueba otros colores y tallas, sin compromiso.','Las marcas ✓ indican qué medidas calzan bien.','¿Te animas a pedirla al asistente?'],
 a4:['Tu asistente ya está preparando tu prenda.','Pronto estará lista en tu probador.']};
 var SVG='<svg viewBox="0 0 80 100"><path d="M22 99L29 58Q40 50 51 58L58 99Z" fill="#1F5F99"/><path d="M29 59Q40 70 51 59" fill="none" stroke="#e8c14a" stroke-width="5"/><path class="arm" d="M52 62Q66 58 69 44" stroke="#e9c9a8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="40" cy="36" r="17" fill="#e9c9a8"/><path d="M22 36Q22 14 40 15Q58 14 58 36Q50 25 40 26Q30 25 22 36Z" fill="#2b1d17"/><circle cx="40" cy="11" r="6" fill="#2b1d17"/><g class="ey"><circle cx="34" cy="38" r="2" fill="#2b1d17"/><circle cx="46" cy="38" r="2" fill="#2b1d17"/></g><path d="M35 45Q40 50 45 45" stroke="#2b1d17" fill="none" stroke-width="2" stroke-linecap="round"/><circle cx="30" cy="43" r="2.5" fill="#e59a8a" opacity=".6"/><circle cx="50" cy="43" r="2.5" fill="#e59a8a" opacity=".6"/></svg>';
 el.innerHTML='<div class="lb" id="lb"></div><div class="lmn" id="lm"></div><button class="lf" id="lbtn" aria-label="Lía, asistente de tallas">'+SVG+'</button>';
 var lb=$('#lb'),lm=$('#lm');
 function say(t,ms){if(mute||menu||document.getElementById('fb')||/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||''))return;lb.textContent=t;lb.classList.add('on');el.classList.add('talk');lastSay=Date.now();clearTimeout(hid);hid=setTimeout(function(){lb.classList.remove('on');el.classList.remove('talk')},ms||6500)}
 function pick(){var a=P[cx]||P.inicio,t=a[Math.floor(Math.random()*a.length)];if(t==pick.l)t=a[(a.indexOf(t)+1)%a.length];pick.l=t;return t}
 function idle(){if(Date.now()-lastSay>4500)say(pick());setTimeout(idle,5000+Math.random()*10000)}
 var FAQ=[['¿Cómo me mido?','Usa una cinta métrica sin apretar: pecho en la parte más ancha, cintura en la más estrecha y cadera en la más ancha. En el asistente hay una guía con dibujo.'],['¿Puedo cambiar la talla?','Sí. En el probador puedes pedir una talla arriba o abajo, sin costo.'],['¿Cómo recibo mi pedido?','Puedes recogerlo en tienda en Cusco o pedirlo por WhatsApp desde tu bolsa.'],['¿Cómo pago?','Por ahora no cobramos en línea. Coordinamos tu pedido por WhatsApp y te indicamos las opciones de pago disponibles (abono, pago contra entrega o recojo en tienda).'],['¿Guardan mis medidas?','Solo si marcas "Recordar mis medidas", y se guardan en tu propio dispositivo. Puedes borrarlas cuando quieras.']];
 function answerUser(raw){
  var q=String(raw||'').trim().toLowerCase(); if(!q)return;
  var reply='Puedo ayudarte con tu talla, prendas, medidas, carrito o pedidos. Prueba preguntarme “¿cómo me mido?” o “quiero calcular mi talla”.';
  if(/\b(talla|medida|calcular|asistente|estatura|pecho|cintura|cadera)\b/.test(q)) reply='¡Vamos a calcular tu talla! Abre el asistente, ingresa estatura, pecho, cintura y cadera en centímetros, y pulsa “Analizar mis medidas”. Te recomendaré una talla orientativa.';
  else if(/\b(medir|mido|medirme|cinta)\b/.test(q)) reply=FAQ[0][1];
  else if(/\b(vestido|falda)\b/.test(q)){reply='Te llevo a la colección de vestidos para que puedas revisar las opciones.';location.hash='#tienda/vestido'}
  else if(/\b(top|camisa|blusa|polo)\b/.test(q)){reply='Te llevo a la colección de tops y camisas.';location.hash='#tienda/top'}
  else if(/\b(casaca|chaqueta|abrigo)\b/.test(q)){reply='Te llevo a la colección de casacas.';location.hash='#tienda/casaca'}
  else if(/\b(pantal[oó]n|jogger|jean)\b/.test(q)){reply='Te llevo a la colección de pantalones.';location.hash='#tienda/pantalon'}
  else if(/\b(carrito|bolsa|pedido|comprar|compra)\b/.test(q)){reply='Puedes revisar los productos añadidos en tu carrito. Abro la bolsa ahora.';$('#cartb').click()}
  else if(/\b(pago|pagar|yape|plin|tarjeta)\b/.test(q)) reply=FAQ[3][1];
  else if(/\b(cambio|cambiar|devoluci[oó]n)\b/.test(q)) reply=FAQ[1][1];
  else if(/\b(whatsapp|persona|contacto|hablar)\b/.test(q)){reply='Puedes escribirnos por WhatsApp para recibir ayuda personalizada.';window.open('https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent('Hola Smart Fit Cusco, necesito ayuda.'),'_blank','noopener')}
  else if(/\b(hola|buenas|buenos d[ií]as|buenas tardes|buenas noches)\b/.test(q)) reply='¡Hola! Soy Lía, tu guía de Smart Fit Cusco. ¿Buscas una talla, una prenda o ayuda con tu pedido?';
  lb.textContent=reply;lb.classList.add('on');el.classList.add('talk');clearTimeout(hid);hid=setTimeout(function(){lb.classList.remove('on');el.classList.remove('talk')},9000);track('lia_mensaje',q.slice(0,120));
 }
 function drawMenu(){lm.innerHTML='<b>Hola, soy Lía · ¿Qué necesitas?</b><form id="lia-chat" style="display:flex;gap:6px;padding:9px;border-bottom:1px solid var(--line)"><input id="lia-msg" aria-label="Escribe tu pregunta a Lía" placeholder="Escribe tu pregunta…" style="min-width:0;width:100%;padding:9px;border:1px solid #9aaabd;border-radius:8px;color:#14243a;background:#fff;font:13px Arial,sans-serif"><button type="submit" aria-label="Enviar pregunta" style="width:auto;flex-shrink:0;padding:8px 10px;background:#14243a;color:#fff;border-radius:8px">Enviar</button></form><button data-g="#asistente">✦ Calcular mi talla</button><button data-g="#tienda">♧ Explorar toda la tienda</button><button data-cat="vestido">Ver vestidos</button><button data-cat="top">Ver tops y camisas</button><button data-cat="casaca">Ver casacas</button><button data-cat="pantalon">Ver pantalones</button><button data-cart="1">🛍 Abrir mi carrito ('+CART.length+')</button><button data-q="1">Preguntas frecuentes</button><button data-wa="1">Hablar por WhatsApp</button><button data-g="#opinion">Dejar mi opinión</button><button data-m="1">'+(mute?'Activar sugerencias':'Silenciar sugerencias')+'</button>';
  var form=$('#lia-chat'); if(form)form.onsubmit=function(e){e.preventDefault();var input=$('#lia-msg'),q=input.value.trim();if(!q)return;menu=false;lm.classList.remove('on');if(window.LIA_MODA_DEMO){LIA_MODA_DEMO.recomendar(q)}else{answerUser(q)}};
  lm.querySelectorAll('button').forEach(function(b){b.onclick=function(){if(b.dataset.q){drawFaq();return}if(b.dataset.cart){menu=false;lm.classList.remove('on');$('#cartb').click();return}if(b.dataset.cat){menu=false;lm.classList.remove('on');location.hash='#tienda/'+b.dataset.cat;return}if(b.dataset.wa){menu=false;lm.classList.remove('on');window.open('https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+encodeURIComponent('Hola Smart Fit Cusco, necesito ayuda para elegir una prenda.'),'_blank','noopener');return}if(b.dataset.m){mute=!mute;menu=false;lm.classList.remove('on');lb.classList.remove('on');if(!mute)say('¡Aquí estoy de nuevo!');return}menu=false;lm.classList.remove('on');if(b.dataset.g){location.hash=b.dataset.g;say('¡Vamos!')}}})}
 function drawFaq(){lm.innerHTML='<b>Preguntas frecuentes</b>'+FAQ.map(function(f,i){return'<button data-i="'+i+'">'+f[0]+'</button>'}).join('')+'<button data-b="1">← Volver</button>';lm.querySelectorAll('button').forEach(function(b){b.onclick=function(){if(b.dataset.b){drawMenu();return}menu=false;lm.classList.remove('on');track('lia_faq',FAQ[b.dataset.i][0]);say(FAQ[b.dataset.i][1],10000)}})}
 $('#lbtn').onclick=function(){if(window.LIA_MODA_DEMO){LIA_MODA_DEMO.open();return}menu=!menu;lb.classList.remove('on');if(menu){drawMenu();lm.classList.add('on');track('lia_menu')}else lm.classList.remove('on')};
 window.addEventListener('scroll',function(){var y=window.scrollY,d=y-lastY;if(Math.abs(d)>700){if(Date.now()-lastSc>20000){say(d>0?'Veo que estás explorando. ¿Te ayudo a elegir?':'¿Buscabas algo? Puedo ayudarte con tu talla.');lastSc=Date.now()}lastY=y}},{passive:true});
 setTimeout(idle,7000);
 return{say:say,ctx:function(p){if(p=='asistente'){return}cx=p;lastY=0;setTimeout(function(){say((P[p]||P.inicio)[0])},1200)},step:function(n){cx='a'+n;setTimeout(function(){say(pick())},900)}}})();

/* ---------- Favoritos (delegado) y catálogo externo ---------- */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-fav]');if(!b)return;var id=b.dataset.fav,i=FAV.indexOf(id);if(i>-1)FAV.splice(i,1);else{FAV.push(id);track('favorito',byId(id).n);Lia.say('¡Guardada en tus favoritos!')}try{localStorage.setItem('sfc_fav',JSON.stringify(FAV))}catch(x){}document.querySelectorAll('[data-fav="'+id+'"]').forEach(function(x){x.classList.toggle('on',i<0)});var fc=document.querySelector('[data-f="fav"]');if(fc)fc.textContent='♥ Favoritos ('+FAV.length+')';if(location.hash=='#tienda/fav')redo()});
function csvRows(t){var r=[],row=[],c='',q=false;for(var i=0;i<t.length;i++){var ch=t[i];if(q){if(ch=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=ch}else if(ch=='"')q=true;else if(ch==','){row.push(c);c=''}else if(ch=='\n'||ch=='\r'){if(ch=='\r'&&t[i+1]=='\n')i++;row.push(c);c='';if(row.length>1||row[0])r.push(row);row=[]}else c+=ch}if(c||row.length){row.push(c);r.push(row)}return r}
function sinAcento(x){return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
var KALIAS={vestidos:'vestido',top:'top',tops:'top',polo:'top',polos:'top',blusa:'top',blusas:'top',camisas:'camisa',casacas:'casaca',chaqueta:'casaca',chaquetas:'casaca',pantalones:'pantalon',pantalon:'pantalon',shorts:'short',faldas:'falda',accesorios:'accesorio',deportiva:'deportivo','ropa deportiva':'deportivo'};
var BALIAS={'reloj de arena':'reloj',reloj:'reloj',pera:'pera',manzana:'manzana',rectangulo:'rect',rect:'rect','triangulo invertido':'inv',invertido:'inv',inv:'inv'};
function capit(x){x=String(x||'').trim();return x?x.charAt(0).toUpperCase()+x.slice(1).toLowerCase():x}
function numCat(v){var n=parseFloat(String(v||'').replace(/[^\d.,]/g,'').replace(',','.'));return isFinite(n)?n:0}
function rutaFoto(v){v=String(v||'').trim();if(!v)return'';if(/^(https?:)?\/\//i.test(v)||v.indexOf('assets/')==0||v.charAt(0)=='/')return v;return(CFG.CARPETA_FOTOS||'assets/img/catalogo_nuevo/')+v}
function parseCat(t){var r=csvRows(t.replace(/^\uFEFF/,'')),H=r.shift().map(function(x){return sinAcento(x)});return r.map(function(a,i){var o={};H.forEach(function(k,j){o[k]=(a[j]||'').trim()});
 var kk=sinAcento(o.categoria);kk=KALIAS[kk]||kk;var cols=(o.colores||'').split(';').map(capit).filter(Boolean);
 var bs=(o.siluetas||'').split(';').map(function(x){x=sinAcento(x);return BALIAS[x]||x}).filter(function(x){return BODY[x]});if(!bs.length&&o.siluetas)bs=['rect','inv'];
 var g=sinAcento(o.genero);g=(g=='hombre'||g=='mujer')?g:(/^m\d+$/i.test(o.id)?'hombre':'mujer');
 var id=(o.id||'').trim();var foto=rutaFoto(o.imagen||o.foto);if(id){if(foto)IMG[id]=foto;else if(!IMG[id])IMG[id]=(CFG.CARPETA_FOTOS||'assets/img/catalogo_nuevo/')+id+'.webp'}
 return{id:id,k:kk,n:o.nombre,e:o.estilo||'Casual',pr:numCat(o.precio),old:numCat(o.precio_anterior),bd:o.etiqueta,gender:g,b:bs,c:cols,tint:TINT[i%4],mat:o.tela,cu:o.cuidados,description:o.descripcion||'',nuevo:/^(si|1|true|x|nuevo)$/.test(sinAcento(o.nuevo)),stock:parseStock(o.stock_json)}}).filter(function(c){return c.id&&c.n&&KN[c.k]})}
function mergeCatalog(base,remote){var map={},out=[];base.forEach(function(c){map[c.id]=c});remote.forEach(function(c){map[c.id]=c});Object.keys(map).forEach(function(id){out.push(map[id])});if(window.DemoPedidos)DemoPedidos.stock(out);return out}
if(CFG.CATALOGO_URL){try{fetch(CFG.CATALOGO_URL).then(function(r){return r.text()}).then(function(t){var a=parseCat(t);if(a.length){CAT=mergeCatalog(CAT,a);CART=CART.filter(function(x){return byId(x.id)});FAV=FAV.filter(function(x){return byId(x)});cc();route()}}).catch(function(){})}catch(e){}}


/* ---------- Experimento Test Card / Learning Card: reserva premium ---------- */
document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('#premium-open');
 if(!b)return;
 kpi('clic_reserva_premium');
 var box=document.getElementById('premium-box');
 if(box){box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'nearest'});}
});
document.addEventListener('focusin',function(e){
 var f=e.target&&e.target.closest&&e.target.closest('#premium-form');
 if(!f)return;
 try{if(sessionStorage.getItem('sfc_premium_form_ini'))return;sessionStorage.setItem('sfc_premium_form_ini','1')}catch(x){}
 kpi('formulario_iniciado');
});
document.addEventListener('submit',function(e){
 var f=e.target;
 if(!f||f.id!=='premium-form')return;
 e.preventDefault();
 var d=new FormData(f), nombre=(d.get('nombre')||'').toString().trim(),
     telefono=(d.get('telefono')||'').toString().trim(),
     talla=(d.get('talla')||'').toString().trim().toUpperCase();
 if(nombre.length<2||telefono.replace(/\D/g,'').length<7||['XS','S','M','L','XL','2XL','3XL','4XL','5XL'].indexOf(talla)<0){
  var result0=document.getElementById('premium-result');
  if(result0)result0.textContent='Completa tu nombre, un WhatsApp válido y selecciona una talla.';
  return;
 }
 if(!CFG.ENDPOINT){var resultCfg=document.getElementById('premium-result');if(resultCfg)resultCfg.textContent='El registro de pre-reservas aún no está configurado. Inténtalo más tarde.';return;}
 var rid='R'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
 var meta={reserva_id:rid,modalidad:'Coordinar por WhatsApp',talla:talla,detalle:'Pre-reserva Test Card 2; no representa pago confirmado',precio_original:120,descuento:12,precio_final:108,envio_gratis:'Sí'};
 kpi('formulario_completado',meta);
 kpi('intencion_modalidad',meta);
 kpi('reserva_completada',Object.assign({},meta,{cliente:nombre,nombre:nombre,telefono:telefono,producto:'Prenda premium en validación',precio:108}));
 var result=document.getElementById('premium-result');
 if(result)result.textContent='Abriremos WhatsApp para que coordines tu pre-reserva con Smart Fit Cusco. La solicitud no es una compra ni implica un cobro.';
 var msg='Hola Smart Fit Cusco. Quiero realizar mi pre-reserva de la prenda premium.%0A%0ANombre: '+encodeURIComponent(nombre)+'%0AWhatsApp: '+encodeURIComponent(telefono)+'%0ATalla: '+encodeURIComponent(talla)+'%0APrecio regular: S/ 120.00%0ADescuento 10%: -S/ 12.00%0APrecio reservado: S/ 108.00%0AEnvío: GRATIS%0ACódigo de pre-reserva: '+encodeURIComponent(rid)+'%0AEntiendo que esta solicitud no es un pago confirmado.';
 var url='https://wa.me/'+(CFG.WHATSAPP||'51938703934')+'?text='+msg;
 window.open(url,'_blank','noopener');
 f.reset();
});
try{
 if(!sessionStorage.getItem('sfc_premium_landing_seen')){
  sessionStorage.setItem('sfc_premium_landing_seen','1');
  kpi('visitante_landing');
 }
}catch(e){}


/* ============================================================
   PASO 5 — LÍA, ASESORA DE MODA (DEMO LOCAL, SIN API EXTERNA)
   Usa CAT/IMG/stockOf/CART/cc existentes. No crea otro carrito.
   ============================================================ */
(function(){
 'use strict';
 window.SMARTFIT_LIA_CONFIG=window.SMARTFIT_LIA_CONFIG||{MODO_DEMO:true,PROVEEDOR_IA:null};
 window.SMARTFIT_LIA_CONFIG.MODO_DEMO=true;
var DEMO_MODE=window.SMARTFIT_LIA_CONFIG.MODO_DEMO, selectedPhotoUrl='', lastResults=[];
 var LIA_WORKER_URL='https://mi-tienda-ia.61239578.workers.dev/';
 function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])})}
 function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
 function getAvailableSize(c,preferred){
   if(preferred){return stockOf(c,preferred)>0?preferred:null}
   for(var i=0;i<SIZES.length;i++){var z=SIZES[i].t;if(stockOf(c,z)>0)return z}
   return null;
 }
 function styleFor(q){
   q=norm(q);
   if(/elegant|formal|oficina|evento|reunion/.test(q))return'elegante';
   if(/deport|gym|gimnasio/.test(q))return'deportivo';
   if(/urbano|street|oversize/.test(q))return'urbano';
   if(/minimal/.test(q))return'minimalista';
   if(/casual|universidad|diario|fin de semana|salida/.test(q))return'casual';
   return'';
 }
 function genderFor(q,chosen){q=norm(q);if(/hombre|masculin/.test(q))return'hombre';if(/mujer|femenin/.test(q))return'mujer';return chosen||'mujer'}
 function colorFor(q){var colors=['negro','blanco','azul','crema','verde','rojo','terracota','gris','mostaza','beige'];for(var i=0;i<colors.length;i++)if(norm(q).indexOf(colors[i])>-1)return colors[i];return''}
 function occasionFor(q){q=norm(q);if(/universidad|clase/.test(q))return'universidad';if(/trabajo|oficina|reunion/.test(q))return'trabajo';if(/fiesta|evento|elegante/.test(q))return'evento';if(/fin de semana|salida|paseo/.test(q))return'salida';return'uso diario'}
 function productMatches(c,filters){
   if(c.gender!==filters.gender)return false;
   if(filters.size&&!getAvailableSize(c,filters.size))return false;
   if(!filters.size&&!SIZES.some(function(z){return stockOf(c,z.t)>0}))return false;
   if(filters.budget>0&&Number(c.pr)>filters.budget)return false;
   if(filters.color&&!(c.c||[]).some(function(x){return norm(x)===filters.color}))return false;
   if(filters.avoidColor&&(c.c||[]).some(function(x){return norm(x)===filters.avoidColor}))return false;
   if(filters.category&&!(c.k===filters.category||(filters.category==='top'&&c.k==='camisa')))return false;
   if(filters.style){
     var s=norm((c.e||'')+' '+(c.n||'')+' '+(c.description||''));
     if(filters.style==='elegante'&&!/eleg|formal|clasico|sastre|blazer/.test(s))return false;
     if(filters.style==='urbano'&&!/urban|oversize|cargo|street|bomber/.test(s))return false;
     if(filters.style==='deportivo'&&!/deport|sport|hoodie|polera/.test(s))return false;
     if(filters.style==='minimalista'&&!/minimal|basico|liso|clasico/.test(s))return false;
     if(filters.style==='casual'&&!/casual|basico|polo|camisa|jean|fluido/.test(s))return false;
   }
   return Number(c.pr)>0;
 }
 function reason(c,f){
   var a=[];
   if(f.named)a.push('es la prenda que pediste');if(f.style)a.push('su estilo '+f.style);
   if(f.color)a.push('el color '+f.color);
   if(f.avoidColor)a.push('evita el color '+f.avoidColor);
   if(f.size)a.push('tiene stock confirmado en talla '+f.size);
   if(!f.size)a.push('registra al menos una talla con stock confirmado');
   if(f.budget)a.push('está dentro de tu presupuesto');
   return a.length?'La incluimos porque '+a.join(', ')+'.':'Coincide con tu sección y tiene precio y disponibilidad registrados.';
 }
 function productCard(c,f){
   var sz=getAvailableSize(c,f.size),stock=sz?stockOf(c,sz):0,photo=IMG[c.id]||'';
   return '<article class="lia5-product"><div class="lia5-product-img">'+(photo?'<img src="'+esc(photo)+'" alt="'+esc(c.n)+'" loading="lazy" onerror="this.style.display=\'none\'">':'<span>Imagen no disponible</span>')+'</div><div class="lia5-product-info"><b>'+esc(c.n)+'</b><small>'+esc(KN[c.k]||c.k)+' · '+esc(c.e||'Estilo por confirmar')+'</small><strong>'+(Number(c.pr)>0?'S/ '+Number(c.pr).toFixed(2):'Precio por confirmar')+'</strong><small>'+(sz?'Talla '+esc(sz)+' · '+stock+' disponible(s)':'Stock por talla pendiente de confirmar')+'</small><p>'+esc(reason(c,f))+'</p><div class="lia5-actions"><a href="#producto/'+encodeURIComponent(c.id)+'" data-lia5-view="'+esc(c.id)+'">Ver producto</a><button type="button" data-lia5-add="'+esc(c.id)+'" '+(!sz?'disabled title="No hay stock verificable"':'')+'>Añadir al carrito</button></div></div></article>';
 }
 function stem(t){return norm(t).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean).map(function(w){return w.length>3?w.replace(/s$/,''):w}).join(' ')}
 function namedProducts(q){var sq=' '+stem(q)+' ';return CAT.filter(function(c){var w=stem(c.n).split(' ').filter(function(x){return x.length>2&&['con','sin','del'].indexOf(x)<0});return w.length>1&&w.every(function(x){return sq.indexOf(' '+x+' ')>-1})})}
 function recommend(q,ui){
   var gender=genderFor(q,ui.gender.value),style=styleFor(q)||ui.style.value,color=colorFor(q)||norm(ui.color.value),budget=Number(ui.budget.value)||0,size=ui.size.value;
   var cat='',nq=norm(q);
   if(/pantalon|jean/.test(nq))cat='pantalon';else if(/camisa|blusa|polo|top/.test(nq))cat='top';else if(/vestido/.test(nq))cat='vestido';else if(/casaca|chaqueta|blazer/.test(nq))cat='casaca';else if(/short/.test(nq))cat='short';else if(/falda/.test(nq))cat='falda';
   var avoid=norm(ui.avoid.value)||(/no quiero|evita|sin /.test(nq)?colorFor(q):'');
   if(avoid&&avoid===color)color='';
   var f={gender:gender,style:style,color:color,avoidColor:avoid,budget:budget,size:size,category:cat};
   var named=namedProducts(q);var byG=named.filter(function(c){return c.gender===gender});if(byG.length)named=byG;f.named=named.length>0;
   var list=named.length?named.filter(function(c){return productMatches(c,Object.assign({},f,{gender:c.gender,category:'',style:''}))}):CAT.filter(function(c){return productMatches(c,f)});
   list.sort(function(a,b){
     var an=norm(a.n+' '+a.e+' '+a.description),bn=norm(b.n+' '+b.e+' '+b.description);
     var scoreA=(style&&an.indexOf(style)>-1?3:0)+(color&&(a.c||[]).some(function(x){return norm(x)===color})?2:0)+(a.nuevo?1:0);
     var scoreB=(style&&bn.indexOf(style)>-1?3:0)+(color&&(b.c||[]).some(function(x){return norm(x)===color})?2:0)+(b.nuevo?1:0);
     return scoreB-scoreA||a.pr-b.pr;
   });
   return{filters:f,products:list.slice(0,8)};
 }
 function open(){
   var panel=document.getElementById('lia5-panel');if(!panel)return;
   panel.classList.add('on');panel.setAttribute('aria-hidden','false');
   var input=document.getElementById('lia5-question');if(input)input.focus();
 }
 function close(){var p=document.getElementById('lia5-panel');if(p){p.classList.remove('on');p.setAttribute('aria-hidden','true')}if(selectedPhotoUrl){URL.revokeObjectURL(selectedPhotoUrl);selectedPhotoUrl='';var preview=document.getElementById('lia5-photo-preview'),file=document.getElementById('lia5-photo-input');if(preview)preview.innerHTML='';if(file)file.value=''}}
function message(text,kind){var log=document.getElementById('lia5-log');if(!log)return;var el=document.createElement('div');el.className='lia5-msg '+(kind||'bot');el.textContent=text;log.appendChild(el);log.scrollTop=log.scrollHeight;return el}
 function renderResults(q){
   var ui={gender:document.getElementById('lia5-gender'),style:document.getElementById('lia5-style'),color:document.getElementById('lia5-color'),budget:document.getElementById('lia5-budget'),size:document.getElementById('lia5-size'),avoid:document.getElementById('lia5-avoid')};
   var r=recommend(q,ui);lastResults=r.products;
   var out=document.getElementById('lia5-results');
   var title=r.products.length?'Estas son las coincidencias verificables del catálogo':'No encontré productos que cumplan todos los filtros con stock confirmado.';
   out.innerHTML='<h4>'+esc(title)+'</h4><p class="lia5-explain">Productos del catálogo cargado, filtrados por tus preferencias. '+(r.filters.size?'Se exigió stock positivo en talla '+esc(r.filters.size)+'.':'Solo se muestran prendas con al menos una talla cuyo stock sea mayor que cero.')+'</p>'+r.products.map(function(c){return productCard(c,r.filters)}).join('');
   if(!r.products.length)out.innerHTML+='<p class="lia5-explain">Puedes quitar el filtro de talla, color o presupuesto, o consultar con la tienda si el inventario todavía no está sincronizado.</p>';
   message(r.products.length?'Encontré '+r.products.length+' opción(es) que cumplen los datos disponibles. Revisa las tallas y el stock antes de añadir.':'Por ahora no hay coincidencias con stock verificable. No voy a inventar disponibilidad.','bot');
 }
 function outfit(q){
   var ui={gender:document.getElementById('lia5-gender'),style:document.getElementById('lia5-style'),color:document.getElementById('lia5-color'),budget:document.getElementById('lia5-budget'),size:document.getElementById('lia5-size'),avoid:document.getElementById('lia5-avoid')};
   var r=recommend(q,ui),pairFilters=r.filters,tops=r.products.filter(function(c){return ['top','camisa'].indexOf(c.k)>-1}),bottoms=r.products.filter(function(c){return ['pantalon','short','falda'].indexOf(c.k)>-1});
   /* El estilo es una preferencia suave al formar conjuntos: si falta una pieza,
      ampliar solo ese criterio, manteniendo sección, talla, color y presupuesto. */
   if(!tops.length||!bottoms.length){
     var relaxed=Object.assign({},r.filters,{style:''});pairFilters=relaxed;
     var broad=CAT.filter(function(c){return productMatches(c,relaxed)});
     tops=broad.filter(function(c){return ['top','camisa'].indexOf(c.k)>-1});
     bottoms=broad.filter(function(c){return ['pantalon','short','falda'].indexOf(c.k)>-1});
   }
   var pair=[];
   for(var ti=0;ti<tops.length&&!pair.length;ti++){
     for(var bi=0;bi<bottoms.length;bi++){
       var total=Number(tops[ti].pr)+Number(bottoms[bi].pr);
       if(!r.filters.budget||total<=r.filters.budget){pair=[tops[ti],bottoms[bi]];break}
     }
   }
   if(!pair.length){message('Puedo sugerir un outfit cuando el catálogo tenga una parte superior y una inferior con precio y stock confirmados, y el conjunto respete tu presupuesto.','bot');renderResults(q);return}
   var html='<h4>Outfit sugerido · '+esc(occasionFor(q))+'</h4><p class="lia5-explain">Conjunto armado con dos productos reales del catálogo y stock confirmado. </p>'+pair.map(function(c){return productCard(c,pairFilters)}).join('')+'<button class="lia5-add-set" type="button" data-lia5-set="'+pair.map(function(c){return esc(c.id)}).join(',')+'">Añadir conjunto al carrito</button>';
   document.getElementById('lia5-results').innerHTML=html;lastResults=pair;
   message('Te propongo una combinación de '+pair[0].n+' con '+pair[1].n+'. Puedes agregarlas juntas o por separado.','bot');
 }
 async function send(q){
   q=String(q||'').trim();if(!q)return;
   message(q,'user');var ui={gender:document.getElementById('lia5-gender'),style:document.getElementById('lia5-style'),color:document.getElementById('lia5-color'),budget:document.getElementById('lia5-budget'),size:document.getElementById('lia5-size'),avoid:document.getElementById('lia5-avoid')};
   var nq=norm(q);
   if(/foto|fotografia|imagen/.test(nq)){message('En esta versión puedo mostrar una vista previa local de tu imagen, pero no analizo visualmente cuerpos ni envío la fotografía a servidores. Describe qué prenda o estilo buscas y te recomendaré productos del catálogo.','bot');return}
   if(/color.*combina|combina.*color/.test(nq)){message('Como orientación general de estilo, el negro combina fácilmente con blanco, crema, gris, azul y tonos tierra. Si quieres, puedo buscar prendas de esos colores que tengan stock registrado.','bot');}
   if(/outfit|conjunto|combina|look/.test(nq)){outfit(q);return}
   var pensando=message('Pensando...','bot');
   try{
     var ctrl=new AbortController();var tmr=setTimeout(function(){ctrl.abort()},20000);
     var r=await fetch(LIA_WORKER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mensaje:q.slice(0,500)}),signal:ctrl.signal});
     var data=await r.json();clearTimeout(tmr);
     if(pensando)pensando.textContent=data.respuesta||'No pude responder ahora. Te muestro igual algunas prendas del catálogo.';
   }catch(e){if(pensando)pensando.textContent='No pude conectarme con el asistente de IA en este momento. Te muestro algunas prendas del catálogo.'}
   renderResults(q);
 }
 function addProduct(id,from){
   var c=byId(id);if(!c){toast('El producto ya no está disponible en el catálogo cargado.');return}
   var size=getAvailableSize(c,document.getElementById('lia5-size').value);
   if(!size){toast('No hay stock confirmado para añadir esta prenda.');return}
   if(cartCount(c.id,size)>=stockOf(c,size)){toast('Se alcanzó el stock disponible de esa talla.');return}
   CART.push({id:c.id,col:(c.c&&c.c[0])||'Negro',sz:size,qty:1});cc();track('lia5_anadir_carrito',c.n);
   toast('Añadido al carrito: '+c.n+' · '+size);
 }
 function addSet(ids){
   var list=ids.split(',').map(byId).filter(Boolean),sizeBy=[];
   for(var i=0;i<list.length;i++){var s=getAvailableSize(list[i],document.getElementById('lia5-size').value);if(!s||cartCount(list[i].id,s)>=stockOf(list[i],s)){toast('No se añadió el conjunto: falta stock confirmado en una de las prendas.');return}sizeBy.push(s)}
   list.forEach(function(c,i){CART.push({id:c.id,col:(c.c&&c.c[0])||'Negro',sz:sizeBy[i],qty:1})});cc();track('lia5_outfit_carrito',list.map(function(c){return c.n}).join(' + '));toast('Conjunto añadido al carrito.');
 }
 function build(){
   if(document.getElementById('lia5-panel'))return;
   var host=document.getElementById('lia');
   var launcher=document.createElement('button');launcher.type='button';launcher.id='lia5-launch';launcher.className='lia5-launch';launcher.textContent='✦ Asesora de moda';launcher.setAttribute('aria-label','Abrir LÍA, asesora de moda');launcher.onclick=open;
   if(host)host.appendChild(launcher);
   var panel=document.createElement('section');panel.id='lia5-panel';panel.className='lia5-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','lia5-title');panel.setAttribute('aria-hidden','true');
   panel.innerHTML='<div class="lia5-head"><div><span>SMART FIT CUSCO</span><h3 id="lia5-title">LÍA · Asesora de moda</h3><small>Asesora con IA · catálogo real</small></div><button type="button" id="lia5-close" aria-label="Cerrar ventana" title="Cerrar">×</button></div><div class="lia5-body"><div id="lia5-log" class="lia5-log"><div class="lia5-msg bot">¡Hola! Soy LÍA, tu asesora de moda de SMART FIT CUSCO. Puedo ayudarte a descubrir prendas, colores y conjuntos usando el catálogo disponible. Respondo con inteligencia artificial y te muestro prendas reales del catálogo.</div></div><details class="lia5-filtros"><summary>⚙ Filtros (opcional)</summary><div class="lia5-controls"><label>Sección<select id="lia5-gender"><option value="mujer">Mujer</option><option value="hombre">Hombre</option></select></label><label>Estilo<select id="lia5-style"><option value="">Cualquiera</option><option value="casual">Casual</option><option value="elegante">Elegante / formal</option><option value="urbano">Urbano / oversize</option><option value="deportivo">Deportivo</option><option value="minimalista">Minimalista</option></select></label><label>Color preferido<select id="lia5-color"><option value="">Cualquiera</option>'+['Negro','Blanco','Azul','Crema','Verde','Terracota','Gris','Mostaza'].map(function(x){return'<option>'+x+'</option>'}).join('')+'</select></label><label>Presupuesto máximo (S/)<input id="lia5-budget" type="number" min="0" step="1" placeholder="Sin límite"></label><label>Talla (opcional)<select id="lia5-size"><option value="">Cualquier talla con stock confirmado</option>'+SIZES.map(function(z){return'<option>'+z.t+'</option>'}).join('')+'</select></label><label>Color que deseas evitar<select id="lia5-avoid"><option value="">Ninguno</option>'+['Negro','Blanco','Azul','Crema','Verde','Terracota','Gris','Mostaza'].map(function(x){return'<option>'+x+'</option>'}).join('')+'</select></label></div></details><div class="lia5-atajos"><button type="button" data-lia5-go="#colorimetria">🎨 Colorimetría</button><button type="button" data-lia5-go="#tienda/vestido">👗 Vestidos</button><button type="button" data-lia5-cart="1">🛍 Mi carrito</button><button type="button" data-lia5-wa="1">💬 WhatsApp</button></div><div class="lia5-suggestions"><button type="button" data-lia5-prompt="Quiero un outfit casual para una salida">Outfit casual</button><button type="button" data-lia5-prompt="Quiero un outfit elegante">Outfit elegante</button><button type="button" data-lia5-prompt="Recomiéndame ropa oversize para hombre">Oversize hombre</button><button type="button" data-lia5-prompt="Recomiéndame prendas negras para mujer">Prendas negras</button></div><form id="lia5-form" class="lia5-form"><input id="lia5-question" maxlength="300" placeholder="¿Qué look o prenda buscas?" autocomplete="off"><button type="submit">Enviar</button></form><div class="lia5-photo"><label for="lia5-photo-input">Vista previa de fotografía (opcional)</label><input id="lia5-photo-input" type="file" accept="image/jpeg,image/png,image/webp"><small>La imagen solo se previsualiza en este dispositivo. No se sube ni se envía a ningún servicio.</small><div id="lia5-photo-preview"></div></div><div id="lia5-results" class="lia5-results"></div></div><footer class="lia5-foot">Demo universitaria · No escribas datos personales · Sin stock confirmado no se puede añadir</footer>';
   document.body.appendChild(panel);
   document.getElementById('lia5-close').onclick=close;
   document.getElementById('lia5-form').onsubmit=function(e){e.preventDefault();var x=document.getElementById('lia5-question');send(x.value);x.value=''};
   panel.querySelectorAll('[data-lia5-prompt]').forEach(function(b){b.onclick=function(){send(b.getAttribute('data-lia5-prompt'))}});
   document.getElementById('lia5-photo-input').onchange=function(){
     var f=this.files&&this.files[0],preview=document.getElementById('lia5-photo-preview');
     if(selectedPhotoUrl){URL.revokeObjectURL(selectedPhotoUrl);selectedPhotoUrl=''}
     preview.innerHTML='';
     if(!f)return;
     if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>5*1024*1024){this.value='';preview.textContent='Selecciona JPG, PNG o WEBP de máximo 5 MB.';return}
     selectedPhotoUrl=URL.createObjectURL(f);
     var img=document.createElement('img');img.alt='Vista previa local de la fotografía';img.src=selectedPhotoUrl;preview.appendChild(img);
   };
   panel.addEventListener('click',function(e){
     var go=e.target.closest('[data-lia5-go]');if(go){close();location.hash=go.getAttribute('data-lia5-go');return}var ct=e.target.closest('[data-lia5-cart]');if(ct){close();document.getElementById('cartb').click();return}var wa=e.target.closest('[data-lia5-wa]');if(wa){window.open('https://wa.me/'+(CFG.WHATSAPP||'51944182573')+'?text='+encodeURIComponent('Hola Smart Fit Cusco, necesito ayuda para elegir una prenda.'),'_blank','noopener');return}var add=e.target.closest('[data-lia5-add]');if(add){addProduct(add.getAttribute('data-lia5-add'),add);return}
     var set=e.target.closest('[data-lia5-set]');if(set){addSet(set.getAttribute('data-lia5-set'));return}
     var view=e.target.closest('[data-lia5-view]');if(view){close();location.hash='#producto/'+view.getAttribute('data-lia5-view')}
   });
   document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
 window.LIA_MODA_DEMO={open:open,close:close,recomendar:function(q){open();send(q)},modoDemo:DEMO_MODE};
})();

/* Cierre genérico de ventanas emergentes (.ov): clic en el fondo oscuro o tecla Escape.
   Corrige overlays que solo se podían cerrar con su botón interno (p. ej. "Tu opinión"). */
document.addEventListener('click',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('ov'))e.target.remove()});
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var ovs=document.querySelectorAll('.ov');if(ovs.length)ovs[ovs.length-1].remove()});

if(window.DemoPedidos)DemoPedidos.init(PG);
cc();
route();
