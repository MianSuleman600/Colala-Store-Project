// src/services/queries/useSubscriptionQuery.js
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../../services/settings/subscriptionService';

export const subscriptionQueryKeys = {
  plans: ['plans'],
  subscriptions: ['subscriptions'],
};

/**
 * Fetch all available subscription plans
 */
export const useGetPlansQuery = (options = {}) => {
  return useQuery({
    queryKey: subscriptionQueryKeys.plans,
    queryFn: async () => {
      const response = await subscriptionService.getPlans();
      // Handle the API response format: { status: "success", data: [...], message: "Success" }
      if (response?.status === 'success' && Array.isArray(response.data)) {
        return response.data.map(plan => ({
          id: plan.id,
          name: plan.name,
          price: parseFloat(plan.price),
          currency: plan.currency,
          duration: `${plan.duration_days} days`,
          benefits: Object.values(plan.features || {}),
          color: '#E0BBE4' // Default color, can be customized
        }));
      }
      return response?.data || response || [];
    },
    staleTime: Infinity, // Plans rarely change
    ...options,
  });
};

/**
 * Fetch the current user's active subscription(s)
 */
export const useGetSubscriptionsQuery = (options = {}) => {
  return useQuery({
    queryKey: subscriptionQueryKeys.subscriptions,
    queryFn: async () => {
      const response = await subscriptionService.getSubscriptions();
      // Handle the API response format: { status: "success", data: [...], message: "Success" }
      if (response?.status === 'success' && Array.isArray(response.data)) {
        // Find the most recent active subscription
        const activeSubscription = response.data.find(sub => sub.status === 'active');
        return activeSubscription || null;
      }
      return response?.data || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};