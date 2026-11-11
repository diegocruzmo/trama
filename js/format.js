import { store } from './config.js';

const currency = new Intl.NumberFormat(store.locale, {
  style: 'currency',
  currency: store.currency,
});

export const money = value => currency.format(value);

export function variantLabel({ size, color }) {
  return [size && `Talla ${size}`, color && `Color ${color}`].filter(Boolean).join(' · ');
}
