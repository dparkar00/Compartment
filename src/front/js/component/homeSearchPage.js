import React, { useState } from "react";
import MapComponent from "./homeMap";
import HomeSearch from "./homeSearch";
import ApartmentList from "./apartmentList";

export const HomeSearchPage = () => {
  const [mapData, setMapData] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchResults = (results) => {
    setIsLoading(false);
    setError(null);
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
      console.log("Map Data:", newMapData);
      setMapData(newMapData);
    }
  };

  const startSearch = () => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
  };

  const handleSearchError = (errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
    setSearchResults(null);
  };

  return (
    <div className="search-page">
      <div className="map-column">
        <div className="map-container map-card">
          <div className="map-title">Property Locations</div>
          <div className="map-component">
            <MapComponent searchResults={mapData} />
          </div>
        </div>
      </div>
      <div className="search-column">
        <div className="search-input">
          <HomeSearch 
            onSearchResults={handleSearchResults} 
            onStartSearch={startSearch}
            onSearchError={handleSearchError}
          />
        </div>
        <div className="search-results">
          {isLoading && <p className="loading-message">Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && searchResults && (
            <>
              <h2>Search Results</h2>
              {searchResults.apartments && searchResults.apartments.length > 0 ? (
                <ApartmentList apartments={searchResults.apartments} />
              ) : (
                <p>No apartments found. Try adjusting your search criteria.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSearchPage;