// src/components/debug/AuthDebugger.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { getAuthTokens } from '../../api/apiClient';

const AuthDebugger = () => {
  const authState = useSelector((state) => state.auth);
  const { accessToken, refreshToken } = getAuthTokens();
  const storedUserId = localStorage.getItem('userId');
  const persistedAuthState = localStorage.getItem('authState');

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Auth Debug Info</h4>
      <div>
        <strong>Redux State:</strong>
        <ul>
          <li>Authenticated: {authState.isAuthenticated ? 'Yes' : 'No'}</li>
          <li>User: {authState.user ? authState.user.full_name : 'None'}</li>
          <li>Token: {authState.token ? 'Present' : 'None'}</li>
          <li>Status: {authState.status}</li>
        </ul>
      </div>
      <div>
        <strong>Storage:</strong>
        <ul>
          <li>Access Token: {accessToken ? 'Present' : 'None'}</li>
          <li>Refresh Token: {refreshToken ? 'Present' : 'None'}</li>
          <li>User ID: {storedUserId || 'None'}</li>
          <li>Persisted State: {persistedAuthState ? 'Present' : 'None'}</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthDebugger;
