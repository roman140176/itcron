export const getFiltersFromURL = () => {
  const params = new URLSearchParams(location.search);
  return {
    isNew: params.get('isNew') === 'true',
    inStock: params.get('inStock') === 'true',
    isContract: params.get('isContract') === 'true',
    isExclusive: params.get('isExclusive') === 'true',
    isSale: params.get('isSale') === 'true',
    sort: params.get('sort') || 'desc_price',
  };
}

export const buildQuery = (filters) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === 'boolean' && value) {
      params.append(key, 'true');
    }
    if (key === 'sort') {
      params.append('sort', value);
    }
  }
  return params.toString();
}