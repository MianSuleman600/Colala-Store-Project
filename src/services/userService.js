// src/services/userService.js
import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';
import { getHydratedProfiles } from '../utils/data/db.js';
import { USE_DUMMY_DATA } from '../utils/config.js';
import { normalizeProfiles } from '../utils/dataNormalizer.js';

// --- Dummy User Service ---
const dummyUserService = {
  getStoreProfile: async (userId) => {
    if (!userId) throw new Error('User ID is required');

    const profiles = getHydratedProfiles();
    let profile = profiles[userId];

    if (!profile) {
      // Create a default profile if missing
      profile = {
        id: userId,
        storeName: `New Store ${userId}`,
        owner: `User ${userId}`,
        profilePictureUrl: 'profileImage.png',
        bannerImageUrl: 'bannerImage.png',
        promotionalBannerImageUrl: 'bag.png',
        location: 'Unknown',
        brandColor: '#EF4444',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      profiles[userId] = profile;
    }

    // Apply centralized normalization & hydration
    const normalized = normalizeProfiles({ [userId]: profile });
    return normalized[userId];
  },

  updateStoreProfile: async (userId, payload) => {
    if (!userId) throw new Error('User ID is required');

    const profiles = getHydratedProfiles();
    if (!profiles[userId]) throw new Error('Store profile not found in mock DB');

    profiles[userId] = {
      ...profiles[userId],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    // Apply centralized normalization & hydration
    const normalized = normalizeProfiles({ [userId]: profiles[userId] });
    return normalized[userId];
  },

  deleteAccount: async () => {
    // Simulate API + success response
    await new Promise((res) => setTimeout(res, 150));
    return { success: true };
  },
};

// --- Real API Service ---
const apiUserService = {
  getStoreProfile: async (userId) => {
    if (!userId) throw new Error('User ID is required');
    const url = `${ENDPOINTS.USERS.PROFILE}?userId=${encodeURIComponent(userId)}`;
    const response = await apiRequest({ url, method: 'GET' });
    return response;
  },

  updateStoreProfile: async (_userId, payload) => {
    // Server identifies user from auth token; no need for userId in path
    const url = ENDPOINTS.USERS.UPDATE_PROFILE;
    const response = await apiRequest({ url, method: 'PATCH', data: payload });
    return response;
  },

  deleteAccount: async () => {
    const url = ENDPOINTS.USERS.DELETE_ACCOUNT;
    const response = await apiRequest({ url, method: 'DELETE' });
    return response;
  },
};

// --- Export service based on global flag ---
export const userService = USE_DUMMY_DATA ? dummyUserService : apiUserService;