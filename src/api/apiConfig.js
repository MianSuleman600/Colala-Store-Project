// src/api/apiConfig.js

// ---------------------------
// Safe Environment Accessors
// ---------------------------

const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const nodeEnv = (typeof process !== 'undefined' && process.env) ? process.env : {};
const isBrowser = typeof window !== 'undefined';

// Optional runtime override (for browser global)
const runtimeBase = isBrowser && typeof window.API_BASE === 'string' ? window.API_BASE : '';

// ---------------------------
// Resolve API Base URL
// ---------------------------
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

export const ASSETS_BASE = API_BASE.replace(/\/api$/, '');

// ---------------------------
// Auth Strategy: token only
// ---------------------------
export const AUTH_STRATEGY = 'token';

// ---------------------------
// Helper Functions
// ---------------------------
const encodeSeg = (v) => encodeURIComponent(String(v));
export const u = (path) => `${API_BASE}${ensureLeadingSlash(path)}`;
export const buildQuery = (params = {}) => {
  const pairs = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (!pairs.length) return '';
  return `?${pairs
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')}`;
};

// ---------------------------
// API Endpoints
// ---------------------------
export const ENDPOINTS = {

  SEARCH: (params = {}) => `${u('/search')}${buildQuery(params)}`,

  AUTH: {
    LOGIN: u('/auth/login'),
    SIGNUP: u('/auth/register'),
    LOGOUT: u('/auth/logout'),
    DELETE_ACCOUNT: u('/users/delete-account'),
    EDIT_PROFILE: u('/auth/edit-profile'), // ✅ Added
    PASSWORD: {
      RESET_REQUEST: u('/auth/forget-password'), // ✅ Corrected
      RESET_VERIFY: u('/auth/verify-otp'),      // ✅ Corrected
      RESET_CONFIRM: u('/auth/reset-password'), // ✅ Corrected
    },
  },


  SELLER_ONBOARDING: {
    START: u('/auth/seller/start'),
    LEVEL1: {
      PROFILE_MEDIA: u('/seller/onboarding/level1/profile-media'),
      CATEGORIES_SOCIAL: u('/seller/onboarding/level1/categories-social'),
    },
    LEVEL2: {
      BUSINESS_DETAILS: u('/seller/onboarding/level2/business-details'),
      DOCUMENTS: u('/seller/onboarding/level2/documents'),
    },
    LEVEL3: {
      PHYSICAL_STORE: u('/seller/onboarding/level3/physical-store'),
      UTILITY_BILL: u('/seller/onboarding/level3/utility-bill'),
      ADDRESS: u('/seller/onboarding/level3/address'),
      DELIVERY: u('/seller/onboarding/level3/delivery'),
      THEME: u('/seller/onboarding/level3/theme'),
    },
    STORE: {
      ADDRESSES: u('/seller/onboarding/store/addresses'),
      DELIVERY: u('/seller/onboarding/store/delivery'),
      SOCIAL_LINKS: u('/seller/onboarding/store/social-links'),
      CATEGORIES: u('/seller/onboarding/store/categories'),
      OVERVIEW: u('/seller/onboarding/store/overview'),
    },
    PROGRESS: u('/seller/onboarding/progress'),
    SUBMIT: u('/seller/onboarding/submit'),
    LEVEL_STATUS: (n) => u(`/seller/onboarding/onboarding/level/${encodeSeg(n)}`),
    CATALOG: {
      CATEGORIES: u('/seller/onboarding/catalog/categories'),
    },
  },

  STORE_BUILDER: u('/seller/store/builder'),

  SELLER_PRODUCTS: {
    MY_PRODUCTS: u('/seller/products/my-products'),
    LIST: u('/seller/products'),
    DETAIL: (id) => u(`/seller/products/${encodeSeg(id)}`), // Generic detail endpoint
    CREATE: u('/seller/products/create'),
    UPDATE: (id) => u(`/seller/products/update/${encodeSeg(id)}`),
    DELETE: (id) => u(`/seller/products/delete/${encodeSeg(id)}`),
    STATS: (id) => u(`/seller/products/${id}/stats`),
    STATS_TOTALS: (id) => u(`/seller/products/${id}/stats/totals`),
    MARK_SOLD: (id) => u(`/seller/products/${id}/mark-sold`),
    MARK_UNAVAILABLE: (id) => u(`/seller/products/${id}/mark-unavailable`),
    MARK_AVAILABLE: (id) => u(`/seller/products/${id}/mark-available`),

    // --- NEW: Granular Endpoints ---
    VARIANTS: {
      CREATE: (productId) => u(`/seller/products/${encodeSeg(productId)}/variants/create`),
      UPDATE: (productId, variantId) => u(`/seller/products/${encodeSeg(productId)}/variants/update/${encodeSeg(variantId)}`),
      DELETE: (productId, variantId) => u(`/seller/products/${encodeSeg(productId)}/variants/delete/${encodeSeg(variantId)}`),
    },
    BULK_PRICES: {
      STORE: (productId) => u(`/seller/products/${encodeSeg(productId)}/bulk-prices`),
    },
    DELIVERY_OPTIONS: {
      ATTACH: (productId) => u(`/seller/products/${encodeSeg(productId)}/delivery-options`),
    },
    BULK_UPLOAD: {
      TEMPLATE: u('/seller/products/bulk-upload/template'),
      CATEGORIES: u('/seller/products/bulk-upload/categories'),
      UPLOAD_FILE: u('/seller/products/bulk-upload/file'),
      JOBS: u('/seller/products/bulk-upload/jobs'),
      JOB_STATUS: (jobId) => u(`/seller/products/bulk-upload/jobs/${encodeSeg(jobId)}/status`),
    },
  },

  

  STORE_ANALYTICS: u('/seller/analytics'),

  SUPPORT: {
    // Add the 'buyer' prefix to match the backend routes.
    TICKETS: {
      LIST: u('/buyer/support/tickets'),
      CREATE: u('/buyer/support/tickets'),
      DETAIL: (id) => u(`/buyer/support/tickets/${encodeSeg(id)}`),
    },
    // This route is also under the buyer prefix.
    MESSAGES: {
      SEND: u('/buyer/support/messages'),
    },
  },

  CATALOG: {
    CATEGORIES: u('/seller/onboarding/catalog/categories'),
    BRANDS: u('/brands'),
    // This endpoint returns the seller's registered addresses
    LOCATIONS: u('/seller/onboarding/store/addresses'),
    // --- NEW: Added endpoint for delivery options ---
    DELIVERY_LOCATIONS: u('/seller/onboarding/store/delivery'),
  },

  BOOSTS: {
    LIST: u('/seller/boosts'),
    PREVIEW: u('/seller/boosts/preview'),
    CREATE: u('/seller/boosts'),
    DETAIL: (id) => u(`/seller/boosts/${encodeSeg(id)}`),
    UPDATE_STATUS: (id) => u(`/seller/boosts/${encodeSeg(id)}/status`),
    GET_METRICS: (id) => u(`/seller/boosts/${encodeSeg(id)}/metrics`),
  },


  SELLER_SERVICES: {
    MY_SERVICES: u('/seller/services/my-services'),
    LIST: u('/seller/service'),
    CREATE: u('/seller/service/create'),
    UPDATE: (id) => u(`/seller/service/update/${encodeSeg(id)}`),
    DELETE: (id) => u(`/seller/service/delete/${encodeSeg(id)}`),
    // --- MODIFICATION START ---
    STATS: (id) => u(`/seller/services/${id}/stats`),
    STATS_TOTALS: (id) => u(`/seller/services/${id}/stats/totals`), // <-- ADD THIS
    // --- MODIFICATION END ---
    MARK_SOLD: (id) => u(`/seller/services/${id}/mark-sold`),
    MARK_UNAVAILABLE: (id) => u(`/seller/services/${id}/mark-unavailable`),
    MARK_AVAILABLE: (id) => u(`/seller/services/${id}/mark-available`),
  },


  SELLER_CHAT: {
    LIST_CHATS: u('/seller/chat'),
    GET_MESSAGES: (chatId) => u(`/seller/chat/${encodeSeg(chatId)}/messages`),
    SEND_MESSAGE: (chatId) => u(`/seller/chat/${encodeSeg(chatId)}/send`),
  },


  SERVICE_CATEGORIES: {
    LIST: u('/service-categories'),
    DETAIL: (id) => u(`/service-categories/${encodeSeg(id)}`),
    UPDATE: (id) => u(`/service-categories/${encodeSeg(id)}`), // Assuming PUT for update
  },

  SELLER_ORDERS: {
    LIST: u('/seller/orders'),
    DETAIL: (id) => u(`/seller/orders/${encodeSeg(id)}`),
    MARK_OUT_FOR_DELIVERY: (id) => u(`/seller/orders/${encodeSeg(id)}/out-for-deliver`),
    MARK_DELIVERED: (id) => u(`/seller/orders/${encodeSeg(id)}/delivered`),
  },


  POSTS: {
    LIST: u('/posts'),
    DETAIL: (id) => u(`/posts/${encodeSeg(id)}`),
    CREATE: u('/posts'),
    UPDATE: (id) => u(`/posts/${encodeSeg(id)}`), // Using POST for updates as per your spec
    DELETE: (id) => u(`/posts/${encodeSeg(id)}`), // Assuming DELETE method
    LIKE: (id) => u(`/posts/${encodeSeg(id)}/like`),
    SHARE: (id) => u(`/posts/${encodeSeg(id)}/share`),
    COMMENTS: {
      LIST: (postId) => u(`/posts/${encodeSeg(postId)}/comments`),
      CREATE: (postId) => u(`/posts/${encodeSeg(postId)}/comments`),
    },
  },


  SELLER_ANNOUNCEMENTS: {
    LIST: u('/seller/announcements'),
    CREATE: u('/seller/announcements'),
    // FIX: Changed to PUT and includes the ID in the URL
    UPDATE: (id) => u(`/seller/announcements/${encodeSeg(id)}`),
    DELETE: (id) => u(`/seller/announcements/${encodeSeg(id)}`),
  },

  SELLER_BANNERS: {
    LIST: u('/seller/banners'),
    CREATE: u('/seller/banners'),
    // FIX: Changed to POST and includes the ID in the URL for FormData updates
    UPDATE: (id) => u(`/seller/banners/${encodeSeg(id)}`),
    DELETE: (id) => u(`/seller/banners/${encodeSeg(id)}`),
  },

  SELLER_COUPONS: {
    LIST: u('/seller/coupons'),
    CREATE: u('/seller/coupons'),
    UPDATE: (id) => u(`/seller/coupons/${encodeSeg(id)}`),
    DELETE: (id) => u(`/seller/coupons/${encodeSeg(id)}`),
    APPLY: (code) => u(`/seller/coupons/apply/${encodeSeg(code)}`),
  },

  // The old POINTS endpoints remain if they are still correct
  POINTS: {
    SUMMARY: u('/points/summary'),
    CUSTOMERS: u('/points/customers'),
    UPDATE_SETTINGS: u('/points/settings'),
  },

  PLANS: {
    LIST: u('/seller/plans'),
  },

  SUBSCRIPTIONS: {
    LIST: u('/seller/subscriptions'), // For the current user's subscription
    CREATE: u('/seller/subscriptions'),
    CANCEL: (id) => u(`/seller/subscriptions/${encodeSeg(id)}/cancel`),
  },
  // --- END MODIFICATION ---


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





  REVIEWS: {

    MY_REVIEWS: u('/user-reveiws'),


    // The following endpoints for updating/deleting specific reviews
    // are not in your main api.php, but are in the buyer group. Let's align them.
    STORE: {
      UPDATE: (storeId, reviewId) => u(`/buyer/stores/${storeId}/reviews/${reviewId}`),
      DELETE: (storeId, reviewId) => u(`/buyer/stores/${storeId}/reviews/${reviewId}`),
    },
    PRODUCT: {
      // The backend doesn't seem to have update/delete for product reviews,
      // so we'll comment these out for now.
      // UPDATE: (orderItemId) => u(`/buyer/order-items/${orderItemId}/review`),
      // DELETE: (reviewId) => u(`/buyer/product-reviews/${reviewId}`),
    }

  },
  ESCROW: {
    // Maps to GET /escrow
    SUMMARY: u('/escrow'),
  },
  REFERRALS: {
    WALLET: u('/referrals/wallet'),
    WALLET_SUMMARY: u('/wallet/refferal-balance'), // GET
    CODE: u('/referrals/code'),
    WITHDRAW: u('/wallet/withdraw/referral'),   // POST
    TRANSFER: u('/wallet/transfer'),            // POST
    TRANSACTIONS: (params = {}) => `${u('/referrals/transactions')}${buildQuery(params)}`,

    FAQS: u('/faqs/category/name/general'),

    PRODUCTS: (params = {}) => `${u('/referrals/products')}${buildQuery(params)}`,
  },

  ADS_WALLET: {
    WALLET: u('/ads/wallet'),
    TOPUP: u('/ads/wallet/topup'),
    TRANSACTIONS: (params = {}) => `${u('/ads/wallet/transactions')}${buildQuery(params)}`,
  },

  TRANSACTIONS: {
    LIST: u('/user/transactions'), // GET
  },

  LEADERBOARD: {
    SELLERS: u('/leaderboard/sellers'),
  },

  FAQS: {
    LIST: u('/faqs'), // General list of all FAQ categories
    // --- ADD THIS NEW ENDPOINT ---
    // Maps to GET /faqs/category/name/{name}
    BY_CATEGORY_NAME: (name) => u(`/faqs/category/name/${encodeSeg(name)}`),
  },

  ACCESS_CONTROL: {
    // Maps to: GET /seller/store/users
    LIST_USERS: u('/seller/store/users'),

    // Maps to: POST /seller/store/users/add
    ADD_USER: u('/seller/store/users/add'),

    // Maps to: DELETE /seller/store/users/{userId}
    REMOVE_USER: (userId) => u(`/seller/store/users/${encodeSeg(userId)}`),
  },


};