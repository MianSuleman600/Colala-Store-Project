// src/utils/data/dummyAccessControl.js
export const DUMMY_ACL_USERS = [
  { id: 1, email: 'sasha@store.com', role: 'Admin', avatar: 'https://placehold.co/80x80/D81D5C/FFFFFF?text=SS', createdAt: '2025-07-12T10:00:00Z' },
  { id: 2, email: 'vee@store.com', role: 'Manager', avatar: 'https://placehold.co/80x80/6B7280/FFFFFF?text=VS', createdAt: '2025-07-13T12:15:00Z' },
  { id: 3, email: 'dan@store.com', role: 'Viewer', avatar: 'https://placehold.co/80x80/1F2937/FFFFFF?text=DS', createdAt: '2025-07-14T09:30:00Z' },
];

export const DUMMY_ACL_ROLES = [
  { name: 'Admin', features: ['Manage Users', 'Manage Products', 'View Analytics', 'Billing'] },
  { name: 'Manager', features: ['Manage Products', 'View Analytics'] },
  { name: 'Viewer', features: ['View Analytics'] },
];