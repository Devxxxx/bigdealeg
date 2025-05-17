const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class ActivityService {
  /**
   * Log user activity
   * @param {Object} activityData - Activity data
   * @param {string} activityData.user_id - User ID
   * @param {string} activityData.activity_type - Activity type
   * @param {string} [activityData.description] - Description
   * @param {string} [activityData.details] - Additional details
   * @param {string} [activityData.property_id] - Related property ID
   * @returns {Promise<Object>} - Created activity
   */
  async logActivity(activityData) {
    try {
      if (!activityData.user_id) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!activityData.activity_type) {
        throw new AppError('Activity type is required', StatusCodes.BAD_REQUEST);
      }

      // Validate activity type
      const validTypes = ['view', 'save', 'favorite', 'message', 'login', 'request', 'viewing', 'info'];
      if (!validTypes.includes(activityData.activity_type)) {
        throw new AppError(`Invalid activity type. Must be one of: ${validTypes.join(', ')}`, StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('user_activity')
        .insert([activityData])
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error logging user activity: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Log property view
   * @param {string} userId - User ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Created activity
   */
  async logPropertyView(userId, propertyId) {
    return this.logActivity({
      user_id: userId,
      activity_type: 'view',
      description: 'Viewed a property',
      property_id: propertyId
    });
  }

  /**
   * Log property save
   * @param {string} userId - User ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Created activity
   */
  async logPropertySave(userId, propertyId) {
    return this.logActivity({
      user_id: userId,
      activity_type: 'save',
      description: 'Saved a property',
      property_id: propertyId
    });
  }

  /**
   * Log property favorite
   * @param {string} userId - User ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Created activity
   */
  async logPropertyFavorite(userId, propertyId) {
    return this.logActivity({
      user_id: userId,
      activity_type: 'favorite',
      description: 'Favorited a property',
      property_id: propertyId
    });
  }

  /**
   * Log user login
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Created activity
   */
  async logUserLogin(userId) {
    return this.logActivity({
      user_id: userId,
      activity_type: 'login',
      description: 'User logged in'
    });
  }

  /**
   * Log property request submission
   * @param {string} userId - User ID
   * @param {string} requestId - Request ID
   * @param {string} title - Request title
   * @returns {Promise<Object>} - Created activity
   */
  async logPropertyRequest(userId, requestId, title) {
    return this.logActivity({
      user_id: userId,
      activity_type: 'request',
      description: 'Submitted a property request',
      details: `Request for: ${title}`,
    });
  }

  /**
   * Log property viewing scheduled
   * @param {string} userId - User ID
   * @param {string} propertyId - Property ID
   * @param {string} viewingId - Viewing ID
   * @returns {Promise<Object>} - Created activity
   */
  async logViewingScheduled(userId, propertyId, viewingId) {
    return this.logActivity({
      user_id: userId,
      activity_type: 'viewing',
      description: 'Scheduled a property viewing',
      property_id: propertyId,
      details: `Viewing ID: ${viewingId}`
    });
  }

  /**
   * Get user activities
   * @param {string} userId - User ID
   * @param {number} [limit=10] - Maximum number of activities to return
   * @returns {Promise<Object[]>} - User activities
   */
  async getUserActivities(userId, limit = 10) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data || [];
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching user activities: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new ActivityService();