// src/hooks/useSupportMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../settings/supportService.js';
import { supportQueryKeys } from '../queries/useSupportQuery.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const useSendSupportMessageMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, payload }) => supportService.sendMessage(chatId, payload),
    onSuccess: (res, vars) => {
      const { chatId } = vars;
      toast('success', 'Message sent');
      // Update chat detail cache
      qc.setQueryData(supportQueryKeys.chatById(chatId), (old) => {
        if (!old) return old;
        const msg = res?.payload || {};
        const next = { ...old, messages: [...(old.messages || []), msg] };
        return next;
      });
      // Optionally update chat list (lastMessageTime/unreadCount)
      qc.setQueryData(supportQueryKeys.chats({}), (oldList) => {
        if (!Array.isArray(oldList)) return oldList;
        return oldList.map((c) =>
          c.id === chatId
            ? { ...c, lastMessageTime: `Today / ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, unreadCount: 0 }
            : c
        );
      });
    },
    onError: (err) => toast('error', err?.message || 'Failed to send message'),
  });
};

export const useCreateSupportTicketMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => supportService.createTicket(payload),
    onSuccess: (res) => {
      toast('success', res?.message || 'Support request submitted');
      // Invalidate or refetch relevant caches if needed
    },
    onError: (err) => toast('error', err?.message || 'Failed to submit support request'),
  });
};