// src/services/settings/announcementService.js

import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS, ASSETS_BASE } from '../../api/apiConfig.js';

const takeList = (res) => res?.data || [];
const takeItem = (res) => res?.data || res;

const normalizeBanner = (banner) => {
  if (!banner) return null;
  // This handles all known image URL keys from the backend (image_url, image_path_url, image_path)
  const imageUrl = banner.image_url || banner.image_path_url || (banner.image_path ? `${ASSETS_BASE}/storage/${banner.image_path}` : '');
  
  return {
    id: banner.id,
    imageUrl: imageUrl,
    link: banner.link,
    alt: banner.alt,
    createdAt: banner.created_at,
    // `placement` and `active` fields are removed as they are not provided by the backend.
  };
};

const normalizeAnnouncement = (ann) => {
  if (!ann) return null;
  return {
    id: ann.id,
    text: ann.message,
    active: !!ann.is_active,
    pinned: !!ann.is_pinned,
    priority: ann.priority || 0,
    impressions: ann.impressions || 0,
    createdAt: ann.created_at,
  };
};

export const announcementService = {
  // --- Announcements ---
  getAnnouncements: async () => {
    const res = await apiRequest({ url: ENDPOINTS.SELLER_ANNOUNCEMENTS.LIST, method: 'GET' });
    return takeList(res).map(normalizeAnnouncement);
  },
  createAnnouncement: async (payload) => {
    const res = await apiRequest({ url: ENDPOINTS.SELLER_ANNOUNCEMENTS.CREATE, method: 'POST', data: payload });
    return normalizeAnnouncement(takeItem(res));
  },
  updateAnnouncement: async (id, payload) => {
    const res = await apiRequest({ url: ENDPOINTS.SELLER_ANNOUNCEMENTS.UPDATE(id), method: 'PUT', data: payload });
    return normalizeAnnouncement(takeItem(res));
  },
  deleteAnnouncement: async (id) => {
    await apiRequest({ url: ENDPOINTS.SELLER_ANNOUNCEMENTS.DELETE(id), method: 'DELETE' });
    return { success: true };
  },

  // --- Banners ---
  getBanners: async () => {
    const res = await apiRequest({ url: ENDPOINTS.SELLER_BANNERS.LIST, method: 'GET' });
    return takeList(res).map(normalizeBanner);
  },
  createBanner: async (formData) => {
    const res = await apiRequest({ url: ENDPOINTS.SELLER_BANNERS.CREATE, method: 'POST', data: formData });
    return normalizeBanner(takeItem(res));
  },
  updateBanner: async (id, formData) => {
    // The backend route is POST, so we send a direct POST request.
    const res = await apiRequest({ 
      url: ENDPOINTS.SELLER_BANNERS.UPDATE(id), 
      method: 'POST', 
      data: formData 
    });
    return normalizeBanner(takeItem(res));
  },
  deleteBanner: async (id) => {
    await apiRequest({ url: ENDPOINTS.SELLER_BANNERS.DELETE(id), method: 'DELETE' });
    return { success: true };
  },
};