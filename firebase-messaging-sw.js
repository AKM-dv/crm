// Firebase Cloud Messaging Service Worker
// This file must be in the public folder to be accessible

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyChRGHgRGBr2YJEHsMK2HlbuwErO36McRk",
  authDomain: "neighshop-global-crm.firebaseapp.com",
  projectId: "neighshop-global-crm",
  storageBucket: "neighshop-global-crm.firebasestorage.app",
  messagingSenderId: "714821751914",
  appId: "1:714821751914:web:f01ab6fabc1019c91b6613",
  measurementId: "G-MR1KLD75GB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.data?.type || 'fcm-notification',
    requireInteraction: payload.data?.notification_type === 'urgent',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Handle click action based on notification data
  if (event.notification.data) {
    const data = event.notification.data;
    
    // Open relevant page based on notification type
    let url = '/dashboard';
    if (data.type === 'lead_assigned' && data.lead_id) {
      url = `/leads/${data.lead_id}`;
    } else if (data.type === 'task_assigned' && data.task_id) {
      url = '/tasks';
    } else if (data.type === 'admin_notification') {
      url = '/dashboard';
    }
    
    event.waitUntil(
      clients.openWindow(url)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});





