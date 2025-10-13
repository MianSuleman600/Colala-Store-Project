// src/services/storeBuilderService.js
import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

const getStoreBuilderData = () => {
  return apiRequest({
    url: ENDPOINTS.STORE_BUILDER,
    method: 'GET',
  });
};

const updateStoreBuilderData = (formData) => {
  return apiRequest({
    url: ENDPOINTS.STORE_BUILDER,
    method: 'POST', // The backend route is a POST that handles create/update
    data: formData, // This must be a FormData object for file uploads
  });
};

export const storeBuilderService = {
  getStoreBuilderData,
  updateStoreBuilderData,
};