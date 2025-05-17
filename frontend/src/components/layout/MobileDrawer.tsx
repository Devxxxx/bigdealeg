'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiSearch, FiClipboard, FiCalendar, 
  FiSettings, FiUsers, FiGrid, FiDatabase, FiLogOut, 
  FiX, FiHelpCircle, FiBell, FiMessageCircle, FiPieChart,
  FiDollarSign
} from 'react-icons/fi';

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();
  
  // Define navigation items based on user role
  const navItems = {
    customer: [
      { name: 'Dashboard', href: '/dashboard', icon: FiHome },
      { name: 'My Requests', href: '/dashboard/property-requests', icon: FiClipboard },
      { name: 'My Viewings', href: '/dashboard/scheduled-viewings', icon: FiCalendar },
      { name: 'Notifications', href: '/dashboard/notifications', icon: FiBell },
      { name: 'Account Settings', href: '/dashboard/settings', icon: FiSettings },
    ],
    sales_ops: [
      { name: 'Dashboard', href: '/sales-ops', icon: FiHome },
      { name: 'Properties', href: '/sales-ops/properties', icon: FiGrid },
      { name: 'Customer Requests', href: '/sales-ops/requests', icon: FiClipboard },
      { name: 'Scheduled Viewings', href: '/sales-ops/scheduled-viewings', icon: FiCalendar },
      { name: 'Messaging', href: '/sales-ops/messages', icon: FiMessageCircle },
      { name: 'Account Settings', href: '/sales-ops/settings', icon: FiSettings },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin', icon: FiHome },
      { name: 'Properties', href: '/admin/properties', icon: FiGrid },
      { name: 'User Management', href: '/admin/users', icon: FiUsers },
      { name: 'Customer Requests', href: '/admin/property-requests', icon: FiClipboard },
      { name: 'Form Builder', href: '/admin/fields', icon: FiDatabase },
      { name: 'Analytics', href: '/admin/analytics', icon: FiPieChart },
      { name: 'Revenue', href: '/admin/revenue', icon: FiDollarSign },
      { name: 'Settings', href: '/admin/settings', icon: FiSettings },
    ]
  };
  
  // Select navigation based on user role, default to customer
  const navigation = navItems[role || 'customer'];
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  // Handle closing after navigation
  const handleNavClick = () => {
    onClose();
  };
  
  // Handle sign out
  const handleSignOut = () => {
    onClose();
    signOut();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Drawer */}
          <motion.div 
            className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-2 shadow">
                  <span className="text-white font-bold text-xs">BD</span>
                </div>
                <span className="text-base font-bold bg-gradient-to-r from-primary-600 to-primary-900 text-transparent bg-clip-text">BigDealEgypt</span>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1.5 rounded-full hover:bg-gray-100"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            
            {/* User Profile */}
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">{user?.name || user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500 capitalize">{role?.replace('_', ' ') || 'User'}</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-2 py-2 overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-2 py-1.5 text-xs font-medium rounded-lg mb-0.5 transition-colors
                    ${isActive(item.href) 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500'}
                  `}
                  onClick={handleNavClick}
                >
                  <div className={`
                    flex items-center justify-center h-6 w-6 rounded-md
                    ${isActive(item.href) ? 'bg-primary-100 text-primary-600' : 'text-gray-500'}
                  `}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </nav>
            
            {/* Help Section */}
            <div className="px-2 mt-auto mb-2">
              <div className="rounded-lg bg-primary-50 p-2">
                <div className="flex items-center mb-1">
                  <FiHelpCircle className="h-4 w-4 text-primary-500" />
                  <span className="ml-2 text-xs font-medium text-primary-900">Need Help?</span>
                </div>
                <p className="text-xs text-primary-800">
                  Contact support for assistance.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="m-2 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}