import { categories, categoryLabel, cuts } from './data/categories.js';
import { products } from './data/products.js';
import { element, productImage, selectOptions } from './dom.js';
import { money } from './format.js';

const pageSize = 8;

function productCard(product, openDetail) {
  const button = element('button', {
    className: 'product-open',
    text: product.name,
    attrs: { type: 'button', 'aria-haspopup': 'dialog', 'aria-label': `Ver detalle: ${product.name}` },
  });
  button.addEventListener('click', () => openDetail(product));
  const card = element('article', { className: 'product' },
    element('div', { className: 'product-image' }, productImage(product.images[0], true)),
    element('div', { className: 'product-info' },
      element('p', { text: categoryLabel(product.category) }),
      element('h3', {}, button),
      element('div', { className: 'product-bottom' },
        element('span', { className: 'product-price', text: money(product.price) }),
        element('span', { text: '↗', attrs: { 'aria-hidden': 'true' } }),
      ),
    ),
  );
  if (!product.available) card.append(element('span', { className: 'product-status', text: 'Agotado' }));
  return card;
}

export function initCatalog(openDetail) {
  const grid = document.getElementById('products');
  const filterGroup = document.getElementById('category-filters');
  const cutField = document.getElementById('cut-field');
  const cutFilter = document.getElementById('cut-filter');
  const count = document.getElementById('catalog-count');
  const more = document.getElementById('show-more');
  const categoryOptions = [{ id: '', label: 'Todo' }, ...categories];
  const featuredFirst = [...products].sort((a, b) => Number(b.featured) - Number(a.featured));
  let category = '';
  let shown = 0;

  selectOptions(cutFilter, cuts.map(cut => ({ label: cut.label, value: cut.id })), 'Todos los cortes');

  function render(append = false) {
    const cut = cutField.hidden ? '' : cutFilter.value;
    const matching = featuredFirst.filter(product =>
      (!category || product.category === category) && (!cut || product.cut === cut));
    if (!append) {
      shown = 0;
      grid.replaceChildren();
    }
    const next = matching.slice(shown, shown + pageSize).map(product => productCard(product, openDetail));
    grid.append(...next);
    shown += next.length;
    count.textContent = matching.length ? `${shown} de ${matching.length} prendas` : '0 prendas';
    more.hidden = shown >= matching.length;
    if (!matching.length) {
      grid.append(element('p', { className: 'catalog-empty', text: 'No hay prendas para este filtro.' }));
    }
    if (append) next[0]?.querySelector('button').focus();
  }

  function setCategory(id) {
    category = id;
    cutField.hidden = id !== 'jeans';
    cutFilter.value = '';
    for (const button of filterGroup.children) {
      button.setAttribute('aria-pressed', String(button.dataset.category === id));
    }
    render();
  }

  for (const option of categoryOptions) {
    const button = element('button', {
      className: 'filter',
      text: option.label,
      attrs: { type: 'button', 'data-category': option.id },
    });
    button.addEventListener('click', () => setCategory(option.id));
    filterGroup.append(button);
  }

  cutFilter.addEventListener('change', () => render());
  more.addEventListener('click', () => render(true));
  setCategory('');
  return setCategory;
}
