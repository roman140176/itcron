export const showLoader = (loader) => {
  loader.classList.remove('hidden');
}

export const hideLoader = (loader) => {
  loader.classList.add('hidden');
}
export const showOverlay = (overlay) => {
  overlay.classList.remove('active');
}
export const hideOverlay = (overlay) => {
  overlay.classList.add('active');
}

