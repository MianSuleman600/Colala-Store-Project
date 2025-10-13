import { useQuery } from '@tanstack/react-query';
import { supportService } from '../settings/supportService';

export const supportQueryKeys = {
  tickets: ['support', 'tickets'],
  ticketById: (ticketId) => ['support', 'ticket', ticketId],
};

export const useSupportTicketsQuery = (options = {}) =>
  useQuery({
    queryKey: supportQueryKeys.tickets,
    queryFn: () => supportService.getTickets(),
    staleTime: 30_000,
    ...options,
  });

export const useSupportTicketByIdQuery = (ticketId, options = {}) =>
  useQuery({
    queryKey: supportQueryKeys.ticketById(ticketId),
    queryFn: () => supportService.getTicketById(ticketId),
    enabled: !!ticketId,
    staleTime: 15_000,
    ...options,
  });