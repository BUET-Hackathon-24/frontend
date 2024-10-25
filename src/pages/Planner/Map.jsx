import { Button } from '@/components/ui/button';
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  TransitLayer,
  useJsApiLoader
} from '@react-google-maps/api';
import { useAtom } from 'jotai';
import { Navigation } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { MyLocAtom } from './store';

const defaultCenter = { lat: 48.8584, lng: 2.2945 };

const GoogleMapsDirections = () => {
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useAtom(MyLocAtom);
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBU2YHegoW7ISCBBBfTVKWV4JUwmsSJyik',
    libraries: ['places'],
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

  const getCurrentLocation = useCallback(() => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setLoading(false);
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

                // Center the map on the current location
                if (map) {
                  map.panTo({ lat: latitude, lng: longitude });
                  map.setZoom(15);
                }
              } else {
                alert('Could not find address for this location');
              }
            }
          );
        } catch (error) {
          setLoading(false);
          alert('Error getting location details');
        }
      },
      (error) => {
        setLoading(false);
        alert('Error getting location: ' + error.message);
      }
    );
  }, [map]);

  useEffect(() => {
    // Get current location when the map is loaded
    if (isLoaded && map) {
      getCurrentLocation();
    }
  }, [isLoaded, map, getCurrentLocation]);

  async function calculateRoute(src, dest) {
    if (!src || !dest) return;

    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: src,
        destination: dest,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
    } catch (error) {
      alert('Error calculating route: ' + error.message);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-[50svw] flex-col items-center">
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="outline"
          onClick={getCurrentLocation}
          disabled={loading}
          className="bg-white"
        >
          <Navigation className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="absolute left-0 top-0 h-full w-full">
        <GoogleMap
          center={currentLocation?.coordinates || defaultCenter}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
          onLoad={setMap}
        >
          <TransitLayer />
          {currentLocation && (
            <Marker
              position={currentLocation.coordinates}
              title="Current Location"
            />
          )}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapsDirections;