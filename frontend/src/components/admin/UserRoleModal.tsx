'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiCheck, FiUsers, FiUserCheck, FiSettings } from 'react-icons/fi'
import Button from '@/components/common/Button'

export default function UserRoleModal({ user, isOpen, onClose, onRoleChange }) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  
  if (!isOpen) return null
  
  const handleRoleChange = () => {
    onRoleChange(user.id, selectedRole)
    onClose()
  }
  
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  }
  
  const modal = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1 } }
  }
  
  const getRoleDetails = (role) => {
    switch(role) {
      case 'admin':
        return {
          icon: <FiSettings className="h-4 w-4 text-purple-500" />,
          title: 'Administrator',
          description: 'Full access to all settings and management features',
          textColor: 'text-purple-700',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        }
      case 'sales_ops':
        return {
          icon: <FiUserCheck className="h-4 w-4 text-blue-500" />,
          title: 'Sales Operations',
          description: 'Can manage properties, customer requests, and scheduled viewings',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        }
      default:
        return {
          icon: <FiUsers className="h-4 w-4 text-green-500" />,
          title: 'Customer',
          description: 'Standard user account with limited access',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          {/* Background overlay */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdrop}
            onClick={onClose}
          />
          
          {/* Modal panel */}
          <motion.div 
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modal}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <FiUser className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Change User Role</h3>
                    <p className="text-xs text-gray-500">
                      {user.name || user.email}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3 mb-5">
                {['customer', 'sales_ops', 'admin'].map(role => {
                  const roleInfo = getRoleDetails(role);
                  return (
                    <div 
                      key={role} 
                      className={`rounded-lg p-3 border cursor-pointer transition-all ${
                        selectedRole === role 
                          ? `${roleInfo.borderColor} ${roleInfo.bgColor} shadow-sm` 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-start">
                        <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center mr-3 ${
                          selectedRole === role ? roleInfo.bgColor : 'bg-gray-100'
                        }`}>
                          {selectedRole === role ? (
                            <FiCheck className="h-3 w-3 text-primary-600" />
                          ) : (
                            roleInfo.icon
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${
                              selectedRole === role ? roleInfo.textColor : 'text-gray-700'
                            }`}>
                              {roleInfo.title}
                            </h4>
                            <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center">
                              {selectedRole === role && (
                                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {roleInfo.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="flex justify-end space-x-2 border-t border-gray-100 pt-3">
                <Button
                  variant="light"
                  size="sm"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<FiCheck />}
                  onClick={handleRoleChange}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}