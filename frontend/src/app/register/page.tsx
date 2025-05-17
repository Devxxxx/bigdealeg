'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiCheck,
  FiPhone,
  FiArrowRight,
  FiUserCheck,
  FiShield,
  FiHeart
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormInputs {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

// Added CSS classes for fixes
const pageStyles = {
  wrapper: 'min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row overflow-hidden',
  leftPanel: 'lg:w-2/5 bg-gradient-to-br from-primary-700 to-primary-900 text-white overflow-hidden',
  rightPanel: 'lg:w-3/5 bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-16 overflow-auto',
};

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const { register, handleSubmit, watch, formState: { errors, isValid, isDirty }, trigger } = useForm<RegisterFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    },
    mode: 'onChange'
  });
  
  const password = watch('password');
  
  const goToNextStep = async () => {
    // Validate first step fields
    const isStepValid = await trigger(['name', 'email', 'phone']);
    if (isStepValid) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };
  
  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    setRegisterError('');
    
    try {
      // Call the signUp method from our updated hook
      const { error } = await signUp(data.email, data.password, data.name);
      
      if (error) {
        // More specific error message based on the error
        const errorMessage = error instanceof Error ? error.message : 'Registration failed. This email may already be in use.';
        setRegisterError(errorMessage);
      }
      // Note: No need to manually redirect - the AuthProvider will handle redirection to login page on successful signup
    } catch (error) {
      setRegisterError('An unexpected error occurred. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const benefits = [
    {
      title: "No Broker Fees",
      description: "Connect directly with property sellers and save thousands on broker commissions",
      icon: <FiUserCheck />
    },
    {
      title: "Cashback Rewards",
      description: "Earn cashback on your property purchase when you buy through our platform",
      icon: <FiHeart />
    },
    {
      title: "Smart Property Matching",
      description: "Our AI matches you with properties that fit your exact requirements",
      icon: <FiShield />
    }
  ];
  
  return (
    <div className={pageStyles.wrapper}>
      {/* Left side - Why Join BigDealEgypt */}
      <div className={pageStyles.leftPanel}>
        <div className="h-full flex flex-col p-8 lg:p-12 xl:p-16">
          <Link href="/" className="inline-flex items-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 font-bold text-xl shadow-sm">
              BD
            </div>
            <span className="ml-3 text-xl font-display font-semibold text-white">BigDealEgypt</span>
          </Link>
          
          <div className="mt-12 lg:mt-20 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
                Why Join BigDealEgypt?
              </h2>
              <p className="text-xl mb-10 text-white/90">
                Create an account and start your journey to finding the perfect property in Egypt.
              </p>
              
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-primary-500 bg-opacity-40">
                      {benefit.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{benefit.title}</h3>
                      <p className="mt-1 text-white/80">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-16 p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex">
                  <div className="text-amber-300 mr-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0 1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514 1.514 0 0 1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35l4.325-.617 1.932-3.878c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662 0c.25.153.45.373.577.633l1.932 3.878 4.325.617c.285.044.554.165.776.35.22.185.383.427.475.698.087.27.08.558-.033.83a1.514 1.514 0 0 1-.357.739l-3.13 3 .736 4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582 1.582 0 0 1-1.643.117l-3.865-2-3.865 2z" />
                    </svg>
                  </div>
                  <div className="text-amber-300 mr-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0 1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514 1.514 0 0 1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35l4.325-.617 1.932-3.878c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662 0c.25.153.45.373.577.633l1.932 3.878 4.325.617c.285.044.554.165.776.35.22.185.383.427.475.698.087.27.08.558-.033.83a1.514 1.514 0 0 1-.357.739l-3.13 3 .736 4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582 1.582 0 0 1-1.643.117l-3.865-2-3.865 2z" />
                    </svg>
                  </div>
                  <div className="text-amber-300 mr-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0 1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514 1.514 0 0 1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35l4.325-.617 1.932-3.878c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662 0c.25.153.45.373.577.633l1.932 3.878 4.325.617c.285.044.554.165.776.35.22.185.383.427.475.698.087.27.08.558-.033.83a1.514 1.514 0 0 1-.357.739l-3.13 3 .736 4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582 1.582 0 0 1-1.643.117l-3.865-2-3.865 2z" />
                    </svg>
                  </div>
                  <div className="text-amber-300 mr-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0 1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514 1.514 0 0 1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35l4.325-.617 1.932-3.878c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662 0c.25.153.45.373.577.633l1.932 3.878 4.325.617c.285.044.554.165.776.35.22.185.383.427.475.698.087.27.08.558-.033.83a1.514 1.514 0 0 1-.357.739l-3.13 3 .736 4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582 1.582 0 0 1-1.643.117l-3.865-2-3.865 2z" />
                    </svg>
                  </div>
                  <div className="text-amber-300">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0 1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514 1.514 0 0 1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35l4.325-.617 1.932-3.878c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662 0c.25.153.45.373.577.633l1.932 3.878 4.325.617c.285.044.554.165.776.35.22.185.383.427.475.698.087.27.08.558-.033.83a1.514 1.514 0 0 1-.357.739l-3.13 3 .736 4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582 1.582 0 0 1-1.643.117l-3.865-2-3.865 2z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-white/90 italic">
                  "BigDealEgypt made it so easy to find property listings that matched exactly what I was looking for. The platform is user-friendly and removes all the hassle of dealing with brokers."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/25 flex items-center justify-center text-white font-medium">
                    SA
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Sara Ali</p>
                    <p className="text-sm text-white/70">First-time homebuyer</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-10 lg:mt-auto pt-4">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:text-white/90 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Registration form */}
      <div className={pageStyles.rightPanel}>
        <div className="max-w-lg mx-auto">
          {/* Step progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div className="w-full flex items-center">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > 1 ? <FiCheck className="h-6 w-6" /> : 1}
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > 1 ? 'bg-primary-600' : 'bg-gray-200'
                }`}></div>
              </div>
              <div className="w-full flex items-center">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > 2 ? <FiCheck className="h-6 w-6" /> : 2}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium text-gray-600">Your Information</span>
              <span className="text-sm font-medium text-gray-600">Account Security</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-6 text-center">
            {currentStep === 1 ? 'Create Your Account' : 'Set Up Your Password'}
          </h2>
          
          {registerError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-start"
            >
              <FiAlertCircle className="mt-0.5 mr-2 text-danger-500 flex-shrink-0" />
              <p className="text-sm text-danger-800">{registerError}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.name ? 'border-danger-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      {...register("name", { 
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters"
                        }
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-danger-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.email ? 'border-danger-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-danger-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+20 123 456 7890"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.phone ? 'border-danger-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      {...register("phone", { 
                        required: "Phone number is required",
                        pattern: {
                          value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                          message: "Invalid phone number format"
                        }
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-danger-600">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Continue
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Password and Terms */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      className={`block w-full pl-10 pr-10 py-3 border ${
                        errors.password ? 'border-danger-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: "Password must include uppercase, lowercase, number and special character"
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-danger-600">{errors.password.message}</p>
                  )}
                  
                  {/* Password strength indicator */}
                  {password && !errors.password && (
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        <div className="h-1 w-1/4 rounded-full bg-primary-600"></div>
                        <div className="h-1 w-1/4 rounded-full bg-primary-600"></div>
                        <div className="h-1 w-1/4 rounded-full bg-primary-600"></div>
                        <div className="h-1 w-1/4 rounded-full bg-primary-600"></div>
                      </div>
                      <p className="text-xs text-primary-600 mt-1">Strong password</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className={`block w-full pl-10 pr-10 py-3 border ${
                        errors.confirmPassword ? 'border-danger-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      {...register("confirmPassword", { 
                        required: "Please confirm your password",
                        validate: value => value === password || "Passwords do not match"
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-danger-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="mt-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        {...register("agreeTerms", { 
                          required: "You must agree to the terms and conditions"
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeTerms" className="text-gray-700">
                        I agree to the {' '}
                        <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                          Terms of Service
                        </Link>
                        {' '} and {' '}
                        <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                          Privacy Policy
                        </Link>
                      </label>
                      {errors.agreeTerms && (
                        <p className="mt-1 text-sm text-danger-600">{errors.agreeTerms.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>Create Account</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
          
          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.397 20.997v-8.196h2.765l0.411-3.209h-3.176v-2.041c0-0.926 0.258-1.56 1.587-1.56h1.684v-2.873c-0.302-0.035-1.346-0.129-2.556-0.129-2.477 0-4.21 1.513-4.21 4.295v2.307h-2.822v3.209h2.822v8.196h3.496z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}