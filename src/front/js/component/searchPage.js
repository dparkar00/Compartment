import React, { useState } from "react";
import MapComponent from "./map";
import HomeSearch from "./homeSearch";
import ApartmentList from "./apartmentList";

export const SearchPage = () => {
  const [mapData, setMapData] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    if (results && results.apartments) {
      const newMapData = results.apartments.map(apt => ({
        latitude: apt.latitude,
        longitude: apt.longitude,
        address: apt.address,
        price: apt.price,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        living_area: apt.livingArea,
        image_url: apt.image_url
      }));
      console.log("Map Data:", newMapData); // Log the map data
      setMapData(newMapData);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <h1>Apartment Map</h1>
          <MapComponent searchResults={mapData} />
        </div>
        <div className="col-md-4">
          <HomeSearch onSearchResults={handleSearchResults} />
        </div>
      </div>
      {searchResults && (
        <div className="row mt-4">
          <div className="col-12">
            <h2>Search Results</h2>
            <ApartmentList apartments={searchResults.apartments} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;