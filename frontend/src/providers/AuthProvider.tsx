'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../lib/api/auth';
import { useRouter } from 'next/navigation';

// Define types
type UserRole = 'customer' | 'sales_ops' | 'admin';

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
}

interface SessionData {
  access_token: string;
  expires_at: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  session: SessionData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Refresh token automatically when session is about to expire
  useEffect(() => {
    if (session) {
      const expiresAt = new Date(session.expires_at).getTime();
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      // If token expires in less than 5 minutes, refresh it immediately
      if (timeUntilExpiry < 5 * 60 * 1000) {
        refreshSession();
        return;
      }
      
      // Schedule refresh for 5 minutes before expiry
      const refreshTime = timeUntilExpiry - 5 * 60 * 1000;
      const refreshTimer = setTimeout(() => {
        refreshSession();
      }, refreshTime);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [session]);

  // Try to get session when app loads
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Get session from API
        const response = await authApi.getSession(token);
        
        if (response?.user && response?.session) {
          setUser(response.user);
          setSession(response.session);
          
          // Update token in localStorage
          localStorage.setItem('access_token', response.session.access_token);
        } else {
          // If session is invalid, clear storage
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('access_token');
        setError('Authentication error. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.signIn(email, password);
      
      if (response?.user && response?.session) {
        setUser(response.user);
        setSession(response.session);
        
        // Save token to localStorage
        localStorage.setItem('access_token', response.session.access_token);
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.signUp(email, password, name);
      
      if (response?.user) {
        // Redirect to login page
        router.push('/login?registered=true');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    
    try {
      await authApi.signOut();
      
      // Clear auth state
      setUser(null);
      setSession(null);
      localStorage.removeItem('access_token');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Force sign out anyway
      setUser(null);
      setSession(null);
      localStorage.removeItem('access_token');
      
      // Redirect to home page
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  // Refresh session function
  const refreshSession = async () => {
    if (loading) return;
    
    try {
      const response = await authApi.refreshToken();
      
      if (response?.user && response?.session) {
        setUser(response.user);
        setSession(response.session);
        
        // Update token in localStorage
        localStorage.setItem('access_token', response.session.access_token);
      } else {
        // If refresh fails, clear auth state
        setUser(null);
        setSession(null);
        localStorage.removeItem('access_token');
        
        // Redirect to login page
        router.push('/login');
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      
      // Clear auth state
      setUser(null);
      setSession(null);
      localStorage.removeItem('access_token');
      
      // Redirect to login page
      router.push('/login');
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;