'use client';

import { FiMapPin } from 'react-icons/fi';

interface PropertyLocationProps {
  location: string;
}

export default function PropertyLocation({ location }: PropertyLocationProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
      
      <div className="rounded-xl overflow-hidden">
        {/* Placeholder for an actual map - in a real implementation, this would use Google Maps or similar */}
        <div className="bg-gray-100 h-64 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <FiMapPin className="text-primary-600 mb-2" size={32} />
            <p className="text-gray-700 font-medium">{location}</p>
            <p className="text-sm text-gray-500 mt-1">Map view is not available in this demo</p>
          </div>
          
          {/* Overlay with location name */}
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3">
            <div className="flex items-center">
              <FiMapPin className="text-primary-600 mr-2" />
              <span className="font-medium">{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}