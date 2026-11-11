import { maxQuantity, orderTotals } from './cart.js';
import { store } from './config.js';
import { element, productImage } from './dom.js';
import { money, variantLabel } from './format.js';

export function totalsView({ subtotal, shippingCost, total }, shippingLabel = 'Por coordinar por WhatsApp') {
  const row = (label, value) => element('div', { className: 'total-row' },
    element('span', { text: label }), element('strong', { text: value }));
  return element('div', { className: 'totals' },
    row('Subtotal de productos', money(subtotal)),
    row('Envío', shippingCost === null ? shippingLabel : money(shippingCost)),
    row(shippingCost === null ? 'Total de productos' : 'Total del pedido', money(total)),
  );
}

function cartItem(line, cart) {
  const { product, key } = line;
  const variant = variantLabel(line);
  const itemLabel = [product.name, variant].filter(Boolean).join(', ');
  const amount = element('input', {
    attrs: { type: 'number', min: 1, max: maxQuantity, step: 1, value: line.quantity, required: '', inputmode: 'numeric', 'aria-label': `Cantidad de ${itemLabel}`, 'data-quantity': key },
  });
  const error = element('p', { className: 'error', attrs: { role: 'alert', hidden: '' } });
  amount.addEventListener('change', () => {
    if (cart.update(key, amount.valueAsNumber)) {
      error.hidden = true;
      return;
    }
    amount.value = amount.defaultValue;
    error.textContent = `Ingresa una cantidad entera entre 1 y ${maxQuantity}.`;
    error.hidden = false;
  });
  const remove = element('button', {
    className: 'remove-button',
    text: 'Eliminar',
    attrs: { type: 'button', 'aria-label': `Eliminar ${itemLabel}`, 'data-remove': key },
  });
  remove.addEventListener('click', () => cart.remove(key));
  const info = element('div', { className: 'cart-item-info' },
    element('h3', { text: product.name }),
    element('p', { className: 'muted', text: [variant, `${money(product.price)} c/u`].filter(Boolean).join(' · ') }),
    element('p', { className: 'product-price', text: money(line.subtotal), attrs: { 'data-line-subtotal': '' } }),
    element('div', { className: 'cart-item-actions' }, element('label', { text: 'Cantidad ' }, amount), remove),
    error,
  );
  return element('li', { className: 'cart-item' }, productImage(product.images[0]), info);
}

export function initCartView(cart, startCheckout, showDialog) {
  const dialog = document.getElementById('cart-dialog');
  const content = document.getElementById('cart-content');
  const trigger = document.getElementById('cart-trigger');
  const badge = document.getElementById('cart-count');

  function cartTotals(lines) {
    const shippingLabel = store.shipping.cost === null ? undefined : 'Según tipo de entrega';
    return totalsView(orderTotals(lines), shippingLabel);
  }

  function render(change) {
    const focused = document.activeElement;
    const lines = cart.lines();
    const count = cart.count();
    badge.textContent = count;
    trigger.setAttribute('aria-label', `Carrito, ${count} ${count === 1 ? 'unidad' : 'unidades'}`);
    if (change?.quantityKey) {
      const line = lines.find(item => item.key === change.quantityKey);
      const input = [...content.querySelectorAll('[data-quantity]')].find(node => node.dataset.quantity === line.key);
      input.defaultValue = line.quantity;
      input.closest('.cart-item').querySelector('[data-line-subtotal]').textContent = money(line.subtotal);
      content.querySelector('.totals').replaceWith(cartTotals(lines));
      return;
    }
    const continueShopping = element('button', {
      className: 'button button-secondary', text: 'Continuar comprando', attrs: { type: 'button' },
    });
    continueShopping.addEventListener('click', () => dialog.close());
    if (lines.length) {
      const list = element('ul', { className: 'cart-list' }, ...lines.map(line => cartItem(line, cart)));
      const checkout = element('button', {
        className: 'button button-primary', text: 'Completar datos del pedido', attrs: { type: 'button' },
      });
      checkout.addEventListener('click', startCheckout);
      content.replaceChildren(list, cartTotals(lines), checkout, continueShopping);
    } else {
      content.replaceChildren(element('p', { className: 'muted', text: 'Tu carrito está vacío. Explora la colección y agrega las prendas que te gusten.' }), continueShopping);
    }
    if (dialog.open && focused?.dataset.quantity) {
      const input = [...content.querySelectorAll('[data-quantity]')].find(node => node.dataset.quantity === focused.dataset.quantity);
      (input ?? continueShopping).focus();
    }
    if (dialog.open && focused?.dataset.remove) {
      (content.querySelector('[data-remove]') ?? continueShopping).focus();
    }
  }

  render();
  cart.subscribe(render);
  const open = () => showDialog(dialog);
  trigger.addEventListener('click', open);
  return open;
}
