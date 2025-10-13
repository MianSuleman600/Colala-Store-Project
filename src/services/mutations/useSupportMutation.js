import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../settings/supportService.js';
import { supportQueryKeys } from '../queries/useSupportQuery.js';

const toast = (type, message) => console.log(`[Toast ${type}]: ${message}`);

export const useSendSupportMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => supportService.sendMessage(payload),
    onSuccess: (newMessage, variables) => {
      const { ticket_id } = variables;
      toast('success', 'Message sent');
      queryClient.setQueryData(supportQueryKeys.ticketById(ticket_id), (oldTicket) => {
        if (!oldTicket) return;
        return {
          ...oldTicket,
          messages: [...(oldTicket.messages || []), newMessage.data],
        };
      });
      queryClient.invalidateQueries({ queryKey: supportQueryKeys.tickets });
    },
    onError: (err) => toast('error', err?.message || 'Failed to send message'),
  });
};

export const useCreateSupportTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => supportService.createTicket(payload),
    onSuccess: () => {
      toast('success', 'Support ticket submitted');
      queryClient.invalidateQueries({ queryKey: supportQueryKeys.tickets });
    },
    onError: (err) => toast('error', err?.message || 'Failed to submit support request'),
  });
};