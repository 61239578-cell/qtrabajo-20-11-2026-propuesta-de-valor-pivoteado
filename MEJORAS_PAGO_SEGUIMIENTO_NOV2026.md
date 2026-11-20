# Mejoras de noviembre 2026 — Pago con QR, seguimiento en Cusco y ofertas

## 1. Simulación de pago con código QR (nueva sección `#pago`)
- Antes, al generar un pedido aparecía una ventana emergente ("modal") de simulación de pago encima de la página.
- Ahora el sitio **redirige a una sección propia**: `#pago`. Ahí se ve el resumen del pedido (código, total,
  adelanto del 50%, saldo) y **tu código QR de Yape** (`assets/img/yape-qr-eliot.png`), con el nombre del
  titular ("Eliot Brayan Ttito Carrion") debajo.
- El botón **"Ya pagué: simular confirmación"** sigue registrando la simulación en Apps Script exactamente
  igual que antes (no se tocó la lógica de backend), solo cambió dónde se muestra.
- Si entras a **Seguimiento** y tu pedido sigue "Pendiente de adelanto", aparece un botón
  **"Pagar mi adelanto ahora"** que te lleva directo a `#pago` con ese pedido cargado.
- Puedes cambiar el QR o el titular en cualquier momento desde `assets/config.js`, bloque `PAGO_QR`.
- Sigue siendo 100% DEMO: no se procesan cobros reales, solo se registra el estado en la hoja de cálculo.

## 2. Simulación de ruta dentro de la ciudad del Cusco (en Seguimiento)
- La página de Seguimiento ahora muestra, además de la barra de estados, una **ruta simulada** con 4 puntos:
  Tienda Smart Fit Cusco (San Blas) → Taller de preparación (Centro Histórico) → Reparto en camino →
  Tu dirección.
- Un ícono de moto 🛵 avanza por la ruta según el estado real del pedido guardado en la hoja de cálculo.
  Si el pedido está cancelado, el ícono cambia a ⛔ y la ruta se detiene donde quedó.
- Es una simulación visual (no usa GPS ni mapas reales), pensada para que la persona entienda en qué etapa
  está su pedido dentro de la ciudad.

## 3. Ofertas más llamativas
- Nuevo banner de **"Oferta flash"** en el Inicio: toma automáticamente las 4 prendas con mayor descuento
  real del catálogo (precio anterior vs. precio actual) y muestra una **cuenta regresiva hasta la medianoche**.
  No inventa descuentos nuevos: usa los mismos precios de `catalogo.csv` / `app.js`.
- Las etiquetas de descuento ("-20%", etc.) en las tarjetas de producto ahora tienen una **animación sutil**
  (laten/laten) para llamar más la atención, y se desactiva automáticamente si la persona tiene activada la
  preferencia "reducir animaciones" del sistema (accesibilidad).

## 4. Revisión de botones "Cerrar" y errores de funcionalidad
- Se agregó un cierre **genérico** para todas las ventanas emergentes de la clase `.ov` (por ejemplo, la de
  "Tu opinión"): ahora se pueden cerrar con la **tecla Escape** o haciendo **clic fuera del cuadro**, además
  del botón "Cerrar" que ya tenían.
- Se revisó el panel de **LÍA · Asesora de moda** (botón "✦ Asesora de moda"): su botón de cierre (`×`) y la
  tecla Escape ya funcionaban correctamente; se confirmó que no quedan oyentes duplicados ni fugas de memoria
  (se libera la vista previa de fotos al cerrar).
- Se revisó el carrito/bolsa (`#drw`): el cierre con clic afuera y el botón "Cerrar" funcionan correctamente.
- Se agregaron los títulos de pestaña del navegador que faltaban para **Seguimiento** y **Pagar pedido**
  (antes mostraban el título de Inicio por error).
- Se verificó con `node --check` que los 5 archivos JavaScript del proyecto (`app.js`, `config.js`,
  `efectos.js`, `probador-config.js`, `probador-virtual.js`) **no tienen errores de sintaxis**.

## 5. Limpieza de espacio
- Se eliminó la carpeta `backup/` (31 MB de ZIPs de versiones anteriores: `proyecto_original_antes_de_tallas.zip`,
  `smartfit_cusco_backup_antes_paso5.zip`, `smartfit_cusco_backup_antes_paso6.zip`). El proyecto pasó de
  ~38 MB a ~7 MB. Si quieres conservar ese historial, guárdalo aparte en tu computadora antes de subir esta
  versión a GitHub; ya no viene incluido en este paquete.
- No se encontraron otros archivos basura (no había `.DS_Store`, `__MACOSX` ni `Thumbs.db`).
- Se dejó `pruebas_paso6/` (36 KB) porque es muy liviano y lo referencian los documentos de pruebas
  (`PRUEBAS_PASO_6.md`); avísame si también quieres que lo quite.

## 6. Prueba automática de errores (nuevo)
- Se montó una prueba automática (navegador simulado) que carga el sitio completo y recorre todas las
  secciones (Inicio, Tienda, Asistente, Nosotros, Tu opinión, Contacto, Seguimiento, Pagar pedido y una
  ficha de producto), abre y cierra el panel de LÍA, abre y cierra la encuesta de opinión (con clic afuera),
  y prueba la página "Pagar pedido" con y sin un pedido pendiente.
- Resultado: **no se encontraron errores de JavaScript reales**. Lo único que marcó la prueba fue un aviso
  de que el navegador simulado no implementa `scrollTo()` (una limitación de la herramienta de prueba, no
  del sitio; en un navegador real esa función sí existe y no genera ningún problema).
- Se corrigió además un cálculo interno de la ruta simulada en Cusco que quedaba "muerto" (sin efecto) para
  pedidos cancelados; ahora simplemente no avanza la ruta cuando el pedido está cancelado, de forma
  consistente con el resto de la página.
- No tengo el detalle de qué error viste tú exactamente al probarlo. Si me cuentas en qué página ocurrió,
  qué botón presionaste y qué mensaje o comportamiento viste (o me envías una captura), lo reviso puntual
  y lo corrijo en la siguiente vuelta.

## 7. Pendiente para una próxima sesión (tú decides el orden)
- Registrar en la hoja de cálculo (Apps Script) un detalle específico de **cada pago simulado** y de la
  **ruta/seguimiento** en su propia pestaña, para que quede todo también disponible en el Excel automático
  (`SMARTFIT_CONTROL_KPI.xlsx`). Esto lo vemos juntos en el siguiente paso, como pediste.
- Si quieres, el banner de "Oferta flash" también se puede repetir en la página Tienda (ahora solo está en
  Inicio para no arriesgar el diseño existente de esa página, que es una plantilla larga).
