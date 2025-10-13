// src/services/mutations/useReviewMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../settings/reviewService.js';
import { reviewQueryKeys } from '../queries/useReviewQuery.js';

const toast = (type, message) => console.log(`[Toast ${type}]: ${message}`);

export const useUpdateStoreReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storeId, reviewId, payload }) => reviewService.updateStoreReview(storeId, reviewId, payload),
    onSuccess: () => {
      toast('success', 'Store review updated');
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.myReviews });
    },
    onError: (err) => toast('error', err?.message || 'Failed to update store review'),
  });
};

export const useDeleteStoreReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storeId, reviewId }) => reviewService.deleteStoreReview({ storeId, reviewId }),
    onSuccess: () => {
      toast('success', 'Store review deleted');
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.myReviews });
    },
    onError: (err) => toast('error', err?.message || 'Failed to delete store review'),
  });
};

// Placeholder mutations for product reviews
export const useUpdateProductReviewMutation = () => {
  return useMutation({
    mutationFn: () => { throw new Error("Updating product reviews is not supported by the backend yet.") },
  });
};

export const useDeleteProductReviewMutation = () => {
  return useMutation({
    mutationFn: () => { throw new Error("Deleting product reviews is not supported by the backend yet.") },
  });
};