//D:\Project\frontend\src\sw.js
/* eslint-disable no-restricted-globals */
/* Service Worker - Colala */

// Workbox imports (bundled by vite-plugin-pwa in injectManifest mode)
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Immediately activate updated SW
self.skipWaiting();
clientsClaim();

// Precache (injected at build time)
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// Runtime caching: static assets
registerRoute(
  ({ request }) => ['style', 'script', 'image', 'font'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    matchOptions: { ignoreVary: true },
  })
);

// Runtime caching: API GET
registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api') && request.method === 'GET',
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
  }),
  'GET'
);

// Background Sync for API writes (no API needed to compile)
const apiBgSync = new BackgroundSyncPlugin('api-queue', {
  maxRetentionTime: 24 * 60, // minutes
});

// Queue POST/PUT/PATCH/DELETE to /api when offline
const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
for (const method of writeMethods) {
  registerRoute(
    ({ url, request }) => url.pathname.startsWith('/api') && request.method === method,
    new NetworkOnly({ plugins: [apiBgSync] }),
    method
  );
}

// Optional: SPA navigation fallback if needed
setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    return caches.match('/index.html');
  }
  return Response.error();
});

// ----- Push Notifications (Web Push or FCM forwarded payload) -----
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? (event.data.json ? event.data.json() : { body: event.data.text() }) : {};
  } catch {
    payload = { body: event.data?.text?.() || '' };
  }

  const title = payload.title || 'Colala';
  const options = {
    body: payload.body || 'You have a new notification.',
    icon: payload.icon || '/web-app-manifest-192x192.png',
    badge: payload.badge || '/web-app-manifest-192x192.png',
    data: payload.data || {},
    actions: payload.actions || [],
    vibrate: payload.vibrate || [100, 50, 100],
    tag: payload.tag || 'colala-general',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl =
    event.notification?.data?.url ||
    (event.action && event.notification?.data?.actions?.find?.((a) => a.action === event.action)?.url) ||
    '/';

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      const alreadyOpen = allClients.find((c) => c.url.includes(targetUrl));
      if (alreadyOpen) {
        alreadyOpen.focus();
      } else {
        await clients.openWindow(targetUrl);
      }
    })()
  );
});

// Support app-driven SW updates via postMessage
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ----- Background Sync for App-managed Outbox (forms) -----
const DB_NAME = 'colala-db';
const DB_VERSION = 1;
const OUTBOX_STORE = 'outbox';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(OUTBOX_STORE)) {
        db.createObjectStore(OUTBOX_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllOutbox() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, 'readonly');
    const store = tx.objectStore(OUTBOX_STORE);
    const items = [];
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      } else {
        resolve(items);
      }
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });
}

async function removeOutbox(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, 'readwrite');
    tx.objectStore(OUTBOX_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'form-sync') {
    event.waitUntil(
      (async () => {
        const items = await getAllOutbox();
        for (const item of items) {
          try {
            await fetch(item.url, {
              method: item.method || 'POST',
              headers: { 'Content-Type': 'application/json', ...(item.headers || {}) },
              body: JSON.stringify(item.payload || {}),
            });
            await removeOutbox(item.id);
          } catch (err) {
            // keep in outbox for next sync
          }
        }
      })()
    );
  }
});