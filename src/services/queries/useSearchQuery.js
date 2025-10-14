import { useQuery } from '@tanstack/react-query';
import { searchService } from '../searchService.js';

export const searchQueryKeys = {
  search: (params) => ['search', params],
};

export const useSearchQuery = (params) => {
  return useQuery({
    queryKey: searchQueryKeys.search(params),
    queryFn: async () => {
      const result = await searchService.performSearch(params);
      return result;
    },
    enabled: !!params.q && !!params.type,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};
