import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJsApiLoader } from '@react-google-maps/api';
import { useAtom } from 'jotai';
import { MapPin, Navigation } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MyLocAtom } from './store';

const libraries = ['places'];

const LocationAutocomplete = ({ selectedPlace, setSelectedPlace }) => {
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useAtom(MyLocAtom);
  const [initializingLocation, setInitializingLocation] = useState(true);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU2YHegoW7ISCBBBfTVKWV4JUwmsSJyik",
    libraries,
  });

  const parseAddressComponents = (components) => {
    const parsed = {};
    components?.forEach((component) => {
      component.types.forEach((type) => {
        parsed[type] = component.long_name;
      });
    });
    return parsed;
  };

  const getCurrentLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLoading(false);
      setInitializingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          if (!window.google?.maps?.Geocoder) {
            throw new Error('Google Maps Geocoder not loaded');
          }

          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setLoading(false);
              setInitializingLocation(false);
              if (status === 'OK' && results[0]) {
                const placeData = {
                  address: results[0].formatted_address,
                  coordinates: {
                    lat: latitude,
                    lng: longitude,
                  },
                  addressComponents: parseAddressComponents(results[0].address_components),
                };
                setCurrentLocation(placeData);
              } else {
                alert('Could not find address for this location');
              }
            }
          );
        } catch (error) {
          setLoading(false);
          setInitializingLocation(false);
          alert('Error getting location details: ' + error.message);
        }
      },
      (error) => {
        setLoading(false);
        setInitializingLocation(false);
        alert('Error getting location: ' + error.message);
      }
    );
  };

  // Initial location fetch on mount
  useEffect(() => {
    if (isLoaded) {
      getCurrentLocation();
    }
  }, [isLoaded]);

  // Autocomplete initialization effect
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current || initializingLocation) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['establishment', 'geocode'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();

        if (!place.geometry) {
          console.log('No geometry for this place');
          return;
        }

        const placeData = {
          address: place.formatted_address,
          name: place.name,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          addressComponents: parseAddressComponents(place.address_components),
        };

        setSelectedPlace(placeData);
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, setSelectedPlace, initializingLocation]);

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={
              initializingLocation
                ? "Getting your location..."
                : isLoaded
                  ? "Search for destination..."
                  : "Loading..."
            }
            className="pl-9"
            disabled={!isLoaded || loading || initializingLocation}
          />
        </div>
        <Button
          variant="outline"
          onClick={getCurrentLocation}
          disabled={loading || !isLoaded || initializingLocation}
          className="shrink-0"
        >
          <Navigation className={`h-5 w-5 ${(loading || initializingLocation) ? 'animate-spin' : ''}`} />
        </Button>
      </div>



      {/* Show selected destination info */}
      {selectedPlace && (
        <div className="p-4 text-sm border rounded-lg bg-white space-y-2 dark:bg-gray-900 dark:text-white">
          <div>
            <h3 className="font-medium">Destination</h3>
            <p className="text-gray-600 dark:text-gray-300">{selectedPlace.address}</p>
          </div>
          {selectedPlace.coordinates && (
            <div>
              <h3 className="font-medium">Coordinates</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Lat: {selectedPlace.coordinates.lat.toFixed(6)}
                <br />
                Lng: {selectedPlace.coordinates.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;