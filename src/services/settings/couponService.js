// src/services/couponService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';

// Import normalizers as a namespace and use safe fallbacks
import * as normalizers from '../../utils/dataNormalizer.js';
const identity = (x) => x;
const normCoupons =
  typeof normalizers.normalizeCoupons === 'function' ? normalizers.normalizeCoupons : identity;
const normPoints =
  typeof normalizers.normalizeCustomerPoints === 'function'
    ? normalizers.normalizeCustomerPoints
    : identity;

// Dummy seed
import {
  DUMMY_COUPONS,
  DUMMY_CUSTOMER_POINTS,
  DUMMY_POINTS_SUMMARY,
} from '../../utils/data/couponsPointsData.js';

/* ---------------- Utilities ---------------- */
const nowToDisplayDate = () => {
  // returns "MM-DD-YY/HH:MMAM"
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

const clampNumber = (v, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
};

const toSafeCouponPayload = (payload = {}, partial = false) => {
  const base = {};
  if (!partial || payload.code !== undefined) {
    base.code = String(payload.code || '').trim().toUpperCase();
  }
  if (!partial || payload.maxUsage !== undefined) {
    base.maxUsage = clampNumber(payload.maxUsage, 1, Number.MAX_SAFE_INTEGER);
  }
  if (!partial || payload.percentageOff !== undefined) {
    base.percentageOff = clampNumber(payload.percentageOff, 0, 100);
  }
  if (!partial || payload.usagePerUser !== undefined) {
    base.usagePerUser = clampNumber(payload.usagePerUser, 1, Number.MAX_SAFE_INTEGER);
  }
  if (!partial || payload.expiryDate !== undefined) {
    base.expiryDate = payload.expiryDate || '';
  }
  return base;
};

// Helper: normalize Laravel resource responses
const takeList = (res) => {
  if (Array.isArray(res?.data)) return res.data; // Laravel resource collection
  if (Array.isArray(res?.coupons)) return res.coupons;
  if (Array.isArray(res)) return res;
  return [];
};
const takeItem = (res) => res?.data || res?.coupon || res;

/* ---------------- Dummy Service ---------------- */
let coupons = Array.isArray(DUMMY_COUPONS) ? [...DUMMY_COUPONS] : [];
let customerPoints = Array.isArray(DUMMY_CUSTOMER_POINTS) ? [...DUMMY_CUSTOMER_POINTS] : [];
let totalPointsBalance =
  typeof DUMMY_POINTS_SUMMARY?.totalPointsBalance === 'number'
    ? DUMMY_POINTS_SUMMARY.totalPointsBalance
    : 0;

const dummyCouponService = {
  // Coupons
  getCoupons: async () => ({
    success: true,
    coupons: normCoupons(coupons),
    message: 'Coupons fetched successfully (dummy)',
  }),

  createCoupon: async (payload) => {
    const safe = toSafeCouponPayload(payload);
    const newCoupon = {
      id: `c-${Date.now()}`,
      code: safe.code,
      dateCreated: nowToDisplayDate(),
      timesUsed: 0,
      maxUsage: safe.maxUsage,
      percentageOff: safe.percentageOff,
      usagePerUser: safe.usagePerUser,
      expiryDate: safe.expiryDate,
    };
    coupons.unshift(newCoupon);
    return {
      success: true,
      message: 'Coupon created (dummy)',
      coupon: normCoupons([newCoupon])[0],
    };
  },

  updateCoupon: async (id, payload) => {
    const idx = coupons.findIndex((c) => c.id === id);
    if (idx === -1) return { success: false, message: 'Coupon not found (dummy)' };
    coupons[idx] = { ...coupons[idx], ...toSafeCouponPayload(payload, true) };
    return {
      success: true,
      message: 'Coupon updated (dummy)',
      coupon: normCoupons([coupons[idx]])[0],
    };
  },

  deleteCoupon: async (id) => {
    const before = coupons.length;
    coupons = coupons.filter((c) => c.id !== id);
    return { success: coupons.length < before, message: 'Coupon deleted (dummy)' };
  },

  // Points
  getPointsSummary: async () => ({
    success: true,
    data: { totalPointsBalance },
    message: 'Points summary fetched (dummy)',
  }),

  getCustomerPoints: async () => ({
    success: true,
    customers: normPoints(customerPoints),
    message: 'Customer points fetched (dummy)',
  }),

  updatePointsSettings: async (payload) => ({
    success: true,
    message: 'Points settings updated (dummy)',
    data: payload,
  }),
};

/* ---------------- Real API Service ---------------- */
const apiCouponService = {
  // Coupons
  getCoupons: async () => {
    const res = await apiRequest({ url: ENDPOINTS.COUPONS.GET_ALL, method: 'GET' });
    const list = takeList(res);
    return { success: true, coupons: normCoupons(list) };
  },

  createCoupon: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.COUPONS.CREATE,
      method: 'POST',
      data: toSafeCouponPayload(payload),
    });
    const coupon = takeItem(res);
    return { success: true, coupon };
  },

  updateCoupon: async (id, payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.COUPONS.UPDATE(id),
      method: 'PUT',
      data: toSafeCouponPayload(payload, true),
    });
    const coupon = takeItem(res);
    return { success: true, coupon };
  },

  deleteCoupon: async (id) => {
    await apiRequest({ url: ENDPOINTS.COUPONS.DELETE(id), method: 'DELETE' });
    return { success: true };
  },

  // Points
  getPointsSummary: async () => {
    const res = await apiRequest({ url: ENDPOINTS.POINTS.SUMMARY, method: 'GET' });
    return { success: true, data: res?.data || res };
  },

  getCustomerPoints: async () => {
    const res = await apiRequest({ url: ENDPOINTS.POINTS.CUSTOMERS, method: 'GET' });
    const list =
      Array.isArray(res?.data) ? res.data : Array.isArray(res?.customers) ? res.customers : [];
    return { success: true, customers: normPoints(list) };
  },

  updatePointsSettings: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.POINTS.UPDATE_SETTINGS,
      method: 'PUT',
      data: payload,
    });
    return { success: true, data: res?.data || res };
  },
};

export const couponService = USE_DUMMY_DATA ? dummyCouponService : apiCouponService;