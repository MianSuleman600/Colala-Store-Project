// src/services/queries/useOrderQuery.js

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../orderService.js';
import { normalizeOrders } from '../../utils/dataNormalizer.js';

/**
 * Fetches all orders (new and completed) for the logged-in seller
 * and structures them for the UI.
 */
export const useGetOrdersQuery = (userId, options = {}) => {
  return useQuery({
    // The query key is now simpler, as we fetch everything at once.
    queryKey: ['orders', userId],
    queryFn: async () => {
      const response = await orderService.getOrders();
      
      // ✅ THE FIX: Extract the 'data' array from each paginated list.
      const newOrdersRaw = response?.data?.new_orders?.data || [];
      const completedOrdersRaw = response?.data?.completed_orders?.data || [];
      
      const newOrders = normalizeOrders(newOrdersRaw);
      const completedOrders = normalizeOrders(completedOrdersRaw);
      
      // Return a structured object that the component can easily use.
      return { new: newOrders, completed: completedOrders };
    },
    // This query is only enabled if there's a logged-in user.
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
};

/**
 * Fetch a single order by ID.
 */
export const useGetOrderByIdQuery = (orderId, userId, options = {}) => {
  return useQuery({
    queryKey: ['order', userId, orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const response = await orderService.getOrderById(orderId);
      const rawOrder = response?.data; // The backend wraps the order in 'data'
      const normalized = normalizeOrders(rawOrder ? [rawOrder] : []);
      return normalized[0] ?? null;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};