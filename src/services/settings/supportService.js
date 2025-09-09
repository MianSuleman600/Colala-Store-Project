// src/services/supportService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import { DUMMY_SUPPORT_CHATS, DUMMY_SUPPORT_TICKETS } from '../../utils/data/dummySupport.js';

/* ---------------- Helpers ---------------- */
const nowTime = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};
const takeList = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
const takeItem = (res) => res?.data || res;

/* ---------------- Dummy ---------------- */
let CHATS = Array.isArray(DUMMY_SUPPORT_CHATS) ? JSON.parse(JSON.stringify(DUMMY_SUPPORT_CHATS)) : [];
let TICKETS = Array.isArray(DUMMY_SUPPORT_TICKETS) ? [...DUMMY_SUPPORT_TICKETS] : [];

const dummySupport = {
  getChats: async (params = {}) => {
    let list = [...CHATS];
    const { search, status } = params;
    if (search) {
      const s = String(search).toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(s));
    }
    if (status && status !== 'All') list = list.filter((c) => c.status === status);
    return { success: true, chats: list };
  },
  getChatById: async (chatId) => {
    const chat = CHATS.find((c) => c.id === chatId);
    return { success: !!chat, chat: chat || null };
  },
  sendMessage: async (chatId, payload) => {
    const chat = CHATS.find((c) => c.id === chatId);
    if (!chat) throw new Error('Chat not found');
    const serverMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: payload.files?.length
        ? { type: 'file', files: payload.files.map((f) => ({ name: f.name, type: f.type })) }
        : { type: 'text', text: String(payload.text || '') },
      timestamp: nowTime(),
    };
    chat.messages.push(serverMsg);
    chat.lastMessageTime = `Today / ${nowTime()}`;
    chat.unreadCount = 0;
    return { success: true, message: 'Message sent', payload: serverMsg };
  },
  createTicket: async (payload) => {
    const item = {
      id: `ticket-${Date.now()}`,
      category: String(payload.category || ''),
      details: String(payload.details || ''),
      files: Array.isArray(payload.files) ? payload.files.map((f) => ({ name: f.name, type: f.type })) : [],
      createdAt: new Date().toISOString(),
    };
    TICKETS.unshift(item);
    return { success: true, ticket: item, message: 'Support request submitted' };
  },
};

/* ---------------- API ---------------- */
const apiSupport = {
  getChats: async (params = {}) => {
    const res = await apiRequest({ url: ENDPOINTS.SUPPORT.CHATS.LIST, method: 'GET', params });
    return { success: true, chats: takeList(res) };
  },
  getChatById: async (chatId) => {
    const res = await apiRequest({ url: ENDPOINTS.SUPPORT.CHATS.DETAIL(chatId), method: 'GET' });
    // Expect { id, messages: [], ... }
    return { success: true, chat: takeItem(res) };
  },
  sendMessage: async (chatId, payload) => {
    // Support both JSON and FormData (attachments)
    let data = payload;
    let headers = {};
    if (Array.isArray(payload.files) && payload.files.length) {
      const fd = new FormData();
      if (payload.text) fd.append('text', payload.text);
      payload.files.forEach((f, idx) => fd.append('files[]', f, f.name || `file-${idx}`));
      data = fd;
      headers = { 'Content-Type': 'multipart/form-data' };
    }
    const res = await apiRequest({
      url: ENDPOINTS.SUPPORT.CHATS.SEND(chatId),
      method: 'POST',
      data,
      headers,
    });
    return { success: true, payload: takeItem(res) };
  },
  createTicket: async (payload) => {
    const fd = new FormData();
    fd.append('category', String(payload.category || ''));
    fd.append('details', String(payload.details || ''));
    (payload.files || []).forEach((f, idx) => fd.append('files[]', f, f.name || `file-${idx}`));
    const res = await apiRequest({
      url: ENDPOINTS.SUPPORT.TICKETS.CREATE,
      method: 'POST',
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, ticket: takeItem(res), message: 'Support request submitted' };
  },
};

export const supportService = USE_DUMMY_DATA ? dummySupport : apiSupport;