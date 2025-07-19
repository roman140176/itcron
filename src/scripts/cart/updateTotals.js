import { getCart } from './cartStorage.js';

export function updateCartBadge() {
  const cart = getCart();
  const cartBtn = document.getElementById('cart');

  const count = Object.values(cart).reduce((sum, item) => {
    if (item.deleted) return sum;
    return sum + item.quantity;
  }, 0);

  const total = count > 0 ? count : '0';
  cartBtn.textContent = total;
}

export function calculateTotals() {
  const cart = getCart();

  return Object.values(cart)
    .filter(item => !item.deleted)
    .reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity;
        acc.totalPrice += item.price * item.quantity;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 }
    );
}
