// src/services/reviewService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import * as normalizers from '../../utils/dataNormalizer.js';

const idFn = (x) => x;
const normStore = typeof normalizers.normalizeStoreReviews === 'function' ? normalizers.normalizeStoreReviews : idFn;
const normProduct = typeof normalizers.normalizeProductReviews === 'function' ? normalizers.normalizeProductReviews : idFn;

// Dummy Seeds
import { DUMMY_STORE_REVIEWS, DUMMY_PRODUCT_REVIEWS } from '../../utils/data/dummyReviews.js';

/* ---------------- Utils ---------------- */
const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));
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
const takeList = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res)) return res;
  return [];
};
const takeItem = (res) => res?.data || res;

/* ---------------- Dummy ---------------- */
let STORE_REVIEWS = Array.isArray(DUMMY_STORE_REVIEWS) ? [...DUMMY_STORE_REVIEWS] : [];
let PRODUCT_REVIEWS = Array.isArray(DUMMY_PRODUCT_REVIEWS) ? [...DUMMY_PRODUCT_REVIEWS] : [];

const dummyReviewService = {
  // Store
  getStoreReviews: async (params = {}) => {
    const { storeId } = params;
    let list = STORE_REVIEWS;
    if (storeId) list = list.filter((r) => r.storeId === storeId);
    return { success: true, reviews: normStore(list) };
  },
  getStoreReviewById: async (id) => {
    const it = STORE_REVIEWS.find((r) => r.id === id);
    return { success: !!it, review: normStore([it]).find(Boolean) || null };
  },
  createStoreReview: async (payload) => {
    const item = {
      id: `sr-${Date.now()}`,
      reviewerName: String(payload.reviewerName || 'Anonymous'),
      reviewerAvatar: payload.reviewerAvatar || '',
      rating: clamp(payload.rating, 0, 5),
      reviewText: String(payload.reviewText || '').trim(),
      dateCreated: nowStr(),
      storeId: payload.storeId || null,
    };
    STORE_REVIEWS.unshift(item);
    return { success: true, review: normStore([item])[0] };
  },
  updateStoreReview: async (id, payload) => {
    const idx = STORE_REVIEWS.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, message: 'Review not found' };
    const upd = { ...STORE_REVIEWS[idx] };
    if (payload.reviewerName !== undefined) upd.reviewerName = String(payload.reviewerName || 'Anonymous');
    if (payload.reviewerAvatar !== undefined) upd.reviewerAvatar = payload.reviewerAvatar || '';
    if (payload.rating !== undefined) upd.rating = clamp(payload.rating, 0, 5);
    if (payload.reviewText !== undefined) upd.reviewText = String(payload.reviewText || '').trim();
    STORE_REVIEWS[idx] = upd;
    return { success: true, review: normStore([STORE_REVIEWS[idx]])[0] };
  },
  deleteStoreReview: async (id) => {
    const before = STORE_REVIEWS.length;
    STORE_REVIEWS = STORE_REVIEWS.filter((r) => r.id !== id);
    return { success: STORE_REVIEWS.length < before };
  },

  // Product
  getProductReviews: async (params = {}) => {
    const { productId } = params;
    let list = PRODUCT_REVIEWS;
    if (productId) list = list.filter((r) => r.productId === productId);
    return { success: true, reviews: normProduct(list) };
  },
  getProductReviewById: async (id) => {
    const it = PRODUCT_REVIEWS.find((r) => r.id === id);
    return { success: !!it, review: normProduct([it]).find(Boolean) || null };
  },
  createProductReview: async (payload) => {
    const item = {
      id: `pr-${Date.now()}`,
      reviewerName: String(payload.reviewerName || 'Anonymous'),
      reviewerAvatar: payload.reviewerAvatar || '',
      rating: clamp(payload.rating, 0, 5),
      reviewText: String(payload.reviewText || '').trim(),
      dateCreated: nowStr(),
      productImages: Array.isArray(payload.productImages) ? payload.productImages : [],
      productId: payload.productId || null,
    };
    PRODUCT_REVIEWS.unshift(item);
    return { success: true, review: normProduct([item])[0] };
  },
  updateProductReview: async (id, payload) => {
    const idx = PRODUCT_REVIEWS.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, message: 'Review not found' };
    const upd = { ...PRODUCT_REVIEWS[idx] };
    if (payload.reviewerName !== undefined) upd.reviewerName = String(payload.reviewerName || 'Anonymous');
    if (payload.reviewerAvatar !== undefined) upd.reviewerAvatar = payload.reviewerAvatar || '';
    if (payload.rating !== undefined) upd.rating = clamp(payload.rating, 0, 5);
    if (payload.reviewText !== undefined) upd.reviewText = String(payload.reviewText || '').trim();
    if (payload.productImages !== undefined) upd.productImages = Array.isArray(payload.productImages) ? payload.productImages : [];
    PRODUCT_REVIEWS[idx] = upd;
    return { success: true, review: normProduct([PRODUCT_REVIEWS[idx]])[0] };
  },
  deleteProductReview: async (id) => {
    const before = PRODUCT_REVIEWS.length;
    PRODUCT_REVIEWS = PRODUCT_REVIEWS.filter((r) => r.id !== id);
    return { success: PRODUCT_REVIEWS.length < before };
  },
};

/* ---------------- Real API ---------------- */
const toSafeStorePayload = (p = {}, partial = false) => {
  const base = {};
  if (!partial || p.reviewerName !== undefined) base.reviewerName = String(p.reviewerName || 'Anonymous');
  if (!partial || p.reviewerAvatar !== undefined) base.reviewerAvatar = p.reviewerAvatar || '';
  if (!partial || p.rating !== undefined) base.rating = clamp(p.rating, 0, 5);
  if (!partial || p.reviewText !== undefined) base.reviewText = String(p.reviewText || '').trim();
  if (!partial || p.storeId !== undefined) base.storeId = p.storeId || null;
  return base;
};
const toSafeProductPayload = (p = {}, partial = false) => {
  const base = {};
  if (!partial || p.reviewerName !== undefined) base.reviewerName = String(p.reviewerName || 'Anonymous');
  if (!partial || p.reviewerAvatar !== undefined) base.reviewerAvatar = p.reviewerAvatar || '';
  if (!partial || p.rating !== undefined) base.rating = clamp(p.rating, 0, 5);
  if (!partial || p.reviewText !== undefined) base.reviewText = String(p.reviewText || '').trim();
  if (!partial || p.productImages !== undefined) base.productImages = Array.isArray(p.productImages) ? p.productImages : [];
  if (!partial || p.productId !== undefined) base.productId = p.productId || null;
  return base;
};

const apiReviewService = {
  // Store
  getStoreReviews: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.REVIEWS.STORE.LIST(params), method: 'GET' });
    return { success: true, reviews: normStore(takeList(res)) };
    // optional pagination: return res.meta etc.
  },
  getStoreReviewById: async (id) => {
    const res = await apiRequest({ url: ENDPOINTS.REVIEWS.STORE.DETAIL(id), method: 'GET' });
    return { success: true, review: normStore([takeItem(res)])[0] };
  },
  createStoreReview: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.REVIEWS.STORE.CREATE,
      method: 'POST',
      data: toSafeStorePayload(payload),
    });
    return { success: true, review: normStore([takeItem(res)])[0] };
  },
  updateStoreReview: async (id, payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.REVIEWS.STORE.UPDATE(id),
      method: 'PUT',
      data: toSafeStorePayload(payload, true),
    });
    return { success: true, review: normStore([takeItem(res)])[0] };
  },
  deleteStoreReview: async (id) => {
    await apiRequest({ url: ENDPOINTS.REVIEWS.STORE.DELETE(id), method: 'DELETE' });
    return { success: true };
  },

  // Product
  getProductReviews: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.REVIEWS.PRODUCT.LIST(params), method: 'GET' });
    return { success: true, reviews: normProduct(takeList(res)) };
  },
  getProductReviewById: async (id) => {
    const res = await apiRequest({ url: ENDPOINTS.REVIEWS.PRODUCT.DETAIL(id), method: 'GET' });
    return { success: true, review: normProduct([takeItem(res)])[0] };
  },
  createProductReview: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.REVIEWS.PRODUCT.CREATE,
      method: 'POST',
      data: toSafeProductPayload(payload),
    });
    return { success: true, review: normProduct([takeItem(res)])[0] };
  },
  updateProductReview: async (id, payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.REVIEWS.PRODUCT.UPDATE(id),
      method: 'PUT',
      data: toSafeProductPayload(payload, true),
    });
    return { success: true, review: normProduct([takeItem(res)])[0] };
  },
  deleteProductReview: async (id) => {
    await apiRequest({ url: ENDPOINTS.REVIEWS.PRODUCT.DELETE(id), method: 'DELETE' });
    return { success: true };
  },
};

export const reviewService = USE_DUMMY_DATA ? dummyReviewService : apiReviewService;