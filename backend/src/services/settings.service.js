const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class SettingsService {
  /**
   * Get user profile and settings
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User profile and settings
   */
  async getUserSettings(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new AppError(`Failed to fetch user profile: ${profileError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get notification settings
      const { data: notificationSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If settings don't exist, return default settings
      const settings = notificationSettings || {
        email_notifications: true,
        sms_notifications: true,
        request_updates: true,
        viewing_reminders: true,
        marketing_emails: false
      };

      return {
        profile,
        settings
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in getUserSettings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated profile
   */
  async updateUserProfile(userId, profileData) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Validate profile data
      if (!profileData.name) {
        throw new AppError('Name is required', StatusCodes.BAD_REQUEST);
      }

      // Update profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone || null
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to update profile: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in updateUserProfile: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update notification settings
   * @param {string} userId - User ID
   * @param {Object} notificationData - Notification settings to update
   * @returns {Promise<Object>} - Updated notification settings
   */
  async updateNotificationSettings(userId, notificationData) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Check if settings record exists
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      // Prepare notification data
      const settings = {
        email_notifications: notificationData.email_notifications !== undefined ? notificationData.email_notifications : true,
        sms_notifications: notificationData.sms_notifications !== undefined ? notificationData.sms_notifications : true,
        request_updates: notificationData.request_updates !== undefined ? notificationData.request_updates : true,
        viewing_reminders: notificationData.viewing_reminders !== undefined ? notificationData.viewing_reminders : true,
        marketing_emails: notificationData.marketing_emails !== undefined ? notificationData.marketing_emails : false
      };

      let result;

      // If settings exist, update them
      if (existingSettings) {
        const { data, error } = await supabase
          .from('user_settings')
          .update(settings)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          throw new AppError(`Failed to update notification settings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        result = data;
      } 
      // If settings don't exist, create them
      else {
        const { data, error } = await supabase
          .from('user_settings')
          .insert([{ user_id: userId, ...settings }])
          .select()
          .single();

        if (error) {
          throw new AppError(`Failed to create notification settings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        result = data;
      }

      return result;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in updateNotificationSettings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {Object} passwordData - Password data
   * @returns {Promise<Object>} - Success message
   */
  async updatePassword(userId, passwordData) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!passwordData.newPassword) {
        throw new AppError('New password is required', StatusCodes.BAD_REQUEST);
      }

      // Validate password strength (should be done on frontend too)
      if (!this.isStrongPassword(passwordData.newPassword)) {
        throw new AppError('Password is too weak. It should contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.', StatusCodes.BAD_REQUEST);
      }

      // Update password
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: passwordData.newPassword }
      );

      if (error) {
        throw new AppError(`Failed to update password: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in updatePassword: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Export user data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User data export
   */
  async exportUserData(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new AppError(`Failed to fetch user profile: ${profileError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get user property requests
      const { data: requests, error: requestsError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('user_id', userId);

      if (requestsError) {
        throw new AppError(`Failed to fetch property requests: ${requestsError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get scheduled viewings
      const { data: viewings, error: viewingsError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('user_id', userId);

      if (viewingsError) {
        throw new AppError(`Failed to fetch scheduled viewings: ${viewingsError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get user settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Create the export data object
      const exportData = {
        profile: profile || {},
        propertyRequests: requests || [],
        scheduledViewings: viewings || [],
        settings: settings || {}
      };

      return exportData;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in exportUserData: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteUserAccount(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Delete user from Supabase Auth
      // NOTE: This will cascade delete all related data if your RLS policies are set up correctly
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        throw new AppError(`Failed to delete user account: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { message: 'User account deleted successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in deleteUserAccount: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user sessions
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User sessions
   */
  async getUserSessions(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // In a real implementation, you would fetch actual session data from Supabase
      // For now, we'll return mock data
      const mockSessions = {
        currentSession: {
          id: 'current-session',
          device: 'Current Browser',
          location: 'Cairo, Egypt',
          lastActive: 'Now',
          ip: '192.168.1.1'
        },
        otherSessions: [
          {
            id: 'session-1',
            device: 'iPhone 13',
            location: 'Alexandria, Egypt',
            lastActive: '2 days ago',
            ip: '192.168.1.2'
          },
          {
            id: 'session-2',
            device: 'Chrome on Windows',
            location: 'Cairo, Egypt',
            lastActive: '1 week ago',
            ip: '192.168.1.3'
          }
        ]
      };

      return mockSessions;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in getUserSessions: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Terminate user session
   * @param {string} userId - User ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} - Success message
   */
  async terminateSession(userId, sessionId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!sessionId) {
        throw new AppError('Session ID is required', StatusCodes.BAD_REQUEST);
      }

      // In a real implementation, you would terminate the specific session
      // For now, we'll just return a success message
      return { message: 'Session terminated successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in terminateSession: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Helper method to check password strength
   * @param {string} password - Password to check
   * @returns {boolean} - Whether password is strong
   */
  isStrongPassword(password) {
    // Check length
    if (password.length < 8) {
      return false;
    }

    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Check for lowercase
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Check for numbers
    if (!/[0-9]/.test(password)) {
      return false;
    }

    // Check for special characters
    if (!/[^A-Za-z0-9]/.test(password)) {
      return false;
    }

    return true;
  }
}

module.exports = new SettingsService();