// src/services/announcementService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import * as normalizers from '../../utils/dataNormalizer.js';

// Safe normalizers
const idFn = (x) => x;
const normAnnouncements =
  typeof normalizers.normalizeAnnouncements === 'function' ? normalizers.normalizeAnnouncements : idFn;
const normBanners =
  typeof normalizers.normalizeBanners === 'function' ? normalizers.normalizeBanners : idFn;

// Dummy seeds
import dummyAnnouncements from '../../utils/data/dummyAnnouncements.js';
import dummyBanners from '../../utils/data/dummyBanners.js';

/* ---------------- Utils ---------------- */
const nowStr = () => {
  const d = new Date();
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const year = String(d.getFullYear()).slice(2);
  let hours = d.getHours();
  const minutes = pad(d.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = pad(hours);
  return `${month}-${day}-${year}/${hoursStr}:${minutes}${ampm}`;
};

const toSafeAnnouncementPayload = (p = {}, partial = false) => {
  const base = {};
  if (!partial || p.text !== undefined) base.text = String(p.text || '').trim();
  if (!partial || p.active !== undefined) base.active = Boolean(p.active);
  if (!partial || p.startAt !== undefined) base.startAt = p.startAt || null;
  if (!partial || p.endAt !== undefined) base.endAt = p.endAt || null;
  if (!partial || p.priority !== undefined) base.priority = Number.isFinite(+p.priority) ? +p.priority : 0;
  if (!partial || p.pinned !== undefined) base.pinned = Boolean(p.pinned);
  return base;
};

const toSafeBannerPayload = (p = {}, partial = false) => {
  const base = {};
  if (!partial || p.imageUrl !== undefined) base.imageUrl = String(p.imageUrl || '').trim();
  if (!partial || p.link !== undefined) base.link = String(p.link || '').trim();
  if (!partial || p.active !== undefined) base.active = Boolean(p.active);
  if (!partial || p.placement !== undefined) base.placement = String(p.placement || 'home'); // 'home' | 'profile'
  if (!partial || p.alt !== undefined) base.alt = String(p.alt || 'Promotional Banner');
  return base;
};

// Helpers to accept Laravel resource responses
const takeList = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res)) return res;
  return [];
};
const takeItem = (res) => res?.data || res;

/* ---------------- Dummy Service ---------------- */
let ANN = Array.isArray(dummyAnnouncements) ? [...dummyAnnouncements] : [];
let BNR = Array.isArray(dummyBanners) ? [...dummyBanners] : [];

const dummyAnnouncementService = {
  // Announcements
  getAnnouncements: async () => ({ success: true, announcements: normAnnouncements(ANN) }),
  getActiveAnnouncements: async () => ({
    success: true,
    announcements: normAnnouncements(ANN.filter((a) => a.active)),
  }),
  createAnnouncement: async (payload) => {
    const safe = toSafeAnnouncementPayload(payload);
    const item = {
      id: `ann-${Date.now()}`,
      impressions: 0,
      dateCreated: nowStr(),
      ...safe,
    };
    ANN.unshift(item);
    return { success: true, announcement: normAnnouncements([item])[0] };
  },
  updateAnnouncement: async (id, payload) => {
    const idx = ANN.findIndex((a) => a.id === id);
    if (idx === -1) return { success: false, message: 'Announcement not found' };
    ANN[idx] = { ...ANN[idx], ...toSafeAnnouncementPayload(payload, true) };
    return { success: true, announcement: normAnnouncements([ANN[idx]])[0] };
  },
  deleteAnnouncement: async (id) => {
    const before = ANN.length;
    ANN = ANN.filter((a) => a.id !== id);
    return { success: ANN.length < before };
  },
  trackAnnouncementImpression: async (id) => {
    const it = ANN.find((a) => a.id === id);
    if (it) it.impressions = (it.impressions || 0) + 1;
    return { success: true };
  },

  // Banners
  getBanners: async ({ placement } = {}) => {
    let list = BNR;
    if (placement) list = list.filter((b) => b.placement === placement);
    return { success: true, banners: normBanners(list) };
  },
  getActiveBanners: async ({ placement } = {}) => {
    let list = BNR.filter((b) => b.active);
    if (placement) list = list.filter((b) => b.placement === placement);
    return { success: true, banners: normBanners(list) };
  },
  createBanner: async (payload) => {
    const safe = toSafeBannerPayload(payload);
    const item = {
      id: `ban-${Date.now()}`,
      impressions: 0,
      dateCreated: nowStr(),
      ...safe,
    };
    BNR.unshift(item);
    return { success: true, banner: normBanners([item])[0] };
  },
  updateBanner: async (id, payload) => {
    const idx = BNR.findIndex((b) => b.id === id);
    if (idx === -1) return { success: false, message: 'Banner not found' };
    BNR[idx] = { ...BNR[idx], ...toSafeBannerPayload(payload, true) };
    return { success: true, banner: normBanners([BNR[idx]])[0] };
  },
  deleteBanner: async (id) => {
    const before = BNR.length;
    BNR = BNR.filter((b) => b.id !== id);
    return { success: BNR.length < before };
  },
  trackBannerImpression: async (id) => {
    const it = BNR.find((b) => b.id === id);
    if (it) it.impressions = (it.impressions || 0) + 1;
    return { success: true };
  },
};

/* ---------------- Real API Service ---------------- */
const apiAnnouncementService = {
  // Announcements
  getAnnouncements: async () => {
    const res = await apiRequest({ url: ENDPOINTS.ANNOUNCEMENTS.LIST, method: 'GET' });
    return { success: true, announcements: normAnnouncements(takeList(res)) };
  },
  getActiveAnnouncements: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.ANNOUNCEMENTS.ACTIVE(params), method: 'GET' });
    return { success: true, announcements: normAnnouncements(takeList(res)) };
  },
  createAnnouncement: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.ANNOUNCEMENTS.CREATE,
      method: 'POST',
      data: toSafeAnnouncementPayload(payload),
    });
    return { success: true, announcement: normAnnouncements([takeItem(res)])[0] };
  },
  updateAnnouncement: async (id, payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.ANNOUNCEMENTS.UPDATE(id),
      method: 'PUT',
      data: toSafeAnnouncementPayload(payload, true),
    });
    return { success: true, announcement: normAnnouncements([takeItem(res)])[0] };
  },
  deleteAnnouncement: async (id) => {
    await apiRequest({ url: ENDPOINTS.ANNOUNCEMENTS.DELETE(id), method: 'DELETE' });
    return { success: true };
  },
  trackAnnouncementImpression: async (id) => {
    await apiRequest({ url: ENDPOINTS.ANNOUNCEMENTS.TRACK_IMPRESSION(id), method: 'POST' });
    return { success: true };
  },

  // Banners
  getBanners: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.BANNERS.LIST(params), method: 'GET' });
    return { success: true, banners: normBanners(takeList(res)) };
  },
  getActiveBanners: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.BANNERS.ACTIVE(params), method: 'GET' });
    return { success: true, banners: normBanners(takeList(res)) };
  },
  createBanner: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.BANNERS.CREATE,
      method: 'POST',
      data: toSafeBannerPayload(payload),
    });
    return { success: true, banner: normBanners([takeItem(res)])[0] };
  },
  updateBanner: async (id, payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.BANNERS.UPDATE(id),
      method: 'PUT',
      data: toSafeBannerPayload(payload, true),
    });
    return { success: true, banner: normBanners([takeItem(res)])[0] };
  },
  deleteBanner: async (id) => {
    await apiRequest({ url: ENDPOINTS.BANNERS.DELETE(id), method: 'DELETE' });
    return { success: true };
  },
  trackBannerImpression: async (id) => {
    await apiRequest({ url: ENDPOINTS.BANNERS.TRACK_IMPRESSION(id), method: 'POST' });
    return { success: true };
  },
};

// Export
export const announcementService = USE_DUMMY_DATA ? dummyAnnouncementService : apiAnnouncementService;