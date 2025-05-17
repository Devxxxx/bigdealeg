'use client';

import React from 'react';
import PublicRoute from '@/components/auth/PublicRoute';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicRoute>
      {children}
    </PublicRoute>
  );
}