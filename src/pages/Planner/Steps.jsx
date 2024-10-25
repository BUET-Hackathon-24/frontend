import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AI_API } from '@/constants';
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { DateRangePicker } from '@nextui-org/react';
import { useDateFormatter } from "@react-aria/i18n";
import { AnimatePresence, motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { Calendar, MapPin, Plane, X } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LocationAutocomplete from './LocationAutoComplete';
import { MyLocAtom } from './store';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

const Steps = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useAtom(MyLocAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = React.useState({
    start: parseDate("2024-11-01"),
    end: parseDate("2024-11-08"),
  });

  let formatter = useDateFormatter({ dateStyle: "long" });

  const get = async () => {
    if (!currentLocation || !selectedPlace || !value) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        "budget": "medium",
        "origin": currentLocation.address,
        "destination": selectedPlace.address,
        "start_date": value.start.toString(),
        "end_date": value.end.toString(),
        "dest_lat": selectedPlace.coordinates.lat + "",
        "dest_lng": selectedPlace.coordinates.lng + ""
      };

      const res = await fetch(AI_API + '/image_search/get_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      setData(responseData);

      // Parse tourist attractions and update map markers
      if (responseData.tourist_attraction) {
        const attractions = parseTouristAttractions(responseData.tourist_attraction);
        // Emit event to update map markers
        window.dispatchEvent(new CustomEvent('updateMapMarkers', {
          detail: attractions
        }));
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
      alert('Error getting travel plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseTouristAttractions = (data) => {
    const attractions = [];
    const lines = data.split('\n');
    let currentAttraction = {};

    lines.forEach(line => {
      if (line.startsWith('Name: ')) {
        if (Object.keys(currentAttraction).length > 0) {
          attractions.push(currentAttraction);
          currentAttraction = {};
        }
        currentAttraction.name = line.replace('Name: ', '');
      } else if (line.startsWith('Address: ')) {
        currentAttraction.address = line.replace('Address: ', '');
      } else if (line.startsWith('Distance: ')) {
        currentAttraction.distance = line.replace('Distance: ', '');
      } else if (line.startsWith('Rating: ')) {
        currentAttraction.rating = line.replace('Rating: ', '');
      }
    });

    if (Object.keys(currentAttraction).length > 0) {
      attractions.push(currentAttraction);
    }

    return attractions;
  };

  return (
    <div className="space-y-6 max-w-xl">
      <AnimatePresence mode="wait">
        {!data ? (
          <motion.div
            key="form"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Plan Your Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div variants={item} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Starting Point
                  </label>
                  <div className="p-3 bg-muted rounded-md">
                    {currentLocation ? (
                      <p className="text-sm">{currentLocation.address}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Detecting your location...</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Destination
                  </label>
                  <LocationAutocomplete
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace}
                  />
                </motion.div>

                <motion.div variants={item} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Travel Dates
                  </label>
                  <DateRangePicker
                    className="max-w-full"
                    value={value}
                    onChange={setValue}
                  />
                  {value && (
                    <p className="text-sm text-muted-foreground">
                      {formatter.formatRange(
                        value.start.toDate(getLocalTimeZone()),
                        value.end.toDate(getLocalTimeZone())
                      )}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={item}>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={get}
                    disabled={loading || !currentLocation || !selectedPlace || !value}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          ⏳
                        </motion.span>
                        Generating Plan...
                      </>
                    ) : (
                      'Get Travel Plan'
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <motion.button
              className="absolute right-4 top-4 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setData(null)}
            >
              <X className="h-6 w-6" />
            </motion.button>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="w-full my-8 overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th scope="col" className="px-6 py-3 font-medium">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-6 py-4 whitespace-nowrap border-b dark:border-gray-600">
                      {children}
                    </td>
                  ),
                  tr: ({ children }) => (
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {children}
                    </tr>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-8">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="my-4 leading-relaxed">{children}</p>
                  ),
                  img: ({src, alt}) => (
                    <img
                      src={src}
                      alt={alt}
                      className="rounded-lg shadow-md my-4 max-w-full h-auto"
                      loading="lazy"
                    />
                  ),
                }}
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none
                  prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mb-8
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:my-4 prose-p:leading-relaxed
                  prose-ul:my-6 prose-ul:list-disc prose-ul:list-inside
                  prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                "
              >
                {data.markdown}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Steps;