import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import NotificationProvider from '@/components/providers/NotificationProvider';
import React from "react";
import { Toaster } from 'react-hot-toast';

// Using variable fonts for better typography control
// You'll need to add these to your public directory or use a CDN
// These weight configurations ensure we have access to various font weights
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BigDealEgypt - Property Marketplace',
  description: 'Connect directly with property sellers in Egypt, eliminate brokers and get cashback on purchases',
  keywords: 'egypt, real estate, property, cashback, no brokers, direct selling',
  authors: [{ name: 'BigDealEgypt Team' }],
  colorScheme: 'light',
  themeColor: '#0F766E', // Primary color from our theme
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <head>
        {/* Preload critical fonts for better performance */}
        <link 
          rel="preload" 
          href="https://rsms.me/inter/inter.css" 
          as="style" 
        />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap" 
          as="style" 
        />
      </head>
      <body className="h-full bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <NotificationProvider>
            <main className="min-h-screen">
              {children}
              <Toaster 
              position="top-right"
              toastOptions={{
                // Custom toast styling matching our brand
                style: {
                  background: '#FFFFFF',
                  color: '#1F2937',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  borderRadius: '0.5rem',
                  border: '1px solid #F3F4F6',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                },
                success: {
                  style: {
                    borderLeft: '4px solid #16A34A',
                  },
                  iconTheme: {
                    primary: '#16A34A',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  style: {
                    borderLeft: '4px solid #DC2626',
                  },
                  iconTheme: {
                    primary: '#DC2626',
                    secondary: '#FFFFFF',
                  },
                },
                loading: {
                  style: {
                    borderLeft: '4px solid #0F766E',
                  },
                },
              }}
              />
            </main>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}