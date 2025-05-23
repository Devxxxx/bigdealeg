'use client'

import { 
  FaUser,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa'

export default function CustomerInfo({ user }) {
  if (!user) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Customer Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Loading customer details...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Customer Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Contact and personal details
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <FaUser className="mr-2 h-4 w-4 text-gray-400" />
              Full name
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.name}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
              Email address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <a href={`mailto:${user.email}`} className="text-primary hover:text-primary-dark">
                {user.email}
              </a>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <FaPhone className="mr-2 h-4 w-4 text-gray-400" />
              Phone number
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <a href={`tel:${user.phone}`} className="text-primary hover:text-primary-dark">
                {user.phone}
              </a>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Role
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}