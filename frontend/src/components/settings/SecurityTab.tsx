'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiKey, FiLock, FiCheckCircle, FiX } from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import FormField from '@/components/common/FormField'
import { useSettings } from '@/hooks/useSettings'

export default function SecurityTab({ setSuccessMessage, setErrorMessage, sessionData }) {
  const [saving, setSaving] = useState(false)
  const { updatePassword, terminateSession, terminateAllSessions } = useSettings()
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Session data (from the backend)
  const sessions = sessionData || {
    currentSession: {
      device: 'Current Browser',
      location: 'Cairo, Egypt',
      lastActive: 'Now',
      ip: '192.168.1.1'
    },
    otherSessions: []
  };

  // Check password strength
  useEffect(() => {
    if (!passwordData.newPassword) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    
    // Length check
    if (passwordData.newPassword.length >= 8) strength += 1
    
    // Contains uppercase
    if (/[A-Z]/.test(passwordData.newPassword)) strength += 1
    
    // Contains lowercase
    if (/[a-z]/.test(passwordData.newPassword)) strength += 1
    
    // Contains numbers
    if (/[0-9]/.test(passwordData.newPassword)) strength += 1
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(passwordData.newPassword)) strength += 1
    
    setPasswordStrength(strength)
  }, [passwordData.newPassword])

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match')
      setSaving(false)
      return
    }
    
    // Validate password strength
    if (passwordStrength < 3) {
      setErrorMessage('Password is too weak. Please use a stronger password.')
      setSaving(false)
      return
    }

    try {
      // Update password
      await updatePassword(passwordData)

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      setSuccessMessage('Password updated successfully')
    } catch (error) {
      console.error('Error updating password:', error)
      setErrorMessage('Failed to update password: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }
  
  // Handle session termination
  const handleTerminateSession = async (sessionId) => {
    try {
      await terminateSession(sessionId);
      setSuccessMessage('Session terminated successfully');
    } catch (error) {
      console.error('Error terminating session:', error);
      setErrorMessage('Failed to terminate session: ' + (error.message || 'Unknown error'));
    }
  }

  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Password Change */}
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <FiKey className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        </div>
        
        <div className="p-6">
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-6">
              <FormField 
                label="Current Password" 
                htmlFor="currentPassword" 
                required
              >
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  rightIcon={showCurrentPassword ? <FiX /> : <FiKey />}
                  clickableRightIcon={true}
                  onRightIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              </FormField>

              <FormField 
                label="New Password" 
                htmlFor="newPassword" 
                required
              >
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  rightIcon={showNewPassword ? <FiX /> : <FiKey />}
                  clickableRightIcon={true}
                  onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                  required
                />
                
                {/* Password strength meter */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            passwordStrength === 0 ? 'bg-gray-300' :
                            passwordStrength <= 2 ? 'bg-red-500' :
                            passwordStrength <= 3 ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength * 20}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-500">
                        {passwordStrength === 0 ? 'Very Weak' :
                         passwordStrength <= 2 ? 'Weak' :
                         passwordStrength <= 3 ? 'Medium' :
                         passwordStrength <= 4 ? 'Strong' : 'Very Strong'}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div className="flex items-center text-xs">
                        <span className={`inline-block w-4 h-4 rounded-full mr-1 flex items-center justify-center ${passwordData.newPassword.length >= 8 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {passwordData.newPassword.length >= 8 ? <FiCheckCircle className="h-3 w-3" /> : ''}
                        </span>
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`inline-block w-4 h-4 rounded-full mr-1 flex items-center justify-center ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {/[A-Z]/.test(passwordData.newPassword) ? <FiCheckCircle className="h-3 w-3" /> : ''}
                        </span>
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`inline-block w-4 h-4 rounded-full mr-1 flex items-center justify-center ${/[a-z]/.test(passwordData.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {/[a-z]/.test(passwordData.newPassword) ? <FiCheckCircle className="h-3 w-3" /> : ''}
                        </span>
                        <span>Lowercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`inline-block w-4 h-4 rounded-full mr-1 flex items-center justify-center ${/[0-9]/.test(passwordData.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {/[0-9]/.test(passwordData.newPassword) ? <FiCheckCircle className="h-3 w-3" /> : ''}
                        </span>
                        <span>Number</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`inline-block w-4 h-4 rounded-full mr-1 flex items-center justify-center ${/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {/[^A-Za-z0-9]/.test(passwordData.newPassword) ? <FiCheckCircle className="h-3 w-3" /> : ''}
                        </span>
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </FormField>

              <FormField 
                label="Confirm New Password" 
                htmlFor="confirmPassword"
                error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? "Passwords do not match" : ""}
                required
              >
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  rightIcon={showConfirmPassword ? <FiX /> : <FiKey />}
                  clickableRightIcon={true}
                  onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  required
                  error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword}
                />
              </FormField>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<FiShield />}
                  loading={saving}
                  disabled={
                    !passwordData.currentPassword || 
                    !passwordData.newPassword || 
                    !passwordData.confirmPassword || 
                    passwordData.newPassword !== passwordData.confirmPassword ||
                    passwordStrength < 3
                  }
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <FiLock className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Current Session */}
            <div className="border border-green-100 rounded-lg p-4 bg-green-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-500 mr-3">
                      <FiCheckCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{sessions.currentSession.device}</h4>
                      <p className="text-xs text-gray-500">
                        {sessions.currentSession.location} • {sessions.currentSession.ip}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Current Session
                  </span>
                </div>
              </div>
            </div>
            
            {/* Other Sessions */}
            {sessions.otherSessions.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Other Sessions</h4>
                {sessions.otherSessions.map(session => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-500 mr-3">
                            <FiLock className="h-5 w-5" />
                          </span>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{session.device}</h4>
                            <p className="text-xs text-gray-500">
                              {session.location} • Last active {session.lastActive} • {session.ip}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <Button
                          variant="light"
                          size="xs"
                          onClick={() => handleTerminateSession(session.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          Terminate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No other active sessions</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await terminateAllSessions();
                    setSuccessMessage('All other sessions terminated successfully');
                  } catch (error) {
                    console.error('Error terminating all sessions:', error);
                    setErrorMessage('Failed to terminate all sessions: ' + (error.message || 'Unknown error'));
                  }
                }}
                disabled={sessions.otherSessions.length === 0}
              >
                Sign Out From All Other Devices
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}