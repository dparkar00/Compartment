import React, { useEffect, useState, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Context } from '../store/appContext';
import { PropertyListing } from './propertyListing';
import MapSearchBar from './mapSearchBar';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

const MapComponent = ({ searchResults }) => {
  const { actions } = useContext(Context);
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [error, setError] = useState(null);
  const [propertyCategories, setPropertyCategories] = useState(['Favorites', 'To Visit']);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      console.log("Search results received:", searchResults);
      setApartments(searchResults);
      setCenter({
        lat: Number(searchResults[0].latitude),
        lng: Number(searchResults[0].longitude)
      });
    }
  }, [searchResults]);

  const handleSaveToCategory = (property, category) => {
    console.log(`Saving property to category: ${category}`);
  };

  const handleAddCategory = (newCategory) => {
    setPropertyCategories([...propertyCategories, newCategory]);
  };

  console.log("Rendering MapComponent with apartments:", apartments);

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyA78pBoItwl17q9g5pZPNUYmLuOnTDPVo8">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {apartments.map((apartment, idx) => {
            console.log("Apartment for marker:", apartment);
            const position = {
              lat: Number(apartment.latitude),
              lng: Number(apartment.longitude)
            };
            console.log("Marker position:", position);
            return (
              <Marker
                key={idx}
                position={position}
                onClick={() => {
                  console.log("Selected apartment data:", apartment);
                  setSelectedApartment(apartment);
                }}
              />
            );
          })}
          {selectedApartment && (
            <InfoWindow
              position={{
                lat: Number(selectedApartment.latitude),
                lng: Number(selectedApartment.longitude)
              }}
              onCloseClick={() => setSelectedApartment(null)}
            >
              <div>
                {console.log("InfoWindow selectedApartment:", selectedApartment)}
                <PropertyListing
                  property={selectedApartment}
                  categories={propertyCategories}
                  onSaveToCategory={handleSaveToCategory}
                  onAddCategory={handleAddCategory}
                />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default MapComponent;