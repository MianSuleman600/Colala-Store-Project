// src/services/couponService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import * as normalizers from '../../utils/dataNormalizer.js';
import { DUMMY_COUPONS, DUMMY_CUSTOMER_POINTS, DUMMY_POINTS_SUMMARY } from '../../utils/data/couponsPointsData.js';

const identity = (x) => x;
const normCoupons = typeof normalizers.normalizeCoupons === 'function' ? normalizers.normalizeCoupons : identity;

/* ---------------- Utilities ---------------- */
const pad2 = (n) => String(n).padStart(2, '0');
const toIsoDateOnly = (d) => {
  if (!d) return undefined;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return undefined;
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
};

const nowToDisplayDate = () => new Date().toISOString();
const clampNumber = (v, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(min, Math.min(max, n));
};

// Map UI payload (camelCase) to API payload (snake_case) safely
const toSafeCouponPayload = (payload = {}, partial = false) => {
  const src = payload || {};

  const mapped = {};

  if (!partial || src.code !== undefined) mapped.code = String(src.code || '').trim();

  if (!partial || src.percentageOff !== undefined) {
    const pct = clampNumber(src.percentageOff, 1, 100);
    if (pct !== undefined) mapped.percentage_off = pct;
  }

  if (!partial || src.maxUsage !== undefined) {
    const max = clampNumber(src.maxUsage, 1, Number.MAX_SAFE_INTEGER);
    if (max !== undefined) mapped.max_usage = max;
  }

  if (!partial || src.usagePerUser !== undefined) {
    const per = clampNumber(src.usagePerUser, 1, Number.MAX_SAFE_INTEGER);
    if (per !== undefined) mapped.usage_per_user = per;
  }

  if (!partial || src.expiryDate !== undefined) {
    const dateOnly = toIsoDateOnly(src.expiryDate);
    if (dateOnly) mapped.expiry_date = dateOnly;
  }

  return mapped;
};
const takeList = (res) => res?.data || res?.coupons || (Array.isArray(res) ? res : []);
const takeItem = (res) => res?.data || res?.coupon || res;

/* ---------------- Dummy Service (Unchanged) ---------------- */
let coupons = [...DUMMY_COUPONS];
let customerPoints = [...DUMMY_CUSTOMER_POINTS];
let totalPointsBalance = DUMMY_POINTS_SUMMARY.totalPointsBalance;
const dummyCouponService = {
  // Coupons
  getCoupons: async () => ({ coupons: normCoupons(coupons) }),
  createCoupon: async (payload) => {
    const data = toSafeCouponPayload(payload);
    const newItem = {
      id: `coupon-${Date.now()}`,
      code: data.code || '',
      percentageOff: Number(data.percentage_off) || 0,
      maxUsage: Number(data.max_usage) || 0,
      usagePerUser: Number(data.usage_per_user) || 1,
      expiryDate: data.expiry_date || '',
      dateCreated: nowToDisplayDate(),
      timesUsed: 0,
    };
    coupons.unshift(newItem);
    return { coupon: newItem };
  },
  updateCoupon: async (id, payload) => {
    const data = toSafeCouponPayload(payload, true);
    coupons = coupons.map((c) => (c.id === id ? {
      ...c,
      code: data.code !== undefined ? data.code : c.code,
      percentageOff: data.percentage_off !== undefined ? Number(data.percentage_off) : c.percentageOff,
      maxUsage: data.max_usage !== undefined ? Number(data.max_usage) : c.maxUsage,
      usagePerUser: data.usage_per_user !== undefined ? Number(data.usage_per_user) : c.usagePerUser,
      expiryDate: data.expiry_date !== undefined ? data.expiry_date : c.expiryDate,
    } : c));
    const updated = coupons.find((c) => c.id === id);
    return { coupon: updated };
  },
  deleteCoupon: async (id) => {
    coupons = coupons.filter((c) => c.id !== id);
    return { success: true };
  },
  applyCoupon: async (code) => ({ success: true, code }),

  // Points
  getPointsSummary: async () => ({ data: { totalPointsBalance } }),
  getCustomerPoints: async () => ({ data: customerPoints }),
  updatePointsSettings: async (payload) => ({ success: true, payload }),
};

/* ---------------- CORRECTED: Real API Service ---------------- */
const apiCouponService = {
  // Coupons
  getCoupons: async () => {
    const res = await apiRequest({ url: ENDPOINTS.SELLER_COUPONS.LIST, method: 'GET' });
    return { coupons: normCoupons(takeList(res)) };
  },

  createCoupon: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.SELLER_COUPONS.CREATE,
      method: 'POST',
      data: toSafeCouponPayload(payload),
    });
    return { coupon: takeItem(res) };
  },

  updateCoupon: async (id, payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.SELLER_COUPONS.UPDATE(id),
      method: 'PUT',
      data: toSafeCouponPayload(payload, true),
    });
    return { coupon: takeItem(res) };
  },

  deleteCoupon: async (id) => {
    await apiRequest({ url: ENDPOINTS.SELLER_COUPONS.DELETE(id), method: 'DELETE' });
    return { success: true };
  },

  applyCoupon: async (code) => {
    const res = await apiRequest({ url: ENDPOINTS.SELLER_COUPONS.APPLY(code), method: 'POST' });
    return takeItem(res);
  },

  // Points (These remain correct as they have their own ENDPOINTS object)
  getPointsSummary: async () => apiRequest({ url: ENDPOINTS.POINTS.SUMMARY, method: 'GET' }),
  getCustomerPoints: async () => apiRequest({ url: ENDPOINTS.POINTS.CUSTOMERS, method: 'GET' }),
  updatePointsSettings: async (payload) => apiRequest({ url: ENDPOINTS.POINTS.UPDATE_SETTINGS, method: 'PUT', data: payload }),
};

export const couponService = USE_DUMMY_DATA ? dummyCouponService : apiCouponService;