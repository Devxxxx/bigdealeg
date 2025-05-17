'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiBell,
  FiChevronDown,
  FiSearch,
  FiPlus,
  FiMenu,
  FiSettings,
  FiLogOut,
  FiUser,
  FiHelpCircle,
  FiHome,
  FiMessageSquare,
  FiX, FiInfo
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Navbar({ 
  toggleSidebar, 
  isSidebarCollapsed 
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  interface Notification {
    id: number;
    message: string;
    isRead: boolean;
    time: string;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: 'New property match found for your request', isRead: false, time: '2 hours ago' },
    { id: 2, message: 'Viewing scheduled for tomorrow at 2:00 PM', isRead: false, time: '5 hours ago' },
    { id: 3, message: 'Price update for your saved property', isRead: true, time: 'Yesterday' }
  ]);
  
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
      if (notificationsOpen && !target.closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen, notificationsOpen]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  // Check if current page is a dashboard page
  const isDashboardPage = pathname.includes('/dashboard') || 
    pathname.includes('/admin') || 
    pathname.includes('/sales-ops');
  
  // Get the current section (dashboard, admin, sales-ops)
  const getCurrentSection = () => {
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/sales-ops')) return 'sales-ops';
    return '';
  };
  
  // Get the appropriate new link based on user role
  const getNewItemLink = () => {
    const section = getCurrentSection();
    if (section === 'dashboard') return '/dashboard/property-requests/new';
    if (section === 'sales-ops') return '/sales-ops/properties/new';
    if (section === 'admin') return '/admin/properties/new';
    return '/dashboard/property-requests/new';
  };
  
  // Determine if we should show the new button
  const shouldShowNewButton = isDashboardPage;

  // Function to get role specific text
  const getRoleSpecificText = (type: 'newButton' | 'section' | 'dashboardLink') => {
    if (type === 'newButton') {
      if (pathname.startsWith('/admin')) return 'New Property';
      if (pathname.startsWith('/sales-ops')) return 'New Property';
      return 'New Request';
    }
    
    if (type === 'section') {
      if (pathname.startsWith('/admin')) return 'Admin';
      if (pathname.startsWith('/sales-ops')) return 'Sales';
      return 'Dashboard';
    }
    
    if (type === 'dashboardLink') {
      if (role === 'admin') return '/admin';
      if (role === 'sales_ops') return '/sales-ops';
      return '/dashboard';
    }
    
    return '';
  };
  
  return (
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex h-16 justify-between items-center">
        {/* Left section with menu toggle and search */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu toggle button */}
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-primary-600 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <FiMenu size={22} />
          </button>
          
          {/* Logo for mobile - only visible when not on dashboard pages */}
          {!isDashboardPage && (
            <Link href="/" className="flex items-center lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-base">
                BD
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                BigDealEgypt
              </span>
            </Link>
          )}
          
          {/* Section indicator - only visible on dashboard pages */}
          {isDashboardPage && (
            <div className="flex items-center lg:hidden">
              <span className="text-base font-medium text-gray-900">
                {getRoleSpecificText('section')}
              </span>
            </div>
          )}
          
          {/* Search Bar - hidden on mobile, visible on tablet+ */}
          <div className="relative max-w-md w-full hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Desktop Navigation Links - visible on desktop only */}
        {!isDashboardPage && (
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/' ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Home
            </Link>

            <Link 
              href="/about" 
              className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/about' ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/contact' ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Contact
            </Link>
          </nav>
        )}
        
        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {user ? (
            <>
              {/* Notifications */}
              <div className="relative notifications-dropdown">
                <button 
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all relative"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setDropdownOpen(false);
                  }}
                  aria-label="Notifications"
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      <button 
                        className="text-xs text-primary-600 hover:text-primary-700"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-gray-100 ${notification.isRead ? '' : 'bg-primary-50'}`}
                          >
                            <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-3 text-center">
                      <Link 
                        href={`${getRoleSpecificText('dashboardLink')}/notifications`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* New Button - only shown on dashboard pages */}
              {shouldShowNewButton && (
                <Link 
                  href={getNewItemLink()} 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
                >
                  <FiPlus className="mr-1.5" />
                  <span className="hidden sm:inline">{getRoleSpecificText('newButton')}</span>
                  <span className="sm:hidden">New</span>
                </Link>
              )}
              
              {/* User Menu */}
              <div className="relative user-dropdown">
                <button 
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-1.5 pr-3 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-medium text-sm mr-2">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block mr-1">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <FiChevronDown size={16} className="text-gray-500" />
                </button>
                
                {/* User Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href={getRoleSpecificText('dashboardLink')}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser className="mr-3 h-4 w-4 text-gray-500" />
                        Dashboard
                      </Link>
                      <Link 
                        href={`${getRoleSpecificText('dashboardLink')}/settings`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiSettings className="mr-3 h-4 w-4 text-gray-500" />
                        Settings
                      </Link>
                      <Link 
                        href="/help"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiHelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                        Help & Support
                      </Link>
                    </div>
                    
                    <div className="py-1 border-t border-gray-100">
                      <button 
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={async () => {
                          setDropdownOpen(false);
                          
                          // Direct implementation in case hook fails
                          if (typeof window !== 'undefined') {
                            Object.keys(localStorage).forEach(key => {
                              if (key.includes('supabase') || key.includes('sb-')) {
                                localStorage.removeItem(key);
                              }
                            });
                          }
                          
                          try {
                            await signOut();
                          } catch (error) {
                            console.error('Navbar logout error:', error);
                            // Force redirect if error
                            window.location.href = '/';
                          }
                        }}
                      >
                        <FiLogOut className="mr-3 h-4 w-4 text-red-500" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <FiMenu size={22} />
              </button>
              
              {/* Login/Register buttons for larger screens */}
              <div className="hidden sm:flex items-center space-x-2">
                <Link 
                  href="/register" 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu - only visible when mobileMenuOpen is true */}
      {mobileMenuOpen && !user && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-base">
                  BD
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  BigDealEgypt
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-900"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="py-2">
              <Link 
                href="/" 
                className={`flex items-center px-4 py-3 text-base font-medium ${pathname === '/' ? 'text-primary-700' : 'text-gray-900'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className="mr-3 h-5 w-5" />
                Home
              </Link>
              <Link 
                href="/properties" 
                className={`flex items-center px-4 py-3 text-base font-medium ${pathname.startsWith('/properties') ? 'text-primary-700' : 'text-gray-900'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className="mr-3 h-5 w-5" />
                Properties
              </Link>
              <Link 
                href="/about" 
                className={`flex items-center px-4 py-3 text-base font-medium ${pathname === '/about' ? 'text-primary-700' : 'text-gray-900'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiInfo className="mr-3 h-5 w-5" />
                About
              </Link>
              <Link 
                href="/contact" 
                className={`flex items-center px-4 py-3 text-base font-medium ${pathname === '/contact' ? 'text-primary-700' : 'text-gray-900'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiMessageSquare className="mr-3 h-5 w-5" />
                Contact
              </Link>
            </div>
            
            <div className="mt-4 px-4 py-3 border-t border-gray-200">
              <Link
                href="/register"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}