// src/services/queries/useWalletQuery.js

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

export const walletQueryKeys = {
  balance: ['wallet', 'balance'],
  escrow: ['wallet', 'escrow'],
};

/**
 * Fetches the main wallet balances (shopping, referral, etc.).
 */
export const useWalletBalanceQuery = (options = {}) =>
  useQuery({
    queryKey: walletQueryKeys.balance,
    queryFn: async () => {
      const response = await apiRequest.get(ENDPOINTS.BUYER.WALLET.GET_BALANCE);
      return response.data || {};
    },
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });

/**
 * Fetches the escrow balance and history.
 */
export const useEscrowWalletQuery = (options = {}) =>
  useQuery({
    queryKey: walletQueryKeys.escrow,
    queryFn: async () => {
      const response = await apiRequest.get(ENDPOINTS.ESCROW.SUMMARY);
      return response.data || {};
    },
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });