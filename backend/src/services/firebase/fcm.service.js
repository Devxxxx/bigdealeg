// Firebase Cloud Messaging (FCM) service
let admin;

// Try to require firebase-admin, but handle the case where it's not installed
try {
  admin = require('firebase-admin');
} catch (error) {
  console.warn('firebase-admin module not found. Run "npm install firebase-admin" to enable FCM.');
}

const { AppError } = require('../../utils/error');
const { StatusCodes } = require('http-status-codes');
const supabase = require('../../utils/supabase');

// Initialize Firebase Admin SDK
let initialized = false;

const initializeFirebase = () => {
  if (initialized || !admin) return false;
  
  try {
    // Check if service account credentials are available as environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      // Decode base64 encoded service account credentials
      const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString();
      const serviceAccount = JSON.parse(serviceAccountJson);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      initialized = true;
      console.log('Firebase Admin SDK initialized successfully');
      return true;
    } else {
      console.warn('Firebase service account credentials not found, FCM notifications will not work');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    return false;
  }
};

// Initialize Firebase Admin SDK when the service is imported (if available)
if (admin) {
  initializeFirebase();
}

class FCMService {
  /**
   * Send a notification to a user via FCM
   * @param {string} userId - User ID
   * @param {Object} notification - Notification data
   * @returns {Promise<Object>} - Response with success status
   */
  async sendNotificationToUser(userId, notification) {
    try {
      // Check if Firebase Admin is available
      if (!admin) {
        console.warn('Firebase Admin SDK not available, skipping FCM notification');
        return { success: false, message: 'Firebase Admin SDK not available' };
      }
      
      // Check if Firebase is initialized
      if (!initialized) {
        // Try to initialize
        const initSuccess = initializeFirebase();
        if (!initSuccess) {
          console.warn('Firebase Admin SDK not initialized, skipping FCM notification');
          return { success: false, message: 'Firebase not initialized' };
        }
      }
      
      // Get user's active FCM tokens
      const { data: tokens, error } = await supabase
        .from('notification_tokens')
        .select('token')
        .eq('user_id', userId)
        .eq('is_active', true);
        
      if (error) {
        throw new AppError(`Failed to get user tokens: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      if (!tokens || tokens.length === 0) {
        console.log(`No active FCM tokens found for user ${userId}`);
        return { success: false, message: 'No active tokens found' };
      }
      
      // Extract token strings
      const tokenStrings = tokens.map(t => t.token);
      
      // Create message payload
      const message = {
        notification: {
          title: notification.title,
          body: notification.message,
        },
        data: {
          id: notification.id || String(Date.now()),
          type: notification.type || 'system',
          entityId: notification.related_entity_id || '',
          entityType: notification.related_entity_type || '',
          link: notification.link || '',
          createdAt: notification.created_at || new Date().toISOString()
        },
        tokens: tokenStrings,
        // Android specific options
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK'
          }
        },
        // Apple specific options
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        },
        // Web specific options
        webpush: {
          headers: {
            Urgency: 'high'
          },
          notification: {
            icon: '/logo.png',
            badge: '/badge.png'
          },
          fcmOptions: {
            link: notification.link || '/dashboard/notifications'
          }
        }
      };
      
      // Send multicast message
      const response = await admin.messaging().sendMulticast(message);
      
      console.log(`FCM notification sent to ${response.successCount} devices`);
      
      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens = [];
        
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.log(`Failed to send FCM notification to token: ${tokenStrings[idx]}, Error:`, resp.error);
            
            failedTokens.push({
              token: tokenStrings[idx],
              error: resp.error.code
            });
          }
        });
        
        // Clean up invalid tokens
        if (failedTokens.length > 0) {
          await this._handleFailedTokens(failedTokens);
        }
      }
      
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Error sending FCM notification:', error);
      
      // Don't throw error, just return failure response
      return { success: false, message: error.message };
    }
  }
  
  /**
   * Handle failed tokens
   * @private
   * @param {Array} failedTokens - Array of failed tokens
   */
  async _handleFailedTokens(failedTokens) {
    try {
      // Get invalid tokens that should be removed
      const invalidTokens = failedTokens
        .filter(t => [
          'messaging/invalid-registration-token',
          'messaging/registration-token-not-registered',
          'messaging/invalid-argument'
        ].includes(t.error))
        .map(t => t.token);
      
      if (invalidTokens.length > 0) {
        console.log(`Marking ${invalidTokens.length} invalid FCM tokens as inactive`);
        
        // Mark tokens as inactive
        const { error } = await supabase
          .from('notification_tokens')
          .update({ is_active: false })
          .in('token', invalidTokens);
          
        if (error) {
          console.error('Error marking invalid tokens as inactive:', error);
        }
      }
    } catch (error) {
      console.error('Error handling failed tokens:', error);
    }
  }
}

module.exports = new FCMService();