'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiMessageSquare, FiCheck } from 'react-icons/fi';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import scheduledViewingApi from '@/lib/api/scheduledViewing';
import { AnimatePresence, motion } from "framer-motion";

interface SelectViewingSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewingId: string;
  propertyTitle: string;
  proposedDates: string[];
  proposedTimes: string[];
}

interface DateOption {
  value: string;
  label: string;
}

interface TimeOption {
  value: string;
  label: string;
}

export default function SelectViewingSlotModal({ 
  isOpen, 
  onClose, 
  viewingId,
  propertyTitle,
  proposedDates,
  proposedTimes
}: SelectViewingSlotModalProps) {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  
  // Format dates and times for display
  const dateOptions: DateOption[] = proposedDates.map(date => ({
    value: date,
    label: new Date(date).toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }));
  
  // Format time options
  const timeOptions: TimeOption[] = proposedTimes.map(time => {
    // Convert 24-hour time format to 12-hour format with AM/PM
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;
    
    return {
      value: time,
      label: formattedTime
    };
  });
  
  const resetForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
    setSuccess(false);
    setError(null);
  };
  
  const validateForm = (): boolean => {
    if (!selectedDate) {
      setError('Please select a date');
      return false;
    }
    
    if (!selectedTime) {
      setError('Please select a time');
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
      
      const selectionData = {
        selected_date: selectedDate,
        selected_time: selectedTime,
        notes
      };
      
      await scheduledViewingApi.selectViewingSlot(
        session.access_token,
        viewingId,
        selectionData
      );
      
      setSuccess(true);
    } catch (err) {
      console.error('Error selecting viewing slot:', err);
      setError('Failed to select viewing slot. Please try again.');
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
                  Select Viewing Time
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
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Viewing Time Selected</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      You have successfully selected a viewing time for {propertyTitle}. Our sales team will confirm your appointment shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Select your preferred viewing time for {propertyTitle}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Please choose from the available slots below. Our sales team will confirm your selected time.
                      </p>
                      
                      {/* Date selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Dates
                        </label>
                        <div className="space-y-2">
                          {dateOptions.map((date) => (
                            <div 
                              key={date.value}
                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedDate === date.value 
                                  ? 'bg-primary-50 border-primary-200' 
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedDate(date.value)}
                            >
                              <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                                selectedDate === date.value 
                                  ? 'bg-primary-600 border-primary-600' 
                                  : 'border-gray-300'
                              }`}>
                                {selectedDate === date.value && (
                                  <FiCheck className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="ml-3 flex items-center">
                                <FiCalendar className="mr-2 text-gray-400" />
                                <span className="text-gray-700">{date.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Time selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Times
                        </label>
                        <div className="space-y-2">
                          {timeOptions.map((time) => (
                            <div 
                              key={time.value}
                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedTime === time.value 
                                  ? 'bg-primary-50 border-primary-200' 
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedTime(time.value)}
                            >
                              <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                                selectedTime === time.value 
                                  ? 'bg-primary-600 border-primary-600' 
                                  : 'border-gray-300'
                              }`}>
                                {selectedTime === time.value && (
                                  <FiCheck className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="ml-3 flex items-center">
                                <FiClock className="mr-2 text-gray-400" />
                                <span className="text-gray-700">{time.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (optional)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMessageSquare className="text-gray-400" />
                          </div>
                          <textarea
                            rows={3}
                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Any additional information or questions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
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
                      Confirm Selection
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