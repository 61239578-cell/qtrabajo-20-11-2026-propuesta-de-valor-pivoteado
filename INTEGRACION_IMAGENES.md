SMART FIT CUSCO — integración de catálogo visual (octubre 2026)

- Se añadieron 35 fotografías de productos en assets/img/catalogo_nuevo/.
- Se conectaron a los IDs de producto de assets/config.js.
- Se añadieron 9 productos al catálogo de assets/app.js y catalogo.csv:
  v4, p6, m13–m19.
- Se mantuvieron intactas las referencias originales de tallas:
  assets/img/ref_hombre.webp y assets/img/ref_mujer.webp.
- Las dos imágenes conceptuales del asistente de tallas se guardaron como
  referencias no activas en assets/img/catalogo_nuevo/referencia_asistente_01.jpg
  y referencia_asistente_02.jpg. No reemplazan las referencias del sitio.
- Las imágenes nuevas son JPEG de 896 × 1200 px.
- No se configuró una IA real ni pasarela de pago; no se modificó el backend.

Actualización posterior:
- Se corrigieron las asignaciones de varias fotos masculinas para que la imagen corresponda a la prenda.
- Se añadieron fotos para las 10 categorías de Inicio.
- El paso de análisis del asistente usa los prototipos originales con contorno y marcadores holográficos. Las medidas son manuales.
- La guía por tipo de prenda es orientativa mientras no se proporcionen tablas oficiales de cada fabricante. Ver `MEJORAS_OCTUBRE_2026.md`.


Corrección de noviembre 2026:
- Las fotos de la carpeta catalogo_nuevo pasaron de JPG (~500 KB) a WebP (~20 KB). Los JPG originales se retiraron del paquete.
- Las fotos masculinas m1–m19 estaban reasignadas a prendas equivocadas; ahora cada mN.webp se usa en el producto mN.
- Falta foto específica para: b3 (camisa oversize), b4 (top cruzado), b5, c3, c5, p4, p5 (usan una foto de modelo cercana).


## Integración de las 21 fotografías nuevas — noviembre 2026
- Se incorporaron 21 imágenes recibidas de Google Flow Labs, convertidas a WebP y guardadas como nf01.webp–nf12.webp y nh01.webp–nh09.webp en assets/img/catalogo_nuevo/.
- Los nombres coinciden con las rutas ya configuradas en assets/config.js y catalogo.csv; no fue necesario cambiar el código de visualización.
- Se conserva el listado de correspondencias y las observaciones de revisión en IMAGENES_21_INTEGRADAS.md.
- Dos imágenes requieren confirmación visual antes de publicar: nf01 (textura ribbed poco visible) y nh05 (corte oversize poco evidente).
