// D:\Project\frontend\src\services\mutations\useReferralMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { referralService } from '../../services/settings/referralService.js';
import { referralQueryKeys } from '../queries/useReferralQuery.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const useReferralWithdrawMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => referralService.withdraw(payload),
    onSuccess: (res) => {
      toast('success', res?.message || 'Withdrawal processed');
      qc.invalidateQueries({ queryKey: referralQueryKeys.wallet });
      qc.invalidateQueries({ queryKey: referralQueryKeys.transactions({}) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to process withdrawal'),
  });
};

export const useReferralTransferMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => referralService.transfer(payload),
    onSuccess: (res) => {
      toast('success', res?.message || 'Transfer successful');
      qc.invalidateQueries({ queryKey: referralQueryKeys.wallet });
      qc.invalidateQueries({ queryKey: referralQueryKeys.transactions({}) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to transfer'),
  });
};