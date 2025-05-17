'use client';

import React from 'react';
import UniversalLayout from '@/components/layout/UniversalLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <UniversalLayout sidebarType="admin">
                {children}
            </UniversalLayout>
        </ProtectedRoute>
    );
}
