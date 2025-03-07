import { Button } from '@/components/ui/button';
import {
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  Marker,
  TransitLayer,
  useJsApiLoader
} from '@react-google-maps/api';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import { Camera, MapPin, Navigation, Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DestLocAtom, MyLocAtom, TicksAtom } from './store';

const defaultCenter = { lat: 23.8103, lng: 90.4125 }; // Default to Dhaka

const GoogleMapsDirections = () => {
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useAtom(MyLocAtom);
  const [destLoc, setDestLoc] = useAtom(DestLocAtom);
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const ticks = useAtomValue(TicksAtom)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBU2YHegoW7ISCBBBfTVKWV4JUwmsSJyik',
    libraries: ['places'],
  });

  // Watch for system dark mode changes
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  // Map options
  const mapOptions = useMemo(() => {
    if (!isLoaded || !window.google?.maps) return {};

    return {
      zoomControl: true,
      streetViewControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
      styles: isDarkMode ? [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
      ] : [],
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      streetViewControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_TOP
      },
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_TOP
      },
    };
  }, [isLoaded, isDarkMode]);

  // Marker icons
  const markerIcons = useMemo(() => {
    if (!isLoaded || !window.google?.maps) return {};

    return {
      current: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new window.google.maps.Size(40, 40),
      },
      attraction: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(32, 32),
      }
    };
  }, [isLoaded]);

  const parseAddressComponents = useCallback((components) => {
    const parsed = {};
    components?.forEach((component) => {
      component.types.forEach((type) => {
        parsed[type] = component.long_name;
      });
    });
    return parsed;
  }, []);

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

          if (!window.google?.maps?.Geocoder) {
            throw new Error('Google Maps Geocoder not loaded');
          }

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
          alert('Error getting location details: ' + error.message);
        }
      },
      (error) => {
        setLoading(false);
        alert('Error getting location: ' + error.message);
      }
    );
  }, [map, setCurrentLocation, parseAddressComponents]);

  // Handle tourist attractions updates
  useEffect(() => {
    const handleUpdateMarkers = (event) => {
      setAttractions(event.detail);
    };

    window.addEventListener('updateMapMarkers', handleUpdateMarkers);
    return () => {
      window.removeEventListener('updateMapMarkers', handleUpdateMarkers);
    };
  }, []);

  const calculateRoute = useCallback(async () => {
    if (!currentLocation?.address || !destLoc?.address || !window.google?.maps?.DirectionsService) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin: currentLocation.address,
        destination: destLoc.address,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Could not calculate route: ' + error.message);
    }
  }, [currentLocation?.address, destLoc?.address]);

  useEffect(() => {
    if (currentLocation?.address && destLoc?.address) {
      calculateRoute();
    }
  }, [currentLocation?.address, destLoc?.address, calculateRoute]);

  if (!isLoaded) {
    return (
      <motion.div
        className="relative h-screen w-[50svw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 flex flex-col items-center">
              <MapPin className="h-12 w-12 mb-4 animate-bounce" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  function getLatLng(address) {

    console.log(address)
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': address }, function(results, status) {
      if (status === 'OK') {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
       return { lat, lng };
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }


  return (
    <motion.div
      className="relative h-screen w-[50svw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="outline"
          onClick={getCurrentLocation}
          disabled={loading}
          className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-md"
        >
          <Navigation className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="absolute inset-0">
        <GoogleMap
          center={currentLocation?.coordinates || defaultCenter}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={mapOptions}
          onLoad={setMap}
        >
          <TransitLayer />

          {currentLocation?.coordinates && isLoaded && window.google?.maps && (
            <Marker
              position={currentLocation.coordinates}
              icon={markerIcons.current}
              animation={window.google.maps.Animation.DROP}
              title="Current Location"
            />
          )}

          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{


                polylineOptions: {
                  strokeColor: isDarkMode ? "#4CAF50" : "#2196F3",
                  strokeWeight: 4,
                }
              }}
            />
          )}


          <Marker position={destLoc.coordinates} icon={markerIcons.current} animation={window.google.maps.Animation.DROP} title="Destination" />
          <AnimatePresence>
            {attractions.map((attraction, index) => (
              <Marker
                key={`${attraction.name}-${index}`}
                position={{
                  lat: parseFloat(currentLocation?.coordinates?.lat || 0) + (Math.random() - 0.5) * 0.01,
                  lng: parseFloat(currentLocation?.coordinates?.lng || 0) + (Math.random() - 0.5) * 0.01
                }}
                icon={markerIcons.attraction}
                animation={window.google?.maps?.Animation?.DROP}
                onClick={() => setSelectedAttraction(attraction)}
              />
            ))}

            {ticks.map((tick, i)=> (
                <Marker key={i} position={getLatLng(tick)} animation={window.google?.maps?.Animation?.BOUNCE}  />
              ))}
          </AnimatePresence>

          {selectedAttraction && currentLocation?.coordinates && (
            <InfoWindow
              position={{
                lat: parseFloat(currentLocation.coordinates.lat) + (Math.random() - 0.5) * 0.01,
                lng: parseFloat(currentLocation.coordinates.lng) + (Math.random() - 0.5) * 0.01
              }}
              onCloseClick={() => setSelectedAttraction(null)}
            >
              <div className="p-3 max-w-xs">
                <h3 className="font-semibold text-lg mb-2">{selectedAttraction.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedAttraction.address}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm ml-1">{selectedAttraction.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span className="text-sm ml-1">Tourist Spot</span>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </motion.div>
  );
};

export default GoogleMapsDirections;