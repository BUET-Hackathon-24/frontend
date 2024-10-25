import { Button } from '@/components/ui';
import { AI_API } from '@/constants';
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { DateRangePicker } from '@nextui-org/react';
import { useDateFormatter } from "@react-aria/i18n";
import { useAtomValue } from 'jotai';
import React, { useState } from 'react';
import LocationAutocomplete from './LocationAutoComplete';
import { MyLocAtom } from './store';


const Steps = () => {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const currentLocation = useAtomValue(MyLocAtom)
  const [data, setData] = useState(null)

  const [value, setValue] = React.useState({
    start: parseDate("2024-11-01"),
    end: parseDate("2024-11-08"),
  });

  let formatter = useDateFormatter({dateStyle: "long"});

  const get = async ()=> {

    try {

      const a = {
        "budget": "medium",
        "origin": currentLocation.address,
        "destination": selectedPlace.address,
        "start_date": value.start.toString(),
        "end_date": value.end.toString(),
        "dest_lat": selectedPlace.coordinates.lat + "",
        "dest_lng": selectedPlace.coordinates.lng + ""
      }


      console.log(JSON.stringify(a))


    const res = await fetch(AI_API + '/image_search/get_plan',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(a),


      })
    const data = await res.json()
    console.log(data)
    setData(data)
  } catch (error) {

  }
  }

  return (

    <div>
    <LocationAutocomplete selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
    <DateRangePicker
          label="Stay Duration"
          value={value}
          onChange={setValue}
        />
        <p className="text-default-500 text-sm">
          Selected date:{" "}
          {value
            ? formatter.formatRange(
                value.start.toDate(getLocalTimeZone()),
                value.end.toDate(getLocalTimeZone()),
              )
            : "--"}
        </p>

        <Button onClick={get}>Get Plan</Button>
      </div>

  )
}

export default Steps