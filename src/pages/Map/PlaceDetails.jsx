import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'sonner'

const DEFAULT_CENTER = { lat: -33.866, lng: 151.196 } // Default location (Sydney)
const DEFAULT_ZOOM = 15

const MapWithLocation = () => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [locationMarker, setLocationMarker] = useState(null)

  const updateLocationMarker = (position) => {
    const { latitude: lat, longitude: lng, accuracy } = position.coords

    // Remove existing marker if it exists
    if (locationMarker) {
      locationMarker.setMap(null)
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      map,
      position: { lat, lng },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#4A90E2',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 8,
      },
      title: 'Your Location',
    })

    setLocationMarker(newMarker)
    map.panTo({ lat, lng })

    // Show success toast with accuracy
    toast.success('Location updated', {
      description: `Accuracy: within ${Math.round(accuracy)} meters`,
    })
  }

  const watchLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported', {
        description: 'Your browser does not support location services.',
      })
      return
    }

    // Show loading toast
    const loadingToast = toast.loading('Getting your location...')

    // Watch position and update marker when location changes
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // Clear the loading toast on first position
        toast.dismiss(loadingToast)
        updateLocationMarker(position)
      },
      (error) => {
        // Clear the loading toast
        toast.dismiss(loadingToast)

        // Show appropriate error message
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied', {
              description: 'Please enable location services in your browser settings.',
            })
            break
          case error.POSITION_UNAVAILABLE:
            toast.error('Location unavailable', {
              description: 'Unable to determine your location. Please try again.',
            })
            break
          case error.TIMEOUT:
            toast.error('Location request timeout', {
              description: 'Getting your location took too long. Please try again.',
            })
            break
          default:
            toast.error('Location error', {
              description: error.message,
            })
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )

    // Return cleanup function
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBU2YHegoW7ISCBBBfTVKWV4JUwmsSJyik`
        script.async = true
        script.defer = true
        script.onload = initMap
        document.head.appendChild(script)
      } else {
        initMap()
      }
    }

    const initMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
      })

      setMap(mapInstance)

      toast.info('Map loaded', {
        description: 'Starting location services...',
      })

      // Start watching location once map is initialized
      const cleanupWatch = watchLocation()

      return cleanupWatch
    }

    loadGoogleMapsScript()

    return () => {
      // Cleanup
      if (locationMarker) {
        locationMarker.setMap(null)
      }
      const scripts = document.getElementsByTagName('script')
      for (let script of scripts) {
        if (script.src.includes('maps.googleapis.com')) {
          script.remove()
        }
      }
    }
  }, [])

  return (
    <>
      <Toaster richColors position="top-right" />
      <Card className="w-full h-full min-h-[500px]">
        <CardContent className="p-0">
          <div ref={mapRef} className="w-full h-[500px]" />
        </CardContent>
      </Card>
    </>
  )
}

export default MapWithLocation
