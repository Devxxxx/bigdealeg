'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiCheckSquare, 
  FiCalendar, 
  FiHome, 
  FiDollarSign,
  FiArrowRight 
} from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FiCheckSquare className="h-8 w-8" />,
      title: "Submit Requirements",
      description: "Tell us what you're looking for in your dream property. From location preferences to specific amenities, we capture all your needs.",
      color: "bg-primary-500",
      image: "/images/submit-requirements.jpg" // You'll need to add these images to your project
    },
    {
      icon: <FiSearch className="h-8 w-8" />,
      title: "AI-Powered Matching",
      description: "Our advanced algorithm matches you with properties that meet your criteria, saving you time and effort in your search.",
      color: "bg-secondary-500",
      image: "/images/property-matching.jpg"
    },
    {
      icon: <FiCalendar className="h-8 w-8" />,
      title: "Schedule Viewings",
      description: "Book appointments directly through our platform to see your matched properties at your convenience.",
      color: "bg-accent-500",
      image: "/images/schedule-viewing.jpg"
    },
    {
      icon: <FiDollarSign className="h-8 w-8" />,
      title: "Get Cashback",
      description: "Complete your purchase through BigDealEgypt and receive cashback that would have gone to brokers.",
      color: "bg-success-500",
      image: "/images/get-cashback.jpg"
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      }
    })
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
            How <span className="text-gradient-primary">BigDealEgypt</span> Works
          </h2>
          <p className="text-lg text-gray-600">
            Our streamlined process connects you directly with property sellers,
            eliminating brokers and saving you money.
          </p>
        </div>
        
        {/* Process Steps */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop View - Timeline Style */}
          <div className="hidden lg:block relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`flex items-center mb-20 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                custom={index}
                variants={fadeIn}
              >
                <div className={`w-1/2 pr-12 ${index % 2 === 0 ? 'text-right' : 'text-left order-1 pl-12 pr-0'}`}>
                  <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                {/* Center Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className={`${step.color} text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg z-10`}>
                    {step.icon}
                  </div>
                  <div className="absolute bg-white h-20 w-20 rounded-full opacity-20 animate-pulse"></div>
                </div>
                
                <div className={`w-1/2 pl-12 ${index % 2 === 0 ? 'order-1' : 'text-right pr-12 pl-0'}`}>
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100">
                      {/* Replace with actual images */}
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                        <span className="text-primary-600 font-medium">Step {index + 1} Image</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Mobile/Tablet View - Card Style */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={index}
                variants={fadeIn}
              >
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-100">
                    {/* Replace with actual images */}
                    <div className="h-48 md:h-full w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                      <span className="text-primary-600 font-medium">Step {index + 1} Image</span>
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center mb-3">
                      <div className={`${step.color} text-white h-10 w-10 rounded-full flex items-center justify-center mr-3`}>
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-display font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <a 
            href="/register" 
            className="btn-primary btn-lg group inline-flex items-center"
          >
            <span>Get Started Now</span>
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="mt-4 text-sm text-gray-500">No broker fees. No middlemen. Just great deals.</p>
        </div>
      </div>
    </section>
  );
}