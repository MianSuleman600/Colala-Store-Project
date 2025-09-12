// src/services/productService.js
import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';
import dummyProducts from '../utils/data/dummyProducts.js';
import { USE_DUMMY_DATA } from '../utils/config.js';

// --- Dummy Service ---
const dummyProductService = {
  getCategories: async () =>
    Promise.resolve(['Electronics', 'Fashion', 'Home', 'Sports']),

  getBrands: async () =>
    Promise.resolve(['Apple', 'Samsung', 'Nike', 'Sony']),

  getLocations: async () =>
    Promise.resolve(['New York', 'Los Angeles', 'London', 'Dubai']),

  getProducts: async () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            products: dummyProducts,
            message: 'Dummy products fetched successfully.',
          }),
        300
      )
    ),

  getProductDetail: async (id) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = dummyProducts.find((p) => p.id === id || p.id === String(id));
        product
          ? resolve({ product, message: 'Dummy product detail fetched successfully.' })
          : reject(new Error(`Product with id ${id} not found (dummy).`));
      }, 300);
    }),

  addProduct: async (payload) => {
    const newProduct = {
      ...payload,
      id: `prod-${Date.now()}`,
      status: payload?.status || 'available',
    };
    dummyProducts.unshift(newProduct);
    return { success: true, product: newProduct, message: 'Product added successfully (dummy).' };
  },

  bulkUploadProducts: async () =>
    Promise.resolve({ success: true, message: 'Bulk upload simulated (dummy).' }),

  updateProduct: async (id, payload) => {
    const index = dummyProducts.findIndex((p) => p.id === id || p.id === String(id));
    if (index === -1) return { success: false, message: 'Product not found (dummy).' };

    // Only allow known statuses
    const patch = { ...payload };
    if (typeof patch.status === 'string') {
      const s = patch.status.toLowerCase();
      if (!['available', 'unavailable', 'sold'].includes(s)) delete patch.status;
      else patch.status = s;
    }

    dummyProducts[index] = { ...dummyProducts[index], ...patch };
    return { success: true, product: dummyProducts[index], message: 'Product updated successfully (dummy).' };
  },

  deleteProduct: async (id) => {
    const index = dummyProducts.findIndex((p) => p.id === id || p.id === String(id));
    if (index === -1) return { success: false, message: 'Product not found (dummy).' };
    dummyProducts.splice(index, 1);
    return { success: true, message: 'Product deleted successfully (dummy).' };
  },
};

// --- Real API Service ---
const apiProductService = {
  getCategories: async () =>
    apiRequest({ url: `${ENDPOINTS.PRODUCTS.LIST}/categories`, method: 'GET' }),

  getBrands: async () =>
    apiRequest({ url: `${ENDPOINTS.PRODUCTS.LIST}/brands`, method: 'GET' }),

  getLocations: async () =>
    apiRequest({ url: `${ENDPOINTS.PRODUCTS.LIST}/locations`, method: 'GET' }),

  getProducts: async () =>
    apiRequest({ url: ENDPOINTS.PRODUCTS.LIST, method: 'GET' }),

  getProductDetail: async (id) =>
    apiRequest({ url: ENDPOINTS.PRODUCTS.DETAIL(id), method: 'GET' }),

  addProduct: async (payload, token) =>
    apiRequest({
      url: ENDPOINTS.PRODUCTS.CREATE,
      method: 'POST',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    }),

  bulkUploadProducts: async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest({
      url: `${ENDPOINTS.PRODUCTS.LIST}/bulk-upload/`,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProduct: async (id, payload, token) =>
    apiRequest({
      url: ENDPOINTS.PRODUCTS.UPDATE(id),
      method: 'PATCH',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteProduct: async (id, token) =>
    apiRequest({
      url: ENDPOINTS.PRODUCTS.DELETE(id),
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// --- Export service based on global dummy flag ---
export const productService = USE_DUMMY_DATA ? dummyProductService : apiProductService;