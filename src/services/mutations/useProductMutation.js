import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../index.js';
import { normalizeProducts } from '../../utils/dataNormalizer.js';

const getToken = () =>
  (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

/**
 * Add a new product with optimistic update (user-scoped)
 */
export const useAddProduct = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myProducts', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (payload) =>
      productService.addProduct(payload, getToken(), { userId }),
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previousProducts = queryClient.getQueryData(key) || [];
      // Ensure ownerId is set for optimistic item
      const optimisticProduct = normalizeProducts([{ ownerId: userId, ...newProduct }])[0];
      queryClient.setQueryData(key, (old = []) => [optimisticProduct, ...old]);
      return { previousProducts };
    },
    onError: (error, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(key, context.previousProducts);
      }
      options.onError?.(error);
    },
    onSuccess: (data) => {
      const normalized = normalizeProducts([data])[0];
      queryClient.setQueryData(key, (old = []) =>
        [normalized, ...old.filter((p) => p.id !== normalized.id)]
      );
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

/**
 * Bulk upload multiple products (user-scoped)
 */
export const useBulkUploadProducts = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myProducts', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (fileOrList) =>
      productService.bulkUploadProducts(fileOrList, getToken(), { userId }),
    onSuccess: (data) => {
      const normalized = normalizeProducts(data || []);
      // Merge into cache without duplicates by id
      queryClient.setQueryData(key, (old = []) => {
        const map = new Map((old || []).map((p) => [p.id, p]));
        normalized.forEach((p) => map.set(p.id, p));
        return Array.from(map.values());
      });
      options.onSuccess?.(normalized);
    },
    onError: (error) => options.onError?.(error),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

/**
 * Update a product (user-scoped)
 */
export const useUpdateProduct = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myProducts', userId || 'anonymous'];

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      if (!id) throw new Error('Missing product id.');
      return productService.updateProduct(id, payload, getToken());
    },
    onSuccess: (data) => {
      const normalized = normalizeProducts([data])[0];
      queryClient.setQueryData(key, (old = []) =>
        old.map((p) => (p.id === normalized.id ? normalized : p))
      );
      options.onSuccess?.(normalized);
    },
    onError: (error) => options.onError?.(error),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

/**
 * Delete a product (user-scoped)
 */
export const useDeleteProduct = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myProducts', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (id) => {
      if (!id) throw new Error('Missing product id.');
      return productService.deleteProduct(id, getToken());
    },
    onSuccess: (_resp, id) => {
      queryClient.setQueryData(key, (old = []) => old.filter((p) => p.id !== id));
      options.onSuccess?.();
    },
    onError: (error) => options.onError?.(error),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};