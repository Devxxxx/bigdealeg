'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);
  
  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - fixed position for desktop */}
      <div 
        className={`hidden lg:block fixed inset-y-0 left-0 z-20 transition-all duration-300`}
        style={{width: isSidebarCollapsed ? '5rem' : '16rem'}}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>
      
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-20"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      
      {/* Mobile sidebar - absolute positioning */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{width: '16rem'}}
      >
        <Sidebar isCollapsed={false} toggleSidebar={toggleMobileSidebar} />
      </div>
      
      {/* Main content wrapper - use margin to make space for sidebar */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{marginLeft: isSidebarCollapsed ? '5rem' : '16rem'}}
      >
        {/* Navbar */}
        <Navbar 
          toggleSidebar={toggleMobileSidebar} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}