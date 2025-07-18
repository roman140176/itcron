
import { pluralize } from '../utils/pluralize.js';
export const  renderProducts = (container, products, countDisplay) => {
  container.innerHTML = '';

  const count = Array.isArray(products) ? products.length : 0;
  countDisplay.textContent = pluralize(count, 'товар', 'товара', 'товаров');

  if (!count) {
    container.innerHTML = '<p>Нет товаров</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.id = product.id;

    const hasDiscount = product.oldPrice && product.oldPrice > product.price;

    card.innerHTML = `
      <div class="product-card__image">
        <picture>
          <source srcset="/assets/images/${product.image}.avif 1x, /assets/images/${product.image}@2x.avif 2x" type="image/avif">
          <img src="/assets/images/${product.image}.jpg" alt="${product.title}">
        </picture>
      </div>
      <h3 class="product-card__title">${product.title}</h3>
      <p class="product-card__price">
        ${hasDiscount
          ? `<span class="product-card__price-old">${product.oldPrice} ₽</span>
             <span class="product-card__price-new">${product.price} ₽</span>`
          : `<span class="product-card__price-new">${product.price} ₽</span>`
        }
        <button class="product-card__btn" data-id="${product.id}"></button>
      </p>
      <ul class="product-card__features">          
        ${product.isNew ? '<li class="product-card__feature product-card__feature--new">Новинка</li>' : ''}
        ${product.isSale ? '<li class="product-card__feature product-card__feature--sale">Акция</li>' : ''}
        ${product.isContract ? '<li class="product-card__feature product-card__feature--contract">Контракт</li>' : ''}
        ${product.isExclusive ? '<li class="product-card__feature product-card__feature--exclusive">Эксклюзив</li>' : ''}          
      </ul>
    `;

    container.appendChild(card);
  });
}