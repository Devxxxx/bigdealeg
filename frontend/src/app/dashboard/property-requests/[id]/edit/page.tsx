'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FormField from '@/components/common/FormField';
import {
  FiSave,
  FiX,
  FiArrowLeft,
  FiHome,
  FiMapPin,
  FiDollarSign,
  FiClipboard,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import Link from 'next/link';

// Property types
const PROPERTY_TYPES = [
  'Apartment', 
  'Villa', 
  'Townhouse', 
  'Penthouse', 
  'Chalet', 
  'Duplex', 
  'Office', 
  'Shop', 
  'Land'
];

// Bedroom options
const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5', '6+'];

// Bathroom options
const BATHROOM_OPTIONS = ['1', '2', '3', '4', '5+'];

export default function EditPropertyRequest() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    property_type: '',
    location: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    area_size: '',
    additional_features: '',
    custom_fields: {}
  });
  
  // Custom fields from database
  const [customFields, setCustomFields] = useState([]);
  
  // Fetch request data and custom fields
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;
      
      setLoading(true);
      try {
        // Fetch the property request
        const { data: requestData, error: requestError } = await supabase
          .from('property_requests')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (requestError) throw requestError;
        
        if (!requestData) {
          setError('Property request not found or you do not have permission to edit it.');
          setLoading(false);
          return;
        }
        
        // Fetch custom fields
        const { data: fieldsData, error: fieldsError } = await supabase
          .from('property_request_fields')
          .select('*')
          .order('order', { ascending: true });
          
        if (fieldsError) throw fieldsError;
        
        setCustomFields(fieldsData || []);
        
        // Set form data
        setFormData({
          title: requestData.title || '',
          property_type: requestData.property_type || '',
          location: requestData.location || '',
          min_price: requestData.min_price?.toString() || '',
          max_price: requestData.max_price?.toString() || '',
          bedrooms: requestData.bedrooms || '',
          bathrooms: requestData.bathrooms || '',
          area_size: requestData.area_size?.toString() || '',
          additional_features: requestData.additional_features || '',
          custom_fields: requestData.custom_fields || {}
        });
        
      } catch (error) {
        console.error('Error fetching property request:', error);
        setError('Failed to load property request. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, user, id]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox fields
    if (type === 'checkbox') {
      if (name.startsWith('custom_')) {
        const fieldName = name.replace('custom_', '');
        setFormData({
          ...formData,
          custom_fields: {
            ...formData.custom_fields,
            [fieldName]: checked
          }
        });
      }
    } 
    // Handle select fields for custom fields
    else if (name.startsWith('custom_')) {
      const fieldName = name.replace('custom_', '');
      setFormData({
        ...formData,
        custom_fields: {
          ...formData.custom_fields,
          [fieldName]: value
        }
      });
    } 
    // Handle regular fields
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !id) return;
    
    // Validation
    if (!formData.title || !formData.property_type || !formData.location) {
      setError('Please fill out all required fields.');
      return;
    }
    
    // Ensure min price is less than max price
    const minPrice = parseFloat(formData.min_price);
    const maxPrice = parseFloat(formData.max_price);
    
    if (minPrice >= maxPrice) {
      setError('Minimum price must be less than maximum price.');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      // Prepare data for submission
      const requestData = {
        title: formData.title,
        property_type: formData.property_type,
        location: formData.location,
        min_price: minPrice,
        max_price: maxPrice,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area_size: formData.area_size ? parseFloat(formData.area_size) : null,
        additional_features: formData.additional_features,
        custom_fields: formData.custom_fields,
        updated_at: new Date().toISOString()
      };
      
      // Update the property request
      const { error: updateError } = await supabase
        .from('property_requests')
        .update(requestData)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (updateError) throw updateError;
      
      // Success!
      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push(`/dashboard/property-requests/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating property request:', error);
      setError('Failed to update property request. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Cancel edit
  const handleCancel = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <Link 
          href={`/dashboard/property-requests/${id}`}
          className="text-gray-500 hover:text-gray-700 mr-2"
        >
          <FiArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Property Request</h1>
      </div>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-3 bg-red-50 border-l-4 border-red-500 p-2 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-3 bg-green-50 border-l-4 border-green-500 p-2 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Property request updated successfully! Redirecting...</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <Card>
          <div className="flex justify-center items-center h-40">
            <div className="relative h-10 w-10">
              <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-500 border-solid rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-200 border-solid rounded-full opacity-20"></div>
            </div>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="flex items-center mb-3">
              <FiClipboard className="h-5 w-5 text-primary-500 mr-2" />
              <h2 className="text-base font-medium text-gray-900">Property Request Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Request Title" 
                htmlFor="title" 
                required
                span="full"
              >
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="E.g., 3 Bedroom Apartment in New Cairo"
                  value={formData.title}
                  onChange={handleChange}
                  leftIcon={<FiClipboard />}
                  required
                />
              </FormField>
              
              <FormField 
                label="Property Type" 
                htmlFor="property_type" 
                required
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select Property Type</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </FormField>
              
              <FormField 
                label="Location" 
                htmlFor="location" 
                required
              >
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="E.g., New Cairo, Maadi, etc."
                  value={formData.location}
                  onChange={handleChange}
                  leftIcon={<FiMapPin />}
                  required
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-2 col-span-full md:col-span-1">
                <FormField 
                  label="Minimum Price (EGP)" 
                  htmlFor="min_price" 
                  required
                >
                  <Input
                    id="min_price"
                    name="min_price"
                    type="number"
                    placeholder="Min price"
                    value={formData.min_price}
                    onChange={handleChange}
                    leftIcon={<FiDollarSign />}
                    min="0"
                    step="1000"
                    required
                  />
                </FormField>
                
                <FormField 
                  label="Maximum Price (EGP)" 
                  htmlFor="max_price" 
                  required
                >
                  <Input
                    id="max_price"
                    name="max_price"
                    type="number"
                    placeholder="Max price"
                    value={formData.max_price}
                    onChange={handleChange}
                    leftIcon={<FiDollarSign />}
                    min="0"
                    step="1000"
                    required
                  />
                </FormField>
              </div>
              
              <FormField 
                label="Bedrooms" 
                htmlFor="bedrooms"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Bedrooms</option>
                    {BEDROOM_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </FormField>
              
              <FormField 
                label="Bathrooms" 
                htmlFor="bathrooms"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Bathrooms</option>
                    {BATHROOM_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </FormField>
              
              <FormField 
                label="Area Size (m²)" 
                htmlFor="area_size"
              >
                <Input
                  id="area_size"
                  name="area_size"
                  type="number"
                  placeholder="Area in square meters"
                  value={formData.area_size}
                  onChange={handleChange}
                  min="0"
                  step="1"
                />
              </FormField>
              
              <FormField 
                label="Additional Features" 
                htmlFor="additional_features"
                span="full"
              >
                <textarea
                  id="additional_features"
                  name="additional_features"
                  value={formData.additional_features}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Describe any additional features or requirements"
                />
              </FormField>
            </div>
            
            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex items-center mb-3">
                  <FiInfo className="h-5 w-5 text-primary-500 mr-2" />
                  <h2 className="text-base font-medium text-gray-900">Additional Preferences</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customFields.map(field => (
                    <div key={field.id} className={field.field_span === 'full' ? 'col-span-full' : ''}>
                      {field.field_type === 'checkbox' ? (
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`custom_${field.field_name}`}
                              name={`custom_${field.field_name}`}
                              type="checkbox"
                              checked={formData.custom_fields[field.field_name] || false}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`custom_${field.field_name}`} className="font-medium text-gray-700">
                              {field.field_label}
                            </label>
                            {field.help_text && (
                              <p className="text-gray-500">{field.help_text}</p>
                            )}
                          </div>
                        </div>
                      ) : field.field_type === 'select' ? (
                        <FormField 
                          label={field.field_label} 
                          htmlFor={`custom_${field.field_name}`}
                          required={field.is_required}
                          helpText={field.help_text}
                        >
                          <select
                            id={`custom_${field.field_name}`}
                            name={`custom_${field.field_name}`}
                            value={formData.custom_fields[field.field_name] || ''}
                            onChange={handleChange}
                            className="block w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                            required={field.is_required}
                          >
                            <option value="">{field.placeholder || `Select ${field.field_label}`}</option>
                            {field.options?.split(',').map(option => (
                              <option key={option.trim()} value={option.trim()}>
                                {option.trim()}
                              </option>
                            ))}
                          </select>
                        </FormField>
                      ) : (
                        <FormField 
                          label={field.field_label} 
                          htmlFor={`custom_${field.field_name}`}
                          required={field.is_required}
                          helpText={field.help_text}
                        >
                          <Input
                            id={`custom_${field.field_name}`}
                            name={`custom_${field.field_name}`}
                            type={field.field_type === 'number' ? 'number' : 'text'}
                            placeholder={field.placeholder}
                            value={formData.custom_fields[field.field_name] || ''}
                            onChange={handleChange}
                            required={field.is_required}
                            min={field.field_type === 'number' ? field.min_value : undefined}
                            max={field.field_type === 'number' ? field.max_value : undefined}
                          />
                        </FormField>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
              <Button
                variant="light"
                size="sm"
                leftIcon={<FiX />}
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FiSave />}
                type="submit"
                loading={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}