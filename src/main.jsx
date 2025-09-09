// src/main.jsx
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

// Register SW inside a component so we can show toasts
const SWManager = () => {
  const { push } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      import('virtual:pwa-register')
        .then(({ registerSW }) => {
          registerSW({
            onNeedRefresh() {
              push('A new version is available. Refresh to update.', { type: 'info', duration: 5000 });
            },
            onOfflineReady() {
              push('App is ready to work offline.', { type: 'success' });
            },
          });
        })
        .catch((err) => {
          console.error('SW registration failed:', err);
        });
    }
  }, [push]);

  return null;
};

// Initialize offline data
const OfflineInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { push } = useToast();

  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        const storedData = await loadFromIndexedDB();
        if (storedData) {
          dispatch(loadFormData(storedData));
          push('Recovered your saved form progress.', { type: 'success' });
        } else {
          // Not an error — just no data
          console.info('No saved registration data found in IndexedDB.');
        }
      } catch (error) {
        console.error('Error loading offline registration data:', error);
        push('Could not load saved data. You can continue.', { type: 'error' });
        // Optional: fallback to localStorage if you still use it
        try {
          const backup = localStorage.getItem('registrationForm');
          if (backup) {
            dispatch(loadFormData(JSON.parse(backup)));
            push('Recovered backup form data from localStorage.', { type: 'success' });
          }
        } catch {
          // swallow
        }
      }
    };
    loadOfflineData();
  }, [dispatch, push]);

  return children;
};

// Bootstrap
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