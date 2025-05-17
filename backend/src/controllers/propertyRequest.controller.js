const propertyRequestService = require('../services/propertyRequest.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const authSupabase = require('../utils/authSupabase');
class PropertyRequestController {
  /**
   * Get all property requests
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyRequests(req, res) {
    try {
      // For sales_ops and admin users, they can view all requests if viewAll flag is true
      // Otherwise, users only see their own requests
      const userRole = req.user.role;
      const viewAll = req.query.viewAll === 'true' && ['sales_ops', 'admin'].includes(userRole);
      
      // Force userId for customers regardless of viewAll parameter
      const userId = userRole === 'customer' ? req.user.id : (viewAll ? undefined : req.user.id);
      
      const filters = {
        userId: userId,
        status: req.query.status,
        location: req.query.location,
        property_type: req.query.property_type,
        searchTerm: req.query.searchTerm,
        role: req.user.role,
        sortBy: req.query.sortField || req.query.sortBy,
        sortDirection: req.query.sortDirection || 'desc',
        page: req.query.page ? parseInt(req.query.page) : undefined,
        pageSize: req.query.pageSize || req.query.limit ? parseInt(req.query.pageSize || req.query.limit) : undefined,
        salesOpsId: req.user.id,
        onlyMine: req.query.onlyMine === 'true',
        // Pass viewAll flag to service
        viewAll: viewAll
      };

      console.log("Processed filters for property requests:", {
        userId: filters.userId,
        role: filters.role,
        viewAll: filters.viewAll
      });
      
      const { data, count } = await propertyRequestService.getPropertyRequests(filters);

      // Log the data structure for debugging
      console.log(`Retrieved ${data?.length || 0} property requests for user ${filters.userId}`);

      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.status(StatusCodes.OK).json({
        requests: data,
        totalCount: count,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: filters.page !== undefined && filters.pageSize !== undefined ? Math.ceil(count / filters.pageSize) : undefined
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get a property request by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */


  async getPropertyRequestById(req, res) {
    try {
      const requestId = req.params.id;
      const accessToken = req.headers.authorization?.split(' ')[1];

      if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: 'Authentication required'
        });
      }

      // Create authenticated client
      const supabase = authSupabase(accessToken);

      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await propertyRequestService.getPropertyRequestById(
          requestId,
          options,
          supabase // Pass the authenticated client
      );

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }
  /**
   * Create a property request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createPropertyRequest(req, res) {
    try {
      const userId = req.user.id;
      const requestData = req.body;

      const data = await propertyRequestService.createPropertyRequest(requestData, userId);

      res.status(StatusCodes.CREATED).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update a property request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyRequest(req, res) {
    try {
      const requestId = req.params.id;
      const updateData = req.body;
      
      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await propertyRequestService.updatePropertyRequest(requestId, updateData, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Delete a property request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deletePropertyRequest(req, res) {
    try {
      const requestId = req.params.id;
      
      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await propertyRequestService.deletePropertyRequest(requestId, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get all property request fields
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyRequestFields(req, res) {
    try {
      const data = await propertyRequestService.getPropertyRequestFields();

      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Assign a property request to a sales operator
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async assignPropertyRequest(req, res) {
    try {
      const requestId = req.params.id;
      const { salesOpId, notes } = req.body;

      if (!salesOpId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Sales operator ID is required'
          }
        });
      }

      const options = {
        userId: req.user.id,
        notes
      };

      const data = await propertyRequestService.assignPropertyRequest(requestId, salesOpId, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Add a status update to a property request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addStatusUpdate(req, res) {
    try {
      const requestId = req.params.id;
      const statusData = req.body;
      const userId = req.user.id;

      if (!statusData.status) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Status is required'
          }
        });
      }

      const data = await propertyRequestService.addStatusUpdate(requestId, statusData, userId);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new PropertyRequestController();