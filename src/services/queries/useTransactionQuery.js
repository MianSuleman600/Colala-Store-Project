// src/services/queries/useTransactionQuery.js

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

export const transactionQueryKeys = {
  all: (params = {}) => ['transactions', params],
};

/**
 * Fetches the user's general transaction history.
 */
export const useTransactionsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: transactionQueryKeys.all(params),
    queryFn: async () => {
      const response = await apiRequest.get(ENDPOINTS.TRANSACTIONS.LIST, { params });
      return response.data || [];
    },
    staleTime: 60 * 1000,
    ...options,
  });