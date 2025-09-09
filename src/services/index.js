// src/services/index.js
import { USE_DUMMY_DATA } from '../utils/config.js';
import {
  // normalizeProfiles, // removed: handled in userService
  normalizeProducts,
  normalizeServices,
  normalizeChats,
  normalizeFeedPosts,
  normalizeOrders,
  normalizeAnalytics,
  normalizePromotions,
} from '../utils/dataNormalizer.js';

import { MOCK_DB } from '../utils/data/db.js';
import { dummyChats } from '../utils/data/dummychats.js';
import DUMMY_POSTS from '../utils/data/dummyFeed.js';
import { dummyServices } from '../utils/data/dummyServices.js';
import { dummyOrders, dummyOrdersForTechieHub } from '../utils/data/dummyOrders.js';
import { dummyStoreAnalytics } from '../utils/data/dummyStoreAnalytics.js';
import dummyProducts from '../utils/data/dummyProducts.js';
import dummyPromotions from '../utils/data/dummyPromotions.js';

export { reviewService } from '../services/settings/reviewService.js';
export { referralService } from '../services/settings/referralService.js';
export { supportService } from '../services/settings/supportService.js';
export { leaderboardService } from '../services/settings/leaderboardService.js';
export { accessControlService } from '../services/settings/accessControlService.js';

// Real service imports
// userService is now the single source of truth (dummy/api handled inside)
export { userService } from './userService.js';

import * as apiProductService from './productService.js';
import * as apiServiceService from './serviceService.js';
import * as apiChatService from './chatService.js';
import * as apiFeedService from './feedService.js';
import * as apiOrderService from './orderService.js';
import * as apiAnalyticsService from './settings/storeAnalyticsService.js';
import * as apiPromotionService from './settings/promotionsService.js';

// Announcements/Banners service (correct path)
export { announcementService } from '../services/settings/announcementService.js';
// Coupons/Points (correct path)
export { couponService } from '../services/settings/couponService.js';

/* ---------------- Helpers ---------------- */
const normalizeOne = (normalizerFn, item) => {
  if (!item) return null;
  const arr = normalizerFn([item]);
  return Array.isArray(arr) ? arr[0] : null;
};

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

/* ---------------- Dummy Analytics Service ---------------- */
const dummyAnalyticsService = {
  getStoreAnalytics: async (storeId) => {
    if (!storeId) throw new Error('Store ID is required');
    return {
      success: true,
      data: normalizeAnalytics(dummyStoreAnalytics),
      message: 'Fetched dummy store analytics successfully',
    };
  },
};

/* ---------------- Dummy Product Service ---------------- */
let PRODUCTS = [...dummyProducts];

const enrichWithProfile = (entity) => {
  const ownerId = entity.ownerId;
  const store = ownerId ? MOCK_DB.storeProfiles[ownerId] : null;
  if (!store) return entity;

  return {
    ...entity,
    profile: {
      userName: entity.profile?.userName || store.storeName || store.name || 'Unknown',
      profilePic: entity.profile?.profilePic || store.profilePictureUrl || '/default-profile.png',
      ...entity.profile,
    },
  };
};

const dummyProductService = {
  getCategories: async () => {
    await delay();
    const set = new Set(PRODUCTS.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  },

  getBrands: async () => {
    await delay();
    return ['Apple', 'Samsung', 'Sony', 'Canon', 'Dell'].sort();
  },

  getLocations: async () => {
    await delay();
    const set = new Set(PRODUCTS.map((p) => p.location).filter(Boolean));
    return Array.from(set);
  },

  getProducts: async (_token, { userId } = {}) => {
    await delay();
    const list = userId ? PRODUCTS.filter((p) => p.ownerId === userId) : PRODUCTS;
    return list.map(enrichWithProfile);
  },

  getProductDetail: async (id) => {
    await delay();
    const found = PRODUCTS.find((p) => p.id === id);
    return found ? enrichWithProfile(found) : null;
  },

  addProduct: async (payload, _token, { userId } = {}) => {
    await delay();
    const id = payload?.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ownerId = payload?.ownerId || userId || 'anonymous';
    const newProduct = enrichWithProfile({
      id,
      ownerId,
      status: 'Active',
      metrics: {},
      chartData: [],
      boostSetup: {},
      detailsPageInfo: {},
      ...payload,
    });
    PRODUCTS.unshift(newProduct);
    return newProduct;
  },

  bulkUploadProducts: async (fileOrList, _token, { userId } = {}) => {
    await delay();
    const list = Array.isArray(fileOrList) ? fileOrList : [];
    const created = list.map((p) =>
      enrichWithProfile({
        id: p?.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ownerId: p?.ownerId || userId || 'anonymous',
        status: 'Active',
        metrics: {},
        chartData: [],
        boostSetup: {},
        detailsPageInfo: {},
        ...p,
      })
    );
    PRODUCTS = [...created, ...PRODUCTS];
    return created;
  },

  updateProduct: async (id, payload, _token) => {
    await delay();
    PRODUCTS = PRODUCTS.map((p) => (p.id === id ? { ...p, ...payload } : p));
    const updated = PRODUCTS.find((p) => p.id === id);
    return updated ? enrichWithProfile(updated) : null;
  },

  deleteProduct: async (id, _token) => {
    await delay();
    const before = PRODUCTS.length;
    PRODUCTS = PRODUCTS.filter((p) => p.id !== id);
    return { success: PRODUCTS.length < before };
  },
};

/* ---------------- Dummy Promotion Service ---------------- */
let PROMOTIONS = [...dummyPromotions];

const extendLogic = (promo, { dailyBudget, durationDays }) => {
  const pd = promo.promotionDetails || {};
  const dBudget = Number(dailyBudget) || 0;
  const dDays = Number(durationDays) || 0;

  const start = pd.endDate ? new Date(pd.endDate) : new Date(pd.dateCreated || Date.now());
  const nextEnd = new Date(start);
  nextEnd.setDate(start.getDate() + dDays);

  const amount = (pd.amountSpent || 0) + dBudget * dDays;

  const daysRemaining = Math.max(0, Math.ceil((nextEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return {
    ...promo,
    promotionDetails: {
      ...pd,
      amountSpent: amount,
      endDate: nextEnd.toISOString(),
      daysRemaining,
      status: 'Active',
    },
  };
};

const dummyPromotionService = {
  getPromotions: async (_token, { userId, status, category, search } = {}) => {
    await delay();
    let list = PROMOTIONS;
    if (userId) list = list.filter((p) => p.ownerId === userId);
    if (status) list = list.filter((p) => (p.promotionDetails?.status || p.status) === status);
    if (category) list = list.filter((p) => p.category === category);
    if (search) {
      const s = String(search).toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s));
    }
    return normalizePromotions(list.map(enrichWithProfile));
  },

  getPromotionDetail: async (id) => {
    await delay();
    const found = PROMOTIONS.find((p) => p.id === id);
    return normalizeOne(normalizePromotions, found ? enrichWithProfile(found) : null);
  },

  createPromotion: async (payload, _token, { userId } = {}) => {
    await delay();
    const id = payload?.id || `promo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ownerId = payload?.ownerId || userId || 'anonymous';
    const base = {
      id,
      ownerId,
      status: 'Active',
      productViews: 0,
      productClicks: 0,
      messages: 0,
      promotionDetails: {
        reach: 0,
        impressions: 0,
        costPerClick: 0,
        amountSpent: 0,
        dateCreated: new Date().toISOString(),
        endDate: '',
        daysRemaining: 0,
        status: 'Active',
      },
      ...payload,
    };
    const created = enrichWithProfile(base);
    PROMOTIONS.unshift(created);
    return normalizeOne(normalizePromotions, created);
  },

  extendPromotion: async (id, payload, _token) => {
    await delay();
    PROMOTIONS = PROMOTIONS.map((p) => (p.id === id ? extendLogic(p, payload) : p));
    const updated = PROMOTIONS.find((p) => p.id === id);
    return normalizeOne(normalizePromotions, updated ? enrichWithProfile(updated) : null);
  },

  pausePromotion: async (id, _token) => {
    await delay();
    PROMOTIONS = PROMOTIONS.map((p) =>
      p.id === id ? { ...p, promotionDetails: { ...p.promotionDetails, status: 'Paused' } } : p
    );
    const updated = PROMOTIONS.find((p) => p.id === id);
    return normalizeOne(normalizePromotions, updated ? enrichWithProfile(updated) : null);
  },

  resumePromotion: async (id, _token) => {
    await delay();
    PROMOTIONS = PROMOTIONS.map((p) =>
      p.id === id ? { ...p, promotionDetails: { ...p.promotionDetails, status: 'Active' } } : p
    );
    const updated = PROMOTIONS.find((p) => p.id === id);
    return normalizeOne(normalizePromotions, updated ? enrichWithProfile(updated) : null);
  },

  updatePromotion: async (id, payload, _token) => {
    await delay();
    PROMOTIONS = PROMOTIONS.map((p) => (p.id === id ? { ...p, ...payload } : p));
    const updated = PROMOTIONS.find((p) => p.id === id);
    return normalizeOne(normalizePromotions, updated ? enrichWithProfile(updated) : null);
  },

  deletePromotion: async (id, _token) => {
    await delay();
    const before = PROMOTIONS.length;
    PROMOTIONS = PROMOTIONS.filter((p) => p.id !== id);
    return { success: PROMOTIONS.length < before };
  },
};

/* ---------------- Dummy Service Service ---------------- */
let services = [...dummyServices];

const dummyServiceService = {
  getServices: async () => ({
    success: true,
    services: normalizeServices(services),
    message: 'Services fetched successfully (dummy data)',
  }),
  getServiceById: async (id) => {
    const service = services.find((s) => s.id === id);
    return {
      success: !!service,
      service: normalizeOne(normalizeServices, service),
      message: service ? 'Service fetched successfully (dummy data)' : 'Service not found (dummy data)',
    };
  },
  createService: async (payload) => {
    const newService = { id: `service-${Date.now()}`, ...payload };
    services.push(newService);
    return {
      success: true,
      message: 'Service created (dummy data)',
      service: normalizeOne(normalizeServices, newService),
    };
  },
  updateService: async (id, payload) => {
    const index = services.findIndex((s) => s.id === id);
    if (index !== -1) {
      services[index] = { ...services[index], ...payload };
      return {
        success: true,
        message: 'Service updated (dummy data)',
        service: normalizeOne(normalizeServices, services[index]),
      };
    }
    return { success: false, message: 'Service not found (dummy data)' };
  },
  deleteService: async (id) => {
    const originalLength = services.length;
    services = services.filter((s) => s.id !== id);
    return { success: services.length < originalLength, message: 'Service deleted (dummy data)' };
  },
};

/* ---------------- Dummy Chat Service ---------------- */
let chats = [...dummyChats];

const dummyChatService = {
  getChats: async () => ({ chats: normalizeChats(chats), message: 'Chats fetched successfully' }),
  getChatByConversationId: async (conversationId) => {
    const chat = chats.find((c) => c.id === conversationId);
    return {
      chat: normalizeOne(normalizeChats, chat),
      message: chat ? 'Chat fetched successfully' : 'Chat not found',
    };
  },
  sendMessage: async (chatId, payload) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return { success: false, message: 'Chat not found (dummy data).' };

    const serverMsg = {
      id: `msg-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    chat.messages.push(serverMsg);
    chat.lastMessage = payload.text || 'New message';
    return { success: true, message: 'Message sent (dummy data).', payload: serverMsg };
  },
};

/* ---------------- Dummy Feed Service ---------------- */
let dummyPosts = [...DUMMY_POSTS];

const dummyFeedService = {
  getFeed: async () => ({
    posts: normalizeFeedPosts(dummyPosts),
    message: 'Feed fetched successfully',
  }),
  createPost: async (payload) => {
    const newPost = { ...payload, id: `post-${Date.now()}` };
    dummyPosts.unshift(newPost);
    return {
      success: true,
      post: normalizeOne(normalizeFeedPosts, newPost),
      message: 'Post created (dummy data).',
    };
  },
  updatePost: async (postId, payload) => {
    const index = dummyPosts.findIndex((p) => p.id === postId);
    if (index !== -1) {
      dummyPosts[index] = { ...dummyPosts[index], ...payload };
      return {
        success: true,
        message: 'Post updated (dummy data)',
        post: normalizeOne(normalizeFeedPosts, dummyPosts[index]),
      };
    }
    return { success: false, message: 'Post not found (dummy data).' };
  },
  deletePost: async (postId) => {
    const originalLength = dummyPosts.length;
    dummyPosts = dummyPosts.filter((p) => p.id !== postId);
    return { success: dummyPosts.length < originalLength, message: 'Post deleted (dummy data)' };
  },
};

/* ---------------- Dummy Order Service (ADDED) ---------------- */
const dummyOrderService = {
  getOrders: async (status = null, userId = 'default_user_id') => {
    await delay();
    const orders = userId === 'another_user_id' ? dummyOrdersForTechieHub : dummyOrders;
    const filtered = status ? orders.filter((o) => o.status === status) : orders;
    return { orders: normalizeOrders(filtered), message: 'Fetched orders (dummy data)' };
  },
  getOrderById: async (orderId, userId = 'default_user_id') => {
    await delay();
    const orders = userId === 'another_user_id' ? dummyOrdersForTechieHub : dummyOrders;
    const order = orders.find((o) => o.id === orderId) || null;
    return {
      order: normalizeOne(normalizeOrders, order),
      message: order ? 'Order fetched successfully' : 'Order not found',
    };
  },
  createOrder: async (payload) => ({
    success: true,
    message: 'Order created (dummy data)',
    order: normalizeOne(normalizeOrders, payload),
  }),
  updateOrder: async (orderId, payload) => ({
    success: true,
    message: 'Order updated (dummy data)',
    orderId,
    payload: normalizeOne(normalizeOrders, payload),
  }),
  deleteOrder: async (orderId) => ({ success: true, message: 'Order deleted (dummy data)', orderId }),
};

/* ---------------- Export Conditional Services ---------------- */
export const productService = USE_DUMMY_DATA ? dummyProductService : apiProductService;
export const promotionService = USE_DUMMY_DATA ? dummyPromotionService : apiPromotionService;
export const serviceService = USE_DUMMY_DATA ? dummyServiceService : apiServiceService;
export const chatService = USE_DUMMY_DATA ? dummyChatService : apiChatService;
export const feedService = USE_DUMMY_DATA ? dummyFeedService : apiFeedService;
export const orderService = USE_DUMMY_DATA ? dummyOrderService : apiOrderService;
export const analyticsService = USE_DUMMY_DATA ? dummyAnalyticsService : apiAnalyticsService;