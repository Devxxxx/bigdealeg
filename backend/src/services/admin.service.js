const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class AdminService {
  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} - Dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Count total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw new AppError(usersError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count total properties
      const { count: totalProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      if (propertiesError) throw new AppError(propertiesError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count active requests
      const { count: activeRequests, error: requestsError } = await supabase
        .from('property_requests')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'completed')
        .neq('status', 'cancelled');

      if (requestsError) throw new AppError(requestsError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count new users this month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const oneMonthAgoISO = oneMonthAgo.toISOString();

      const { count: newUsersThisMonth, error: newUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgoISO);

      if (newUsersError) throw new AppError(newUsersError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count new properties this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoISO = oneWeekAgo.toISOString();

      const { count: newPropertiesThisWeek, error: newPropertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgoISO);

      if (newPropertiesError) throw new AppError(newPropertiesError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Calculate percentage changes (mocked for now but could be implemented with additional queries)
      const percentChangeUsers = 8.5;
      const percentChangeProperties = 4.7;
      const percentChangeRequests = -2.1;
      const percentChangeRevenue = 12.3;
      const totalRevenue = 875000; // Mocked for now

      return {
        totalUsers,
        totalProperties,
        activeRequests,
        totalRevenue,
        newUsersThisMonth,
        newPropertiesThisWeek,
        percentChangeUsers,
        percentChangeProperties,
        percentChangeRequests,
        percentChangeRevenue
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching dashboard stats: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get recent activities for dashboard
   * @param {number} limit - Maximum number of activities to return
   * @returns {Promise<Object[]>} - Recent activities
   */
  async getRecentActivities(limit = 6) {
    try {
      // In a real implementation, you would have an activities table
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        // If table doesn't exist or there's another error, return mock data
        console.log('Could not fetch activity data:', error.message);
        return [
          { id: 1, type: 'user', title: 'New user registration', user: 'Ahmed Hassan', timestamp: '10 minutes ago' },
          { id: 2, type: 'property', title: 'New property listed', user: 'Sara Adel', timestamp: '25 minutes ago' },
          { id: 3, type: 'request', title: 'Property request updated', user: 'Mohamed Ali', timestamp: '1 hour ago', status: 'active' },
          { id: 4, type: 'viewing', title: 'Viewing scheduled', user: 'Laila Fahmy', timestamp: '2 hours ago' },
          { id: 5, type: 'property', title: 'Property price updated', user: 'Omar Khaled', timestamp: '3 hours ago' },
          { id: 6, type: 'user', title: 'User profile updated', user: 'Nour Ahmed', timestamp: '5 hours ago' }
        ].slice(0, limit);
      }

      if (data && data.length > 0) {
        // Transform database activity into the format expected by the frontend
        return data.map(activity => ({
          id: activity.id,
          type: activity.activity_type,
          title: activity.description || `User ${activity.activity_type} activity`,
          user: activity.user_id,
          timestamp: new Date(activity.created_at).toRelative ? 
            new Date(activity.created_at).toRelative() : 
            new Date(activity.created_at).toLocaleDateString(),
          details: activity.details,
          status: activity.status
        })).slice(0, limit);
      }
      
      // Fallback to mock data if no activities found
      return [
        { id: 1, type: 'user', title: 'New user registration', user: 'Ahmed Hassan', timestamp: '10 minutes ago' },
        { id: 2, type: 'property', title: 'New property listed', user: 'Sara Adel', timestamp: '25 minutes ago' },
        { id: 3, type: 'request', title: 'Property request updated', user: 'Mohamed Ali', timestamp: '1 hour ago', status: 'active' },
        { id: 4, type: 'viewing', title: 'Viewing scheduled', user: 'Laila Fahmy', timestamp: '2 hours ago' },
        { id: 5, type: 'property', title: 'Property price updated', user: 'Omar Khaled', timestamp: '3 hours ago' },
        { id: 6, type: 'user', title: 'User profile updated', user: 'Nour Ahmed', timestamp: '5 hours ago' }
      ].slice(0, limit);
    } catch (error) {
      throw new AppError(`Error fetching recent activities: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get system alerts for dashboard
   * @param {number} limit - Maximum number of alerts to return
   * @returns {Promise<Object[]>} - System alerts
   */
  async getSystemAlerts(limit = 4) {
    try {
      // Mock system alerts
      const alerts = [
        { id: 1, type: 'warning', message: 'System maintenance scheduled for tomorrow at 2 AM', time: '1 hour ago' },
        { id: 2, type: 'error', message: 'Payment gateway connection failed', time: '3 hours ago' },
        { id: 3, type: 'info', message: 'New feature: Virtual property tours now available', time: '1 day ago' },
        { id: 4, type: 'success', message: 'Database backup completed successfully', time: '2 days ago' }
      ];

      return alerts.slice(0, limit);
    } catch (error) {
      throw new AppError(`Error fetching system alerts: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get users with filtering, pagination, and sorting
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Users data and count
   */
  async getUsers(options = {}) {
    try {
      const {
        searchTerm,
        roleFilter = 'all',
        sortField = 'created_at',
        sortDirection = 'desc',
        page = 0,
        pageSize = 10
      } = options;

      // Build query
      let query = supabase
        .from('profiles')
        .select('*', {
          count: 'exact'
        });

      // Apply role filter
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      // Apply search term
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Get total count first
      const { count, error: countError } = await query;
      
      if (countError) throw new AppError(countError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Apply pagination and sorting
      const { data, error } = await query
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range(page * pageSize, (page * pageSize) + pageSize - 1);

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return {
        users: data || [],
        totalUsers: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching users: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user by ID with activity, properties, and requests
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User data with related information
   */
  async getUserById(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Fetch user profile
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw new AppError(userError.message, StatusCodes.INTERNAL_SERVER_ERROR);
      
      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      // Initialize empty arrays for related data
      let activity = [];
      let properties = [];
      let requests = [];

      try {
        // Attempt to fetch user activity if the table exists
        const { data: activityData, error: activityError } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        // Only set activity data if there was no error
        if (!activityError) {
          activity = activityData || [];
        }
      } catch (activityErr) {
        // Table might not exist - continue with empty activity array
        console.log('Activity table might not exist:', activityErr.message);
      }

      try {
        // Fetch saved properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('saved_properties')
          .select(`
            id,
            property_id,
            is_favorite,
            created_at,
            properties:property_id (
              id,
              title,
              location,
              price,
              property_type,
              featured_image
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!propertiesError) {
          properties = propertiesData || [];
        }
      } catch (propertiesErr) {
        // Continue with empty properties array
        console.log('Properties fetch issue:', propertiesErr.message);
      }

      try {
        // Fetch property requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('property_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!requestsError) {
          requests = requestsData || [];
        }
      } catch (requestsErr) {
        // Continue with empty requests array
        console.log('Requests fetch issue:', requestsErr.message);
      }

      return {
        user,
        activity,
        properties,
        requests
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching user: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update user role
   * @param {string} userId - User ID
   * @param {string} newRole - New role
   * @returns {Promise<Object>} - Updated user
   */
  async updateUserRole(userId, newRole) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!newRole) {
        throw new AppError('New role is required', StatusCodes.BAD_REQUEST);
      }

      // Validate role
      if (!['admin', 'sales_ops', 'customer'].includes(newRole)) {
        throw new AppError('Invalid role', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Log this activity
      try {
        await this.createActivity({
          user_id: userId,
          activity_type: 'info',
          description: `User role updated to ${newRole}`,
          details: `Role changed to ${newRole}`
        });
      } catch (activityError) {
        console.log('Could not log role change activity:', activityError.message);
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error updating user role: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Toggle user active status
   * @param {string} userId - User ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<Object>} - Updated user
   */
  async toggleUserStatus(userId, isActive) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Log this activity
      try {
        await this.createActivity({
          user_id: userId,
          activity_type: 'info',
          description: isActive ? 'User account activated' : 'User account deactivated',
          details: `Account status changed to ${isActive ? 'active' : 'inactive'}`
        });
      } catch (activityError) {
        console.log('Could not log status change activity:', activityError.message);
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error updating user status: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw new AppError(authError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Delete user profile (might be handled by cascading delete triggers in DB)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw new AppError(profileError.message, StatusCodes.INTERNAL_SERVER_ERROR);

    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error deleting user: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * Get all form fields
   * @returns {Promise<Object[]>} - Form fields
   */
  async getFormFields() {
    try {
      const { data, error } = await supabase
        .from('property_request_fields')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data || [];
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching form fields: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new form field
   * @param {Object} fieldData - Field data
   * @returns {Promise<Object>} - Created field
   */
  async createFormField(fieldData) {
    try {
      if (!fieldData.field_name || !fieldData.field_label || !fieldData.field_type) {
        throw new AppError('Missing required field properties', StatusCodes.BAD_REQUEST);
      }

      // Get highest order and add 10
      const { data: fields } = await supabase
        .from('property_request_fields')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

      const highestOrder = fields && fields.length > 0 ? fields[0].order : 0;
      
      const newField = {
        ...fieldData,
        order: fieldData.order || highestOrder + 10
      };

      const { data, error } = await supabase
        .from('property_request_fields')
        .insert([newField])
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error creating form field: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update an existing form field
   * @param {string} fieldId - Field ID
   * @param {Object} fieldData - Updated field data
   * @returns {Promise<Object>} - Updated field
   */
  async updateFormField(fieldId, fieldData) {
    try {
      if (!fieldId) {
        throw new AppError('Field ID is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('property_request_fields')
        .update(fieldData)
        .eq('id', fieldId)
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error updating form field: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a form field
   * @param {string} fieldId - Field ID
   * @returns {Promise<void>}
   */
  async deleteFormField(fieldId) {
    try {
      if (!fieldId) {
        throw new AppError('Field ID is required', StatusCodes.BAD_REQUEST);
      }

      const { error } = await supabase
        .from('property_request_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error deleting form field: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Toggle a field's required status
   * @param {string} fieldId - Field ID
   * @param {boolean} required - New required status
   * @returns {Promise<Object>} - Updated field
   */
  async toggleFieldRequired(fieldId, required) {
    try {
      if (!fieldId) {
        throw new AppError('Field ID is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('property_request_fields')
        .update({ is_required: required })
        .eq('id', fieldId)
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error toggling field required status: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a field's order
   * @param {string} fieldId - Field ID
   * @param {number} currentOrder - Current order
   * @param {number} targetOrder - Target order
   * @returns {Promise<void>}
   */
  async updateFieldOrder(fieldId, currentOrder, targetOrder) {
    try {
      if (!fieldId) {
        throw new AppError('Field ID is required', StatusCodes.BAD_REQUEST);
      }

      // Ensure orders are parsed as numbers
      const currentOrderNum = parseInt(currentOrder, 10);
      const targetOrderNum = parseInt(targetOrder, 10);
      
      if (isNaN(currentOrderNum) || isNaN(targetOrderNum)) {
        throw new AppError('Invalid order values', StatusCodes.BAD_REQUEST);
      }

      // First, get all fields to find the target field by order
      const { data: fields, error: getError } = await supabase
        .from('property_request_fields')
        .select('id, order');

      if (getError) {
        throw new AppError(getError.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Find target field manually
      const targetField = fields.find(f => f.order === targetOrderNum);

      // Update current field order
      const { error: updateError1 } = await supabase
        .from('property_request_fields')
        .update({ order: targetOrderNum })
        .eq('id', fieldId);

      if (updateError1) {
        throw new AppError(updateError1.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // If target field exists, update its order
      if (targetField && targetField.id !== fieldId) {
        const { error: updateError2 } = await supabase
          .from('property_request_fields')
          .update({ order: currentOrderNum })
          .eq('id', targetField.id);

        if (updateError2) {
          throw new AppError(updateError2.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
      }

      return { success: true };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error updating field order: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get system settings
   * @returns {Promise<Object>} - System settings
   */
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error is ok
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // If settings don't exist, return default settings
      if (!data) {
        return this.getDefaultSettings();
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching settings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update system settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} - Updated settings
   */
  async updateSettings(settingsData) {
    try {
      if (!settingsData) {
        throw new AppError('Settings data is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('system_settings')
        .upsert([settingsData])
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error updating settings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Reset system settings to default
   * @returns {Promise<Object>} - Default settings
   */
  async resetSettings() {
    try {
      const defaultSettings = this.getDefaultSettings();

      const { data, error } = await supabase
        .from('system_settings')
        .upsert([defaultSettings])
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error resetting settings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get default system settings
   * @returns {Object} - Default settings
   */
  getDefaultSettings() {
    return {
      site_name: 'BigDealEgypt',
      site_description: 'Find your dream property and get cashback',
      contact_email: 'contact@bigdealegypt.com',
      support_phone: '+20 123 456 7890',
      currency: 'EGP',
      currency_symbol: 'E£',
      date_format: 'DD/MM/YYYY',
      time_format: '24h',
      default_language: 'en',
      maintenance_mode: false,
      property_expiry_days: 90,
      enable_social_login: true,
      enable_email_notifications: true,
      enable_sms_notifications: false,
      cashback_percentage: 1,
      commission_percentage: 2.5,
      max_upload_size: 10,
      max_images_per_property: 20,
      default_location: 'Cairo'
    };
  }

  /**
   * Get user activities
   * @param {string} userId - User ID
   * @param {number} limit - Maximum number of activities to return
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

  /**
   * Create a new user activity
   * @param {Object} activityData - Activity data
   * @returns {Promise<Object>} - Created activity
   */
  async createActivity(activityData) {
    try {
      if (!activityData.user_id || !activityData.activity_type) {
        throw new AppError('User ID and activity type are required', StatusCodes.BAD_REQUEST);
      }

      // Validate activity type
      const validTypes = ['view', 'save', 'favorite', 'message', 'login', 'request', 'viewing', 'info'];
      if (!validTypes.includes(activityData.activity_type)) {
        throw new AppError('Invalid activity type', StatusCodes.BAD_REQUEST);
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
      throw new AppError(`Error creating user activity: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Clear user activities
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async clearUserActivities(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      const { error } = await supabase
        .from('user_activity')
        .delete()
        .eq('user_id', userId);

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error clearing user activities: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new AdminService();