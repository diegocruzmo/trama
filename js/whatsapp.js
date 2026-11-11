import { store } from './config.js';
import { money, variantLabel } from './format.js';

export function whatsappUrl(message = '') {
  const url = new URL(`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`);
  if (message) url.search = `?text=${encodeURIComponent(message)}`;
  return url.href;
}

export function orderMessage(customer, lines, totals) {
  const products = lines.map((line, index) => {
    const variant = variantLabel(line);
    return [
      `${index + 1}. ${line.product.name} ${line.product.brand}${variant ? ` — ${variant}` : ''}`,
      `   ${line.quantity} × ${money(line.product.price)} = ${money(line.subtotal)}`,
    ].join('\n');
  });
  const shipping = totals.shippingCost === null ? 'Por coordinar por WhatsApp' : money(totals.shippingCost);
  return [
    `Hola, ${store.name}. Quisiera hacer un pedido.`,
    '',
    `Nombre: ${customer.name}`,
    `Contacto: ${customer.phone}`,
    `Ciudad: ${customer.city}`,
    `Entrega: ${customer.method.label}`,
    ...(customer.address ? [`Dirección: ${customer.address}`] : []),
    '',
    'Productos',
    ...products,
    '',
    `Subtotal de productos: ${money(totals.subtotal)}`,
    `Envío: ${shipping}`,
    `Total${totals.shippingCost === null ? ' de productos' : ' del pedido'}: ${money(totals.total)}`,
    '',
    `Notas: ${customer.notes || 'Sin notas adicionales'}`,
  ].join('\n');
}
