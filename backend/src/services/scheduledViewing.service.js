const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class ScheduledViewingService {
  /**
   * Get all scheduled viewings with optional filtering
   * @param {Object} filters - Filter parameters
   * @param {string} filters.userId - Filter by user ID
   * @param {string} filters.propertyId - Filter by property ID
   * @param {string} filters.status - Filter by status
   * @param {string} filters.role - User role for authorization
   * @returns {Promise<Array>} - List of scheduled viewings
   */
  async getScheduledViewings(filters = {}) {
    try {
      let query = supabase
        .from('scheduled_viewings')
        .select(`
          *,
          user:user_id (
            id,
            name,
            email,
            phone
          ),
          property:property_id (
            id,
            title,
            property_type,
            location,
            price,
            featured_image,
            bedrooms,
            bathrooms,
            area_size
          ),
          property_request:request_id (
            id,
            title,
            status
          )
        `);

      // Apply filters based on role and viewAll flag
      if (!filters.viewAll || filters.role === 'customer') {
        // If not viewAll or customer role, only show user's own viewings
        if (!filters.userId) {
          throw new AppError('User ID is required for customer role', StatusCodes.BAD_REQUEST);
        }
        query = query.eq('user_id', filters.userId);
      }
      
      // Apply property filter regardless of role if specified
      if (filters.propertyId) {
        query = query.eq('property_id', filters.propertyId);
      }
      // Admins with viewAll=true can see all viewings, no additional filtering needed
      // Admins can see all viewings, so no additional filtering needed

      // Apply specific filters
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters.propertyId) {
        query = query.eq('property_id', filters.propertyId);
      }

      if (filters.requestId) {
        query = query.eq('request_id', filters.requestId);
      }

      // Apply date range filter for viewings
      if (filters.fromDate) {
        query = query.gte('viewing_date', filters.fromDate);
      }

      if (filters.toDate) {
        query = query.lte('viewing_date', filters.toDate);
      }

      // Apply sorting
      if (filters.sortBy) {
        const direction = filters.sortDirection === 'asc' ? true : false;
        query = query.order(filters.sortBy, { ascending: direction });
      } else {
        // Default sort by viewing_date in ascending order
        query = query.order('viewing_date', { ascending: true });
      }

      // Apply pagination
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new AppError(`Failed to fetch scheduled viewings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { data, count };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in getScheduledViewings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get a single scheduled viewing by ID
   * @param {string} viewingId - Viewing ID
   * @param {Object} options - Options for fetching
   * @param {string} options.userId - User ID (for authorization)
   * @param {string} options.role - User role (for authorization)
   * @returns {Promise<Object>} - Scheduled viewing
   */
  async getScheduledViewingById(viewingId, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('scheduled_viewings')
        .select(`
          *,
          user:user_id (
            id,
            name,
            email,
            phone
          ),
          property:property_id (
            id,
            title,
            property_type,
            location,
            price,
            featured_image,
            bedrooms,
            bathrooms,
            area_size
          ),
          property_request:request_id (
            id,
            title,
            status
          )
        `)
        .eq('id', viewingId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      if (!data) {
        throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
      }

      // Check if user is authorized to view this viewing
      if (options.role === 'customer' && data.user_id !== options.userId) {
        throw new AppError('You are not authorized to view this scheduled viewing', StatusCodes.FORBIDDEN);
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in getScheduledViewingById: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new scheduled viewing
   * @param {Object} viewingData - Scheduled viewing data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Created scheduled viewing
   */
  async createScheduledViewing(viewingData, userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!viewingData.property_id) {
        throw new AppError('Property ID is required', StatusCodes.BAD_REQUEST);
      }

      // Set up the viewing data - initial request has no date/time preferences
      const newViewing = {
        user_id: userId,
        property_id: viewingData.property_id,
        request_id: viewingData.request_id || null,
        preferred_dates: [],
        preferred_times: [],
        proposed_dates: [],
        proposed_times: [],
        selected_date: null,
        selected_time: null,
        viewing_date: null,
        viewing_time: null,
        notes: viewingData.notes || '',
        status: 'requested' // New initial status
      };

      const { data, error } = await supabase
        .from('scheduled_viewings')
        .insert(newViewing)
        .select('*')
        .single();

      if (error) {
        throw new AppError(`Failed to create scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get the full viewing data with all relations
      return this.getScheduledViewingById(data.id, { userId, role: 'customer' });
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in createScheduledViewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update a scheduled viewing
   * @param {string} viewingId - Viewing ID
   * @param {Object} updateData - Data to update
   * @param {Object} options - Options for updating
   * @param {string} options.userId - User ID (for authorization)
   * @param {string} options.role - User role (for authorization)
   * @returns {Promise<Object>} - Updated scheduled viewing
   */
  async updateScheduledViewing(viewingId, updateData, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      // First get the existing viewing for authorization check
      const { data: existingViewing, error: fetchError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('id', viewingId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch scheduled viewing: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Check if user is authorized to update this viewing
      if (options.role === 'customer' && existingViewing.user_id !== options.userId) {
        throw new AppError('You are not authorized to update this scheduled viewing', StatusCodes.FORBIDDEN);
      }

      // Customers can only update specific fields
      if (options.role === 'customer') {
        // Filter update data to only include fields that customers can update
        const allowedFields = [
          'preferred_dates', 'preferred_times', 'notes'
        ];
        
        const filteredUpdateData = Object.keys(updateData)
          .filter(key => allowedFields.includes(key))
          .reduce((obj, key) => {
            obj[key] = updateData[key];
            return obj;
          }, {});
        
        updateData = filteredUpdateData;
        
        // Customers can only update pending viewings
        if (existingViewing.status !== 'pending') {
          throw new AppError('You can only update pending viewings', StatusCodes.FORBIDDEN);
        }
      }

      // Update the viewing
      const { data, error } = await supabase
        .from('scheduled_viewings')
        .update(updateData)
        .eq('id', viewingId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to update scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get the full viewing data with all relations
      return this.getScheduledViewingById(viewingId, options);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in updateScheduledViewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a scheduled viewing
   * @param {string} viewingId - Viewing ID
   * @param {Object} options - Options for deleting
   * @param {string} options.userId - User ID (for authorization)
   * @param {string} options.role - User role (for authorization)
   * @returns {Promise<Object>} - Success message
   */
  async deleteScheduledViewing(viewingId, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      // First get the existing viewing for authorization check
      const { data: existingViewing, error: fetchError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('id', viewingId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch scheduled viewing: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Check if user is authorized to delete this viewing
      if (options.role === 'customer' && existingViewing.user_id !== options.userId) {
        throw new AppError('You are not authorized to delete this scheduled viewing', StatusCodes.FORBIDDEN);
      }

      // Customers can only delete pending viewings
      if (options.role === 'customer' && existingViewing.status !== 'pending') {
        throw new AppError('You can only delete pending viewings', StatusCodes.FORBIDDEN);
      }

      // Delete the viewing
      const { error } = await supabase
        .from('scheduled_viewings')
        .delete()
        .eq('id', viewingId);

      if (error) {
        throw new AppError(`Failed to delete scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { message: 'Scheduled viewing deleted successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in deleteScheduledViewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Propose viewing slots (sales ops or admin only)
   * @param {string} viewingId - Viewing ID
   * @param {Object} proposalData - Proposal data
   * @param {string[]} proposalData.proposed_dates - Array of proposed dates
   * @param {string[]} proposalData.proposed_times - Array of proposed times
   * @param {string} proposalData.notes - Optional notes
   * @param {Object} options - Options
   * @param {string} options.userId - User ID making the proposal
   * @returns {Promise<Object>} - Updated scheduled viewing
   */
  async proposeViewingSlots(viewingId, proposalData, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!proposalData.proposed_dates || !proposalData.proposed_dates.length) {
        throw new AppError('At least one proposed date is required', StatusCodes.BAD_REQUEST);
      }

      if (!proposalData.proposed_times || !proposalData.proposed_times.length) {
        throw new AppError('At least one proposed time is required', StatusCodes.BAD_REQUEST);
      }

      // First, check if the viewing is in 'requested' status
      const { data: existingViewing, error: fetchError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('id', viewingId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch scheduled viewing: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      if (existingViewing.status !== 'requested') {
        throw new AppError('Can only propose slots for requests in "requested" status', StatusCodes.BAD_REQUEST);
      }

      // Update the viewing with proposal data
      const updateData = {
        proposed_dates: proposalData.proposed_dates,
        proposed_times: proposalData.proposed_times,
        status: 'options_sent',
        private_notes: proposalData.private_notes || existingViewing.private_notes
      };

      const { data, error } = await supabase
        .from('scheduled_viewings')
        .update(updateData)
        .eq('id', viewingId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to propose viewing slots: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get the full viewing data with all relations
      return this.getScheduledViewingById(viewingId, options);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in proposeViewingSlots: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Select a viewing slot (customer only)
   * @param {string} viewingId - Viewing ID
   * @param {Object} selectionData - Selection data
   * @param {string} selectionData.selected_date - Selected date from proposed dates
   * @param {string} selectionData.selected_time - Selected time from proposed times
   * @param {Object} options - Options
   * @param {string} options.userId - User ID making the selection
   * @returns {Promise<Object>} - Updated scheduled viewing
   */
  async selectViewingSlot(viewingId, selectionData, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!selectionData.selected_date) {
        throw new AppError('Selected date is required', StatusCodes.BAD_REQUEST);
      }

      if (!selectionData.selected_time) {
        throw new AppError('Selected time is required', StatusCodes.BAD_REQUEST);
      }

      // First get the existing viewing for validation
      const { data: existingViewing, error: fetchError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('id', viewingId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch scheduled viewing: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Check if user is authorized to select slot for this viewing
      if (options.role === 'customer' && existingViewing.user_id !== options.userId) {
        throw new AppError('You are not authorized to update this scheduled viewing', StatusCodes.FORBIDDEN);
      }

      // Make sure viewing is in the correct state
      if (existingViewing.status !== 'options_sent') {
        throw new AppError('Can only select slot for requests in "options_sent" status', StatusCodes.BAD_REQUEST);
      }

      // Validate that selected date and time are from the proposed options
      if (!existingViewing.proposed_dates.includes(selectionData.selected_date)) {
        throw new AppError('Selected date must be one of the proposed dates', StatusCodes.BAD_REQUEST);
      }

      if (!existingViewing.proposed_times.includes(selectionData.selected_time)) {
        throw new AppError('Selected time must be one of the proposed times', StatusCodes.BAD_REQUEST);
      }

      // Update the viewing with selected slot
      const updateData = {
        selected_date: selectionData.selected_date,
        selected_time: selectionData.selected_time,
        status: 'slot_selected',
        notes: selectionData.notes || existingViewing.notes
      };

      const { data, error } = await supabase
        .from('scheduled_viewings')
        .update(updateData)
        .eq('id', viewingId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to select viewing slot: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get the full viewing data with all relations
      return this.getScheduledViewingById(viewingId, options);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in selectViewingSlot: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Confirm a scheduled viewing (sales ops or admin only)
   * @param {string} viewingId - Viewing ID
   * @param {Object} confirmData - Confirmation data
   * @param {string} confirmData.notes - Confirmation notes
   * @param {Object} options - Options
   * @param {string} options.userId - User ID making the confirmation
   * @returns {Promise<Object>} - Updated scheduled viewing
   */
  async confirmScheduledViewing(viewingId, confirmData, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      // First get the existing viewing for validation
      const { data: existingViewing, error: fetchError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('id', viewingId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch scheduled viewing: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Make sure viewing is in the correct state
      if (existingViewing.status !== 'slot_selected') {
        throw new AppError('Can only confirm viewings in "slot_selected" status', StatusCodes.BAD_REQUEST);
      }

      // Make sure the viewing has a selected date and time
      if (!existingViewing.selected_date || !existingViewing.selected_time) {
        throw new AppError('Viewing must have a selected date and time to confirm', StatusCodes.BAD_REQUEST);
      }

      // Update the viewing with confirmation data
      const updateData = {
        viewing_date: existingViewing.selected_date,
        viewing_time: existingViewing.selected_time,
        status: 'confirmed',
        private_notes: confirmData.private_notes || existingViewing.private_notes
      };

      const { data, error } = await supabase
        .from('scheduled_viewings')
        .update(updateData)
        .eq('id', viewingId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to confirm scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get the full viewing data with all relations
      return this.getScheduledViewingById(viewingId, options);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in confirmScheduledViewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Cancel a scheduled viewing
   * @param {string} viewingId - Viewing ID
   * @param {Object} cancelData - Cancellation data
   * @param {string} cancelData.cancellation_reason - Reason for cancellation
   * @param {Object} options - Options
   * @param {string} options.userId - User ID making the cancellation
   * @param {string} options.role - User role (for authorization)
   * @returns {Promise<Object>} - Updated scheduled viewing
   */
  async cancelScheduledViewing(viewingId, cancelData, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      // First get the existing viewing for authorization check
      const { data: existingViewing, error: fetchError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('id', viewingId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);
        }
        throw new AppError(`Failed to fetch scheduled viewing: ${fetchError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Check if user is authorized to cancel this viewing
      if (options.role === 'customer' && existingViewing.user_id !== options.userId) {
        throw new AppError('You are not authorized to cancel this scheduled viewing', StatusCodes.FORBIDDEN);
      }

      // Customers can only cancel pending or confirmed viewings
      if (options.role === 'customer' && 
          existingViewing.status !== 'pending' && 
          existingViewing.status !== 'confirmed') {
        throw new AppError('You can only cancel pending or confirmed viewings', StatusCodes.FORBIDDEN);
      }

      // Update the viewing with cancellation data
      const updateData = {
        status: 'cancelled',
        notes: cancelData.cancellation_reason || existingViewing.notes
      };

      const { data, error } = await supabase
        .from('scheduled_viewings')
        .update(updateData)
        .eq('id', viewingId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to cancel scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get the full viewing data with all relations
      return this.getScheduledViewingById(viewingId, options);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in cancelScheduledViewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Complete a scheduled viewing (sales ops or admin only)
   * @param {string} viewingId - Viewing ID
   * @param {Object} completeData - Completion data
   * @param {string} completeData.feedback - Viewing feedback
   * @param {Object} options - Options
   * @param {string} options.userId - User ID marking as completed
   * @returns {Promise<Object>} - Updated scheduled viewing
   */
  async completeScheduledViewing(viewingId, completeData, options = {}) {
    try {
      if (!viewingId) {
        throw new AppError('Viewing ID is required', StatusCodes.BAD_REQUEST);
      }

      // Update the viewing as completed
      const updateData = {
        status: 'completed',
        private_notes: completeData.feedback || null
      };

      const { data, error } = await supabase
        .from('scheduled_viewings')
        .update(updateData)
        .eq('id', viewingId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to complete scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Get the full viewing data with all relations
      return this.getScheduledViewingById(viewingId, options);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in completeScheduledViewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new ScheduledViewingService();