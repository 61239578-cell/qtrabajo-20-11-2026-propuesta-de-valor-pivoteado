# Paso 2 — Ampliación del catálogo a 60 modelos

## Resultado de la ampliación
- Catálogo original conservado: 39 productos (21 femeninos, 18 masculinos).
- Nuevos productos: 21 (12 femeninos, 9 masculinos).
- Total local: 60 modelos (33 femeninos, 27 masculinos).
- IDs nuevos: nf01–nf12 y nh01–nh09.

## Coincidencias revisadas
Se detectaron coincidencias o similitudes con productos actuales. Para conservar los 21 cupos sin duplicar modelos, se usaron alternativas diferenciadas:
- `Polo básico ajustado` se sustituyó por `Polo ribbed de manga corta`, porque ya existe `Polo básico` (b2).
- `Chaqueta bomber` se sustituyó por `Chaqueta varsity`, porque ya existe `Bomber urbana` (c5).
- `Polo clásico premium` se sustituyó por `Polo de punto texturizado`, porque ya existe `Polo premium` (m7).
- `Camisa a cuadros` se sustituyó por `Camisa de rayas verticales`, porque ya existe `Camisa a cuadros` (m14).
- `Top de manga larga` se diferenció como `Body ajustado de manga larga`, para no repetir la `Blusa manga larga` (b5).
- `Blusa de cuello mao elegante` se diferencia de la `Blusa fluida` existente por su cuello y construcción.
- `Polo oversize` se conserva como camiseta de corte oversize; se diferencia de la `Camisa oversize` existente por tipo de prenda.
- `Hoodie clásico` femenino y `Hoodie con cierre` masculino se distinguen por sección y construcción; el segundo lleva cremallera completa y no replica el polerón cerrado m11.

## Datos que quedan pendientes (no inventados)
Para los 21 nuevos productos se dejaron vacíos:
- Precio y precio anterior.
- Colores confirmados.
- Stock por talla (`stock_json`). Las claves del JSON indican exclusivamente tallas ofrecidas; los valores indican cantidades enteras disponibles.
- Siluetas recomendadas.

Las columnas `tela` y `cuidados` muestran `Por confirmar`. La columna `descripcion` contiene textos descriptivos de catálogo, no afirmaciones sobre composición textil.

## Imágenes
Cada nuevo producto tiene una ruta única en `assets/config.js`, pero no se colocaron fotos genéricas. Usa `PROMPTS_IMAGENES_21_MODELOS.md` para generar cada fotografía en Google Flow Labs y guarda el resultado WebP con el nombre exacto dentro de `assets/img/catalogo_nuevo/`.

## Google Sheets / Apps Script
El archivo `apps-script.gs` conserva la validación de stock por producto y talla y añade `sincronizarNuevosModelosCatalogo()`.
1. Actualiza el proyecto de Apps Script con este archivo.
2. Ejecuta manualmente `sincronizarNuevosModelosCatalogo()` una vez y autoriza los permisos solicitados.
3. La función agrega solo los IDs nf01–nf12 y nh01–nh09 que falten. No reemplaza ni borra filas existentes.
4. Completa en la pestaña `Catalogo` los precios, colores y el JSON de stock por producto. Ejemplo de formato, solo como estructura: `{"S":0,"M":0,"L":0}`. No copies cantidades de ejemplo como inventario real.
5. Mantén la URL `/exec?catalogo=1` configurada en `assets/config.js`.

Si la hoja ya tiene datos, NO ejecutes `restaurarCatalogoCompleto()`, porque esa función sustituye el contenido completo de Catalogo.

## Precio pendiente
La tienda muestra `Precio por confirmar` en vez de S/ 0.00. Los productos pueden revisarse y, una vez configurado su stock, añadirse al carrito; el registro del pedido se bloquea mientras alguno de sus productos no tenga precio válido.

## Archivos relevantes modificados
- `catalogo.csv`: 21 filas nuevas y columna `descripcion`.
- `assets/app.js`: catálogo local de respaldo, carga remota combinada, presentación de precios pendientes, colores sin confirmar y descripciones.
- `assets/config.js`: rutas de imagen únicas para los 21 modelos.
- `apps-script.gs`: catálogo de referencia de 60 filas y función segura de sincronización incremental.
- `generar-paginas.py`: metadatos de páginas con XS–5XL y precio pendiente cuando corresponda.
- `producto/<id>/index.html`: 21 páginas estáticas nuevas generadas desde el CSV.
- `PROMPTS_IMAGENES_21_MODELOS.md`: 21 prompts y rutas para generar las fotografías.

## Pruebas ejecutadas y límites
- **CSV:** 60 filas, 33 femeninos y 27 masculinos; 60 identificadores únicos.
- **Conservación:** se compararon los 39 registros originales campo por campo; sus datos originales se conservaron.
- **IDs nuevos:** 21 identificadores únicos, sin colisión con los 39 existentes.
- **Catálogo de respaldo JavaScript:** evaluado con 60 productos y distribución 33/27.
- **Parser CSV del sitio:** procesó 60 registros; los 21 nuevos conservan precio, colores y stock pendientes.
- **Apps Script:** sintaxis verificada con Node.js. Se simuló `sincronizarNuevosModelosCatalogo()` sobre una hoja de 39 productos; añadió 21 filas, mantuvo 60 IDs únicos y la segunda ejecución no duplicó filas.
- **Páginas estáticas:** existen 60 páginas de producto; se generaron las 21 rutas nuevas.
- **Imágenes:** hay 21 prompts y 21 rutas únicas; no se generaron ni se publicaron fotos definitivas.
- **No probado:** no se ejecutó una compra real en navegador, no se conectó a la Google Sheet real ni se desplegó Apps Script en producción. El intento de prueba de navegador local no produjo DOM verificable; por ello no se declara superada la prueba visual/end-to-end.
- **Inventario y pedidos reales:** requieren configurar stock, precios y colores, ejecutar la sincronización incremental en Apps Script y validar el flujo con la hoja real antes de abrir ventas.
