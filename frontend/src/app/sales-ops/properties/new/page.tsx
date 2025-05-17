'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { createProperty, uploadPropertyImages } from '@/lib/api/property'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import FormField from '@/components/common/FormField'
import LocationPicker from '@/components/properties/LocationPicker'
import {
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiX,
  FiImage,
  FiDollarSign,
  FiHome,
  FiMap,
  FiCheck,
  FiAlertCircle,
  FiList,
  FiInfo,
  FiMaximize2,
  FiCamera,
  FiFileText,
  FiLayers,
  FiMapPin,
  FiGrid,
  FiShield,
  FiHash,
  FiCpu,
  FiMove,
  FiUser,
  FiEdit,
  FiBookmark,
  FiMessageSquare,
  FiCalendar,
} from 'react-icons/fi'

export default function NewProperty() {
  const { user, session } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      property_type: '',
      location: '',
      city: '',
      project_name: '',
      compound_name: '',
      developer_name: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area_size: '',
      features: {},
      available: true,
      geo_location: null
    },
    mode: 'onChange'
  })
  
  // State variables
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [currentSection, setCurrentSection] = useState('basic') // 'basic', 'project', 'details', 'features', 'images'
  
  // Image upload states
  const [propertyImages, setPropertyImages] = useState([])
  const [masterPlanImages, setMasterPlanImages] = useState([])
  const [compoundImages, setCompoundImages] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  
  // Refs for file inputs
  const propertyImagesRef = useRef(null)
  const masterPlanImagesRef = useRef(null)
  const compoundImagesRef = useRef(null)

  // Feature checkboxes
  const featuresList = [
    { id: 'garden', label: 'Garden', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'pool', label: 'Swimming Pool', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'garage', label: 'Garage', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'balcony', label: 'Balcony', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'elevator', label: 'Elevator', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'security', label: 'Security System', icon: <FiShield className="w-3 h-3" /> },
    { id: 'gym', label: 'Gym', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'ac', label: 'Air Conditioning', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'furnished', label: 'Furnished', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'parking', label: 'Parking', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'garden_view', label: 'Garden View', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'sea_view', label: 'Sea View', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'private_entrance', label: 'Private Entrance', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'storage', label: 'Storage Room', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'pets_allowed', label: 'Pets Allowed', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'central_heating', label: 'Central Heating', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'concierge', label: 'Concierge Service', icon: <FiUser className="w-3 h-3" /> },
    { id: 'fiber_internet', label: 'Fiber Internet', icon: <FiGrid className="w-3 h-3" /> },
    { id: 'smart_home', label: 'Smart Home Features', icon: <FiCpu className="w-3 h-3" /> },
    { id: 'kids_area', label: 'Kids Play Area', icon: <FiGrid className="w-3 h-3" /> }
  ]

  // Handle image file selection
  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files)
    
    // Create image preview objects
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type
    }))
    
    // Update appropriate image array
    if (type === 'property') {
      setPropertyImages(prev => [...prev, ...newImages])
    } else if (type === 'master_plan') {
      setMasterPlanImages(prev => [...prev, ...newImages])
    } else if (type === 'compound') {
      setCompoundImages(prev => [...prev, ...newImages])
    }
  }

  // Remove an image
  const removeImage = (index, type) => {
    if (type === 'property') {
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(propertyImages[index].preview)
      setPropertyImages(prev => prev.filter((_, i) => i !== index))
    } else if (type === 'master_plan') {
      URL.revokeObjectURL(masterPlanImages[index].preview)
      setMasterPlanImages(prev => prev.filter((_, i) => i !== index))
    } else if (type === 'compound') {
      URL.revokeObjectURL(compoundImages[index].preview)
      setCompoundImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  // Handle feature checkboxes
  const handleFeatureChange = (featureId, checked) => {
    setValue('features', {
      ...watch('features'),
      [featureId]: checked
    })
  }

  // Handle location selection
  const handleLocationSelect = (location) => {
    setValue('geo_location', location)
    setShowLocationPicker(false)
  }

  // Custom progress tracking for uploads
  const handleProgressUpdate = (progress) => {
    setUploadProgress(progress)
  }

  // Form submission handler
  const onSubmit = async (data) => {
    // Only allow submission if we're on the images section
    if (currentSection !== 'images') {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      if (!session?.access_token) {
        throw new Error('You must be logged in to create a property')
      }
      
      // Convert price and area to numbers
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
        area_size: parseFloat(data.area_size),
        features: data.features,
        created_by: user?.id
      }
      
      // Step 1: Create property
      const { property } = await createProperty(session.access_token, formattedData)
      
      // Step 2: Process and upload images
      const allImages = []
      
      // Process property images
      propertyImages.forEach((image, index) => {
        allImages.push({
          file: image.file,
          type: 'property',
          order: index
        })
      })
      
      // Process master plan images
      masterPlanImages.forEach((image, index) => {
        allImages.push({
          file: image.file,
          type: 'master_plan',
          order: index
        })
      })
      
      // Process compound images
      compoundImages.forEach((image, index) => {
        allImages.push({
          file: image.file,
          type: 'compound',
          order: index
        })
      })
      
      if (allImages.length > 0) {
        // Create FormData for image uploads
        const formData = new FormData()
        
        // Append all images
        allImages.forEach((image, index) => {
          formData.append(`images`, image.file)
          formData.append(`types[${index}]`, image.type)
          formData.append(`orders[${index}]`, image.order)
        })
        
        // Upload images
        await fetch(`/api/properties/${property.id}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          },
          body: formData,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            handleProgressUpdate(percentCompleted)
          }
        })
      }
      
      // Show success message and redirect after delay
      setSuccess(true)
      toast.success('Property created successfully!')
      setTimeout(() => {
        router.push('/sales-ops/properties')
      }, 2000)
    } catch (error) {
      console.error('Error creating property:', error)
      setError(error.message || 'An error occurred while creating the property')
      toast.error('Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  // Section navigation - with event parameters to prevent form submission
  const goToNextSection = (e) => {
    // Prevent form submission
    if (e) e.preventDefault()
    
    if (currentSection === 'basic') setCurrentSection('project')
    else if (currentSection === 'project') setCurrentSection('details')
    else if (currentSection === 'details') setCurrentSection('features')
    else if (currentSection === 'features') setCurrentSection('images')
  }

  const goToPrevSection = (e) => {
    // Prevent form submission
    if (e) e.preventDefault()
    
    if (currentSection === 'images') setCurrentSection('features')
    else if (currentSection === 'features') setCurrentSection('details')
    else if (currentSection === 'details') setCurrentSection('project')
    else if (currentSection === 'project') setCurrentSection('basic')
  }

  // Check if current section is valid
  const isCurrentSectionValid = () => {
    if (currentSection === 'basic') {
      return !!watch('title') && !!watch('property_type') && !!watch('price')
    }
    if (currentSection === 'project') {
      return !!watch('location') && !!watch('city')
    }
    return true
  }

  // Progress indicator
  const getProgress = () => {
    if (currentSection === 'basic') return 20
    if (currentSection === 'project') return 40
    if (currentSection === 'details') return 60
    if (currentSection === 'features') return 80
    if (currentSection === 'images') return 100
  }

  // Image upload triggers
  const triggerPropertyImageUpload = () => propertyImagesRef.current?.click()
  const triggerMasterPlanImageUpload = () => masterPlanImagesRef.current?.click()
  const triggerCompoundImageUpload = () => compoundImagesRef.current?.click()

  // Navigation items with click handlers that prevent default
  const navItems = [
    { id: 'basic', label: 'Basic Info', icon: <FiHome className="h-3 w-3 mr-1" /> },
    { id: 'project', label: 'Project & Location', icon: <FiMap className="h-3 w-3 mr-1" /> },
    { id: 'details', label: 'Details', icon: <FiInfo className="h-3 w-3 mr-1" /> },
    { id: 'features', label: 'Features', icon: <FiList className="h-3 w-3 mr-1" /> },
    { id: 'images', label: 'Images', icon: <FiImage className="h-3 w-3 mr-1" /> },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Link 
          href="/sales-ops/properties"
          className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft className="mr-1 h-3 w-3" />
          Back to Properties
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="h-1.5 bg-gray-200 rounded-full w-24 sm:w-32">
            <div 
              className="h-1.5 bg-primary-500 rounded-full transition-all duration-300" 
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">Step {
            currentSection === 'basic' ? '1' : 
            currentSection === 'project' ? '2' : 
            currentSection === 'details' ? '3' : 
            currentSection === 'features' ? '4' : '5'
          } of 5</span>
        </div>
      </div>

      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-xs text-gray-500">
          Create a new property listing with all details for potential buyers
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 bg-red-50 border-l-3 border-red-500 p-2 rounded-md"
        >
          <div className="flex items-center">
            <FiAlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 bg-green-50 border-l-3 border-green-500 p-2 rounded-md"
        >
          <div className="flex items-center">
            <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-xs text-green-700">Property created successfully! Redirecting...</p>
          </div>
        </motion.div>
      )}

      <Card className="overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tabbed Navigation */}
          <div className="border-b border-gray-100 px-4 py-2">
            <div className="flex overflow-x-auto hide-scrollbar">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  type="button" 
                  className={`text-xs whitespace-nowrap font-medium py-1 px-2 mr-2 rounded flex items-center transition-colors ${
                    currentSection === item.id 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    setCurrentSection(item.id);
                  }}
                >
                  {item.icon}
                  {item.label}
                  {currentSection === item.id && (
                    <span className="ml-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
                      <span className="rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <AnimatePresence mode="wait">
              {/* Basic Info Section */}
              {currentSection === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="mb-2 pb-2 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800 flex items-center">
                      <FiHome className="mr-2 h-4 w-4 text-primary-500" />
                      Basic Property Information
                    </h2>
                    <p className="text-xs text-gray-500">Enter the essential details about this property</p>
                  </div>
                  
                  <FormField 
                    label="Property Title" 
                    htmlFor="title" 
                    required 
                    error={errors.title?.message}
                  >
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter a descriptive title"
                      leftIcon={<FiBookmark />}
                      {...register('title', { required: 'Property title is required' })}
                      error={!!errors.title}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField 
                      label="Property Type" 
                      htmlFor="property_type" 
                      required
                      error={errors.property_type?.message}
                    >
                      <select
                        id="property_type"
                        className={`block w-full rounded-lg border ${errors.property_type ? 'border-red-300' : 'border-gray-300'} py-2 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        {...register('property_type', { required: 'Property type is required' })}
                      >
                        <option value="">Select Property Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Chalet">Chalet</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Office">Office</option>
                        <option value="Shop">Shop</option>
                        <option value="Land">Land</option>
                      </select>
                    </FormField>

                    <FormField 
                      label="Price (EGP)" 
                      htmlFor="price" 
                      required
                      error={errors.price?.message}
                    >
                      <Input
                        id="price"
                        type="number"
                        placeholder="Enter property price"
                        leftIcon={<FiDollarSign />}
                        {...register('price', { 
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be positive' }
                        })}
                        error={!!errors.price}
                      />
                    </FormField>
                  </div>

                  <FormField 
                    label="Description" 
                    htmlFor="description"
                  >
                    <textarea
                      id="description"
                      rows={5}
                      placeholder="Describe the property in detail"
                      className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      {...register('description')}
                    />
                  </FormField>

                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <div className="flex items-start">
                      <FiInfo className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-700 font-medium">Pro Tip</p>
                        <p className="text-xs text-blue-600">
                          Create a compelling title that highlights the property's best features.
                          Add a detailed description including unique selling points, nearby amenities, and transportation options.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Project & Location Section */}
              {currentSection === 'project' && (
                <motion.div
                  key="project"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="mb-2 pb-2 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800 flex items-center">
                      <FiMap className="mr-2 h-4 w-4 text-primary-500" />
                      Project & Location Details
                    </h2>
                    <p className="text-xs text-gray-500">Enter information about the project and its location</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField 
                      label="Project Name" 
                      htmlFor="project_name"
                      helper="The name of the development project"
                    >
                      <Input
                        id="project_name"
                        type="text"
                        placeholder="e.g. Mountain View iCity"
                        leftIcon={<FiHash />}
                        {...register('project_name')}
                      />
                    </FormField>

                    <FormField 
                      label="Compound Name" 
                      htmlFor="compound_name"
                      helper="The specific compound within the project"
                    >
                      <Input
                        id="compound_name"
                        type="text"
                        placeholder="e.g. iVilla"
                        leftIcon={<FiGrid />}
                        {...register('compound_name')}
                      />
                    </FormField>
                  </div>

                  <FormField 
                    label="Developer Name" 
                    htmlFor="developer_name"
                    helper="The company that developed the property"
                  >
                    <Input
                      id="developer_name"
                      type="text"
                      placeholder="e.g. SODIC, Emaar, etc."
                      leftIcon={<FiEdit />}
                      {...register('developer_name')}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField 
                      label="City" 
                      htmlFor="city" 
                      required
                      error={errors.city?.message}
                    >
                      <select
                        id="city"
                        className={`block w-full rounded-lg border ${errors.city ? 'border-red-300' : 'border-gray-300'} py-2 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        {...register('city', { required: 'City is required' })}
                      >
                        <option value="">Select City</option>
                        <option value="Cairo">Cairo</option>
                        <option value="Alexandria">Alexandria</option>
                        <option value="Giza">Giza</option>
                        <option value="Sharm El Sheikh">Sharm El Sheikh</option>
                        <option value="Hurghada">Hurghada</option>
                        <option value="Luxor">Luxor</option>
                        <option value="Aswan">Aswan</option>
                        <option value="Port Said">Port Said</option>
                        <option value="Suez">Suez</option>
                        <option value="El Alamein">El Alamein</option>
                        <option value="Dahab">Dahab</option>
                        <option value="North Coast">North Coast</option>
                        <option value="New Cairo">New Cairo</option>
                        <option value="6th of October">6th of October</option>
                        <option value="Sheikh Zayed">Sheikh Zayed</option>
                        <option value="New Capital">New Capital</option>
                      </select>
                    </FormField>

                    <FormField 
                      label="Location" 
                      htmlFor="location" 
                      required
                      error={errors.location?.message}
                    >
                      <Input
                        id="location"
                        type="text"
                        placeholder="e.g. Fifth Settlement, Maadi"
                        leftIcon={<FiMapPin />}
                        {...register('location', { required: 'Location is required' })}
                        error={!!errors.location}
                      />
                    </FormField>
                  </div>

                  {/* Geo Location Picker */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Geo Location
                      </label>
                      <button
                        type="button"
                        className="text-xs text-primary-600 hover:text-primary-500 font-medium"
                        onClick={() => setShowLocationPicker(!showLocationPicker)}
                      >
                        {showLocationPicker ? 'Close Map' : 'Open Map'}
                      </button>
                    </div>
                    
                    {watch('geo_location') && (
                      <div className="bg-gray-50 p-2 rounded-md mb-2">
                        <div className="text-xs text-gray-700">
                          <div className="flex items-center">
                            <FiMapPin className="mr-1 h-3 w-3 text-primary-500" />
                            <span>Latitude: {watch('geo_location')?.lat.toFixed(6)}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <FiMapPin className="mr-1 h-3 w-3 text-primary-500" />
                            <span>Longitude: {watch('geo_location')?.lng.toFixed(6)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {showLocationPicker && (
                      <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden h-96">
                        <LocationPicker onSelect={handleLocationSelect} />
                      </div>
                    )}
                    
                    {!watch('geo_location') && !showLocationPicker && (
                      <button
                        type="button"
                        onClick={() => setShowLocationPicker(true)}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:text-primary-600 hover:border-primary-300"
                      >
                        <FiMapPin className="mr-2 h-4 w-4" />
                        Select Location on Map
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Details Section */}
              {currentSection === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="mb-2 pb-2 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800 flex items-center">
                      <FiInfo className="mr-2 h-4 w-4 text-primary-500" />
                      Property Details
                    </h2>
                    <p className="text-xs text-gray-500">Enter the specific details of this property</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField 
                      label="Bedrooms" 
                      htmlFor="bedrooms"
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-gray-400">
                          <FiHome className="h-4 w-4" />
                        </div>
                        <select
                          id="bedrooms"
                          className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          {...register('bedrooms')}
                        >
                          <option value="">Select</option>
                          <option value="Studio">Studio</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6+">6+</option>
                        </select>
                      </div>
                    </FormField>

                    <FormField 
                      label="Bathrooms" 
                      htmlFor="bathrooms"
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-gray-400">
                          <FiHome className="h-4 w-4" />
                        </div>
                        <select
                          id="bathrooms"
                          className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          {...register('bathrooms')}
                        >
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5+">5+</option>
                        </select>
                      </div>
                    </FormField>

                    <FormField 
                      label="Area Size (m²)" 
                      htmlFor="area_size"
                      error={errors.area_size?.message}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 text-gray-400">
                          <FiMaximize2 className="h-4 w-4" />
                        </div>
                        <Input
                          id="area_size"
                          type="number"
                          placeholder="e.g. 150"
                          {...register('area_size', { 
                            min: { value: 0, message: 'Area must be positive' }
                          })}
                          error={!!errors.area_size}
                        />
                      </div>
                    </FormField>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <FormField 
                      label="Availability" 
                      htmlFor="available"
                    >
                      <div className="flex items-center mt-1">
                        <input
                          id="available"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          {...register('available')}
                        />
                        <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                          Available for viewing/purchase
                        </label>
                      </div>
                    </FormField>
                    
                    {watch('available') && (
                      <div className="mt-2 pl-6">
                        <p className="text-xs text-gray-500">
                          This property will be shown in search results and available for scheduling viewings.
                        </p>
                      </div>
                    )}
                    
                    {!watch('available') && (
                      <div className="mt-2 pl-6">
                        <p className="text-xs text-gray-500">
                          This property will be hidden from search results and not available for scheduling viewings.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <div className="flex items-start">
                      <FiInfo className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-700 font-medium">Pro Tip</p>
                        <p className="text-xs text-blue-600">
                          Adding detailed information about the property helps potential buyers make informed decisions.
                          Be accurate with measurements and include all relevant specifications.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Features Section */}
              {currentSection === 'features' && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 pb-2 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800 flex items-center">
                      <FiList className="mr-2 h-4 w-4 text-primary-500" />
                      Property Features
                    </h2>
                    <p className="text-xs text-gray-500">Select all the features and amenities this property offers</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3">
                    {featuresList.map((feature) => (
                      <div key={feature.id} className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={feature.id}
                            type="checkbox"
                            onChange={(e) => handleFeatureChange(feature.id, e.target.checked)}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-2 flex items-center">
                          {feature.icon}
                          <label htmlFor={feature.id} className="ml-1 text-xs text-gray-700">
                            {feature.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(watch('features') || {})
                        .filter(([_, value]) => value)
                        .map(([key]) => {
                          const feature = featuresList.find(f => f.id === key);
                          return feature ? (
                            <div 
                              key={key} 
                              className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs flex items-center"
                            >
                              {feature.icon}
                              <span className="ml-1">{feature.label}</span>
                            </div>
                          ) : null;
                        })
                      }
                      {Object.entries(watch('features') || {}).filter(([_, value]) => value).length === 0 && (
                        <p className="text-xs text-gray-500 italic">No features selected</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Images Section */}
              {currentSection === 'images' && (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 pb-2 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-800 flex items-center">
                      <FiImage className="mr-2 h-4 w-4 text-primary-500" />
                      Property Images
                    </h2>
                    <p className="text-xs text-gray-500">Upload high-quality images to showcase the property</p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Property Images */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiCamera className="mr-2 h-4 w-4 text-primary-500" />
                        Property Images
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">Upload high-quality images of the property interior and exterior</p>
                      
                      <input
                        ref={propertyImagesRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageChange(e, 'property')}
                        className="hidden"
                      />
                      
                      <button
                        type="button"
                        onClick={triggerPropertyImageUpload}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:text-primary-600 hover:border-primary-300"
                      >
                        <FiUpload className="mr-2 h-4 w-4" />
                        Upload Property Images
                      </button>
                      
                      {/* Property Image Previews */}
                      {propertyImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {propertyImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.preview}
                                alt={`Property preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, 'property')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                              >
                                <FiX className="h-3 w-3" />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white text-xs text-center py-0.5">
                                  Featured
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Master Plan Images */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiFileText className="mr-2 h-4 w-4 text-primary-500" />
                        Master Plan Images
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">Upload project master plan images and layouts</p>
                      
                      <input
                        ref={masterPlanImagesRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageChange(e, 'master_plan')}
                        className="hidden"
                      />
                      
                      <button
                        type="button"
                        onClick={triggerMasterPlanImageUpload}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:text-primary-600 hover:border-primary-300"
                      >
                        <FiUpload className="mr-2 h-4 w-4" />
                        Upload Master Plan Images
                      </button>
                      
                      {/* Master Plan Image Previews */}
                      {masterPlanImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {masterPlanImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.preview}
                                alt={`Master Plan preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, 'master_plan')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                              >
                                <FiX className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Compound Images */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiLayers className="mr-2 h-4 w-4 text-primary-500" />
                        Compound Images
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">Upload images of the compound and amenities</p>
                      
                      <input
                        ref={compoundImagesRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageChange(e, 'compound')}
                        className="hidden"
                      />
                      
                      <button
                        type="button"
                        onClick={triggerCompoundImageUpload}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:text-primary-600 hover:border-primary-300"
                      >
                        <FiUpload className="mr-2 h-4 w-4" />
                        Upload Compound Images
                      </button>
                      
                      {/* Compound Image Previews */}
                      {compoundImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {compoundImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.preview}
                                alt={`Compound preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, 'compound')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                              >
                                <FiX className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload Summary */}
                  <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-2 rounded-md text-center">
                        <span className="text-xs text-gray-500">Property Images</span>
                        <p className="text-lg font-semibold text-primary-600">{propertyImages.length}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md text-center">
                        <span className="text-xs text-gray-500">Master Plan</span>
                        <p className="text-lg font-semibold text-primary-600">{masterPlanImages.length}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md text-center">
                        <span className="text-xs text-gray-500">Compound</span>
                        <p className="text-lg font-semibold text-primary-600">{compoundImages.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {loading && (propertyImages.length > 0 || masterPlanImages.length > 0 || compoundImages.length > 0) && (
                    <div className="mt-6">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-medium inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-50">
                              Uploading images
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-medium inline-block text-primary-600">
                              {uploadProgress}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-50">
                          <div
                            style={{ width: `${uploadProgress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-4 py-3 bg-gray-50 flex justify-between">
            <Button
              type="button"
              variant="light"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                if (currentSection === 'basic') {
                  router.back();
                } else {
                  goToPrevSection();
                }
              }}
            >
              {currentSection === 'basic' ? 'Cancel' : 'Previous'}
            </Button>
            
            {currentSection === 'images' ? (
              <Button
                type="submit"
                variant="gradient"
                size="sm"
                leftIcon={<FiSave />}
                loading={loading}
                disabled={loading}
              >
                Create Property
              </Button>
            ) : (
              <Button
                type="button" // Important: type button, not submit
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  goToNextSection();
                }}
                disabled={!isCurrentSectionValid()}
              >
                Continue
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}