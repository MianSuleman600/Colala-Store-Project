// src/hooks/useAccessControlQuery.js
import { useQuery } from '@tanstack/react-query';
import { accessControlService } from '../settings/accessControlService';

export const aclQueryKeys = {
  users: ['acl', 'users'],
  roles: ['acl', 'roles'],
};

export const useAclUsersQuery = (options = {}) =>
  useQuery({
    queryKey: aclQueryKeys.users,
    queryFn: async () => {
      const res = await accessControlService.getUsers();
      return res.users || [];
    },
    staleTime: 30_000,
    ...options,
  });

export const useAclRolesQuery = (options = {}) =>
  useQuery({
    queryKey: aclQueryKeys.roles,
    queryFn: async () => {
      const res = await accessControlService.getRoles();
      return res.roles || [];
    },
    staleTime: 300_000,
    ...options,
  });