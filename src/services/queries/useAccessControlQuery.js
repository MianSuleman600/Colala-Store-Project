// src/services/queries/useAccessControlQuery.js

import { useQuery } from '@tanstack/react-query';
import { accessControlService } from '../settings/accessControlService';

export const aclQueryKeys = {
  users: ['acl', 'users'],
};

export const useAclUsersQuery = (options = {}) =>
  useQuery({
    queryKey: aclQueryKeys.users,
    // The service now directly returns the array we need.
    queryFn: () => accessControlService.getUsers(),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });

// We no longer need useAclRolesQuery as the backend doesn't support it.