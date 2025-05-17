'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin, 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiClock,
  FiArrowRight,
  FiHeart
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <span className="text-white font-bold text-base">BD</span>
              </div>
              <span className="text-xl font-display font-semibold text-gradient-primary">BigDealEgypt</span>
            </div>
            <p className="text-gray-400 mb-6 pr-4">
              Connecting property buyers directly with sellers,
              eliminating brokers and offering cashback on successful
              property purchases.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-700 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-700 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-700 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-700 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-5 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-5 text-white">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/property-search" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Property Matching
                </Link>
              </li>
              <li>
                <Link href="/services/viewing-scheduling" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Viewing Scheduling
                </Link>
              </li>
              <li>
                <Link href="/services/cashback" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Cashback Program
                </Link>
              </li>
              <li>
                <Link href="/services/market-insights" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Market Insights
                </Link>
              </li>
              <li>
                <Link href="/services/investment-advisory" className="text-gray-400 hover:text-primary-300 flex items-center group">
                  <FiArrowRight className="h-4 w-4 mr-2 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  Investment Advisory
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-5 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FiMapPin className="h-5 w-5 text-primary-500" />
                </div>
                <div className="ml-3 text-gray-400">
                  123 Business Center, 5th Floor<br />
                  New Cairo, Cairo, Egypt
                </div>
              </li>
              <li className="flex items-center">
                <FiMail className="h-5 w-5 text-primary-500" />
                <div className="ml-3 text-gray-400">
                  <a href="mailto:info@bigdealegypt.com" className="hover:text-primary-300">
                    info@bigdealegypt.com
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <FiPhone className="h-5 w-5 text-primary-500" />
                <div className="ml-3 text-gray-400">
                  <a href="tel:+201234567890" className="hover:text-primary-300">
                    +20 123 456 7890
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <FiClock className="h-5 w-5 text-primary-500" />
                <div className="ml-3 text-gray-400">
                  Mon-Fri: 9:00 AM - 5:00 PM<br />
                  Sat: 10:00 AM - 2:00 PM
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} BigDealEgypt. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-300">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-gray-500 hover:text-primary-300">
              Cookie Policy
            </Link>
          </div>
        </div>
        
        {/* Made with love */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center text-xs text-gray-600">
          <p className="flex items-center justify-center">
            Made with <FiHeart className="mx-1 text-red-500" /> in Cairo, Egypt
          </p>
        </div>
      </div>
    </footer>
  );
}