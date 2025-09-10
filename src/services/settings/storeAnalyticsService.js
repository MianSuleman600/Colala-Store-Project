import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';
import { USE_DUMMY_DATA } from '../../utils/config';
import { dummyStoreAnalytics, buildDummyAnalytics } from '../../utils/data/dummyStoreAnalytics';

// Normalize axios-like { data } or raw object
const takeData = (res) => (res && typeof res === 'object' && 'data' in res ? res.data : res);

// Live Rails API
const apiAnalyticsService = {
  getStoreAnalytics: async (storeId, params = {}) => {
    if (!storeId) throw new Error('storeId is required');
    const url = `${ENDPOINTS.STORE_ANALYTICS}/${storeId}`;
    const res = await apiRequest.get(url, { params });
    return takeData(res); // hook will shape this
  },
};

// Dummy (Dev) API
const dummyAnalyticsService = {
  getStoreAnalytics: async (storeId, params = {}) => {
    const range = params?.range;
    const days =
      range === '90_days' ? 90 : range === '30_days' ? 30 : 7;
    return buildDummyAnalytics(dummyStoreAnalytics, { storeId, days });
  },
};

const service = USE_DUMMY_DATA ? dummyAnalyticsService : apiAnalyticsService;
export const getStoreAnalytics = (storeId, params) => service.getStoreAnalytics(storeId, params);
export const storeAnalyticsService = service;