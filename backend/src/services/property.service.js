const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class PropertyService {
  /**
   * Get all properties
   * @returns {Promise<Object[]>} - Properties array
   */
  async getAllProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return data || [];
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to get properties', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get property by ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Property data
   */
  async getPropertyById(propertyId) {
    try {
      // Fetch the property details
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      if (!property) {
        throw new AppError('Property not found', StatusCodes.NOT_FOUND);
      }
      
      // Fetch property features
      const { data: features, error: featuresError } = await supabase
        .from('property_features')
        .select('feature_name')
        .eq('property_id', propertyId);
      
      if (featuresError) {
        throw new AppError(featuresError.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      // Fetch property images
      const { data: images, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('order', { ascending: true });
        
      if (imagesError) {
        throw new AppError(imagesError.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      // Group images by type
      const propertyImages = images?.filter(img => img.image_type === 'property') || [];
      const masterPlanImages = images?.filter(img => img.image_type === 'master_plan') || [];
      const compoundImages = images?.filter(img => img.image_type === 'compound') || [];
      
      // If we have features, add them to the property
      if (features && features.length > 0) {
        property.features = features.map(f => f.feature_name);
      } else {
        property.features = [];
      }
      
      // Add images to property
      property.images = {
        property: propertyImages,
        masterPlan: masterPlanImages,
        compound: compoundImages
      };
      
      // Set featured image if not already set
      if (!property.featured_image && propertyImages.length > 0) {
        const featuredImage = propertyImages.find(img => img.is_featured) || propertyImages[0];
        property.featured_image = featuredImage.image_url;
      }
      
      return property;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to get property', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise<Object>} - Created property
   */
  async createProperty(propertyData) {
    try {
      // Validate required fields
      if (!propertyData.title) {
        throw new AppError('Property title is required', StatusCodes.BAD_REQUEST);
      }
      
      if (!propertyData.property_type) {
        throw new AppError('Property type is required', StatusCodes.BAD_REQUEST);
      }
      
      if (!propertyData.location) {
        throw new AppError('Location is required', StatusCodes.BAD_REQUEST);
      }
      
      if (!propertyData.price || propertyData.price <= 0) {
        throw new AppError('Valid price is required', StatusCodes.BAD_REQUEST);
      }
      
      // Insert into properties table
      const { data: property, error } = await supabase
        .from('properties')
        .insert([{
          title: propertyData.title,
          description: propertyData.description,
          property_type: propertyData.property_type,
          location: propertyData.location,
          price: propertyData.price,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          area_size: propertyData.area_size,
          available: propertyData.available !== undefined ? propertyData.available : true,
          created_by: propertyData.created_by,
          project_name: propertyData.project_name,
          compound_name: propertyData.compound_name,
          developer_name: propertyData.developer_name,
          city: propertyData.city,
          geo_location: propertyData.geo_location ? `(${propertyData.geo_location.lng},${propertyData.geo_location.lat})` : null
        }])
        .select()
        .single();
      
      if (error) {
        throw new AppError(`Failed to create property: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      // If features are provided, insert them
      if (propertyData.features && Object.keys(propertyData.features).length > 0) {
        const featuresToInsert = Object.entries(propertyData.features)
          .filter(([_, enabled]) => enabled)
          .map(([featureName, _]) => ({
            property_id: property.id,
            feature_name: featureName
          }));
        
        if (featuresToInsert.length > 0) {
          const { error: featuresError } = await supabase
            .from('property_features')
            .insert(featuresToInsert);
          
          if (featuresError) {
            console.error('Failed to insert property features:', featuresError);
          }
        }
      }
      
      return property;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to create property', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Upload property images
   * @param {string} propertyId - Property ID
   * @param {Array} images - Array of image objects with url and type
   * @returns {Promise<Object>} - Uploaded images info
   */
  async uploadPropertyImages(propertyId, images) {
    try {
      if (!propertyId) {
        throw new AppError('Property ID is required', StatusCodes.BAD_REQUEST);
      }
      
      if (!images || !Array.isArray(images) || images.length === 0) {
        throw new AppError('Images are required', StatusCodes.BAD_REQUEST);
      }
      
      // Prepare images data for insertion
      const imagesToInsert = images.map((img, index) => ({
        property_id: propertyId,
        image_url: img.url,
        image_type: img.type || 'property',
        is_featured: index === 0, // First image is featured by default
        order: index
      }));
      
      // Insert images
      const { data, error } = await supabase
        .from('property_images')
        .insert(imagesToInsert)
        .select();
      
      if (error) {
        throw new AppError(`Failed to upload images: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      // Update property's featured_image with the first image
      if (imagesToInsert.length > 0 && imagesToInsert[0].is_featured) {
        const { error: updateError } = await supabase
          .from('properties')
          .update({ featured_image: imagesToInsert[0].image_url })
          .eq('id', propertyId);
        
        if (updateError) {
          console.error('Failed to update property featured image:', updateError);
        }
      }
      
      return { images: data };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to upload property images', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get similar properties
   * @param {string} propertyId - Reference property ID
   * @param {number} limit - Maximum number of properties to return
   * @returns {Promise<Object[]>} - Similar properties array
   */
  async getSimilarProperties(propertyId, limit = 3) {
    try {
      // First get the reference property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (propertyError) {
        throw new AppError(propertyError.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      if (!property) {
        throw new AppError('Reference property not found', StatusCodes.NOT_FOUND);
      }
      
      // Get similar properties
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .neq('id', propertyId) // Exclude current property
        .or(`property_type.eq.${property.property_type},location.eq.${property.location},compound_name.eq.${property.compound_name},project_name.eq.${property.project_name},developer_name.eq.${property.developer_name}`)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return data || [];
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to get similar properties', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Increment property views
   * @param {string} propertyId - Property ID
   * @returns {Promise<void>}
   */
  async incrementPropertyViews(propertyId) {
    try {
      // First get the current views count
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('views_count')
        .eq('id', propertyId)
        .single();
      
      if (fetchError) {
        throw new AppError(fetchError.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      if (!property) {
        throw new AppError('Property not found', StatusCodes.NOT_FOUND);
      }
      
      // Increment the views count
      const newCount = (property.views_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('properties')
        .update({ views_count: newCount })
        .eq('id', propertyId);
      
      if (updateError) {
        throw new AppError(updateError.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to increment property views', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get property images
   * @param {string} propertyId - Property ID
   * @param {string} type - Image type (property, master_plan, compound)
   * @returns {Promise<Object[]>} - Property images
   */
  async getPropertyImages(propertyId, type = null) {
    try {
      let query = supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('order', { ascending: true });
      
      // Filter by type if provided
      if (type) {
        query = query.eq('image_type', type);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return data || [];
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to get property images', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update property
   * @param {string} propertyId - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise<Object>} - Updated property
   */
  async updateProperty(propertyId, propertyData) {
    try {
      if (!propertyId) {
        throw new AppError('Property ID is required', StatusCodes.BAD_REQUEST);
      }
      
      // Prepare update data
      const updateData = {};
      
      // Only include fields that are provided
      if (propertyData.title !== undefined) updateData.title = propertyData.title;
      if (propertyData.description !== undefined) updateData.description = propertyData.description;
      if (propertyData.property_type !== undefined) updateData.property_type = propertyData.property_type;
      if (propertyData.location !== undefined) updateData.location = propertyData.location;
      if (propertyData.price !== undefined) updateData.price = propertyData.price;
      if (propertyData.bedrooms !== undefined) updateData.bedrooms = propertyData.bedrooms;
      if (propertyData.bathrooms !== undefined) updateData.bathrooms = propertyData.bathrooms;
      if (propertyData.area_size !== undefined) updateData.area_size = propertyData.area_size;
      if (propertyData.available !== undefined) updateData.available = propertyData.available;
      if (propertyData.featured_image !== undefined) updateData.featured_image = propertyData.featured_image;
      if (propertyData.project_name !== undefined) updateData.project_name = propertyData.project_name;
      if (propertyData.compound_name !== undefined) updateData.compound_name = propertyData.compound_name;
      if (propertyData.developer_name !== undefined) updateData.developer_name = propertyData.developer_name;
      if (propertyData.city !== undefined) updateData.city = propertyData.city;
      if (propertyData.geo_location !== undefined) {
        updateData.geo_location = propertyData.geo_location ? 
          `(${propertyData.geo_location.lng},${propertyData.geo_location.lat})` : null;
      }
      
      // Update property
      const { data: property, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .select()
        .single();
      
      if (error) {
        throw new AppError(`Failed to update property: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      // Update features if provided
      if (propertyData.features && Object.keys(propertyData.features).length > 0) {
        // First delete existing features
        const { error: deleteError } = await supabase
          .from('property_features')
          .delete()
          .eq('property_id', propertyId);
        
        if (deleteError) {
          console.error('Failed to delete existing property features:', deleteError);
        }
        
        // Then insert new features
        const featuresToInsert = Object.entries(propertyData.features)
          .filter(([_, enabled]) => enabled)
          .map(([featureName, _]) => ({
            property_id: propertyId,
            feature_name: featureName
          }));
        
        if (featuresToInsert.length > 0) {
          const { error: featuresError } = await supabase
            .from('property_features')
            .insert(featuresToInsert);
          
          if (featuresError) {
            console.error('Failed to insert property features:', featuresError);
          }
        }
      }
      
      return property;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to update property', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete property image
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} - Success message
   */
  async deletePropertyImage(imageId) {
    try {
      if (!imageId) {
        throw new AppError('Image ID is required', StatusCodes.BAD_REQUEST);
      }
      
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);
      
      if (error) {
        throw new AppError(`Failed to delete image: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return { message: 'Image deleted successfully' };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to delete property image', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new PropertyService();