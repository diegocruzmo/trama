import { store } from './config.js';
import { orderTotals } from './cart.js';
import { totalsView } from './cart-view.js';
import { clearError, selectOptions, showError } from './dom.js';
import { orderMessage, whatsappUrl } from './whatsapp.js';

const clean = value => value.trim().replace(/\s+/g, ' ');
const methods = new Map(store.shipping.methods.map(method => [method.id, method]));

function validate(fields) {
  const name = clean(fields.name.value);
  const phone = clean(fields.phone.value);
  const city = clean(fields.city.value);
  const method = methods.get(fields.delivery.value);
  const address = method?.requiresAddress ? clean(fields.address.value) : '';
  const notes = fields.notes.value.trim();
  const phoneDigits = phone.replace(/\D/g, '');
  if (name.length < 2) return { error: 'Escribe tu nombre completo.', field: fields.name };
  if (!/^\+?[\d\s().-]+$/.test(phone) || !/^\d{7,15}$/.test(phoneDigits)) {
    return { error: 'Escribe un número de contacto de 7 a 15 dígitos.', field: fields.phone };
  }
  if (city.length < 2) return { error: 'Escribe tu ciudad.', field: fields.city };
  if (!method) return { error: 'Selecciona cómo deseas coordinar la entrega.', field: fields.delivery };
  if (method.requiresAddress && address.length < 5) {
    return { error: 'Escribe la dirección completa para el envío a domicilio.', field: fields.address };
  }
  return { customer: { name, phone, city, method, address, notes } };
}

function shippingCost(method) {
  return method?.requiresAddress ? store.shipping.cost : null;
}

export function initCheckout(cart, returnToCart, showDialog) {
  const dialog = document.getElementById('checkout-dialog');
  const form = document.getElementById('checkout-form');
  const addressField = document.getElementById('address-field');
  const total = document.getElementById('checkout-total');
  const error = document.getElementById('checkout-error');
  const fields = Object.fromEntries(['name', 'phone', 'city', 'delivery', 'address', 'notes']
    .map(name => [name, form.elements.namedItem(name)]));
  selectOptions(fields.delivery, store.shipping.methods.map(method => ({ value: method.id, label: method.label })), 'Selecciona una opción');

  function render() {
    const method = methods.get(fields.delivery.value);
    const addressRequired = Boolean(method?.requiresAddress);
    fields.address.required = addressRequired;
    fields.address.disabled = !addressRequired;
    addressField.hidden = !addressRequired;
    const lines = cart.lines();
    const amount = lines.length ? shippingCost(method) : null;
    total.replaceChildren(totalsView(orderTotals(lines, amount)));
  }

  document.getElementById('back-to-cart').addEventListener('click', returnToCart);
  form.addEventListener('input', () => clearError(form, error));
  fields.delivery.addEventListener('change', render);
  cart.subscribe(render);

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearError(form, error);
    const lines = cart.lines();
    if (!lines.length) return showError(error, 'Agrega al menos una prenda antes de solicitar un pedido.');
    const result = validate(fields);
    if (result.error) return showError(error, result.error, result.field);
    const { customer } = result;
    const totals = orderTotals(lines, shippingCost(customer.method));
    const url = whatsappUrl(orderMessage(customer, lines, totals));
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  return () => {
    clearError(form, error);
    render();
    showDialog(dialog);
  };
}
