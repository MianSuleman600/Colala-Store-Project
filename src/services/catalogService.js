// src/services/catalogService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

export const catalogService = {
  getCategories: async () => {
    return await apiRequest({ url: ENDPOINTS.CATALOG.CATEGORIES, method: 'GET' });
  },

  getBrands: async () => {
    return await apiRequest({ url: ENDPOINTS.CATALOG.BRANDS, method: 'GET' });
  },

  getLocations: async () => {
    return await apiRequest({ url: ENDPOINTS.CATALOG.LOCATIONS, method: 'GET' });
    
  },
  

  getDeliveryLocations: async () => {
    return await apiRequest({ url: ENDPOINTS.CATALOG.DELIVERY_LOCATIONS, method: 'GET' });
  },
};
