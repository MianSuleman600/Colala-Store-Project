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
    queryKey: ['orders', userId],
    queryFn: async () => {
      const response = await orderService.getOrders();

      // --- DEBUGGING: log the raw backend response
      console.log('Raw response from getOrders:', response);

      const newOrdersRaw = response?.data?.new_orders?.data || [];
      const completedOrdersRaw = response?.data?.completed_orders?.data || [];

      // --- DEBUGGING: log the raw extracted arrays
      console.log('Raw new orders:', newOrdersRaw);
      console.log('Raw completed orders:', completedOrdersRaw);

      const newOrders = normalizeOrders(newOrdersRaw);
      const completedOrders = normalizeOrders(completedOrdersRaw);

      // --- DEBUGGING: log normalized data
      console.log('Normalized new orders:', newOrders);
      console.log('Normalized completed orders:', completedOrders);

      return { new: newOrders, completed: completedOrders };
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
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

      // --- DEBUGGING: log raw backend response for single order
      console.log(`Raw response for order ${orderId}:`, response);

      const rawOrder = response?.data; // The backend wraps the order in 'data'
      
      // --- DEBUGGING: log raw order before normalization
      console.log('Raw single order before normalization:', rawOrder);

      const normalized = normalizeOrders(rawOrder ? [rawOrder] : []);

      // --- DEBUGGING: log normalized single order
      console.log('Normalized single order:', normalized[0] ?? null);

      return normalized[0] ?? null;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Fetches all orders for the logged-in buyer.
 */
export const useGetBuyerOrdersQuery = (userId, options = {}) => {
  return useQuery({
    queryKey: ['buyerOrders', userId],
    queryFn: async () => {
      const response = await orderService.getBuyerOrders();
      console.log('Raw buyer orders response:', response);
      
      // Handle seller orders response structure
      const newOrdersRaw = response?.data?.new_orders?.data || [];
      const completedOrdersRaw = response?.data?.completed_orders?.data || [];
      
      // Combine all orders
      const allOrdersRaw = [...newOrdersRaw, ...completedOrdersRaw];
      console.log('Raw buyer orders array:', allOrdersRaw);
      
      const normalized = normalizeOrders(allOrdersRaw);
      console.log('Normalized buyer orders:', normalized);
      
      return normalized;
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Fetch a single buyer order by ID.
 */
export const useGetBuyerOrderByIdQuery = (orderId, userId, options = {}) => {
  return useQuery({
    queryKey: ['buyerOrder', userId, orderId],
    queryFn: async () => {
      if (!orderId) return null;

      const response = await orderService.getBuyerOrderById(orderId);
      console.log(`Raw response for buyer order ${orderId}:`, response);

      const rawOrder = response?.data;
      console.log('Raw single buyer order before normalization:', rawOrder);

      const normalized = normalizeOrders(rawOrder ? [rawOrder] : []);
      console.log('Normalized single buyer order:', normalized[0] ?? null);

      return normalized[0] ?? null;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};