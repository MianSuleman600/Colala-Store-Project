// src/services/queries/useStoreProfileQuery.js

import { useQuery } from '@tanstack/react-query';
import { userService } from '../userService.js';
import { ASSETS_BASE } from '../../api/apiConfig';

// --- DATA NORMALIZER FUNCTION ---
// This function takes the raw snake_case data from the backend
// and transforms it into a clean camelCase object that your components expect.
const normalizeStoreProfile = (raw) => {
  if (!raw || !raw.store) return null;

  const store = raw.store;
  
  // Helper to construct full URLs for images
  const toFullUrl = (relativePath) => {
    if (!relativePath) return null;
    // Ensure we don't double the /storage part
    const path = relativePath.replace('/storage/', '');
    return `${ASSETS_BASE}/storage/${path}`;
  };

  return {
    // Mapped from `store` object
    id: store.id,
    name: store.name,
    email: store.email,
    phone: store.phone,
    location: store.location,
    brandColor: store.theme_color,
    profilePictureUrl: toFullUrl(store.profile_image),
    bannerImageUrl: toFullUrl(store.banner_image),
    announcements: store.announcements || [],
    promotionalBanners: store.permotaional_banners || [],
    categories: store.categories || [],
    followersCount: store.followers_count || 0,
    totalSold: store.total_sold || 0,
    averageRating: store.average_rating || 0,
    socialLinks: store.social_links || [],
    products: store.products || [],
    services: store.services || [],
    storeReviews: store.storeReveiws || [],

    // Mapped from other top-level keys in the API response
    business: raw.business || {},
    addresses: raw.addresses || [],
    delivery: raw.delivery || [],
    progress: raw.progress || { percent: 0, level: 1, status: 'draft' },
    
    // Add owner ID for comparison
    ownerId: store.user_id,
  };
};
// --- END NORMALIZER ---

/**
 * Custom hook to fetch and normalize the complete store profile/overview.
 */
export const useStoreProfile = (userId, options = {}) => {
  return useQuery({
    queryKey: ['storeProfile', userId],
    queryFn: () => userService.getStoreProfile(), // Remove userId parameter
    
    // Use the `select` option to automatically transform the raw API data
    select: (rawApiData) => {
      return normalizeStoreProfile(rawApiData);
    },

    enabled: !!userId, // Query is only enabled if a userId is provided.
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};