// src/services/queries/useproductsQuery.js

import { useQuery } from '@tanstack/react-query';
import { productService } from '../productService.js'; 
import { normalizeProducts } from '../../utils/dataNormalizer.js';

// --- My Products (user-scoped, points to the correct endpoint) ---
// This is the ONLY hook that fetches a list of products.
export const useGetMyProductsQuery = (userId, options = {}) =>
  useQuery({
    queryKey: ['myProducts', userId],
    queryFn: async () => {
      const response = await productService.getProducts();
      const productsArray = response?.data || [];
      return normalizeProducts(productsArray);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// --- Product Detail (Now uses the correct data path) ---
export const useProductDetailsQuery = (productId, options = {}) =>
  useQuery({
    queryKey: ['productDetail', productId],
    queryFn: async () => {
      if (!productId) return null;
      const response = await productService.getProductDetail(productId);
      const productData = response?.data;
      const [normalized] = normalizeProducts(productData ? [productData] : []);
      return normalized || null;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// --- Product Stats Hook ---
export const useProductStatsQuery = (productId, options = {}) =>
  useQuery({
    queryKey: ['productStats', productId],
    queryFn: async () => {
      if (!productId) return null;

      const [detailsRes, chartRes, totalsRes] = await Promise.all([
        productService.getProductDetail(productId),
        productService.getProductStats(productId),
        productService.getProductStatTotals(productId),
      ]);

      const chartData = (chartRes?.data || []).map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Impressions: d.impression || 0,
        Visitors: d.view || 0,
        Orders: d.order || 0,
      }));

      return {
        name: detailsRes?.data?.name || 'Product',
        chartData: chartData,
        totals: totalsRes?.data || {},
      };
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// --- REMOVED useStoreProductsQuery ---