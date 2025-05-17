'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyGalleryProps {
  images: string[];
  featuredImage?: string;
  title: string;
}

export default function PropertyGallery({ images, featuredImage, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const allImages = featuredImage 
    ? [featuredImage, ...images.filter(img => img !== featuredImage)]
    : images;
  
  // Use a placeholder if no images are available
  const effectiveImages = allImages.length > 0 
    ? allImages 
    : ['/api/placeholder/800/500'];
  
  const handlePrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? effectiveImages.length - 1 : prev - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => 
      prev === effectiveImages.length - 1 ? 0 : prev + 1
    );
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className="relative">
      {/* Main gallery display */}
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={effectiveImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
          aria-label="Previous image"
        >
          <FiChevronLeft size={20} />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
          aria-label="Next image"
        >
          <FiChevronRight size={20} />
        </button>
        
        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="absolute right-4 bottom-4 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
          aria-label="Toggle fullscreen"
        >
          <FiMaximize2 size={20} />
        </button>
        
        {/* Image counter */}
        <div className="absolute left-4 bottom-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
          {currentIndex + 1} / {effectiveImages.length}
        </div>
      </div>
      
      {/* Thumbnail navigation - only show if more than 1 image */}
      {effectiveImages.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto py-2">
          {effectiveImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-primary-500 opacity-100' : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          >
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
              aria-label="Close fullscreen"
            >
              <FiX size={24} />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={effectiveImages[currentIndex]}
                alt={`${title} - Fullscreen Image ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
              
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all text-white"
                aria-label="Previous image"
              >
                <FiChevronLeft size={24} />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all text-white"
                aria-label="Next image"
              >
                <FiChevronRight size={24} />
              </button>
              
              <div className="absolute left-4 bottom-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full">
                {currentIndex + 1} / {effectiveImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}