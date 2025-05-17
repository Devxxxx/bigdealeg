'use client'

import { FaUser, FaEnvelope, FaCheck, FaTimes, FaEdit, FaLock, FaUnlock } from 'react-icons/fa'

type UserProfile = {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  profile_image?: string
  role: 'customer' | 'sales_ops' | 'admin'
  created_at: string
  last_login?: string
  is_active: boolean
  bio?: string
}

type UserHeaderProps = {
  user: UserProfile
  formatDate: (dateString?: string) => string
  toggleUserActive: () => Promise<void>
  router: any
}

export default function UserHeader({ user, formatDate, toggleUserActive, router }: UserHeaderProps) {
  // Role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Admin</span>
      case 'sales_ops':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Sales Operations</span>
      case 'customer':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Customer</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>
    }
  }
  
  return (
    <div className="p-6 sm:flex sm:items-center sm:justify-between">
      <div className="sm:flex sm:items-center">
        <div className="mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
          {user.profile_image ? (
            <img
              className="h-24 w-24 rounded-full object-cover"
              src={user.profile_image}
              alt={user.name}
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <FaUser className="h-12 w-12 text-primary/30" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            {user.name}
            <span className="ml-3">
              {user.is_active ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FaCheck className="mr-1 h-3 w-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <FaTimes className="mr-1 h-3 w-3" />
                  Inactive
                </span>
              )}
            </span>
          </h1>
          <div className="mt-1 text-sm text-gray-500 flex items-center">
            <FaEnvelope className="mr-1 h-4 w-4" />
            {user.email}
          </div>
          <div className="mt-2 flex items-center">
            {getRoleBadge(user.role)}
            <span className="ml-2 text-sm text-gray-500">
              Joined: {formatDate(user.created_at)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-0 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => router.push(`/admin/users/${user.id}/edit`)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FaEdit className="mr-2 h-4 w-4 text-gray-500" />
          Edit User
        </button>
        <button
          onClick={toggleUserActive}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            user.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            user.is_active ? 'focus:ring-red-500' : 'focus:ring-green-500'
          }`}
        >
          {user.is_active ? (
            <>
              <FaLock className="mr-2 h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <FaUnlock className="mr-2 h-4 w-4" />
              Activate
            </>
          )}
        </button>
      </div>
    </div>
  )
}
