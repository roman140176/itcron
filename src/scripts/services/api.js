import { API_URL } from '../config/constants.js';
import { showLoader, hideLoader } from '../utils/loader.js';
export const  fetchProducts = async (filters,loader) =>{
  showLoader(loader)
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
  hideLoader(loader)
  return await res.json();
}