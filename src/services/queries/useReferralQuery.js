// src/services/queries/useReferralQuery.js
import { useQuery } from '@tanstack/react-query';
import { referralService } from '../settings/referralService.js';

export const referralQueryKeys = {
  wallet: ['referrals', 'wallet'],
  transactions: (params = {}) => ['referrals', 'transactions', params],
  faqs: ['referrals', 'faqs'],
  products: (params = {}) => ['referrals', 'products', params],
};

export const useReferralWalletQuery = (options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.wallet,
    queryFn: () => referralService.getWallet(),
    staleTime: 60_000,
    ...options,
  });

export const useReferralTransactionsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.transactions(params),
    queryFn: () => referralService.getTransactions(params),
    staleTime: 60_000,
    ...options,
  });

export const useReferralFaqsQuery = (options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.faqs,
    queryFn: () => referralService.getFaqs(),
    staleTime: 300_000,
    ...options,
  });

export const useReferralProductsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: referralQueryKeys.products(params),
    queryFn: () => referralService.getProducts(params),
    staleTime: 60_000,
    ...options,
  });