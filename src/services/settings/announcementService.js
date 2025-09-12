// src/services/settings/announcementService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import * as normalizers from '../../utils/dataNormalizer.js';

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

// Robust list/item extractors for various API shapes
const takeList = (res) => {
  const d1 = res?.data ?? res;
  if (Array.isArray(d1)) return d1;
  const d2 = d1?.data ?? d1?.result ?? d1?.results;
  if (Array.isArray(d2)) return d2;
  if (Array.isArray(d1?.items)) return d1.items;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};
const takeItem = (res) => {
  const d1 = res?.data ?? res;
  return d1?.data ?? d1;
};

// Absolute URL resolver for relative paths
const ASSET_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ASSETS_BASE_URL) ||
  (ENDPOINTS?.ASSET_BASE_URL || '');

const toAbsoluteUrl = (p) => {
  if (!p) return '';
  if (/^https?:\/\//i.test(p) || /^data:|^blob:/i.test(p)) return p;
  if (!ASSET_BASE) return p;
  return `${String(ASSET_BASE).replace(/\/+$/, '')}/${String(p).replace(/^\/+/, '')}`;
};

// Fallback normalizer for banners (maps snake_case to camelCase, ensures imageUrl)
const normalizeBannerMinimal = (b = {}) => ({
  id: b.id ?? b.uuid ?? b._id ?? b.banner_id ?? String(Date.now()),
  imageUrl: toAbsoluteUrl(
    b.imageUrl ?? b.image_url ?? b.image_path ?? b.image ?? b.url ?? ''
  ),
  link: b.link ?? b.target_url ?? b.href ?? '',
  alt: b.alt ?? b.title ?? 'Promotional Banner',
  active:
    typeof b.active === 'boolean'
      ? b.active
      : Boolean(
          Number(b.active) ||
            b.status === 'active' ||
            b.is_active ||
            b.enabled
        ),
  placement: b.placement ?? b.location ?? b.slot ?? 'home',
  dateCreated: b.dateCreated ?? b.created_at ?? b.createdAt ?? '',
  impressions: b.impressions ?? b.views ?? 0,
});

// Safe normalizers
const normAnnouncements =
  typeof normalizers.normalizeAnnouncements === 'function'
    ? normalizers.normalizeAnnouncements
    : (arr) => Array.isArray(arr) ? arr : [];

const normBanners =
  typeof normalizers.normalizeBanners === 'function'
    ? normalizers.normalizeBanners
    : (arr) => (Array.isArray(arr) ? arr.map(normalizeBannerMinimal) : []);

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
    const item = {
      id: `ann-${Date.now()}`,
      impressions: 0,
      dateCreated: nowStr(),
      text: String(payload?.text || '').trim(),
      active: Boolean(payload?.active),
      startAt: payload?.startAt || null,
      endAt: payload?.endAt || null,
      priority: Number.isFinite(+payload?.priority) ? +payload.priority : 0,
      pinned: Boolean(payload?.pinned),
    };
    ANN.unshift(item);
    return { success: true, announcement: normAnnouncements([item])[0] };
  },
  updateAnnouncement: async (id, payload) => {
    const idx = ANN.findIndex((a) => a.id === id);
    if (idx === -1) return { success: false, message: 'Announcement not found' };
    ANN[idx] = { ...ANN[idx], ...payload };
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
    const item = {
      id: `ban-${Date.now()}`,
      impressions: 0,
      dateCreated: nowStr(),
      imageUrl: String(payload?.imageUrl || '').trim(),
      link: String(payload?.link || '').trim(),
      active: Boolean(payload?.active),
      placement: String(payload?.placement || 'home'),
      alt: String(payload?.alt || 'Promotional Banner'),
    };
    BNR.unshift(item);
    return { success: true, banner: normBanners([item])[0] };
  },
  updateBanner: async (id, payload) => {
    const idx = BNR.findIndex((b) => b.id === id);
    if (idx === -1) return { success: false, message: 'Banner not found' };
    BNR[idx] = { ...BNR[idx], ...payload };
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
    const url =
      typeof ENDPOINTS.ANNOUNCEMENTS.ACTIVE === 'function'
        ? ENDPOINTS.ANNOUNCEMENTS.ACTIVE(params)
        : ENDPOINTS.ANNOUNCEMENTS.ACTIVE;
    const res = await apiRequest({ url, method: 'GET', params });
    return { success: true, announcements: normAnnouncements(takeList(res)) };
  },

  // Banners
  getBanners: async (params = {}) => {
    const url =
      typeof ENDPOINTS.BANNERS.LIST === 'function'
        ? ENDPOINTS.BANNERS.LIST(params)
        : ENDPOINTS.BANNERS.LIST;
    const res = await apiRequest({ url, method: 'GET', params });
    return { success: true, banners: normBanners(takeList(res)) };
  },
  getActiveBanners: async (params = {}) => {
    const url =
      typeof ENDPOINTS.BANNERS.ACTIVE === 'function'
        ? ENDPOINTS.BANNERS.ACTIVE(params)
        : ENDPOINTS.BANNERS.ACTIVE;
    const res = await apiRequest({ url, method: 'GET', params });
    return { success: true, banners: normBanners(takeList(res)) };
  },
  createBanner: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.BANNERS.CREATE,
      method: 'POST',
      data: {
        imageUrl: String(payload?.imageUrl || '').trim(),
        link: String(payload?.link || '').trim(),
        active: Boolean(payload?.active),
        placement: String(payload?.placement || 'home'),
        alt: String(payload?.alt || 'Promotional Banner'),
      },
    });
    return { success: true, banner: normBanners([takeItem(res)])[0] };
  },
  updateBanner: async (id, payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.BANNERS.UPDATE(id),
      method: 'PUT',
      data: payload,
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

export const announcementService = USE_DUMMY_DATA ? dummyAnnouncementService : apiAnnouncementService;