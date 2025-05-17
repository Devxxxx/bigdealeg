const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class PropertyRequestService {
  /**
   * Get all property requests with optional filtering
   * @param {Object} filters - Filter parameters
   * @param {string} filters.userId - Filter by user ID
   * @param {string} filters.status - Filter by status
   * @param {string} filters.role - User role for authorization
   * @returns {Promise<Array>} - List of property requests
   */
  async getPropertyRequests(filters = {}) {
    try {
      let query = supabase
        .from('property_requests')
        .select(`
          *,
          profiles:user_id (name, email),
          assigned_to_profile:assigned_to (name, email),
          property_matches (
            id,
            property_id,
            match_score,
            status,
            properties:property_id (
              id,
              title,
              property_type,
              location,
              price,
              featured_image
            )
          )
        `);

      // Apply filters based on role and viewAll flag
      if (!filters.viewAll || filters.role === 'customer') {
        // If not viewAll or customer role, only show user's own requests
        if (!filters.userId) {
          throw new AppError('User ID is required for customer role', StatusCodes.BAD_REQUEST);
        }
        query = query.eq('user_id', filters.userId);
      } else if (filters.role === 'sales_ops' && filters.onlyMine && filters.salesOpsId) {
        // Sales ops can filter to see only their assigned requests
        query = query.eq('assigned_to', filters.salesOpsId);
      }
      // Admins with viewAll=true can see all requests, no additional filtering needed
      // Admins can see all requests, so no additional filtering needed

      // Apply status filter if provided
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      // Apply sorting
      if (filters.sortBy) {
        const direction = filters.sortDirection === 'asc';
        query = query.order(filters.sortBy, { ascending: direction });
      } else {
        // Default sort by created_at in descending order
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new AppError(`Failed to fetch property requests: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { data, count };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in getPropertyRequests: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get a single property request by ID
   * @param {string} requestId - Request ID
   * @param {Object} options - Options for fetching
   * @param {string} options.userId - User ID (for authorization)
   * @param {string} options.role - User role (for authorization)
   * @returns {Promise<Object>} - Property request
   */
  async getPropertyRequestById(requestId, options = {}) {
    try {
      console.log(`[DEBUG] Starting getPropertyRequestById for ID: ${requestId}`);

      // Validate request ID format
      if (!requestId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId)) {
        console.log(`[DEBUG] Invalid UUID format: ${requestId}`);
        throw new AppError('Invalid request ID format', StatusCodes.BAD_REQUEST);
      }

      // 1. First query - check basic existence
      const existenceQuery = supabase
          .from('property_requests')
          .select('id, user_id, status')
          .eq('id', requestId)
          .single();

      console.log('[DEBUG] Existence Query:', {
        table: 'property_requests',
        select: 'id, user_id, status',
        filter: `id = ${requestId}`,
        single: true
      });

      const { data: request, error: fetchError } = await existenceQuery;

      console.log('[DEBUG] Existence Query Response:', {
        data: request,
        error: fetchError,
        count: request ? 1 : 0
      });

      if (fetchError || !request) {
        console.error('[ERROR] Existence Check Failed:', {
          error: fetchError,
          requestExists: !!request,
          requestId
        });
        throw new AppError('Property request not found', StatusCodes.NOT_FOUND);
      }

      // 2. Full data query
      const fullDataQuery = supabase
          .from('property_requests')
          .select(`
        *,
        profiles:user_id (name, email),
        assigned_to_profile:assigned_to (name, email),
        property_matches (
          id,
          property_id,
          match_score,
          status,
          properties:property_id (
            id,
            title,
            property_type,
            location,
            price,
            featured_image,
            bedrooms,
            bathrooms,
            area_size
          )
        )
      `)
          .eq('id', requestId)
          .single();

      console.log('[DEBUG] Full Data Query:', {
        table: 'property_requests',
        select: 'with relationships',
        filter: `id = ${requestId}`,
        single: true
      });

      const { data: fullRequest, error: fullError } = await fullDataQuery;

      console.log('[DEBUG] Full Data Query Response:', {
        data: fullRequest ? 'exists' : 'null',
        error: fullError,
        requestId
      });

      if (fullError || !fullRequest) {
        console.error('[ERROR] Full Data Fetch Failed:', {
          error: fullError,
          dataReturned: !!fullRequest,
          requestId
        });
        throw new AppError('Failed to load property details', StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // 3. Status history query
      const historyQuery = supabase
          .from('request_status_history')
          .select('*, created_by_profile:created_by (name)')
          .eq('request_id', requestId)
          .order('created_at', { ascending: false });

      console.log('[DEBUG] History Query:', {
        table: 'request_status_history',
        select: 'with creator profile',
        filter: `request_id = ${requestId}`
      });

      const { data: statusHistory, error: historyError } = await historyQuery;

      console.log('[DEBUG] History Query Response:', {
        count: statusHistory?.length || 0,
        error: historyError
      });

      if (historyError) {
        console.error('[WARNING] History Fetch Error:', historyError);
      }

      console.log(`[DEBUG] Successfully fetched request ${requestId}`);
      return {
        ...fullRequest,
        status_history: statusHistory || []
      };

    } catch (error) {
      console.error(`[ERROR] getPropertyRequestById Failed for ${requestId}:`, {
        error: error.message,
        stack: error.stack,
        isOperational: error.isOperational,
        statusCode: error.statusCode
      });

      if (error.isOperational) {
        throw error;
      }
      throw new AppError('Failed to fetch property request', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  /**
   * Create a new property request
   * @param {Object} requestData - Property request data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Created property request
   */
  async createPropertyRequest(requestData, userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!requestData.title || !requestData.property_type || !requestData.location) {
        throw new AppError('Title, property type, and location are required', StatusCodes.BAD_REQUEST);
      }

      // Validate price range
      if (requestData.min_price && requestData.max_price && requestData.min_price >= requestData.max_price) {
        throw new AppError('Maximum price must be greater than minimum price', StatusCodes.BAD_REQUEST);
      }

      // Set up the request data
      const newRequest = {
        ...requestData,
        user_id: userId,
        status: 'new',
        custom_fields: requestData.custom_fields || {}
      };

      const { data, error } = await supabase
        .from('property_requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to create property request: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Create initial status history entry
      await supabase
        .from('request_status_history')
        .insert({
          request_id: data.id,
          old_status: null,
          new_status: 'new',
          notes: 'Property request created',
          created_by: userId
        });

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in createPropertyRequest: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a property request
   * @param {string} requestId - Request ID
   * @param {Object} updateData - Data to update
   * @param {Object} options - Options for updating
   * @param {string} options.userId - User ID (for authorization)
   * @param {string} options.role - User role (for authorization)
   * @returns {Promise<Object>} - Updated property request
   */
  async updatePropertyRequest(requestId, updateData, options = {}) {
    try {
      if (!requestId) {
        throw new AppError('Request ID is required', StatusCodes.BAD_REQUEST);
      }

      // First get the existing request for authorization check
      const { data: existingRequest, error: fetchError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Property request not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch property request: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Check if user is authorized to update this request
      if (options.role === 'customer' && existingRequest.user_id !== options.userId) {
        throw new AppError('You are not authorized to update this property request', StatusCodes.FORBIDDEN);
      }

      // Customers can only update their own requests and only certain fields
      if (options.role === 'customer') {
        // Filter update data to only include fields that customers can update
        const allowedFields = [
          'title', 'property_type', 'location', 'min_price', 'max_price',
          'bedrooms', 'bathrooms', 'area_size', 'additional_features', 'custom_fields'
        ];
        
        const filteredUpdateData = Object.keys(updateData)
          .filter(key => allowedFields.includes(key))
          .reduce((obj, key) => {
            obj[key] = updateData[key];
            return obj;
          }, {});
        
        // Validate price range if updating
        if ('min_price' in filteredUpdateData && 'max_price' in filteredUpdateData) {
          if (filteredUpdateData.min_price >= filteredUpdateData.max_price) {
            throw new AppError('Maximum price must be greater than minimum price', StatusCodes.BAD_REQUEST);
          }
        } else if ('min_price' in filteredUpdateData && filteredUpdateData.min_price >= existingRequest.max_price) {
          throw new AppError('Minimum price must be less than maximum price', StatusCodes.BAD_REQUEST);
        } else if ('max_price' in filteredUpdateData && filteredUpdateData.max_price <= existingRequest.min_price) {
          throw new AppError('Maximum price must be greater than minimum price', StatusCodes.BAD_REQUEST);
        }
        
        updateData = filteredUpdateData;
      }

      // Check if status is being updated
      let statusChanged = false;
      let oldStatus = existingRequest.status;
      let newStatus = updateData.status;
      
      if (newStatus && newStatus !== oldStatus) {
        statusChanged = true;
      }

      // Update the request
      const { data, error } = await supabase
        .from('property_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to update property request: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Create status history entry if status changed
      if (statusChanged) {
        await supabase
          .from('request_status_history')
          .insert({
            request_id: requestId,
            old_status: oldStatus,
            new_status: newStatus,
            notes: updateData.statusNotes || `Status changed from ${oldStatus} to ${newStatus}`,
            created_by: options.userId,
            is_private: updateData.isPrivateNote || false
          });
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in updatePropertyRequest: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a property request
   * @param {string} requestId - Request ID
   * @param {Object} options - Options for deleting
   * @param {string} options.userId - User ID (for authorization)
   * @param {string} options.role - User role (for authorization)
   * @returns {Promise<Object>} - Success message
   */
  async deletePropertyRequest(requestId, options = {}) {
    try {
      if (!requestId) {
        throw new AppError('Request ID is required', StatusCodes.BAD_REQUEST);
      }

      // First get the existing request for authorization check
      const { data: existingRequest, error: fetchError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Property request not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch property request: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Check if user is authorized to delete this request
      if (options.role === 'customer' && existingRequest.user_id !== options.userId) {
        throw new AppError('You are not authorized to delete this property request', StatusCodes.FORBIDDEN);
      }

      // Only admins and the request owner can delete requests
      if (options.role !== 'admin' && existingRequest.user_id !== options.userId) {
        throw new AppError('Only admins and the request owner can delete requests', StatusCodes.FORBIDDEN);
      }

      // Delete the request
      const { error } = await supabase
        .from('property_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        throw new AppError(`Failed to delete property request: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { message: 'Property request deleted successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in deletePropertyRequest: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all property request fields
   * @returns {Promise<Array>} - List of property request fields
   */
  async getPropertyRequestFields() {
    try {
      const { data, error } = await supabase
        .from('property_request_fields')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        throw new AppError(`Failed to fetch property request fields: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in getPropertyRequestFields: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Assign a property request to a sales operator
   * @param {string} requestId - Request ID
   * @param {string} salesOpId - Sales operator ID
   * @param {Object} options - Options
   * @param {string} options.userId - User ID making the assignment
   * @param {string} options.notes - Notes about the assignment
   * @returns {Promise<Object>} - Updated property request
   */
  async assignPropertyRequest(requestId, salesOpId, options = {}) {
    try {
      if (!requestId) {
        throw new AppError('Request ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!salesOpId) {
        throw new AppError('Sales operator ID is required', StatusCodes.BAD_REQUEST);
      }

      // Verify the sales op exists and has the correct role
      const { data: salesOp, error: salesOpError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', salesOpId)
        .single();

      if (salesOpError || !salesOp) {
        throw new AppError('Sales operator not found', StatusCodes.NOT_FOUND);
      }

      if (salesOp.role !== 'sales_ops') {
        throw new AppError('User is not a sales operator', StatusCodes.BAD_REQUEST);
      }

      // Get the current request
      const { data: existingRequest, error: fetchError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Property request not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch property request: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Update the assignment
      const { data, error } = await supabase
        .from('property_requests')
        .update({
          assigned_to: salesOpId,
          status: existingRequest.status === 'new' ? 'in_progress' : existingRequest.status
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to assign property request: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Create status history entry for the assignment
      await supabase
        .from('request_status_history')
        .insert({
          request_id: requestId,
          old_status: existingRequest.status,
          new_status: data.status,
          notes: options.notes || `Request assigned to sales operator`,
          created_by: options.userId,
          is_private: true // Assignment notes are typically for internal use
        });

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in assignPropertyRequest: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Add a status update to a property request
   * @param {string} requestId - Request ID
   * @param {Object} statusData - Status update data
   * @param {string} statusData.status - New status
   * @param {string} statusData.notes - Status notes
   * @param {boolean} statusData.isPrivate - Whether the note is private
   * @param {string} userId - User ID making the update
   * @returns {Promise<Object>} - Created status history
   */
  async addStatusUpdate(requestId, statusData, userId) {
    try {
      if (!requestId) {
        throw new AppError('Request ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!statusData.status) {
        throw new AppError('Status is required', StatusCodes.BAD_REQUEST);
      }

      // Get the current request
      const { data: existingRequest, error: fetchError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Property request not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch property request: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Update the request status
      const { data: updatedRequest, error: updateError } = await supabase
        .from('property_requests')
        .update({
          status: statusData.status
        })
        .eq('id', requestId)
        .select()
        .single();

      if (updateError) {
        throw new AppError(`Failed to update property request: ${updateError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Create status history entry
      const { data: historyEntry, error: historyError } = await supabase
        .from('request_status_history')
        .insert({
          request_id: requestId,
          old_status: existingRequest.status,
          new_status: statusData.status,
          notes: statusData.notes || `Status changed from ${existingRequest.status} to ${statusData.status}`,
          created_by: userId,
          is_private: statusData.isPrivate || false
        })
        .select(`
          *,
          created_by_profile:created_by (name)
        `)
        .single();

      if (historyError) {
        throw new AppError(`Failed to create status history: ${historyError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { 
        request: updatedRequest, 
        history: historyEntry 
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in addStatusUpdate: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new PropertyRequestService();