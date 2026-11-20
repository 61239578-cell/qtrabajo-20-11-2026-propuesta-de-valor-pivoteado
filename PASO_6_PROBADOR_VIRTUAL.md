# SMART FIT CUSCO — PASO 6: Probador virtual (MODO DEMO)

## Qué es
Un probador que se abre sobre la tienda y se conecta con el catálogo, las tallas, el carrito y LÍA existentes. **No usa IA real**: muestra tu foto, la prenda del catálogo y una *vista de demostración* claramente rotulada como simulación. Todo ocurre en tu navegador.

## Cómo activarlo / desactivarlo
Todo se controla en `assets/probador-config.js`:

| Opción | Valor actual | Qué hace |
|---|---|---|
| `MODO_DEMO` | `true` (el módulo lo fuerza) | Sin IA real, sin llamadas externas con la foto |
| `STOCK_DEMO` | `true` | Rellena un stock **de ejemplo** a las prendas cuyo `stock_json` está vacío |
| `TAM_MAX_MB` | `5` | Tamaño máximo de la foto |
| `CANTIDAD_MAX` | `5` | Máximo de unidades por línea |
| `MOTOR_VTO` | `null` | Reservado para el motor real futuro |

**Importante:** con `STOCK_DEMO: true` los números de stock son inventados (siempre los mismos para cada prenda) y se ven en toda la tienda, no solo en el probador. Sirven para probar el flujo. **Antes de vender de verdad, ponlo en `false`** y completa `stock_json` en la hoja `Catalogo`. Las prendas que ya tengan `stock_json` real nunca se tocan.

El stock de ejemplo se reparte así: tallas M a 5XL casi siempre ofrecidas (algunas agotadas), XS/S solo en algunas prendas, y una de cada 11 prendas queda agotada por completo para probar ese caso.

## Cómo usarlo
1. Botón **👗 Probador virtual** (junto a LÍA, abajo a la derecha), o **Probador virtual (demo)** en cualquier ficha de producto, o desde LÍA (ver abajo).
2. **Seleccionar fotografía** (JPG, JPEG, PNG o WEBP, hasta 5 MB). Puedes cambiarla o eliminarla.
3. Elige prenda: filtros de sección, categoría, color, búsqueda y “solo con tallas disponibles”.
4. Elige color, talla y cantidad; **Añadir al carrito**, **Ver en la tienda**, **Abrir carrito** o **Calcular mi talla con el asistente**.
5. En la vista de demostración puedes activar un **montaje ilustrativo** (la foto de la prenda sobre tu foto, con tamaño y posición ajustables). Está rotulado y no se adapta al cuerpo.

## Integración con LÍA (sin crear otro chatbot)
- En el chat de LÍA escribe, por ejemplo, “Quiero probar una chaqueta negra” (o usa el botón sugerido). LÍA busca en el catálogo real; si existe y tiene tallas disponibles, abre el probador con esa prenda. Si no existe, lo dice y no inventa nada.
- Cada tarjeta de LÍA tiene el botón **Probar virtualmente**.
- Desde el probador, **← Volver a LÍA** reabre el asesor.
- Las demás preguntas de LÍA funcionan igual que en el Paso 5.

## Privacidad
- La foto se lee con `URL.createObjectURL`; no se sube ni se envía a ningún servidor, no pasa por Google Drive/Sheets/Apps Script y no se guarda en `localStorage`/`sessionStorage`.
- Se revoca la referencia al eliminar la foto, al cambiarla y al cerrar el probador.
- Validación de tipo (JPG/PNG/WEBP), tamaño y que el navegador pueda decodificar la imagen (un `.jpg` falso se rechaza).
- El módulo no usa `fetch`, `XMLHttpRequest` ni `sendBeacon`. Lo único que sale a Apps Script son los eventos de analítica que la tienda ya enviaba (`track`): `probador6_abrir` y `probador6_anadir_carrito` con el nombre de la prenda, **nunca la foto**.

## Arquitectura (todo en `assets/probador-virtual.js`)
| Módulo | Responsabilidad |
|---|---|
| Config | Lee `probador-config.js`; fuerza `MODO_DEMO` |
| DatosDemo | Stock de ejemplo reproducible por id |
| Fotos | Validación, vista previa local, revocación |
| Catalogo | Lee `CAT`/`IMG`/`KN`/`COL` existentes; no duplica productos |
| Tallas | Usa `SIZES`, `stockOf` y `cartCount` existentes |
| MotorDemo | Textos de simulación y estado de carga (no procesa la imagen) |
| AdaptadorVTO | Contrato para un motor real futuro (hoy sin motor, nunca invocado) |
| Resultados | Historial “Probadas” solo en memoria |
| Carrito | Valida producto, precio, talla y stock y hace `CART.push` + `cc()` existentes |
| Interfaz / IntegracionLIA | Panel, filtros, botón en ficha de producto, enlace con LÍA |

El precio nunca se toma de la pantalla: se lee de `CAT` en el momento de añadir. No se tocan tablas de medidas, adelanto del 50 %, seguimiento de pedidos ni precios.

## Cómo se conectará la IA real (etapa futura)
1. **Backend propio** (p. ej. Cloud Run, Supabase Functions o un servidor Node) que reciba la foto solo con **consentimiento explícito** y límites de uso (autenticación, rate limit).
2. **Motor de Virtual Try-On** detrás de ese backend (modelo de try-on por difusión, servicio comercial o GPU propia). Las **claves y credenciales viven solo en el servidor**, nunca en `config.js` ni en el navegador.
3. El backend valida producto, precio y stock contra el catálogo del servidor y devuelve una imagen.
4. En el frontend: registrar un motor con `PROBADOR_VIRTUAL.adaptadorVTO.registrar({id, nombre, probar(fotoBlob, producto, opciones) → Promise<{imagenUrl, aviso}>})`, poner `MODO_DEMO` en `false` (hoy el módulo lo fuerza a `true`: habría que quitar ese forzado en `probador-virtual.js`), añadir casilla de consentimiento y un aviso de que el resultado es generado.
5. Mantener siempre el aviso: la visualización no garantiza el ajuste físico.
6. Revisar costos, política de privacidad y retención (borrado inmediato de la foto en el servidor).

## Archivos del Paso 6
- **Nuevos:** `assets/probador-config.js`, `assets/probador-virtual.js`, `assets/probador-virtual.css`, `PASO_6_PROBADOR_VIRTUAL.md`, `PRUEBAS_PASO_6.md`, `INVENTARIO_PASO_6.md`, `backup/smartfit_cusco_backup_antes_paso6.zip`, `pruebas_paso6/` (scripts y resultados).
- **Modificado (1):** `index.html` — se añadieron 1 enlace CSS y 2 etiquetas `<script>` (carga de los archivos nuevos). Nada más.
