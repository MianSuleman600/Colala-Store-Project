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
    // Debug logging to see what's being sent
    console.log('Withdrawal payload received:', payload);
    
    // Validate and ensure correct data types
    const withdrawalData = {
      amount: Number(payload.amount), // Ensure it's a number
      bank_name: String(payload.bankName || '').trim(), // Ensure it's a string and trim whitespace
      account_number: String(payload.accountNumber || '').trim(), // Ensure it's a string and trim whitespace
      account_name: String(payload.accountName || '').trim(), // Ensure it's a string and trim whitespace
    };
    
    // Additional validation
    if (!withdrawalData.amount || withdrawalData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!withdrawalData.bank_name) {
      throw new Error('Bank name is required');
    }
    if (!withdrawalData.account_number) {
      throw new Error('Account number is required');
    }
    if (!withdrawalData.account_name) {
      throw new Error('Account name is required');
    }
    
    console.log('Withdrawal data being sent to API:', withdrawalData);
    
    // Your backend for referral withdrawal has a different payload structure.
    return apiRequest({
      url: ENDPOINTS.REFERRALS.WITHDRAW,
      method: 'POST',
      data: withdrawalData
    });
  },
  
  transfer: async (payload) => {
    return apiRequest({ url: ENDPOINTS.REFERRALS.TRANSFER, method: 'POST', data: payload });
  },
};