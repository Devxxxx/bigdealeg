'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { initFirebase, requestNotificationPermission, saveFCMToken, onForegroundMessage } from '@/lib/firebase/messaging';

// Create context
const NotificationContext = createContext(null);

// Custom hook for using the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, session } = useAuth();
  const { notifications: notificationSettings } = useSettings();
  const [newNotification, setNewNotification] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  
  // Initialize Firebase and request notification permission
  useEffect(() => {
    const setup = async () => {
      // Only proceed if user is logged in and settings loaded
      if (!user || !session?.access_token || !notificationSettings) return;
      
      // Check if push notifications are enabled in user settings
      const pushNotificationsEnabled = notificationSettings.push_notifications !== false;
      
      if (pushNotificationsEnabled) {
        // Initialize Firebase
        const firebaseInitialized = await initFirebase();
        setInitialized(firebaseInitialized);
        
        if (firebaseInitialized) {
          // Request notification permission and get token
          const token = await requestNotificationPermission();
          
          if (token) {
            // Save token to backend
            const saved = await saveFCMToken(token, session.access_token);
            setPushEnabled(saved);
          }
        }
      }
    };
    
    setup();
  }, [user, session?.access_token, notificationSettings]);
  
  // Handle foreground messages
  useEffect(() => {
    if (!initialized) return;
    
    console.log('Setting up foreground message handler');
    
    const unsubscribe = onForegroundMessage((payload) => {
      console.log('Foreground message received:', payload);
      
      // Show notification if app is not focused
      if (document.visibilityState !== 'visible') {
        // Check if browser notifications are supported and permitted
        if (Notification.permission === 'granted') {
          const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/logo.png'
          });
          
          // Handle notification click
          notification.onclick = (event) => {
            event.preventDefault();
            window.focus();
            notification.close();
            
            // Navigate to relevant page based on notification type
            // This would need to be implemented based on your routing
          };
        }
      }
      
      // Set the new notification for the UI to display
      setNewNotification({
        id: payload.data?.id || Date.now().toString(),
        title: payload.notification.title,
        message: payload.notification.body,
        type: payload.data?.type || 'system',
        related_entity_id: payload.data?.entityId,
        related_entity_type: payload.data?.entityType,
        link: payload.data?.link,
        is_read: false,
        created_at: new Date().toISOString()
      });
      
      // Play notification sound if available
      const notificationSound = document.getElementById('notification-sound');
      if (notificationSound) {
        notificationSound.play().catch(err => console.log('Error playing notification sound:', err));
      }
    });
    
    // Cleanup
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initialized]);
  
  // Enable or disable push notifications
  const togglePushNotifications = async (enabled) => {
    if (enabled) {
      // Initialize Firebase if not already
      if (!initialized) {
        const firebaseInitialized = await initFirebase();
        setInitialized(firebaseInitialized);
        
        if (!firebaseInitialized) {
          return false;
        }
      }
      
      // Request permission and get token
      const token = await requestNotificationPermission();
      
      if (token && session?.access_token) {
        // Save token to backend
        const saved = await saveFCMToken(token, session.access_token);
        setPushEnabled(saved);
        return saved;
      }
      
      return false;
    } else {
      // This would ideally call an API to remove the token
      // For now, just update the state
      setPushEnabled(false);
      return true;
    }
  };
  
  // Context value
  const value = {
    pushEnabled,
    newNotification,
    togglePushNotifications
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {/* Add notification sound */}
      <audio id="notification-sound" preload="auto">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
      </audio>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
