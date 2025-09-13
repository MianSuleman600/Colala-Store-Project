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

export async function getSWRegistration() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.ready;
  } catch {
    return null;
  }
}

export async function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export async function getCurrentSubscription() {
  const reg = await getSWRegistration();
  if (!reg) return null;
  return reg.pushManager.getSubscription();
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return await Notification.requestPermission();
}

export async function subscribeToPush() {
  if (!(await isPushSupported())) throw new Error('Push not supported.');
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') throw new Error('Notifications permission denied.');

  const reg = await getSWRegistration();
  if (!reg) throw new Error('Service Worker not ready.');

  if (!VAPID_PUBLIC_KEY) {
    console.warn('VITE_VAPID_PUBLIC_KEY is not set. Subscription will be created but your server must match the same key to send pushes.');
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: VAPID_PUBLIC_KEY ? urlBase64ToUint8Array(VAPID_PUBLIC_KEY) : undefined,
  });

  // TODO: send `sub` to your API to store it
  localStorage.setItem('pushSubscription', JSON.stringify(sub)); // temporary
  return sub;
}

export async function unsubscribeFromPush() {
  const existing = await getCurrentSubscription();
  if (existing) {
    await existing.unsubscribe();
    localStorage.removeItem('pushSubscription');
    // TODO: also inform your API to remove subscription
    return true;
  }
  return false;
}