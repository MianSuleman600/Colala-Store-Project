// src/services/settings/adWalletService.js
import { apiRequest } from '../api/apiClient.js';
import { ENDPOINTS } from '../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../utils/config.js';

const takeItem = (res) => res?.data || res;

// DUMMY
let ADS_WALLET = {
  currency: '₦',
  availableBalance: 3000000,
};

const dummyAdsWallet = {
  getWallet: async () => ({
    success: true,
    wallet: { currency: ADS_WALLET.currency, availableBalance: ADS_WALLET.availableBalance },
  }),
  topUp: async ({ amount }) => {
    const amt = Number(amount) || 0;
    if (amt <= 0) {
      return Promise.reject({ message: 'Amount must be greater than zero' });
    }
    ADS_WALLET.availableBalance += amt;
    return { success: true, message: 'Top up successful', amount: amt };
  },
};

// API
const apiAdsWallet = {
  getWallet: async () => {
    const res = await apiRequest({ url: ENDPOINTS.ADS_WALLET.WALLET, method: 'GET' });
    const item = takeItem(res);
    return {
      success: true,
      wallet: {
        currency: item?.currency || '₦',
        availableBalance: Number(item?.availableBalance ?? item?.balance ?? 0),
      },
    };
  },
  topUp: async (payload) => {
    const res = await apiRequest({ url: ENDPOINTS.ADS_WALLET.TOPUP, method: 'POST', data: payload });
    return { success: true, ...takeItem(res) };
  },
};

export const adsWalletService = USE_DUMMY_DATA ? dummyAdsWallet : apiAdsWallet;