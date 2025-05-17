const scheduledViewingService = require('../services/scheduledViewing.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const notificationService = require('../services/notification.service'); // Add this for notifications

class ScheduledViewingController {
  /**
   * Get all scheduled viewings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getScheduledViewings(req, res) {
    try {
      // For sales_ops and admin users, they can view all viewings if viewAll flag is true
      // Otherwise, users only see their own viewings
      const userRole = req.user.role;
      const viewAll = req.query.viewAll === 'true' && ['sales_ops', 'admin'].includes(userRole);
      
      // Force userId for customers regardless of viewAll parameter
      const userId = userRole === 'customer' ? req.user.id : (viewAll ? undefined : req.user.id);
      
      const filters = {
        userId: userId,
        propertyId: req.query.propertyId,
        status: req.query.status,
        requestId: req.query.requestId,
        fromDate: req.query.fromDate,
        toDate: req.query.toDate,
        role: req.user.role,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection || 'asc',
        page: req.query.page ? parseInt(req.query.page) : undefined,
        pageSize: req.query.pageSize || req.query.limit ? parseInt(req.query.pageSize || req.query.limit) : undefined,
        // Pass viewAll flag to service
        viewAll: viewAll
      };
      
      console.log("Processed filters for scheduled viewings:", {
        userId: filters.userId,
        role: filters.role,
        viewAll: filters.viewAll
      });

      const { data, count } = await scheduledViewingService.getScheduledViewings(filters);
      
      // Log the data structure for debugging
      console.log(`Retrieved ${data?.length || 0} scheduled viewings for user ${filters.userId}`);

      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.status(StatusCodes.OK).json({
        viewings: data,
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
   * Get a scheduled viewing by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getScheduledViewingById(req, res) {
    try {
      const viewingId = req.params.id;
      
      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.getScheduledViewingById(viewingId, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Create a scheduled viewing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createScheduledViewing(req, res) {
    try {
      const userId = req.user.id;
      const viewingData = req.body;

      const data = await scheduledViewingService.createScheduledViewing(viewingData, userId);

      res.status(StatusCodes.CREATED).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update a scheduled viewing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateScheduledViewing(req, res) {
    try {
      const viewingId = req.params.id;
      const updateData = req.body;
      
      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.updateScheduledViewing(viewingId, updateData, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Delete a scheduled viewing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteScheduledViewing(req, res) {
    try {
      const viewingId = req.params.id;
      
      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.deleteScheduledViewing(viewingId, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Propose viewing slots
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async proposeViewingSlots(req, res) {
    try {
      const viewingId = req.params.id;
      const proposalData = req.body;

      if (!proposalData.proposed_dates || !Array.isArray(proposalData.proposed_dates) || proposalData.proposed_dates.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'At least one proposed date is required'
          }
        });
      }

      if (!proposalData.proposed_times || !Array.isArray(proposalData.proposed_times) || proposalData.proposed_times.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'At least one proposed time is required'
          }
        });
      }

      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.proposeViewingSlots(viewingId, proposalData, options);

      // Note: Notifications are disabled as they require additional setup
      // In a production environment, you would send a notification to the customer here
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Select viewing slot
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async selectViewingSlot(req, res) {
    try {
      const viewingId = req.params.id;
      const selectionData = req.body;

      if (!selectionData.selected_date) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Selected date is required'
          }
        });
      }

      if (!selectionData.selected_time) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Selected time is required'
          }
        });
      }

      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.selectViewingSlot(viewingId, selectionData, options);

      // Send notification to sales team about customer's selection
      try {
        // In a real application, you would notify the specific sales agent
        // Here we're using a placeholder for admin notification
        const adminIds = await getAdminIds(); // This function would get your admin/sales team IDs
        
        for (const adminId of adminIds) {
          await notificationService.createNotification({
            user_id: adminId,
            title: 'Customer selected viewing time',
            message: `A customer has selected a time slot for property: ${data.property?.title}`,
            type: 'viewing',
            link: `/admin/scheduled-viewings/${viewingId}`,
            is_read: false
          });
        }
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Confirm a scheduled viewing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async confirmScheduledViewing(req, res) {
    try {
      const viewingId = req.params.id;
      const confirmData = req.body;

      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.confirmScheduledViewing(viewingId, confirmData, options);

      // Send notification to customer about confirmation
      try {
        await notificationService.createNotification({
          user_id: data.user_id,
          title: 'Viewing appointment confirmed',
          message: `Your viewing appointment for ${data.property?.title} has been confirmed for ${new Date(data.viewing_date).toLocaleDateString()} at ${data.viewing_time}.`,
          type: 'viewing',
          link: `/dashboard/scheduled-viewings/${viewingId}`,
          is_read: false
        });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError);
      }

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Cancel a scheduled viewing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async cancelScheduledViewing(req, res) {
    try {
      const viewingId = req.params.id;
      const cancelData = req.body;
      
      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.cancelScheduledViewing(viewingId, cancelData, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Complete a scheduled viewing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async completeScheduledViewing(req, res) {
    try {
      const viewingId = req.params.id;
      const completeData = req.body;
      
      const options = {
        userId: req.user.id,
        role: req.user.role
      };

      const data = await scheduledViewingService.completeScheduledViewing(viewingId, completeData, options);

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new ScheduledViewingController();