// src/services/mutations/useAccessControlMutation.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accessControlService } from '../settings/accessControlService.js';
import { aclQueryKeys } from '../queries/useAccessControlQuery.js';

// A simple toast helper. You can replace this with your actual toast provider.
const toast = (type, message) => {
  console.log(`[${type.toUpperCase()}]: ${message}`);
  // Example: window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
};

// Renamed for clarity, as we only add users.
export const useAclAddUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => accessControlService.addUser(payload),
    onSuccess: () => {
      toast('success', 'User added successfully');
      queryClient.invalidateQueries({ queryKey: aclQueryKeys.users });
    },
    onError: (err) => toast('error', err?.message || 'Failed to add user'),
  });
};

export const useAclRemoveUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => accessControlService.removeUser(userId),
    onSuccess: () => {
      toast('success', 'User removed successfully');
      queryClient.invalidateQueries({ queryKey: aclQueryKeys.users });
    },
    onError: (err) => toast('error', err?.message || 'Failed to remove user'),
  });
};

// The other mutations for roles, invites, etc., are removed.