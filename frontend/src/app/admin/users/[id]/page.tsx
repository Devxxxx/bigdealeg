'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserById, updateUserRole, toggleUserStatus, deleteUser } from '@/lib/api/admin'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaUser } from 'react-icons/fa'

// Import components
import UserHeader from './components/UserHeader'
import TabBar from './components/TabBar'
import ProfileTab from './components/ProfileTab'
import ActivityTab from './components/ActivityTab'
import PropertiesTab from './components/PropertiesTab'
import RequestsTab from './components/RequestsTab'

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

export default function UserDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const { session } = useAuth()
  const router = useRouter()
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activity, setActivity] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'properties' | 'requests'>('profile')
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        if (!session || !session.access_token) {
          console.error('No access token available');
          return;
        }
        
        const result = await getUserById(session.access_token, id);
        
        setUser(result.user);
        setActivity(result.activity || []);
        setProperties(result.properties || []);
        setRequests(result.requests || []);
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Failed to load user data')
        setLoading(false)
        // Redirect to users list on error
        router.push('/admin/users')
      }
    }
    
    fetchUserData()
  }, [id, router, session])
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Handle user activation/deactivation
  const toggleUserActive = async () => {
    if (!user) return
    
    if (!window.confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`)) {
      return
    }
    
    try {
      if (!session || !session.access_token) {
        console.error('No access token available');
        return;
      }
      
      const result = await toggleUserStatus(session.access_token, user.id, !user.is_active);
      
      // Update local state
      setUser(result.user);
      toast.success(`User ${!user.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    }
  }
  
  // Update user role
  const updateUserRoleHandler = async (newRole: 'customer' | 'sales_ops' | 'admin') => {
    if (!user) return
    
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return
    }
    
    try {
      if (!session || !session.access_token) {
        console.error('No access token available');
        return;
      }
      
      const result = await updateUserRole(session.access_token, user.id, newRole);
      
      // Update local state
      setUser(result.user);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    }
  }
  
  // Delete user
  const deleteUserHandler = async () => {
    if (!user) return
    
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    try {
      if (!session || !session.access_token) {
        console.error('No access token available');
        return;
      }
      
      await deleteUser(session.access_token, user.id);
      
      toast.success('User deleted successfully');
      router.push('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-400 text-4xl mb-4">👤</div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">User not found</h3>
        <p className="text-gray-500 text-sm mb-4">
          The user you're looking for doesn't exist or has been deleted
        </p>
        <button
          onClick={() => router.push('/admin/users')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </button>
      </div>
    )
  }
  
  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab 
            user={user}
            formatDate={formatDate}
            updateUserRole={updateUserRoleHandler}
            deleteUser={deleteUserHandler}
          />
        )
      case 'activity':
        return (
          <ActivityTab 
            activity={activity.length > 0 ? activity : [
              // Display a placeholder message if no activity data is available
              { 
                id: 'no-data',
                type: 'info',
                title: 'No activity data available',
                description: 'User has no recorded activity or the activity tracking system is not configured.',
                timestamp: formatDate(new Date().toISOString())
              }
            ]}
            formatDate={formatDate}
          />
        )
      case 'properties':
        return (
          <PropertiesTab 
            properties={properties.length > 0 ? properties : []}
            formatPrice={formatPrice}
            noDataMessage="No saved properties found."
          />
        )
      case 'requests':
        return (
          <RequestsTab 
            requests={requests.length > 0 ? requests : []}
            formatPrice={formatPrice}
            formatDate={formatDate}
            noDataMessage="No property requests found."
          />
        )
      default:
        return (
          <ProfileTab 
            user={user}
            formatDate={formatDate}
            updateUserRole={updateUserRoleHandler}
            deleteUser={deleteUserHandler}
          />
        )
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/users')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </button>
        </div>
        
        {/* User profile card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          {/* User header */}
          <UserHeader 
            user={user}
            formatDate={formatDate}
            toggleUserActive={toggleUserActive}
            router={router}
          />
          
          {/* Tabs */}
          <TabBar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        
        {/* Tab content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
