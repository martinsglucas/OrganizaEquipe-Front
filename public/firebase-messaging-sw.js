importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBEHSZzFYjUUP-2T_eX9V3Y3Mae3Mz_mFU",
  authDomain: "organizaequipe-notifications.firebaseapp.com",
  projectId: "organizaequipe-notifications",
  storageBucket: "organizaequipe-notifications.firebasestorage.app",
  messagingSenderId: "64916189790",
  appId: "1:64916189790:web:8907561462ade2094cbacf",
  measurementId: "G-VVMDG8GX22",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.data || {};

  if (!title || !body) return;

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
  });
});
