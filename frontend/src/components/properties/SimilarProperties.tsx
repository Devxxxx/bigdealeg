'use client';

import { useState, useEffect } from 'react';
import { Property, getSimilarProperties } from '@/lib/propertyService';
import PropertyCard from './PropertyCard';

interface SimilarPropertiesProps {
  currentProperty: Property;
}

export default function SimilarProperties({ currentProperty }: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        setLoading(true);
        const similarProperties = await getSimilarProperties(currentProperty, 3);
        setProperties(similarProperties);
      } catch (error) {
        console.error('Error fetching similar properties:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilarProperties();
  }, [currentProperty]);
  
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-xl"></div>
              <div className="bg-white p-4 rounded-b-xl border border-gray-200">
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (properties.length === 0) {
    return null; // Don't show section if no similar properties
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={{
              id: property.id,
              title: property.title,
              location: property.location,
              price: property.price,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              area_size: property.area_size,
              image_url: property.featured_image || (property.image_urls && property.image_urls.length > 0 ? property.image_urls[0] : undefined),
              property_type: property.property_type
            }}
          />
        ))}
      </div>
    </div>
  );
}