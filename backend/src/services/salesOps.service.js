const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class SalesOpsService {
  /**
   * Get dashboard data including stats, recent properties, requests, and viewings
   * @returns {Promise<Object>} - Dashboard data
   */
  async getDashboardData() {
    try {
      // Fetch property requests with profiles
      const { data: requestsData, error: requestsError } = await supabase
        .from('property_requests')
        .select(`
          *,
          profile:user_id (
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (requestsError) throw new AppError(requestsError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (propertiesError) throw new AppError(propertiesError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Fetch scheduled viewings with property and user details
      const { data: viewingsData, error: viewingsError } = await supabase
        .from('scheduled_viewings')
        .select(`
          *,
          property:property_id (
            title,
            location
          ),
          profile:user_id (
            name,
            email,
            phone
          )
        `)
        .order('viewing_date', { ascending: true })
        .limit(3);

      if (viewingsError) throw new AppError(viewingsError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count total requests
      const { count: requestCount, error: requestCountError } = await supabase
        .from('property_requests')
        .select('*', { count: 'exact', head: true });

      if (requestCountError) throw new AppError(requestCountError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count total viewings
      const { count: viewingCount, error: viewingCountError } = await supabase
        .from('scheduled_viewings')
        .select('*', { count: 'exact', head: true });

      if (viewingCountError) throw new AppError(viewingCountError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count total properties
      const { count: propertyCount, error: propertyCountError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      if (propertyCountError) throw new AppError(propertyCountError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Calculate success rate (mocked for now)
      const successRate = 72; // This would be calculated based on actual conversions

      return {
        stats: {
          customerRequests: requestCount || 0,
          scheduledViewings: viewingCount || 0,
          properties: propertyCount || 0,
          successRate: successRate
        },
        recentData: {
          properties: propertiesData || [],
          requests: requestsData || [],
          viewings: viewingsData || []
        }
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching dashboard data: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get properties with filtering, sorting, and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Properties data with count
   */
  async getProperties(options = {}) {
    try {
      const {
        search,
        location,
        property_type,
        min_price,
        max_price,
        available,
        sortField = 'created_at',
        sortDirection = 'desc',
        page = 1,
        limit = 10
      } = options;

      // Start building the query
      let query = supabase.from('properties').select('*', { count: 'exact' });

      // Apply search
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
      }

      // Apply filters
      if (location) {
        query = query.eq('location', location);
      }
      if (property_type) {
        query = query.eq('property_type', property_type);
      }
      if (min_price) {
        query = query.gte('price', parseInt(min_price));
      }
      if (max_price) {
        query = query.lte('price', parseInt(max_price));
      }
      if (available === 'true') {
        query = query.eq('available', true);
      } else if (available === 'false') {
        query = query.eq('available', false);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return { 
        properties: data || [], 
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching properties: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Toggle property availability
   * @param {string} propertyId - Property ID
   * @param {boolean} currentStatus - Current availability status
   * @returns {Promise<Object>} - Updated property
   */
  async togglePropertyAvailability(propertyId, currentStatus) {
    try {
      if (!propertyId) {
        throw new AppError('Property ID is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('properties')
        .update({ available: !currentStatus })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error toggling property availability: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a property
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteProperty(propertyId) {
    try {
      if (!propertyId) {
        throw new AppError('Property ID is required', StatusCodes.BAD_REQUEST);
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return { message: 'Property deleted successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error deleting property: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get property requests with filtering, sorting, and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Property requests data with count
   */
  async getPropertyRequests(options = {}) {
    try {
      const {
        search,
        status,
        location,
        property_type,
        min_price,
        max_price,
        sortField = 'created_at',
        sortDirection = 'desc',
        page = 1,
        limit = 10
      } = options;

      // Start building the query
      let query = supabase.from('property_requests').select(`
        *,
        profile:user_id (
          name,
          email,
          phone
        )
      `, { count: 'exact' });

      // Apply search
      if (search) {
        query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
      }

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      if (location) {
        query = query.eq('location', location);
      }
      if (property_type) {
        query = query.eq('property_type', property_type);
      }
      if (min_price) {
        query = query.gte('min_price', parseInt(min_price));
      }
      if (max_price) {
        query = query.lte('max_price', parseInt(max_price));
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return { 
        requests: data || [], 
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching property requests: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get property request by ID
   * @param {string} requestId - Request ID
   * @returns {Promise<Object>} - Property request data
   */
  async getPropertyRequestById(requestId) {
    try {
      if (!requestId) {
        throw new AppError('Request ID is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('property_requests')
        .select(`
          *,
          profile:user_id (
            name,
            email,
            phone
          )
        `)
        .eq('id', requestId)
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      if (!data) throw new AppError('Property request not found', StatusCodes.NOT_FOUND);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching property request: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update property request status
   * @param {string} requestId - Request ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Updated property request
   */
  async updatePropertyRequestStatus(requestId, status) {
    try {
      if (!requestId) {
        throw new AppError('Request ID is required', StatusCodes.BAD_REQUEST);
      }

      if (!status) {
        throw new AppError('Status is required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('property_requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error updating property request status: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get scheduled viewings with filtering, sorting, and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Scheduled viewings data with count
   */
  async getScheduledViewings(options = {}) {
    try {
      const {
        search,
        status,
        propertyId,
        fromDate,
        toDate,
        sortField = 'viewing_date',
        sortDirection = 'asc',
        page = 1,
        limit = 10
      } = options;

      // Start building the query
      let query = supabase.from('scheduled_viewings').select(`
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
      `, { count: 'exact' });

      // Apply filters
      if (status) {
        if (Array.isArray(status)) {
          query = query.in('status', status);
        } else {
          query = query.eq('status', status);
        }
      }
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      // Apply date range filter for viewings
      if (fromDate) {
        query = query.gte('viewing_date', fromDate);
      }

      if (toDate) {
        query = query.lte('viewing_date', toDate);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return { 
        viewings: data || [], 
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching scheduled viewings: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get scheduled viewing by ID
   * @param {string} viewingId - Viewing ID
   * @returns {Promise<Object>} - Scheduled viewing data
   */
  async getScheduledViewingById(viewingId) {
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

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      if (!data) throw new AppError('Scheduled viewing not found', StatusCodes.NOT_FOUND);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching scheduled viewing: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new property
   * @param {Object} propertyData - Property data to create
   * @returns {Promise<Object>} - Created property
   */
  async createProperty(propertyData) {
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'property_type', 'location', 'price', 'bedrooms', 'bathrooms', 'area_size'];
      for (const field of requiredFields) {
        if (!propertyData[field]) {
          throw new AppError(`Missing required field: ${field}`, StatusCodes.BAD_REQUEST);
        }
      }

      // Ensure image_urls is an array
      if (!Array.isArray(propertyData.image_urls)) {
        propertyData.image_urls = [];
      }

      // Set default values
      propertyData.available = propertyData.available === undefined ? true : propertyData.available;
      propertyData.views_count = 0;
      propertyData.created_at = new Date().toISOString();

      // Create the property
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error creating property: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new SalesOpsService();