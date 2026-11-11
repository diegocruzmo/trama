import { createCart } from './cart.js';
import { initCartView } from './cart-view.js';
import { initCatalog } from './catalog.js';
import { initCheckout } from './checkout.js';
import { renderContent } from './content.js';
import { initDetail } from './detail.js';

const cart = createCart();
const toast = document.getElementById('toast');
let toastTimer;

function showDialog(dialog) {
  if (dialog.open) return;
  document.querySelector('dialog[open]')?.close();
  dialog.showModal();
  dialog.scrollTop = 0;
}

const openCart = initCartView(cart, () => openCheckout(), showDialog);
const openCheckout = initCheckout(cart, openCart, showDialog);
const openDetail = initDetail(cart, product => {
  document.getElementById('detail-dialog').close();
  clearTimeout(toastTimer);
  toast.textContent = `${product.name} se agregó al carrito.`;
  toastTimer = setTimeout(() => { toast.textContent = ''; }, 3600);
}, showDialog);

renderContent(openDetail);
const setCategory = initCatalog(openDetail);
document.querySelector('[data-jeans]').addEventListener('click', () => setCategory('jeans'));

for (const dialog of document.querySelectorAll('dialog')) {
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href], button, input, select, textarea')]
      .filter(control => !control.disabled && control.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    const boundary = event.shiftKey ? first : last;
    if (document.activeElement === boundary || !dialog.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  });
}
