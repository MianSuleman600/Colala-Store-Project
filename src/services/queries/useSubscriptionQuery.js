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
      return response?.plans || response?.data || response || [];
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
      // The API returns a list, but usually a user has one active subscription
      const subscriptions = response?.subscriptions || response?.data || response || [];
      return subscriptions.length > 0 ? subscriptions[0] : null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};