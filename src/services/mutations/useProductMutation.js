// src/services/mutations/useProductMutation.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
// CORRECTED IMPORT: Point directly to the productService file.
import { productService } from '../productService.js';

// Helper to update a product's status optimistically
const optimisticStatusUpdate = (queryClient, userId, productId, newStatus) => {
  const queryKey = ['myProducts', userId];
  queryClient.setQueryData(queryKey, (oldData) => {
    if (!oldData) return oldData;
    return oldData.map(product => 
      product.id === productId ? { ...product, status: newStatus } : product
    );
  });
};

export const useAddProductMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { userId } = options;
  return useMutation({
    mutationFn: (payload) => productService.addProduct(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myProducts', userId] });
      options.onSuccess?.(data);
    },
    ...options,
  });
};

export const useUpdateProductMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { userId } = options;
  return useMutation({
    mutationFn: ({ id, payload }) => productService.updateProduct(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myProducts', userId] });
      queryClient.invalidateQueries({ queryKey: ['productDetail', variables.id] });
      options.onSuccess?.(data);
    },
    ...options,
  });
};

export const useDeleteProductMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { userId } = options;
  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    
    onMutate: async (id) => {
      const queryKey = ['myProducts', userId];
      await queryClient.cancelQueries({ queryKey });
      const previousProducts = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old) => old ? old.filter(p => p.id !== id) : []);
      
      return { previousProducts };
    },

    onError: (err, id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['myProducts', userId], context.previousProducts);
      }
      options.onError?.(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myProducts', userId] });
    },
    ...options,
  });
};

// --- NEW MUTATIONS FOR STATUS ---
export const useMarkProductStatusMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { userId } = options;
  return useMutation({
    mutationFn: ({ productId, status }) => {
      if (status === 'sold') return productService.markAsSold(productId);
      if (status === 'unavailable') return productService.markAsUnavailable(productId);
      if (status === 'available') return productService.markAsAvailable(productId);
      throw new Error('Invalid status');
    },
    
    onMutate: async ({ productId, status }) => {
      const queryKey = ['myProducts', userId];
      await queryClient.cancelQueries({ queryKey });
      const previousProducts = queryClient.getQueryData(queryKey);
      optimisticStatusUpdate(queryClient, userId, productId, status);
      return { previousProducts };
    },

    onError: (err, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['myProducts', userId], context.previousProducts);
      }
      options.onError?.(err);
    },

    onSettled: (data, error, { productId }) => {
        // Invalidate both the list and the specific product detail to keep them in sync
        queryClient.invalidateQueries({ queryKey: ['myProducts', userId] });
        queryClient.invalidateQueries({ queryKey: ['productDetail', productId] });
    },
    ...options,
  });
};


export const useCreateVariantMutation = (options = {}) => useMutation({
  mutationFn: ({ productId, payload }) => productService.createVariant(productId, payload),
  ...options,
});

export const useUpdateVariantMutation = (options = {}) => useMutation({
  mutationFn: ({ productId, variantId, payload }) => productService.updateVariant(productId, variantId, payload),
  ...options,
});

export const useDeleteVariantMutation = (options = {}) => useMutation({
  mutationFn: ({ productId, variantId }) => productService.deleteVariant(productId, variantId),
  ...options,
});

export const useUpdateBulkPricesMutation = (options = {}) => useMutation({
  mutationFn: ({ productId, payload }) => productService.updateBulkPrices(productId, payload),
  ...options,
});

export const useUpdateDeliveryOptionsMutation = (options = {}) => useMutation({
  mutationFn: ({ productId, payload }) => productService.updateDeliveryOptions(productId, payload),
  ...options,
});

export const useUploadBulkFileMutation = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file) => productService.uploadBulkFile(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProducts'] });
            options.onSuccess?.();
        },
        ...options
    });
};