'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiList,
  FiCalendar,
  FiMap,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiBarChart2,
  FiUsers,
  FiMessageCircle,
  FiEdit,
  FiInfo,
  FiBookmark
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarNotifications } from '@/hooks/useSidebarNotifications';

type MenuItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
};

const MenuItem = ({ 
  href, 
  icon, 
  label, 
  isActive, 
  isCollapsed, 
  hasNotification, 
  notificationCount 
}: MenuItemProps) => {
  return (
    <Link href={href} className={`
      flex items-center py-2.5 px-3 rounded-lg text-sm font-medium
      ${isActive 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }
      ${isCollapsed ? 'justify-center' : ''}
      transition-all duration-200
    `}>
      <div className={`${isActive ? 'text-primary-600' : 'text-gray-500'} relative`}>
        {icon}
        {hasNotification && !isCollapsed && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {notificationCount || ''}
          </span>
        )}
        {hasNotification && isCollapsed && (
          <span className="absolute -top-1 -right-1 bg-primary-600 w-2 h-2 rounded-full"></span>
        )}
      </div>
      {!isCollapsed && <span className="ml-3">{label}</span>}
      {!isCollapsed && hasNotification && notificationCount && (
        <span className="ml-auto bg-primary-100 text-primary-700 text-xs px-1.5 py-0.5 rounded-full">
          {notificationCount}
        </span>
      )}
    </Link>
  );
};

// No admin links for sales_ops or customer
const ADMIN_LINKS = [
  { href: '/admin', icon: <FiHome size={20} />, label: 'Dashboard', role: 'admin' },
  { href: '/admin/users', icon: <FiUsers size={20} />, label: 'Users', role: 'admin' },
  { href: '/admin/properties', icon: <FiMap size={20} />, label: 'Properties', role: 'admin' },
  { href: '/admin/fields', icon: <FiEdit size={20} />, label: 'Form Fields', role: 'admin' },
  { href: '/admin/analytics', icon: <FiBarChart2 size={20} />, label: 'Analytics', role: 'admin' },
];

// No sales_ops links for admin or customer
const SALES_OPS_LINKS = [
  { href: '/sales-ops', icon: <FiHome size={20} />, label: 'Dashboard', role: 'sales_ops' },
  { href: '/sales-ops/properties', icon: <FiMap size={20} />, label: 'Properties', role: 'sales_ops' },
  { href: '/sales-ops/requests', icon: <FiList size={20} />, label: 'Customer Requests', role: 'sales_ops', hasNotification: true },
  { href: '/sales-ops/scheduled-viewings', icon: <FiCalendar size={20} />, label: 'Viewings', role: 'sales_ops', hasNotification: true },
  { href: '/sales-ops/messages', icon: <FiMessageCircle size={20} />, label: 'Messages', role: 'sales_ops', hasNotification: true },
];

// No customer links for admin or sales_ops
const CUSTOMER_LINKS = [
  { href: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard', role: 'customer' },
  { href: '/dashboard/property-requests', icon: <FiList size={20} />, label: 'Property Requests', role: 'customer', hasNotification: true },
  { href: '/dashboard/scheduled-viewings', icon: <FiCalendar size={20} />, label: 'Scheduled Viewings', role: 'customer', hasNotification: true },
  { href: '/dashboard/saved-properties', icon: <FiBookmark size={20} />, label: 'Saved Properties', role: 'customer', hasNotification: true },
  { href: '/dashboard/activity', icon: <FiClock size={20} />, label: 'Activity History', role: 'customer' },
];

// Public links for everyone
const PUBLIC_LINKS = [
  { href: '/', icon: <FiHome size={20} />, label: 'Home', role: '' },
  { href: '/properties', icon: <FiHome size={20} />, label: 'Properties', role: '' },
  { href: '/about', icon: <FiInfo size={20} />, label: 'About', role: '' },
  { href: '/contact', icon: <FiMessageCircle size={20} />, label: 'Contact', role: '' },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  sidebarType?: 'customer' | 'sales_ops' | 'admin';
}

export default function Sidebar({ 
  isCollapsed, 
  toggleSidebar,
  sidebarType = 'customer' 
}: SidebarProps) {
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();
  const { notifications, loading } = useSidebarNotifications();

  // Get the real role from Auth state for display purposes
  const userRoleLabel = role === 'admin' ? 'Administrator' : role === 'sales_ops' ? 'Sales Agent' : 'Customer';

  // Determine bottom menu items based on role
  const getBottomMenuItems = () => {
    // Define role-specific settings links
    const settingsLink = 
      role === 'admin' ? { href: '/admin/settings', icon: <FiSettings size={20} />, label: 'Settings', role: 'admin' } :
      role === 'sales_ops' ? { href: '/sales-ops/settings', icon: <FiSettings size={20} />, label: 'Settings', role: 'sales_ops' } :
      { href: '/dashboard/settings', icon: <FiSettings size={20} />, label: 'Settings', role: 'customer' };
    
    // Help link is common to all roles
    const helpLink = { href: '/help', icon: <FiHelpCircle size={20} />, label: 'Help & Support', role: '' };
    
    // Return appropriate settings and help links for all roles
    return [settingsLink, helpLink];
  };
  
  // Get all menu items that match the user's role
  const getMenuItemsForCurrentUser = () => {
    let validItems = [];
    
    if (role === 'admin') {
      validItems = ADMIN_LINKS;
    } else if (role === 'sales_ops') {
      validItems = SALES_OPS_LINKS;
    } else if (role === 'customer') {
      validItems = CUSTOMER_LINKS;
    }
    
    // Include public links only when not in a role-specific section
    return validItems.concat(
      PUBLIC_LINKS.filter(item => !pathname.startsWith('/admin') && 
                                 !pathname.startsWith('/sales-ops') && 
                                 !pathname.startsWith('/dashboard'))
    );
  };

  // Get menu items for the current user
  const menuItems = getMenuItemsForCurrentUser();
  const bottomMenuItems = getBottomMenuItems();

  // Apply notification counts to menu items
  const menuItemsWithNotifications = menuItems.map(item => {
    if (!item.hasNotification) return item;

    let notificationCount = 0;
    
    // Map the notification type to the count based on the item's path
    if (item.href.includes('property-requests') || item.href.includes('requests')) {
      notificationCount = notifications.propertyRequests || 0;
    } else if (item.href.includes('scheduled-viewings') || item.href.includes('viewings')) {
      notificationCount = notifications.scheduledViewings || 0;
    } else if (item.href.includes('saved-properties')) {
      notificationCount = notifications.savedProperties || 0;
    } else if (item.href.includes('messages')) {
      notificationCount = notifications.messages || 0;
    }

    return {
      ...item,
      hasNotification: notificationCount > 0,
      notificationCount
    };
  });

  return (
    <div className="h-full bg-white overflow-y-auto overflow-x-hidden border-r border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} h-16 border-b border-gray-200`}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              BD
            </div>
            <span className={`ml-2 text-xl font-semibold text-gray-900 transition-opacity`}>
              BigDealEgypt
            </span>
          </Link>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`
            p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors
            ${isCollapsed ? 'ml-0 mt-2' : 'ml-auto'}
          `}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      {/* User Profile - Compact version */}
      <div className={`border-b border-gray-200 flex ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3'}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-medium text-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-medium text-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User Account'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userRoleLabel}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Main Menu */}
      <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <nav className="space-y-1">
          {menuItemsWithNotifications.map(item => (
            <MenuItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              isCollapsed={isCollapsed}
              hasNotification={item.hasNotification}
              notificationCount={item.notificationCount}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Items */}
      <div className={`border-t border-gray-200 py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <nav className="space-y-1">
          {bottomMenuItems.map(item => (
            <MenuItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              hasNotification={false}
              notificationCount={0}
            />
          ))}

          {/* Logout Button */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation(); // Stop event propagation
              
              console.log('Logout button clicked in Sidebar');
              try {
                await signOut();
              } catch (error) {
                console.error('Sidebar logout error:', error);
                // Force redirect if error
                window.location.href = '/';
              }
            }}
            className={`
              w-full flex items-center py-2.5 px-3 rounded-lg text-sm font-medium
              text-red-600 hover:bg-red-50
              ${isCollapsed ? 'justify-center' : ''}
              transition-all duration-200
            `}
          >
            <FiLogOut size={20} className="text-red-500" />
            {!isCollapsed && <span className="ml-3">Sign out</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}