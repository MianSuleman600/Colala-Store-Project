// src/services/analyticsService.js
import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

export const getStoreAnalytics = async (storeId) => {
  const url = `${ENDPOINTS.STORE_ANALYTICS}/${storeId}`;
  return apiRequest.get(url);
};
