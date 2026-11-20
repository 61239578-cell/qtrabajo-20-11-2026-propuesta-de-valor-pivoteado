/* ============================================================
   SMART FIT CUSCO — PASO 6: configuración central del probador
   Archivo NUEVO. No sustituye a assets/config.js.
   ============================================================ */
window.SMARTFIT_PROBADOR_CONFIG = {
  /* MODO DEMO: sin IA real, sin llamadas externas, la foto no sale del navegador.
     Esta versión lo mantiene SIEMPRE activo (el módulo lo fuerza a true). */
  MODO_DEMO: true,

  /* DATOS DE EJEMPLO DE STOCK (solo para probar el flujo completo).
     true  = las prendas que NO traen stock_json en la hoja reciben un stock
             inventado y repetible (siempre el mismo para el mismo id).
             Se marca como "stock de ejemplo" en la pantalla.
     false = se usa solo el stock real de Google Sheets (stock_json). Con la hoja
             vacía, ninguna prenda podrá añadirse al carrito, como en el Paso 5.
     Antes de vender de verdad, ponlo en false. */
  STOCK_DEMO: true,

  /* Foto del cliente */
  TAM_MAX_MB: 5,
  FORMATOS: ['image/jpeg', 'image/png', 'image/webp'],

  /* Máximo de unidades por línea al añadir desde el probador */
  CANTIDAD_MAX: 5,

  /* Futuro motor real de Virtual Try-On. Debe permanecer null en modo DEMO.
     Las credenciales irán SOLO en el servidor (backend), nunca aquí. */
  MOTOR_VTO: null
};
