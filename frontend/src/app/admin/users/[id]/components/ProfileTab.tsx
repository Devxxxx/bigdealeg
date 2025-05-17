'use client'

import { FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaIdBadge, FaUserEdit } from 'react-icons/fa'

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

type ProfileTabProps = {
  user: UserProfile
  formatDate: (dateString?: string) => string
  updateUserRole: (role: 'customer' | 'sales_ops' | 'admin') => Promise<void>
  deleteUser: () => Promise<void>
}

export default function ProfileTab({ user, formatDate, updateUserRole, deleteUser }: ProfileTabProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              User details and information
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaIdBadge className="mr-1 h-4 w-4 text-gray-400" />
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUserEdit className="mr-1 h-4 w-4 text-gray-400" />
                  Role
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(e.target.value as any)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="customer">Customer</option>
                    <option value="sales_ops">Sales Operations</option>
                    <option value="admin">Administrator</option>
                  </select>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaPhone className="mr-1 h-4 w-4 text-gray-400" />
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.phone || 'Not provided'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="mr-1 h-4 w-4 text-gray-400" />
                  Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.address || 'Not provided'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-1 h-4 w-4 text-gray-400" />
                  Account Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(user.created_at)}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-1 h-4 w-4 text-gray-400" />
                  Last Login
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.last_login ? formatDate(user.last_login) : 'Never'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.bio || 'No bio information provided.'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Account Management */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              Account Management
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage user account and access
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Account is {user.is_active ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.is_active
                          ? 'User can log in and access the platform.'
                          : 'User cannot log in or access the platform.'}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-red-50 p-6 shadow-sm border border-red-200">
                <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-red-700">
                      Permanently delete this user and all associated data. This action cannot be undone.
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={deleteUser}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                      >
                        Delete User Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
