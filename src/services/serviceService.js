// src/services/serviceService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

const apiServiceService = {
  // --- CORE SERVICE ACTIONS ---
  getServices: () => apiRequest({ url: ENDPOINTS.SELLER_SERVICES.MY_SERVICES, method: 'GET' }),
  
  getServiceById: (serviceId) => apiRequest({ url: ENDPOINTS.SELLER_SERVICES.LIST + `/${serviceId}`, method: 'GET' }), // Assuming a detail endpoint
  
  createService: (payload) => apiRequest({ url: ENDPOINTS.SELLER_SERVICES.CREATE, method: 'POST', data: payload }),
  
  updateService: (serviceId, payload) => apiRequest({ url: ENDPOINTS.SELLER_SERVICES.UPDATE(serviceId), method: 'POST', data: payload }),
  
  deleteService: (serviceId) => apiRequest({ url: ENDPOINTS.SELLER_SERVICES.DELETE(serviceId), method: 'DELETE' }),
  
  // --- STATS ACTIONS ---
  getServiceStats: (serviceId) => apiRequest({ url: ENDPOINTS.SELLER_SERVICES.STATS(serviceId), method: 'GET' }),

  getServiceStatTotals: (serviceId) => apiRequest({ url: ENDPOINTS.SELLER_SERVICES.STATS_TOTALS(serviceId), method: 'GET' }),

  // --- CATEGORIES ---
  getServiceCategories: () => apiRequest({ url: ENDPOINTS.SERVICE_CATEGORIES.LIST, method: 'GET' }),
};

export const serviceService = apiServiceService;