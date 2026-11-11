import { categoryLabel } from './data/categories.js';
import { maxQuantity } from './cart.js';
import { clearError, element, productImage, selectOptions, showError } from './dom.js';
import { money } from './format.js';

function gallery(images) {
  const photo = productImage(images[0]);
  photo.className = 'detail-main-image';
  const group = element('div', { className: 'detail-gallery' }, photo);
  if (images.length < 2) return group;

  const thumbnails = element('div', { className: 'detail-thumbnails', attrs: { role: 'group', 'aria-label': 'Fotos de la prenda' } });
  images.forEach((image, index) => {
    const thumbnail = element('button', {
      className: 'thumbnail',
      attrs: { type: 'button', 'aria-label': `Ver foto ${index + 1}`, 'aria-pressed': String(index === 0) },
    }, element('img', { attrs: { src: image.src, alt: '' } }));
    thumbnail.addEventListener('click', () => {
      photo.src = image.src;
      photo.alt = image.alt;
      for (const button of thumbnails.children) button.setAttribute('aria-pressed', String(button === thumbnail));
    });
    thumbnails.append(thumbnail);
  });
  group.append(thumbnails);
  return group;
}

function variantField(fields, name, label, options) {
  if (!options.length) return null;
  const select = element('select', { attrs: { name, required: '' } });
  selectOptions(select, options.map(value => ({ value, label: value })), 'Selecciona');
  fields.append(element('label', { text: label }, select));
  return select;
}

function detailForm(product, cart, onAdd) {
  const form = element('form', { className: 'detail-form', attrs: { novalidate: '' } });
  const fields = element('div', { className: 'detail-fields' });
  const size = variantField(fields, 'size', 'Talla', product.sizes);
  const color = variantField(fields, 'color', 'Color', product.colors);
  const quantity = element('input', { attrs: { type: 'number', name: 'quantity', value: 1, min: 1, max: maxQuantity, step: 1, required: '', inputmode: 'numeric' } });
  fields.append(element('label', { text: 'Cantidad' }, quantity));
  const error = element('p', { className: 'error', attrs: { id: 'detail-error', role: 'alert', hidden: '' } });
  const button = element('button', { className: 'button button-primary', text: 'Agregar al carrito', attrs: { type: 'submit' } });
  form.append(fields, error, button);

  form.addEventListener('input', () => clearError(form, error));
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearError(form, error);
    if (size && !size.value) return showError(error, 'Selecciona una talla.', size);
    if (color && !color.value) return showError(error, 'Selecciona un color.', color);
    if (!quantity.validity.valid) return showError(error, `Ingresa una cantidad entera entre 1 y ${maxQuantity}.`, quantity);
    const issue = cart.add({
      id: product.id,
      size: size?.value ?? '',
      color: color?.value ?? '',
      quantity: quantity.valueAsNumber,
    });
    if (issue) return showError(error, issue, quantity);
    onAdd(product);
  });
  return form;
}

export function initDetail(cart, onAdd, showDialog) {
  const dialog = document.getElementById('detail-dialog');
  const content = document.getElementById('detail-content');
  return product => {
    const info = element('div', { className: 'detail-info' },
      element('p', { className: 'eyebrow', text: `${product.brand} · ${categoryLabel(product.category)}` }),
      element('h2', { text: product.name, attrs: { id: 'detail-title' } }),
      element('p', { className: 'product-price', text: money(product.price) }),
      element('p', { className: 'muted', text: product.description }),
      product.available
        ? detailForm(product, cart, onAdd)
        : element('p', { className: 'error', text: 'Agotado. Esta prenda no está disponible.' }),
    );
    content.replaceChildren(element('div', { className: 'detail-layout' }, gallery(product.images), info));
    showDialog(dialog);
  };
}
