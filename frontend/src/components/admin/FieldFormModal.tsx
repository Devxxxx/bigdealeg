'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaTimes, FaCog, FaSave } from 'react-icons/fa'

export default function FieldFormModal({ isOpen, onClose, onSave, field, mode = 'create' }) {
  const initialFormState = {
    field_name: '',
    field_label: '',
    field_type: 'text',
    is_required: false,
    field_span: 'full',
    placeholder: '',
    help_text: '',
    options: '',
    min_value: '',
    max_value: ''
  }

  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})

  // Initialize form data when editing an existing field
  useEffect(() => {
    if (mode === 'edit' && field) {
      setFormData({
        ...initialFormState,
        ...field
      })
    } else if (mode === 'create') {
      setFormData(initialFormState)
    }
  }, [field, mode])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [errors])

  const validateForm = useCallback(() => {
    const newErrors = {}

    // Field name validation (required, no spaces, only letters, numbers, and underscores)
    if (!formData.field_name.trim()) {
      newErrors.field_name = 'Field name is required'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.field_name)) {
      newErrors.field_name = 'Field name can only contain letters, numbers, and underscores'
    }

    // Field label validation (required)
    if (!formData.field_label.trim()) {
      newErrors.field_label = 'Field label is required'
    }

    // Options validation (required for select type)
    if (formData.field_type === 'select' && !formData.options.trim()) {
      newErrors.options = 'Options are required for dropdown fields'
    }

    // Min/max validation for number type
    if (formData.field_type === 'number') {
      if (formData.min_value !== '' && formData.max_value !== '') {
        const min = parseFloat(formData.min_value)
        const max = parseFloat(formData.max_value)
        if (min >= max) {
          newErrors.min_value = 'Minimum value must be less than maximum value'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    if (validateForm()) {
      const fieldData = { ...formData }

      // Only include relevant fields based on type
      if (fieldData.field_type !== 'number') {
        delete fieldData.min_value
        delete fieldData.max_value
      }

      if (fieldData.field_type !== 'select') {
        delete fieldData.options
      }

      // If editing, include the ID
      if (mode === 'edit' && field?.id) {
        fieldData.id = field.id
      }

      onSave(fieldData)
    }
  }, [formData, validateForm, mode, field, onSave])

  if (!isOpen) return null

  return (
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={onClose}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          {/* Modal panel */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FaCog className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {mode === 'create' ? 'Add New Field' : 'Edit Field'}
                  </h3>

                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      {/* Field Name */}
                      <div>
                        <label htmlFor="field_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Field Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="field_name"
                            name="field_name"
                            value={formData.field_name}
                            onChange={handleChange}
                            disabled={mode === 'edit'}
                            className={`mt-1 block w-full rounded-md ${
                                mode === 'edit' ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } ${
                                errors.field_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'
                            } shadow-sm dark:border-gray-600 dark:text-white`}
                        />
                        {errors.field_name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.field_name}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Unique identifier (no spaces, only letters, numbers, and underscores)
                        </p>
                      </div>

                      {/* Field Label */}
                      <div>
                        <label htmlFor="field_label" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Field Label <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="field_label"
                            name="field_label"
                            value={formData.field_label}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md ${
                                errors.field_label ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'
                            } shadow-sm dark:border-gray-600 dark:text-white`}
                        />
                        {errors.field_label && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.field_label}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Text displayed above the field
                        </p>
                      </div>

                      {/* Field Type */}
                      <div>
                        <label htmlFor="field_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Field Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="field_type"
                            name="field_type"
                            value={formData.field_type}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary focus:border-primary shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="select">Dropdown</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="textarea">Text Area</option>
                        </select>
                      </div>

                      {/* Is Required */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                              id="is_required"
                              name="is_required"
                              type="checkbox"
                              checked={formData.is_required}
                              onChange={handleChange}
                              className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="is_required" className="font-medium text-gray-700 dark:text-gray-300">
                            Required Field
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Users must fill out this field
                          </p>
                        </div>
                      </div>

                      {/* Field Span */}
                      <div>
                        <label htmlFor="field_span" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Field Width
                        </label>
                        <select
                            id="field_span"
                            name="field_span"
                            value={formData.field_span}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary focus:border-primary shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="full">Full Width</option>
                          <option value="half">Half Width</option>
                          <option value="third">Third Width</option>
                        </select>
                      </div>

                      {/* Placeholder */}
                      <div>
                        <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Placeholder
                        </label>
                        <input
                            type="text"
                            id="placeholder"
                            name="placeholder"
                            value={formData.placeholder}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary focus:border-primary shadow-sm dark:border-gray-600 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Example text shown in the field
                        </p>
                      </div>

                      {/* Help Text */}
                      <div>
                        <label htmlFor="help_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Help Text
                        </label>
                        <input
                            type="text"
                            id="help_text"
                            name="help_text"
                            value={formData.help_text}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary focus:border-primary shadow-sm dark:border-gray-600 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Additional instructions shown below the field
                        </p>
                      </div>

                      {/* Options for Select Type */}
                      {formData.field_type === 'select' && (
                          <div>
                            <label htmlFor="options" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Options <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="options"
                                name="options"
                                value={formData.options}
                                onChange={handleChange}
                                rows={3}
                                className={`mt-1 block w-full rounded-md ${
                                    errors.options ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'
                                } shadow-sm dark:border-gray-600 dark:text-white`}
                            />
                            {errors.options && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.options}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Comma-separated list of options (e.g., "Option 1, Option 2, Option 3")
                            </p>
                          </div>
                      )}

                      {/* Min/Max Values for Number Type */}
                      {formData.field_type === 'number' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="min_value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Minimum Value
                              </label>
                              <input
                                  type="number"
                                  id="min_value"
                                  name="min_value"
                                  value={formData.min_value}
                                  onChange={handleChange}
                                  className={`mt-1 block w-full rounded-md ${
                                      errors.min_value ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'
                                  } shadow-sm dark:border-gray-600 dark:text-white`}
                              />
                              {errors.min_value && (
                                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.min_value}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="max_value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Maximum Value
                              </label>
                              <input
                                  type="number"
                                  id="max_value"
                                  name="max_value"
                                  value={formData.max_value}
                                  onChange={handleChange}
                                  className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary focus:border-primary shadow-sm dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              >
                <FaSave className="mr-2 h-5 w-5" />
                {mode === 'create' ? 'Create Field' : 'Save Changes'}
              </button>
              <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500"
              >
                <FaTimes className="mr-2 h-5 w-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}