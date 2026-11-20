# Resultados de pruebas — Seguimiento de pedidos

## Pruebas ejecutadas localmente
- Sintaxis de `assets/app.js`: superada con `node --check`.
- Sintaxis de `apps-script.gs`: superada al comprobar el contenido como JavaScript V8 con `node --check`.
- Catálogo: 60 filas de productos, 33 femeninos y 27 masculinos.
- Identificadores de catálogo: 60 únicos.
- Imágenes nuevas: las 21 rutas `nf01`–`nf12` y `nh01`–`nh09` existen.
- Rutas del seguimiento: página, consulta, panel administrativo y funciones Apps Script presentes.
- Compatibilidad de columnas: los nuevos campos se anexan a `Pedidos`; no se borran ni reordenan los campos existentes.

## Pruebas que no se pudieron ejecutar
- Escritura real en la hoja Google Sheets de la tienda.
- Validación de stock real y concurrencia sobre el Apps Script desplegado.
- Consulta JSONP desde el dominio público real.
- Cambio de estado con la clave guardada en Script Properties.
- Apertura y envío real del mensaje por WhatsApp.
- Compra completa en producción.

Estas pruebas requieren acceso al Google Sheets y despliegue real del Apps Script, que no se proporcionaron en esta sesión. Por tanto, no se consideran superadas.
