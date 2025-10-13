// src/services/mutations/useSubscriptionMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../../services/settings/subscriptionService.js';
import { subscriptionQueryKeys } from '../queries/useSubscriptionQuery.js';
import { useToast } from '../../components/ui/ToastProvider';

export const useCreateSubscriptionMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (payload) => subscriptionService.createSubscription(payload),
    onSuccess: (data) => {
      push('Subscription successful!', { type: 'success' });
      // Invalidate both subscriptions and the user's profile which might hold subscription info
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.subscriptions });
      queryClient.invalidateQueries({ queryKey: ['storeProfile'] });
      options.onSuccess?.(data);
    },
    onError: (err) => {
      push(err.message || 'Subscription failed.', { type: 'error' });
      options.onError?.(err);
    },
  });
};

export const useCancelSubscriptionMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (subscriptionId) => subscriptionService.cancelSubscription(subscriptionId),
    onSuccess: (data) => {
      push('Subscription canceled.', { type: 'success' });
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.subscriptions });
      queryClient.invalidateQueries({ queryKey: ['storeProfile'] });
      options.onSuccess?.(data);
    },
    onError: (err) => {
      push(err.message || 'Failed to cancel subscription.', { type: 'error' });
      options.onError?.(err);
    },
  });
};