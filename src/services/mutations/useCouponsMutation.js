// src/services/mutations/useCouponsMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService } from '../settings/couponService.js';
import { keys } from '../queries/useCouponsQuery.js';

/* ---------------- Mutations ---------------- */
export const useCreateCouponMutation = (options = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => couponService.createCoupon(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.coupons });
    },
    ...options,
  });
};

export const useUpdateCouponMutation = (options = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => couponService.updateCoupon(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.coupons });
    },
    ...options,
  });
};

export const useDeleteCouponMutation = (options = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => couponService.deleteCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.coupons });
    },
    ...options,
  });
};

export const useApplyCouponMutation = (options = {}) => {
    return useMutation({
        mutationFn: (code) => couponService.applyCoupon(code),
        ...options,
    });
};

export const useUpdatePointsSettingsMutation = (options = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => couponService.updatePointsSettings(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.pointsSummary });
    },
    ...options,
  });
};