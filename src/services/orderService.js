// src/services/orderService.js
import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';
import { dummyOrders, dummyOrdersForTechieHub } from '../utils/data/dummyOrders.js';
import { USE_DUMMY_DATA } from '../utils/config.js'; // global toggle

// --- Dummy Order Service ---
const dummyOrderService = {
  getOrders: async (status = null, userId = 'default_user_id') => {
    console.debug('[orderService:dummy] getOrders called', { status, userId });

    let orders = userId === 'another_user_id' ? dummyOrdersForTechieHub : dummyOrders;
    console.debug('[orderService:dummy] initial orders count:', orders.length);

    if (status) {
      orders = orders.filter((o) => o.status === status);
      console.debug('[orderService:dummy] filtered by status:', status, 'result count:', orders.length);
    }

    // Return in a shape the hook can inspect (older code returned { orders } - some returned array)
    const response = { orders, message: 'Fetched dummy orders successfully.' };
    console.debug('[orderService:dummy] returning response shape:', response);
    return response;
  },

  getOrderById: async (orderId, userId = 'default_user_id') => {
    console.debug('[orderService:dummy] getOrderById called', { orderId, userId });
    const orders = userId === 'another_user_id' ? dummyOrdersForTechieHub : dummyOrders;
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      console.debug('[orderService:dummy] found order:', order.id);
      return { order: { ...order }, message: 'Fetched dummy order by ID.' };
    }
    console.debug('[orderService:dummy] order not found:', orderId);
    return { order: null, message: 'Order not found.' };
  },

  // ... other dummy methods unchanged ...
};

// --- Real API Service ---
const apiOrderService = {
  getOrders: async (status = null) => {
    let url = ENDPOINTS.ORDERS.GET_ALL;
    if (status) url += `?status=${status}`;
    console.debug('[orderService:api] getOrders will call URL:', url);
    return apiRequest({ url, method: 'GET' });
  },

  getOrderById: async (orderId) => {
    console.debug('[orderService:api] getOrderById will call URL:', ENDPOINTS.ORDERS.DETAIL(orderId));
    return apiRequest({ url: ENDPOINTS.ORDERS.DETAIL(orderId), method: 'GET' });
  },

  // ... other api methods unchanged ...
};

export const orderService = USE_DUMMY_DATA ? dummyOrderService : apiOrderService;
