'use client'

import { 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff, 
  FaArrowUp, 
  FaArrowDown, 
  FaClone, 
  FaGripLines
} from 'react-icons/fa'

// Type definitions
type FieldType = {
  id: string,
  field_name: string,
  field_label: string,
  field_type: string,
  field_span: string,
  is_required: boolean,
  help_text?: string,
  options?: string,
  order: number
}

type FieldCardProps = {
  field: FieldType,
  index: number,
  totalFields: number,
  onEdit: (field: FieldType) => void,
  onDelete: (id: string) => void,
  onToggleRequired: (field: FieldType) => void,
  onChangeOrder: (field: FieldType, direction: 'up' | 'down') => void,
  onDuplicate: (field: FieldType) => void
}

// Helper function to get field type details
const getFieldTypeDetails = (type: string) => {
  switch (type) {
    case 'text':
      return { icon: 'T', color: 'bg-blue-500', label: 'Text' }
    case 'number':
      return { icon: '#', color: 'bg-green-500', label: 'Number' }
    case 'select':
      return { icon: '\u25bc', color: 'bg-purple-500', label: 'Dropdown' }
    case 'checkbox':
      return { icon: '\u2611', color: 'bg-yellow-500', label: 'Checkbox' }
    case 'textarea':
      return { icon: '\u00b6', color: 'bg-indigo-500', label: 'Text Area' }
    default:
      return { icon: '?', color: 'bg-gray-500', label: type }
  }
}

export default function FieldCard({ 
  field, 
  index, 
  totalFields, 
  onEdit, 
  onDelete, 
  onToggleRequired, 
  onChangeOrder,
  onDuplicate
}: FieldCardProps) {
  const typeDetails = getFieldTypeDetails(field.field_type)
  const isFirst = index === 0
  const isLast = index === totalFields - 1

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all hover:shadow-md relative group"
    >
      <div className="flex justify-between">
        <div className="flex items-start">
          {/* Field Type Icon */}
          <div className={`flex-shrink-0 w-10 h-10 ${typeDetails.color} text-white flex items-center justify-center rounded-lg font-mono text-lg`}>
            {typeDetails.icon}
          </div>
          
          {/* Field Details */}
          <div className="ml-4">
            <div className="flex items-center flex-wrap gap-2">
              <h4 className="text-lg font-medium text-gray-900">{field.field_label}</h4>
              {field.is_required && (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Required
                </span>
              )}
              <span className="text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-300">
                {field.field_span === 'full' ? 'Full Width' : field.field_span === 'half' ? 'Half Width' : 'Third Width'}
              </span>
            </div>
            
            <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-2 items-center">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{field.field_name}</span>
              <span className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full ${typeDetails.color} mr-1`}></span>
                {typeDetails.label}
              </span>
              <span>Order: {field.order}</span>
            </div>
            
            {field.help_text && (
              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <span className="font-medium">Help text:</span> {field.help_text}
              </div>
            )}
            
            {field.field_type === 'select' && field.options && (
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">Options:</span> {field.options}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="hidden group-hover:flex items-start space-x-2">
          <button
            onClick={() => onToggleRequired(field)}
            className="p-1 rounded-md hover:bg-gray-100"
            title={field.is_required ? "Make Optional" : "Make Required"}
          >
            {field.is_required ? (
              <FaToggleOn className="h-5 w-5 text-green-600" />
            ) : (
              <FaToggleOff className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          <button
            onClick={() => onChangeOrder(field, 'up')}
            className="p-1 rounded-md hover:bg-gray-100"
            title="Move Up"
            disabled={isFirst}
          >
            <FaArrowUp className={`h-5 w-5 ${isFirst ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          
          <button
            onClick={() => onChangeOrder(field, 'down')}
            className="p-1 rounded-md hover:bg-gray-100"
            title="Move Down"
            disabled={isLast}
          >
            <FaArrowDown className={`h-5 w-5 ${isLast ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          
          <button
            onClick={() => onDuplicate(field)}
            className="p-1 rounded-md hover:bg-gray-100 text-blue-600 hover:text-blue-800"
            title="Duplicate Field"
          >
            <FaClone className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => onEdit(field)}
            className="p-1 rounded-md hover:bg-gray-100 text-primary hover:text-primary/80"
            title="Edit Field"
          >
            <FaEdit className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => onDelete(field.id)}
            className="p-1 rounded-md hover:bg-gray-100 text-red-600 hover:text-red-800"
            title="Delete Field"
          >
            <FaTrash className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Handle for drag-and-drop (visual only for now) */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-50 cursor-move">
        <FaGripLines className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  )
}
