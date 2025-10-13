// src/services/mutations/usePromotionMutation.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
// --- FIX: Import the specific functions needed from the barrel file ---
import {
  createPromotion,
  extendPromotion,
  pausePromotion,
  resumePromotion,
  deletePromotion,
} from '../index.js';
import { normalizePromotions } from '../../utils/dataNormalizer.js';

const getToken = () =>
  (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

// This helper function is fine, no changes needed.
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
      // --- FIX: Call the function directly ---
      return createPromotion(payload, token, { userId });
    },
    // ... onMutate, onError, onSuccess, onSettled are fine
  });
};

export const useExtendPromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async ({ id, dailyBudget, durationDays }) => {
      const token = getToken();
      // --- FIX: Call the function directly ---
      return extendPromotion(id, { dailyBudget, durationDays }, token);
    },
    // ... onMutate, onError, onSuccess, onSettled are fine
  });
};

export const usePausePromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      // --- FIX: Call the function directly ---
      return pausePromotion(id, token);
    },
    // ... onMutate, onError, onSuccess, onSettled are fine
  });
};

export const useResumePromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      // --- FIX: Call the function directly ---
      return resumePromotion(id, token);
    },
    // ... onMutate, onError, onSuccess, onSettled are fine
  });
};

export const useDeletePromotion = (userId, options = {}) => {
  const queryClient = useQueryClient();
  const key = ['myPromotions', userId || 'anonymous'];

  return useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      // --- FIX: Call the function directly ---
      return deletePromotion(id, token);
    },
    // ... onMutate, onError, onSuccess, onSettled are fine
  });
};