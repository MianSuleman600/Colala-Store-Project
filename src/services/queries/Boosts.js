// src/services/queries/useBoostsQuery.js

import { useQuery } from '@tanstack/react-query';
import { boostService } from '../boostService';

/**
 * ✅ Fetch all boost campaigns for the current seller
 */
export const useBoostsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['boosts'],
    queryFn: boostService.getBoosts,
    ...options,
  });
};

/**
 * ✅ Fetch details for a specific boost campaign
 * @param {string|number} id - Boost ID
 */
export const useBoostDetailQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ['boostDetail', id],
    queryFn: () => boostService.getBoostDetail(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * ✅ Fetch boost metrics (performance stats, reach, clicks, etc.)
 * @param {string|number} id - Boost ID
 */
export const useBoostMetricsQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ['boostMetrics', id],
    queryFn: () => boostService.getBoostMetrics(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * ✅ Fetch a preview of boost estimates before creating one
 * @param {object} payload - Contains productId, budget, duration, etc.
 * @param {boolean} enabled - Whether to run automatically
 */
export const useBoostPreviewQuery = (payload, enabled = false, options = {}) => {
  return useQuery({
    queryKey: ['boostPreview', payload],
    queryFn: () => boostService.getBoostPreview(payload),
    enabled,
    ...options,
  });
};
