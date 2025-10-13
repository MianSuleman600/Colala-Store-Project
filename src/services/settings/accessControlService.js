// src/services/settings/accessControlService.js

import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

/**
 * Service for managing users associated with the authenticated seller's store.
 */
export const accessControlService = {
  /**
   * Fetches the list of users for the current store.
   * @returns {Promise<Array>} A promise that resolves to an array of user objects.
   */
  getUsers: async () => {
    // FIX: Call apiRequest as a function with a config object.
    const response = await apiRequest({
      url: ENDPOINTS.ACCESS_CONTROL.LIST_USERS,
      method: 'GET',
    });
    // The backend response is already an array of users inside the `data` key.
    return response.data || [];
  },

  /**
   * Adds a new user to the current store.
   * @param {object} payload - { name, email, password }
   * @returns {Promise<object>} A promise that resolves to the newly created user object.
   */
  addUser: async (payload) => {
    // FIX: Call apiRequest as a function with a config object.
    return apiRequest({
      url: ENDPOINTS.ACCESS_CONTROL.ADD_USER,
      method: 'POST',
      data: payload,
    });
  },

  /**
   * Removes a user from the current store.
   * @param {string|number} userId - The ID of the user to remove.
   * @returns {Promise<void>}
   */
  removeUser: async (userId) => {
    // FIX: Call apiRequest as a function with a config object.
    return apiRequest({
      url: ENDPOINTS.ACCESS_CONTROL.REMOVE_USER(userId),
      method: 'DELETE',
    });
  },
};