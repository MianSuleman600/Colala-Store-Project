import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Login from '../../features/auth/pages/Login';
import Register from '../../features/auth/pages/Register';

function AuthModal({ mode, onClose, onSwitchMode }) {
  // SSR-safe mount guard
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mode) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const previouslyFocused = document.activeElement;
    const focusFirst = () => {
      const container = containerRef.current;
      if (!container) return;
      const focusables = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length) {
        focusables[0].focus();
      } else {
        container.focus();
      }
    };

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
      if (e.key === 'Tab') {
        const container = containerRef.current;
        if (!container) return;
        const focusables = container.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Focus after mount
    const raf = requestAnimationFrame(focusFirst);
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [mode, onClose]);

  if (!mounted || !mode) return null;

  const content = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      data-testid="auth-modal"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Center wrapper (focusable) */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl mx-4 outline-none"
        tabIndex={-1}
      >
        {mode === 'login' ? (
          <Login
            onClose={onClose}
            onSwitchToRegister={() => onSwitchMode?.('register')}
          />
        ) : (
          <Register
            onClose={onClose}
            onSwitchToLogin={() => onSwitchMode?.('login')}
          />
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export default AuthModal;