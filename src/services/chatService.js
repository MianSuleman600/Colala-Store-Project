// src/services/chatService.js
import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';
import { dummyChats } from '../utils/data/dummychats.js';
import { USE_DUMMY_DATA } from '../utils/config.js'; // global toggle

// --- Dummy Chat Service ---
const dummyChatService = {
  getChats: async () =>
    new Promise((resolve) => setTimeout(() => resolve({ chats: dummyChats, message: 'Fetched dummy chat data successfully.' }), 300)),

  getChatByConversationId: async (conversationId) => {
    const chat = dummyChats.find(c => c.id === conversationId);
    return chat
      ? { chat: { ...chat }, message: 'Chat fetched successfully.' }
      : { chat: null, message: 'Chat not found.' };
  },

  sendMessage: async (chatId, payload) => {
    const chat = dummyChats.find(c => c.id === chatId);
    if (!chat) return { success: false, message: 'Chat not found (dummy).' };
    const tempMessage = {
      id: `msg-${Date.now()}`,
      ...payload,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    chat.messages.push(tempMessage);
    chat.lastMessage = payload.text || 'New message';
    return { success: true, message: 'Message sent (dummy).', data: tempMessage };
  },

  updateMessage: async (chatId, messageId, payload) => {
    const chat = dummyChats.find(c => c.id === chatId);
    if (!chat) return { success: false, message: 'Chat not found (dummy).' };
    const index = chat.messages.findIndex(m => m.id === messageId);
    if (index === -1) return { success: false, message: 'Message not found (dummy).' };
    chat.messages[index] = { ...chat.messages[index], ...payload };
    return { success: true, message: 'Message updated (dummy).', data: chat.messages[index] };
  },

  deleteMessage: async (chatId, messageId) => {
    const chat = dummyChats.find(c => c.id === chatId);
    if (!chat) return { success: false, message: 'Chat not found (dummy).' };
    const index = chat.messages.findIndex(m => m.id === messageId);
    if (index === -1) return { success: false, message: 'Message not found (dummy).' };
    chat.messages.splice(index, 1);
    return { success: true, message: 'Message deleted (dummy).' };
  },
};

// --- Real API Chat Service ---
const apiChatService = {
  getChats: async () => apiRequest({ url: ENDPOINTS.CHAT.GET_ALL, method: 'GET' }),

  getChatByConversationId: async (conversationId) =>
    apiRequest({ url: ENDPOINTS.CHAT.GET_BY_ID(conversationId), method: 'GET' }),

  sendMessage: async (chatId, payload, token) =>
    apiRequest({
      url: ENDPOINTS.CHAT.SEND(chatId),
      method: 'POST',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateMessage: async (chatId, messageId, payload, token) =>
    apiRequest({
      url: ENDPOINTS.CHAT.UPDATE(chatId, messageId),
      method: 'PUT',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteMessage: async (chatId, messageId, token) =>
    apiRequest({
      url: ENDPOINTS.CHAT.DELETE(chatId, messageId),
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// --- Export based on global dummy flag ---
export const chatService = USE_DUMMY_DATA ? dummyChatService : apiChatService;
