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
    totalSold: store.sold_items_sum_qty || 0,
    averageRating: store.average_rating || 0,
    socialLinks: store.social_links || [],
    products: store.products || [],
    posts: store.posts || [],
    services: store.services || [],
    storeReviews: store.storeReveiws || [],

    // Mapped from other top-level keys in the API response
    business: raw.business || {},
    addresses: raw.addresses || [],
    delivery: raw.delivery || [],
    progress: raw.progress || { percent: 0, level: 1, status: 'draft' },

    // Add owner ID for comparison - using store owner from the response
    ownerId: store.id, // Assuming the store ID is the owner ID in this context
    
    // Add store owner information for display
    storeOwner: {
      name: store.name,
      profilePicture: toFullUrl(store.profile_image),
    }
  };
};
// --- END NORMALIZER ---

/**
 * Custom hook to fetch and normalize the complete store profile/overview.
 */
export const useStoreProfile = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['storeProfile', storeId],
    queryFn: () => userService.getStoreProfile(), // Use the existing store profile method

    // Use the `select` option to automatically transform the raw API data
    select: (rawApiData) => {
      return normalizeStoreProfile(rawApiData);
    },

    enabled: !!storeId, // Query is only enabled if a storeId is provided.
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};