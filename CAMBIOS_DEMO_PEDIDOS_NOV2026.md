# Cambios — Mis pedidos, seguimiento demo y correcciones (Nov 2026)

Archivos NUEVOS: assets/demo-pedidos.js, assets/demo-pedidos.css, pedidos/index.html
Archivos MODIFICADOS: index.html, assets/app.js

- LÍA: botón X visible (y tecla Esc) y cabecera azul legible (el <header> heredaba el fondo blanco del sitio).
- Mis pedidos: página en el menú (junto a Contacto), botón en el encabezado y pestaña "Mis pedidos" dentro del carrito.
- Cada pedido guarda código, celular, productos, adelanto 50% pagado (Yape demo) y saldo; no se pierde al seguir comprando.
- Seguimiento demo funcional: el estado avanza solo tras el pago (confirmado > en preparación > listo > entregado).
- "Acceso administrativo" funciona en demo (sin clave) para cambiar el estado de un pedido local.
- Stock demo: mínimo 1 en todas las tallas; el stock existente mayor a 1 no se reduce; se descuenta al confirmar el pago.
- "Restablecer demo" (pie de página o en Mis pedidos) borra pedidos de prueba y repone el stock.
- Colores corregidos en Seguimiento, Pago y Mis pedidos.
