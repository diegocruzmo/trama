import { productsById } from './cart.js';
import { store } from './config.js';
import { element } from './dom.js';
import { whatsappUrl } from './whatsapp.js';

export function renderContent(openDetail) {
  document.title = `${store.name} — Denim y ropa casual`;
  document.documentElement.lang = store.locale;
  for (const brand of document.querySelectorAll('[data-brand]')) brand.textContent = store.name;
  for (const link of document.querySelectorAll('[data-whatsapp]')) link.href = whatsappUrl();
  document.getElementById('hero-kicker').textContent = store.hero.kicker;
  document.getElementById('hero-description').textContent = store.hero.description;
  document.getElementById('shipping-summary').textContent = store.shipping.summary;
  document.getElementById('footer-description').textContent = store.footerDescription;
  document.getElementById('reviews-note').textContent = store.reviewsLabel;

  const heroProduct = productsById.get(store.hero.productId);
  const heroCredit = document.getElementById('hero-credit');
  const heroImage = document.getElementById('hero-image');
  if (heroProduct) {
    const image = heroProduct.images[0];
    heroImage.src = image.src;
    heroImage.alt = image.alt;
    heroCredit.textContent = `${heroProduct.name} ↗`;
    heroCredit.setAttribute('aria-haspopup', 'dialog');
    heroCredit.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openDetail(heroProduct);
    });
  } else {
    heroCredit.hidden = true;
    heroImage.parentElement.hidden = true;
  }

  const faq = document.getElementById('faq');
  for (const item of store.faq) {
    faq.append(element('details', {}, element('summary', { text: item.question }), element('p', { text: item.answer })));
  }

  const reviews = document.getElementById('reviews');
  for (const review of store.reviews) {
    reviews.append(element('figure', { className: 'review' },
      element('blockquote', { text: `“${review.quote}”` }), element('figcaption', { text: review.author })));
  }

  const contacts = document.getElementById('contacts');
  contacts.append(element('li', {}, element('a', {
    text: `WhatsApp ${store.whatsapp}`, attrs: { href: whatsappUrl(), target: '_blank', rel: 'noopener noreferrer' },
  })));
  if (store.contact.email) contacts.append(element('li', {}, element('a', {
    text: store.contact.email, attrs: { href: `mailto:${store.contact.email}` },
  })));
  if (store.contact.location) contacts.append(element('li', { text: store.contact.location }));

  const socials = document.getElementById('socials');
  for (const social of store.socials) {
    if (!/^https:\/\//i.test(social.url)) continue;
    socials.append(element('li', {}, element('a', {
      text: social.label, attrs: { href: social.url, target: '_blank', rel: 'noopener noreferrer' },
    })));
  }
  document.getElementById('social-section').hidden = !socials.children.length;
}
