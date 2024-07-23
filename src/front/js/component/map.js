import React, { useEffect, useState, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Context } from '../store/appContext';
import { PropertyListing } from './propertyListing';
import MapSearchBar from './mapSearchbar';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

export const MapComponent = () => {
  const { actions } = useContext(Context);
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [error, setError] = useState(null);
  const [propertyCategories, setPropertyCategories] = useState(['Favorites', 'To Visit']);

  async function fetchCoordinates(address) {
    const response = await fetch(process.env.BACKEND_URL + `api/geocode?address=${encodeURIComponent(address)}`);
     // Check if response is OK
     if (!response.ok) {
      const errorText = await response.text(); // Read the error response as text
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
  }

  // Parse JSON response
  const data = await response.json();
  return data;
  }

  const fetchApartments = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(process.env.BACKEND_URL + `api/apartments?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setApartments(data.data.results);
    } catch (error) {
      setError(error);
      console.error('Error fetching apartments:', error);
    }
  };

  const updateApartmentCoordinates = async (apartment) => {
    const address = `${apartment.location.address.line} ${apartment.location.address.city} ${apartment.location.address.state} ${apartment.location.address.postal_code} ${apartment.location.address.country}`;
    const coordinates = await fetchCoordinates(address);
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      apartment.location.address.coordinate = {
        lat: coordinates.latitude,
        lon: coordinates.longitude,
      };
    }
  };

  useEffect(() => {
    const fetchAndSetApartments = async () => {
      await fetchApartments();
    };
    fetchAndSetApartments();
  }, []);

  useEffect(() => {
    const fetchCoordinatesForApartments = async () => {
      const updatedApartments = await Promise.all(
        apartments.map(async (apartment) => {
          if (!apartment.location.address.coordinate) {
            await updateApartmentCoordinates(apartment);
          }
          return apartment;
        })
      );
      setApartments(updatedApartments);
    };

    if (apartments.length > 0) {
      fetchCoordinatesForApartments();
    }
  }, [apartments]);

  const handleSaveToCategory = (property, category) => {
    console.log(`Saving property to category: ${category}`);
  };

  const handleAddCategory = (newCategory) => {
    setPropertyCategories([...propertyCategories, newCategory]);
  };

  const handleSearch = (filters) => {
    fetchApartments(filters);
  };

  return (
    <>
      <MapSearchBar onSearch={handleSearch} />
      <LoadScript googleMapsApiKey="AIzaSyA78pBoItwl17q9g5pZPNUYmLuOnTDPVo8">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {apartments.map((apartment, idx) => (
            apartment.location.address.coordinate && (
              <Marker
                key={idx}
                position={{ lat: apartment.location.address.coordinate.lat, lng: apartment.location.address.coordinate.lon }}
                onClick={() => setSelectedApartment(apartment)}
              />
            )
          ))}
          {selectedApartment && (
            <InfoWindow
              position={{ lat: selectedApartment.location.address.coordinate.lat, lng: selectedApartment.location.address.coordinate.lon }}
              onCloseClick={() => setSelectedApartment(null)}
            >
              <PropertyListing
                property={selectedApartment}
                categories={propertyCategories}
                onSaveToCategory={handleSaveToCategory}
                onAddCategory={handleAddCategory}
              />
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default MapComponent;
