# SMART FIT CUSCO — Informe de pruebas del PASO 6 (Probador virtual, MODO DEMO)

**Resultado de la batería automática en Chromium real: 59/59 comprobaciones aprobadas.**
Scripts y resultados: `pruebas_paso6/` (`probar_paso6.js`, `resultados.json`). Se ejecutó sobre `index.html` abierto desde disco (`file://`), con escritorio 1280×900 y móvil emulado 390×800 con pantalla táctil.

## Las 20 pruebas obligatorias

| # | Prueba | Resultado |
|---|---|---|
| 1 | Abrir el probador | APROBADA |
| 2 | Foto JPG | APROBADA |
| 3 | Foto PNG | APROBADA |
| 4 | Foto WEBP | APROBADA |
| 5 | Rechazar formatos no permitidos | APROBADA (.txt, .gif, imagen de 18 MB, y un “.jpg” falso que no es imagen; el mensaje de error es claro y la foto anterior se conserva) |
| 6 | Vista previa | APROBADA (URL `blob:` local) |
| 7 | Cambiar la fotografía | APROBADA |
| 8 | Eliminar la fotografía | APROBADA (y la URL temporal queda revocada) |
| 9 | Prenda femenina | APROBADA (la lista solo contiene `mujer`) |
| 10 | Prenda masculina | APROBADA (la lista solo contiene `hombre`) |
| 11 | Cambiar de producto | APROBADA |
| 12 | Consultar tallas | APROBADA (9 tallas con estado: disp., agotada, no ofrecida) |
| 13 | Comprobar disponibilidad | APROBADA (coincide con `stockOf`; tallas agotadas no seleccionables; no se supera el stock; prenda totalmente agotada y producto inexistente rechazados) |
| 14 | Añadir al carrito | APROBADA (cambia `CART`, el contador y `sfc_cart`) |
| 15 | El precio coincide con el catálogo | APROBADA |
| 16 | No se envían fotos a servicios externos | APROBADA (ver nota) |
| 17 | LÍA y el probador sin conflictos | APROBADA |
| 18 | Interfaz en móvil | APROBADA en emulación (ver límites) |
| 19 | Funcionalidades originales | APROBADA parcialmente (ver límites) |
| 20 | Ningún archivo original desaparecido | APROBADA (ver `INVENTARIO_PASO_6.md`) |

**Nota prueba 16.** Seleccionar, cambiar y eliminar fotos y elegir prendas genera **cero** peticiones de red. Ninguna petición contiene `blob:`, `data:image`, bytes de imagen ni nombres de archivo. Las únicas peticiones externas son los eventos de analítica que la tienda ya enviaba a Apps Script (`probador6_abrir`, `probador6_anadir_carrito`, con el nombre de la prenda) y las propias de la tienda al cargar (visita y catálogo). La foto tampoco aparece en `localStorage`/`sessionStorage`.

**Otras comprobaciones incluidas:** aviso de simulación y de “no garantiza el ajuste”; filtros por categoría, color y texto; historial “Probadas”; LÍA: “Quiero probar una chaqueta negra” abre el probador con una casaca real con tallas disponibles, responde una sola vez, “Volver a LÍA” funciona, las preguntas normales siguen funcionando, y un pedido sin producto (“vestido rojo para hombre”) no inventa nada ni abre el probador; botón en la ficha de producto y “Ver en la tienda”; `STOCK_DEMO: false` desactiva los datos de ejemplo (ninguna prenda queda comprable, como en el Paso 5).

## Problema encontrado y corregido (era del Paso 5)
El botón **✦ Asesora de moda** de LÍA **no se podía pulsar** en un navegador real: `#lia` tiene `pointer-events:none` y el botón lo heredaba, así que el clic atravesaba el botón. Confirmado sobre el ZIP original del Paso 5 sin mis cambios. Se corrigió con una regla en `assets/probador-virtual.css` (sin tocar `style.css`). El informe del Paso 5 no lo detectó porque no pudo probar en navegador.

## Qué NO se pudo verificar
- **Google Sheets / Apps Script en vivo:** este entorno no tiene internet. La tienda intentó cargar el catálogo remoto y falló como se esperaba; se probó con el catálogo incluido en `app.js`. Cuando publiques, comprueba que `stock_json` en la hoja tenga cantidades reales (o deja `STOCK_DEMO: true` solo para pruebas).
- **Dispositivos móviles reales:** solo emulación de Chromium (viewport, táctil). Falta una prueba en tu teléfono, especialmente el selector de fotos de iOS/Android.
- **Navegadores distintos de Chromium** (Safari, Firefox): no probados.
- **Regresión completa de pasos 1–4:** se comprobó que tienda, asistente de tallas, ficha de producto, carrito y las demás páginas cargan sin errores JavaScript; **no** se recorrió el flujo completo de pedido, adelanto del 50 % ni seguimiento.
- **Publicación en GitHub Pages:** probado desde `file://`; las rutas son relativas, pero confirma tras publicar.

## Aviso sobre el stock de ejemplo
Con `STOCK_DEMO: true`, la tienda completa (fichas, LÍA, probador) muestra cantidades inventadas en las prendas sin `stock_json`. LÍA sigue diciendo “stock confirmado” en sus textos del Paso 5; en su cabecera se añadió “· stock de ejemplo” para que no se confunda. Desactiva `STOCK_DEMO` antes de vender.
