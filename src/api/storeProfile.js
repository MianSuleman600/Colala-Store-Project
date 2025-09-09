// src/api/storeProfile.js
import { MOCK_STORE_PROFILES_DB, saveDbToLocalStorage } from '../utils/db';

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStoreProfile = async (userId = 'default_user_id') => {
  await delay(300); // simulate API delay
  return MOCK_STORE_PROFILES_DB[userId];
};

export const updateStoreProfile = async (userId = 'default_user_id', payload) => {
  await delay(300);
  const updated = { ...MOCK_STORE_PROFILES_DB[userId], ...payload };
  MOCK_STORE_PROFILES_DB[userId] = updated;
  saveDbToLocalStorage(MOCK_STORE_PROFILES_DB);
  return updated;
};
