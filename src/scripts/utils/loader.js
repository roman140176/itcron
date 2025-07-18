export const showLoader = (loader) => {
  loader.classList.remove('hidden');
}

export const hideLoader = (loader) => {
  loader.classList.add('hidden');
}