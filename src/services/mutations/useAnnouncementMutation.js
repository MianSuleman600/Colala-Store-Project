// src/hooks/useAnnouncementMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService.js';
import { announcementQueryKeys } from '../queries/useAnnouncementQuery.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const useCreateAnnouncementMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => announcementService.createAnnouncement(payload),
    onSuccess: () => {
      toast('success', 'Announcement created');
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcements });
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcementsActive });
    },
    onError: (err) => toast('error', err?.message || 'Failed to create announcement'),
  });
};

export const useUpdateAnnouncementMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => announcementService.updateAnnouncement(id, payload),
    onSuccess: () => {
      toast('success', 'Announcement updated');
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcements });
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcementsActive });
    },
    onError: (err) => toast('error', err?.message || 'Failed to update announcement'),
  });
};

export const useDeleteAnnouncementMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => announcementService.deleteAnnouncement(id),
    onSuccess: () => {
      toast('success', 'Announcement deleted');
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcements });
      qc.invalidateQueries({ queryKey: announcementQueryKeys.announcementsActive });
    },
    onError: (err) => toast('error', err?.message || 'Failed to delete announcement'),
  });
};