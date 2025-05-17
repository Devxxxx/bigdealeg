'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiMessageSquare, FiCheck, FiPlus, FiMinus } from 'react-icons/fi';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import scheduledViewingApi from '@/lib/api/scheduledViewing';
import { AnimatePresence, motion } from "framer-motion";

interface ProposeViewingSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewingId: string;
  propertyTitle: string;
}

export default function ProposeViewingSlotsModal({ 
  isOpen, 
  onClose, 
  viewingId,
  propertyTitle
}: ProposeViewingSlotsModalProps) {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [dates, setDates] = useState<string[]>(['']);
  const [times, setTimes] = useState<string[]>(['']);
  const [privateNotes, setPrivateNotes] = useState('');
  
  const resetForm = () => {
    setDates(['']);
    setTimes(['']);
    setPrivateNotes('');
    setSuccess(false);
    setError(null);
  };
  
  const addDate = () => {
    setDates([...dates, '']);
  };
  
  const removeDate = (index: number) => {
    if (dates.length === 1) return;
    const newDates = [...dates];
    newDates.splice(index, 1);
    setDates(newDates);
  };
  
  const updateDate = (index: number, value: string) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };
  
  const addTime = () => {
    setTimes([...times, '']);
  };
  
  const removeTime = (index: number) => {
    if (times.length === 1) return;
    const newTimes = [...times];
    newTimes.splice(index, 1);
    setTimes(newTimes);
  };
  
  const updateTime = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };
  
  const validateForm = (): boolean => {
    // Check if any date is empty
    if (dates.some(date => !date.trim())) {
      setError('All date fields must be filled');
      return false;
    }
    
    // Check if any time is empty
    if (times.some(time => !time.trim())) {
      setError('All time fields must be filled');
      return false;
    }
    
    // Check for duplicates
    if (new Set(dates).size !== dates.length) {
      setError('Please remove duplicate dates');
      return false;
    }
    
    if (new Set(times).size !== times.length) {
      setError('Please remove duplicate times');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!session?.access_token) {
      setError('Authentication error. Please try logging in again.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const proposalData = {
        proposed_dates: dates,
        proposed_times: times,
        private_notes: privateNotes
      };
      
      await scheduledViewingApi.proposeViewingSlots(
        session.access_token,
        viewingId,
        proposalData
      );
      
      setSuccess(true);
    } catch (err) {
      console.error('Error proposing viewing slots:', err);
      setError('Failed to propose viewing slots. Please try again.');
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
                  Propose Viewing Slots
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
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Viewing Slots Proposed</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      You have successfully proposed viewing slots for {propertyTitle}. The customer will be notified and can now select their preferred slot.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Propose viewing slots for {propertyTitle}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Suggest multiple dates and times for the customer to choose from.
                      </p>
                      
                      {/* Date selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Dates
                        </label>
                        
                        {dates.map((date, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <div className="relative flex-grow rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiCalendar className="text-gray-400" />
                              </div>
                              <input
                                type="date"
                                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                value={date}
                                onChange={(e) => updateDate(index, e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            
                            {dates.length > 1 && (
                              <button
                                type="button"
                                className="ml-2 p-2 text-gray-400 hover:text-red-500"
                                onClick={() => removeDate(index)}
                              >
                                <FiMinus />
                              </button>
                            )}
                            
                            {index === dates.length - 1 && (
                              <button
                                type="button"
                                className="ml-2 p-2 text-gray-400 hover:text-green-500"
                                onClick={addDate}
                              >
                                <FiPlus />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Time selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Times
                        </label>
                        
                        {times.map((time, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <div className="relative flex-grow rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiClock className="text-gray-400" />
                              </div>
                              <input
                                type="time"
                                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                value={time}
                                onChange={(e) => updateTime(index, e.target.value)}
                              />
                            </div>
                            
                            {times.length > 1 && (
                              <button
                                type="button"
                                className="ml-2 p-2 text-gray-400 hover:text-red-500"
                                onClick={() => removeTime(index)}
                              >
                                <FiMinus />
                              </button>
                            )}
                            
                            {index === times.length - 1 && (
                              <button
                                type="button"
                                className="ml-2 p-2 text-gray-400 hover:text-green-500"
                                onClick={addTime}
                              >
                                <FiPlus />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Private notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Private Notes (optional)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMessageSquare className="text-gray-400" />
                          </div>
                          <textarea
                            rows={3}
                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Notes for internal use only (not shown to customer)..."
                            value={privateNotes}
                            onChange={(e) => setPrivateNotes(e.target.value)}
                          ></textarea>
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
                      Send to Customer
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