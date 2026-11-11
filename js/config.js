export const store = {
  name: 'Trama',
  whatsapp: '+573238305353',
  currency: 'COP',
  locale: 'es-CO',
  hero: {
    productId: 'jeans-jean-578-baggy-03',
    kicker: 'Denim y ropa casual',
    description: 'Cortes rectos, siluetas amplias y capas para la ciudad.',
  },
  contact: {
    // Valores de ejemplo. Las entradas vacías se ocultan.
    email: '',
    location: '',
  },
  socials: [
    // Ejemplo de formato. Reemplaza la URL vacía por el perfil real.
    { label: 'Instagram', url: '' },
    { label: 'TikTok', url: '' },
  ],
  shipping: {
    // null deja el costo por coordinar. Si hay una tarifa fija, usa un número.
    cost: null,
    summary: 'Coordinamos el costo y el plazo de entrega por WhatsApp según la ciudad y la dirección.',
    methods: [
      { id: 'envio', label: 'Envío a domicilio', requiresAddress: true },
      { id: 'coordinar', label: 'Coordinar entrega por WhatsApp', requiresAddress: false },
    ],
  },
  footerDescription: 'Jeans, camisas y prendas casuales.',
  faq: [
    { question: '¿Cómo realizo un pedido?', answer: 'Agrega tus prendas al carrito, completa tus datos y abre WhatsApp. Presiona Enviar en el chat para que podamos revisar el pedido contigo.' },
    { question: '¿Cuánto cuesta el envío?', answer: 'El costo y el plazo se coordinan por WhatsApp según el destino. Mientras tanto, el total del carrito corresponde a los productos.' },
    { question: '¿Cómo consulto por un cambio?', answer: 'Escríbenos por WhatsApp con la referencia de la prenda para consultar las condiciones y la disponibilidad de otra talla.' },
  ],
  reviewsLabel: 'Reseñas de demostración',
  reviews: [
    { author: 'Laura M.', quote: 'Pude comparar los cortes y escoger el jean que buscaba.' },
    { author: 'Andrés P.', quote: 'La foto de la camisa me ayudó a ver el estampado antes de elegir.' },
    { author: 'Daniela R.', quote: 'Me gustó ver la talla y el subtotal de cada prenda en el carrito.' },
  ],
};
