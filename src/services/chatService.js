// src/services/chatService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

/**
 * The API service for all chat-related functionality.
 */
export const chatService = {
  /**
   * Fetches the list of all chat conversations for the seller.
   */
  getChats: () => apiRequest({
    url: ENDPOINTS.SELLER_CHAT.LIST_CHATS,
    method: 'GET',
  }),

  /**
   * Fetches all messages for a specific chat conversation.
   */
  getChatMessages: (chatId) => apiRequest({
    url: ENDPOINTS.SELLER_CHAT.GET_MESSAGES(chatId),
    method: 'GET',
  }),

  /**
   * Sends a new message to a conversation.
   */
  sendMessage: (chatId, payload) => apiRequest({
    url: ENDPOINTS.SELLER_CHAT.SEND_MESSAGE(chatId),
    method: 'POST',
    data: payload,
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};