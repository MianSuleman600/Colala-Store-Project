// src/services/settings/reviewService.js

import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

/**
 * Service for handling user's own reviews.
 */
export const reviewService = {
  /**
   * Fetches both store and product reviews for the current user in a single call.
   * @returns {Promise<{store_reviews: Array, product_reviews: Array}>}
   */
  getMyReviews: async () => {
    console.log('%c[Service] getMyReviews: Calling API...', 'color: #fd7e14; font-weight: bold;');
    
    // --- THIS IS THE FIX ---
    // Call apiRequest as a function with a config object, not as an instance with .get()
    const response = await apiRequest({
      url: ENDPOINTS.REVIEWS.MY_REVIEWS,
      method: 'GET',
    });
    // --- END OF FIX ---
    
    console.log('%c[Service] getMyReviews: Received raw response from apiRequest:', 'color: #fd7e14;', response);
    
    // The apiRequest wrapper returns { data: {...}, message: "..." }. We need the inner data.
    const data = response.data || { store_reviews: [], product_reviews: [] };
    
    console.log('%c[Service] getMyReviews: Returning final data to hook:', 'color: #fd7e14;', data);
    return data;
  },

  /**
   * Updates a specific store review.
   */
  updateStoreReview: async (storeId, reviewId, payload) => {
    const fd = new FormData();
    fd.append('rating', payload.rating);
    fd.append('comment', payload.comment);
    (payload.images || []).forEach(img => {
        if(img instanceof File) fd.append('images[]', img);
    });
    
    // Use POST and _method for FormData updates in Laravel
    return apiRequest({
      url: ENDPOINTS.REVIEWS.STORE.UPDATE(storeId, reviewId),
      method: 'POST',
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Deletes a specific store review.
   */
  deleteStoreReview: async ({ storeId, reviewId }) => {
    return apiRequest({
      url: ENDPOINTS.REVIEWS.STORE.DELETE(storeId, reviewId),
      method: 'DELETE',
    });
  },

  // These will correctly throw errors now if called
  updateProductReview: async () => {
    throw new Error("Updating product reviews is not supported by the backend yet.");
  },
  
  deleteProductReview: async () => {
    throw new Error("Deleting product reviews is not supported by the backend yet.");
  },
};