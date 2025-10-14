// src/services/boostService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

export const boostService = {
  /**
   * ✅ Fetches a preview of the boost campaign costs and estimates.
   * @param {object} payload - Contains productId, dailyBudget, duration, etc.
   */
  getBoostPreview: (payload) =>
    apiRequest({
      url: ENDPOINTS.BOOSTS.PREVIEW,
      method: 'POST',
      data: payload,
    }),

  /**
   * ✅ Creates a new boost campaign.
   * @param {object} payload - Contains productId, dailyBudget, duration, etc.
   */
  createBoost: (payload) =>
    apiRequest({
      url: ENDPOINTS.BOOSTS.CREATE,
      method: 'POST',
      data: payload,
    }),

  /**
   * ✅ Fetch all boost campaigns for the seller.
   */
  getBoosts: () =>
    apiRequest({
      url: ENDPOINTS.BOOSTS.LIST,
      method: 'GET',
    }),

  /**
   * ✅ Fetch details of a specific boost campaign.
   * @param {string|number} id - The boost campaign ID.
   */
  getBoostDetail: (id) =>
    apiRequest({
      url: ENDPOINTS.BOOSTS.DETAIL(id),
      method: 'GET',
    }),

  /**
   * ✅ Update boost campaign status (e.g., pause, resume, stop).
   * @param {string|number} id - The boost ID.
   * @param {object} payload - { status: 'paused' | 'active' | 'stopped' }
   */
  updateBoostStatus: (id, payload) =>
    apiRequest({
      url: ENDPOINTS.BOOSTS.UPDATE_STATUS(id),
      method: 'PATCH',
      data: payload,
    }),

  /**
   * ✅ Retrieve metrics and analytics for a boost campaign.
   * @param {string|number} id - The boost campaign ID.
   */
  getBoostMetrics: (id) =>
    apiRequest({
      url: ENDPOINTS.BOOSTS.GET_METRICS(id),
      method: 'GET',
    }),
};
