// src/services/mutations/useOrderMutations.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../orderService.js';

/**
 * Update an order's status to 'Out for delivery' with an optimistic update.
 */
export const useMarkOrderOutForDeliveryMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { userId } = options; // Pass userId to the hook for correct query key

  return useMutation({
    mutationFn: (orderId) => orderService.markAsOutForDelivery(orderId),

    onMutate: async (orderId) => {
      const queryKey = ['orders', userId];
      await queryClient.cancelQueries({ queryKey });
      const previousOrders = queryClient.getQueryData(queryKey);

      // Optimistically update the status of the specific order
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;
        const newOrders = oldData.new.map(order => 
          order.id === orderId ? { ...order, status: 'out_for_delivery' } : order
        );
        return { ...oldData, new: newOrders };
      });
      
      return { previousOrders };
    },

    onError: (err, orderId, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders', userId], context.previousOrders);
      }
      options.onError?.(err, orderId);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
    },
    ...options
  });
};

/**
 * Update an order's status to 'Delivered'
 */
export const useMarkOrderDeliveredMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { userId } = options;

  return useMutation({
    mutationFn: ({ orderId, payload }) => orderService.markAsDelivered(orderId, payload),

    onMutate: async ({ orderId }) => {
      const queryKey = ['orders', userId];
      await queryClient.cancelQueries({ queryKey });
      const previousOrders = queryClient.getQueryData(queryKey);
      
      // Optimistically move the order from 'new' to 'completed'
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;
        const orderToMove = oldData.new.find(order => order.id === orderId);
        if (!orderToMove) return oldData;

        const newOrders = oldData.new.filter(order => order.id !== orderId);
        const completedOrders = [{ ...orderToMove, status: 'delivered' }, ...oldData.completed];
        
        return { new: newOrders, completed: completedOrders };
      });

      return { previousOrders };
    },
    
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders', userId], context.previousOrders);
      }
      options.onError?.(err, variables);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
    },
    ...options
  });
};