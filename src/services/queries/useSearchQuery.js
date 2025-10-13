// src/services/queries/useSearchQuery.js

import { useQuery } from '@tanstack/react-query';
import { searchService } from '../searchService.js';

export const searchQueryKeys = {
  search: (params) => ['search', params],
};

/**
 * Hook to fetch search results.
 * @param {object} params - { q, type }
 */
export const useSearchQuery = (params) => {
  return useQuery({
    queryKey: searchQueryKeys.search(params),
    queryFn: () => searchService.performSearch(params),
    enabled: !!params.q && !!params.type, // Only run the query if both `q` and `type` are present
    keepPreviousData: true, // Show old results while new ones are loading
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};