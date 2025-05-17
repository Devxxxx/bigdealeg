'use client'

import { FaPlus, FaSortAmountDown } from 'react-icons/fa'

type HeaderProps = {
  openCreateModal: () => void
  fieldCount: number
}

export default function Header({ openCreateModal, fieldCount }: HeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">🛠️</span> Form Fields Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Customize the property request form fields for your users
          </p>
        </div>
        <div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add Field
          </button>
        </div>
      </div>
    </div>
  )
}

type FieldsListHeaderProps = {
  fieldCount: number
}

export function FieldsListHeader({ fieldCount }: FieldsListHeaderProps) {
  return (
    <div className="px-6 py-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        Form Fields 
        <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {fieldCount}
        </span>
      </h3>
      <div className="flex items-center text-sm text-gray-500">
        <FaSortAmountDown className="mr-2 h-4 w-4" />
        <span>Ordered by position</span>
      </div>
    </div>
  )
}

type EmptyStateProps = {
  hasFilters: boolean
  openCreateModal: () => void
}

export function EmptyState({ hasFilters, openCreateModal }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {hasFilters ? (
        <>
          <div className="text-gray-400 text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No matching fields</h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or filter
          </p>
        </>
      ) : (
        <>
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No fields found</h3>
          <p className="text-gray-500 text-sm mb-4">
            Create your first form field to get started
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
            Add First Field
          </button>
        </>
      )}
    </div>
  )
}
