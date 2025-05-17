'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Added CSS classes for fixes
const pageStyles = {
  wrapper: 'min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden',
  formPanel: 'w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-24 relative',
  imagePanel: 'hidden lg:block lg:w-1/2 relative bg-primary-600',
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Call the signIn method from our updated hook
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        // More specific error message based on the error
        const errorMessage = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
        setLoginError(errorMessage);
      }
      // Note: No need to manually redirect - the AuthProvider will handle redirection to dashboard on successful login
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={pageStyles.wrapper}>
      {/* Left side - Form */}
      <div className={pageStyles.formPanel}>
        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0 bg-dot-pattern text-primary-600"></div>
        </div>
        
        <div className="z-10 relative">
          {/* Logo and site name */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <span className="text-white font-bold text-base">BD</span>
              </div>
              <span className="text-xl font-display font-semibold text-gradient-primary">BigDealEgypt</span>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Welcome back!
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue your property journey
              </p>
            </div>
            
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-start"
              >
                <FiAlertCircle className="mt-0.5 mr-2 text-danger-500 flex-shrink-0" />
                <p className="text-sm text-danger-800">{loginError}</p>
              </motion.div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      errors.password ? 'border-danger-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    {...register("password", { required: "Password is required" })}
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
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register("rememberMe")}
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>Sign in</>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.615 11.615 0 006.29 1.84"/>
                  </svg>
                  Twitter
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up now
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Benefits */}
      <div className={pageStyles.imagePanel}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90 z-10"></div>
        <img 
          alt="Modern property interior" 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white"
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Find Your Perfect Property in Egypt
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Connect directly with property owners, no middlemen involved
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-400 bg-opacity-30">
                  <FiCheck className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Save on Broker Fees</h3>
                  <p className="mt-1 text-white/80">Skip the broker fees and save up to 2.5% on your property purchase</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-400 bg-opacity-30">
                  <FiCheck className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Exclusive Cashback</h3>
                  <p className="mt-1 text-white/80">Receive cashback rewards on successful property purchases</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-400 bg-opacity-30">
                  <FiCheck className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">AI-Powered Matching</h3>
                  <p className="mt-1 text-white/80">Our AI technology finds properties that perfectly match your requirements</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm p-5 border border-white border-opacity-20">
              <p className="italic text-white/90">
                "BigDealEgypt helped me find the perfect apartment in New Cairo and saved me over 15,000 EGP in broker fees! The process was easy and transparent."
              </p>
              <div className="mt-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/25 flex items-center justify-center text-white font-medium">
                  AM
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Ahmed Mohamed</p>
                  <p className="text-sm text-white/70">New Cairo</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}