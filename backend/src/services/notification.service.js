const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const fcmService = require('./firebase/fcm.service');
const { v4: uuidv4 } = require('uuid');

class NotificationService {
  /**
   * Create a notification for a user
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} - Created notification
   */
  async createNotification(notificationData) {
    try {
      // Validate required fields
      if (!notificationData.user_id || !notificationData.title || !notificationData.message) {
        throw new AppError('Missing required fields (user_id, title, message)', StatusCodes.BAD_REQUEST);
      }
      
      // Generate notification ID if not provided
      const notificationId = notificationData.id || uuidv4();
      
      // Prepare notification data
      const notification = {
        id: notificationId,
        user_id: notificationData.user_id,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'system',
        related_entity_id: notificationData.related_entity_id,
        related_entity_type: notificationData.related_entity_type,
        link: notificationData.link,
        is_read: false,
        status: 'sent',
        created_at: new Date().toISOString()
      };
      
      // Insert notification into database
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();
        
      if (error) {
        throw new AppError(`Failed to create notification: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      // Check if user has push notifications enabled
      const { data: userSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('push_notifications')
        .eq('user_id', notificationData.user_id)
        .single();
        
      if (!settingsError && userSettings?.push_notifications !== false) {
        try {
          // Send FCM notification
          fcmService.sendNotificationToUser(notificationData.user_id, data)
            .catch(err => console.error('Error sending FCM notification:', err));
        } catch (fcmError) {
          // Log but don't fail if FCM has an issue
          console.error('FCM notification error:', fcmError);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      if (error.isOperational) throw error;
      throw new AppError(`Error in createNotification: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Get notifications for a user
   * @param {string} userId - User ID
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} - List of notifications
   */
  async getUserNotifications(userId, filters = {}) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }
      
      // Build query
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.related_entity_type) {
        query = query.eq('related_entity_type', filters.related_entity_type);
      }
      
      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) {
        throw new AppError(`Failed to fetch notifications: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return { data, count };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      if (error.isOperational) throw error;
      throw new AppError(`Error in getUserNotifications: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Updated notification
   */
  async markAsRead(notificationId, userId) {
    try {
      if (!notificationId || !userId) {
        throw new AppError('Notification ID and User ID are required', StatusCodes.BAD_REQUEST);
      }
      
      // Update notification
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) {
        throw new AppError(`Failed to mark notification as read: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      if (error.isOperational) throw error;
      throw new AppError(`Error in markAsRead: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Success message
   */
  async markAllAsRead(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }
      
      // Update all unread notifications
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      if (error) {
        throw new AppError(`Failed to mark all notifications as read: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return { success: true, message: 'All notifications marked as read' };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      if (error.isOperational) throw error;
      throw new AppError(`Error in markAllAsRead: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteNotification(notificationId, userId) {
    try {
      if (!notificationId || !userId) {
        throw new AppError('Notification ID and User ID are required', StatusCodes.BAD_REQUEST);
      }
      
      // Delete notification
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);
        
      if (error) {
        throw new AppError(`Failed to delete notification: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return { success: true, message: 'Notification deleted successfully' };
    } catch (error) {
      console.error('Error deleting notification:', error);
      if (error.isOperational) throw error;
      throw new AppError(`Error in deleteNotification: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Save FCM token for a user
   * @param {string} userId - User ID
   * @param {string} token - FCM token
   * @param {string} deviceType - Device type (web, android, ios)
   * @returns {Promise<Object>} - Success message
   */
  async saveFCMToken(userId, token, deviceType = 'web') {
    try {
      if (!userId || !token) {
        throw new AppError('User ID and token are required', StatusCodes.BAD_REQUEST);
      }
      
      // Check if token already exists
      const { data: existingTokens, error: checkError } = await supabase
        .from('notification_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('token', token);
        
      if (checkError) {
        throw new AppError(`Failed to check token: ${checkError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      if (existingTokens.length > 0) {
        // Token exists, update it
        const { error } = await supabase
          .from('notification_tokens')
          .update({ is_active: true, device_type: deviceType })
          .eq('id', existingTokens[0].id);
          
        if (error) {
          throw new AppError(`Failed to update token: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
        
        return { success: true, message: 'Token updated successfully' };
      } else {
        // Token doesn't exist, insert it
        const { error } = await supabase
          .from('notification_tokens')
          .insert([{
            user_id: userId,
            token: token,
            device_type: deviceType,
            is_active: true
          }]);
          
        if (error) {
          throw new AppError(`Failed to save token: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
        
        return { success: true, message: 'Token saved successfully' };
      }
    } catch (error) {
      console.error('Error saving FCM token:', error);
      if (error.isOperational) throw error;
      throw new AppError(`Error in saveFCMToken: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Get sidebar notification counts for a user
   * @param {string} userId - User ID
   * @param {string} userRole - User role (customer, sales_ops, admin)
   * @returns {Promise<Object>} - Notification counts for the sidebar
   */
  async getSidebarNotifications(userId, userRole) {
    try {
      // Define counts object
      const counts = {
        propertyRequests: 0,
        scheduledViewings: 0,
        savedProperties: 0,
        messages: 0
      };

      // For customer role
      if (userRole === 'customer') {
        // Count property requests with updates
        const { data: propertyRequests, error: requestsError } = await supabase
            .from('property_requests')
            .select('id')
            .eq('user_id', userId)
            .in('status', ['matched', 'in_progress'])
            .is('viewed_by_user', false);

        if (requestsError) {
          console.error('Error fetching property requests notifications:', requestsError);
        } else {
          counts.propertyRequests = propertyRequests?.length || 0;
        }

        // Count scheduled viewings
        const { data: scheduledViewings, error: viewingsError } = await supabase
            .from('scheduled_viewings')
            .select('id')
            .eq('user_id', userId)
            .eq('is_viewed', false);

        if (viewingsError) {
          console.error('Error fetching scheduled viewings notifications:', viewingsError);
        } else {
          counts.scheduledViewings = scheduledViewings?.length || 0;
        }

        // First get all property requests for the user
        const { data: userRequests, error: userRequestsError } = await supabase
            .from('property_requests')
            .select('id')
            .eq('user_id', userId);

        if (userRequestsError) {
          console.error('Error fetching user property requests:', userRequestsError);
        } else if (userRequests && userRequests.length > 0) {
          // Extract request IDs
          const requestIds = userRequests.map(req => req.id);

          // Count new matches for saved properties
          const { data: savedProperties, error: savedError } = await supabase
              .from('property_matches')
              .select('id')
              .eq('is_viewed', false)
              .in('status', ['suggested'])
              .in('request_id', requestIds);

          if (savedError) {
            console.error('Error fetching saved properties notifications:', savedError);
          } else {
            counts.savedProperties = savedProperties?.length || 0;
          }
        }

        // Count unread messages
        const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('id')
            .eq('receiver_id', userId)
            .eq('is_read', false);

        if (messagesError) {
          console.error('Error fetching messages notifications:', messagesError);
        } else {
          counts.messages = messages?.length || 0;
        }
      }

      // For sales ops role
      else if (userRole === 'sales_ops') {
        // Count new customer requests
        const { data: customerRequests, error: requestsError } = await supabase
            .from('property_requests')
            .select('id')
            .eq('status', 'new')
            .is('assigned_to', null);

        if (requestsError) {
          console.error('Error fetching customer requests notifications:', requestsError);
        } else {
          counts.propertyRequests = customerRequests?.length || 0;
        }

        // Count pending viewings
        const { data: pendingViewings, error: viewingsError } = await supabase
            .from('scheduled_viewings')
            .select('id')
            .eq('status', 'pending');

        if (viewingsError) {
          console.error('Error fetching pending viewings notifications:', viewingsError);
        } else {
          counts.scheduledViewings = pendingViewings?.length || 0;
        }

        // Count unread messages
        const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('id')
            .eq('receiver_id', userId)
            .eq('is_read', false);

        if (messagesError) {
          console.error('Error fetching messages notifications:', messagesError);
        } else {
          counts.messages = messages?.length || 0;
        }
      }

      // For admin role
      else if (userRole === 'admin') {
        // Count all property requests
        const { data: allRequests, error: requestsError } = await supabase
            .from('property_requests')
            .select('id')
            .in('status', ['new', 'in_progress']);

        if (requestsError) {
          console.error('Error fetching all requests notifications:', requestsError);
        } else {
          counts.propertyRequests = allRequests?.length || 0;
        }

        // Count all scheduled viewings
        const { data: allViewings, error: viewingsError } = await supabase
            .from('scheduled_viewings')
            .select('id')
            .in('status', ['pending', 'confirmed']);

        if (viewingsError) {
          console.error('Error fetching all viewings notifications:', viewingsError);
        } else {
          counts.scheduledViewings = allViewings?.length || 0;
        }

        // Count system notifications
        const { data: systemMessages, error: messagesError } = await supabase
            .from('notifications')
            .select('id')
            .eq('type', 'system')
            .eq('is_read', false);

        if (messagesError) {
          console.error('Error fetching system messages notifications:', messagesError);
        } else {
          counts.messages = systemMessages?.length || 0;
        }
      }

      return counts;
    } catch (error) {
      console.error('Error in getSidebarNotifications service:', error);
      throw new AppError('Failed to get notification counts', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new NotificationService();