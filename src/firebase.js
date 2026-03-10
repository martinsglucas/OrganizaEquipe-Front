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
export const messaging = getMessaging(app);

const isNotificationsApiSupported = () => {
  return (
    typeof window !== "undefined" &&
    typeof Notification !== "undefined" &&
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator
  );
};

export const requestNotificationPermission = async () => {
  try {
    if (!isNotificationsApiSupported()) return null;

    const messagingSupported = await isSupported();
    if (!messagingSupported) return null;

    if (Notification.permission === "denied") return null;

    const permission =
      Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();

    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey:
        "BPmteqr8zn8JEYREj8iG9MX9Pxu-dg32G_w116YMl4g9QkqjpkERtTdEdxmJ2pVQ6jjhkHU1yQe4VXrkpCesLr0",
    });
    return token || null;

  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

export { onMessage };