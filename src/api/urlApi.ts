const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = (path: string) => {
  const base = BASE_URL.trim().endsWith('/') ? BASE_URL.trim() : `${BASE_URL.trim()}/`;
  const cleanPath = path.trim().startsWith('/') ? path.trim().substring(1) : path.trim();
  return `${base}${cleanPath}`;
};

// Group endpoints by domain. Add a new top-level key per domain/resource.
// Static endpoints are plain strings; endpoints needing a param are functions.
export const urlApi = {
  auth: {
    login: api('auth/login'),
  },

  // example:
  // product: {
  //   getProducts: api('product'),
  //   getProductDetails: (id: string) => api(`product/${id}`),
  // },
};
