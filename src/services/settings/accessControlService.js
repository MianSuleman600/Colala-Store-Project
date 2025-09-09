// src/services/accessControlService.js
import { apiRequest } from '../../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { USE_DUMMY_DATA } from '../../utils/config.js';
import { normalizeAclUsers, normalizeAclRoles } from '../../utils/dataNormalizer.js';
import { DUMMY_ACL_USERS, DUMMY_ACL_ROLES } from '../../utils/data/dummyAccessControl.js';

/* ---------------- Helpers ---------------- */
const takeList = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
const takeItem = (res) => res?.data || res;

/* ---------------- Dummy ---------------- */
let ACL_USERS = Array.isArray(DUMMY_ACL_USERS) ? [...DUMMY_ACL_USERS] : [];
let ACL_ROLES = Array.isArray(DUMMY_ACL_ROLES) ? [...DUMMY_ACL_ROLES] : [];

const dummyAccess = {
  getUsers: async () => ({ success: true, users: normalizeAclUsers(ACL_USERS) }),
  getRoles: async () => ({ success: true, roles: normalizeAclRoles(ACL_ROLES) }),
  createUser: async ({ email, password, role }) => {
    const exists = ACL_USERS.some((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
    if (exists) throw new Error('Email already exists');
    const user = {
      id: `usr-${Date.now()}`,
      email: String(email || '').toLowerCase(),
      role: role || 'Viewer',
      avatar: 'https://placehold.co/80x80/EF4444/FFFFFF?text=U',
      createdAt: new Date().toISOString(),
    };
    ACL_USERS.unshift(user);
    return { success: true, user: normalizeAclUsers([user])[0], message: 'User created' };
  },
  inviteUser: async ({ email, role }) => {
    const exists = ACL_USERS.some((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
    if (exists) throw new Error('Email already exists');
    const user = {
      id: `usr-${Date.now()}`,
      email: String(email || '').toLowerCase(),
      role: role || 'Viewer',
      avatar: 'https://placehold.co/80x80/EF4444/FFFFFF?text=U',
      createdAt: new Date().toISOString(),
    };
    ACL_USERS.unshift(user);
    return { success: true, user: normalizeAclUsers([user])[0], message: 'Invitation sent' };
  },
  assignRole: async (userId, { role }) => {
    const idx = ACL_USERS.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) throw new Error('User not found');
    ACL_USERS[idx].role = role || ACL_USERS[idx].role;
    return { success: true, user: normalizeAclUsers([ACL_USERS[idx]])[0], message: 'Role updated' };
  },
  updateUser: async (userId, payload) => {
    const idx = ACL_USERS.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) throw new Error('User not found');
    ACL_USERS[idx] = { ...ACL_USERS[idx], ...payload };
    return { success: true, user: normalizeAclUsers([ACL_USERS[idx]])[0], message: 'User updated' };
  },
  deleteUser: async (userId) => {
    const before = ACL_USERS.length;
    ACL_USERS = ACL_USERS.filter((u) => String(u.id) !== String(userId));
    return { success: ACL_USERS.length < before, message: 'User deleted' };
  },
};

/* ---------------- API ---------------- */
const apiAccess = {
  getUsers: async () => {
    const res = await apiRequest({ url: ENDPOINTS.ACCESS_CONTROL.USERS.LIST, method: 'GET' });
    return { success: true, users: normalizeAclUsers(takeList(res)) };
  },
  getRoles: async () => {
    const res = await apiRequest({ url: ENDPOINTS.ACCESS_CONTROL.ROLES.LIST, method: 'GET' });
    return { success: true, roles: normalizeAclRoles(takeList(res) || res?.data || res) };
  },
  createUser: async (payload) => {
    const res = await apiRequest({ url: ENDPOINTS.ACCESS_CONTROL.USERS.CREATE, method: 'POST', data: payload });
    return { success: true, user: normalizeAclUsers([takeItem(res)])[0] };
  },
  inviteUser: async (payload) => {
    const res = await apiRequest({ url: ENDPOINTS.ACCESS_CONTROL.INVITE, method: 'POST', data: payload });
    return { success: true, user: normalizeAclUsers([takeItem(res)])[0] };
  },
  assignRole: async (userId, payload) => {
    const res = await apiRequest({ url: ENDPOINTS.ACCESS_CONTROL.USERS.ASSIGN_ROLE(userId), method: 'POST', data: payload });
    return { success: true, user: normalizeAclUsers([takeItem(res)])[0] };
  },
  updateUser: async (userId, payload) => {
    const res = await apiRequest({ url: ENDPOINTS.ACCESS_CONTROL.USERS.UPDATE(userId), method: 'PUT', data: payload });
    return { success: true, user: normalizeAclUsers([takeItem(res)])[0] };
  },
  deleteUser: async (userId) => {
    await apiRequest({ url: ENDPOINTS.ACCESS_CONTROL.USERS.DELETE(userId), method: 'DELETE' });
    return { success: true };
  },
};

export const accessControlService = USE_DUMMY_DATA ? dummyAccess : apiAccess;