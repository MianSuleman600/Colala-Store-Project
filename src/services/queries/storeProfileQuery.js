//D:\Project\frontend\src\services\queries\storeProfileQuery.js
import { useQuery } from '@tanstack/react-query';
import { userService } from '../index.js';
import { normalizeProfiles } from '../../utils/dataNormalizer.js';

/**
 * Fetch and normalize a single store profile by userId
 */
export const useStoreProfile = (userId, options = {}) => {
  return useQuery({
    queryKey: ['storeProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const rawProfile = await userService.getStoreProfile(userId);
      if (!rawProfile) return null;

      const normalizedProfiles = normalizeProfiles({ [userId]: rawProfile });
      return normalizedProfiles?.[userId] ?? null;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
