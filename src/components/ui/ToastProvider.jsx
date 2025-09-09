import React, { createContext, useContext, useState, useCallback } from 'react';

// Create Context
const ToastContext = createContext(null);

// Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback(
    (message, { type = 'info', duration = 3500 } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const toast = { id, message, type };
      setToasts((s) => [toast, ...s]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          setToasts((s) => s.filter((x) => x.id !== id));
        }, duration);
      }
      return id;
    },
    []
  );

  const remove = useCallback((id) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`relative max-w-sm px-4 py-2 rounded shadow-md text-sm flex items-center justify-between
              ${
                t.type === 'error'
                  ? 'bg-red-600 text-white'
                  : t.type === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-white'
              }`}
          >
            <span>{t.message}</span>
            <button
              aria-label="Dismiss"
              onClick={() => remove(t.id)}
              className="ml-2 text-xs opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx; // gives you { push, remove }
};