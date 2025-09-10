import { useQuery } from '@tanstack/react-query';
import { productService } from '../index.js';
import { normalizeProducts } from '../../utils/dataNormalizer.js';

const getToken = () =>
  (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

const extractProductsArray = (response) => {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== 'object') return [];

  const candidates = ['products', 'data', 'items', 'result', 'results', 'rows', 'list', 'content'];
  for (const key of candidates) {
    const val = response[key];
    if (Array.isArray(val)) return val;

    if (val && typeof val === 'object') {
      if (Array.isArray(val.items)) return val.items;
      if (Array.isArray(val.data)) return val.data;
      if (Array.isArray(val.results)) return val.results;
      if (Array.isArray(val.list)) return val.list;
      if (Array.isArray(val.content)) return val.content;
    }
  }

  for (const v of Object.values(response)) {
    if (Array.isArray(v)) return v;
  }
  return [];
};

// --- Categories ---
export const useCategories = (options = {}) =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => productService.getCategories(getToken()),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// --- Brands ---
export const useBrands = (options = {}) =>
  useQuery({
    queryKey: ['brands'],
    queryFn: async () => productService.getBrands(getToken()),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// --- Locations ---
export const useLocations = (options = {}) =>
  useQuery({
    queryKey: ['locations'],
    queryFn: async () => productService.getLocations(getToken()),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// --- My Products (user-scoped, robust parsing, normalized) ---
export const useGetMyProductsQuery = (userId, options = {}) =>
  useQuery({
    queryKey: ['myProducts', userId || 'anonymous'],
    queryFn: async () => {
      const token = getToken();
      const response = await productService.getProducts(token, { userId });
      const arr = extractProductsArray(response);
      return normalizeProducts(arr);
    },
    enabled: !!userId, // Only fetch when userId is available
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });

// --- Product Detail ---
export const useProductDetailsQuery = (productId, options = {}) =>
  useQuery({
    queryKey: ['productDetail', productId],
    queryFn: async () => {
      if (!productId) return null;
      const response = await productService.getProductDetail(productId, getToken());
      const [normalized] = normalizeProducts([response]);
      return normalized || null;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  // --- Store Products (public store view) ---
export const useStoreProductsQuery = (storeId, options = {}) =>
  useQuery({
    queryKey: ['storeProducts', storeId || 'unknown'],
    queryFn: async () => {
      const token = getToken();

      // Prefer a dedicated API if available, otherwise fall back to getProducts with a storeId filter
      let response;
      if (typeof productService.getStoreProducts === 'function') {
        response = await productService.getStoreProducts(storeId, token);
      } else {
        // Many backends support passing a storeId/sellerId filter object
        response = await productService.getProducts(token, { storeId });
      }

      const arr = extractProductsArray(response);
      return normalizeProducts(arr);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });