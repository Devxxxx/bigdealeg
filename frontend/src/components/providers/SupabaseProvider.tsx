'use client';

// This file is kept as a placeholder to prevent import errors
// The actual Supabase provider functionality has been removed in favor of using the backend API

import { ReactNode } from 'react';

export default function SupabaseProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const useSupabase = () => {
  throw new Error('useSupabase has been deprecated. Use the backend API endpoints instead.');
};