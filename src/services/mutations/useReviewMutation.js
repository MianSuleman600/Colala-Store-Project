// src/hooks/useReviewMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../settings/reviewService.js';
import { reviewQueryKeys } from '../queries/useReviewQuery.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

// Store reviews
export const useCreateStoreReviewMutation = (params = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => reviewService.createStoreReview(payload),
    onSuccess: () => {
      toast('success', 'Store review created');
      qc.invalidateQueries({ queryKey: reviewQueryKeys.store({}) });
      qc.invalidateQueries({ queryKey: reviewQueryKeys.store(params) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to create store review'),
  });
};

export const useUpdateStoreReviewMutation = (params = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => reviewService.updateStoreReview(id, payload),
    onSuccess: () => {
      toast('success', 'Store review updated');
      qc.invalidateQueries({ queryKey: reviewQueryKeys.store({}) });
      qc.invalidateQueries({ queryKey: reviewQueryKeys.store(params) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to update store review'),
  });
};

export const useDeleteStoreReviewMutation = (params = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewService.deleteStoreReview(id),
    onSuccess: () => {
      toast('success', 'Store review deleted');
      qc.invalidateQueries({ queryKey: reviewQueryKeys.store({}) });
      qc.invalidateQueries({ queryKey: reviewQueryKeys.store(params) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to delete store review'),
  });
};

// Product reviews
export const useCreateProductReviewMutation = (params = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => reviewService.createProductReview(payload),
    onSuccess: () => {
      toast('success', 'Product review created');
      qc.invalidateQueries({ queryKey: reviewQueryKeys.product({}) });
      qc.invalidateQueries({ queryKey: reviewQueryKeys.product(params) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to create product review'),
  });
};

export const useUpdateProductReviewMutation = (params = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => reviewService.updateProductReview(id, payload),
    onSuccess: () => {
      toast('success', 'Product review updated');
      qc.invalidateQueries({ queryKey: reviewQueryKeys.product({}) });
      qc.invalidateQueries({ queryKey: reviewQueryKeys.product(params) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to update product review'),
  });
};

export const useDeleteProductReviewMutation = (params = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewService.deleteProductReview(id),
    onSuccess: () => {
      toast('success', 'Product review deleted');
      qc.invalidateQueries({ queryKey: reviewQueryKeys.product({}) });
      qc.invalidateQueries({ queryKey: reviewQueryKeys.product(params) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to delete product review'),
  });
};