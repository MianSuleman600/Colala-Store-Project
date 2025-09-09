// src/services/serviceService.js
import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';
import { USE_DUMMY_DATA } from '../utils/config.js'; // global toggle
import { dummyServices } from '../utils/data/dummyServices.js';

// --- Dummy Service ---
const dummyServiceService = {
  getServices: async () => {
    return new Promise(resolve =>
      setTimeout(
        () => resolve({ services: dummyServices, message: 'Fetched dummy services successfully.' }),
        300
      )
    );
  },

  getServiceById: async (serviceId) => {
    const service = dummyServices.find(s => s.id === serviceId);
    return service
      ? { service, message: 'Dummy service fetched successfully.' }
      : { service: null, message: 'Service not found (dummy).' };
  },

  createService: async (payload) => {
    const newService = { ...payload, id: `service-${Date.now()}` };
    dummyServices.push(newService);
    return { success: true, service: newService, message: 'Service created (dummy).' };
  },

  updateService: async (serviceId, payload) => {
    const index = dummyServices.findIndex(s => s.id === serviceId);
    if (index === -1) return { success: false, message: 'Service not found (dummy).' };
    dummyServices[index] = { ...dummyServices[index], ...payload };
    return { success: true, service: dummyServices[index], message: 'Service updated (dummy).' };
  },

  deleteService: async (serviceId) => {
    const index = dummyServices.findIndex(s => s.id === serviceId);
    if (index === -1) return { success: false, message: 'Service not found (dummy).' };
    dummyServices.splice(index, 1);
    return { success: true, message: 'Service deleted (dummy).' };
  },
};

// --- Real API Service ---
const apiServiceService = {
  getServices: async () => {
    const url = `${ENDPOINTS.PRODUCTS.LIST}/services`;
    return apiRequest({ url, method: 'GET' });
  },

  getServiceById: async (serviceId) => {
    const url = `${ENDPOINTS.PRODUCTS.LIST}/services/${serviceId}`;
    return apiRequest({ url, method: 'GET' });
  },

  createService: async (payload, token) => {
    const url = `${ENDPOINTS.PRODUCTS.LIST}/services/`;
    return apiRequest({ url, method: 'POST', data: payload, headers: { Authorization: `Bearer ${token}` } });
  },

  updateService: async (serviceId, payload, token) => {
    const url = `${ENDPOINTS.PRODUCTS.LIST}/services/${serviceId}`;
    return apiRequest({ url, method: 'PUT', data: payload, headers: { Authorization: `Bearer ${token}` } });
  },

  deleteService: async (serviceId, token) => {
    const url = `${ENDPOINTS.PRODUCTS.LIST}/services/${serviceId}`;
    return apiRequest({ url, method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },
};

// --- Export based on global dummy flag ---
export const serviceService = USE_DUMMY_DATA ? dummyServiceService : apiServiceService;
