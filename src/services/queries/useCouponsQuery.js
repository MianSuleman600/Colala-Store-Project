// src/services/queries/useCouponsQuery.js
import { useQuery } from '@tanstack/react-query';
import { couponService } from '../settings/couponService.js';
import { normalizeCoupons, normalizeCustomerPoints } from '../../utils/dataNormalizer.js';

export const keys = {
  coupons: ['coupons'],
  pointsSummary: ['pointsSummary'],
  customerPoints: ['customerPoints'],
};

/* ---------------- Queries ---------------- */
export const useGetCouponsQuery = (options = {}) =>
  useQuery({
    queryKey: keys.coupons,
    queryFn: async () => {
      const res = await couponService.getCoupons();
      const coupons = Array.isArray(res?.coupons) ? res.coupons : res?.data || [];
      return normalizeCoupons(coupons);
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useGetPointsSummaryQuery = (options = {}) =>
  useQuery({
    queryKey: keys.pointsSummary,
    queryFn: async () => {
      const res = await couponService.getPointsSummary();
      return { totalPointsBalance: res?.data?.totalPointsBalance || 0 };
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useGetCustomerPointsQuery = (options = {}) =>
  useQuery({
    queryKey: keys.customerPoints,
    queryFn: async () => {
      const res = await couponService.getCustomerPoints();
      const customers = Array.isArray(res?.customers) ? res.customers : res?.data || [];
      return normalizeCustomerPoints(customers);
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });