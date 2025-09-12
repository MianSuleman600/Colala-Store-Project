// src/services/mutations/useAdsWalletMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adsWalletService } from '../adWalletService.js';
import { adsWalletQueryKeys } from '../queries/useAdsWalletQuery.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const useAdsTopUpMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => adsWalletService.topUp(payload),
    onSuccess: (res) => {
      toast('success', res?.message || 'Top up successful');
      qc.invalidateQueries({ queryKey: adsWalletQueryKeys.wallet });
    },
    onError: (err) => toast('error', err?.message || 'Failed to top up'),
  });
};