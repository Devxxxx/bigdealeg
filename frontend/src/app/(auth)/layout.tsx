'use client';

import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              BD
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">
              BigDealEgypt
            </span>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 py-12">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} BigDealEgypt. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/about" className="text-sm text-gray-500 hover:text-primary-600">
                About
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-600">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-600">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-primary-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}