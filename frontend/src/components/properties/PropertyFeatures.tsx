'use client';

import { FiCheck } from 'react-icons/fi';

interface PropertyFeaturesProps {
  features: string[];
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  // Default features if none are provided or the array is empty
  const defaultFeatures = [
    'Parking',
    'Security',
    'Air Conditioning',
    'Balcony',
    'Garden',
    'Pool'
  ];
  
  // Use provided features or defaults
  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayFeatures.map((feature, index) => (
          <div key={index} className="flex items-center">
            <div className="p-1 rounded-full bg-primary-50 text-primary-600 mr-3">
              <FiCheck size={16} />
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}