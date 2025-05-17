'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getFormFields, createFormField, updateFormField, deleteFormField, toggleFieldRequired, updateFieldOrder } from '@/lib/api/admin'
import { toast } from 'react-hot-toast'
import FieldFormModal from '@/components/admin/FieldFormModal'

// Import custom components
import Header, { FieldsListHeader, EmptyState } from './components/Headers'
import FieldCard from './components/FieldCard'
import SearchAndFilter from './components/SearchAndFilter'
import HelpPanel from './components/HelpPanel'
import StatusMessage from './components/StatusMessage'

// Types
type Field = {
  id: string
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  field_span: string
  placeholder?: string
  help_text?: string
  options?: string
  order: number
  min_value?: string
  max_value?: string
}

export default function FormFieldsManagement() {
  const { session } = useAuth()
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentField, setCurrentField] = useState<Field | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  
  // Fetch all form fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true)

        if (!session || !session.access_token) {
          console.error('No access token available')
          return
        }

        const data = await getFormFields(session.access_token)
        setFields(data || [])
      } catch (error) {
        console.error('Error fetching form fields:', error)
        setError('Failed to load form fields')
        toast.error('Failed to load form fields')
      } finally {
        setLoading(false)
      }
    }

    fetchFields()
  }, [session])

  // Show error and success messages for 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Open create field modal
  const openCreateModal = () => {
    setCurrentField(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  // Open edit field modal
  const openEditModal = (field: Field) => {
    setCurrentField(field)
    setModalMode('edit')
    setIsModalOpen(true)
  }
  
  // Duplicate a field
  const handleDuplicateField = async (field: Field) => {
    try {
      if (!session || !session.access_token) {
        console.error('No access token available')
        return
      }
      
      // Create a new field with the same properties but different name
      const { id, created_at, updated_at, ...fieldToDuplicate } = field as any
      
      // Get highest order and add 10
      const highestOrder = fields.length > 0
        ? Math.max(...fields.map(f => f.order))
        : 0
      
      const newFieldData = {
        ...fieldToDuplicate,
        field_name: `${fieldToDuplicate.field_name}_copy`,
        field_label: `${fieldToDuplicate.field_label} (Copy)`,
        order: highestOrder + 10
      }

      const newField = await createFormField(session.access_token, newFieldData)
      setFields([...fields, newField])
      setSuccess('Field duplicated successfully')
    } catch (error) {
      console.error('Error duplicating field:', error)
      setError('Failed to duplicate field')
      toast.error('Failed to duplicate field')
    }
  }

  // Handle create/update field
  const handleSaveField = async (fieldData: any) => {
    try {
      if (!session || !session.access_token) {
        console.error('No access token available')
        return
      }
      
      if (modalMode === 'create') {
        const newField = await createFormField(session.access_token, fieldData)
        setFields([...fields, newField])
        setSuccess('Field created successfully')
      } else {
        // Update existing field
        const updatedField = await updateFormField(session.access_token, currentField?.id as string, fieldData)
        setFields(fields.map(f => f.id === updatedField.id ? updatedField : f))
        setSuccess('Field updated successfully')
      }

      setIsModalOpen(false)
    } catch (error: any) {
      console.error('Error saving field:', error)
      setError(modalMode === 'create' ? 'Failed to create field' : 'Failed to update field')
      toast.error(modalMode === 'create' ? 'Failed to create field' : 'Failed to update field')
    }
  }

  // Handle delete field
  const handleDeleteField = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
      return
    }

    try {
      if (!session || !session.access_token) {
        console.error('No access token available')
        return
      }
      
      await deleteFormField(session.access_token, id)
      setFields(fields.filter(f => f.id !== id))
      setSuccess('Field deleted successfully')
    } catch (error) {
      console.error('Error deleting field:', error)
      setError('Failed to delete field')
      toast.error('Failed to delete field')
    }
  }

  // Handle toggle required
  const handleToggleRequired = async (field: Field) => {
    try {
      if (!session || !session.access_token) {
        console.error('No access token available')
        return
      }

      const updatedField = await toggleFieldRequired(session.access_token, field.id, !field.is_required)
      setFields(fields.map(f => f.id === field.id ? updatedField : f))
      setSuccess(`Field ${updatedField.is_required ? 'marked as required' : 'marked as optional'}`)
    } catch (error) {
      console.error('Error toggling required field:', error)
      setError('Failed to update field')
      toast.error('Failed to update field')
    }
  }

  // Handle change order
  const handleChangeOrder = async (field: Field, direction: 'up' | 'down') => {
    // Sort fields by order
    const sortedFields = [...fields].sort((a, b) => a.order - b.order)

    // Find current index
    const currentIndex = sortedFields.findIndex(f => f.id === field.id)

    // Determine target index
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    // Validate target index
    if (targetIndex < 0 || targetIndex >= sortedFields.length) {
      return
    }

    // Swap orders
    const targetField = sortedFields[targetIndex]
    const currentOrder = field.order
    const targetOrder = targetField.order

    try {
      if (!session || !session.access_token) {
        console.error('No access token available')
        return
      }
      
      console.log('Updating field order:', {
        fieldId: field.id,
        currentOrder,
        targetOrder,
        currentOrderType: typeof currentOrder,
        targetOrderType: typeof targetOrder
      })
      
      await updateFieldOrder(
        session.access_token, 
        field.id, 
        currentOrder, 
        targetOrder
      )

      // Update local state
      setFields(fields.map(f => {
        if (f.id === field.id) return { ...f, order: targetOrder }
        if (f.id === targetField.id) return { ...f, order: currentOrder }
        return f
      }))

      setSuccess('Field order updated')
    } catch (error) {
      console.error('Error updating field order:', error)
      setError('Failed to update field order')
      toast.error('Failed to update field order')
    }
  }

  // Filter fields based on search and filter
  const filteredFields = fields.filter(field => {
    const matchesSearch = searchTerm === '' || 
      field.field_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.field_name.toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesFilter = filterType === 'all' || field.field_type === filterType
    
    return matchesSearch && matchesFilter
  })
  
  // Sort fields by order
  const sortedFields = [...filteredFields].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header openCreateModal={openCreateModal} fieldCount={fields.length} />
      
      {/* Status Messages */}
      {success && <StatusMessage message={success} type="success" />}
      {error && <StatusMessage message={error} type="error" />}
      
      {/* Help Panel */}
      <HelpPanel />
      
      {/* Search and Filter */}
      <SearchAndFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      
      {/* Fields List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200 min-h-[300px]">
        <FieldsListHeader fieldCount={sortedFields.length} />
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading fields...</span>
          </div>
        ) : sortedFields.length === 0 ? (
          <EmptyState 
            hasFilters={searchTerm !== '' || filterType !== 'all'} 
            openCreateModal={openCreateModal} 
          />
        ) : (
          <div className="p-6 grid grid-cols-1 gap-4">
            {sortedFields.map((field, index) => (
              <FieldCard 
                key={field.id}
                field={field}
                index={index}
                totalFields={sortedFields.length}
                onEdit={openEditModal}
                onDelete={handleDeleteField}
                onToggleRequired={handleToggleRequired}
                onChangeOrder={handleChangeOrder}
                onDuplicate={handleDuplicateField}
              />
            ))}
          </div>
        )}
      </div>

      {/* Field Form Modal */}
      {isModalOpen && (
        <FieldFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveField}
          field={currentField}
          mode={modalMode}
        />
      )}
    </div>
  )
}
