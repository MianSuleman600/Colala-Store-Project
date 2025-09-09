// src/utils/indexedDB.js
import { openDB, deleteDB } from 'idb';

const DB_NAME = 'PWAStoreDB';
const STORE_NAME = 'registration';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveToIndexedDB(formData) {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, formData, 'registrationForm');
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
  }
}

export async function loadFromIndexedDB() {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      await deleteDB(DB_NAME);
      return null;
    }
    const data = await db.get(STORE_NAME, 'registrationForm');
    return data || null;
  } catch (error) {
    console.error('Error reading from IndexedDB:', error);
    return null;
  }
}