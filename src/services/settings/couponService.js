// src/services/couponService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import * as normalizers from '../../utils/dataNormalizer.js';
import { DUMMY_COUPONS, DUMMY_CUSTOMER_POINTS, DUMMY_POINTS_SUMMARY } from '../../utils/data/couponsPointsData.js';

const identity = (x) => x;
const normCoupons = typeof normalizers.normalizeCoupons === 'function' ? normalizers.normalizeCoupons : identity;
const normPoints = typeof normalizers.normalizeCustomerPoints === 'function' ? normalizers.normalizeCustomerPoints : identity;

/* ---------------- Utilities (Unchanged) ---------------- */
const nowToDisplayDate = () => { /* ... */ };
const clampNumber = (v, min, max) => { /* ... */ };
const toSafeCouponPayload = (payload = {}, partial = false) => { /* ... */ };
const takeList = (res) => res?.data || res?.coupons || (Array.isArray(res) ? res : []);
const takeItem = (res) => res?.data || res?.coupon || res;

/* ---------------- Dummy Service (Unchanged) ---------------- */
let coupons = [...DUMMY_COUPONS];
let customerPoints = [...DUMMY_CUSTOMER_POINTS];
let totalPointsBalance = DUMMY_POINTS_SUMMARY.totalPointsBalance;
const dummyCouponService = { /* ... (your original dummy service logic is correct and unchanged) ... */ };

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