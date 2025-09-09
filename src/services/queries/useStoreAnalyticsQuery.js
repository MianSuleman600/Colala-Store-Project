// src/services/queries/useStoreAnalytics.js
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../index.js'; // Centralized service (auto switches between dummy & live)

/**
 * Fetch store analytics (dummy or live based on USE_DUMMY_DATA)
 * @param {string} storeId - The store ID to fetch analytics for
 * @param {object} options - Optional React Query config (staleTime, cacheTime, refetchOnWindowFocus, etc.)
 */
export const useStoreAnalytics = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['storeAnalytics', storeId],
    queryFn: async () => {
      if (!storeId) throw new Error('Store ID is required to fetch analytics');
      return analyticsService.getStoreAnalytics(storeId);
    },
    enabled: !!storeId, // Only run when storeId is available
    staleTime: 1000 * 60 * 2, // 2 minutes cache by default
    refetchOnWindowFocus: false,
    ...options,
  });
};
