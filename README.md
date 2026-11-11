# Trama

Tienda estática de ropa con la propuesta Urbana. Usa HTML, CSS y módulos de JavaScript. Incluye 96 referencias tomadas de `Photos/`, con sus precios en pesos colombianos y las tallas de los archivos `Tallas.txt`.

## Ejecutar localmente

Desde la carpeta `Clothes`, inicia la vista previa con Node.js:

```powershell
node serve.mjs
```

Abre [la tienda local](http://127.0.0.1:8000). Presiona Ctrl+C en la terminal para detener la vista previa. Este servidor solo entrega archivos estáticos durante el desarrollo. El sitio publicado funciona en cualquier alojamiento estático.

También puedes usar Live Server de VS Code o, si tienes Python 3, `py -m http.server 8000 --bind 127.0.0.1`. Los módulos JavaScript deben cargarse por HTTP o HTTPS. El sitio funciona sin instalar paquetes.

## Editar el catálogo

- **Productos** en `js/data/products.js`. Cada objeto admite `id`, `name`, `brand`, `description`, `price`, `images`, `category`, `cut`, `colors`, `sizes`, `available` y `featured`. Mantén el identificador único y estable para conservar las referencias en los carritos existentes.
- **Imágenes** en `Photos/`. En `images`, cada entrada contiene `src` (ruta relativa a `index.html`) y `alt` (descripción para lectores de pantalla). La primera imagen aparece en el catálogo. Agrega más entradas para habilitar las miniaturas del detalle. Las fotos originales se renombraron sin el precio y los nombres repetidos llevan sufijo.
- **Tallas y colores** como listas de texto, por ejemplo `["28", "30", "32"]`. Usa `[]` si esa opción no aplica. La tienda solicita todas las opciones que tengan valores. Se conservó la talla `X` tal como aparece en las fichas de tallas.
- **Disponibilidad y destacados** con valores booleanos. Usa `available: false` para mostrar una prenda agotada y bloquear su compra. Usa `featured: true` para colocarla al inicio de su categoría y de la colección.
- **Categorías y cortes** en `js/data/categories.js`. Añade un objeto con `id` y `label`, luego usa ese identificador en los productos. `cut: null` indica que el filtro de corte no aplica.

## Personalizar la tienda

- **Marca y portada** en `js/config.js`. Cambia `name`, `hero.productId`, `hero.kicker` y `hero.description`. El titular de la portada y los textos de navegación están en `index.html`.
- **Colores y tipografía** en `css/base.css`. Las fuentes locales y sus licencias OFL están en `assets/fonts/`. Los componentes están en `css/components.css` y los ajustes para pantallas pequeñas en `css/responsive.css`.
- **WhatsApp y moneda** en `js/config.js`. `whatsapp` incluye el código de país y se configuró con `+573238305353`. `currency` controla la moneda y `locale` el formato regional. Los precios se guardan en unidades de la moneda configurada.
- **Redes y contacto** en `socials` y `contact`. Agrega las URLs HTTPS, el correo y la ubicación reales. Los valores de ejemplo vacíos se ocultan.
- **Envíos, preguntas y opiniones** en `shipping`, `faq` y `reviews`. Con `shipping.cost: null`, el total corresponde a los productos y el envío se coordina por WhatsApp. Una tarifa fija aplica al método que pide dirección. Revisa los textos de envío y las preguntas frecuentes si configuras una tarifa. Sustituye las reseñas de demostración y su etiqueta al contar con opiniones reales.
- **Inventario**. Las 96 referencias se cargaron como disponibles para la demostración. Revisa existencias, tallas y colores antes de usar el sitio con clientes.

## Flujo del pedido

El carrito se guarda en `localStorage` en ese navegador. Cada combinación de producto, talla y color forma una línea. Al completar el formulario, la página abre WhatsApp con un borrador que incluye datos de entrega, cantidades y precios. El cliente presiona **Enviar** en WhatsApp. El carrito se conserva y la web no registra pedidos ni procesa pagos.

## Publicar

Publica `index.html`, `css/`, `js/`, `assets/` y `Photos/` juntos en la raíz de un alojamiento estático. Por ejemplo, en GitHub Pages puedes seleccionar la rama con estos archivos y la carpeta raíz como fuente. En un alojamiento con carga de archivos, sube la carpeta que contiene `index.html`. El sitio no requiere un comando de compilación. Mantén las mayúsculas de las rutas y prueba el catálogo y el enlace de WhatsApp desde la URL publicada.
