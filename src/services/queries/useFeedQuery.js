import { useQuery } from '@tanstack/react-query';
import { feedService } from '../index.js';
import { normalizeFeedPosts } from '../../utils/dataNormalizer.js';

/** Fetch all posts (global) */
export const useGetPostsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await feedService.getFeed();
      const posts = Array.isArray(response?.posts) ? response.posts : [];
      return normalizeFeedPosts(posts);
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });
};

/** Fetch posts for a specific store */
export const useStoreFeedQuery = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['posts', { storeId }],
    queryFn: async () => {
      const response = await feedService.getFeed({ storeId });
      const posts = Array.isArray(response?.posts) ? response.posts : [];
      return normalizeFeedPosts(posts);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });
};