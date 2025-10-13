// src/services/queries/useReviewQuery.js
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../settings/reviewService';

export const reviewQueryKeys = {
  myReviews: ['reviews', 'myReviews'],
};

// A single query to fetch all reviews
export const useMyReviewsQuery = (options = {}) =>
  useQuery({
    queryKey: reviewQueryKeys.myReviews,
    queryFn: () => reviewService.getMyReviews(),
    // Selectors to split the data for components that need specific lists
    select: (data) => ({
      storeReviews: data?.store_reviews || [],
      productReviews: data?.product_reviews || [],
    }),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });