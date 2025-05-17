'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { usePropertyRequests } from '@/hooks/usePropertyRequests'
import { useForm } from 'react-hook-form'
import { 
  FiSave, 
  FiHome, 
  FiMapPin, 
  FiDollarSign,
  FiMaximize2 as FiBed,
  FiMaximize2 as FiBath,
  FiMaximize2, 
  FiFileText, 
  FiArrowLeft, 
  FiHelpCircle, 
  FiCheck, 
  FiX,
  FiInfo
} from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import FormField from '@/components/common/FormField'

export default function NewPropertyRequest() {
  const { user } = useAuth()
  const router = useRouter()
  const { createRequest, fields, loading: fieldsLoading } = usePropertyRequests()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // For multi-step form
  const [formProgress, setFormProgress] = useState(0) // 0-100%
  const { register, handleSubmit, watch, formState: { errors, isValid, touchedFields, dirtyFields } } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      property_type: '',
      location: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      area_size: '',
      additional_features: ''
    }
  })

  const watchedValues = watch();

  // Update form progress based on filled fields
  useEffect(() => {
    if (fieldsLoading) return;
    
    const requiredFields = [
      'title', 'property_type', 'location', 
      'min_price', 'max_price', 'bedrooms', 
      'bathrooms', 'area_size'
    ];
    
    // Add required custom fields
    const requiredCustomFields = fields
      .filter(field => field.is_required)
      .map(field => field.field_name);
    
    const allRequiredFields = [...requiredFields, ...requiredCustomFields];
    
    // Count filled required fields
    const filledFieldsCount = allRequiredFields.filter(field => {
      const value = watchedValues[field];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    // Calculate progress
    const progress = Math.min(Math.round((filledFieldsCount / allRequiredFields.length) * 100), 100);
    setFormProgress(progress);
  }, [watchedValues, fields, fieldsLoading]);

  const onSubmit = async (data) => {
    if (!user) return

    setSubmitLoading(true)
    try {
      // Extract custom fields
      const customFields = {};
      fields.forEach(field => {
        if (data[field.field_name] !== undefined) {
          customFields[field.field_name] = data[field.field_name];
          // Remove from main data
          delete data[field.field_name];
        }
      });

      // Create the property request using our new API
      const requestData = {
        title: data.title,
        property_type: data.property_type,
        location: data.location,
        min_price: Number(data.min_price),
        max_price: Number(data.max_price),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area_size: Number(data.area_size),
        additional_features: data.additional_features,
        custom_fields: customFields
      };

      const result = await createRequest(requestData);

      if (result) {
        // Redirect to the request page
        router.push(`/dashboard/property-requests/${result.id}`);
      }
    } catch (error) {
      console.error('Error creating property request:', error)
      alert('Failed to create property request. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Helper function to render field based on type
  const renderField = (field) => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            id={field.field_name}
            type="text"
            placeholder={field.placeholder}
            {...register(field.field_name, { required: field.is_required })}
            error={!!errors[field.field_name]}
            size="sm"
          />
        )
      case 'number':
        return (
          <Input
            id={field.field_name}
            type="number"
            placeholder={field.placeholder}
            min={field.min_value}
            max={field.max_value}
            {...register(field.field_name, { 
              required: field.is_required,
              min: field.min_value,
              max: field.max_value
            })}
            error={!!errors[field.field_name]}
            size="sm"
          />
        )
      case 'select':
        return (
          <select
            id={field.field_name}
            className="block w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            defaultValue=""
            {...register(field.field_name, { required: field.is_required })}
          >
            <option value="" disabled>
              {field.placeholder || 'Select an option'}
            </option>
            {field.options?.split(',').map((option) => (
              <option key={option.trim()} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        )
      case 'textarea':
        return (
          <textarea
            id={field.field_name}
            rows={2}
            className={`mt-1 block w-full rounded-lg border ${errors[field.field_name] ? 'border-red-300' : 'border-gray-300'} shadow-sm text-sm py-1.5 px-3 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
            placeholder={field.placeholder}
            {...register(field.field_name, { required: field.is_required })}
          />
        )
      case 'checkbox':
        return (
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id={field.field_name}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register(field.field_name)}
            />
          </div>
        )
      default:
        return (
          <Input
            id={field.field_name}
            type="text"
            placeholder={field.placeholder}
            {...register(field.field_name, { required: field.is_required })}
            error={!!errors[field.field_name]}
            size="sm"
          />
        )
    }
  }

  // Get array of fields for current step
  const getFieldsForStep = (step) => {
    if (step === 1) {
      return [
        { id: 'title', name: 'title', label: 'Request Title', type: 'text', span: 'full', required: true, icon: FiFileText },
        { id: 'property_type', name: 'property_type', label: 'Property Type', type: 'select', span: 'half', required: true, icon: FiHome },
        { id: 'location', name: 'location', label: 'Location', type: 'text', span: 'half', required: true, icon: FiMapPin },
        { id: 'min_price', name: 'min_price', label: 'Minimum Price (EGP)', type: 'number', span: 'half', required: true, icon: FiDollarSign },
        { id: 'max_price', name: 'max_price', label: 'Maximum Price (EGP)', type: 'number', span: 'half', required: true, icon: FiDollarSign },
      ];
    } else if (step === 2) {
      return [
        { id: 'bedrooms', name: 'bedrooms', label: 'Bedrooms', type: 'select', span: 'third', required: true, icon: FiBed },
        { id: 'bathrooms', name: 'bathrooms', label: 'Bathrooms', type: 'select', span: 'third', required: true, icon: FiBath },
        { id: 'area_size', name: 'area_size', label: 'Area Size (m²)', type: 'number', span: 'third', required: true, icon: FiMaximize2 },
        { id: 'additional_features', name: 'additional_features', label: 'Additional Features & Requirements', type: 'textarea', span: 'full', required: false, icon: null },
      ];
    } else if (step === 3) {
      // Dynamic fields from admin config
      return fields.map(field => ({
        id: field.field_name,
        name: field.field_name,
        label: field.field_label,
        type: field.field_type,
        span: field.field_span,
        required: field.is_required,
        help: field.help_text,
        icon: null,
        options: field.options
      }));
    }
    return [];
  }

  const totalSteps = fields.length > 0 ? 3 : 2;
  const currentFields = getFieldsForStep(currentStep);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (fieldsLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="relative h-10 w-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-200 border-solid rounded-full opacity-20"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <div>
          <Link
            href="/dashboard/property-requests"
            className="inline-flex items-center text-xs text-gray-500 hover:text-primary mb-1"
          >
            <FiArrowLeft className="mr-1 h-3 w-3" />
            Back to requests
          </Link>
          <h1 className="text-xl font-bold text-gray-900">New Property Request</h1>
          <p className="text-xs text-gray-500">
            Tell us what you're looking for and we'll find matching properties
          </p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Form Progress</span>
          <span className="text-xs font-medium text-gray-700">{formProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${formProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex mb-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className="flex-1 flex items-center" 
            onClick={() => i < currentStep && setCurrentStep(i + 1)}
          >
            <div 
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${
                i + 1 < currentStep 
                  ? 'bg-primary-500 text-white' 
                  : i + 1 === currentStep 
                    ? 'bg-primary-100 text-primary-700 border border-primary-500' 
                    : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              {i + 1 < currentStep ? <FiCheck className="h-3 w-3" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div 
                className={`flex-1 h-0.5 ${
                  i + 1 < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              {currentFields.map((field) => (
                <div 
                  key={field.id} 
                  className={`${field.type === 'checkbox' ? 'flex items-start space-x-2' : ''} ${
                    field.span === 'full' ? 'sm:col-span-6' : 
                    field.span === 'half' ? 'sm:col-span-3' : 
                    field.span === 'third' ? 'sm:col-span-2' :
                    'sm:col-span-2'
                  }`}
                >
                  {field.type === 'checkbox' ? (
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={field.id}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          {...register(field.name, { required: field.required })}
                        />
                      </div>
                      <div className="ml-2">
                        <label htmlFor={field.id} className="text-xs font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                        {field.help && (
                          <p className="text-xs text-gray-500 mt-0.5">{field.help}</p>
                        )}
                      </div>
                    </div>
                  ) : field.type === 'select' ? (
                    <div>
                      <label htmlFor={field.id} className="flex items-center text-xs font-medium text-gray-700 mb-1">
                        {field.icon && <field.icon className="mr-1 h-3 w-3 text-gray-400" />}
                        {field.label}
                        {field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      {field.name === 'property_type' ? (
                        <select
                          id={field.id}
                          className={`block w-full rounded-lg border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          defaultValue=""
                          {...register(field.name, { required: field.required })}
                        >
                          <option value="" disabled>Select a property type</option>
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
                      ) : field.name === 'bedrooms' ? (
                        <select
                          id={field.id}
                          className={`block w-full rounded-lg border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          defaultValue=""
                          {...register(field.name, { required: field.required })}
                        >
                          <option value="" disabled>Select bedrooms</option>
                          <option value="Studio">Studio</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6+">6+</option>
                        </select>
                      ) : field.name === 'bathrooms' ? (
                        <select
                          id={field.id}
                          className={`block w-full rounded-lg border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          defaultValue=""
                          {...register(field.name, { required: field.required })}
                        >
                          <option value="" disabled>Select bathrooms</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5+">5+</option>
                        </select>
                      ) : field.options ? (
                        <select
                          id={field.id}
                          className={`block w-full rounded-lg border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          defaultValue=""
                          {...register(field.name, { required: field.required })}
                        >
                          <option value="" disabled>
                            {field.placeholder || 'Select an option'}
                          </option>
                          {field.options?.split(',').map((option) => (
                            <option key={option.trim()} value={option.trim()}>
                              {option.trim()}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          id={field.id}
                          className={`block w-full rounded-lg border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          defaultValue=""
                          {...register(field.name, { required: field.required })}
                        >
                          <option value="" disabled>
                            {field.placeholder || 'Select an option'}
                          </option>
                        </select>
                      )}
                      {errors[field.name] && (
                        <p className="mt-1 text-xs text-red-600">This field is required</p>
                      )}
                      {field.help && (
                        <p className="mt-1 text-xs text-gray-500">{field.help}</p>
                      )}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <div>
                      <label htmlFor={field.id} className="flex items-center text-xs font-medium text-gray-700 mb-1">
                        {field.icon && <field.icon className="mr-1 h-3 w-3 text-gray-400" />}
                        {field.label}
                        {field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <textarea
                        id={field.id}
                        rows={3}
                        className={`block w-full rounded-lg border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} shadow-sm text-sm py-1.5 px-3 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        {...register(field.name, { required: field.required })}
                      />
                      {errors[field.name] && (
                        <p className="mt-1 text-xs text-red-600">This field is required</p>
                      )}
                      {field.help && (
                        <p className="mt-1 text-xs text-gray-500">{field.help}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor={field.id} className="flex items-center text-xs font-medium text-gray-700 mb-1">
                        {field.icon && <field.icon className="mr-1 h-3 w-3 text-gray-400" />}
                        {field.label}
                        {field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <Input
                        id={field.id}
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        {...register(field.name, { 
                          required: field.required,
                          min: field.type === 'number' ? 0 : undefined
                        })}
                        error={!!errors[field.name]}
                        size="sm"
                      />
                      {errors[field.name] && (
                        <p className="mt-1 text-xs text-red-600">This field is required</p>
                      )}
                      {field.help && (
                        <p className="mt-1 text-xs text-gray-500">{field.help}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Form navigation & submit buttons */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="light"
                  size="sm"
                  onClick={prevStep}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/property-requests')}
              >
                Cancel
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={nextStep}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="gradient"
                  leftIcon={<FiSave />}
                  size="sm"
                  loading={submitLoading}
                >
                  {submitLoading ? 'Creating...' : 'Create Request'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
      
      {/* Help Section */}
      {currentStep === 1 && (
        <Card className="mt-3 bg-blue-50 border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <FiInfo className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Property Request Tips</h3>
              <div className="mt-2 text-xs text-blue-700 space-y-1">
                <p>• A descriptive title helps us understand your needs better</p>
                <p>• Be specific about your preferred location(s)</p>
                <p>• Set a realistic price range based on your budget</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  )
}