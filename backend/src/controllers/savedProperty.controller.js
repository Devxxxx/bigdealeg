const savedPropertyService = require('../services/savedProperty.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class SavedPropertyController {
  /**
   * Get saved properties for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSavedProperties(req, res) {
    try {
      const userId = req.user.id;
      const options = {
        page: req.query.page ? parseInt(req.query.page) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined
      };

      const result = await savedPropertyService.getSavedProperties(userId, options);
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Check if a property is saved by the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async isPropertySaved(req, res) {
    try {
      const userId = req.user.id;
      const propertyId = req.params.propertyId;

      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }

      const isSaved = await savedPropertyService.isPropertySaved(userId, propertyId);
      
      res.status(StatusCodes.OK).json({ isSaved });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Save a property for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async saveProperty(req, res) {
    try {
      const userId = req.user.id;
      const propertyId = req.params.propertyId || req.body.propertyId;

      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }

      const result = await savedPropertyService.saveProperty(userId, propertyId);
      
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Unsave a property for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async unsaveProperty(req, res) {
    try {
      const userId = req.user.id;
      const propertyId = req.params.propertyId;

      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }

      const result = await savedPropertyService.unsaveProperty(userId, propertyId);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Delete all saved properties for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteAllSavedProperties(req, res) {
    try {
      const userId = req.user.id;

      const result = await savedPropertyService.deleteAllSavedProperties(userId);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new SavedPropertyController();