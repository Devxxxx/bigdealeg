'use client';

import React from 'react';
import UniversalLayout from '@/components/layout/UniversalLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function SalesOpsLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['sales_ops']}>
            <UniversalLayout sidebarType="sales_ops">
                {children}
            </UniversalLayout>
        </ProtectedRoute>
    );
}
