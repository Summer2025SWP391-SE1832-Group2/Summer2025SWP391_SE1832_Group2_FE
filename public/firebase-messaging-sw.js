// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyA5z9BYjZC0pnb6_Mdu2Pk1zan8WDXGe9A',
  authDomain: 'fcm-demo-b96ab.firebaseapp.com',
  projectId: 'fcm-demo-b96ab',
  storageBucket: 'fcm-demo-b96ab.firebasestorage.app',
  messagingSenderId: '45921398221',
  appId: '1:45921398221:web:49d1a60c4bbc70dce92884',
  measurementId: 'G-N8LB99DMCQ',
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
