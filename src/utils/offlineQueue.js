// src/utils/offlineQueue.js
import { addToOutbox } from './indexedDB';

export async function enqueueFormSubmission(url, payload, { method = 'POST', headers = {} } = {}) {
  await addToOutbox({ url, method, headers, payload });

  // Register background sync
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register('form-sync');
      return { queued: true };
    } catch {
      // Fallback: do nothing, SW will try when it can
      return { queued: true };
    }
  }
  return { queued: true };
}

// Try immediate submit and transparently fallback to queue if offline
export async function submitWithOfflineSupport(url, payload, { method = 'POST', headers = {} } = {}) {
  if (navigator.onLine) {
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { queued: false, response: await res.json().catch(() => ({})) };
    } catch {
      // Network failed while "online" — queue it
    }
  }
  const q = await enqueueFormSubmission(url, payload, { method, headers });
  return { queued: true, response: null };
}