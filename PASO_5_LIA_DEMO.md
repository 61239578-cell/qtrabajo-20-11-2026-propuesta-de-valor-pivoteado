# SMART FIT CUSCO — PASO 5: LÍA asesora de moda (DEMO)

## Alcance y conservación

La implementación se realizó sobre el proyecto recibido. No se reconstruyó la tienda y no se sustituyeron los pasos 1–4. Se conservaron las páginas, el catálogo, las imágenes, los filtros, favoritos, probador, seguimiento, adelanto demo, WhatsApp, Apps Script y el carrito existentes.

Se creó primero `backup/smartfit_cusco_backup_antes_paso5.zip`, copia íntegra del ZIP de entrada. También se conserva el respaldo histórico que ya venía dentro del proyecto.

## Funcionalidades incorporadas

1. Acceso visible **✦ Asesora de moda** en la interfaz flotante de Lía.
2. Panel de conversación con bienvenida, preguntas sugeridas y aviso permanente de MODO DEMO.
3. Preferencias opcionales: sección femenina/masculina, estilo, color preferido, color a evitar, presupuesto máximo y talla.
4. Búsqueda local sobre el catálogo `CAT` que ya alimenta la tienda.
5. Recomendaciones que muestran fotografía del catálogo, nombre, categoría, estilo, precio, talla con stock confirmado y motivo de coincidencia.
6. Generador de outfit de dos piezas: una parte superior y una inferior, ambas existentes en catálogo y con precio y stock confirmados.
7. Añadido de una prenda o conjunto al `CART` existente. Se conserva el almacenamiento `sfc_cart`, el contador y el panel actual de compra.
8. Vista previa de fotografía local con validación de tipo y límite de 5 MB. No se sube ni se almacena permanentemente.
9. Diseño adaptable a escritorio y móvil.
10. Punto de extensión `window.SMARTFIT_LIA_CONFIG` para una futura integración; proveedor de IA permanece nulo y desactivado.

## Motor DEMO

- Interpreta palabras de búsqueda para reconocer estilo, ocasión, sección, color y tipo de prenda.
- Combina esos criterios con los filtros seleccionados.
- Consulta `CAT`, `IMG`, `stockOf`, `cartCount`, `CART` y `cc` que ya existen en la aplicación.
- No crea nombres, precios, fotos ni cantidades de inventario.
- Solo considera comprable un producto con precio mayor que cero y al menos una talla con stock positivo.
- Si se solicita una talla concreta, exige que `stock_json` indique una cantidad positiva en esa talla.
- Antes de agregar un outfit, valida todas las prendas y sus existencias. Si una falla, no agrega ninguna.
- Si el inventario está pendiente o no sincronizado, informa esa limitación en vez de afirmar disponibilidad.

## Datos de inventario necesarios

El Apps Script actual sirve la pestaña `Catalogo` como CSV cuando se consulta `?catalogo=1`. El parser del frontend lee `stock_json`. Para que Lía recomiende tallas comprables, cada fila debe contener cantidades verificadas, por ejemplo:

```json
{"XS":2,"S":4,"M":0,"L":1}
```

Una celda vacía no se interpreta como stock. El campo `agotadas` tampoco permite deducir cuántas unidades quedan. No se alteró el inventario para fabricar disponibilidad.

## Privacidad de fotografías

El selector admite JPG, PNG y WEBP de hasta 5 MB. La previsualización usa `URL.createObjectURL` en el navegador. No se llama a `fetch`, Apps Script ni servicios externos con la fotografía. La URL temporal anterior se revoca al seleccionar otra imagen. La imagen no se guarda en `localStorage`.

## Futuro proveedor IA

La versión actual no utiliza modelos de lenguaje ni de visión. Para una etapa futura se deberá crear un backend seguro que:
- autentique y limite solicitudes;
- guarde claves del proveedor exclusivamente en servidor;
- reciba únicamente datos necesarios y consentimiento explícito;
- valide las recomendaciones contra catálogo y stock del servidor;
- mantenga el carrito y el precio bajo control de la tienda.

No se habilitó ninguna API de pago ni se incluyeron claves nuevas.

## Estado de verificación

Las comprobaciones estáticas de sintaxis JavaScript, estructura HTML, balance CSS, conservación de los archivos originales y reglas aisladas de inventario pasaron. La navegación interactiva de Chromium y la respuesta en vivo de Apps Script no pudieron verificarse en este entorno; se detallan como pendientes en `PRUEBAS_PASO_5.md`.
