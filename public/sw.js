//D:\Project\frontend\public\sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache manifest
precacheAndRoute(self.__WB_MANIFEST || []);

// 🎯 Background Sync for registration API
const bgSyncPlugin = new BackgroundSyncPlugin('registrationQueue', {
  maxRetentionTime: 24 * 60 // retry up to 24h
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/register'),
  new NetworkFirst({ plugins: [bgSyncPlugin] }),
  'POST'
);