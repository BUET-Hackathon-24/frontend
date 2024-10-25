import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  TransitLayer,
  useJsApiLoader,
} from '@react-google-maps/api';
import { ArrowUpRight, X } from 'lucide-react';
import { useRef, useState } from 'react';

const center = { lat: 48.8584, lng: 2.2945 }

const GoogleMapsDirections = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBU2YHegoW7ISCBBBfTVKWV4JUwmsSJyik',
    libraries: ['places'],
  })

  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  const originRef = useRef()
  const destinationRef = useRef()

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
      </div>
    )
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
    const directionsService = new google.maps.DirectionsService()
    console.log(originRef.current.value, destinationRef.current.value)
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    })

    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  return (
    <div className="relative flex h-screen w-screen flex-col items-center">
      <div className="absolute left-0 top-0 h-full w-full">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '50%', height: '80%' }}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
          onLoad={(map) => setMap(map)}
        >
          <TransitLayer onLoad={() => {}} />
          <Marker position={center} />s
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>

      <Card className="m-4 min-w-[768px] z-10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Autocomplete>
                <Input type="text" placeholder="Origin" ref={originRef} className="w-full" />
              </Autocomplete>
            </div>
            <div className="flex-grow">
              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Destination"
                  ref={destinationRef}
                  className="w-full"
                />
              </Autocomplete>
            </div>
            <div className="flex space-x-2">
              <Button onClick={calculateRoute} className="bg-pink-600 hover:bg-pink-700">
                Calculate Route
              </Button>
              <Button size="icon" variant="outline" onClick={clearRoute}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Distance: {distance}</p>
            <p className="text-sm text-gray-600">Duration: {duration}</p>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                map.panTo(center)
                map.setZoom(15)
              }}
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GoogleMapsDirections
