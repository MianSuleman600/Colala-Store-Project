// src/services/subscriptionService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';

// --- Dummy Data ---
const DUMMY_PLANS = [
    { id: 'plan_basic', name: 'Basic', price: 'Free', duration: '/month', benefits: ['Free benefit 1', 'Free benefit 2', 'Free benefit 3'], color: '#FFDAB9' },
    { id: 'plan_std', name: 'Standard', price: 50000, duration: '/month', benefits: ['All Basic benefits', 'Standard benefit 1', 'Standard benefit 2'], color: '#E0BBE4' },
    { id: 'plan_prem', name: 'Premium', price: 150000, duration: '/month', benefits: ['All Standard benefits', 'Premium benefit 1', 'Premium benefit 2'], color: '#957DAD' },
];
let DUMMY_SUBSCRIPTION = { id: 'sub_123', plan: 'Basic', status: 'active' };

// --- Dummy Service ---
const dummySubscriptionService = {
  getPlans: async () => ({ plans: DUMMY_PLANS }),
  getSubscriptions: async () => ({ subscriptions: [DUMMY_SUBSCRIPTION] }),
  createSubscription: async (payload) => {
    const plan = DUMMY_PLANS.find(p => p.id === payload.planId);
    DUMMY_SUBSCRIPTION = { id: `sub_${Date.now()}`, plan: plan?.name || 'Unknown', status: 'active' };
    return { subscription: DUMMY_SUBSCRIPTION };
  },
  cancelSubscription: async (id) => {
    if (DUMMY_SUBSCRIPTION.id === id) {
        DUMMY_SUBSCRIPTION.status = 'canceled';
    }
    return { success: true };
  },
};

// --- Real API Service ---
const apiSubscriptionService = {
  getPlans: () => apiRequest({ url: ENDPOINTS.PLANS.LIST, method: 'GET' }),
  getSubscriptions: () => apiRequest({ url: ENDPOINTS.SUBSCRIPTIONS.LIST, method: 'GET' }),
  createSubscription: (payload) => apiRequest({ 
    url: ENDPOINTS.SUBSCRIPTIONS.CREATE, 
    method: 'POST', 
    data: {
      plan_id: payload.planId,
      payment_method: payload.paymentMethod || 'wallet'
    }
  }),
  cancelSubscription: (id) => apiRequest({ url: ENDPOINTS.SUBSCRIPTIONS.CANCEL(id), method: 'PATCH' }),
};

export const subscriptionService = USE_DUMMY_DATA ? dummySubscriptionService : apiSubscriptionService;