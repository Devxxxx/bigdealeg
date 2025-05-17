const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class CustomerDashboardService {
  /**
   * Get dashboard data for a customer
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Dashboard data
   */
  async getDashboardData(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      // Fetch property requests data
      const { data: propertyRequests, error: requestsError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (requestsError) throw new AppError(requestsError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count requests by status
      const newCount = propertyRequests?.filter(req => req.status === 'new' || req.status === 'pending').length || 0;
      const inProgressCount = propertyRequests?.filter(req => req.status === 'in_progress' || req.status === 'active').length || 0;
      const matchedCount = propertyRequests?.filter(req => req.status === 'matched').length || 0;
      const totalRequests = propertyRequests?.length || 0;

      // Fetch scheduled viewings
      const { data: scheduledViewings, error: viewingsError } = await supabase
        .from('scheduled_viewings')
        .select(`
          *,
          property:property_id (
            title,
            property_type,
            location,
            price
          )
        `)
        .eq('user_id', userId)
        .order('viewing_date', { ascending: true });

      if (viewingsError) throw new AppError(viewingsError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Count upcoming viewings (viewing_date is in the future)
      const now = new Date();
      const upcomingViewings = scheduledViewings?.filter(viewing => 
        new Date(viewing.viewing_date) > now && 
        (viewing.status === 'scheduled' || viewing.status === 'confirmed' || viewing.status === 'pending')
      ) || [];

      // Fetch saved properties
      const { data: savedPropertiesData, error: savedError } = await supabase
        .from('saved_properties')
        .select(`
          *,
          property:property_id (*)
        `)
        .eq('user_id', userId);

      if (savedError) throw new AppError(savedError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Fetch available properties count
      const { count: availableCount, error: availableError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('available', true);

      if (availableError) throw new AppError(availableError.message, StatusCodes.INTERNAL_SERVER_ERROR);

      // Fetch matching properties count
      let matchingCount = 0;
      if (propertyRequests && propertyRequests.length > 0) {
        // Get the latest property request
        const latestRequest = propertyRequests[0];
        
        // Get matching properties based on price range and location
        const { count, error: matchError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('available', true)
          .eq('location', latestRequest.location)
          .gte('price', latestRequest.min_price || 0)
          .lte('price', latestRequest.max_price || 999999999);
          
        if (!matchError) {
          matchingCount = count || 0;
        }
      }

      // Format the data for display
      return {
        propertyRequests: {
          total: totalRequests,
          newCount,
          inProgressCount,
          matchedCount,
          statusText: `${totalRequests} total (${newCount} new)`
        },
        scheduledViewings: {
          total: scheduledViewings?.length || 0,
          upcomingCount: upcomingViewings.length,
          statusText: `${upcomingViewings.length} upcoming`
        },
        availableProperties: {
          total: availableCount || 0,
          matchingCount,
          statusText: `${matchingCount} matches available`
        },
        recentPropertyRequests: propertyRequests?.slice(0, 3).map(req => ({
          id: req.id,
          property_type: req.property_type,
          location: req.location,
          min_price: req.min_price,
          max_price: req.max_price,
          min_area: req.min_area || req.area_size,
          max_area: req.max_area || req.area_size,
          status: req.status,
          created_at: req.created_at
        })) || [],
        upcomingViewings: upcomingViewings.map(viewing => ({
          id: viewing.id,
          property_title: viewing.property?.title || 'Property Viewing',
          viewing_date: viewing.viewing_date,
          viewing_time: viewing.viewing_time,
          status: viewing.status,
          property_id: viewing.property_id
        })) || [],
        savedProperties: savedPropertiesData?.map(saved => saved.property) || []
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error fetching dashboard data: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new CustomerDashboardService();