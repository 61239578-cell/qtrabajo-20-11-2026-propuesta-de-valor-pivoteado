# Smart Fit Cusco — integración de las 21 fotografías nuevas

Las 21 fotografías recibidas en `Catálogo Smart Fit Cusco.zip` fueron revisadas, convertidas a WebP y colocadas en `assets/img/catalogo_nuevo/`, con los nombres que ya esperaba `assets/config.js`.

## Asignación de imágenes

| ID | Producto del catálogo | Archivo WebP |
|---|---|---|
| nf01 | Polo ribbed de manga corta | `nf01.webp` |
| nf02 | Polo estampado | `nf02.webp` |
| nf03 | Blusa de cuello mao elegante | `nf03.webp` |
| nf04 | Blusa sin mangas | `nf04.webp` |
| nf05 | Top de cuello cuadrado | `nf05.webp` |
| nf06 | Body ajustado de manga larga | `nf06.webp` |
| nf07 | Polo oversize liso | `nf07.webp` |
| nf08 | Oversize gráfico | `nf08.webp` |
| nf09 | Polera corta | `nf09.webp` |
| nf10 | Hoodie clásico | `nf10.webp` |
| nf11 | Chaqueta denim | `nf11.webp` |
| nf12 | Chaqueta varsity | `nf12.webp` |
| nh01 | Polo de punto texturizado | `nh01.webp` |
| nh02 | Polo de cuello camisero | `nh02.webp` |
| nh03 | Camisa de lino | `nh03.webp` |
| nh04 | Camisa de rayas verticales | `nh04.webp` |
| nh05 | Polo oversize | `nh05.webp` |
| nh06 | Oversize estampado | `nh06.webp` |
| nh07 | Polera de cuello redondo | `nh07.webp` |
| nh08 | Hoodie con cierre | `nh08.webp` |
| nh09 | Chaqueta ligera | `nh09.webp` |

## Verificación visual

- Se recibieron 21 archivos JPG.
- Se generaron 21 archivos WebP únicos, sin duplicados binarios.
- Los originales tenían 896 × 1200 píxeles.
- Los WebP se guardaron en la carpeta que utiliza el sitio.
- Los identificadores de imagen coinciden con las rutas ya declaradas en `assets/config.js` y con la columna `imagen` de `catalogo.csv`.

## Observaciones para revisión antes de publicar

1. `nf01` (Polo ribbed de manga corta): la foto muestra un polo femenino ajustado, pero la textura acanalada/ribbed no se distingue claramente. Conviene generar una toma donde el canalé sea evidente.
2. `nh05` (Polo oversize): la foto muestra un polo masculino beige; el volumen oversize no queda claramente demostrado en la silueta. Conviene generar una imagen con hombro caído y corte amplio más evidentes.
3. Las imágenes representan fotografías de catálogo, no variantes reales confirmadas de color, tela, marca o stock. Confirmar colores y especificaciones con el proveedor.

No se modificaron precios ni cantidades de inventario. Los valores que estaban pendientes continúan pendientes.
