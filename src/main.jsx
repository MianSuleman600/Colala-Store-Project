// src/main.jsx (only SWManager changed)
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider, useToast } from './components/ui/ToastProvider.jsx';
import { loadFormData } from './features/auth/registrationSlice.js';
import { loadFromIndexedDB } from './utils/indexedDB.js';
import { restoreAuthState } from './redux/authMiddleware.js';

const SWManager = () => {
  const { push } = useToast();

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const isDev = import.meta.env.DEV;
        const swUrl = isDev ? '/dev-sw.js?dev-sw' : '/sw.js';
        const reg = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
          ...(isDev ? { type: 'module' } : {}), // important: dev SW must be module
        });

        // Show toasts similar to virtual:pwa-register behavior
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Updated SW installed, page controlled by old SW
                push?.('A new version is available. Refresh to update.', { type: 'info', duration: 5000 });
              } else {
                // First install: offline ready
                push?.('App is ready to work offline.', { type: 'success' });
              }
            }
          });
        });

        if (isDev) {
          // Optional: quiet message on successful dev registration
          console.info('[PWA] Dev SW registered as module.');
        }
      } catch (err) {
        console.error('SW registration failed:', err);
      }
    };

    register();
  }, [push]);

  return null;
};

// Initialize offline data and auth state
const OfflineInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { push } = useToast();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First, try to restore authentication state
        const authRestored = restoreAuthState(store);
        if (authRestored) {
          console.log('Authentication state restored from localStorage');
        }

        // Then load offline registration data
        const storedData = await loadFromIndexedDB();
        if (storedData) {
          dispatch(loadFormData(storedData));
          push('Recovered your saved form progress.', { type: 'success' });
        }
      } catch (error) {
        console.error('Error loading offline registration data:', error);
        push('Could not load saved data. You can continue.', { type: 'error' });
      }
    };
    
    initializeApp();
  }, [dispatch, push]);

  return children;
};

// Bootstrap unchanged…
const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <SWManager />
          <OfflineInitializer>
            <App />
          </OfflineInitializer>
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);