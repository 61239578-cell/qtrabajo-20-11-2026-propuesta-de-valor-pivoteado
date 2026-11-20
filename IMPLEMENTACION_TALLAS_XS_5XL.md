# Implementación del sistema de tallas XS–5XL

## Alcance aplicado
- Se amplió el catálogo de tallas a XS, S, M, L, XL, 2XL, 3XL, 4XL y 5XL.
- El recomendador usa tres medidas corporales (pecho/busto, cintura y cadera) y selecciona la primera talla cuyos tres límites cubren las medidas introducidas.
- Las tablas femenina y masculina están separadas en `assets/config.js`.
- El inventario es independiente por producto y talla y se guarda en la columna `stock_json` de la pestaña `Catalogo` de Google Sheets.
- La talla y el color elegidos permanecen en cada elemento del carrito. El Apps Script vuelve a validar el stock de todas las líneas antes de registrar el pedido y descuenta las unidades bajo bloqueo de script.
- Los valores antiguos de `agotadas` de ejemplo se dejan de usar como fuente de inventario.

## 1. Completar las tablas corporales verificadas
Editar `assets/config.js`, en `window.CONFIG.TABLAS_TALLAS`.

Formato requerido, en centímetros:

```js
window.CONFIG.TABLAS_TALLAS.mujer.XS = {
  pecho: null, cintura: null, cadera: null
};
window.CONFIG.TABLAS_TALLAS.hombre.XS = {
  pecho: null, cintura: null, cadera: null
};
```

Repetir para las nueve tallas y reemplazar `null` únicamente con medidas verificadas por proveedor o medición de prendas reales. No copiar medidas entre géneros sin validación. El recomendador permanece bloqueado mientras falte una medida de cualquiera de las nueve tallas de la tabla seleccionada.

El algoritmo compara los tres contornos; no calcula la talla a partir de estatura o peso. Si no existe una talla que cubra las tres medidas, muestra que no puede recomendar con seguridad.

## 2. Configurar el stock de cada producto
La pestaña `Catalogo` de Google Sheets tendrá una nueva columna `stock_json`. Cada fila de producto debe tener un objeto JSON con la cantidad de cada talla que ese producto realmente ofrece.

Ejemplos de formato (solo ejemplos de estructura; no son cantidades reales de la tienda):

```json
{"S":3,"M":5,"L":2,"XL":0}
```

```json
{"XS":2,"S":4,"M":3,"2XL":2}
```

Incluye todas las tallas ofertadas por el producto y sus cantidades. Una talla ausente del JSON se considera no disponible/no configurada. Usa `0` para una talla que se ofrece pero está agotada. No cargues valores estimados.

## 3. Activar la actualización de Google Sheets / Apps Script
1. Abre el proyecto Apps Script que ya está vinculado a la URL `ENDPOINT` de `assets/config.js`.
2. Sustituye el contenido por el `apps-script.gs` actualizado.
3. Ejecuta `configurar()` una vez y autoriza los permisos. La función añade `stock_json` al final de `Catalogo` si la hoja ya existía; no borra los datos actuales.
4. Completa `stock_json` en cada producto de la hoja `Catalogo`.
5. Implementa una nueva versión de la aplicación web de Apps Script (Ejecutar como propietario; acceso según la configuración actual del proyecto).
6. Conserva la URL `/exec` existente en `assets/config.js`. Recarga el sitio para que vuelva a leer el CSV actualizado.

## 4. Notas operativas
- El registro de pedidos con `line_items` valida el stock en el servidor y no escribe el pedido si falta inventario configurado o no hay unidades suficientes.
- La validación y el descuento se ejecutan bajo `LockService` para evitar que dos pedidos simultáneos consuman las mismas unidades.
- El descuento se realiza al registrar la solicitud de pedido/reserva. Si la tienda cancela una solicitud, debe reponer manualmente esas unidades en `Catalogo.stock_json`.
- El sitio actual usa `fetch` en modo `no-cors` para Apps Script; por eso el navegador no puede leer el mensaje de rechazo del servidor. El servidor sí bloquea el registro del pedido, pero el flujo WhatsApp puede abrirse como solicitud pendiente de confirmación. La tienda debe confirmar la disponibilidad antes de entregar.
- La web no tiene un panel administrativo propio para editar inventario; el stock se mantiene en la hoja `Catalogo`, evitando introducir otro almacenamiento.

## 5. Datos que deben completarse antes de publicar
- Medidas femeninas verificadas XS–5XL: pecho/busto, cintura y cadera.
- Medidas masculinas verificadas XS–5XL: pecho, cintura y cadera.
- Stock real por producto y talla en `Catalogo.stock_json`.
- Revisión de pedidos y del stock desde la hoja después de desplegar el Apps Script actualizado.
