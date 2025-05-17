'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import scheduledViewingApi from '@/lib/api/scheduledViewing';
import { FiHome, FiMapPin, FiMaximize2, FiDollarSign, FiCheck, FiCalendar, FiHeart, FiShare2, FiShield, FiArrowLeft, FiInfo, FiClock, FiCheckCircle } from 'react-icons/fi';
import PropertyGallery from '@/components/properties/PropertyGallery';
import PropertyFeatures from '@/components/properties/PropertyFeatures';
import PropertyLocation from '@/components/properties/PropertyLocation';
import SimilarProperties from '@/components/properties/SimilarProperties';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { getPropertyById, incrementPropertyViews, Property } from '@/lib/propertyService';
import { useAuth } from '@/hooks/useAuth';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import RequestViewingModal from '@/components/properties/RequestViewingModal';
import SelectSlotModal from '@/components/viewings/SelectSlotModal';

export default function PropertyDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, session } = useAuth();
  const { isSaved, toggleSaved } = useSavedProperties(id);
  
  // Determine user role for UI permissions
  const isCustomer = user?.role === 'customer';
  
  // State for viewing status
  const [viewingStatus, setViewingStatus] = useState<string | null>(null);
  const [viewingDetails, setViewingDetails] = useState<any | null>(null);
  const [loadingViewingStatus, setLoadingViewingStatus] = useState(false);
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const propertyData = await getPropertyById(id);
        
        if (!propertyData) {
          setError('Property not found');
          return;
        }
        
        setProperty(propertyData);
        
        // Increment view count
        await incrementPropertyViews(id);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id]);
  
  // Effect to fetch viewing status for this property
  useEffect(() => {
    const fetchViewingStatus = async () => {
      if (!user || !session?.access_token || !property?.id) return;
      
      try {
        setLoadingViewingStatus(true);
        
        // Get viewings for this property by this user
        const viewingsData = await scheduledViewingApi.getScheduledViewings(
          session.access_token,
          { propertyId: property.id }
        );
        
        // Check if there's any viewing by this user for this property
        if (viewingsData?.viewings?.length > 0) {
          const latestViewing = viewingsData.viewings[0];
          setViewingStatus(latestViewing.status);
          setViewingDetails(latestViewing);
        } else {
          setViewingStatus('none');
        }
      } catch (err) {
        console.error('Error fetching viewing status:', err);
        // Don't show an error to the user, just assume no viewing
        setViewingStatus('none');
      } finally {
        setLoadingViewingStatus(false);
      }
    };
    
    fetchViewingStatus();
  }, [user, session, property]);
  
  const handleToggleSave = async () => {
    if (!user) {
      // Prompt user to login
      router.push('/login?redirect=/properties/' + id);
      return;
    }
    
    try {
      await toggleSaved();
    } catch (err) {
      console.error('Error toggling property save status:', err);
    }
  };
  
  const openViewingModal = () => {
    if (!user) {
      router.push('/login?redirect=/properties/' + id);
      return;
    }
    setShowViewingModal(true);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse space-y-8 w-full max-w-3xl">
          <div className="h-60 bg-gray-200 rounded-xl"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="primary"
            onClick={() => router.push('/properties')}
            leftIcon={<FiArrowLeft />}
          >
            Browse Properties
          </Button>
        </Card>
      </div>
    );
  }
  
  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' EGP';
  };
  
  return (
    <div className="pb-16">
      {/* Back button */}
      <div className="mb-4">
        <Button 
          variant="light"
          onClick={() => router.back()}
          leftIcon={<FiArrowLeft />}
          size="sm"
        >
          Back to properties
        </Button>
      </div>
      
      {/* Property Gallery */}
      <PropertyGallery 
        images={property.image_urls || []} 
        featuredImage={property.featured_image}
        title={property.title}
      />
      
      {/* Property Details */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <FiMapPin className="mr-1 flex-shrink-0" /> 
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="text-2xl md:text-3xl font-bold text-primary-700">
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>
            
            {/* Property highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-gray-500 text-sm mb-1">Type</div>
                <div className="font-medium flex items-center">
                  <FiHome className="mr-2 text-primary-600" /> 
                  {property.property_type}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-gray-500 text-sm mb-1">Bedrooms</div>
                <div className="font-medium">{property.bedrooms || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-gray-500 text-sm mb-1">Bathrooms</div>
                <div className="font-medium">{property.bathrooms || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-gray-500 text-sm mb-1">Area</div>
                <div className="font-medium flex items-center">
                  <FiMaximize2 className="mr-2 text-primary-600" /> 
                  {property.area_size} m²
                </div>
              </div>
            </div>
            
            {/* Property description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>{property.description || 'No description available for this property.'}</p>
              </div>
            </div>
            
            {/* Property features */}
            <PropertyFeatures features={property.features || []} />
            
            {/* Property location */}
            <PropertyLocation location={property.location} />
          </motion.div>
        </div>
        
        {/* Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-6">

              
              <div className="space-y-3">
                {isCustomer && (
                  <>
                    {viewingStatus === 'none' && (
                      <Button
                        variant="primary"
                        fullWidth
                        leftIcon={<FiCalendar />}
                        onClick={openViewingModal}
                      >
                        Schedule a Viewing
                      </Button>
                    )}
                    
                    {viewingStatus === 'requested' && (
                      <Button
                        variant="light"
                        fullWidth
                        leftIcon={<FiInfo />}
                        disabled
                      >
                        Viewing Request Submitted
                      </Button>
                    )}
                    
                    {viewingStatus === 'options_sent' && (
                      <Button
                        variant="primary"
                        fullWidth
                        leftIcon={<FiCalendar />}
                        onClick={() => setShowSlotModal(true)}
                      >
                        Select Viewing Slot
                      </Button>
                    )}
                    
                    {viewingStatus === 'slot_selected' && (
                      <Button
                        variant="light"
                        fullWidth
                        leftIcon={<FiClock />}
                        disabled
                      >
                        Waiting for Confirmation
                      </Button>
                    )}
                    
                    {viewingStatus === 'confirmed' && (
                      <Button
                        variant="success"
                        fullWidth
                        leftIcon={<FiCheckCircle />}
                        onClick={() => router.push(`/dashboard/scheduled-viewings/${viewingDetails.id}`)}
                      >
                        Viewing Confirmed: {new Date(viewingDetails.viewing_date).toLocaleDateString()}
                      </Button>
                    )}
                    
                    {(viewingStatus === 'cancelled' || viewingStatus === 'completed') && (
                      <Button
                        variant="primary"
                        fullWidth
                        leftIcon={<FiCalendar />}
                        onClick={openViewingModal}
                      >
                        Schedule Another Viewing
                      </Button>
                    )}
                    
                    <Button
                      variant={isSaved ? "danger" : "outline"}
                      fullWidth
                      leftIcon={<FiHeart />}
                      onClick={handleToggleSave}
                    >
                      {isSaved ? 'Remove from Saved' : 'Save Property'}
                    </Button>
                    
                    <Button
                      variant="light"
                      fullWidth
                      leftIcon={<FiShare2 />}
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                    >
                      Share Property
                    </Button>
                  </>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiShield className="mr-2 text-primary-600" />
                  <span>Listed by verified seller</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <FiCheck className="mr-2 text-green-500" />
                  <span>Property available for viewing</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Similar properties */}
      <SimilarProperties currentProperty={property} />
      
      {/* Viewing request modal */}
      <RequestViewingModal
        isOpen={showViewingModal}
        onClose={() => setShowViewingModal(false)}
        property={property}
      />
      
      {/* Select slot modal */}
      {viewingDetails && (
        <SelectSlotModal
          isOpen={showSlotModal}
          onClose={() => setShowSlotModal(false)}
          viewingId={viewingDetails?.id}
          onSuccess={() => {
            setShowSlotModal(false);
            // Refresh viewing status after selection
            setViewingStatus('slot_selected');
          }}
        />
      )}
    </div>
  );
}
