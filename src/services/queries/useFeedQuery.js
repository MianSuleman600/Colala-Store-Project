//D:\Project\frontend\src\services\queries\useFeedQuery.js
import { useQuery } from '@tanstack/react-query';
import { feedService } from '../index.js';
import { normalizeFeedPosts } from '../../utils/dataNormalizer.js';

/**
 * Fetch all posts
 */
export const useGetPostsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await feedService.getFeed();
      const posts = Array.isArray(response?.posts) ? response.posts : [];
      return normalizeFeedPosts(posts);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    ...options,
  });
};
