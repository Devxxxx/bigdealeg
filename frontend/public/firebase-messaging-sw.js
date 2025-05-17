// Firebase messaging service worker for handling background notifications
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyC1ViY0Z7duX8pjn9gOA4TkXoi7W9BYSro",
  authDomain: "bigdealegypt-1241b.firebaseapp.com",
  projectId: "bigdealegypt-1241b",
  storageBucket: "bigdealegypt-1241b.firebasestorage.app",
  messagingSenderId: "148632026753",
  appId: "1:148632026753:web:90e578add3ea695b919780"
});

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  // Get notification data
  const notificationTitle = payload.notification.title || 'BigDealEgy Notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/logo.png',
    badge: '/badge.png',
    tag: payload.data?.id || 'default',
    data: payload.data || {}
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  // Close notification
  event.notification.close();
  
  // Get data from notification
  const notificationData = event.notification.data;
  
  // Construct URL to open based on notification type
  let url = '/dashboard/notifications';
  
  if (notificationData) {
    const entityType = notificationData.entityType;
    const entityId = notificationData.entityId;
    
    if (entityType === 'property' && entityId) {
      url = `/properties/${entityId}`;
    } else if (entityType === 'viewing' && entityId) {
      url = `/dashboard/scheduled-viewings/${entityId}`;
    } else if (entityType === 'request' && entityId) {
      url = `/dashboard/property-requests/${entityId}`;
    } else if (notificationData.link) {
      url = notificationData.link;
    }
  }
  
  // Open URL
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there is already a window open with the URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
