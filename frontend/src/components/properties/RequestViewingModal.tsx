'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiMessageSquare, FiCheck, FiInfo } from 'react-icons/fi';
import { Property } from '@/lib/propertyService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import scheduledViewingApi from '@/lib/api/scheduledViewing';
import {AnimatePresence, motion} from "framer-motion";

interface RequestViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export default function RequestViewingModal({ isOpen, onClose, property }: RequestViewingModalProps) {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state - only notes are needed now
  const [notes, setNotes] = useState('');
  
  const resetForm = () => {
    setNotes('');
    setSuccess(false);
    setError(null);
  };
  
  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to request a viewing');
      return;
    }
    
    if (!session?.access_token) {
      setError('Authentication error. Please try logging in again.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare viewing data for the API - only property ID and notes
      const viewingData = {
        property_id: property.id,
        notes
      };
      
      // Call our API client 
      await scheduledViewingApi.createScheduledViewing(
        session.access_token,
        viewingData
      );
      
      setSuccess(true);
    } catch (err) {
      console.error('Error scheduling viewing:', err);
      setError('Failed to schedule viewing. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            ></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              {/* Modal header */}
              <div className="bg-primary-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-primary-900">
                  Schedule a Property Viewing
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    onClose();
                    setTimeout(resetForm, 300); // Reset form after animation completes
                  }}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              {/* Modal body */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {success ? (
                <div className="text-center py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <FiCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Viewing Request Submitted</h3>
                <p className="mt-2 text-sm text-gray-500">
                Your request to view {property.title} has been submitted successfully. Our sales team will propose available time slots for your viewing soon. You will receive a notification when slots are available for selection.
                </p>
                </div>
                ) : (
                <>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                  <FiInfo className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How scheduling works:</p>
                <ol className="list-decimal pl-5 space-y-1">
                <li>Submit your viewing request</li>
                <li>Our sales team will propose available time slots</li>
                <li>You'll select your preferred slot</li>
                <li>Sales team will confirm your appointment</li>
                </ol>
                </div>
                </div>
                
                <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                Request a viewing for {property.title}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                Submit your request to view this property, and our sales team will get back to you with available viewing slots.
                </p>
                <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMessageSquare className="text-gray-400" />
                    </div>
                      <textarea
                          rows={4}
                          className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Any special requests, questions, or preferred days of the week..."
                          value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
                </div>
                </div>
                </div>
                
                {/* Error message */}
                {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
                </div>
                )}
                </>
                )}
              </div>
              
              {/* Modal footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {success ? (
                  <Button 
                    variant="primary"
                    onClick={() => {
                      onClose();
                      setTimeout(resetForm, 300);
                    }}
                  >
                    Done
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="primary"
                      onClick={handleSubmit}
                      loading={loading}
                    >
                      Submit Request
                    </Button>
                    
                    <Button 
                      variant="light"
                      onClick={onClose}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}