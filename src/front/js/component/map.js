// src/components/MapComponent.jsx
import React, { useEffect, useState, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import {PropertyListing} from '../component/propertyListing'

import { Context } from '../store/appContext';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

export const MapComponent = () => {
  const { actions } = useContext(Context); // Ensure you have access to actions from context
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [location, setLocation] = useState('San Francisco, CA'); // Default location
  const [beds, setBeds] = useState(null);
  const [baths,setBaths] =useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchApartments() {
      try {
        const response = await fetch(process.env.BACKEND_URL+'api/apartments');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          
          setApartments(data.data.results); 

          for (let i = 0; i < apartments.length; i++) {

            if(apartments[i].description.beds == null){
              setBeds(apartments[i].description.beds_max);
            }else {
              setBeds(apartments[i].description.beds)
            }

            if(apartments[i].description.baths == null){
              setBaths(apartments[i].description.baths_max);
            }else{
              setBaths(apartments[i].description.baths);
            }
            
          }


        } 
      } catch (error) {
        setError(error);
        console.error('Error fetching apartments:', error);
      }
    }

   
    fetchApartments();
}, []);

  




  return (
    <LoadScript googleMapsApiKey="AIzaSyA78pBoItwl17q9g5pZPNUYmLuOnTDPVo8">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {apartments && apartments.map && apartments.map((apartment, idx) => (
          <Marker
            key={idx}
            position={{ lat: apartment.location.address.coordinate.lat, lng: apartment.location.address.coordinate.lon }}
            onClick={() => setSelectedApartment(apartment)}
          />
        ))}
        {selectedApartment && (
          <InfoWindow
            position={{ lat: selectedApartment.location.address.coordinate.lat, lng: selectedApartment.location.address.coordinate.lon }}
            onCloseClick={() => setSelectedApartment(null)}
          >
            <PropertyListing property={selectedApartment} />
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
