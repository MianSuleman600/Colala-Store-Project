// src/services/queries/useOrderQuery.js
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../orderService.js';
import { normalizeOrders } from '../../utils/dataNormalizer.js';

/**
 * Fetch all orders for a specific store/user, optionally filtered by status.
 * Returns an object { orders: [...] } to make callers simpler.
 */
export const useGetOrdersQuery = (status = null, userId = 'default_user_id', options = {}) => {
  return useQuery({
    queryKey: ['orders', userId, status],
    queryFn: async () => {
      console.debug('[useGetOrdersQuery] queryFn start', { status, userId });

      const response = await orderService.getOrders(status, userId);
      console.debug('[useGetOrdersQuery] raw response from orderService.getOrders:', response);

      // Try to find the orders array in several common places
      let ordersRaw = [];

      if (Array.isArray(response?.orders)) {
        ordersRaw = response.orders;
        console.debug('[useGetOrdersQuery] using response.orders length:', ordersRaw.length);
      } else if (Array.isArray(response?.ordersResponse)) {
        ordersRaw = response.ordersResponse;
        console.debug('[useGetOrdersQuery] using response.ordersResponse length:', ordersRaw.length);
      } else if (Array.isArray(response)) {
        ordersRaw = response;
        console.debug('[useGetOrdersQuery] response itself is an array length:', ordersRaw.length);
      } else if (Array.isArray(response?.data?.orders)) {
        ordersRaw = response.data.orders;
        console.debug('[useGetOrdersQuery] using response.data.orders length:', ordersRaw.length);
      } else {
        console.warn('[useGetOrdersQuery] could not find orders array in response, full response logged above.');
      }

      // Normalize and return as object with `orders` prop (so callers can do data?.orders)
      const normalized = normalizeOrders(ordersRaw || []);
      console.debug('[useGetOrdersQuery] normalized orders count:', normalized.length);
      // Return an object so callers referencing `data.orders` will work
      return { orders: normalized };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    ...options,
  });
};

/**
 * Fetch a single order by ID for a store/user
 * (kept as-is but logs added for debugging)
 */
export const useGetOrderByIdQuery = (orderId, userId = 'default_user_id', options = {}) => {
  return useQuery({
    queryKey: ['order', userId, orderId],
    queryFn: async () => {
      console.debug('[useGetOrderByIdQuery] queryFn start', { orderId, userId });
      if (!orderId) return null;
      const response = await orderService.getOrderById(orderId, userId);
      console.debug('[useGetOrderByIdQuery] raw response:', response);

      // `getOrderById` may return { order: {...} } or the order directly
      const rawOrder = response?.order ?? response;
      const normalized = normalizeOrders(rawOrder ? [rawOrder] : []);
      console.debug('[useGetOrderByIdQuery] normalized order:', normalized[0] ?? null);
      return normalized[0] ?? null;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
