// src/api/apiConfig.js

// Safe env accessors
const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const nodeEnv = (typeof process !== 'undefined' && process.env) ? process.env : {};
const isBrowser = typeof window !== 'undefined';

// Optional runtime override
const runtimeBase = isBrowser && typeof window.__API_BASE__ === 'string' ? window.__API_BASE__ : '';

// Resolve API base URL
const rawBase =
  viteEnv.VITE_API_BASE_URL ||
  nodeEnv.VITE_API_BASE_URL ||
  runtimeBase ||
  'http://localhost';

// Normalize URLs
const stripTrailingSlashes = (s) => (s ? String(s).replace(/\/+$/, '') : '');
const ensureLeadingSlash = (s) => (s?.startsWith('/') ? s : `/${s}`);

export const API_BASE = stripTrailingSlashes(rawBase);
export const SITE_BASE = API_BASE.replace(/\/api$/i, '');

// Auth strategy: 'token' (JWT/Passport) or 'sanctum'
const envAuth =
  viteEnv.VITE_AUTH_STRATEGY ||
  nodeEnv.VITE_AUTH_STRATEGY ||
  '';

export const AUTH_STRATEGY =
  envAuth ||
  (isBrowser && window.location && window.location.hostname === 'localhost'
    ? 'token'
    : 'sanctum');

// Helpers
const encodeSeg = (v) => encodeURIComponent(String(v));
const u = (path) => `${API_BASE}${ensureLeadingSlash(path)}`;
const buildQuery = (params = {}) => {
  const pairs = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (!pairs.length) return '';
  return `?${pairs
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')}`;
};

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: u('/auth/login'),
    SIGNUP: u('/auth/signup'),
    LOGOUT: u('/auth/logout'),
    REFRESH: u('/auth/refresh'),
    CSRF_COOKIE: `${SITE_BASE}/sanctum/csrf-cookie`,
    USER: u('/user'),
    PASSWORD: {
      RESET_REQUEST: u('/auth/password/reset/request'),
      RESET_VERIFY: u('/auth/password/reset/verify'),
      RESET_CONFIRM: u('/auth/password/reset/confirm'),
    },
  },

  PRODUCTS: {
    LIST: u('/products'),
    DETAIL: (id) => u(`/products/${encodeSeg(id)}`),
    CREATE: u('/products'),
    UPDATE: (id) => u(`/products/${encodeSeg(id)}`),
    DELETE: (id) => u(`/products/${encodeSeg(id)}`),
  },

  USERS: {
    PROFILE: u('/users/profile'),
    UPDATE_PROFILE: u('/users/profile/update'),
    UPLOAD_AVATAR: u('/users/profile/avatar'),
    DELETE_ACCOUNT: u('/users/delete-account'),
  },

  PROMOTIONS: {
    LIST: u('/promotions'),
    DETAIL: (id) => u(`/promotions/${encodeSeg(id)}`),
    CREATE: u('/promotions'),
    UPDATE: (id) => u(`/promotions/${encodeSeg(id)}`),
    DELETE: (id) => u(`/promotions/${encodeSeg(id)}`),
    EXTEND: (id) => u(`/promotions/${encodeSeg(id)}/extend`),
    PAUSE: (id) => u(`/promotions/${encodeSeg(id)}/pause`),
    RESUME: (id) => u(`/promotions/${encodeSeg(id)}/resume`),
  },

  CHAT: {
    GET_ALL: u('/chats'),
    GET_BY_ID: (id) => u(`/chats/${encodeSeg(id)}`),
    SEND: (chatId) => u(`/chats/${encodeSeg(chatId)}/messages`),
    UPDATE: (chatId, messageId) =>
      u(`/chats/${encodeSeg(chatId)}/messages/${encodeSeg(messageId)}`),
    DELETE: (chatId, messageId) =>
      u(`/chats/${encodeSeg(chatId)}/messages/${encodeSeg(messageId)}`),
  },

  FEED: {
    GET_ALL: u('/posts'),
    DETAIL: (id) => u(`/posts/${encodeSeg(id)}`),
    CREATE: u('/posts'),
    UPDATE: (id) => u(`/posts/${encodeSeg(id)}`),
    DELETE: (id) => u(`/posts/${encodeSeg(id)}`),
    CREATE_COMMENT: (postId) => u(`/posts/${encodeSeg(postId)}/comments`),
    UPDATE_COMMENT: (postId, commentId) =>
      u(`/posts/${encodeSeg(postId)}/comments/${encodeSeg(commentId)}`),
    DELETE_COMMENT: (postId, commentId) =>
      u(`/posts/${encodeSeg(postId)}/comments/${encodeSeg(commentId)}`),
  },

  ORDERS: {
    GET_ALL: (status) => `${u('/orders')}${buildQuery({ status })}`,
    DETAIL: (id) => u(`/orders/${encodeSeg(id)}`),
    CREATE: u('/orders'),
    UPDATE: (id) => u(`/orders/${encodeSeg(id)}`),
    DELETE: (id) => u(`/orders/${encodeSeg(id)}`),
  },

  COUPONS: {
    GET_ALL: u('/coupons'),
    DETAIL: (id) => u(`/coupons/${encodeSeg(id)}`),
    CREATE: u('/coupons'),
    UPDATE: (id) => u(`/coupons/${encodeSeg(id)}`),
    DELETE: (id) => u(`/coupons/${encodeSeg(id)}`),
  },

  POINTS: {
    SUMMARY: u('/points/summary'),
    CUSTOMERS: u('/points/customers'),
    UPDATE_SETTINGS: u('/points/settings'),
  },

  ANNOUNCEMENTS: {
    LIST: u('/announcements'),
    DETAIL: (id) => u(`/announcements/${encodeSeg(id)}`),
    CREATE: u('/announcements'),
    UPDATE: (id) => u(`/announcements/${encodeSeg(id)}`),
    DELETE: (id) => u(`/announcements/${encodeSeg(id)}`),
    ACTIVE: (params = {}) => `${u('/announcements/active')}${buildQuery(params)}`,
    TRACK_IMPRESSION: (id) => u(`/announcements/${encodeSeg(id)}/impression`),
  },

  BANNERS: {
    LIST: (params = {}) => `${u('/banners')}${buildQuery(params)}`,
    DETAIL: (id) => u(`/banners/${encodeSeg(id)}`),
    CREATE: u('/banners'),
    UPDATE: (id) => u(`/banners/${encodeSeg(id)}`),
    DELETE: (id) => u(`/banners/${encodeSeg(id)}`),
    ACTIVE: (params = {}) => `${u('/banners/active')}${buildQuery(params)}`,
    TRACK_IMPRESSION: (id) => u(`/banners/${encodeSeg(id)}/impression`),
  },

  REVIEWS: {
    STORE: {
      LIST: (params = {}) => `${u('/reviews/store')}${buildQuery(params)}`,
      DETAIL: (id) => u(`/reviews/store/${encodeSeg(id)}`),
      CREATE: u('/reviews/store'),
      UPDATE: (id) => u(`/reviews/store/${encodeSeg(id)}`),
      DELETE: (id) => u(`/reviews/store/${encodeSeg(id)}`),
    },
    PRODUCT: {
      LIST: (params = {}) => `${u('/reviews/product')}${buildQuery(params)}`,
      DETAIL: (id) => u(`/reviews/product/${encodeSeg(id)}`),
      CREATE: u('/reviews/product'),
      UPDATE: (id) => u(`/reviews/product/${encodeSeg(id)}`),
      DELETE: (id) => u(`/reviews/product/${encodeSeg(id)}`),
    },
  },

  REFERRALS: {
    WALLET: u('/referrals/wallet'),
    CODE: u('/referrals/code'),
    WITHDRAW: u('/referrals/withdraw'),
    TRANSFER: u('/referrals/transfer'),
    TRANSACTIONS: (params = {}) => `${u('/referrals/transactions')}${buildQuery(params)}`,
    FAQS: u('/referrals/faqs'),
    PRODUCTS: (params = {}) => `${u('/referrals/products')}${buildQuery(params)}`,
  },
   ADS_WALLET: {
    WALLET: u('/ads/wallet'),
    TOPUP: u('/ads/wallet/topup'),
    TRANSACTIONS: (params = {}) => `${u('/ads/wallet/transactions')}${buildQuery(params)}`,
  },

  SUPPORT: {
    CHATS: {
      LIST: u('/chats'),
      DETAIL: (id) => u(`/chats/${encodeSeg(id)}`),
      SEND: (id) => u(`/chats/${encodeSeg(id)}/messages`),
      UPDATE: (id, msgId) => u(`/chats/${encodeSeg(id)}/messages/${encodeSeg(msgId)}`),
      DELETE: (id, msgId) => u(`/chats/${encodeSeg(id)}/messages/${encodeSeg(msgId)}`),
    },
    TICKETS: {
      CREATE: u('/support/tickets'),
    },
  },

  LEADERBOARD: {
    SELLERS: (params = {}) => `${u('/leaderboard/sellers')}${buildQuery(params)}`,
    FAQS: u('/leaderboard/faqs'),
  },

  ACCESS_CONTROL: {
    USERS: {
      LIST: u('/access/users'),
      DETAIL: (id) => u(`/access/users/${encodeSeg(id)}`),
      CREATE: u('/access/users'),
      UPDATE: (id) => u(`/access/users/${encodeSeg(id)}`),
      DELETE: (id) => u(`/access/users/${encodeSeg(id)}`),
      ASSIGN_ROLE: (id) => u(`/access/users/${encodeSeg(id)}/role`),
    },
    ROLES: { LIST: u('/access/roles') },
    INVITE: u('/access/invite'),
  },
};

// Optional: log in dev
try {
  const isDev =
    (typeof viteEnv.DEV !== 'undefined' && viteEnv.DEV) ||
    (typeof nodeEnv.NODE_ENV !== 'undefined' && nodeEnv.NODE_ENV !== 'production');

  if (isDev && typeof console !== 'undefined') {
    console.log('Loaded API Base URL:', API_BASE);
    console.log('Auth strategy:', AUTH_STRATEGY);
  }
} catch {}