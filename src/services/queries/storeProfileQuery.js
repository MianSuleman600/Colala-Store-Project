// src/services/queries/useStoreProfileQuery.js

import { useQuery } from '@tanstack/react-query';
import { userService } from '../userService.js'; // Assuming this has a method to get profile by ID
import { ASSETS_BASE } from '../../api/apiConfig';

// --- DATA NORMALIZER FUNCTION ---
// This is now more robust, handling potential missing data gracefully.
const normalizeStoreProfile = (raw) => {
  // If the API returns nothing or an empty object, return null.
  if (!raw || Object.keys(raw).length === 0) return null;

  // The store data might be at the top level or nested under `store`.
  // This handles both possibilities.
  const store = raw.store || raw;

  const toFullUrl = (relativePath) => {
    if (!relativePath) return null;
    return relativePath.startsWith('http') ? relativePath : `${ASSETS_BASE}${relativePath}`;
  };

  return {
    // --- Core Store Info ---
    id: store.id,
    ownerId: store.user_id, // This is the actual owner's ID for comparisons
    name: store.store_name,
    email: store.email,
    phone: store.phone,
    location: store.location,
    brandColor: store.theme_color || '#EF4444', // Provide a default
    profilePictureUrl: toFullUrl(store.profile_image),
    bannerImageUrl: toFullUrl(store.banner_image),
    
    // --- Store Content ---
    products: store.products || [],
    posts: store.posts || [],
    storeReviews: store.reviews || store.storeReveiws || [], // Accept multiple key names
    socialLinks: store.social_links || [],
    
    // --- Store Stats ---
    followersCount: store.followers_count || 0,
    totalSold: store.sold_items_sum_qty || 0,
    averageRating: parseFloat(store.average_rating || 0).toFixed(1),

    // --- Nested data from the API response ---
    // If the API response structure is flat, these might be at the `raw` level.
    business: raw.business || {},
    addresses: raw.addresses || [],
    delivery: raw.delivery || [],

    // --- Store Owner Details (for display) ---
    storeOwner: {
      fullName: raw.user?.full_name || store.store_name,
      profilePicture: toFullUrl(raw.user?.profile_image || store.profile_image),
    }
  };
};
// --- END NORMALIZER ---

/**
 * Custom hook to fetch and normalize a specific store profile by its ID.
 */
export const useStoreProfile = (storeId, options = {}) => {
  return useQuery({
    // The queryKey uniquely identifies this specific query.
    // It includes the storeId so that fetching data for store '1'
    // is cached separately from fetching for store '2'.
    queryKey: ['storeProfile', storeId],

    // ✅ FIX: The queryFn now correctly fetches the profile for the *specific storeId*.
    // It assumes your `userService` has a method like `getStoreById(id)`.
    // The `queryKey` is automatically passed as an argument.
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      // You MUST have a service method that can fetch a profile by ID.
      // If `userService.getStoreProfile()` doesn't accept an ID, you need to change it.
      return userService.getStoreProfile(id); 
    },

    // Transforms the raw API data into the clean object our components use.
    select: normalizeStoreProfile,

    // Production-level query options:
    enabled: !!storeId, // Only run the query if a storeId exists.
    staleTime: 1000 * 60 * 5, // 5 minutes: Data is considered "fresh" for 5 mins, no refetch on mount.
    gcTime: 1000 * 60 * 15, // 15 minutes: Data is kept in cache for 15 mins after it's unused.
    refetchOnWindowFocus: true, // Refetch when user returns to the tab (good for live data).
    ...options,
  });
};