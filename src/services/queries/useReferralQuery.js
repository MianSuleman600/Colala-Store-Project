//D:\Project\frontend\src\services\queries\useReferralQuery.js
import { useQuery } from '@tanstack/react-query';
import { referralService } from '../settings/referralService.js';
import {
  normalizeReferralWallet,
  normalizeReferralTransactions,
  normalizeReferralProducts,
} from '../../utils/dataNormalizer.js';

export const referralQueryKeys = {
  wallet: ['referrals', 'wallet'],
  transactions: (params = {}) => ['referrals', 'transactions', params],
  faqs: ['referrals', 'faqs'],
  products: (params = {}) => ['referrals', 'products', params],
};

export const useReferralWalletQuery = (options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.wallet,
    queryFn: async () => {
      const res = await referralService.getWallet();
      // normalize handles object or [object]
      return normalizeReferralWallet(res?.wallet ?? res);
    },
    staleTime: 60_000,
    ...options,
  });

export const useReferralTransactionsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.transactions(params),
    queryFn: async () => {
      const res = await referralService.getTransactions?.(params);
      const rows = res?.transactions ?? res?.data ?? res ?? [];
      return normalizeReferralTransactions(rows);
    },
    staleTime: 60_000,
    ...options,
  });

export const useReferralFaqsQuery = (options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.faqs,
    queryFn: async () => {
      const res = await referralService.getFaqs?.();
      return res?.faqs ?? res?.data ?? [];
    },
    staleTime: 300_000,
    ...options,
  });

export const useReferralProductsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.products(params),
    queryFn: async () => {
      const res = await referralService.getProducts?.(params);
      const rows = res?.products ?? res?.data ?? [];
      return normalizeReferralProducts(rows);
    },
    staleTime: 60_000,
    ...options,
  });