'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiHome, FiMaximize2, FiGrid, FiList, 
  FiX, FiChevronDown, FiHeart, FiDollarSign,FiHeart as FiBed,FiHeart as FiBath, FiStar, FiShield } from 'react-icons/fi';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormField from '@/components/common/FormField';

const PROPERTY_TYPES = [
  'All Types', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 
  'Chalet', 'Duplex', 'Office', 'Shop', 'Land'
];

const PRICE_RANGES = [
  'Any Price', 'Under 1M EGP', '1M - 3M EGP', '3M - 5M EGP', 
  '5M - 10M EGP', 'Over 10M EGP'
];

const LOCATIONS = [
  'All Locations', 'New Cairo', 'Maadi', '6th of October',
  'Sheikh Zayed', 'Garden City', 'Heliopolis', 'Downtown'
];

const DEMO_PROPERTIES = [
  {
    id: 1,
    title: 'Modern Apartment in New Cairo',
    type: 'Apartment',
    location: 'New Cairo, 5th Settlement',
    price: 2800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: '/api/placeholder/600/400',
    featured: true,
    tags: ['New', 'Furnished'],
    verified: true
  },
  {
    id: 2,
    title: 'Spacious Villa with Garden',
    type: 'Villa',
    location: 'Sheikh Zayed, Entrance 5',
    price: 15000000,
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    image: '/api/placeholder/600/400',
    featured: false,
    tags: ['Pool', 'Garden'],
    verified: true
  },
  {
    id: 3,
    title: 'Luxury Penthouse with Nile View',
    type: 'Penthouse',
    location: 'Garden City, Nile Corniche',
    price: 8500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    image: '/api/placeholder/600/400',
    featured: true,
    tags: ['River View', 'Premium'],
    verified: true
  },
  {
    id: 4,
    title: 'Townhouse in 6th of October',
    type: 'Townhouse',
    location: '6th of October, Zayed Dunes',
    price: 4200000,
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    image: '/api/placeholder/600/400',
    featured: false,
    tags: ['Corner Unit', 'Private Garden'],
    verified: false
  },
  {
    id: 5,
    title: 'Office Space in Downtown',
    type: 'Office',
    location: 'Downtown, Cairo',
    price: 3500000,
    bedrooms: null,
    bathrooms: 2,
    area: 150,
    image: '/api/placeholder/600/400',
    featured: false,
    tags: ['Commercial', 'Ready for Business'],
    verified: true
  },
  {
    id: 6,
    title: 'Beachfront Chalet in North Coast',
    type: 'Chalet',
    location: 'North Coast, Marina',
    price: 2100000,
    bedrooms: 2,
    bathrooms: 1,
    area: 120,
    image: '/api/placeholder/600/400',
    featured: true,
    tags: ['Sea View', 'Resort'],
    verified: false
  }
];

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [favoriteProperties, setFavoriteProperties] = useState<number[]>([]);

  // Format price with commas and EGP
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " EGP";
  };

  // Toggle favorite status
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteProperties(prev => 
      prev.includes(id) ? prev.filter(propId => propId !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties for Sale</h1>
        <p className="text-gray-600">Browse our curated selection of properties across Egypt</p>
      </motion.div>

      {/* Hero Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl overflow-hidden shadow-lg"
      >
        <div className="px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Find Your Dream Property</h2>
          <p className="mb-6 opacity-90">Search from thousands of properties with direct access to sellers</p>
          
          <div className="bg-white rounded-xl p-1 shadow-inner flex flex-col md:flex-row">
            <div className="flex-grow p-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by property name, location, or features..."
                  leftIcon={<FiSearch className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 border-0 shadow-none focus:ring-0"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center p-2 space-x-2">
              <Button
                variant={showFilters ? "primary" : "light"}
                leftIcon={<FiFilter />}
                onClick={() => setShowFilters(!showFilters)}
                size="md"
              >
                Filters
              </Button>
              
              <Button
                variant="gradient"
                size="md"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <Card className="p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    className="block w-full rounded-lg border-gray-200 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    className="block w-full rounded-lg border-gray-200 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    {PRICE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    className="block w-full rounded-lg border-gray-200 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {LOCATIONS.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                <FormField label="Bedrooms" htmlFor="bedrooms">
                  <div className="flex space-x-2">
                    <Input
                      id="minBedrooms"
                      type="number"
                      placeholder="Min"
                      min={0}
                      className="w-full"
                    />
                    <Input
                      id="maxBedrooms"
                      type="number"
                      placeholder="Max"
                      min={0}
                      className="w-full"
                    />
                  </div>
                </FormField>

                <FormField label="Bathrooms" htmlFor="bathrooms">
                  <div className="flex space-x-2">
                    <Input
                      id="minBathrooms"
                      type="number"
                      placeholder="Min"
                      min={0}
                      className="w-full"
                    />
                    <Input
                      id="maxBathrooms"
                      type="number"
                      placeholder="Max"
                      min={0}
                      className="w-full"
                    />
                  </div>
                </FormField>

                <FormField label="Area (sqm)" htmlFor="area">
                  <div className="flex space-x-2">
                    <Input
                      id="minArea"
                      type="number"
                      placeholder="Min"
                      min={0}
                      className="w-full"
                    />
                    <Input
                      id="maxArea"
                      type="number"
                      placeholder="Max"
                      min={0}
                      className="w-full"
                    />
                  </div>
                </FormField>

                <div className="flex items-end">
                  <Button variant="gradient" fullWidth>
                    Apply Filters
                  </Button>
                </div>
              </div>
              
              {/* Additional Features */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Garden', 'Pool', 'Parking', 'Security', 'Elevator', 'Balcony', 'Sea View', 'Finished'].map((feature) => (
                    <div key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${feature}`}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-600">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Property Count and View Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-gray-600">Showing {DEMO_PROPERTIES.length} properties</p>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
            <select
              id="sort"
              className="rounded-lg border-gray-200 py-1.5 px-3 text-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
              <option>Newest</option>
              <option>Price (Low to High)</option>
              <option>Price (High to Low)</option>
              <option>Area (Largest first)</option>
            </select>
          </div>
          
          <div className="hidden md:flex border rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-primary-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-primary-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      <div className="mb-10">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_PROPERTIES.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/properties/${property.id}`}>
                  <Card 
                    className="h-full overflow-hidden transition-all duration-300 group"
                    hover={true}
                    clickable={true}
                    padding="none"
                  >
                    <div className="relative">
                      {property.featured && (
                        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          Featured
                        </div>
                      )}
                      {property.verified && (
                        <div className="absolute top-3 right-3 z-10 bg-white text-primary-600 text-xs font-bold p-1 rounded-full shadow-sm">
                          <FiShield className="h-4 w-4" />
                        </div>
                      )}
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={property.image} 
                          alt={property.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        ></div>
                        <button 
                          onClick={(e) => toggleFavorite(property.id, e)}
                          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                            favoriteProperties.includes(property.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                          }`}
                        >
                          <FiHeart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center text-primary-600 text-sm font-medium mb-1">
                        <FiHome className="mr-1" /> {property.type}
                        {property.tags && property.tags.length > 0 && (
                          <div className="ml-2 flex flex-wrap gap-1">
                            {property.tags.map(tag => (
                              <span key={tag} className="bg-primary-50 text-primary-700 text-xs px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <FiMapPin className="mr-1 flex-shrink-0" /> {property.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
                        {property.bedrooms !== null && (
                          <div className="flex items-center">
                            <FiBed className="mr-1 text-gray-400" /> {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <FiBath className="mr-1 text-gray-400" /> {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                          </div>
                        )}
                        <div className="flex items-center">
                          <FiMaximize2 className="mr-1 text-gray-400" /> {property.area} sqm
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(property.price)}
                        </div>
                        <Button 
                          variant="outline"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {DEMO_PROPERTIES.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/properties/${property.id}`}>
                  <Card 
                    className="overflow-hidden transition-all duration-300 group"
                    hover={true}
                    clickable={true}
                    padding="none"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/3 lg:w-1/4">
                        {property.featured && (
                          <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                            Featured
                          </div>
                        )}
                        {property.verified && (
                          <div className="absolute top-3 right-3 z-10 bg-white text-primary-600 text-xs font-bold p-1 rounded-full shadow-sm">
                            <FiShield className="h-4 w-4" />
                          </div>
                        )}
                        <div className="relative h-52 md:h-full overflow-hidden">
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <div 
                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          ></div>
                          <button 
                            onClick={(e) => toggleFavorite(property.id, e)}
                            className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                              favoriteProperties.includes(property.id) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                            }`}
                          >
                            <FiHeart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-grow">
                        <div className="flex flex-wrap justify-between items-start">
                          <div className="mr-4">
                            <div className="flex items-center mb-1">
                              <span className="text-primary-600 text-sm font-medium mr-2">
                                <FiHome className="inline mr-1" /> {property.type}
                              </span>
                              {property.tags && property.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {property.tags.map(tag => (
                                    <span key={tag} className="bg-primary-50 text-primary-700 text-xs px-1.5 py-0.5 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {property.title}
                            </h3>
                          </div>
                          <div className="text-xl font-bold text-gray-900 flex-shrink-0">
                            {formatPrice(property.price)}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm my-2">
                          <FiMapPin className="mr-1 flex-shrink-0" /> {property.location}
                        </div>
                        
                        <div className="flex flex-wrap gap-6 text-sm text-gray-700 mt-3 mb-4">
                          {property.bedrooms !== null && (
                            <div className="flex items-center">
                              <FiBed className="mr-1 text-gray-400" /> {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <FiBath className="mr-1 text-gray-400" /> {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                            </div>
                          )}
                          <div className="flex items-center">
                            <FiMaximize2 className="mr-1 text-gray-400" /> {property.area} sqm
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                          <div className="flex items-center">
                            {property.verified && (
                              <span className="flex items-center text-xs font-medium text-primary-600 mr-3">
                                <FiShield className="mr-1" /> Verified Listing
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Listed 2 days ago</span>
                          </div>
                          <Button 
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-1">
          <Button variant="light" size="sm" rounded>Previous</Button>
          <Button variant="primary" size="sm" rounded>1</Button>
          <Button variant="light" size="sm" rounded>2</Button>
          <Button variant="light" size="sm" rounded>3</Button>
          <span className="px-2 text-gray-500">...</span>
          <Button variant="light" size="sm" rounded>10</Button>
          <Button variant="light" size="sm" rounded>Next</Button>
        </nav>
      </div>
      
      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Submit your property requirements and our experts will help you find the perfect match with our exclusive inventory. Plus, get cashback on your purchase!
        </p>
        <Button
          variant="light"
          size="lg"
          href="/dashboard/property-requests/new"
          className="text-primary-600 hover:text-primary-700"
        >
          Submit Your Requirements
        </Button>
      </div>
    </div>
  );
}