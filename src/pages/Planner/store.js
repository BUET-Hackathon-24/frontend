import { atom } from 'jotai';

export const MyLocAtom = atom({
  address: "Dhaka",
  coordinates: {
    lat: 23.8103,
    lng: 90.4125
  }
})
export const DestLocAtom = atom({
  address: "Dhaka",
  coordinates: {
    lat: 23.8103,
    lng: 90.4125
  }
})


export const TicksAtom = atom([]);