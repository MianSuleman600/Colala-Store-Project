// src/hooks/useAccessControlMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accessControlService } from '../settings/accessControlService.js';
import { aclQueryKeys } from '../queries/useAccessControlQuery.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const useAclCreateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => accessControlService.createUser(payload),
    onSuccess: () => {
      toast('success', 'User created');
      qc.invalidateQueries({ queryKey: aclQueryKeys.users });
    },
    onError: (err) => toast('error', err?.message || 'Failed to create user'),
  });
};

export const useAclInviteUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => accessControlService.inviteUser(payload),
    onSuccess: () => {
      toast('success', 'Invitation sent');
      qc.invalidateQueries({ queryKey: aclQueryKeys.users });
    },
    onError: (err) => toast('error', err?.message || 'Failed to invite user'),
  });
};

export const useAclAssignRoleMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) => accessControlService.assignRole(userId, { role }),
    onSuccess: () => {
      toast('success', 'Role updated');
      qc.invalidateQueries({ queryKey: aclQueryKeys.users });
    },
    onError: (err) => toast('error', err?.message || 'Failed to update role'),
  });
};

export const useAclUpdateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }) => accessControlService.updateUser(userId, payload),
    onSuccess: () => {
      toast('success', 'User updated');
      qc.invalidateQueries({ queryKey: aclQueryKeys.users });
    },
    onError: (err) => toast('error', err?.message || 'Failed to update user'),
  });
};

export const useAclDeleteUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => accessControlService.deleteUser(userId),
    onSuccess: () => {
      toast('success', 'User deleted');
      qc.invalidateQueries({ queryKey: aclQueryKeys.users });
    },
    onError: (err) => toast('error', err?.message || 'Failed to delete user'),
  });
};