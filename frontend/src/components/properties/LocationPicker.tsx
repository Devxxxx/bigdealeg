'use client'

import { useState, useEffect, useRef } from 'react'
import { FiSearch, FiMapPin, FiTarget, FiAlertCircle } from 'react-icons/fi'

// Fallback to a public API key for development (restricted to your domain in production)
// You should replace this with your own API key in production
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyA5UgwS4ooUTXQcbCCZF-lVZQN6G7_OFRw'

// Load Google Maps script only once
let isGoogleMapsLoaded = false
let googleMapsLoadPromise = null
let loadAttempted = false

const loadGoogleMapsScript = () => {
  if (isGoogleMapsLoaded) {
    return Promise.resolve()
  }
  
  if (googleMapsLoadPromise) {
    return googleMapsLoadPromise
  }
  
  if (loadAttempted) {
    return Promise.reject(new Error('Failed to load Google Maps API'))
  }
  
  loadAttempted = true
  
  googleMapsLoadPromise = new Promise((resolve, reject) => {
    // Create a unique callback name
    const callbackName = `googleMapsCallback_${Date.now()}`
    
    // Set up the callback
    window[callbackName] = () => {
      isGoogleMapsLoaded = true
      resolve()
      delete window[callbackName]
    }
    
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=${callbackName}`
    script.async = true
    script.defer = true
    script.onerror = (error) => {
      console.error('Error loading Google Maps API:', error)
      reject(new Error('Failed to load Google Maps API'))
    }
    document.head.appendChild(script)
    
    // Fallback in case the callback doesn't work
    setTimeout(() => {
      if (!isGoogleMapsLoaded) {
        reject(new Error('Google Maps API load timeout'))
      }
    }, 10000)
  })
  
  return googleMapsLoadPromise
}

/**
 * LocationPicker Component
 * A component that allows users to select a location on a map
 * 
 * @param {Object} props
 * @param {Function} props.onSelect - Callback function when a location is selected
 * @param {Object} props.initialLocation - Initial location to show on map
 */
const LocationPicker = ({ onSelect, initialLocation = { lat: 30.0444, lng: 31.2357 } }) => {
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(null)
  const mapRef = useRef(null)
  const geocoderRef = useRef(null)
  
  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapLoaded) return
      
      try {
        setLoading(true)
        await loadGoogleMapsScript()
        
        // Make sure window.google is defined
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps not available')
        }
        
        // Create map instance
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: initialLocation,
          zoom: 12,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        })
        
        setMap(newMap)
        setMapLoaded(true)
        
        // Create geocoder
        geocoderRef.current = new window.google.maps.Geocoder()
        
        // Add a marker at the initial location
        const newMarker = new window.google.maps.Marker({
          position: initialLocation,
          map: newMap,
          draggable: true,
          animation: window.google.maps.Animation.DROP
        })
        
        setMarker(newMarker)
        
        // Listen for marker drag events
        newMarker.addListener('dragend', () => {
          const position = newMarker.getPosition()
          onSelect({
            lat: position.lat(),
            lng: position.lng()
          })
        })
        
        // Listen for map click events
        newMap.addListener('click', (event) => {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }
          
          // Move the marker to the clicked location
          newMarker.setPosition(clickedLocation)
          
          // Call the onSelect callback with the new location
          onSelect(clickedLocation)
        })
      } catch (error) {
        console.error('Error initializing map:', error)
        setMapError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    initMap()
  }, [initialLocation, onSelect, mapLoaded])
  
  // Search for a location
  const searchLocation = async (e) => {
    e.preventDefault()
    
    if (!searchQuery.trim() || !geocoderRef.current) return
    
    setLoading(true)
    
    try {
      geocoderRef.current.geocode({ address: searchQuery }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          setSearchResults(results.slice(0, 5))
        } else {
          setSearchResults([])
        }
        setLoading(false)
      })
    } catch (error) {
      console.error('Error searching for location:', error)
      setLoading(false)
    }
  }
  
  // Go to a selected search result
  const goToLocation = (result) => {
    if (!map || !marker) return
    
    const location = result.geometry.location
    
    map.setCenter(location)
    map.setZoom(15)
    
    marker.setPosition(location)
    
    // Call the onSelect callback with the new location
    onSelect({
      lat: location.lat(),
      lng: location.lng()
    })
    
    // Clear search results
    setSearchResults([])
    setSearchQuery('')
  }
  
  // Use browser geolocation to find user's current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          
          if (map) {
            map.setCenter(userLocation)
            map.setZoom(15)
          }
          
          if (marker) {
            marker.setPosition(userLocation)
          }
          
          onSelect(userLocation)
        },
        (error) => {
          console.error('Error getting current location:', error)
          alert('Unable to get your current location. Please try again or search for a location.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }
  
  return (
    <div className="relative h-full w-full bg-gray-100">
      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full"></div>
      
      {/* Error message if Google Maps fails to load */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto text-center">
            <FiAlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-red-800 mb-1">Google Maps Error</h3>
            <p className="text-xs text-red-600">{mapError}</p>
            <p className="text-xs text-gray-600 mt-2">
              You can still continue with the property creation process.
              The location will need to be set later.
            </p>
          </div>
        </div>
      )}
      
      {!mapError && (
        <>
          {/* Search Box */}
          <div className="absolute top-3 left-3 right-3 z-10">
            <form onSubmit={searchLocation} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                className="w-full px-3 py-2 pl-10 pr-14 text-sm rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 py-1 flex items-center text-xs font-medium text-white bg-primary-600 rounded-r-md hover:bg-primary-700 focus:outline-none"
              >
                Search
              </button>
            </form>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-72 overflow-y-auto">
                <ul className="py-1">
                  {searchResults.map((result, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => goToLocation(result)}
                        className="flex items-start px-4 py-2 w-full text-left hover:bg-gray-50"
                      >
                        <FiMapPin className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {result.formatted_address}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Current Location Button */}
          <button
            type="button"
            onClick={useCurrentLocation}
            className="absolute bottom-4 right-4 z-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Use current location"
          >
            <FiTarget className="h-5 w-5 text-primary-600" />
          </button>
          
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10">
              <div className="px-3 py-1 bg-white rounded-full shadow-md text-xs font-medium text-gray-700">
                Searching...
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Map loading placeholder */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationPicker