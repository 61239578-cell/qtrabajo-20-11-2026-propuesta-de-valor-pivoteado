# Cambios — Modo demo funcional (20 nov 2026)

## Asistente de tallas
- `config.js`: tablas de tallas **referenciales de demostración** (mujer y hombre, XS–5XL; límite superior de pecho/cintura/cadera en cm). Antes estaban en `null` y el asistente se bloqueaba con "tabla pendiente de validación".
- Nuevos interruptores: `MODO_DEMO: true` y `TABLAS_VALIDADAS: false`. Con `TABLAS_VALIDADAS: false` el sitio muestra un aviso "DEMO · Talla referencial" en el resultado y en la ficha de producto.
- **Antes de vender de verdad:** reemplaza los valores por las medidas verificadas del proveedor, pon `TABLAS_VALIDADAS: true`, `MODO_DEMO: false` y `STOCK_DEMO: false` (en `probador-config.js`).
- Si las medidas superan la 5XL se indica claramente y se invita a escribir por WhatsApp.

## Sistema de pedidos (revisión del flujo)
- Doble clic en "Reservar/Comprar" ya no crea pedidos duplicados (bloqueo de 4 s).
- "Comprar por WhatsApp" ahora vacía el carrito y cierra el panel (antes el carrito quedaba y se podían duplicar pedidos).
- Si el navegador bloquea WhatsApp, el pedido (ya registrado) vacía el carrito y se muestra el código de seguimiento.
- Prendas sin precio o sin colores (nf01–nf12, nh01–nh09) ya no aparecen en las recomendaciones ni se pueden añadir al carrito.
- Botones del carrito con nombres claros; "Pago en línea · próximamente" en lugar de un "Pagar ahora" deshabilitado.

## Visual
- Oferta flash: foto completa, precios legibles, botón dorado.
- Mensaje de Lía al costado, sin tapar los botones.
- Etiquetas de descuento / "Para tu silueta" con texto legible.
- Páginas de pago y seguimiento: tarjetas a todo el ancho de la columna.
