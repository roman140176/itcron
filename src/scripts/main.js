
import 'virtual:svg-icons-register'
if (import.meta.hot) {
  import.meta.hot.accept()
}
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { sortLabels,API_URL } from './config/constants.js';
import { getFiltersFromURL, buildQuery } from './utils/url.js';
import { fetchProducts } from './services/api.js';
import { renderProducts } from './render/renderProducts.js';
import { initCartPopup, addToCart, initClearCartButton } from './cart/cart.js';
import { updateCartBadge } from './cart/updateTotals.js';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

new Swiper('.swiper', {
  loop: true,
  slidesPerView: 1,
  speed: 1000,  
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader'); 
  setTimeout(() => {
    if (preloader && preloader.parentNode) {
      preloader.parentNode.removeChild(preloader);
    }
  }, 400);
});

  // products
const container = document.querySelector('.catalog__content');
const aside = document.querySelector('.catalog__filters');
const form = document.getElementById('filters');
const sortOptions = document.querySelectorAll('.sort-option');
const menu = document.querySelector('.header__menu');
let currentSort = 'desc_price';

const loader = document.querySelector('.loader');
const countDisplay = document.getElementById('product-count');
const sortToggle = document.querySelector('.sort-toggle');
const sortDropdown = document.querySelector('.sort-dropdown');
const overlay = document.querySelector('.overlay');

sortToggle.addEventListener('click', () => {
  sortDropdown.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
});

overlay.addEventListener('click', () => {
  sortDropdown.classList.add('hidden');
  overlay.classList.add('hidden');
});

function applyFiltersToUI(filters) {
  for (const [key, value] of Object.entries(filters)) {
    const el = form.elements[key];
    if (el?.type === 'checkbox') {
      el.checked = value;
    }
  }

  sortOptions.forEach(o => {
    o.classList.toggle('active', o.dataset.sort === filters.sort);
  });

  currentSort = filters.sort;
  sortToggle.textContent = sortLabels[filters.sort] || 'Сортировка';
}

function collectFilters() {
  return {
    isNew: form.isNew.checked,
    inStock: form.inStock.checked,
    isContract: form.isContract.checked,
    isExclusive: form.isExclusive.checked,
    isSale: form.isSale.checked,
    sort: currentSort
  };
}

form.addEventListener('change', () => {
  const filters = collectFilters();
  history.pushState(filters, '', `?${buildQuery(filters)}`);
  fetchProducts(filters, loader).then(data => renderProducts(container, data, countDisplay));
});

sortOptions.forEach(option => {
  option.addEventListener('click', () => {
    sortOptions.forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    currentSort = option.dataset.sort;

    sortToggle.textContent = sortLabels[currentSort];
    sortDropdown.classList.add('hidden');
    overlay.classList.add('hidden');

    const filters = collectFilters();
    history.pushState(filters, '', `?${buildQuery(filters)}`);
    fetchProducts(filters, loader).then(data => renderProducts(container, data, countDisplay));
  });
});

window.addEventListener('popstate', (e) => {
  const filters = e.state || getFiltersFromURL();
  applyFiltersToUI(filters);
  fetchProducts(filters, loader).then(data => renderProducts(container, data, countDisplay));
});

document.addEventListener('DOMContentLoaded', async () => {
  const filters = getFiltersFromURL();
  applyFiltersToUI(filters);
  const products = await fetchProducts(filters, loader);
  renderProducts(container, products, countDisplay);
});

document.addEventListener('DOMContentLoaded', () => {
  initCartPopup();
  updateCartBadge();
  initClearCartButton();


  document.addEventListener('click', async (e) => {
    const target = e.target;

    // Добавление товара в корзину
    if (target.classList.contains('product-card__btn')) {
      const id = target.dataset.id;
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);

        const product = await res.json();
        if (!product?.id) throw new Error('Некорректные данные товара');

        addToCart(product);

        Toastify({
          text: "Товар добавлен в корзину",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();

      } catch (err) {
        console.error('Ошибка добавления товара:', err);
        Toastify({
          text: "Ошибка при добавлении товара",
          duration: 4000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#e74c3c",
        }).showToast();
      }
      return;
    }

    // Открытие фильтров
    if (target.closest('.catalog__content-filter')) {
      aside.classList.toggle('active');
      document.body.classList.toggle('overflow');
      return;
    }

    // Закрытие фильтров
    if (target.closest('.catalog__filters-overlay') || target.closest('.catalog__filters-close')) {
      aside.classList.remove('active');
      document.body.classList.remove('overflow');
      return;
    }

    // Открытие/закрытие бургер-меню
    if (target.closest('.header__burger')) {
      const burger = target.closest('.header__burger');
      burger.classList.toggle('active');
      menu.classList.toggle('active');
    }
  });

});

let startY = 0;
let isSwiping = false;

const filters = document.querySelector('.catalog__filters');

filters.addEventListener('touchstart', (e) => {
  if (filters.classList.contains('active')) {
    startY = e.touches[0].clientY;
    isSwiping = true;
  }
});

filters.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;

  const deltaY = e.touches[0].clientY - startY;

  // Свайп вниз больше 80px — закрываем
  if (deltaY > 80) {
    filters.classList.remove('active');
    document.body.classList.remove('overflow'); // если было отключено скролл
    isSwiping = false;
  }
});

filters.addEventListener('touchend', () => {
  isSwiping = false;
});

