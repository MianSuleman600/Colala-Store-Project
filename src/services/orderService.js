// src/services/orderService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

/**
 * The production-ready API service for all order-related functionality.
 */
const apiOrderService = {
  /**
   * Fetches all orders for the logged-in seller.
   * The backend returns both 'new' and 'completed' orders in one call.
   */
  getOrders: () => 
    apiRequest({ url: ENDPOINTS.SELLER_ORDERS.LIST, method: 'GET' }),

  /**
   * Fetches the detailed information for a single store order.
   * @param {string|number} orderId - The ID of the store order.
   */
  getOrderById: (orderId) => 
    apiRequest({ url: ENDPOINTS.SELLER_ORDERS.DETAIL(orderId), method: 'GET' }),

  /**
   * Marks an order as 'out_for_delivery'.
   * @param {string|number} orderId - The ID of the store order.
   */
  markAsOutForDelivery: (orderId) => 
    apiRequest({ url: ENDPOINTS.SELLER_ORDERS.MARK_OUT_FOR_DELIVERY(orderId), method: 'POST' }),

  /**
   * Marks an order as 'delivered' by providing the customer's verification code.
   * @param {string|number} orderId - The ID of the store order.
   * @param {object} payload - The object containing the code, e.g., { code: '123456' }.
   */
  markAsDelivered: (orderId, payload) => 
    apiRequest({ url: ENDPOINTS.SELLER_ORDERS.MARK_DELIVERED(orderId), method: 'POST', data: payload }),
};

export const orderService = apiOrderService;