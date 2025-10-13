// src/services/searchService.js

import { apiRequest } from '../api/apiClient.js';
import { ENDPOINTS } from '../api/apiConfig.js';

export const searchService = {
  /**
   * Performs a search on the backend.
   * @param {object} params - { q, type }
   * @returns {Promise<object>} The paginated search results from the API.
   */
  performSearch: async (params) => {
    // If the search query or type is missing, return an empty result immediately
    // to avoid an unnecessary API call.
    if (!params.q || !params.type) {
      return { data: [], links: {}, meta: {} };
    }
    
    // --- THIS IS THE FIX ---
    // Call apiRequest as a function with a configuration object.
    // The `params` object will be correctly converted to a query string (e.g., ?q=...&type=...).
    const response = await apiRequest({
      url: ENDPOINTS.SEARCH,
      method: 'GET',
      params: params,
    });
    // --- END OF FIX ---
    
    // Your apiRequest wrapper returns the `data` portion of the response,
    // and your backend nests the actual results inside another `data` key.
    return response.data || { data: [] };
  },
};