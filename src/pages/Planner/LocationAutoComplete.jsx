import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const LocationAutocomplete = ({selectedPlace, setSelectedPlace}) => {

  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)



  useEffect(() => {
    // Initialize Google Places API
    const initPlacesAPI = () => {
      if (!window.google || !inputRef.current) return

      // Initialize Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['establishment', 'geocode'],
      })

      // Add place_changed event listener
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
    }

    // Load Google Maps Script
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBU2YHegoW7ISCBBBfTVKWV4JUwmsSJyik&libraries=places`
      script.async = true
      script.defer = true
      script.addEventListener('load', initPlacesAPI)
      document.head.appendChild(script)

      return () => {
        script.removeEventListener('load', initPlacesAPI)
        script.remove()
      }
    } else {
      initPlacesAPI()
    }
  }, [])

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace()

    if (!place.geometry) {
      console.log('No geometry for this place')
      return
    }

    const placeData = {
      address: place.formatted_address,
      name: place.name,
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      addressComponents: parseAddressComponents(place.address_components),
    }

    setSelectedPlace(placeData)
    console.log('Selected Place:', placeData)
  }

  const parseAddressComponents = (components) => {
    const parsed = {}
    components?.forEach((component) => {
      component.types.forEach((type) => {
        parsed[type] = component.long_name
      })
    })
    return parsed
  }

  const getCurrentLocation = () => {
    setLoading(true)

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const geocoder = new window.google.maps.Geocoder()

          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            setLoading(false)
            if (status === 'OK' && results[0]) {
              const placeData = {
                address: results[0].formatted_address,
                coordinates: {
                  lat: latitude,
                  lng: longitude,
                },
                addressComponents: parseAddressComponents(results[0].address_components),
              }
              setSelectedPlace(placeData)
              if (inputRef.current) {
                inputRef.current.value = results[0].formatted_address
              }
              return placeData
            } else {
              alert('Could not find address for this location')
            }
          })
        } catch (error) {
          setLoading(false)
          alert('Error getting location details')
        }
      },
      (error) => {
        setLoading(false)
        alert('Error getting location: ' + error.message)
      }
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a location..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={getCurrentLocation} disabled={loading}>
          <Navigation className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {selectedPlace && (
        <div className="p-4 text-black border rounded-lg bg-white space-y-2 dark:bg-gray-900 dark:text-white">
          <div>
            <h3 className="font-medium">Selected Location</h3>
            <p className="text-sm">{selectedPlace.address}</p>
          </div>
          <div>
            <h3 className="font-medium">Coordinates</h3>
            <p className="text-sm">
              Lat: {selectedPlace.coordinates.lat.toFixed(6)}
              <br />
              Lng: {selectedPlace.coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationAutocomplete
