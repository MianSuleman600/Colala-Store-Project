// src/components/common/NotificationPermissionPrompt.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import {
  isPushSupported,
  getCurrentSubscription,
  subscribeToPush,
} from '../../utils/pushNotifications';
import { useToast } from '../ui/ToastProvider';

const DISMISS_KEY = 'pushPromptDismissed';
const withTimeout = (p, ms) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

export default function NotificationPermissionPrompt({
  delayMs = 10000,
  brandColor = '#EF4444',
  debugForceShow = false,  // set true in dev to confirm the UI shows
  debugLog = true,         // log reasons in console
}) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const { push } = useToast();

  useEffect(() => {
    let cancelled = false;

    const log = (...args) => debugLog && console.info('[NPP]', ...args);

    const showIfEligible = async () => {
      try {
        if (debugForceShow) {
          log('debugForceShow=true -> showing UI regardless of checks');
          if (!cancelled) setVisible(true);
          return;
        }

        if (localStorage.getItem(DISMISS_KEY) === '1') {
          log('Not showing: dismissed previously');
          return;
        }

        const supported = await isPushSupported();
        log('isPushSupported:', supported);
        if (!supported) {
          log('Not showing: push not supported or insecure context');
          return;
        }

        const perm = typeof Notification !== 'undefined' ? Notification.permission : 'denied';
        log('Notification.permission:', perm);

        if (perm === 'granted') {
          // Auto-subscribe if possible, no UI
          try {
            const sub = await withTimeout(getCurrentSubscription(), 1500).catch(() => null);
            if (!sub) {
              await subscribeToPush();
              push?.('Notifications enabled.', { type: 'success' });
              log('Auto-subscribed after granted permission.');
            } else {
              log('Already subscribed.');
            }
          } catch (e) {
            log('Auto-subscribe failed:', e?.message || e);
          }
          return;
        }

        if (perm === 'denied') {
          log('Not showing: permission denied');
          return;
        }

        // perm === 'default'
        let hasSub = false;
        try {
          const sub = await withTimeout(getCurrentSubscription(), 1500);
          hasSub = !!sub;
        } catch {
          hasSub = false; // if SW not ready, assume not subscribed
        }

        if (hasSub) {
          log('Not showing: already subscribed');
          return;
        }

        if (!cancelled) {
          setVisible(true);
          log('Showing prompt.');
        }
      } catch (err) {
        console.warn('[NPP] showIfEligible error:', err);
      }
    };

    // Start the 10s timer immediately
    timerRef.current = setTimeout(showIfEligible, delayMs);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delayMs, push, debugForceShow, debugLog]);

  const handleEnable = async () => {
    setLoading(true);
    try {
      await subscribeToPush();
      push?.('Notifications enabled.', { type: 'success' });
      setVisible(false);
    } catch (e) {
      const msg = e?.message || 'Unable to enable notifications.';
      // Only mark dismissed on explicit permission denial
      if (/permission/i.test(msg)) {
        localStorage.setItem(DISMISS_KEY, '1');
      }
      push?.(msg, { type: /permission/i.test(msg) ? 'info' : 'error' });
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNoThanks = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="w-[320px] rounded-xl border shadow-lg bg-white text-gray-800 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Bell size={20} style={{ color: brandColor }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Enable notifications?</div>
            <p className="text-sm text-gray-600 mt-1">
              Get order updates and messages even when you’re not on the site.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleEnable}
                disabled={loading}
                className="px-3 py-1.5 rounded-md text-white disabled:opacity-60"
                style={{ backgroundColor: brandColor }}
              >
                {loading ? 'Please wait…' : 'Allow'}
              </button>
              <button onClick={handleNoThanks} className="px-3 py-1.5 rounded-md border">
                No, thanks
              </button>
            </div>
          </div>
          <button
            onClick={handleNoThanks}
            className="p-1 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}