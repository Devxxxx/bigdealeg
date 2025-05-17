'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import settingsApi from '@/lib/api/settings';

/**
 * A hook to manage user settings
 */
export function useSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, session } = useAuth();
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    request_updates: true,
    viewing_reminders: true,
    marketing_emails: false
  });

  // Session data
  const [sessionData, setSessionData] = useState(null);

  // Fetch user settings
  const fetchSettings = async () => {
    if (!user || !session?.access_token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await settingsApi.getUserSettings(session.access_token);
      
      setProfile({
        name: data.profile.name || '',
        email: data.profile.email || '',
        phone: data.profile.phone || ''
      });
      
      setNotifications({
        email_notifications: data.settings.email_notifications ?? true,
        sms_notifications: data.settings.sms_notifications ?? true,
        push_notifications: data.settings.push_notifications ?? true,
        request_updates: data.settings.request_updates ?? true,
        viewing_reminders: data.settings.viewing_reminders ?? true,
        marketing_emails: data.settings.marketing_emails ?? false
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user sessions
  const fetchSessions = async () => {
    if (!user || !session?.access_token) {
      return;
    }

    try {
      const data = await settingsApi.getUserSessions(session.access_token);
      setSessionData(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      // Don't set error here to not block the UI
    }
  };

  // Update profile
  const updateProfile = async () => {
    if (!user || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedProfile = await settingsApi.updateUserProfile(session.access_token, profile);
      
      setProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Update notification settings
  const updateNotifications = async () => {
    if (!user || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedSettings = await settingsApi.updateNotificationSettings(session.access_token, notifications);
      
      setNotifications(prev => ({
        ...prev,
        ...updatedSettings
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating notifications:', err);
      throw err;
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    if (!user || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await settingsApi.updatePassword(session.access_token, passwordData);
      return result;
    } catch (err) {
      console.error('Error updating password:', err);
      throw err;
    }
  };

  // Export user data
  const exportData = async () => {
    if (!user || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    try {
      const data = await settingsApi.exportUserData(session.access_token);
      return data;
    } catch (err) {
      console.error('Error exporting user data:', err);
      throw err;
    }
  };

  // Delete user account
  const deleteAccount = async (confirmation) => {
    if (!user || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await settingsApi.deleteUserAccount(session.access_token, confirmation);
      return result;
    } catch (err) {
      console.error('Error deleting account:', err);
      throw err;
    }
  };

  // Terminate session
  const terminateSession = async (sessionId) => {
    if (!user || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    try {
      await settingsApi.terminateSession(session.access_token, sessionId);
      
      // Update sessions list
      setSessionData(prev => ({
        ...prev,
        otherSessions: prev.otherSessions.filter(s => s.id !== sessionId)
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Error terminating session:', err);
      throw err;
    }
  };

  // Terminate all sessions
  const terminateAllSessions = async () => {
    if (!user || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    try {
      await settingsApi.terminateAllSessions(session.access_token);
      
      // Update sessions list
      setSessionData(prev => ({
        ...prev,
        otherSessions: []
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Error terminating all sessions:', err);
      throw err;
    }
  };

  // Fetch settings when user changes
  useEffect(() => {
    fetchSettings();
    fetchSessions();
  }, [user, session?.access_token]);

  return {
    loading,
    error,
    profile,
    setProfile,
    notifications,
    setNotifications,
    sessionData,
    updateProfile,
    updateNotifications,
    updatePassword,
    exportData,
    deleteAccount,
    terminateSession,
    terminateAllSessions,
    refreshSettings: fetchSettings,
    refreshSessions: fetchSessions
  };
}