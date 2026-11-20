# SMART FIT CUSCO — Informe de pruebas del PASO 5

## Resumen

La implementación se incorporó al proyecto original. Se conservaron los 224 elementos que contenía el ZIP recibido; no se detectaron archivos originales perdidos ni cambios inesperados fuera de los tres archivos editados intencionalmente.

## Pruebas ejecutadas y resultado

| Prueba | Resultado | Evidencia |
|---|---|---|
| Extracción del ZIP recibido | APROBADA | Se extrajeron los 224 elementos originales |
| Copia de seguridad previa | APROBADA | `backup/smartfit_cusco_backup_antes_paso5.zip` es copia del ZIP recibido |
| Conservación de archivos originales | APROBADA | Comparación SHA-256: 224/224 archivos originales presentes; sin cambios no autorizados |
| Sintaxis de `assets/app.js` | APROBADA | `node --check` terminó con código 0 |
| Lectura estructural de `index.html` | APROBADA | El parser HTML de Python pudo procesar el documento |
| Balance de llaves de `assets/style.css` | APROBADA | 1095 llaves de apertura y 1095 de cierre |
| Reglas de `stock_json` | APROBADA | Prueba aislada: cantidades positivas disponibles, cero agotado y talla ausente no disponible |
| Interfaz en navegador real | NO EJECUTADA | El entorno de ejecución bloqueó la navegación local de Chromium (`ERR_BLOCKED_BY_ADMINISTRATOR`); no se presenta como prueba superada |
| Integración en vivo con Google Sheets / Apps Script | NO VERIFICADA | Se inspeccionó el `doGet` existente que sirve la hoja `Catalogo` como CSV, pero no se verificó una respuesta real del despliegue |
| Regresión funcional de los pasos 1–4 | NO EJECUTADA EN NAVEGADOR | El código existente de esos pasos se conservó; no se afirma una prueba interactiva que no pudo ejecutarse |

## Lista de archivos

### Modificados
- `assets/app.js`: se añadió el módulo de asesoría de moda DEMO al final del archivo; las funciones existentes se conservaron.
- `assets/style.css`: se añadieron estilos del panel de LÍA y adaptación móvil.
- `README.md`: se añadió la guía breve del PASO 5.

### Nuevos
- `PASO_5_LIA_DEMO.md`: arquitectura, funcionamiento, privacidad y requisitos de inventario.
- `PRUEBAS_PASO_5.md`: este informe.
- `backup/smartfit_cusco_backup_antes_paso5.zip`: respaldo íntegro previo a las modificaciones.

No se modificaron `index.html`, `config.js`, `apps-script.gs`, `catalogo.csv`, imágenes, páginas de producto ni archivos de los pasos 1–4.

## Qué debe comprobarse al desplegar

1. Confirmar que la URL `CATALOGO_URL` apunta al Apps Script vigente.
2. En la hoja `Catalogo`, verificar que `stock_json` tenga cantidades reales por talla. Ejemplo: `{"XS":2,"S":4,"M":0}`.
3. Abrir la tienda y pulsar **✦ Asesora de moda**.
4. Probar recomendaciones casuales y elegantes para mujer y hombre.
5. Probar filtros de presupuesto, color preferido, color a evitar y talla.
6. Probar un outfit y añadirlo al carrito; comprobar que el contador y `sfc_cart` cambian en el carrito habitual.
7. Probar una talla agotada o sin stock; LÍA debe impedir añadirla.
8. Seleccionar una imagen JPG/PNG/WEBP de hasta 5 MB y comprobar que la vista previa aparece localmente.
9. Repetir las pruebas de los pasos 1–4 y del proceso de pedido en el entorno publicado.

## Limitación de datos

La hoja de catálogo puede contener prendas sin stock_json. En esos casos LÍA no puede asegurar disponibilidad y no permitirá agregarlas al carrito desde el asesor. Esto es intencional para no inventar inventario. Completar las existencias verificadas en Google Sheets es necesario para habilitar recomendaciones comprables.
