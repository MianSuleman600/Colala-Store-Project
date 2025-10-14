import { useQuery } from '@tanstack/react-query';
import { couponService } from '../settings/couponService.js';

export const keys = {
  coupons: ['coupons'],
  pointsSummary: ['pointsSummary'],
  pointsSettings: ['pointsSettings'],
  customerPoints: ['customerPoints'],
};

/* ---------------- Queries ---------------- */
export const useGetCouponsQuery = (options = {}) =>
  useQuery({
    queryKey: keys.coupons,
    queryFn: async () => {
      const res = await couponService.getCoupons();
      console.log('useGetCouponsQuery raw response:', res);
      return Array.isArray(res?.coupons) ? res.coupons : [];
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// This query is for a non-existent endpoint and can be removed later.
export const useGetPointsSummaryQuery = (options = {}) =>
  useQuery({
    queryKey: keys.pointsSummary,
    queryFn: () => couponService.getPointsSummary(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useGetPointsSettingsQuery = (options = {}) =>
  useQuery({
    queryKey: keys.pointsSettings,
    queryFn: async () => {
      const res = await couponService.getPointsSettings();
      console.log('useGetPointsSettingsQuery raw response:', res);
      return res?.data || {};
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// --- THIS IS THE CORRECTED HOOK ---
export const useGetCustomerPointsQuery = (options = {}) =>
  useQuery({
    queryKey: keys.customerPoints,
    queryFn: async () => {
      const res = await couponService.getCustomerPoints();
      console.log('useGetCustomerPointsQuery raw response:', res);
      // FIXED: Simply return the object from the service.
      // The component is already expecting { customers: [...], total_points_balance: ... }
      return res; 
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });