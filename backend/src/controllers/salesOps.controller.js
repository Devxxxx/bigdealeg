const salesOpsService = require('../services/salesOps.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class SalesOpsController {
  /**
   * Get dashboard data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDashboardData(req, res) {
    try {
      const data = await salesOpsService.getDashboardData();
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get properties with filters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProperties(req, res) {
    try {
      const options = {
        search: req.query.search,
        location: req.query.location,
        property_type: req.query.property_type,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        available: req.query.available,
        sortField: req.query.sortField || 'created_at',
        sortDirection: req.query.sortDirection || 'desc',
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10
      };

      const result = await salesOpsService.getProperties(options);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Toggle property availability
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async togglePropertyAvailability(req, res) {
    try {
      const propertyId = req.params.id;
      const { currentStatus } = req.body;

      if (currentStatus === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Current availability status is required'
          }
        });
      }

      const property = await salesOpsService.togglePropertyAvailability(propertyId, currentStatus);
      res.status(StatusCodes.OK).json({ property });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Delete a property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteProperty(req, res) {
    try {
      const propertyId = req.params.id;
      const result = await salesOpsService.deleteProperty(propertyId);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get property requests with filters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyRequests(req, res) {
    try {
      const options = {
        search: req.query.search,
        status: req.query.status,
        location: req.query.location,
        property_type: req.query.property_type,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        sortField: req.query.sortField || 'created_at',
        sortDirection: req.query.sortDirection || 'desc',
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10
      };

      const result = await salesOpsService.getPropertyRequests(options);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Create a new property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createProperty(req, res) {
    try {
      const propertyData = req.body;
      
      // Add user ID as creator
      propertyData.created_by = req.user.id;

      const property = await salesOpsService.createProperty(propertyData);
      res.status(StatusCodes.CREATED).json({ property });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get property request by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyRequestById(req, res) {
    try {
      const requestId = req.params.id;
      const request = await salesOpsService.getPropertyRequestById(requestId);
      res.status(StatusCodes.OK).json({ request });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update property request status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyRequestStatus(req, res) {
    try {
      const requestId = req.params.id;
      const { status } = req.body;
      
      if (!status) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Status is required'
          }
        });
      }

      const request = await salesOpsService.updatePropertyRequestStatus(requestId, status);
      res.status(StatusCodes.OK).json({ request });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get scheduled viewings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getScheduledViewings(req, res) {
    try {
      const options = {
        search: req.query.search,
        status: req.query.status,
        propertyId: req.query.propertyId,
        fromDate: req.query.fromDate,
        toDate: req.query.toDate,
        sortField: req.query.sortField || 'viewing_date',
        sortDirection: req.query.sortDirection || 'asc',
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10
      };

      const result = await salesOpsService.getScheduledViewings(options);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get scheduled viewing by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getScheduledViewingById(req, res) {
    try {
      const viewingId = req.params.id;
      const viewing = await salesOpsService.getScheduledViewingById(viewingId);
      res.status(StatusCodes.OK).json({ viewing });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get status history for a property request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyRequestStatusHistory(req, res) {
    try {
      const requestId = req.params.id;
      const statusHistory = await salesOpsService.getPropertyRequestStatusHistory(requestId);
      res.status(StatusCodes.OK).json({ statusHistory });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update property request status with history
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyRequestStatusWithHistory(req, res) {
    try {
      const requestId = req.params.id;
      const { status, notes, isPrivate } = req.body;
      const userId = req.user.id;
      
      if (!status) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Status is required'
          }
        });
      }

      const result = await salesOpsService.updatePropertyRequestStatusWithHistory(
        requestId, 
        status, 
        notes, 
        isPrivate, 
        userId
      );
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get matched properties for a property request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMatchedProperties(req, res) {
    try {
      const requestId = req.params.id;
      const properties = await salesOpsService.getMatchedProperties(requestId);
      res.status(StatusCodes.OK).json({ properties });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get user profile by ID 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await salesOpsService.getUserById(userId);
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new SalesOpsController();