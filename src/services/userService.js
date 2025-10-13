import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

// --- Real API Service ---
// The dummyUserService and USE_DUMMY_DATA logic have been removed.
const apiUserService = {
  /**
   * Fetches the complete store overview from the backend.
   * The backend identifies the user via the auth token, so no userId is needed.
   */
  getStoreProfile: async () => {
    // ✅ FIX: This now points to the correct backend endpoint for fetching all store data.
    const url = ENDPOINTS.SELLER_ONBOARDING.STORE.OVERVIEW;
    const response = await apiRequest({ url, method: 'GET' });
    
    // The backend already returns a well-structured object, so we return it directly.
    return response;
  },

  /**
   * Updates the user's profile.
   */
  updateStoreProfile: async (payload) => {
    // This endpoint seems correct based on your apiConfig.
    const url = ENDPOINTS.USERS.UPDATE_PROFILE;
    const response = await apiRequest({ url, method: 'PATCH', data: payload });
    return response;
  },

  /**
   * Deletes the user's account.
   */
  deleteAccount: async () => {
    const url = ENDPOINTS.USERS.DELETE_ACCOUNT;
    const response = await apiRequest({ url, method: 'DELETE' });
    return response;
  },
};

// Export the real API service directly.
export const userService = apiUserService;