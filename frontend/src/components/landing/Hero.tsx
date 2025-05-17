'use client'

import Link from 'next/link';
import { FiHome, FiSearch, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="absolute inset-0 z-0 bg-dot-pattern text-primary-100 opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 md:py-24 items-center">
          
          {/* Left content - Text */}
          <div className="space-y-8 max-w-xl">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-gray-900">
                Find Your Dream <span className="text-gradient-primary">Property</span> &amp; Get <span className="text-gradient-secondary">Cashback</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                BigDealEgypt connects you directly with property sellers in Egypt, cutting out the middleman. Submit your requirements, find perfect matches, and get cashback on your purchase.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="btn-primary btn-lg group flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="pt-4 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  <FiHome className="text-primary-600 h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-900">No Brokers</p>
                <p className="text-xs text-gray-500 mt-1">Direct from sellers</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mb-2">
                  <FiSearch className="text-secondary-600 h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-900">Smart Matching</p>
                <p className="text-xs text-gray-500 mt-1">AI-powered search</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mb-2">
                  <FiCheckCircle className="text-accent-600 h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-900">Get Cashback</p>
                <p className="text-xs text-gray-500 mt-1">On every purchase</p>
              </div>
            </div>
          </div>
          
          {/* Right content - Image */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-elevated relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-90"></div>
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80" 
                alt="Luxury apartment in Cairo"
                className="w-full h-full object-cover mix-blend-overlay"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/80 to-transparent">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-md">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FiHome className="text-primary-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-gray-900">Find Properties That Match Your Needs</h3>
                      <p className="text-sm text-gray-700 mt-1">Tell us what you're looking for and we'll find the perfect match.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent-100 rounded-full blur-xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-200 rounded-full blur-xl opacity-60"></div>
          </div>
          
        </div>
      </div>
    </div>
  )
}