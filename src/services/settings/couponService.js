import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';

/* ---------------- Utilities ---------------- */
const pad2 = (n) => String(n).padStart(2, '0');
const toIsoDateOnly = (d) => {
  if (!d) return undefined;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return undefined;
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
};

const clampNumber = (v, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n) || v === null) return undefined;
  return Math.max(min, Math.min(max, n));
};

const toSafeCouponPayload = (payload = {}, partial = false) => {
  const src = payload || {};
  const mapped = {};

  const codeVal = src.code || src.couponCodeName;
  if (!partial || codeVal !== undefined) mapped.code = String(codeVal || '').trim();

  const discountTypeVal = src.discount_type !== undefined ? src.discount_type : src.discountType;
  if (!partial || discountTypeVal !== undefined) {
    const type = parseInt(discountTypeVal, 10);
    if ([1, 2].includes(type)) {
      mapped.discount_type = type;
    }
  }

  const discountValueVal = src.discount_value !== undefined ? src.discount_value : src.discountValue;
  if (!partial || discountValueVal !== undefined) mapped.discount_value = Number(discountValueVal);

  const maxUsageVal = src.max_usage !== undefined ? src.max_usage : src.maxUsage;
  if (!partial || maxUsageVal !== undefined) {
    const max = clampNumber(maxUsageVal, 1, Number.MAX_SAFE_INTEGER);
    if (max !== undefined) mapped.max_usage = max;
  }

  const usagePerUserVal = src.usage_per_user !== undefined ? src.usage_per_user : src.usagePerUser;
  if (!partial || usagePerUserVal !== undefined) {
    const per = clampNumber(usagePerUserVal, 1, Number.MAX_SAFE_INTEGER);
    if (per !== undefined) mapped.usage_per_user = per;
  }

  const expiryDateVal = src.expiry_date !== undefined ? src.expiry_date : src.expiryDate;
  if (!partial || expiryDateVal !== undefined) {
    const dateOnly = toIsoDateOnly(expiryDateVal);
    if (dateOnly) mapped.expiry_date = dateOnly;
    else if (expiryDateVal === null) mapped.expiry_date = null;
    else if (expiryDateVal === '') mapped.expiry_date = null;
  }

  return mapped;
};

const takeList = (res) => res?.data?.coupons || res?.coupons || (Array.isArray(res?.data) ? res?.data : []);
const takeItem = (res) => res?.data || res?.coupon || res;


/* ---------------- Real API Service ---------------- */
export const couponService = {
  // Coupons
  getCoupons: async () => {
    const res = await apiRequest({
      url: ENDPOINTS.SELLER_COUPONS.LIST,
      method: 'GET',
    });
    return { coupons: takeList(res) };
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
    await apiRequest({
      url: ENDPOINTS.SELLER_COUPONS.DELETE(id),
      method: 'DELETE',
    });
    return { success: true };
  },

  applyCoupon: async (code) => {
    const res = await apiRequest({
      url: ENDPOINTS.SELLER_COUPONS.APPLY(code),
      method: 'POST',
    });
    return takeItem(res);
  },

  // Points (Loyalty)

  // REMOVED: This function was calling a non-existent endpoint (404).
  // The required data is already provided by getCustomerPoints.
  /*
  getPointsSummary: async () => {
    const res = await apiRequest({
      url: ENDPOINTS.POINTS.SUMMARY,
      method: 'GET',
    });
    return res.data || {};
  },
  */

  getLoyaltySettings: async () => {
    const res = await apiRequest({
      url: ENDPOINTS.POINTS.GET_SETTINGS,
      method: 'GET',
    });
    return { settings: takeItem(res) };
  },

  getCustomerPoints: async () => {
    const res = await apiRequest({
      url: ENDPOINTS.POINTS.CUSTOMERS,
      method: 'GET',
    });
    // This endpoint correctly returns the full object with total_points_balance and customers
    return res.data || {};
  },

  updatePointsSettings: async (payload) => {
    const res = await apiRequest({
      url: ENDPOINTS.POINTS.UPDATE_SETTINGS,
      method: 'POST',
      data: payload,
    });
    return { settings: takeItem(res) };
  },
};