// src/services/queries/useChatQuery.js
import { useQuery } from '@tanstack/react-query';
import { chatService } from '../index.js';
import { normalizeSellerChatsList, normalizeSellerChatMessages } from '../../utils/dataNormalizer.js';

/**
 * Fetch all chat conversations for the user/store.
 */
export const useChatsQuery = (userId, options = {}) => {
  return useQuery({
    // MODIFICATION: Add userId to the queryKey to ensure it's user-specific
    queryKey: ['chats', userId],
    queryFn: async () => {
      const data = await chatService.getChats();
      return normalizeSellerChatsList(data);
    },
    enabled: !!userId, // Ensure query only runs when logged in
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
};

/**
 * Fetch all messages for a single chat thread.
 */
export const useChatMessagesQuery = (chatId, options = {}) => {
  return useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const data = await chatService.getChatMessages(chatId);
      return normalizeSellerChatMessages(data);
    },
    enabled: !!chatId,
    staleTime: 10 * 1000,
    refetchInterval: 15000,
    ...options,
  });
};