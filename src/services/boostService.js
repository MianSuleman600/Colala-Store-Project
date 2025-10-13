// src/services/boostService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

export const boostService = {
  /**
   * Fetches a preview of the boost campaign costs and estimates.
   * @param {object} payload - Contains productId, dailyBudget, duration, etc.
   */
  getBoostPreview: (payload) => apiRequest({
    url: ENDPOINTS.BOOSTS.PREVIEW,
    method: 'POST',
    data: payload,
  }),

  /**
   * Creates a new boost campaign.
   * @param {object} payload - Contains productId, dailyBudget, duration, etc.
   */
  createBoost: (payload) => apiRequest({
    url: ENDPOINTS.BOOSTS.CREATE,
    method: 'POST',
    data: payload,
  }),
};