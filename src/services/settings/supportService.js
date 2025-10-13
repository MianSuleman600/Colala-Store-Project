// src/services/settings/supportService.js

import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';

const takeData = (res) => res?.data || res;

export const supportService = {
  getTickets: async () => {
    const response = await apiRequest({
      url: ENDPOINTS.SUPPORT.TICKETS.LIST,
      method: 'GET',
    });
    return takeData(response) || [];
  },

  getTicketById: async (ticketId) => {
    if (!ticketId) return null;
    const response = await apiRequest({
      url: ENDPOINTS.SUPPORT.TICKETS.DETAIL(ticketId),
      method: 'GET',
    });
    return takeData(response);
  },

  sendMessage: async (payload) => {
    const fd = new FormData();
    fd.append('ticket_id', payload.ticket_id);
    if (payload.message) {
      fd.append('message', payload.message);
    }
    if (payload.attachment instanceof File) {
      fd.append('attachment', payload.attachment);
    }
    return apiRequest({
      url: ENDPOINTS.SUPPORT.MESSAGES.SEND,
      method: 'POST',
      data: fd,
    });
  },

  // --- THIS IS THE FIX ---
  createTicket: async (payload) => {
    // The backend `SupportTicketRequest` expects a simple JSON object,
    // not FormData, because it doesn't handle file uploads.
    return apiRequest({
      url: ENDPOINTS.SUPPORT.TICKETS.CREATE,
      method: 'POST',
      data: payload, // Send the payload directly as a JSON object
    });
  },
  // --- END OF FIX ---
};