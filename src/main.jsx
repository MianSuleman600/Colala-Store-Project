// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import "./index.css";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

console.log("main.jsx script loaded.");

// ✅ PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  console.log("Browser supports Service Workers. Attempting to register now...");
  try {
    const swRegistration = registerSW();
    swRegistration();
    console.log("PWA service worker registration function called.");
  } catch (error) {
    console.error("An error occurred during service worker registration attempt:", error);
  }
} else {
  console.log("Browser does NOT support Service Workers.");
}

console.log("React app is about to render.");

// ✅ Render React App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

console.log("React app rendering has been initiated.");
