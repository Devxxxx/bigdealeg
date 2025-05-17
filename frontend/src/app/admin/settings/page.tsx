'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getSettings, updateSettings, resetSettings } from '@/lib/api/admin'
import { toast } from 'react-hot-toast'
import { 
  FaCog, 
  FaSave, 
  FaGlobe, 
  FaEnvelope,
  FaLock,
  FaDatabase,
  FaMoneyBillWave,
  FaFile,
  FaSync
} from 'react-icons/fa'

// Import components
import GeneralSettings from './components/GeneralSettings'
import EmailSettings from './components/EmailSettings'
import PaymentSettings from './components/PaymentSettings'
import UploadSettings from './components/UploadSettings'
import PrivacySettings from './components/PrivacySettings'
import ApiSettings from './components/ApiSettings'
import StatusMessage from './components/StatusMessage'

// Settings types
type SystemSettings = {
  site_name: string
  site_description: string
  contact_email: string
  support_phone: string
  currency: string
  currency_symbol: string
  date_format: string
  time_format: string
  default_language: string
  maintenance_mode: boolean
  property_expiry_days: number
  enable_social_login: boolean
  enable_email_notifications: boolean
  enable_sms_notifications: boolean
  cashback_percentage: number
  commission_percentage: number
  max_upload_size: number
  max_images_per_property: number
  default_location: string
}

type TabType = 'general' | 'email' | 'payments' | 'uploads' | 'privacy' | 'api'

export default function AdminSettings() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: 'BigDealEgypt',
    site_description: 'Find your dream property and get cashback',
    contact_email: 'contact@bigdealegypt.com',
    support_phone: '+20 123 456 7890',
    currency: 'EGP',
    currency_symbol: 'E£',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
    default_language: 'en',
    maintenance_mode: false,
    property_expiry_days: 90,
    enable_social_login: true,
    enable_email_notifications: true,
    enable_sms_notifications: false,
    cashback_percentage: 1,
    commission_percentage: 2.5,
    max_upload_size: 10,
    max_images_per_property: 20,
    default_location: 'Cairo'
  })
  
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        
        if (!session || !session.access_token) {
          console.error('No access token available')
          return
        }
        
        const data = await getSettings(session.access_token)
        if (data) {
          setSettings(data)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error in settings fetch:', error)
        toast.error('Failed to load settings')
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [session])
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  // Handle number input change with validation
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Ensure it's a valid number
    if (value === '' || !isNaN(Number(value))) {
      setSettings({
        ...settings,
        [name]: value === '' ? '' : Number(value)
      })
    }
  }
  
  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true)
      
      if (!session || !session.access_token) {
        console.error('No access token available')
        return
      }
      
      await updateSettings(session.access_token, settings)
      
      setSuccessMessage('Settings saved successfully')
      toast.success('Settings saved successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setErrorMessage('Failed to save settings')
      toast.error('Failed to save settings')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }
  
  // Reset settings to default
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      try {
        setSaving(true)
        
        if (!session || !session.access_token) {
          console.error('No access token available')
          return
        }
        
        const data = await resetSettings(session.access_token)
        setSettings(data)
        
        setSuccessMessage('Settings reset to default values')
        toast.success('Settings reset to default values')
        setTimeout(() => setSuccessMessage(''), 3000)
      } catch (error) {
        console.error('Error resetting settings:', error)
        setErrorMessage('Failed to reset settings')
        toast.error('Failed to reset settings')
        setTimeout(() => setErrorMessage(''), 3000)
      } finally {
        setSaving(false)
      }
    }
  }
  
  // Render the appropriate settings component based on active tab
  const renderSettingsComponent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }
    
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings} handleChange={handleChange} handleNumberChange={handleNumberChange} />
      case 'email':
        return <EmailSettings settings={settings} handleChange={handleChange} />
      case 'payments':
        return <PaymentSettings settings={settings} handleChange={handleChange} handleNumberChange={handleNumberChange} />
      case 'uploads':
        return <UploadSettings settings={settings} handleNumberChange={handleNumberChange} />
      case 'privacy':
        return <PrivacySettings settings={settings} handleChange={handleChange} />
      case 'api':
        return <ApiSettings />
      default:
        return <GeneralSettings settings={settings} handleChange={handleChange} handleNumberChange={handleNumberChange} />
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCog className="mr-3 text-primary" />
            System Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure global settings for the BigDealEgypt platform
          </p>
        </div>
      </div>
      
      {/* Status Messages */}
      <StatusMessage successMessage={successMessage} errorMessage={errorMessage} />
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-0">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 sm:space-x-4 px-6" aria-label="Tabs">
              <button
                className={`${
                  activeTab === 'general'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('general')}
              >
                <FaGlobe className="mr-2 h-4 w-4" />
                General
              </button>
              
              <button
                className={`${
                  activeTab === 'email'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('email')}
              >
                <FaEnvelope className="mr-2 h-4 w-4" />
                Email
              </button>
              
              <button
                className={`${
                  activeTab === 'payments'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('payments')}
              >
                <FaMoneyBillWave className="mr-2 h-4 w-4" />
                Payments
              </button>
              
              <button
                className={`${
                  activeTab === 'uploads'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('uploads')}
              >
                <FaFile className="mr-2 h-4 w-4" />
                Uploads
              </button>
              
              <button
                className={`${
                  activeTab === 'privacy'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('privacy')}
              >
                <FaLock className="mr-2 h-4 w-4" />
                Privacy
              </button>
              
              <button
                className={`${
                  activeTab === 'api'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('api')}
              >
                <FaDatabase className="mr-2 h-4 w-4" />
                API
              </button>
            </nav>
          </div>
          
          {/* Settings Content */}
          <div className="p-6">
            {renderSettingsComponent()}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FaSync className="mr-2 -ml-1 h-4 w-4" />
          Reset to Default
        </button>
        
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            saving ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        >
          {saving ? (
            <>
              <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2 -ml-1 h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}
