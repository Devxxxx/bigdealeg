const propertyService = require('../services/property.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class PropertyController {
  /**
   * Get all properties
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllProperties(req, res) {
    try {
      const properties = await propertyService.getAllProperties();
      
      res.status(StatusCodes.OK).json({ properties });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get property by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyById(req, res) {
    try {
      const propertyId = req.params.id;
      
      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }
      
      const property = await propertyService.getPropertyById(propertyId);
      
      res.status(StatusCodes.OK).json({ property });
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
      
      // Set created_by to the authenticated user
      propertyData.created_by = req.user.id;
      
      const property = await propertyService.createProperty(propertyData);
      
      res.status(StatusCodes.CREATED).json({ property });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProperty(req, res) {
    try {
      const propertyId = req.params.id;
      const propertyData = req.body;
      
      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }
      
      const property = await propertyService.updateProperty(propertyId, propertyData);
      
      res.status(StatusCodes.OK).json({ property });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Upload property images
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async uploadPropertyImages(req, res) {
    try {
      const propertyId = req.params.id;
      const { images } = req.body;
      
      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }
      
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Images are required'
          }
        });
      }
      
      const result = await propertyService.uploadPropertyImages(propertyId, images);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Delete property image
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deletePropertyImage(req, res) {
    try {
      const imageId = req.params.imageId;
      
      if (!imageId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Image ID is required'
          }
        });
      }
      
      const result = await propertyService.deletePropertyImage(imageId);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get similar properties
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSimilarProperties(req, res) {
    try {
      const propertyId = req.params.id;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 3;
      
      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }
      
      const properties = await propertyService.getSimilarProperties(propertyId, limit);
      
      res.status(StatusCodes.OK).json({ properties });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Increment property views
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async incrementPropertyViews(req, res) {
    try {
      const propertyId = req.params.id;
      
      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }
      
      await propertyService.incrementPropertyViews(propertyId);
      
      res.status(StatusCodes.OK).json({ message: 'Property views incremented successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get property images
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyImages(req, res) {
    try {
      const propertyId = req.params.id;
      const type = req.query.type;
      
      if (!propertyId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Property ID is required'
          }
        });
      }
      
      const images = await propertyService.getPropertyImages(propertyId, type);
      
      res.status(StatusCodes.OK).json({ images });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new PropertyController();