// src/services/mutations/useReferralMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { referralService } from '../settings/referralService.js';
import { referralQueryKeys } from '../queries/useReferralQuery.js';
import { useToast } from '../../components/ui/ToastProvider.jsx';

export const useReferralWithdrawMutation = () => {
  const queryClient = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (payload) => referralService.withdraw(payload),
    onSuccess: (res) => {
      push(res?.message || 'Withdrawal processed', { type: 'success' });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.wallet });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.transactions() });
    },
    onError: (err) => {
      console.error('Withdrawal error:', err);
      
      // Handle validation errors from backend
      if (err?.response?.status === 422) {
        const validationErrors = err?.response?.data?.errors || {};
        const errorMessages = Object.values(validationErrors).flat();
        push(errorMessages.join(', ') || 'Validation failed. Please check your input.', { type: 'error' });
      } else {
        push(err?.message || 'Failed to process withdrawal', { type: 'error' });
      }
    },
  });
};

export const useReferralTransferMutation = () => {
  const queryClient = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (payload) => referralService.transfer(payload),
    onSuccess: (res) => {
      push(res?.message || 'Transfer successful', { type: 'success' });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.wallet });
      queryClient.invalidateQueries({ queryKey: referralQueryKeys.transactions() });
    },
    onError: (err) => push(err?.message || 'Failed to transfer', { type: 'error' }),
  });
};