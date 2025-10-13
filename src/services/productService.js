// src/services/productService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

export const productService = {
  // --- CORE PRODUCT ---
  getProducts: () => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.MY_PRODUCTS, method: 'GET' }),
  getProductDetail: (id) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.DETAIL(id), method: 'GET' }),
  addProduct: (payload) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.CREATE, method: 'POST', data: payload }),
  updateProduct: (id, payload) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.UPDATE(id), method: 'POST', data: payload }),
  deleteProduct: (id) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.DELETE(id), method: 'DELETE' }),

  // --- STATS ---
  getProductStats: (id) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.STATS(id), method: 'GET' }),
  getProductStatTotals: (id) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.STATS_TOTALS(id), method: 'GET' }),

  // --- STATUS ---
  markAsSold: (id) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.MARK_SOLD(id), method: 'POST' }),
  markAsUnavailable: (id) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.MARK_UNAVAILABLE(id), method: 'POST' }),
  markAsAvailable: (id) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.MARK_AVAILABLE(id), method: 'POST' }),

  // --- NEW: GRANULAR SERVICES ---
  createVariant: (productId, payload) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.VARIANTS.CREATE(productId), method: 'POST', data: payload }),
  updateVariant: (productId, variantId, payload) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.VARIANTS.UPDATE(productId, variantId), method: 'POST', data: payload }),
  deleteVariant: (productId, variantId) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.VARIANTS.DELETE(productId, variantId), method: 'DELETE' }),

  updateBulkPrices: (productId, payload) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.BULK_PRICES.STORE(productId), method: 'POST', data: { prices: payload } }),
  updateDeliveryOptions: (productId, payload) => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.DELIVERY_OPTIONS.ATTACH(productId), method: 'POST', data: { delivery_option_ids: payload } }),

  // --- BULK UPLOAD ---
  getBulkUploadTemplate: () => apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.BULK_UPLOAD.TEMPLATE, method: 'GET' }),
  uploadBulkFile: (file) => {
    const formData = new FormData();
    formData.append('csv_file', file);
    return apiRequest({ url: ENDPOINTS.SELLER_PRODUCTS.BULK_UPLOAD.UPLOAD_FILE, method: 'POST', data: formData });
  },
};