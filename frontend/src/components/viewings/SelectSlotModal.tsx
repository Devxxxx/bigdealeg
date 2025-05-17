'use client';

import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import scheduledViewingApi from '@/lib/api/scheduledViewing';

interface SelectSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewingId: string;
  onSuccess: () => void;
}

export default function SelectSlotModal({ isOpen, onClose, viewingId, onSuccess }: SelectSlotModalProps) {
  const { session } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [viewingDetails, setViewingDetails] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch viewing details when modal opens
  useEffect(() => {
    const fetchViewingDetails = async () => {
      if (!isOpen || !session?.access_token || !viewingId) return;
      
      try {
        setLoadingData(true);
        setError(null);
        
        const data = await scheduledViewingApi.getScheduledViewingById(
          session.access_token,
          viewingId
        );
        
        setViewingDetails(data);
        
        // If there's only one date or time option, select it by default
        if (data.proposed_dates?.length === 1) {
          setSelectedDate(data.proposed_dates[0]);
        }
        
        if (data.proposed_times?.length === 1) {
          setSelectedTime(data.proposed_times[0]);
        }
      } catch (err) {
        console.error('Error fetching viewing details:', err);
        setError('Failed to load viewing options. Please try again.');
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchViewingDetails();
  }, [isOpen, session, viewingId]);
  
  const handleSubmit = async () => {
    if (!session?.access_token || !viewingId || !selectedDate || !selectedTime) {
      setError('Please select both a date and time.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const selectionData = {
        selected_date: selectedDate,
        selected_time: selectedTime
      };
      
      await scheduledViewingApi.selectViewingSlot(
        session.access_token,
        viewingId,
        selectionData
      );
      
      setSuccess(true);
      
      // Call the onSuccess callback after a small delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error selecting slot:', err);
      setError('Failed to select viewing slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
    setSuccess(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (timeString: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          ></div>
          
          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            {/* Modal header */}
            <div className="bg-primary-50 px-4 py-3 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg font-medium text-primary-900 flex items-center">
                <FiCalendar className="mr-2 h-5 w-5 text-primary-600" />
                Select Viewing Slot
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  onClose();
                  setTimeout(resetForm, 300);
                }}
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal body */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {loadingData ? (
                <div className="flex justify-center py-8">
                  <div className="relative h-12 w-12">
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-200 border-solid rounded-full opacity-20"></div>
                  </div>
                </div>
              ) : success ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <FiCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Slot Selected Successfully</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You have selected {selectedDate && formatDate(selectedDate)} at {selectedTime && formatTime(selectedTime)}.
                    Our team will confirm your viewing appointment soon.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-6">
                    Please select your preferred date and time for viewing this property. 
                    Our sales team will confirm your appointment shortly after.
                  </p>
                  
                  {viewingDetails?.property && (
                    <div className="mb-6 bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900">
                        {viewingDetails.property.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {viewingDetails.property.location}
                      </p>
                    </div>
                  )}
                  
                  {/* Date selection */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiCalendar className="mr-2 text-primary-500" />
                      Select Date
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {viewingDetails?.proposed_dates?.map((date: string) => (
                        <div 
                          key={date}
                          className={`
                            border rounded-lg p-3 cursor-pointer transition
                            ${selectedDate === date 
                              ? 'border-primary-500 bg-primary-50 text-primary-700' 
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'}
                          `}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="flex items-center">
                            {selectedDate === date && (
                              <FiCheck className="text-primary-500 mr-2" />
                            )}
                            <span>{formatDate(date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time selection */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiClock className="mr-2 text-primary-500" />
                      Select Time
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {viewingDetails?.proposed_times?.map((time: string) => (
                        <div 
                          key={time}
                          className={`
                            border rounded-lg p-3 cursor-pointer transition text-center
                            ${selectedTime === time 
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'}
                          `}
                          onClick={() => setSelectedTime(time)}
                        >
                          <div className="flex items-center justify-center">
                            {selectedTime === time && (
                              <FiCheck className="text-primary-500 mr-2" />
                            )}
                            <span>{formatTime(time)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                      <FiAlertCircle className="text-red-500 mt-0.5 mr-2" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
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
                    disabled={!selectedDate || !selectedTime || loading}
                  >
                    Confirm Selection
                  </Button>
                  
                  <Button 
                    variant="light"
                    onClick={() => {
                      onClose();
                      setTimeout(resetForm, 300);
                    }}
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
    </AnimatePresence>
  );
}