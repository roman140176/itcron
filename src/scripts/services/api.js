import { API_URL } from '../config/constants.js';
import { showLoader, hideLoader } from '../utils/loader.js';
export const fetchProducts = async (filters, loader) => {
  try {
    showLoader(loader);

    const url = new URL(API_URL);

    ['isNew', 'inStock', 'isContract', 'isExclusive', 'isSale'].forEach(key => {
      if (filters[key]) {
        url.searchParams.append(key, 'true');
      }
    });

    if (filters.sort) {
      const [order, field] = filters.sort.split('_');
      url.searchParams.append('sortBy', field);
      url.searchParams.append('order', order);
    }

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error('Получены некорректные данные');
    }

    return data;
  } catch (err) {
    console.error('Ошибка при загрузке товаров:', err);
    // alert('Не удалось загрузить товары. Попробуйте позже.');
    return [];
  } finally {
    hideLoader(loader);
  }
};
