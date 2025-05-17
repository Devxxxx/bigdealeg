'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { getUsers, updateUserRole } from '@/lib/api/admin'
import { toast } from 'react-hot-toast'
import { 
  FiSearch, 
  FiFilter, 
  FiChevronDown,
  FiEye, 
  FiUserPlus,
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiMail,
  FiPhone,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
  FiX
} from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import UserRoleModal from '@/components/admin/UserRoleModal'

export default function UserManagement() {
  const { session } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [totalUsers, setTotalUsers] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [expandedUser, setExpandedUser] = useState(null)

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        
        if (!session || !session.access_token) {
          console.error('No access token available');
          return;
        }
        
        // Build options for API call
        const options = {
          searchTerm,
          roleFilter,
          sortField,
          sortDirection,
          page: currentPage,
          pageSize
        };
        
        const result = await getUsers(session.access_token, options);
        
        setUsers(result.users || []);
        setTotalUsers(result.totalUsers || 0);
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [session, searchTerm, roleFilter, sortField, sortDirection, currentPage, pageSize])

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      if (!session || !session.access_token) {
        console.error('No access token available');
        return;
      }
      
      const { user } = await updateUserRole(session.access_token, userId, newRole);
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? user : u));
      
      setSuccessMessage('User role updated successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      
    } catch (error) {
      console.error('Error updating user role:', error)
      setErrorMessage('Failed to update user role')
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  // Open role modal
  const openRoleModal = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Toggle user expanded state
  const toggleExpandUser = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null)
    } else {
      setExpandedUser(userId)
    }
  }

  // Get role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FiSettings className="mr-1 h-3 w-3" />
            Admin
          </span>
        )
      case 'sales_ops':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiUserCheck className="mr-1 h-3 w-3" />
            Sales Ops
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiUsers className="mr-1 h-3 w-3" />
            Customer
          </span>
        )
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-xs text-gray-600">Manage users, roles, and permissions</p>
        </div>
        
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          <div className="bg-white border rounded-md shadow-sm px-3 py-1 text-xs text-gray-500">
            Total users: <span className="font-bold text-primary-600">{totalUsers}</span>
          </div>
          <Button
            variant="gradient"
            size="sm"
            leftIcon={<FiUserPlus />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Success/Error messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border-l-3 border-green-500 p-2 rounded-md"
          >
            <div className="flex items-center">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <p className="text-xs text-green-700">{successMessage}</p>
              <button 
                onClick={() => setSuccessMessage('')}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-3 border-red-500 p-2 rounded-md"
          >
            <div className="flex items-center">
              <FiAlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-xs text-red-700">{errorMessage}</p>
              <button 
                onClick={() => setErrorMessage('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="relative w-full md:w-2/3">
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<FiSearch />}
              rightIcon={searchTerm && <FiX />}
              clickableRightIcon={true}
              onRightIconClick={() => setSearchTerm('')}
              size="sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="block w-full pl-8 pr-8 py-1.5 text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="sales_ops">Sales Operations</option>
                <option value="admin">Admin</option>
              </select>
              <FiFilter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <FiChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            <div className="relative text-xs text-gray-500 flex items-center">
              <select
                className="block w-full pl-3 pr-8 py-1.5 text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(0)
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-xs ml-2">per page</span>
            </div>
            
            <div className="relative">
              <Button
                variant="light"
                size="xs"
                onClick={() => handleSort('created_at')}
                rightIcon={
                  sortField === 'created_at' ? (
                    sortDirection === 'asc' ? <FiChevronDown className="rotate-180"/> : <FiChevronDown />
                  ) : null
                }
                className={sortField === 'created_at' ? 'bg-gray-100' : ''}
              >
                Date
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Users list */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="relative h-12 w-12">
            <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-500 border-solid rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-200 border-solid rounded-full opacity-20"></div>
          </div>
        </div>
      ) : users.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FiUsers className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-xs text-gray-500 mb-4">
            {searchTerm || roleFilter !== 'all' ? 
              'Try adjusting your search criteria to find what you\'re looking for.' :
              'There are no users registered in the system yet.'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card padding="small" hover={true}>
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-9 w-9 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-600 border border-gray-200 shadow-sm">
                        <span className="text-sm font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 flex items-center">
                          {user.name || 'Unnamed User'}
                          <span className="ml-2">{getRoleBadge(user.role)}</span>
                        </h3>
                        <div className="flex items-center mt-0.5 text-xs text-gray-500">
                          <FiMail className="mr-1 h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openRoleModal(user)}
                        className="p-1.5 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                        title="Change Role"
                      >
                        <FiUserCheck className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => toggleExpandUser(user.id)}
                        className="p-1.5 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedUser === user.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedUser === user.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-3 border-t border-gray-100 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="bg-gray-50 p-2 rounded-md">
                            <div className="font-medium text-gray-700 mb-1">Contact Info</div>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <FiMail className="text-gray-400 mr-1.5 h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center">
                                <FiPhone className="text-gray-400 mr-1.5 h-3 w-3" />
                                <span>{user.phone || 'Not provided'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-2 rounded-md">
                            <div className="font-medium text-gray-700 mb-1">Account Details</div>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <FiCalendar className="text-gray-400 mr-1.5 h-3 w-3" />
                                <span>Created: {formatDate(user.created_at)}</span>
                              </div>
                              <div className="flex items-center">
                                <FiUsers className="text-gray-400 mr-1.5 h-3 w-3" />
                                <span>Role: {user.role.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-2 rounded-md md:col-span-1">
                            <div className="font-medium text-gray-700 mb-1">Actions</div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => openRoleModal(user)}
                              >
                                Change Role
                              </Button>
                              <Button
                                variant="outline"
                                size="xs"
                                leftIcon={<FiSettings />}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
                <span className="font-medium">{Math.min((currentPage + 1) * pageSize, totalUsers)}</span> of{' '}
                <span className="font-medium">{totalUsers}</span> users
              </div>
              
              <div className="flex space-x-1">
                <Button
                  variant="light"
                  size="xs"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "primary" : "light"}
                    size="xs"
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                
                {totalPages > 5 && currentPage < totalPages - 3 && (
                  <span className="flex items-center text-gray-400">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 3 && (
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => setCurrentPage(totalPages - 1)}
                  >
                    {totalPages}
                  </Button>
                )}
                
                <Button
                  variant="light"
                  size="xs"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Role Modal */}
      {isModalOpen && selectedUser && (
        <UserRoleModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRoleChange={handleRoleChange}
        />
      )}
    </motion.div>
  )
}