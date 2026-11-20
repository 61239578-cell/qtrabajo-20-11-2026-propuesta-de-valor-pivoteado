# Correcciones de noviembre 2026

## Por qué no aparecían las fotos al usar el catálogo
1. El catálogo de Google Sheets reemplaza al de `app.js`, y la hoja `Catalogo` tenía solo 19 productos antiguos (sin v4, p6 ni m1–m19) y precios viejos. Los productos nuevos desaparecían y con ellos sus fotos.
2. Las fotos se buscaban solo por `id` en `config.js`; un producto nuevo de la hoja no tenía foto. Ahora se admite la columna `imagen` y, si falta, se busca `assets/img/catalogo_nuevo/<id>.webp`.
3. Las fotos pesaban ~500 KB cada una (18 MB en total). Ahora son WebP (0,7 MB en total).
4. Un pedido guardado en el navegador con una prenda que ya no existe en el catálogo rompía la bolsa. Ahora se depura solo.

## Lógica corregida
- Fotos masculinas: 15 de 19 estaban en la prenda equivocada (p. ej. Camisa Oxford con la foto de la casaca, Mochila con las zapatillas). Ahora coinciden.
- b2/b3 estaban intercambiadas; v1 mostraba una foto vino mientras su primer color es Terracota.
- Categorías del Inicio (camisa, casaca, short, deportivo, accesorio) tenían la foto de otra prenda.
- `config.js` tenía 4 claves `cat_*` duplicadas.
- El lector del catálogo ahora tolera mayúsculas, tildes, plurales, colores en minúscula y precios con "S/"; ya no descarta filas sin colores; conserva el distintivo "Nuevo" y las tallas agotadas en minúscula.
- Faltaba el material/cuidado de "falda" en el respaldo.
- `generar-paginas.py` solo cubría 4 categorías y usaba imágenes que no existen para productos nuevos; se regeneraron las 57 páginas.
- README indicaba envío gratis desde S/ 149.90 mientras el sitio dice S/ 129.90; se alineó a 129.90.

## Pendiente (requiere decisión tuya)
- Producto m18 (zapatillas): la foto existe pero no hay fila en el catálogo (falta nombre y precio).
- Siluetas de hombres: solo tienen rect/inv; un hombre con silueta manzana nunca verá "Para tu silueta".
- Sin foto específica: b3, b4, b5, c3, c5, p4, p5.
- Al agregar al carrito desde la tarjeta sin haber usado el asistente, se elige XL por defecto sin avisar.
- Pasos en Google: pegar el nuevo `apps-script.gs`, ejecutar `restaurarCatalogoCompleto()` y crear una nueva versión de la implementación.
