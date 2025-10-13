// src/services/settings/storeAnalyticsService.js

import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

const apiAnalyticsService = {
  getStoreAnalytics: async (params = {}) => {
    const url = ENDPOINTS.STORE_ANALYTICS;
    
    // The backend expects the query parameter to be named 'period'.
    // We extract the number from the range string (e.g., "30_days" -> 30).
    const requestParams = {
      period: params.range ? parseInt(params.range.split('_')[0], 10) : 30,
    };

    // --- THIS IS THE FIX ---
    // Instead of `apiRequest.get(url, { params })`, we call apiRequest as a function
    // and pass the configuration as a single object.
    const res = await apiRequest({
      url: url,
      method: 'GET',
      params: requestParams,
    });
    // --- END OF FIX ---

    // The rest of your code works as intended.
    // The `apiRequest` function already returns the `data` object,
    // so no need for the `takeData` helper.
    return res;
  },
};

export const getStoreAnalytics = (params) => apiAnalyticsService.getStoreAnalytics(params);
export const storeAnalyticsService = apiAnalyticsService;