import { products } from './data/products.js';

export const maxQuantity = 99;
export const productsById = new Map(products.map(product => [product.id, product]));

const storageKey = 'trama.cart.v1';
const variantKey = ({ id, size, color }) => JSON.stringify([id, size, color]);
const validChoice = (options, value) => options.length ? options.includes(value) : value === '';
const validQuantity = quantity => Number.isInteger(quantity) && quantity >= 1 && quantity <= maxQuantity;

function validItem(item) {
  const product = productsById.get(item?.id);
  return product?.available && validChoice(product.sizes, item.size)
    && validChoice(product.colors, item.color) && validQuantity(item.quantity);
}

function readItems(raw) {
  try {
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return new Map();
    const items = new Map();
    for (const item of saved) {
      if (!validItem(item)) continue;
      const { id, size, color, quantity } = item;
      const key = variantKey(item);
      const combined = Math.min(maxQuantity, quantity + (items.get(key)?.quantity ?? 0));
      items.set(key, { id, size, color, quantity: combined });
    }
    return items;
  } catch {
    return new Map();
  }
}

function initialItems() {
  try {
    return readItems(localStorage.getItem(storageKey));
  } catch {
    return new Map();
  }
}

export function createCart() {
  let items = initialItems();
  const listeners = new Set();
  const notify = change => listeners.forEach(listener => listener(change));

  function save(change) {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...items.values()]));
    } catch {
      // El carrito de la sesión sigue disponible si el navegador bloquea el almacenamiento.
    }
    notify(change);
  }

  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    items = readItems(event.newValue);
    notify();
  });

  return {
    subscribe(listener) { listeners.add(listener); },
    lines() {
      return [...items].map(([key, item]) => {
        const product = productsById.get(item.id);
        return { ...item, key, product, subtotal: item.quantity * product.price };
      });
    },
    count() { return [...items.values()].reduce((sum, item) => sum + item.quantity, 0); },
    add(item) {
      if (!validItem(item)) return 'Revisa la disponibilidad, las opciones y la cantidad.';
      const key = variantKey(item);
      const quantity = (items.get(key)?.quantity ?? 0) + item.quantity;
      if (!validQuantity(quantity)) return `Puedes agregar hasta ${maxQuantity} unidades de esta variante.`;
      items.set(key, { ...item, quantity });
      save();
      return '';
    },
    update(key, quantity) {
      const item = items.get(key);
      if (!item || !validQuantity(quantity)) return false;
      if (item.quantity === quantity) return true;
      items.set(key, { ...item, quantity });
      save({ quantityKey: key });
      return true;
    },
    remove(key) {
      if (items.delete(key)) save();
    },
  };
}

export function orderTotals(lines, shippingCost = null) {
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  return { subtotal, shippingCost, total: subtotal + (shippingCost ?? 0) };
}
