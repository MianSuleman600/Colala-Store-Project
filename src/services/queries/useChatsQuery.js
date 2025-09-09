// src/services/queries/useChatQuery.js
import { useQuery } from '@tanstack/react-query';
import { chatService } from '../index.js';
import { normalizeChats, normalizeChatThread } from '../../utils/dataNormalizer.js';

/**
 * Fetch all chats for the user/store
 */
export const useChatsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const data = await chatService.getChats();
      return normalizeChats(data?.data || data); // Normalize before returning
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
    ...options,
  });
};

/**
 * Fetch a single chat thread by conversation ID
 * @param {string} conversationId
 */
export const useGetChatByConversationIdQuery = (conversationId, options = {}) => {
  return useQuery({
    queryKey: ['chat', conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');
      const data = await chatService.getChatByConversationId(conversationId);
      return normalizeChatThread(data?.data || data); // Normalize messages
    },
    enabled: !!conversationId,
    staleTime: Infinity, // Chat messages are real-time
    retry: 1,
    ...options,
  });
};
