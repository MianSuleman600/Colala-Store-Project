// src/services/mutations/useBoostMutations.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boostService } from '../boostService';

export const useGetBoostPreviewMutation = (options = {}) => {
  return useMutation({
    mutationFn: (payload) => boostService.getBoostPreview(payload),
    ...options,
  });
};

export const useCreateBoostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => boostService.createBoost(payload),
    onSuccess: (data, variables) => {
      // Invalidate wallet balance and product details to reflect boost status
      queryClient.invalidateQueries({ queryKey: ['adsWallet'] });
      queryClient.invalidateQueries({ queryKey: ['productDetail', variables.productId] });
      options.onSuccess?.(data);
    },
    ...options,
  });
};