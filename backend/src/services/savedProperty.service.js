const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class SavedPropertyService {
  /**
   * Get saved properties for a user
   * @param {string} userId - User ID
   * @param {Object} options - Options for fetching
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} - Saved properties and count
   */
  async getSavedProperties(userId, options = {}) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      let query = supabase
        .from('saved_properties')
        .select(`
          id,
          user_id,
          property_id,
          created_at,
          properties:property_id (
            id,
            title,
            property_type,
            description,
            location,
            price,
            bedrooms,
            bathrooms,
            area_size,
            features,
            image_urls,
            featured_image,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Get total count first
      const { count, error: countError } = await supabase
        .from('saved_properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw new AppError(`Failed to count saved properties: ${countError.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Apply pagination if provided
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit;
        const to = from + options.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        throw new AppError(`Failed to fetch saved properties: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return {
        data,
        count,
        page: options.page,
        limit: options.limit,
        totalPages: options.page && options.limit ? Math.ceil(count / options.limit) : undefined
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in getSavedProperties: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Check if a property is saved by a user
   * @param {string} userId - User ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<boolean>} - True if property is saved
   */
  async isPropertySaved(userId, propertyId) {
    try {
      if (!userId || !propertyId) {
        throw new AppError('User ID and Property ID are required', StatusCodes.BAD_REQUEST);
      }

      const { data, error } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is fine
        throw new AppError(`Failed to check saved property: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return !!data; // Convert to boolean
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in isPropertySaved: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Save a property for a user
   * @param {string} userId - User ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Saved property
   */
  async saveProperty(userId, propertyId) {
    try {
      if (!userId || !propertyId) {
        throw new AppError('User ID and Property ID are required', StatusCodes.BAD_REQUEST);
      }

      // Check if property exists
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .single();

      if (propertyError || !property) {
        throw new AppError('Property not found', StatusCodes.NOT_FOUND);
      }

      // Check if already saved
      const alreadySaved = await this.isPropertySaved(userId, propertyId);
      if (alreadySaved) {
        throw new AppError('Property already saved', StatusCodes.CONFLICT);
      }

      // Save the property
      const { data, error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: userId,
          property_id: propertyId
        })
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to save property: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return data;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in saveProperty: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Unsave a property for a user
   * @param {string} userId - User ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Success message
   */
  async unsaveProperty(userId, propertyId) {
    try {
      if (!userId || !propertyId) {
        throw new AppError('User ID and Property ID are required', StatusCodes.BAD_REQUEST);
      }

      // Check if saved first
      const alreadySaved = await this.isPropertySaved(userId, propertyId);
      if (!alreadySaved) {
        throw new AppError('Property not saved', StatusCodes.NOT_FOUND);
      }

      // Delete the saved property
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) {
        throw new AppError(`Failed to unsave property: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { message: 'Property unsaved successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in unsaveProperty: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete all saved properties for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteAllSavedProperties(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', StatusCodes.BAD_REQUEST);
      }

      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new AppError(`Failed to delete saved properties: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return { message: 'All saved properties deleted successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(`Error in deleteAllSavedProperties: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new SavedPropertyService();