// src/hooks/useReviewQuery.js
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../settings/reviewService';

export const reviewQueryKeys = {
  store: (params = {}) => ['reviews', 'store', params],
  storeById: (id) => ['reviews', 'store', 'detail', id],
  product: (params = {}) => ['reviews', 'product', params],
  productById: (id) => ['reviews', 'product', 'detail', id],
};

export const useStoreReviewsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: reviewQueryKeys.store(params),
    queryFn: async () => {
      const res = await reviewService.getStoreReviews(params);
      return res.reviews || [];
    },
    staleTime: 60_000,
    ...options,
  });

export const useProductReviewsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: reviewQueryKeys.product(params),
    queryFn: async () => {
      const res = await reviewService.getProductReviews(params);
      return res.reviews || [];
    },
    staleTime: 60_000,
    ...options,
  });