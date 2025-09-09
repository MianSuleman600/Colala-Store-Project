// src/services/mutations/useChatMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../index.js';
import { normalizeChatThread } from '../../utils/dataNormalizer.js';

const updateCache = (queryClient, chatId, data) => {
  queryClient.setQueryData(['chat', chatId], normalizeChatThread(data));
  queryClient.invalidateQueries({ queryKey: ['chats'] }); // Optionally refresh chat list
};

/**
 * Send a new message in a chat
 */
export const useSendMessageMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, message }) => chatService.sendMessage(chatId, message),
    onSuccess: (data, variables) => {
      updateCache(queryClient, variables.chatId, data);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      options.onError?.(error);
    },
  });
};

/**
 * Edit an existing message
 */
export const useEditMessageMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, messageId, updatedMessage }) =>
      chatService.updateMessage(chatId, messageId, updatedMessage),
    onSuccess: (data, variables) => {
      updateCache(queryClient, variables.chatId, data);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to edit message:', error);
      options.onError?.(error);
    },
  });
};

/**
 * Delete a message
 */
export const useDeleteMessageMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, messageId }) => chatService.deleteMessage(chatId, messageId),
    onSuccess: (data, variables) => {
      updateCache(queryClient, variables.chatId, data);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to delete message:', error);
      options.onError?.(error);
    },
  });
};
