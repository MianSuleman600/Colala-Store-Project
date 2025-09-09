// src/services/mutations/usePromotionMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionService } from '../index.js';
import { normalizePromotions } from '../../utils/dataNormalizer.js';

const getToken = () =>
  (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

const computeExtend = (promo, { dailyBudget, durationDays }) => {
  const pd = promo.promotionDetails || {};
  const dBudget = Number(dailyBudget) || 0;
  const dDays = Number(durationDays) || 0;

  const baseDate = pd.endDate ? new Date(pd.endDate) : new Date(pd.dateCreated || Date.now());
  const nextEnd = new Date(baseDate);
  nextEnd.setDate(baseDate.getDate() + dDays);

  const amountSpent = (pd.amountSpent || 0) + dBudget * dDays;
  const daysRemaining = Math.max(0, Math.ceil((nextEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return {
    ...promo,
    promotionDetails: {
      ...pd,
      amountSpent,
      endDate: nextEnd.toISOString(),
      daysRemaining,
      status: 'Active',
    },
  };
};

export const useCreatePromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (payload) => {
      const token = getToken();
      return promotionService.createPromotion(payload, token, { userId });
    },
    onMutate: async (newPromo) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key) || [];
      const [optimistic] = normalizePromotions([{ ownerId: userId, ...newPromo }]);
      queryClient.setQueryData(key, (old = []) => [optimistic, ...old]);
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
      options.onError?.(error);
    },
    onSuccess: (data) => {
      const [normalized] = normalizePromotions([data]);
      queryClient.setQueryData(key, (old = []) => [normalized, ...old.filter((p) => p.id !== normalized.id)]);
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

export const useExtendPromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async ({ id, dailyBudget, durationDays }) => {
      const token = getToken();
      return promotionService.extendPromotion(id, { dailyBudget, durationDays }, token);
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key) || [];
      queryClient.setQueryData(key, (old = []) =>
        old.map((p) => (p.id === vars.id ? computeExtend(p, vars) : p))
      );
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
      options.onError?.(error);
    },
    onSuccess: (data) => {
      const [normalized] = normalizePromotions([data]);
      queryClient.setQueryData(key, (old = []) => old.map((p) => (p.id === normalized.id ? normalized : p)));
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

export const usePausePromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      return promotionService.pausePromotion(id, token);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key) || [];
      queryClient.setQueryData(key, (old = []) =>
        old.map((p) =>
          p.id === id ? { ...p, promotionDetails: { ...p.promotionDetails, status: 'Paused' } } : p
        )
      );
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
      options.onError?.(error);
    },
    onSuccess: (data) => {
      const [normalized] = normalizePromotions([data]);
      queryClient.setQueryData(key, (old = []) => old.map((p) => (p.id === normalized.id ? normalized : p)));
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

export const useResumePromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      return promotionService.resumePromotion(id, token);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key) || [];
      queryClient.setQueryData(key, (old = []) =>
        old.map((p) =>
          p.id === id ? { ...p, promotionDetails: { ...p.promotionDetails, status: 'Active' } } : p
        )
      );
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
      options.onError?.(error);
    },
    onSuccess: (data) => {
      const [normalized] = normalizePromotions([data]);
      queryClient.setQueryData(key, (old = []) => old.map((p) => (p.id === normalized.id ? normalized : p)));
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

export const useDeletePromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      return promotionService.deletePromotion(id, token);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key) || [];
      queryClient.setQueryData(key, (old = []) => old.filter((p) => p.id !== id));
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
      options.onError?.(error);
    },
    onSuccess: (_data) => {
      options.onSuccess?.();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};