import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBEHSZzFYjUUP-2T_eX9V3Y3Mae3Mz_mFU",
  authDomain: "organizaequipe-notifications.firebaseapp.com",
  projectId: "organizaequipe-notifications",
  storageBucket: "organizaequipe-notifications.firebasestorage.app",
  messagingSenderId: "64916189790",
  appId: "1:64916189790:web:8907561462ade2094cbacf",
  measurementId: "G-VVMDG8GX22",
};

const app = initializeApp(firebaseConfig);
let messagingInstancePromise = null;

export const isNotificationsApiSupported = () => {
  return (
    typeof window !== "undefined" &&
    typeof Notification !== "undefined" &&
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator
  );
};

export const getBrowserNotificationPermission = () => {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
};

export const detectIsIos = () => {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";

  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

export const detectIsStandalone = () => {
  if (typeof window === "undefined") return false;

  const displayModeStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const iosStandalone = typeof navigator !== "undefined" && Boolean(navigator.standalone);

  return Boolean(displayModeStandalone || iosStandalone);
};

export const getPlatformName = () => {
  if (typeof navigator === "undefined") return "unknown";

  if (detectIsIos()) return "ios";

  const userAgent = navigator.userAgent || "";
  if (/Android/i.test(userAgent)) return "android";
  if (/Windows/i.test(userAgent)) return "windows";
  if (/Mac/i.test(userAgent)) return "macos";
  if (/Linux/i.test(userAgent)) return "linux";

  return "unknown";
};

export const getBrowserName = () => {
  if (typeof navigator === "undefined") return "unknown";

  const userAgent = navigator.userAgent || "";

  if (/Edg/i.test(userAgent)) return "edge";
  if (/Chrome|CriOS/i.test(userAgent) && !/Edg/i.test(userAgent)) return "chrome";
  if (/Firefox|FxiOS/i.test(userAgent)) return "firefox";
  if (/Safari/i.test(userAgent) && !/Chrome|CriOS|Edg/i.test(userAgent)) return "safari";

  return "unknown";
};

export const getDeviceLabel = () => {
  const browser = getBrowserName();
  const platform = getPlatformName();
  return `${browser} on ${platform}`;
};

export const isMessagingSupported = async () => {
  if (!isNotificationsApiSupported()) return false;

  try {
    return await isSupported();
  } catch {
    return false;
  }
};

export const getMessagingInstance = async () => {
  const supported = await isMessagingSupported();
  if (!supported) return null;

  if (!messagingInstancePromise) {
    messagingInstancePromise = Promise.resolve(getMessaging(app));
  }

  return messagingInstancePromise;
};

export const registerMessagingServiceWorker = async () => {
  if (!isNotificationsApiSupported()) return null;
  return navigator.serviceWorker.register("/firebase-messaging-sw.js");
};

export const requestBrowserNotificationPermission = async () => {
  if (!isNotificationsApiSupported()) return "unsupported";
  return Notification.requestPermission();
};

export const getFcmToken = async (serviceWorkerRegistration) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  const token = await getToken(messaging, {
    vapidKey:
      "BPmteqr8zn8JEYREj8iG9MX9Pxu-dg32G_w116YMl4g9QkqjpkERtTdEdxmJ2pVQ6jjhkHU1yQe4VXrkpCesLr0",
    serviceWorkerRegistration,
  });

  return token || null;
};

export const subscribeToForegroundMessages = async (handler) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, handler);
};
