// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const {
  VITE_APP_VAPID_KEY,
  VITE_APP_API_KEY,
  VITE_APP_AUTH_DOMAIN,
  VITE_APP_PROJECT_ID,
  VITE_APP_STORAGE_BUCKET,
  VITE_APP_MESSAGING_SENDER_ID,
  VITE_APP_APP_ID,
  VITE_APP_MEASUREMENT_ID,
} = import.meta.env;
const firebaseConfig = {
  apiKey: VITE_APP_API_KEY,
  authDomain: VITE_APP_AUTH_DOMAIN,
  projectId: VITE_APP_PROJECT_ID,
  storageBucket: VITE_APP_STORAGE_BUCKET,
  messagingSenderId: VITE_APP_MESSAGING_SENDER_ID,
  appId: VITE_APP_APP_ID,
  measurementId: VITE_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
const messaging = getMessaging(app);
export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log('Notification permission:', permission);
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: VITE_APP_VAPID_KEY,
    });
    console.log('FCM Token:', token);
    return token;
  }
  return null;
};

// Function to listen for incoming messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('payload', payload);
      resolve(payload);
    });
  });
