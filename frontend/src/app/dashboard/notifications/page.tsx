'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import {
  FiBell,
  FiHome,
  FiCalendar,
  FiClock,
  FiCheck,
  FiX,
  FiClipboard,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
  FiFilter,
  FiMapPin,
  FiMessageSquare,
  FiSettings
} from 'react-icons/fi';
import Link from 'next/link';

// Notification type definition
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_entity_id?: string;
  related_entity_type?: string;
  is_read: boolean;
  created_at: string;
}

export default function Notifications() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'property', 'viewing', 'system'
  
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Check if notifications table exists
        const { data: tableExists, error: tableCheckError } = await supabase
          .from('notifications')
          .select('id')
          .limit(1);
          
        if (tableCheckError) {
          console.error('Error checking for notifications table:', tableCheckError);
          setLoading(false);
          return;
        }
        
        // If table exists, fetch notifications
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        // Apply filters
        if (filter === 'unread') {
          query = query.eq('is_read', false);
        } else if (filter === 'property') {
          query = query.eq('related_entity_type', 'property');
        } else if (filter === 'viewing') {
          query = query.eq('related_entity_type', 'viewing');
        } else if (filter === 'system') {
          query = query.eq('type', 'system');
        }
          
        const { data, error } = await query;
          
        if (error) throw error;
        
        setNotifications(data || []);
          
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [supabase, user, filter]);
  
  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true } 
          : notification
      ));
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, is_read: true })));
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
      
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours ago
    if (diff < 24 * 60 * 60 * 1000) {
      // Less than 1 hour ago
      if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than 7 days ago
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // More than 7 days ago
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string, entityType?: string) => {
    switch (type) {
      case 'system':
        return <FiBell className="h-4 w-4 text-gray-500" />;
      case 'alert':
        return <FiAlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <FiCheckCircle className="h-4 w-4 text-green-500" />;
      case 'update':
        if (entityType === 'property') return <FiHome className="h-4 w-4 text-primary-500" />;
        if (entityType === 'viewing') return <FiCalendar className="h-4 w-4 text-blue-500" />;
        if (entityType === 'request') return <FiClipboard className="h-4 w-4 text-purple-500" />;
        return <FiClock className="h-4 w-4 text-yellow-500" />;
      case 'message':
        return <FiMessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <FiBell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get notification link based on related entity
  const getNotificationLink = (notification: Notification) => {
    if (!notification.related_entity_id || !notification.related_entity_type) {
      return '#';
    }
    
    switch (notification.related_entity_type) {
      case 'property':
        return `/properties/${notification.related_entity_id}`;
      case 'viewing':
        return `/dashboard/scheduled-viewings/${notification.related_entity_id}`;
      case 'request':
        return `/dashboard/property-requests/${notification.related_entity_id}`;
      default:
        return '#';
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-600">Stay updated on your property requests, viewings, and system alerts</p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FiCheck />}
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex mb-3 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs font-medium rounded-full mr-2 ${
            filter === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 text-xs font-medium rounded-full mr-2 flex items-center ${
            filter === 'unread'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-1 bg-primary-700 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter('property')}
          className={`px-3 py-1 text-xs font-medium rounded-full mr-2 flex items-center ${
            filter === 'property'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiHome className="mr-1 h-3 w-3" />
          Properties
        </button>
        <button
          onClick={() => setFilter('viewing')}
          className={`px-3 py-1 text-xs font-medium rounded-full mr-2 flex items-center ${
            filter === 'viewing'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiCalendar className="mr-1 h-3 w-3" />
          Viewings
        </button>
        <button
          onClick={() => setFilter('system')}
          className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${
            filter === 'system'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiSettings className="mr-1 h-3 w-3" />
          System
        </button>
      </div>

      {/* Notifications List */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="relative h-10 w-10">
              <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-500 border-solid rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-200 border-solid rounded-full opacity-20"></div>
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex">
                  <div className={`p-1.5 rounded-full mr-3 flex-shrink-0 ${
                    notification.type === 'alert' ? 'bg-red-100' :
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'update' && notification.related_entity_type === 'property' ? 'bg-primary-100' :
                    notification.type === 'update' && notification.related_entity_type === 'viewing' ? 'bg-blue-100' :
                    notification.type === 'update' && notification.related_entity_type === 'request' ? 'bg-purple-100' :
                    notification.type === 'message' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type, notification.related_entity_type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <Link 
                        href={getNotificationLink(notification)}
                        className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}
                      >
                        {notification.title}
                      </Link>
                      <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    
                    <div className="flex justify-end mt-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-primary-600 hover:text-primary-800 mr-3 flex items-center"
                        >
                          <FiCheck className="h-3 w-3 mr-1" />
                          Mark as read
                        </button>
                      )}
                      
                      {notification.related_entity_id && notification.related_entity_type && (
                        <Link
                          href={getNotificationLink(notification)}
                          className="text-xs text-primary-600 hover:text-primary-800 mr-3 flex items-center"
                        >
                          <FiEye className="h-3 w-3 mr-1" />
                          View details
                        </Link>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center"
                      >
                        <FiX className="h-3 w-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FiBell className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No notifications</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              {filter !== 'all' 
                ? "No notifications match your selected filter." 
                : "You don't have any notifications yet. New notifications will appear here."}
            </p>
            {filter !== 'all' && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => setFilter('all')}
              >
                View all notifications
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Notification Settings */}
      {!loading && notifications.length > 0 && (
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/settings"
            className="text-xs text-primary-600 hover:text-primary-800 flex items-center justify-center"
          >
            <FiSettings className="h-3 w-3 mr-1" />
            Manage notification settings
          </Link>
        </div>
      )}
    </div>
  );
}