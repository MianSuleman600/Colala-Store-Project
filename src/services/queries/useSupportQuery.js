// src/hooks/useSupportQuery.js
import { useQuery } from '@tanstack/react-query';
import { supportService } from '../settings/supportService';

export const supportQueryKeys = {
  chats: (params = {}) => ['support', 'chats', params],
  chatById: (chatId) => ['support', 'chat', chatId],
};

export const useSupportChatsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: supportQueryKeys.chats(params),
    queryFn: async () => {
      const res = await supportService.getChats(params);
      return res.chats || [];
    },
    staleTime: 30_000,
    ...options,
  });

export const useSupportChatByIdQuery = (chatId, options = {}) =>
  useQuery({
    queryKey: supportQueryKeys.chatById(chatId),
    queryFn: async () => {
      if (!chatId) return null;
      const res = await supportService.getChatById(chatId);
      return res.chat || null;
    },
    enabled: !!chatId,
    staleTime: 15_000,
    ...options,
  });