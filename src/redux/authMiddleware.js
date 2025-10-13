// src/redux/authMiddleware.js
import { getAuthTokens } from '../api/apiClient';

// Middleware to handle authentication state persistence
export const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle authentication state changes
  if (action.type === 'auth/loginSuccess') {
    // Store authentication state in localStorage for persistence
    const state = store.getState();
    const authState = state.auth;
    
    if (authState.isAuthenticated && authState.token) {
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        token: authState.token,
        status: authState.status
      }));
      console.log('Auth state persisted to localStorage');
    }
  } else if (action.type === 'auth/logout') {
    // Clear persisted auth state
    localStorage.removeItem('authState');
    console.log('Auth state cleared from localStorage');
  }
  
  return result;
};

// Function to restore authentication state from localStorage
export const restoreAuthState = (store) => {
  try {
    const persistedState = localStorage.getItem('authState');
    if (persistedState) {
      const authState = JSON.parse(persistedState);
      console.log('Restoring auth state from localStorage:', authState);
      
      // Verify that tokens still exist
      const { accessToken } = getAuthTokens();
      if (accessToken && authState.token === accessToken) {
        // Dispatch the login success action to restore the state
        store.dispatch({
          type: 'auth/loginSuccess',
          payload: {
            user: authState.user,
            token: authState.token
          }
        });
        return true;
      } else {
        // Tokens don't match, clear the persisted state
        localStorage.removeItem('authState');
        console.log('Token mismatch, cleared persisted auth state');
      }
    }
  } catch (error) {
    console.error('Error restoring auth state:', error);
    localStorage.removeItem('authState');
  }
  
  return false;
};
