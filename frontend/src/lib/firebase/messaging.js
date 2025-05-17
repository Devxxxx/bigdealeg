import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { firebaseConfig } from './config';

// Initialize Firebase only in browser environment
let messaging = null;
let app = null;

// Initialize Firebase asynchronously
export const initFirebase = async () => {
  try {
    if (typeof window !== 'undefined') {
      // Check if browser supports Firebase Messaging
      const isMessagingSupported = await isSupported();
      
      if (!isMessagingSupported) {
        console.log('Firebase Messaging is not supported in this browser');
        return false;
      }
      
      // Initialize Firebase app
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      const initialized = await initFirebase();
      if (!initialized) return null;
    }
    
    // Request permission from browser
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }
    }
    
    // Get FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: "BJbRlVX8z4Z9uL4vcE1p2Bw78zo_0DqpTUhgRRljS_2vvJuhwR5NZ2htVNmeAYuK6rUqVnjK2VcJKaDMqFgG6VY"
    });
    
    if (currentToken) {
      console.log('FCM token obtained');
      return currentToken;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Handle foreground messages
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.error('Firebase messaging not initialized');
    return () => {};
  }
  
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

// Save FCM token to backend
export const saveFCMToken = async (token, accessToken) => {
  try {
    if (!token || !accessToken) return false;
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    const response = await fetch(`${API_URL}/notifications/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        device_type: 'web'
      }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to save FCM token');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return false;
  }
};
