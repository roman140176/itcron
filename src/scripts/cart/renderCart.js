import { getCart } from './cartStorage.js';
import {  updateQuantity, removeFromCart, restoreItem, setQuantity } from './cart.js';
import { pluralize } from '../utils/pluralize.js';

export function renderCart() {
  const container = document.querySelector('.cart-popup__content');
  const summary = document.querySelector('.cart-popup__summary');
  const cartCount = document.querySelector('.cart-popup__count');

  const cart = getCart();
  const items = Object.values(cart);

  container.innerHTML = '';
  summary.innerHTML = '';

  let total = 0;
  let count = 0;

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'cart-item';
    if (item.deleted) card.classList.add('cart-item--deleted', 'noevent');

    const itemTotal = item.price * item.quantity;

    if (!item.deleted) {
      total += itemTotal;
      count += item.quantity;
    }

    card.innerHTML = `
      <div class="cart-item__image-box">
        <img src="/assets/images/${item.image}.jpg" class="cart-item__image">
      </div>
      <div class="cart-item__info">
        <div class="cart-item__info-box">
          <h4>${item.title}</h4>
          <div class="cart-item__prices">
            ${item.oldPrice ? `<span class="cart-item__price-old">${item.oldPrice}</span>` : ''}
            <span class="cart-item__price">${item.price} ₽</span>
          </div>        
        </div>
        <div class="cart-item__controls">
          <button class="cart-item__decrease" data-id="${item.id}">-</button>
          <input type="number" id="qty-${item.id}" name="qty" min="1" class="cart-item__qty cart-qty" data-id="${item.id}" value="${item.quantity}">
          <button class="cart-item__increase" data-id="${item.id}">+</button>
          <button class="${item.deleted ? 'cart-restore' : 'cart-remove'}" data-id="${item.id}" area-label="${item.deleted ? 'восстановить' : 'удалить'}">            
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.cart-item__increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      updateQuantity(id, 1);
      renderCart();
    });
  });

  container.querySelectorAll('.cart-item__decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      updateQuantity(id, -1);
      renderCart();
    });
  });

  container.querySelectorAll('.cart-qty').forEach(input => {
    input.addEventListener('change', () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      input.value = val;

      const id = input.dataset.id;
      setQuantity(id, val);
      renderCart();
    });
  });

  container.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      removeFromCart(id);
      renderCart();
    });
  });

  container.querySelectorAll('.cart-restore').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      restoreItem(id);
      renderCart();
    });
  });

  summary.innerHTML = `<span class="cart-popup__summary-title">Итого</span><span class="cart-popup__summary-total">${total} ₽</span>`;
  cartCount.textContent = pluralize(count, 'товар', 'товара', 'товаров');
}
