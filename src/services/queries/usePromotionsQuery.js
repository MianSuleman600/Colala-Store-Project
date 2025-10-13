// src/services/queries/usePromotionsQuery.js

import { useQuery } from '@tanstack/react-query';
// --- FIX: Import the specific functions you need, not the service object ---
import { getPromotions, getPromotionDetail } from '../index.js';
import { normalizePromotions } from '../../utils/dataNormalizer.js';

const getToken = () =>
  (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

// This helper function is fine, no changes needed.
const extractArray = (response) => {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== 'object') return [];
  const keys = ['promotions', 'data', 'items', 'results', 'rows', 'list', 'content'];
  for (const k of keys) {
    const v = response[k];
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
      if (Array.isArray(v.items)) return v.items;
      if (Array.isArray(v.data)) return v.data;
      if (Array.isArray(v.results)) return v.results;
      if (Array.isArray(v.list)) return v.list;
      if (Array.isArray(v.content)) return v.content;
    }
  }
  for (const v of Object.values(response)) {
    if (Array.isArray(v)) return v;
  }
  return [];
};

export const useGetMyPromotionsQuery = (userId, params = {}, options = {}) =>
  useQuery({
    queryKey: ['myPromotions', userId || 'anonymous', params],
    queryFn: async () => {
      const token = getToken();
      // --- FIX: Call the function directly ---
      const response = await getPromotions(token, { userId, ...params });
      const arr = extractArray(response);
      return normalizePromotions(arr);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...options,
  });

export const usePromotionDetailQuery = (promotionId, options = {}) =>
  useQuery({
    queryKey: ['promotionDetail', promotionId],
    queryFn: async () => {
      if (!promotionId) return null;
      const token = getToken();
      // --- FIX: Call the function directly ---
      const response = await getPromotionDetail(promotionId, token);
      // The normalize function expects an array, so wrap the single response
      const [normalized] = normalizePromotions([response]);
      return normalized || null;
    },
    enabled: !!promotionId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });