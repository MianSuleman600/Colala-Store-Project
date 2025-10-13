// src/services/queries/useLeaderboardQuery.js

import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '../settings/leaderboardService';

export const leaderboardQueryKeys = {
  // The query key for sellers no longer needs a period
  sellers: ['leaderboard', 'sellers'], 
  faqs: ['leaderboard', 'faqs'],
};

export const useLeaderboardSellersQuery = (options = {}) =>
  useQuery({
    queryKey: leaderboardQueryKeys.sellers,
    // The query function now expects an object with all periods
    queryFn: () => leaderboardService.getSellers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export const useLeaderboardFaqsQuery = (options = {}) =>
  useQuery({
    queryKey: leaderboardQueryKeys.faqs,
    // The service now returns the array directly
    queryFn: () => leaderboardService.getFaqs(),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });