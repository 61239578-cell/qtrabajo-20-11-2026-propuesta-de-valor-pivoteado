# Implementación de seguimiento de pedidos — Smart Fit Cusco

## Qué se incorporó
- Consulta pública por código `SFC-AAAA-XXXXXXXXXX` y últimos cuatro dígitos del teléfono.
- Hoja `Historial Seguimiento` para conservar cada actualización.
- Columnas nuevas anexadas a `Pedidos`, sin borrar ni reordenar las columnas anteriores.
- Ocho estados de seguimiento; los estados históricos (`Nuevo`, `Confirmado`, `Pagado`, `Listo para recoger`) se traducen para mostrarlos sin alterar registros previos.
- Fecha estimada inicial de cuatro días calendario, expresada como estimación sujeta a confirmación. No se marca la entrega automáticamente.
- WhatsApp utiliza el número existente en `assets/config.js`; se prepara el mensaje con código y enlace de seguimiento. Son enlaces `wa.me` manuales, no notificaciones automáticas.
- Administración web protegida por una clave guardada en Script Properties, no incrustada en el frontend.

## Configuración requerida
1. En el Google Sheets existente, abre Extensiones → Apps Script y reemplaza/actualiza el código con `apps-script.gs` de este ZIP.
2. Ejecuta `configurarClaveAdminSeguimiento()` desde Apps Script y guarda una clave larga de al menos 20 caracteres. La clave se almacena en Script Properties. No la publiques ni la envíes a clientes.
3. Comprueba que `assets/config.js` conserve el `ENDPOINT` real de la implementación y el número WhatsApp de la tienda. No se han inventado ni cambiado.
4. Implementa una nueva versión de la aplicación web de Apps Script. Mantén la URL `/exec` si editas la implementación existente.
5. En la web, abre `#seguimiento`. Para administrar, despliega “Acceso administrativo” e introduce la clave.
6. Verifica con un pedido de prueba y un teléfono de prueba; luego elimina o cancela ese pedido según el procedimiento de la tienda.

## Seguridad y límites técnicos
- La consulta pública requiere código aleatorio y los últimos cuatro dígitos del teléfono. Devuelve solo estado, fechas, detalle resumido e historial; no devuelve nombre ni teléfono completo.
- Las escrituras administrativas validan el secreto en Apps Script. La clave nunca está en archivos públicos; se introduce manualmente en el panel.
- El sitio estático usa `no-cors` para POST, por lo que el navegador no puede leer la respuesta del servidor. El panel avisa que se debe volver a consultar para verificar la actualización.
- La fecha estimada se calcula a cuatro días calendario. Es una previsión, no una promesa; el administrador puede cambiarla.
- WhatsApp abre una conversación con mensaje precargado. No hay mensajes automáticos salientes; eso requeriría WhatsApp Business Platform/proveedor.
- El número de WhatsApp existente en configuración es `51938703934`; confirmar que siga siendo el número oficial antes de publicar.

## Compatibilidad
- Se conserva la hoja `Pedidos` y sus columnas existentes; las nuevas columnas se anexan.
- `Historial Seguimiento` se crea si no existe.
- Los pedidos históricos sin código de seguimiento permanecen intactos y no son consultables por el nuevo portal.
- El registro de pedido mantiene la validación de stock bajo `ScriptLock`.

## Pruebas ejecutadas en esta entrega
Se ejecutan comprobaciones de sintaxis JavaScript y validaciones estáticas de esquema/rutas. No se dispone de acceso a la hoja de cálculo real ni al despliegue de Apps Script, por lo que no se afirma haber probado la escritura en producción, la autorización real, ni una compra real de extremo a extremo.
