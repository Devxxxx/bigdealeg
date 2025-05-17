'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Testimonials from '../components/landing/Testimonials'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import Hero from "../components/landing/Hero";

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <main>
      <Navbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8">Join BigDealEgypt today and get cashback on your purchase!</p>
          <Link 
            href="/register" 
            className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-md text-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}