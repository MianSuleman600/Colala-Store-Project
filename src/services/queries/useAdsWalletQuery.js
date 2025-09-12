// src/services/queries/useAdsWalletQuery.js
import { useQuery } from '@tanstack/react-query';
import { adsWalletService } from '../adWalletService';

export const adsWalletQueryKeys = {
  wallet: ['ads_wallet', 'wallet'],
};

export const useAdsWalletQuery = (options = {}) =>
  useQuery({
    queryKey: adsWalletQueryKeys.wallet,
    queryFn: async () => {
      const res = await adsWalletService.getWallet();
      return res?.wallet ?? { currency: '₦', availableBalance: 0 };
    },
    staleTime: 60_000,
    ...options,
  });