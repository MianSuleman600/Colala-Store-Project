// src/utils/pushNotifications.js
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getSWRegistration() {
  if (!('serviceWorker' in navigator)) return null;

  // 1) Use existing registration if present
  const existing = await navigator.serviceWorker.getRegistration();
  if (existing) return existing;

  // 2) Wait up to 3s for .ready (in case SW is activating)
  try {
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      wait(3000).then(() => null),
    ]);
    return reg || null;
  } catch {
    return null;
  }
}

export async function isPushSupported() {
  // Note: localhost and 127.0.0.1 are treated as secure by Chrome.
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function getCurrentSubscription() {
  const reg = await getSWRegistration();
  if (!reg) return null;
  try {
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return await Notification.requestPermission();
}

export async function subscribeToPush() {
  if (!(await isPushSupported())) {
    throw new Error('Push not supported on this browser or context.');
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error('VAPID public key is missing. Set VITE_VAPID_PUBLIC_KEY.');
  }

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Notifications permission denied.');
  }

  const reg = await getSWRegistration();
  if (!reg) {
    throw new Error('Service Worker not ready. Please reload and try again.');
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // TODO: send `sub` to your API
  localStorage.setItem('pushSubscription', JSON.stringify(sub)); // temporary
  return sub;
}

export async function unsubscribeFromPush() {
  const existing = await getCurrentSubscription();
  if (existing) {
    await existing.unsubscribe();
    localStorage.removeItem('pushSubscription');
    // TODO: inform your API
    return true;
  }
  return false;
}