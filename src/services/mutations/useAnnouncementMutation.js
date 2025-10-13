// src/services/mutations/useAnnouncementMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService.js';
import { announcementQueryKeys } from '../queries/useAnnouncementQuery.js';
import { useToast } from '../../components/ui/ToastProvider';

export const useCreateAnnouncementMutation = (options = {}) => {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (payload) => announcementService.createAnnouncement(payload),
    onSuccess: () => {
      push('Announcement created successfully', { type: 'success' });
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcements });
    },
    onError: (err) => push(err?.message || 'Failed to create announcement', { type: 'error' }),
    ...options,
  });
};

export const useUpdateAnnouncementMutation = (options = {}) => {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => announcementService.updateAnnouncement(id, payload),
    onSuccess: () => {
      push('Announcement updated successfully', { type: 'success' });
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcements });
    },
    onError: (err) => push(err?.message || 'Failed to update announcement', { type: 'error' }),
    ...options,
  });
};

export const useDeleteAnnouncementMutation = (options = {}) => {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (id) => announcementService.deleteAnnouncement(id),
    onSuccess: () => {
      push('Announcement deleted', { type: 'success' });
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcements });
    },
    onError: (err) => push(err?.message || 'Failed to delete announcement', { type: 'error' }),
    ...options,
  });
};