// src/services/mutations/useProductMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../index.js';

const getToken = () =>
  (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

const takeItem = (res) => res?.product || res?.data || res || null;

/**
 * Add a new product with optimistic update (user-scoped)
 */
export const useAddProduct = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myProducts', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (payload) => productService.addProduct(payload, getToken(), { userId }),
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key) || [];
      const optimistic = { ownerId: userId, status: 'available', ...newProduct, id: newProduct?.id || `tmp-${Date.now()}` };
      queryClient.setQueryData(key, (old = []) => [optimistic, ...old]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
      options.onError?.(_err);
    },
    onSuccess: (resp) => {
      const item = takeItem(resp);
      if (!item?.id) return queryClient.invalidateQueries({ queryKey: key });
      queryClient.setQueryData(key, (old = []) => {
        const withoutTmp = old.filter((p) => p.id !== item.id && !String(p.id).startsWith('tmp-'));
        return [item, ...withoutTmp];
      });
      options.onSuccess?.(item);
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
    mutationFn: async (fileOrList) => productService.bulkUploadProducts(fileOrList, getToken(), { userId }),
    onSuccess: (resp) => {
      const list = Array.isArray(resp) ? resp : resp?.products || [];
      queryClient.setQueryData(key, (old = []) => {
        const map = new Map((old || []).map((p) => [p.id, p]));
        list.forEach((p) => {
          if (p?.id) map.set(p.id, p);
        });
        return Array.from(map.values());
      });
      options.onSuccess?.(list);
    },
    onError: (error) => options.onError?.(error),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

/**
 * Update a product (user-scoped) e.g. { status: 'sold' } or { status: 'unavailable' }
 */
export const useUpdateProduct = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myProducts', userId || 'anonymous'];

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      if (!id) throw new Error('Missing product id.');
      return productService.updateProduct(id, payload, getToken());
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key) || [];
      if (payload && typeof payload.status === 'string') {
        const s = payload.status.toLowerCase();
        if (['available', 'unavailable', 'sold'].includes(s)) {
          queryClient.setQueryData(key, (old = []) =>
            old.map((p) => (p.id === id ? { ...p, status: s } : p))
          );
        }
      }
      return { prev };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
      options.onError?.(error);
    },
    onSuccess: (resp) => {
      const item = takeItem(resp);
      if (!item?.id) return queryClient.invalidateQueries({ queryKey: key });
      queryClient.setQueryData(key, (old = []) => old.map((p) => (p.id === item.id ? { ...p, ...item } : p)));
      options.onSuccess?.(item);
    },
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key) || [];
      queryClient.setQueryData(key, (old = []) => old.filter((p) => p.id !== id));
      return { prev };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
      options.onError?.(error);
    },
    onSuccess: (_resp, id) => {
      // ensure removed
      queryClient.setQueryData(key, (old = []) => old.filter((p) => p.id !== id));
      options.onSuccess?.();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};