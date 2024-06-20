// src/components/MapComponent.jsx
import React, { useEffect, useState, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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

  const fetchAptListings = async () => {
    try {
      const data = await actions.fetchApartments(location);
      return data;
    } catch (error) {
      console.error('Error fetching apartments:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAptListings();
      if (data && data.props) { // Check if data is not null and has the props key
        setApartments(data.props); // Adjust based on API response structure
      }
    };

    fetchData();
  }, [location]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyA78pBoItwl17q9g5pZPNUYmLuOnTDPVo8">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {apartments.map((apartment, idx) => (
          <Marker
            key={idx}
            position={{ lat: apartment.latitude, lng: apartment.longitude }}
            onClick={() => setSelectedApartment(apartment)}
          />
        ))}
        {selectedApartment && (
          <InfoWindow
            position={{ lat: selectedApartment.latitude, lng: selectedApartment.longitude }}
            onCloseClick={() => setSelectedApartment(null)}
          >
            <div>
              <h3>{selectedApartment.address}</h3>
              <p>{selectedApartment.price}</p>
              <p>{selectedApartment.bedrooms} beds, {selectedApartment.bathrooms} baths</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
