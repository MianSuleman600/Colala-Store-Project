// src/services/catalogService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

export const catalogService = {
  getCategories: () => apiRequest({ url: ENDPOINTS.CATALOG.CATEGORIES, method: 'GET' }),
  getBrands: () => apiRequest({ url: ENDPOINTS.CATALOG.BRANDS, method: 'GET' }),
  getLocations: () => apiRequest({ url: ENDPOINTS.CATALOG.LOCATIONS, method: 'GET' }),
  // --- NEW: Function to fetch delivery options ---
  getDeliveryLocations: () => apiRequest({ url: ENDPOINTS.CATALOG.DELIVERY_LOCATIONS, method: 'GET' }),
};