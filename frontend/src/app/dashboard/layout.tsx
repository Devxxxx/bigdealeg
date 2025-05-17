'use client'

import UniversalLayout from '@/components/layout/UniversalLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardTemplate({ children }) {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <UniversalLayout sidebarType="customer">
        {children}
      </UniversalLayout>
    </ProtectedRoute>
  );
}