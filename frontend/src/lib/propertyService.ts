'use client';

import propertyApi from './api/property';
import savedPropertyApi from './api/savedProperty';

// Define types for property data
export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  location: string;
  price: number;
  bedrooms: string | number;
  bathrooms: string | number;
  area_size: number;
  features: string[];
  available: boolean;
  image_urls: string[];
  featured_image: string;
  created_at: string;
  created_by: string;
}

export interface PropertyFeature {
  id: string;
  property_id: string;
  feature_name: string;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const property = await propertyApi.getPropertyById(id);
    return property;
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    return null;
  }
}

export async function getSimilarProperties(property: Property, limit: number = 3): Promise<Property[]> {
  try {
    const properties = await propertyApi.getSimilarProperties(property.id, limit);
    return properties;
  } catch (error) {
    console.error('Error in getSimilarProperties:', error);
    return [];
  }
}

export async function incrementPropertyViews(id: string): Promise<void> {
  try {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      console.error('No access token available');
      return;
    }
    
    await propertyApi.incrementPropertyViews(id, token);
  } catch (error) {
    console.error('Error in incrementPropertyViews:', error);
  }
}

// Get the access token for API calls
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export async function saveProperty(userId: string, propertyId: string): Promise<boolean> {
  try {
    const token = getAccessToken();
    if (!token) {
      console.error('No access token available');
      return false;
    }
    
    await savedPropertyApi.saveProperty(token, propertyId);
    return true;
  } catch (error) {
    console.error('Error in saveProperty:', error);
    return false;
  }
}

export async function unsaveProperty(userId: string, propertyId: string): Promise<boolean> {
  try {
    const token = getAccessToken();
    if (!token) {
      console.error('No access token available');
      return false;
    }
    
    await savedPropertyApi.unsaveProperty(token, propertyId);
    return true;
  } catch (error) {
    console.error('Error in unsaveProperty:', error);
    return false;
  }
}

export async function isPropertySaved(userId: string, propertyId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const token = getAccessToken();
    if (!token) {
      console.error('No access token available');
      return false;
    }
    
    return await savedPropertyApi.isPropertySaved(token, propertyId);
  } catch (error) {
    console.error('Error in isPropertySaved:', error);
    return false;
  }
}