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

// Service Worker registration removed - using auto-generated SW from VitePWA

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
          <OfflineInitializer>
            <App />
          </OfflineInitializer>
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);