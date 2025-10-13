// src/services/mutations/useChatMutations.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../index.js';

/**
 * Send a new message in a chat with an optimistic update.
 */
export const useSendMessageMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, payload }) => chatService.sendMessage(chatId, payload),

    onMutate: async ({ chatId, tempMessage }) => {
      const messagesQueryKey = ['chatMessages', chatId];
      
      await queryClient.cancelQueries({ queryKey: messagesQueryKey });
      const previousMessages = queryClient.getQueryData(messagesQueryKey);

      // Optimistically add the temporary message to the UI.
      queryClient.setQueryData(messagesQueryKey, (old = []) => [...old, tempMessage]);

      return { previousMessages };
    },

    // If the mutation fails, roll back to the previous state.
    onError: (err, { chatId }, context) => {
      console.error("Failed to send message:", err);
      if (context?.previousMessages) {
        queryClient.setQueryData(['chatMessages', chatId], context.previousMessages);
      }
      options.onError?.(err);
    },

    // Always refetch after error or success to ensure the UI has the real data from the server.
    onSettled: (data, error, { chatId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats', userId] });
      options.onSettled?.(data, error);
    },
  });
};