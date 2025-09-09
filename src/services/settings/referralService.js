// src/services/referralService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import {
  normalizeReferralWallet,
  normalizeReferralTransactions,
  normalizeReferralProducts,
  normalizeReferralFaqs,
} from '../../utils/dataNormalizer.js';

import {
  DUMMY_REFERRAL_WALLET,
  DUMMY_REFERRAL_TRANSACTIONS,
  DUMMY_REFERRAL_FAQS,
  DUMMY_REFERRAL_PRODUCTS,
} from '../../utils/data/dummyReferrals.js';

/* ---------------- Helpers ---------------- */
const takeList = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res)) return res;
  return [];
};
const takeItem = (res) => res?.data || res;

/* ---------------- Dummy ---------------- */
let WALLET = { ...DUMMY_REFERRAL_WALLET };
let TXN = Array.isArray(DUMMY_REFERRAL_TRANSACTIONS) ? [...DUMMY_REFERRAL_TRANSACTIONS] : [];
let FAQS = DUMMY_REFERRAL_FAQS;
let REFS = Array.isArray(DUMMY_REFERRAL_PRODUCTS) ? [...DUMMY_REFERRAL_PRODUCTS] : [];

const dummyReferrals = {
  getWallet: async () => ({ success: true, wallet: normalizeReferralWallet(WALLET) }),
  getTransactions: async (params = {}) => ({ success: true, transactions: normalizeReferralTransactions(TXN) }),
  getFaqs: async () => ({ success: true, faqs: normalizeReferralFaqs(FAQS) }),
  getProducts: async (params = {}) => {
    let list = [...REFS];
    const { search, category, commission } = params;
    if (search) {
      const s = String(search).toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.store.toLowerCase().includes(s));
    }
    // category / commission filters are placeholders
    return { success: true, products: normalizeReferralProducts(list) };
  },
  withdraw: async (payload) => {
    // simulate withdrawal
    const amt = Number(payload.amount) || 0;
    WALLET.availableBalance = Math.max(0, (WALLET.availableBalance || 0) - amt);
    TXN.unshift({
      id: `tx-${Date.now()}`,
      type: 'withdrawal',
      amount: -Math.abs(amt),
      date: new Date().toISOString(),
      note: 'Dummy withdrawal',
    });
    return { success: true, message: 'Withdrawal processed', amount: amt };
  },
  transfer: async (payload) => {
    const amt = Number(payload.amount) || 0;
    WALLET.availableBalance = Math.max(0, (WALLET.availableBalance || 0) - amt);
    TXN.unshift({
      id: `tx-${Date.now()}`,
      type: 'transfer',
      amount: -Math.abs(amt),
      date: new Date().toISOString(),
      note: 'Dummy transfer to shopping wallet',
    });
    return { success: true, message: 'Transfer processed', amount: amt };
  },
};

/* ---------------- API ---------------- */
const apiReferrals = {
  getWallet: async () => {
    const res = await apiRequest({ url: ENDPOINTS.REFERRALS.WALLET, method: 'GET' });
    return { success: true, wallet: normalizeReferralWallet(takeItem(res)) };
  },
  getTransactions: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.REFERRALS.TRANSACTIONS(params), method: 'GET' });
    return { success: true, transactions: normalizeReferralTransactions(takeList(res)) };
  },
  getFaqs: async () => {
    const res = await apiRequest({ url: ENDPOINTS.REFERRALS.FAQS, method: 'GET' });
    return { success: true, faqs: normalizeReferralFaqs(takeItem(res) || res) };
  },
  getProducts: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.REFERRALS.PRODUCTS(params), method: 'GET' });
    return { success: true, products: normalizeReferralProducts(takeList(res)) };
  },
  withdraw: async (payload) => {
    const res = await apiRequest({ url: ENDPOINTS.REFERRALS.WITHDRAW, method: 'POST', data: payload });
    return { success: true, ...takeItem(res) };
  },
  transfer: async (payload) => {
    const res = await apiRequest({ url: ENDPOINTS.REFERRALS.TRANSFER, method: 'POST', data: payload });
    return { success: true, ...takeItem(res) };
  },
};

export const referralService = USE_DUMMY_DATA ? dummyReferrals : apiReferrals;