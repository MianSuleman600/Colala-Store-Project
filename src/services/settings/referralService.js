// src/services/settings/referralService.js

import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';

// Simple normalizer to map backend keys to frontend keys
const normalizeWallet = (wallet) => {
  if (!wallet) return {};
  return {
    totalEarnings: wallet.current_referral_balance || 0,
    totalReferrals: wallet.no_of_referrals || 0,
    referralCode: wallet.user_code || '------',
    currency: '₦', // Hardcoded as backend doesn't provide it
  };
};

export const referralService = {
  getWallet: async () => {
    const response = await apiRequest({ url: ENDPOINTS.REFERRALS.WALLET_SUMMARY, method: 'GET' });
    return normalizeWallet(response.data);
  },

  getTransactions: async (params = {}) => {
    const response = await apiRequest({ url: ENDPOINTS.TRANSACTIONS.LIST, method: 'GET', params });
    // This assumes the transaction endpoint returns an array of transactions in `response.data`
    return response.data || []; 
  },
  
  getFaqs: async () => {
    const response = await apiRequest({ url: ENDPOINTS.REFERRALS.FAQS, method: 'GET' });
    const responseData = response.data || {};
    return { 
      items: responseData.faqs || [],
      videoUrl: responseData.category?.video || '',
    };
  },

  getProducts: async (params = {}) => {
    const response = await apiRequest({ url: ENDPOINTS.REFERRALS.PRODUCTS, method: 'GET', params });
    // This assumes the products endpoint returns an array of products in `response.data`
    return response.data || [];
  },

  withdraw: async (payload) => {
    // Your backend for referral withdrawal has a different payload structure.
    return apiRequest({
      url: ENDPOINTS.REFERRALS.WITHDRAW,
      method: 'POST',
      data: {
        amount: payload.amount,
        bank_name: payload.bankName,
        account_number: payload.accountNumber,
        account_name: payload.accountName,
      }
    });
  },
  
  transfer: async (payload) => {
    return apiRequest({ url: ENDPOINTS.REFERRALS.TRANSFER, method: 'POST', data: payload });
  },
};