'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

type UniversalLayoutProps = {
  children: ReactNode;
  sidebarType?: 'customer' | 'sales_ops' | 'admin';
};

/**
 * A consistent layout component to be used across all user roles
 * Provides a unified sidebar and navbar experience while adapting to the user's role
 */
export default function UniversalLayout({ 
  children, 
  sidebarType = 'customer' 
}: UniversalLayoutProps) {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const pathname = usePathname();
  
  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);
  
  // Close mobile sidebar on window resize and handle initial state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      
      if (desktop) {
        setIsMobileSidebarOpen(false);
      } else {
        // On mobile, ensure sidebar is collapsed
        setIsSidebarCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // If no user, render minimal layout with just navbar
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar toggleSidebar={toggleMobileSidebar} isSidebarCollapsed={false} />
        <main className="flex-1">{children}</main>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for large screens - fixed position */}
      <div 
        className={`hidden lg:block fixed inset-y-0 left-0 z-20 transition-all duration-300`}
        style={{width: isSidebarCollapsed ? '5rem' : '16rem'}}
      >
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
          sidebarType={sidebarType}
        />
      </div>
      
      {/* Mobile sidebar backdrop - only visible when mobile sidebar is open */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      
      {/* Mobile sidebar - slide in from left */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{width: '16rem'}}
      >
        <Sidebar 
          isCollapsed={false} 
          toggleSidebar={toggleMobileSidebar} 
          sidebarType={sidebarType}
        />
      </div>
      
      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col w-full transition-all duration-300">
        {/* Apply margin only on desktop */}
        <div 
          className="flex-1 flex flex-col h-screen"
          style={{
            marginLeft: isDesktop ? (isSidebarCollapsed ? '5rem' : '16rem') : '0'
          }}
        >
          {/* Navbar */}
          <Navbar 
            toggleSidebar={toggleMobileSidebar} 
            isSidebarCollapsed={isSidebarCollapsed} 
          />
          
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}