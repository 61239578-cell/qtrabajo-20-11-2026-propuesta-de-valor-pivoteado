# PASO 4 — Adelanto del 50% en MODO DEMO

## Alcance implementado
- El adelanto se calcula en Apps Script con el total del pedido recalculado desde la hoja `Catalogo`.
- El servidor ignora cualquier importe de adelanto enviado desde el navegador. La solicitud de simulación solo contiene el código de seguimiento.
- `MODO_DEMO = true` está definido en `apps-script.gs`; no se usa una variable del navegador para autorizar la simulación.
- El pedido conserva su estado de preparación/entrega independiente del estado de pago.
- Al registrar un pedido, el pago queda como `Pendiente de adelanto`.
- La simulación única registra el 50%, el saldo restante, fecha/hora Lima, modo DEMO y un evento en el historial.
- Se crea la hoja `Simulaciones DEMO` sin borrar las hojas existentes.
- Se habilitan filtros nativos de Google Sheets en `Pedidos` y `Simulaciones DEMO` cuando todavía no existe un filtro; permiten segmentar por `estado_pago`, `saldo_pendiente`, `estado` y fecha.
- La consulta de seguimiento muestra total, adelanto, saldo, estado de pago y fecha de simulación.
- La pantalla de confirmación muestra el aviso “DEMO — NO SE REALIZAN COBROS REALES”.
- La configuración `PAGO.ACTIVO` del frontend permanece desactivada. No se conectó ni invocó ninguna pasarela.

## Archivos modificados
- `apps-script.gs`
- `assets/app.js`

## Archivos conservados
El resto del proyecto se conserva desde el ZIP recibido: catálogo, imágenes, páginas individuales de producto, estilos, configuración de WhatsApp, asistente Lía, tallas, favoritos, carrito, seguimiento y documentación anterior.

## Hojas Google Sheets
Al ejecutar el backend, `Pedidos` anexa las columnas:
- `porcentaje_adelanto`
- `adelanto_requerido`
- `adelanto_simulado`
- `saldo_pendiente`
- `estado_pago`
- `modo_operacion`
- `fecha_simulacion`

Se crea `Simulaciones DEMO` con:
`codigo_pedido`, `pedido_id`, `fecha_hora`, `importe_simulado`, `porcentaje`, `estado`, `modo_operacion`, `origen`.

No se eliminan ni reordenan columnas existentes. `Historial Seguimiento` conserva el historial previo y recibe un evento de simulación.

## Configuración e instalación
1. Conserva una copia del ZIP original.
2. Actualiza el contenido de `apps-script.gs` en el proyecto de Apps Script vinculado al mismo Google Sheets.
3. Verifica que `SMARTFIT_SPREADSHEET_ID` siga configurado como corresponda y que la hoja `Catalogo` tenga `id` y `precio`.
4. Mantén `MODO_DEMO = true` en el servidor. No lo cambies a false para esta prueba.
5. Mantén `PAGO.ACTIVO: false` en `assets/config.js`.
6. Implementa una nueva versión de la aplicación web de Apps Script, conservando la URL `/exec` actual.
7. Publica el sitio estático actualizado con `assets/app.js`.
8. Crea un pedido ficticio con un teléfono de prueba. Desde la ventana DEMO pulsa “Simular pago del adelanto”.
9. Consulta el pedido en `#seguimiento` con el código y los últimos cuatro dígitos del teléfono. El estado de pago debe indicar `Adelanto simulado`.

## Seguridad y límites
- La solicitud de simulación no admite importe; el servidor lo obtiene del total guardado.
- El total del pedido se recalcula en servidor usando `Catalogo` y el mismo esquema de descuentos del carrito; si el total recibido no coincide, el backend rechaza el pedido.
- La operación está protegida contra duplicación por código de pedido y se ejecuta bajo `ScriptLock` de `doPost`.
- La simulación no marca el pedido como entregado ni como pagado en su totalidad.
- No se implementó confirmación de pagos reales ni se habilitó una pasarela.
- El panel administrativo web conserva sus funciones de seguimiento. Para revisar y filtrar el estado financiero DEMO de todos los pedidos, se usan los filtros nativos de la hoja `Pedidos` y el registro `Simulaciones DEMO`; no se expone la clave administrativa en URLs ni en el frontend.
- Las respuestas de Apps Script en despliegue real deben verificarse tras publicar. El frontend estático usa `no-cors`, por lo que el navegador no puede leer directamente el cuerpo del POST; la interfaz verifica el resultado consultando el endpoint público de seguimiento.

## Resultados de pruebas locales
- Sintaxis JavaScript de `assets/app.js` con `node --check`: SUPERADA.
- Sintaxis JavaScript V8 de `apps-script.gs` con `node --check`: SUPERADA.
- Casos matemáticos 100.00, 250.00 y 399.90: SUPERADOS con aritmética decimal de céntimos.
- Comprobaciones estructurales de configuración DEMO, cálculo desde catálogo, separación del estado de pago, hoja de simulaciones y pasarela desactivada: SUPERADAS.
- Pedido sin adelanto, simulación persistida, duplicación concurrente, manipulación desde navegador y consulta remota: NO ejecutables en este entorno sin el despliegue real; la lógica correspondiente se inspeccionó estáticamente, pero no se declara prueba de integración.
- Google Sheets real, permisos, despliegue, escritura y consulta remota: requieren acceso a la cuenta y al despliegue de Apps Script; no se declaran probados aquí.
