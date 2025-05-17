'use client'

import { useState } from 'react'
import { FaKey, FaSave, FaLock } from 'react-icons/fa'

type SecurityTabProps = {
  loading: boolean
  saving: boolean
  onSave: (passwords: { current_password: string, new_password: string }) => Promise<void>
}

export default function SecurityTab({ loading, saving, onSave }: SecurityTabProps) {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  
  const [errors, setErrors] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
    
    // Check matching passwords
    if (name === 'new_password' || name === 'confirm_password') {
      if (name === 'new_password' && formData.confirm_password && value !== formData.confirm_password) {
        setErrors({
          ...errors,
          confirm_password: 'Passwords do not match'
        })
      } else if (name === 'confirm_password' && value && value !== formData.new_password) {
        setErrors({
          ...errors,
          confirm_password: 'Passwords do not match'
        })
      } else if (name === 'confirm_password' && value && value === formData.new_password) {
        setErrors({
          ...errors,
          confirm_password: ''
        })
      }
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    }
    
    let isValid = true
    
    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required'
      isValid = false
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required'
      isValid = false
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters'
      isValid = false
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password'
      isValid = false
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        current_password: formData.current_password,
        new_password: formData.new_password
      })
      
      // Reset form after submission
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Update your password to maintain account security
        </p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="current_password"
                id="current_password"
                className={`focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                  errors.current_password ? 'border-red-300' : ''
                }`}
                placeholder="Enter your current password"
                value={formData.current_password}
                onChange={handleChange}
                required
              />
            </div>
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="new_password"
                id="new_password"
                className={`focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                  errors.new_password ? 'border-red-300' : ''
                }`}
                placeholder="Enter your new password"
                value={formData.new_password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            {errors.new_password ? (
              <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                className={`focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                  errors.confirm_password ? 'border-red-300' : ''
                }`}
                placeholder="Confirm your new password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
