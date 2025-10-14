// src/services/mutations/useBoostMutation.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boostService } from '../boostService';

// Mutations for extending, pausing, and deleting boosts

export const useExtendBoostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dailyBudget, durationDays }) => {
      // Assuming backend treats this as a status update or separate endpoint; adjust if needed
      return boostService.updateBoostStatus(id, {
        action: 'extend',
        dailyBudget,
        durationDays,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
      queryClient.invalidateQueries({ queryKey: ['boostDetail', variables?.id] });
      options.onSuccess?.(data, variables);
    },
    ...options,
  });
};

export const usePauseBoostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => boostService.updateBoostStatus(id, { status: 'paused' }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
      queryClient.invalidateQueries({ queryKey: ['boostDetail', variables] });
      options.onSuccess?.(data, variables);
    },
    ...options,
  });
};

export const useDeleteBoostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => boostService.updateBoostStatus(id, { status: 'deleted' }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
      options.onSuccess?.(data, variables);
    },
    ...options,
  });
};


