// src/hooks/useLeaderboardQuery.js
import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '../../services/settings/leaderboardService';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const leaderboardQueryKeys = {
  sellers: (period = 'all') => ['leaderboard', 'sellers', period],
  faqs: ['leaderboard', 'faqs'],
};

export const useLeaderboardSellersQuery = (period = 'all', options = {}) =>
  useQuery({
    queryKey: leaderboardQueryKeys.sellers(period),
    queryFn: async () => {
      const res = await leaderboardService.getSellers({ period });
      return Array.isArray(res.sellers) ? res.sellers : [];
    },
    staleTime: 30_000,
    onError: (err) => toast('error', err?.message || 'Failed to fetch leaderboard'),
    ...options,
  });

export const useLeaderboardFaqsQuery = (options = {}) =>
  useQuery({
    queryKey: leaderboardQueryKeys.faqs,
    queryFn: async () => {
      const res = await leaderboardService.getFaqs();
      return Array.isArray(res.faqs) ? res.faqs : [];
    },
    staleTime: 300_000,
    onError: (err) => toast('error', err?.message || 'Failed to fetch leaderboard FAQs'),
    ...options,
  });