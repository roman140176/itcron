import { updateQuantity, removeFromCart, restoreItem } from './cart.js';
import { renderCart } from './renderCart.js';

export function initCartEvents() {
  const container = document.querySelector('.cart-popup__content');

  if (!container) return;

  container.addEventListener('click', (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains('cart-item__increase')) {
      updateQuantity(id, 1);
      renderCart();
    }

    if (e.target.classList.contains('cart-item__decrease')) {
      updateQuantity(id, -1);
      renderCart();
    }

    if (e.target.classList.contains('cart-remove')) {
      removeFromCart(id);
      renderCart();
    }

    if (e.target.classList.contains('cart-restore')) {
      restoreItem(id);
      renderCart();
    }
  });

  container.addEventListener('change', (e) => {
    if (e.target.classList.contains('cart-qty')) {
      const id = e.target.dataset.id;
      let value = parseInt(e.target.value, 10);
      if (isNaN(value) || value < 1) value = 1;
      e.target.value = value;
      updateQuantity(id, value);
      renderCart();
    }
  });
}
