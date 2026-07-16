const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Backend requires encryption=false on every request (see reference/auth-ref postman collection).
const api = (path: string) => {
  const base = BASE_URL.trim().endsWith('/') ? BASE_URL.trim() : `${BASE_URL.trim()}/`;
  const cleanPath = path.trim().startsWith('/') ? path.trim().substring(1) : path.trim();
  return `${base}${cleanPath}?encryption=false`;
};

// Group endpoints by domain. Add a new top-level key per domain/resource.
// Static endpoints are plain strings; endpoints needing a param are functions.
export const urlApi = {
  auth: {
    otpSend: api('auth/otp-send'),
    login: api('auth/login'),
    autoLogin: api('auth/auto-login'),
  },

  dashboard: {
    search: api('dashboard/search'),
    banners: api('dashboard/data/banners'),
  },

  wallet: {
    getBalance: api('wallet'),
    addMoney: api('wallet/add-money'),
    history: api('wallet/history'),
  },

  astrologer: {
    list: api('astrologer/list'),
  },

  user: {
    updateProfile: api('user'),
  },

  chatProfile: {
    list: api('user/chat-profile'),
    create: api('user/chat-profile'),
    detail: (id: string) => api(`user/chat-profile/${id}`),
  },

  address: {
    list: api('user/address'),
    create: api('user/address'),
    detail: (id: string) => api(`user/address/${id}`),
    setDefault: (id: string) => api(`user/address/default/${id}`),
  },

  media: {
    uploadProfilePic: api('upload/profile-pic'),
  },

  // example:
  // product: {
  //   getProducts: api('product'),
  //   getProductDetails: (id: string) => api(`product/${id}`),
  // },
};
