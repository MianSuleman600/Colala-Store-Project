// src/services/settings/leaderboardService.js

import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

// A simple normalizer for sellers
const normalizeLeaderboardSellers = (sellers = []) => {
  return sellers.map(seller => ({
    id: seller.store_id,
    name: seller.store_name,
    score: seller.total_points,
    avatarUrl: seller.profile_image,
    followers: seller.followers_count,
    rating: seller.average_rating,
  }));
};

// A simple normalizer for FAQs
const normalizeLeaderboardFaqs = (faqs = []) => {
    return faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
    }));
};


export const leaderboardService = {
  /**
   * Fetches sellers for all leaderboard periods.
   */
  getSellers: async () => {
    const response = await apiRequest({
      url: ENDPOINTS.LEADERBOARD.SELLERS,
      method: 'GET',
    });
    const allPeriodsData = response.data || {};
    return {
      today: normalizeLeaderboardSellers(allPeriodsData.today || []),
      weekly: normalizeLeaderboardSellers(allPeriodsData.weekly || []),
      monthly: normalizeLeaderboardSellers(allPeriodsData.monthly || []),
      all: normalizeLeaderboardSellers(allPeriodsData.all || []),
    };
  },

  /**
   * Fetches FAQs. The backend returns categories with nested FAQs.
   * We will flatten them into a single list for the UI.
   * @returns {Promise<Array>}
   */
  getFaqs: async () => {
    const response = await apiRequest({
      url: ENDPOINTS.FAQS.LIST, // Use the correct endpoint
      method: 'GET',
    });
    const categories = response.data || [];
    
    // Flatten the array: go through each category and collect all its faqs
    const allFaqs = categories.reduce((accumulator, currentCategory) => {
      if (Array.isArray(currentCategory.faqs)) {
        return accumulator.concat(currentCategory.faqs);
      }
      return accumulator;
    }, []);

    return normalizeLeaderboardFaqs(allFaqs);
  },
};