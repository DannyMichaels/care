import { getVapidPublicKey, createWebPushSubscription } from '@care/shared';

export const isPushSupported = () => {
  return 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window;
};

export const getPermissionState = () => {
  return Notification.permission;
};

export const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register('/sw.js');
  return registration;
};

export const subscribeToPush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error(`Notification permission ${permission}`);
  }

  const registration = await navigator.serviceWorker.ready;
  const vapidPublicKey = await getVapidPublicKey();
  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  const result = await createWebPushSubscription(subscription);
  return result;
};

export const unsubscribeFromPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
