export function element(tag, { className, text, attrs } = {}, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  for (const [name, value] of Object.entries(attrs ?? {})) node.setAttribute(name, value);
  node.append(...children);
  return node;
}

export function productImage(image, lazy = false) {
  const img = element('img', { attrs: { src: image.src, alt: image.alt } });
  if (lazy) img.loading = 'lazy';
  return img;
}

export function selectOptions(select, options, placeholder) {
  const entries = options.map(({ label, value }) => new Option(label, value));
  select.replaceChildren(...(placeholder ? [new Option(placeholder, '')] : []), ...entries);
}

export function showError(message, error, field) {
  message.textContent = error;
  message.hidden = !error;
  if (!field) return;
  field.setAttribute('aria-invalid', 'true');
  const descriptions = new Set(field.getAttribute('aria-describedby')?.split(' ').filter(Boolean));
  descriptions.add(message.id);
  field.setAttribute('aria-describedby', [...descriptions].join(' '));
  field.focus();
}

export function clearError(form, message) {
  showError(message, '');
  for (const field of form.querySelectorAll('[aria-invalid="true"]')) {
    field.removeAttribute('aria-invalid');
    const ids = field.getAttribute('aria-describedby')?.split(' ').filter(id => id !== message.id);
    if (ids?.length) field.setAttribute('aria-describedby', ids.join(' '));
    else field.removeAttribute('aria-describedby');
  }
}
