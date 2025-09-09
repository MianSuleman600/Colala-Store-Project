import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../index.js';
import { normalizeOrders } from '../../utils/dataNormalizer.js';

/**
 * Create a new order
 */
export const useCreateOrderMutation = (userId = 'default_user_id', status = null, options = {}) => {
  const queryClient = useQueryClient();
  const queryKey = ['orders', userId, status];

  return useMutation({
    mutationFn: (newOrder) => orderService.createOrder(newOrder, userId),
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      const previousOrders = previousData?.orders ?? [];

      const optimisticOrder = normalizeOrders([newOrder])[0];
      queryClient.setQueryData(queryKey, {
        ...previousData,
        orders: [optimisticOrder, ...previousOrders],
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      options.onError?.(_);
    },
    onSuccess: (data) => {
      const normalized = normalizeOrders([data?.order ?? data])[0];
      queryClient.setQueryData(queryKey, (oldData = { orders: [] }) => ({
        ...oldData,
        orders: [normalized, ...oldData.orders.filter(o => o.id !== normalized.id)],
      }));
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};

/**
 * Update an existing order
 */
export const useUpdateOrderMutation = (userId = 'default_user_id', status = null, options = {}) => {
  const queryClient = useQueryClient();
  const queryKey = ['orders', userId, status];

  return useMutation({
    mutationFn: ({ orderId, payload }) => orderService.updateOrder(orderId, payload, userId),
    onSuccess: (data, variables) => {
      const normalized = normalizeOrders([data?.order ?? data])[0];
      queryClient.setQueryData(queryKey, (oldData = { orders: [] }) => ({
        ...oldData,
        orders: oldData.orders.map(o => (o.id === variables.orderId ? normalized : o)),
      }));
      options.onSuccess?.(normalized);
    },
    onError: (error) => options.onError?.(error),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};

/**
 * Delete an order
 */
export const useDeleteOrderMutation = (userId = 'default_user_id', status = null, options = {}) => {
  const queryClient = useQueryClient();
  const queryKey = ['orders', userId, status];

  return useMutation({
    mutationFn: (orderId) => orderService.deleteOrder(orderId, userId),
    onSuccess: (_, orderId) => {
      queryClient.setQueryData(queryKey, (oldData = { orders: [] }) => ({
        ...oldData,
        orders: oldData.orders.filter(o => o.id !== orderId),
      }));
      options.onSuccess?.();
    },
    onError: (error) => options.onError?.(error),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
