const adminService = require('../services/admin.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class AdminController {
  /**
   * Get dashboard data including stats, activities, and alerts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDashboardData(req, res) {
    try {
      const statsPromise = adminService.getDashboardStats();
      const activitiesPromise = adminService.getRecentActivities();
      const alertsPromise = adminService.getSystemAlerts();

      const [stats, activities, alerts] = await Promise.all([
        statsPromise,
        activitiesPromise,
        alertsPromise
      ]);

      res.status(StatusCodes.OK).json({
        stats,
        activities,
        alerts
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get users with filtering, pagination, and sorting
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUsers(req, res) {
    try {
      const options = {
        searchTerm: req.query.searchTerm,
        roleFilter: req.query.roleFilter || 'all',
        sortField: req.query.sortField || 'created_at',
        sortDirection: req.query.sortDirection || 'desc',
        page: req.query.page ? parseInt(req.query.page) : 0,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10
      };

      const result = await adminService.getUsers(options);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get user by ID with activity, properties, and requests
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      const result = await adminService.getUserById(userId);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update user role
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserRole(req, res) {
    try {
      const userId = req.params.userId;
      const { role } = req.body;

      if (!role) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Role is required'
          }
        });
      }

      const user = await adminService.updateUserRole(userId, role);
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Toggle user active status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async toggleUserStatus(req, res) {
    try {
      const userId = req.params.userId;
      const { is_active } = req.body;
      
      if (is_active === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'is_active status is required'
          }
        });
      }
      
      const user = await adminService.toggleUserStatus(userId, is_active);
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Delete a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      await adminService.deleteUser(userId);
      res.status(StatusCodes.OK).json({ message: 'User deleted successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get all form fields
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFormFields(req, res) {
    try {
      const fields = await adminService.getFormFields();
      res.status(StatusCodes.OK).json({ fields });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Create a new form field
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createFormField(req, res) {
    try {
      const fieldData = req.body;
      const field = await adminService.createFormField(fieldData);
      res.status(StatusCodes.CREATED).json({ field });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Update an existing form field
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateFormField(req, res) {
    try {
      const fieldId = req.params.fieldId;
      const fieldData = req.body;
      const field = await adminService.updateFormField(fieldId, fieldData);
      res.status(StatusCodes.OK).json({ field });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Delete a form field
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteFormField(req, res) {
    try {
      const fieldId = req.params.fieldId;
      await adminService.deleteFormField(fieldId);
      res.status(StatusCodes.OK).json({ message: 'Field deleted successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Toggle a field's required status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async toggleFieldRequired(req, res) {
    try {
      const fieldId = req.params.fieldId;
      const { required } = req.body;
      const field = await adminService.toggleFieldRequired(fieldId, required);
      res.status(StatusCodes.OK).json({ field });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Update a field's order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateFieldOrder(req, res) {
    try {
      const fieldId = req.params.fieldId;
      const { order, targetOrder } = req.body;

      // Validate input
      if (order === undefined || targetOrder === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Both order and targetOrder are required'
          }
        });
      }
      
      await adminService.updateFieldOrder(fieldId, order, targetOrder);
      res.status(StatusCodes.OK).json({ message: 'Field order updated successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get system settings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSettings(req, res) {
    try {
      const settings = await adminService.getSettings();
      res.status(StatusCodes.OK).json({ settings });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Update system settings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateSettings(req, res) {
    try {
      const settingsData = req.body;
      const settings = await adminService.updateSettings(settingsData);
      res.status(StatusCodes.OK).json({ settings });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Reset system settings to default
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetSettings(req, res) {
    try {
      const settings = await adminService.resetSettings();
      res.status(StatusCodes.OK).json({ settings });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new AdminController();