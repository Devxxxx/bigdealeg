'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Import or use the same LoadingSpinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

type PublicRouteProps = {
  children: ReactNode;
};

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // If there's a redirect parameter, use that
      if (redirect) {
        router.push(redirect);
        return;
      }

      // Otherwise redirect based on role
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'sales_ops') {
        router.push('/sales-ops');
      } else {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, role, router, redirect]);

  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show the children if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}