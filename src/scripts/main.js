
import 'virtual:svg-icons-register'
if (import.meta.hot) {
  import.meta.hot.accept()
}
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { sortLabels } from './config/constants.js';

import { getFiltersFromURL, buildQuery } from './utils/url.js';
import { fetchProducts } from './services/api.js';
import { renderProducts } from './render/renderProducts.js';

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
const form = document.getElementById('filters');
const sortOptions = document.querySelectorAll('.sort-option');
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
