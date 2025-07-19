import { getCart, saveCart, clearCart} from './cartStorage.js';
import { renderCart } from './renderCart.js';
import { updateCartBadge } from './updateTotals.js';

export function addToCart(product) {
  const cart = getCart();
  const id = product.id;

  if (cart[id]) {
    if (!cart[id].deleted) cart[id].quantity += 1;
    cart[id].deleted = false;
  } else {
    cart[id] = { ...product, quantity: 1, deleted: false };
  }

  saveCart(cart);
  updateCartBadge();
}

export function removeFromCart(id) {
  const cart = getCart();
  if (cart[id]) {
    cart[id].deleted = true;
    saveCart(cart);
    updateCartBadge();
  }
}

export function restoreItem(id) {
  const cart = getCart();
  if (cart[id]) {
    cart[id].deleted = false;
    saveCart(cart);
    updateCartBadge();
  }
}

export function updateQuantity(id, delta) {
  const cart = getCart();
  if (cart[id]) {
    cart[id].quantity = Math.max(1, cart[id].quantity + delta);
    saveCart(cart);
    updateCartBadge();
  }
}

export function setQuantity(id, newQty) {
  const cart = getCart();
  if (cart[id]) {
    cart[id].quantity = Math.max(1, newQty);
    saveCart(cart);
    updateCartBadge();
  }
}

export function initCartPopup() {
  const cartBtn = document.getElementById('cart');
  const popup = document.querySelector('.cart-popup');
  
  cartBtn.addEventListener('click', () => {
    const count = parseInt(cartBtn.textContent.trim(), 10);
    if (!count) return; // блокируем открытие, если корзина пуста
    renderCart();
    popup.classList.add('visible');
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-popup__close') || e.target.classList.contains('cart-popup__overlay')) {
      popup.classList.remove('visible');
    }
  });
}
export function initClearCartButton() {
  const clearBtn = document.querySelector('.cart-popup__clear');
  if (!clearBtn) return;

  clearBtn.addEventListener('click', () => {
    clearCart();
    renderCart();
    updateCartBadge();
  });
}