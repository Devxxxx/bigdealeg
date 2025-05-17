'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import protectedRouteApi from '@/lib/api/protectedRoute';

// Performance-optimized loading spinner with brand colors
const LoadingSpinner = React.memo(() => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
    <div className="w-16 h-16 mb-4 relative">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <p className="text-gray-600 animate-pulse">Loading...</p>
  </div>
));

// Access Denied component
const AccessDenied = React.memo(() => {
  const router = useRouter();
  
  useEffect(() => {
    // Automatically redirect to the login page after a brief delay
    const redirectTimer = setTimeout(() => {
      router.replace('/login');
    }, 2000);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-8 text-white">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-white bg-opacity-20 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center">Access Denied</h2>
        </div>
        <div className="px-6 py-8">
          <p className="text-gray-600 mb-6 text-center">
            You don't have permission to access this page. Redirecting to login page...
          </p>
        </div>
      </div>
    </div>
  );
});

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

/**
 * Strict role-based access control component
 * Only allows access to pages that match the user's exact role
 * Uses the backend API for authorization
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['customer', 'sales_ops', 'admin'] 
}: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<'loading' | 'authorized' | 'unauthorized' | 'unauthenticated'>('loading');
  const router = useRouter();
  const { user, session } = useAuth();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // If no user or session, redirect to login
        if (!user || !session?.access_token) {
          setAuthState('unauthenticated');
          setTimeout(() => {
            router.replace('/login');
          }, 100);
          return;
        }

        // Call the backend API to check authorization
        const { authState: resultAuthState } = await protectedRouteApi.checkAuthorization(
          session.access_token,
          allowedRoles
        );
        
        if (resultAuthState === 'authorized') {
          setAuthState('authorized');
        } else {
          // This should not happen as errors would be caught in the catch block,
          // but adding it for safety
          setAuthState('unauthorized');
        }
      } catch (error) {
        console.error('Authorization check failed:', error);
        
        // Check if the error is due to unauthorized access or unauthenticated
        if (error instanceof Error && 
            (error.message.includes('Access denied') || 
             error.message.includes('role not allowed'))) {
          setAuthState('unauthorized');
        } else {
          // Any other error (token expired, not found, etc.) is treated as unauthenticated
          setAuthState('unauthenticated');
          setTimeout(() => {
            router.replace('/login');
          }, 100);
        }
      }
    };

    checkAuthorization();
  }, [allowedRoles, router, user, session]);

  // Render based on auth state
  if (authState === 'loading') {
    return <LoadingSpinner />;
  }

  if (authState === 'unauthorized') {
    return <AccessDenied />;
  }

  if (authState === 'unauthenticated') {
    return <LoadingSpinner />; // Show spinner while redirecting to login
  }

  // Only render children if authorized
  return <>{children}</>;
}