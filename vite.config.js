import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // ✅ PWA configuration (optimized for OneSignal + offline)
    VitePWA({
      registerType: 'autoUpdate', // Updates service worker automatically
      injectRegister: 'auto',     // Automatically injects SW registration
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg',
        'assets/fonts/Manrope/Manrope-VariableFont_wght.ttf',
        'assets/fonts/OleoScript/OleoScript-Regular.ttf',
        'assets/images/logo.png',
        'assets/images/login-banner.png',
        'assets/images/login2.png'
      ],
      manifest: {
        name: 'Colala Store',
        short_name: 'Colala',
        description: 'A modern e-commerce platform',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ec1616',
        background_color: '#3d1c1c',
        orientation: 'portrait',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      // ✅ Service Worker caching strategies
      workbox: {
        runtimeCaching: [
          {
            // 📌 Cache static files (CSS, JS, images) — Cache First
            urlPattern: ({ request }) =>
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // 📌 Cache API calls — Network First
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          }
        ]
      },

      // ✅ Dev mode support for testing on localhost
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ]
});
